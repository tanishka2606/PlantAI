import os
import requests
import json
from dotenv import load_dotenv
from typing import Dict, Any, List, Optional
from .image_validator import validate_and_preprocess_image

load_dotenv()

KINDWISE_API_KEY = os.getenv("KINDWISE_API_KEY")
AI_API_KEY = os.getenv("AI_API_KEY") or os.getenv("GEMINI_API_KEY")
HEALTH_CONFIDENCE_THRESHOLD = float(os.getenv("HEALTH_CONFIDENCE_THRESHOLD", "0.70"))
MAX_UPLOAD_SIZE = int(os.getenv("MAX_UPLOAD_SIZE", str(10 * 1024 * 1024)))

DISCLAIMER_TEXT = "AI health analysis provides guidance only and is not a confirmed professional diagnosis."

def check_health(image_bytes: bytes, filename: str, content_type: str) -> Dict[str, Any]:
    """
    Dedicated Plant Health & Disease Diagnosis Pipeline:
    1. Validates image readability, lighting, format, and resolution.
    2. Calls real plant pathology API (Kindwise Health Assessment / Gemini Vision Pathology).
    3. Extracts real condition, symptoms, treatments, and true model confidence.
    4. Applies strict confidence threshold (HEALTH_CONFIDENCE_THRESHOLD=0.70).
    5. Returns structured response with professional medical/botanical disclaimer.
    """
    # 1. Image Pre-flight Validation
    is_valid, processed_bytes, val_error, quality_warning = validate_and_preprocess_image(
        image_bytes, filename, content_type, max_size=MAX_UPLOAD_SIZE
    )
    if not is_valid:
        return {
            "success": False,
            "status": "validation_error",
            "message": val_error or "Please upload a clear image of the plant or affected leaf.",
            "data": None
        }

    is_healthy = True
    health_confidence = 0.0
    condition_name: Optional[str] = None
    symptoms: List[str] = []
    causes: List[str] = []
    treatments: List[str] = []
    prevention: List[str] = []
    api_evaluated = False
    quota_error = False

    # 2. Call Kindwise Health Assessment API
    if KINDWISE_API_KEY:
        try:
            kw_url = "https://plant.id/api/v3/health_assessment?details=local_name,description,url,treatment,classification,common_names,cause"
            response = requests.post(
                kw_url,
                headers={"Api-Key": KINDWISE_API_KEY},
                files={"images": ("health.jpg", processed_bytes, "image/jpeg")},
                timeout=30
            )

            if response.status_code in (200, 201):
                data = response.json()
                result = data.get("result", {})
                is_healthy_obj = result.get("is_healthy", {})
                is_healthy_binary = bool(is_healthy_obj.get("binary", True))
                is_healthy_prob = float(is_healthy_obj.get("probability", 1.0))

                disease_suggestions = result.get("disease", {}).get("suggestions", [])

                if is_healthy_binary and is_healthy_prob >= 0.5:
                    is_healthy = True
                    health_confidence = is_healthy_prob
                    condition_name = None
                else:
                    is_healthy = False
                    if disease_suggestions:
                        top_disease = disease_suggestions[0]
                        condition_name = top_disease.get("name", "Unknown Plant Condition")
                        health_confidence = float(top_disease.get("probability", 0.0))
                        details = top_disease.get("details", {}) or {}

                        # Extract causes
                        if details.get("cause"):
                            causes.append(details.get("cause"))

                        # Extract treatments
                        treatment_data = details.get("treatment", {}) or {}
                        bio_treat = treatment_data.get("biological", []) or []
                        chem_treat = treatment_data.get("chemical", []) or []
                        prev_treat = treatment_data.get("prevention", []) or []

                        if bio_treat:
                            treatments.extend([f"Organic/Biological: {b}" for b in bio_treat[:2]])
                        if chem_treat:
                            treatments.extend([f"Chemical: {c}" for c in chem_treat[:2]])
                        if prev_treat:
                            prevention.extend(prev_treat[:2])
                    else:
                        health_confidence = 1.0 - is_healthy_prob
                        condition_name = "Unspecified Foliar Issue"

                api_evaluated = True
            elif response.status_code == 429:
                quota_error = True
                print("Kindwise Health API quota limit reached (429).")
        except requests.exceptions.Timeout:
            print("Kindwise Health API timed out.")
        except Exception as e:
            print("Kindwise Health API error:", e)

    # 3. If Gemini / AI API key is configured and Kindwise didn't yield confident result
    if (not api_evaluated or health_confidence < HEALTH_CONFIDENCE_THRESHOLD) and AI_API_KEY:
        try:
            import base64
            b64_img = base64.b64encode(processed_bytes).decode("utf-8")
            gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={AI_API_KEY}"
            prompt = (
                "You are an expert plant pathologist. Inspect this plant/leaf image for diseases, pests, nutrient deficiencies, or healthy status. "
                "Output ONLY a JSON object with keys: "
                "'is_healthy' (boolean), 'condition' (string or null), 'confidence' (float 0.0-1.0), "
                "'symptoms' (array of strings), 'causes' (array of strings), 'treatments' (array of strings), 'prevention' (array of strings). "
                "Be rigorous: do not guess diseases if the leaf is healthy or if image is unclear."
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
                is_healthy = bool(parsed.get("is_healthy", True))
                health_confidence = float(parsed.get("confidence", 0.0))
                condition_name = parsed.get("condition")
                symptoms = parsed.get("symptoms", []) or []
                causes = parsed.get("causes", []) or []
                treatments = parsed.get("treatments", []) or []
                prevention = parsed.get("prevention", []) or []
                api_evaluated = True
        except Exception as e:
            print("Gemini Health Vision error:", e)

    # 4. Handle Service Failure / Quota Exhaustion
    if not api_evaluated:
        if quota_error:
            return {
                "success": False,
                "status": "error",
                "message": "Plant health assessment service quota reached. Please check API key in .env.",
                "data": None
            }
        return {
            "success": False,
            "status": "uncertain",
            "data": {
                "health_status": "uncertain",
                "condition": None,
                "confidence": 0.0,
                "confidence_percent": 0.0
            },
            "message": "Unable to confidently determine the plant condition. Please upload a clearer close-up image of the affected leaf."
        }

    conf_rounded = round(health_confidence, 2)
    conf_pct = round(health_confidence * 100, 1)

    # 5. Apply Strict Confidence Threshold
    if health_confidence < HEALTH_CONFIDENCE_THRESHOLD:
        return {
            "success": False,
            "status": "uncertain",
            "data": {
                "health_status": "uncertain",
                "condition": None,
                "confidence": conf_rounded,
                "confidence_percent": conf_pct
            },
            "message": "Unable to confidently determine the plant condition. Please upload a clearer close-up image of the affected leaf."
        }

    # 6. High Confidence Healthy Plant
    if is_healthy:
        return {
            "success": True,
            "status": "analyzed",
            "data": {
                "health_status": "healthy",
                "condition": None,
                "confidence": conf_rounded,
                "confidence_percent": conf_pct,
                "disclaimer": DISCLAIMER_TEXT
            },
            "message": "The plant appears healthy."
        }

    # 7. High Confidence Possible Disease
    # Fallback recommendations if empty
    if not treatments:
        treatments = [
            "Isolate the plant to prevent spreading to neighboring plants.",
            "Prune and safely discard heavily infected foliage.",
            "Apply organic neem oil solution or an appropriate copper-based fungicide."
        ]
    if not prevention:
        prevention = [
            "Ensure proper soil drainage and avoid waterlogging roots.",
            "Water directly at the base of the plant to keep foliage dry.",
            "Maintain adequate spacing between pots for good airflow."
        ]

    return {
        "success": True,
        "status": "analyzed",
        "data": {
            "health_status": "possible_disease",
            "condition": condition_name or "Foliar Condition",
            "confidence": conf_rounded,
            "confidence_percent": conf_pct,
            "symptoms": symptoms,
            "causes": causes,
            "treatments": treatments,
            "prevention": prevention,
            "disclaimer": DISCLAIMER_TEXT
        },
        "message": "Plant health analysis completed."
    }
