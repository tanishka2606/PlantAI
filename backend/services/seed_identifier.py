import os
import io
import uuid
import requests
from typing import Dict, Any, List
from PIL import Image, ImageOps
from dotenv import load_dotenv

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
dotenv_path = os.path.join(BASE_DIR, ".env")

def get_kindwise_api_key() -> str:
    """Dynamically load and return the latest KINDWISE_API_KEY from backend/.env."""
    load_dotenv(dotenv_path, override=True)
    return (os.getenv("KINDWISE_API_KEY") or "").strip()

UPLOADS_DIR = os.path.join(BASE_DIR, "uploads")
os.makedirs(UPLOADS_DIR, exist_ok=True)

MAX_UPLOAD_SIZE = int(os.getenv("MAX_UPLOAD_SIZE", str(10 * 1024 * 1024)))

# Botanical fallback dictionary for common names if API does not return one
COMMON_SEED_NAMES = {
    "mangifera indica": "Mango",
    "malus domestica": "Apple",
    "malus pumila": "Apple",
    "citrullus lanatus": "Watermelon",
    "carica papaya": "Papaya",
    "psidium guajava": "Guava",
    "solanum lycopersicum": "Tomato",
    "capsicum annuum": "Chilli / Bell Pepper",
    "cucumis sativus": "Cucumber",
    "cucurbita pepo": "Pumpkin",
    "cucurbita": "Pumpkin",
    "zea mays": "Maize / Corn",
    "arachis hypogaea": "Peanut",
    "phaseolus vulgaris": "Common Bean",
    "pisum sativum": "Pea",
    "pisum sativum l": "Pea",
    "helianthus annuus": "Sunflower",
    "citrus limon": "Lemon",
    "citrus sinensis": "Orange",
    "punica granatum": "Pomegranate",
    "musa": "Banana",
    "solanum tuberosum": "Potato",
    "allium cepa": "Onion",
    "allium sativum": "Garlic",
    "raphanus sativus": "Radish",
    "daucus carota": "Carrot",
    "spinacia oleracea": "Spinach",
    "abelmoschus esculentus": "Okra",
    "ocimum tenuiflorum": "Tulsi / Holy Basil",
    "ocimum sanctum": "Tulsi / Holy Basil",
    "coriandrum sativum": "Coriander",
    "anacardium occidentale": "Cashew",
    "vicia villosa": "Hairy Vetch",
    "vicia sativa": "Common Vetch",
    "triticum aestivum": "Wheat",
    "oryza sativa": "Rice",
    "hordeum vulgare": "Barley",
    "avena sativa": "Oat"
}


def resolve_common_name(scientific_name: str, api_common_names: List[str]) -> str:
    """
    Chooses the best common name:
    1. Primary common name from Kindwise API if provided.
    2. Fallback to dictionary mapping.
    3. Graceful fallback to scientific name if no common name is known.
    """
    if api_common_names and len(api_common_names) > 0:
        primary = str(api_common_names[0]).strip()
        if primary:
            return primary

    if not scientific_name:
        return "Unknown Seed"

    norm = scientific_name.lower().strip()
    if norm in COMMON_SEED_NAMES:
        return COMMON_SEED_NAMES[norm]

    # Try matching first two words (genus + species) without author
    words = norm.split()
    if len(words) >= 2:
        binomial = f"{words[0]} {words[1]}"
        if binomial in COMMON_SEED_NAMES:
            return COMMON_SEED_NAMES[binomial]

    for sci_key, c_name in COMMON_SEED_NAMES.items():
        if sci_key in norm or norm in sci_key:
            return c_name

    # Graceful fallback to scientific name (never return null)
    return scientific_name.strip()


