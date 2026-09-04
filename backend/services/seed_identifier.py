import os
import requests
import base64
import json
from dotenv import load_dotenv
from typing import Dict, Any, List, Optional
from .image_validator import validate_and_preprocess_image

load_dotenv()

PLANTNET_API_KEY = os.getenv("PLANTNET_API_KEY")
KINDWISE_API_KEY = os.getenv("KINDWISE_API_KEY")
AI_API_KEY = os.getenv("AI_API_KEY") or os.getenv("GEMINI_API_KEY")

SEED_CONFIDENCE_THRESHOLD = float(os.getenv("SEED_CONFIDENCE_THRESHOLD", "0.50"))
MAX_UPLOAD_SIZE = int(os.getenv("MAX_UPLOAD_SIZE", str(10 * 1024 * 1024)))

def identify_seed(image_bytes: bytes, filename: str, content_type: str) -> Dict[str, Any]:
    """
    Dedicated botanical seed identification pipeline:
    1. Pre-flight image validation and preprocessing (checks darkness, blur, empty upload).
    2. Primary: Pl@ntNet API using organ='fruit' (botanically classifies seeds, grains, and pods).
    3. Secondary: Kindwise Plant.id API (handles quota/credits gracefully).
    4. Tertiary: Gemini Vision API (if AI_API_KEY is configured).
    5. Evaluates confidence against SEED_CONFIDENCE_THRESHOLD.
    6. Strictly adheres to Rule 21: IDENTIFICATION ONLY (no care/germination advice).
    """
    # 1. Validation & Preprocessing
    is_valid, processed_bytes, val_error, quality_warning = validate_and_preprocess_image(
        image_bytes, filename, content_type, max_size=MAX_UPLOAD_SIZE
    )
    if not is_valid:
        return {
            "success": False,
            "status": "validation_error",
            "message": val_error or "Please upload a clear close-up image of a seed or grain.",
            "data": None
        }

    best_match: Optional[Dict[str, Any]] = None
    candidates: List[Dict[str, Any]] = []

    # 2. Try Pl@ntNet API with organ set to 'fruit' (captures seeds, pods, and grains)
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

                    item = {
                        "scientific_name": sci_name,
                        "common_name": c_name,
                        "confidence": score,
                        "confidence_percent": round(score * 100, 1)
                    }
                    candidates.append(item)

                if candidates:
                    best_match = candidates[0]
        except Exception as e:
            print("Pl@ntNet Seed API error:", e)

    # 3. Try Kindwise Plant.id API if available and Pl@ntNet didn't reach high confidence
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
                kw_candidates = []
                for sug in kw_suggestions[:5]:
                    name = sug.get("name", "Unknown")
                    details = sug.get("details", {}) or {}
                    c_names = details.get("common_names") or details.get("commonNames") or []
                    c_name = c_names[0] if c_names else name
                    prob = float(sug.get("probability", 0.0))
                    kw_candidates.append({
                        "scientific_name": name,
                        "common_name": c_name,
                        "confidence": prob,
                        "confidence_percent": round(prob * 100, 1)
                    })

                if kw_candidates and (not best_match or kw_candidates[0]["confidence"] > best_match["confidence"]):
                    best_match = kw_candidates[0]
                    candidates = kw_candidates
            elif kindwise_response.status_code == 429:
                print("Kindwise Seed API quota reached (429).")
        except Exception as e:
            print("Kindwise Seed API error:", e)

    # 4. Try Gemini Vision if configured
    if (not best_match or best_match["confidence"] < SEED_CONFIDENCE_THRESHOLD) and AI_API_KEY:
        try:
            encoded_image = base64.b64encode(processed_bytes).decode("utf-8")
            gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={AI_API_KEY}"
            prompt = (
                "You are an expert botanical seed identification system. Inspect this seed or grain image. "
                "Output ONLY a valid JSON object with keys: "
                "'is_seed' (boolean), 'seed_name' (string or null), 'scientific_name' (string or null), 'confidence' (float between 0.0 and 1.0). "
                "Do NOT include germination or care instructions. Only identify the seed species."
            )
            payload = {
                "contents": [{
                    "parts": [
                        {"text": prompt},
                        {"inline_data": {"mime_type": "image/jpeg", "data": encoded_image}}
                    ]
                }],
                "generationConfig": {"response_mime_type": "application/json"}
            }
            resp = requests.post(gemini_url, json=payload, timeout=20)
            if resp.status_code == 200:
                raw_text = resp.json().get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                parsed = json.loads(raw_text)
                if parsed.get("is_seed") and parsed.get("seed_name"):
                    gem_conf = float(parsed.get("confidence", 0.6))
                    gem_candidate = {
                        "scientific_name": parsed.get("scientific_name") or parsed.get("seed_name"),
                        "common_name": parsed.get("seed_name"),
                        "confidence": gem_conf,
                        "confidence_percent": round(gem_conf * 100, 1)
                    }
                    if not best_match or gem_conf > best_match["confidence"]:
                        best_match = gem_candidate
                        candidates = [gem_candidate]
        except Exception as e:
            print("Gemini Seed Vision error:", e)

    # 5. If no match could be produced by any service
    if not best_match:
        return {
            "success": False,
            "status": "error",
            "message": "Seed identification service is temporarily unavailable. Please check your network or try again.",
            "data": None
        }

    confidence = best_match["confidence"]
    confidence_pct = best_match["confidence_percent"]

    result_data = {
        "seed_name": best_match["common_name"] or best_match["scientific_name"],
        "common_name": best_match["common_name"],
        "scientific_name": best_match["scientific_name"],
        "confidence": confidence,
        "confidence_percent": confidence_pct,
        "candidates": candidates
    }

    # 6. Strict Confidence Threshold Check
    if confidence < SEED_CONFIDENCE_THRESHOLD:
        return {
            "success": False,
            "status": "low_confidence",
            "message": "The image does not provide enough evidence for a reliable seed identification.",
            "data": result_data
        }

    return {
        "success": True,
        "status": "identified",
        "message": f"Seed identified as {best_match['common_name']} ({best_match['scientific_name']})",
        "data": result_data
    }