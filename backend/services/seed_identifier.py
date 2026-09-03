import os
import requests
from dotenv import load_dotenv
from typing import Dict, Any, List
from .image_validator import validate_and_preprocess_image

load_dotenv()

PLANTNET_API_KEY = os.getenv("PLANTNET_API_KEY")
KINDWISE_API_KEY = os.getenv("KINDWISE_API_KEY")
SEED_CONFIDENCE_THRESHOLD = float(os.getenv("SEED_CONFIDENCE_THRESHOLD", "0.35"))
MAX_UPLOAD_SIZE = int(os.getenv("MAX_UPLOAD_SIZE", str(10 * 1024 * 1024)))

def identify_seed(image_bytes: bytes, filename: str, content_type: str) -> Dict[str, Any]:
    """
    Dedicated seed identification pipeline:
    1. Validate image quality and clarity.
    2. Query botanical recognition using fruit/seed organ-specific classification.
    3. Aggregate and score candidates.
    4. Enforce strict seed confidence threshold.
    """
    is_valid, processed_bytes, val_error, quality_warning = validate_and_preprocess_image(
        image_bytes, filename, content_type, max_size=MAX_UPLOAD_SIZE
    )
    if not is_valid:
        return {
            "success": False,
            "status": "validation_error",
            "message": val_error or "Unable to identify the seed from this image. Please upload a clear close-up image of the seed.",
            "data": None
        }

    best_match = None
    candidates: List[Dict[str, Any]] = []

    # 1. Query Pl@ntNet with organ set to 'fruit' (botanically encapsulates seeds & pods)
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

                    candidates.append({
                        "scientific_name": sci_name,
                        "common_name": c_name,
                        "confidence": score,
                        "confidence_percent": round(score * 100, 2)
                    })

                if candidates:
                    best_match = candidates[0]
        except Exception as e:
            print("Seed Identification Pl@ntNet Request failed:", e)

    # 2. Query Kindwise as complementary/fallback service
    if (not best_match or best_match["confidence"] < SEED_CONFIDENCE_THRESHOLD) and KINDWISE_API_KEY:
        try:
            kindwise_response = requests.post(
                "https://plant.id/api/v3/identification",
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
                    c_names = details.get("commonNames") or []
                    c_name = c_names[0] if c_names else name
                    prob = float(sug.get("probability", 0.0))
                    kw_candidates.append({
                        "scientific_name": name,
                        "common_name": c_name,
                        "confidence": prob,
                        "confidence_percent": round(prob * 100, 2)
                    })

                if kw_candidates and (not best_match or kw_candidates[0]["confidence"] > best_match["confidence"]):
                    best_match = kw_candidates[0]
                    candidates = kw_candidates
        except Exception as e:
            print("Seed Identification Kindwise Request failed:", e)

    if not best_match:
        return {
            "success": False,
            "status": "error",
            "message": "Seed identification service is temporarily unavailable. Please try again.",
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

    if confidence < SEED_CONFIDENCE_THRESHOLD:
        return {
            "success": False,
            "status": "low_confidence",
            "message": "Unable to confidently identify this seed. Please upload a clear close-up image of the seed.",
            "data": result_data
        }

    return {
        "success": True,
        "status": "identified",
        "message": f"Seed identified as {best_match['common_name']} ({best_match['scientific_name']})",
        "data": result_data
    }
