import os
import requests
from dotenv import load_dotenv
from typing import Dict, Any, List
from .image_validator import validate_and_preprocess_image

load_dotenv()

KINDWISE_API_KEY = os.getenv("KINDWISE_API_KEY")
MAX_UPLOAD_SIZE = int(os.getenv("MAX_UPLOAD_SIZE", str(10 * 1024 * 1024)))

def check_health(image_bytes: bytes, filename: str, content_type: str) -> Dict[str, Any]:
    """
    Plant Health Diagnosis pipeline:
    1. Validates and preprocesses image.
    2. Calls Kindwise Health Assessment API.
    3. Formats symptoms, causes, treatments, and prevention advice.
    4. Attaches mandatory professional disclaimer.
    """
    is_valid, processed_bytes, val_error, quality_warning = validate_and_preprocess_image(
        image_bytes, filename, content_type, max_size=MAX_UPLOAD_SIZE
    )
    if not is_valid:
        return {
            "success": False,
            "status": "validation_error",
            "message": val_error or "Unable to assess plant health from this image. Please upload a clear photo of the affected plant part.",
            "data": None
        }

    if not KINDWISE_API_KEY:
        return {
            "success": False,
            "status": "error",
            "message": "Plant health assessment service is temporarily unavailable. (Missing API Key)",
            "data": None
        }

    try:
        response = requests.post(
            "https://plant.id/api/v3/health_assessment",
            headers={"Api-Key": KINDWISE_API_KEY},
            files={"images": ("health.jpg", processed_bytes, "image/jpeg")},
            timeout=30
        )

        if response.status_code not in (200, 201):
            return {
                "success": False,
                "status": "error",
                "message": "Health assessment service is temporarily unavailable. Please try again later.",
                "data": None
            }

        data = response.json()
        result = data.get("result", {})
        is_healthy_obj = result.get("is_healthy", {})
        is_healthy = bool(is_healthy_obj.get("binary", True))
        health_prob = float(is_healthy_obj.get("probability", 1.0))

        disease_suggestions = result.get("disease", {}).get("suggestions", [])

        # Check for plant identification in response
        plant_name = "Plant"
        classification_sugs = result.get("classification", {}).get("suggestions", [])
        if classification_sugs:
            c_name = classification_sugs[0].get("details", {}).get("commonNames")
            plant_name = c_name[0] if c_name else classification_sugs[0].get("name", "Plant")

        formatted_diseases = []
        all_symptoms = []
        all_causes = []
        all_treatments = []
        all_prevention = []

        if is_healthy:
            status_text = "Healthy"
            conf_pct = round(health_prob * 100, 2)
            msg = f"The {plant_name} appears healthy with no major disease detected."
        else:
            status_text = "Disease / Issue Detected"
            top_prob = disease_suggestions[0].get("probability", 0.0) if disease_suggestions else 0.5
            conf_pct = round(top_prob * 100, 2)
            msg = "Potential health issues or diseases detected."

            for d in disease_suggestions[:3]:
                name = d.get("name", "Unknown condition")
                prob = float(d.get("probability", 0.0))
                details = d.get("details", {}) or {}
                desc = details.get("description", "")
                treatment = details.get("treatment", {}) or {}

                # Biological / chemical treatments
                chem = treatment.get("chemical", [])
                bio = treatment.get("biological", [])
                prev = treatment.get("prevention", [])

                if chem:
                    all_treatments.extend([f"Chemical: {c}" for c in chem[:2]])
                if bio:
                    all_treatments.extend([f"Organic/Biological: {b}" for b in bio[:2]])
                if prev:
                    all_prevention.extend(prev[:2])

                # Common botanical symptoms
                if "fungal" in name.lower() or "spot" in name.lower():
                    all_symptoms.append("Spots or lesions on leaves, discoloration.")
                    all_causes.append("Excessive humidity, damp foliage, or poor air circulation.")
                elif "nutrient" in name.lower() or "deficiency" in name.lower():
                    all_symptoms.append("Yellowing leaves (chlorosis), stunted growth.")
                    all_causes.append("Soil nutrient depletion or improper pH inhibiting nutrient uptake.")
                elif "water" in name.lower() or "rot" in name.lower():
                    all_symptoms.append("Wilting, yellowing lower leaves, soft root stems.")
                    all_causes.append("Overwatering, poorly draining soil, or clogged drainage holes.")

                formatted_diseases.append({
                    "name": name,
                    "probability": prob,
                    "probability_percent": round(prob * 100, 2),
                    "description": desc
                })

        # Ensure sensible defaults if lists are empty
        if not all_treatments and not is_healthy:
            all_treatments = [
                "Isolate the plant to prevent spreading to other plants.",
                "Prune and safely dispose of heavily infected leaves.",
                "Apply organic neem oil spray in the evening hours."
            ]
        if not all_prevention:
            all_prevention = [
                "Ensure proper pot drainage and avoid overwatering.",
                "Water at the base of the plant to keep leaves dry.",
                "Provide adequate sunlight and good air circulation."
            ]

        # Low confidence detection
        if not is_healthy and formatted_diseases and formatted_diseases[0]["probability"] < 0.25:
            return {
                "success": False,
                "status": "low_confidence",
                "message": "Low confidence result. Please upload a clear close-up image of the affected area with good lighting.",
                "data": {
                    "plant_name": plant_name,
                    "is_healthy": is_healthy,
                    "health_status": "Low Confidence",
                    "confidence": formatted_diseases[0]["probability"],
                    "confidence_percent": formatted_diseases[0]["probability_percent"],
                    "diseases": formatted_diseases,
                    "symptoms": all_symptoms,
                    "causes": all_causes,
                    "treatments": all_treatments,
                    "prevention": all_prevention,
                    "disclaimer": "AI health analysis provides guidance only and is not a confirmed professional diagnosis."
                }
            }

        return {
            "success": True,
            "status": "assessed",
            "message": msg,
            "data": {
                "plant_name": plant_name,
                "is_healthy": is_healthy,
                "health_status": status_text,
                "disease_name": formatted_diseases[0]["name"] if formatted_diseases else None,
                "confidence": health_prob if is_healthy else (formatted_diseases[0]["probability"] if formatted_diseases else 0.5),
                "confidence_percent": conf_pct,
                "diseases": formatted_diseases,
                "symptoms": list(dict.fromkeys(all_symptoms)),
                "causes": list(dict.fromkeys(all_causes)),
                "treatments": list(dict.fromkeys(all_treatments)),
                "prevention": list(dict.fromkeys(all_prevention)),
                "disclaimer": "AI health analysis provides guidance only and is not a confirmed professional diagnosis."
            }
        }

    except Exception as e:
        print("Health check exception:", e)
        return {
            "success": False,
            "status": "error",
            "message": "Could not complete plant health assessment. Please try again.",
            "data": None
        }
