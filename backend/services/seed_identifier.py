import os
import requests
import json
from dotenv import load_dotenv
from typing import Dict, Any, List, Optional
from .image_validator import validate_and_preprocess_image

load_dotenv()

PLANTNET_API_KEY = os.getenv("PLANTNET_API_KEY")
KINDWISE_API_KEY = os.getenv("KINDWISE_API_KEY")
AI_API_KEY = os.getenv("AI_API_KEY") or os.getenv("GEMINI_API_KEY")
SEED_CONFIDENCE_THRESHOLD = float(os.getenv("SEED_CONFIDENCE_THRESHOLD", "0.70"))
MAX_UPLOAD_SIZE = int(os.getenv("MAX_UPLOAD_SIZE", str(10 * 1024 * 1024)))

def identify_seed(image_bytes: bytes, filename: str, content_type: str) -> Dict[str, Any]:
    """
    Dedicated Seed Identification Pipeline:
    1. Validates image file, format, resolution, lighting, and readability.
    2. Calls real seed/fruit botanical recognition API (Pl@ntNet fruit organ / Kindwise / Gemini).
    3. Parses real response without fabricating confidence or seed names.
    4. Applies strict confidence threshold (SEED_CONFIDENCE_THRESHOLD=0.70).
    5. Returns structured response matching specification.
    """
    # 1. Pre-flight Image Validation
    is_valid, processed_bytes, val_error, quality_warning = validate_and_preprocess_image(
        image_bytes, filename, content_type, max_size=MAX_UPLOAD_SIZE
    )
    if not is_valid:
        return {
            "success": False,
            "status": "validation_error",
            "message": val_error or "Unable to identify the seed from this image. Please upload a clear image of a single seed.",
            "data": None
        }

    best_match: Optional[Dict[str, Any]] = None
    all_candidates: List[Dict[str, Any]] = []

    # 2. Call Pl@ntNet API with organ set to 'fruit' (botanically covers seeds, grains, and pods)
    if PLANTNET_API_KEY:
        try:
            plantnet_url = "https://my-api.plantnet.org/v2/identify/all"
            response = requests.post(
                plantnet_url,
                params={
                    "api-key": PLANTNET_API_KEY,
                    "lang": "en",
                    "nb-results": 5
                },
                files={
                    "images": ("seed.jpg", processed_bytes, "image/jpeg")
                },
                data={
                    "organs": ["fruit"]
                },
                timeout=25
            )

            if response.status_code == 200:
                data = response.json()
                results = data.get("results", [])
                for res in results:
                    species_info = res.get("species", {})
                    sci_name = species_info.get("scientificNameWithoutAuthor") or species_info.get("scientificName", "Unknown")
                    common_names = species_info.get("commonNames", [])
                    c_name = common_names[0] if common_names else sci_name
                    score = float(res.get("score", 0.0))

                    candidate = {
                        "scientific_name": sci_name,
                        "common_name": c_name,
                        "confidence": score,
                        "confidence_percent": round(score * 100, 1)
                    }
                    all_candidates.append(candidate)

                if all_candidates:
                    best_match = all_candidates[0]
            elif response.status_code in (401, 403):
                print("Pl@ntNet API Auth error:", response.status_code)
            elif response.status_code == 429:
                print("Pl@ntNet API Rate limit reached.")
        except requests.exceptions.Timeout:
            print("Pl@ntNet request timed out.")
        except Exception as e:
            print("Pl@ntNet Seed API error:", e)

    # 3. Fallback / Complement with Kindwise if Pl@ntNet produced no candidates or low confidence
    if (not best_match or best_match["confidence"] < SEED_CONFIDENCE_THRESHOLD) and KINDWISE_API_KEY:
        try:
            kindwise_response = requests.post(
                "https://plant.id/api/v3/identification?details=common_names,description",
                headers={"Api-Key": KINDWISE_API_KEY},
                files={"images": ("seed.jpg", processed_bytes, "image/jpeg")},
                timeout=25
            )
            if kindwise_response.status_code in (200, 201):
                kw_data = kindwise_response.json()
                kw_suggestions = kw_data.get("result", {}).get("classification", {}).get("suggestions", [])
                for sug in kw_suggestions[:5]:
                    name = sug.get("name", "Unknown")
                    details = sug.get("details", {}) or {}
                    c_names = details.get("common_names") or details.get("commonNames") or []
                    c_name = c_names[0] if c_names else name
                    prob = float(sug.get("probability", 0.0))

                    candidate = {
                        "scientific_name": name,
                        "common_name": c_name,
                        "confidence": prob,
                        "confidence_percent": round(prob * 100, 1)
                    }
                    if not best_match or prob > best_match["confidence"]:
                        best_match = candidate
            elif kindwise_response.status_code == 429:
                print("Kindwise API limit reached (429).")
        except Exception as e:
            print("Kindwise Seed API error:", e)

    # 4. If AI_API_KEY (Gemini Vision) is configured, use it for botanical seed identification
    if (not best_match or best_match["confidence"] < SEED_CONFIDENCE_THRESHOLD) and AI_API_KEY:
        try:
            import base64
            b64_img = base64.b64encode(processed_bytes).decode("utf-8")
            gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={AI_API_KEY}"
            prompt = (
                "You are an expert botanical carpologist. Identify the seed or grain in this image. "
                "Output ONLY a JSON object with keys: "
                "'is_seed' (boolean), 'seed_name' (string), 'common_name' (string), 'scientific_name' (string), 'confidence' (float 0.0-1.0), 'explanation' (string). "
                "If not a seed or uncertain, set confidence accordingly."
            )
            payload = {
                "contents": [{
                    "parts": [
                        {"text": prompt},
                        {"inline_data": {"mime_type": "image/jpeg", "data": b64_img}}
                    ]
                }],
                "generationConfig": {"response_mime_type": "application/json"}
            }
            resp = requests.post(gemini_url, json=payload, timeout=20)
            if resp.status_code == 200:
                raw_json = resp.json().get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                parsed = json.loads(raw_json)
                if parsed.get("is_seed"):
                    ai_cand = {
                        "scientific_name": parsed.get("scientific_name", "Unknown"),
                        "common_name": parsed.get("common_name") or parsed.get("seed_name", "Unknown"),
                        "confidence": float(parsed.get("confidence", 0.0)),
                        "confidence_percent": round(float(parsed.get("confidence", 0.0)) * 100, 1),
                        "explanation": parsed.get("explanation", "")
                    }
                    if not best_match or ai_cand["confidence"] > best_match["confidence"]:
                        best_match = ai_cand
        except Exception as e:
            print("Gemini Seed Vision error:", e)

    # 5. Handle No Matches / API Failures
    if not best_match:
        return {
            "success": False,
            "status": "uncertain",
            "data": {
                "confidence": 0.0,
                "confidence_percent": 0.0
            },
            "message": "Unable to confidently identify this seed. Please upload a clear image of a single seed."
        }

    raw_conf = best_match["confidence"]
    conf_pct = round(raw_conf * 100, 1)

    # 6. Apply Strict Confidence Threshold
    if raw_conf < SEED_CONFIDENCE_THRESHOLD:
        return {
            "success": False,
            "status": "uncertain",
            "data": {
                "confidence": round(raw_conf, 2),
                "confidence_percent": conf_pct,
                "candidate_name": best_match.get("common_name") or best_match.get("scientific_name")
            },
            "message": "Seed identification is uncertain. Please upload a clearer image showing the seed from a closer angle."
        }

    # 7. High Confidence Result
    common_val = best_match.get("common_name")
    sci_val = best_match.get("scientific_name")
    seed_title = common_val if common_val else sci_val

    return {
        "success": True,
        "status": "identified",
        "data": {
            "seed_name": seed_title,
            "common_name": common_val,
            "scientific_name": sci_val,
            "confidence": round(raw_conf, 2),
            "confidence_percent": conf_pct,
            "explanation": best_match.get("explanation") or f"Identified as {seed_title} ({sci_val}) seeds based on seed coat morphology."
        },
        "message": "Seed identified successfully."
    }