def identify_seed(
    image_bytes: bytes,
    filename: str = "seed.jpg",
    content_type: str = "image/jpeg"
) -> Dict[str, Any]:
    """
    Seed Identification via Kindwise Plant.id API:
    1. Validates uploaded image format & size.
    2. Saves archival copy in backend/uploads/.
    3. Normalizes EXIF orientation and RGB channels.
    4. Submits image to Kindwise Plant.id API v3.
    5. Logs HTTP status and raw response for debugging.
    6. Handles all error states (missing key, 401, 429, 400, 500+, timeout).
    7. Parses suggestions and extracts common name, scientific name, and confidence.
    """
    # 1. Basic validation
    if not image_bytes or len(image_bytes) == 0:
        return {
            "success": False,
            "status": "error",
            "message": "The uploaded image file is empty. Please upload a clear seed photo.",
            "data": None
        }

    if len(image_bytes) > MAX_UPLOAD_SIZE:
        max_mb = MAX_UPLOAD_SIZE // (1024 * 1024)
        return {
            "success": False,
            "status": "error",
            "message": f"Image file size exceeds the {max_mb}MB limit.",
            "data": None
        }

    # 2. Check API Key dynamically from .env
    api_key = get_kindwise_api_key()
    key_exists = bool(api_key)
    masked_key = f"{api_key[:4]}...{api_key[-4:]}" if len(api_key) >= 8 else ("***" if key_exists else "NONE")

    print(f"[Kindwise] KINDWISE_API_KEY exists: {key_exists}")
    print(f"[Kindwise] KINDWISE_API_KEY masked: {masked_key}")

    if not api_key:
        print("[ERROR] [Kindwise] KINDWISE_API_KEY is missing from backend/.env")
        return {
            "success": False,
            "status": "missing_api_key",
            "message": "KINDWISE_API_KEY is missing from backend/.env. Please configure your Kindwise API key.",
            "data": None
        }

    # 3. Image validation with PIL
    try:
        pil_image = Image.open(io.BytesIO(image_bytes))
        pil_image.verify()
        pil_image = Image.open(io.BytesIO(image_bytes))
    except Exception as e:
        print("[ERROR] [Image] Validation error:", e)
        return {
            "success": False,
            "status": "invalid_image",
            "message": "Invalid or corrupted image file. Supported formats: JPG, JPEG, PNG, WEBP.",
            "data": None
        }

    # 4. Save archival copy to backend/uploads/
    try:
        safe_ext = os.path.splitext(filename)[1].lower()
        if safe_ext not in [".jpg", ".jpeg", ".png", ".webp"]:
            safe_ext = ".jpg"
        save_name = f"seed_{uuid.uuid4().hex[:12]}{safe_ext}"
        save_path = os.path.join(UPLOADS_DIR, save_name)
        with open(save_path, "wb") as f:
            f.write(image_bytes)
    except Exception as save_err:
        print("[WARNING] [Storage] Could not save uploaded image copy:", save_err)

    # 5. Preprocess image: EXIF orientation + convert to RGB JPEG bytes
    try:
        pil_image = ImageOps.exif_transpose(pil_image)
    except Exception:
        pass

    if pil_image.mode in ("RGBA", "LA"):
        background = Image.new("RGB", pil_image.size, (255, 255, 255))
        alpha = pil_image.split()[-1]
        background.paste(pil_image, mask=alpha)
        pil_image = background
    elif pil_image.mode != "RGB":
        pil_image = pil_image.convert("RGB")

    jpeg_buffer = io.BytesIO()
    # Limit max dimension to 2048 to keep upload fast and reliable
    max_dim = 2048
    if max(pil_image.size) > max_dim:
        pil_image.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
    pil_image.save(jpeg_buffer, format="JPEG", quality=95, optimize=True)
    processed_jpeg_bytes = jpeg_buffer.getvalue()

    # 6. Call Kindwise Plant.id API v3
    kindwise_url = "https://plant.id/api/v3/identification?details=common_names,description,image"
    headers = {"Api-Key": api_key.strip()}
    files = {"images": ("seed.jpg", processed_jpeg_bytes, "image/jpeg")}

    print(f"[Kindwise] API URL: {kindwise_url}")
    print("[Kindwise] Sending seed identification request to Kindwise Plant.id API...")

    try:
        response = requests.post(
            kindwise_url,
            headers=headers,
            files=files,
            timeout=30
        )
    except requests.exceptions.Timeout:
        print("[ERROR] [Kindwise] Request timed out after 30 seconds")
        return {
            "success": False,
            "status": "timeout",
            "message": "Kindwise API request timed out. Please check your network connection and try again.",
            "data": None
        }
    except requests.exceptions.RequestException as net_err:
        print("[ERROR] [Kindwise] Network error:", net_err)
        return {
            "success": False,
            "status": "network_error",
            "message": f"Network error communicating with Kindwise API: {str(net_err)}",
            "data": None
        }

    # Debugging output requested by user (WITHOUT printing the API key)
    print("Kindwise HTTP status:", response.status_code)
    print("Kindwise RAW RESPONSE:", response.text)

    # 7. Error handling for specific HTTP status codes
    if response.status_code in (401, 403):
        return {
            "success": False,
            "status": "auth_error",
            "message": f"Kindwise API authentication failed (HTTP {response.status_code}). Please verify your KINDWISE_API_KEY in backend/.env.",
            "data": {"api_status": response.status_code, "api_response": response.text}
        }

    if response.status_code == 429:
        return {
            "success": False,
            "status": "rate_limit",
            "message": "Kindwise API credit limit reached (HTTP 429: Insufficient credits). Your 50 free credits have been exhausted. Please generate a new free API key at plant.id and update KINDWISE_API_KEY in backend/.env.",
            "data": {"api_status": 429, "api_response": response.text}
        }

    if response.status_code == 400:
        return {
            "success": False,
            "status": "bad_request",
            "message": f"Kindwise API rejected request (HTTP 400): {response.text}",
            "data": {"api_status": 400, "api_response": response.text}
        }

    if response.status_code >= 500:
        return {
            "success": False,
            "status": "server_error",
            "message": f"Kindwise API server error (HTTP {response.status_code}). Please try again shortly.",
            "data": {"api_status": response.status_code, "api_response": response.text}
        }

    if response.status_code not in (200, 201):
        return {
            "success": False,
            "status": "api_error",
            "message": f"Kindwise API returned unexpected status {response.status_code}: {response.text}",
            "data": {"api_status": response.status_code, "api_response": response.text}
        }

    # 8. Parse successful response
    try:
        res_data = response.json()
    except Exception as parse_err:
        print("[ERROR] [Kindwise] JSON parse error:", parse_err)
        return {
            "success": False,
            "status": "parse_error",
            "message": f"Failed to parse Kindwise API response: {str(parse_err)}",
            "data": {"raw": response.text}
        }

    classification = res_data.get("result", {}).get("classification", {})
    suggestions = classification.get("suggestions", [])

    if not suggestions or len(suggestions) == 0:
        print("[WARNING] [Kindwise] No classification suggestions returned")
        return {
            "success": False,
            "status": "not_identified",
            "message": "Kindwise could not identify this image. Please upload a clearer close-up photograph of the seed on a plain background.",
            "data": {
                "api_response": res_data
            }
        }

    # Top prediction
    top = suggestions[0]
    scientific_name = top.get("name", "Unknown")
    details = top.get("details", {}) or {}
    api_common_names = details.get("common_names") or details.get("commonNames") or []
    common_name = resolve_common_name(scientific_name, api_common_names)

    confidence = float(top.get("probability", 0.0))
    confidence_percent = round(confidence * 100, 1)

    # Top candidates list
    candidates = []
    for sug in suggestions[:5]:
        s_sci = sug.get("name", "Unknown")
        s_det = sug.get("details", {}) or {}
        s_cnames = s_det.get("common_names") or s_det.get("commonNames") or []
        s_com = resolve_common_name(s_sci, s_cnames)
        s_prob = float(sug.get("probability", 0.0))
        candidates.append({
            "scientific_name": s_sci,
            "common_name": s_com,
            "confidence": round(s_prob, 4),
            "confidence_percent": round(s_prob * 100, 1)
        })

    print(f"[SUCCESS] [Kindwise] Seed Identified: {common_name} ({scientific_name}) - {confidence_percent}%")

    result_data = {
        "seed_name": common_name,
        "scientific_name": scientific_name,
        "common_name": common_name,
        "confidence": round(confidence, 4),
        "confidence_percent": confidence_percent,
        "candidates": candidates
    }

    return {
        "success": True,
        "status": "identified",
        "message": "Seed identified successfully using Kindwise!",
        "seed_name": common_name,
        "scientific_name": scientific_name,
        "common_name": common_name,
        "confidence": round(confidence, 4),
        "confidence_percent": confidence_percent,
        "candidates": candidates,
        "data": result_data
    }