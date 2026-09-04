import os
import requests
from dotenv import load_dotenv
from typing import Dict, Any, List
from .image_validator import validate_and_preprocess_image

load_dotenv()

PLANTNET_API_KEY = os.getenv("PLANTNET_API_KEY")
KINDWISE_API_KEY = os.getenv("KINDWISE_API_KEY")
CONFIDENCE_THRESHOLD = float(os.getenv("IDENTIFICATION_CONFIDENCE_THRESHOLD", "0.50"))
MAX_UPLOAD_SIZE = int(os.getenv("MAX_UPLOAD_SIZE", str(10 * 1024 * 1024)))

def identify_plant(image_bytes: bytes, filename: str, content_type: str) -> Dict[str, Any]:
    """
    Accuracy-first plant identification pipeline:
    1. Validation & Preprocessing (orientation, lighting, resolution)
    2. Primary Identification via Pl@ntNet API
    3. Secondary / Fallback via Kindwise API
    4. Structured candidate extraction
    5. Strict confidence evaluation against threshold
    """
    # 1. Validation & Preprocessing
    is_valid, processed_bytes, val_error, quality_warning = validate_and_preprocess_image(
        image_bytes, filename, content_type, max_size=MAX_UPLOAD_SIZE
    )
    if not is_valid:
        return {
            "success": False,
            "status": "validation_error",
            "message": val_error or "Invalid image file.",
            "data": None
        }

    best_match = None
    candidates: List[Dict[str, Any]] = []

    # 2. Try Pl@ntNet API first
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
                    "images": ("plant.jpg", processed_bytes, "image/jpeg")
                },
                data={
                    "organs": ["auto"]
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
                    genus_info = species_info.get("genus", {}).get("scientificNameWithoutAuthor", "")
                    family_info = species_info.get("family", {}).get("scientificNameWithoutAuthor", "")

                    item = {
                        "scientific_name": sci_name,
                        "common_name": c_name,
                        "genus": genus_info,
                        "family": family_info,
                        "confidence": score,
                        "confidence_percent": round(score * 100, 2)
                    }
                    candidates.append(item)

                if candidates:
                    best_match = candidates[0]
        except Exception as e:
            print("Pl@ntNet API Request failed:", e)

    # 3. Fallback / Complement with Kindwise Plant.id if needed
    if (not best_match or best_match["confidence"] < CONFIDENCE_THRESHOLD) and KINDWISE_API_KEY:
        try:
            kindwise_response = requests.post(
                "https://plant.id/api/v3/identification",
                headers={"Api-Key": KINDWISE_API_KEY},
                files={"images": ("plant.jpg", processed_bytes, "image/jpeg")},
                timeout=25
            )
            if kindwise_response.status_code in (200, 201):
                kw_data = kindwise_response.json()
                kw_suggestions = kw_data.get("result", {}).get("classification", {}).get("suggestions", [])
                kw_candidates = []
                for sug in kw_suggestions[:5]:
                    name = sug.get("name", "Unknown")
                    details = sug.get("details", {}) or {}
                    c_names = details.get("commonNames") or []
                    c_name = c_names[0] if c_names else name
                    prob = float(sug.get("probability", 0.0))
                    kw_candidates.append({
                        "scientific_name": name,
                        "common_name": c_name,
                        "genus": name.split()[0] if " " in name else name,
                        "family": "",
                        "confidence": prob,
                        "confidence_percent": round(prob * 100, 2)
                    })

                # If Kindwise gave a better confidence score, use it
                if kw_candidates and (not best_match or kw_candidates[0]["confidence"] > best_match["confidence"]):
                    best_match = kw_candidates[0]
                    candidates = kw_candidates
        except Exception as e:
            print("Kindwise API Request failed:", e)

    # 4. Fallback to Gemini Vision if configured
    AI_API_KEY = os.getenv("AI_API_KEY") or os.getenv("GEMINI_API_KEY")
    if (not best_match or best_match["confidence"] < CONFIDENCE_THRESHOLD) and AI_API_KEY:
        try:
            import base64
            import json
            encoded_image = base64.b64encode(processed_bytes).decode("utf-8")
            gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={AI_API_KEY}"
            prompt = (
                "You are an expert botanical identification system. Inspect this plant image. "
                "Output ONLY a valid JSON object with keys: "
                "'scientific_name' (string), 'common_name' (string), 'genus' (string), 'family' (string), 'confidence' (float 0.0-1.0)."
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
                sci_name = parsed.get("scientific_name")
                if sci_name:
                    gem_conf = float(parsed.get("confidence", 0.75))
                    gem_item = {
                        "scientific_name": sci_name,
                        "common_name": parsed.get("common_name", sci_name),
                        "genus": parsed.get("genus", sci_name.split()[0] if " " in sci_name else sci_name),
                        "family": parsed.get("family", ""),
                        "confidence": gem_conf,
                        "confidence_percent": round(gem_conf * 100, 2)
                    }
                    if not best_match or gem_conf > best_match["confidence"]:
                        best_match = gem_item
                        candidates = [gem_item]
        except Exception as e:
            print("Gemini Plant Vision error:", e)

    # 4. Check if any matches were returned
    if not best_match:
        return {
            "success": False,
            "status": "error",
            "message": "Plant identification service is temporarily unavailable. Please try again later.",
            "data": None
        }

    # 5. Evaluate Confidence against Threshold
    confidence = best_match["confidence"]
    confidence_pct = best_match["confidence_percent"]

    result_data = {
        "plant_name": best_match["scientific_name"],
        "common_name": best_match["common_name"],
        "scientific_name": best_match["scientific_name"],
        "species": best_match["scientific_name"],
        "genus": best_match.get("genus", ""),
        "family": best_match.get("family", ""),
        "confidence": confidence,
        "confidence_percent": confidence_pct,
        "candidates": candidates,
        "image_quality": quality_warning or "Good"
    }

    if confidence < CONFIDENCE_THRESHOLD:
        return {
            "success": False,
            "status": "low_confidence",
            "message": "Unable to confidently identify this image. Please upload a clear image showing the complete plant or important identifying features.",
            "data": result_data
        }

    return {
        "success": True,
        "status": "identified",
        "message": f"Identified as {best_match['common_name']} ({best_match['scientific_name']})",
        "data": result_data
    }
