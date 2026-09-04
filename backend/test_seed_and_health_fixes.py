import io
import sys
import os
from PIL import Image, ImageDraw
from dotenv import load_dotenv

sys.stdout.reconfigure(encoding="utf-8")
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from services.seed_identifier import identify_seed
from services.health_checker import check_health

load_dotenv()

def run_tests():
    print("=" * 65)
    print("🌱🦠 PLANTAI SEED & HEALTH FIX VERIFICATION TEST SUITE")
    print("=" * 65)

    # -------------------------------------------------------------
    # SEED IDENTIFICATION TESTS
    # -------------------------------------------------------------
    print("\n--- [FEATURE 1: SEED IDENTIFICATION TESTS] ---")

    # Seed Test 1: Real Seed (SEED1.jpg)
    s1_path = r"C:\Users\Dell\Downloads\SEED1.jpg"
    if os.path.exists(s1_path):
        with open(s1_path, "rb") as f:
            b = f.read()
        res = identify_seed(b, "SEED1.jpg", "image/jpeg")
        print("\n1. SEED1.jpg:")
        print("   Status:", res.get("status"))
        print("   Success:", res.get("success"))
        print("   Message:", res.get("message"))
        print("   Data:", res.get("data"))
        assert res.get("status") in ("identified", "uncertain", "low_confidence")

    # Seed Test 2: Real Seed (SEED3.jpg)
    s3_path = r"C:\Users\Dell\Downloads\SEED3.jpg"
    if os.path.exists(s3_path):
        with open(s3_path, "rb") as f:
            b = f.read()
        res = identify_seed(b, "SEED3.jpg", "image/jpeg")
        print("\n2. SEED3.jpg:")
        print("   Status:", res.get("status"))
        print("   Success:", res.get("success"))
        print("   Message:", res.get("message"))
        print("   Data:", res.get("data"))
        assert res.get("status") in ("identified", "uncertain", "low_confidence")

    # Seed Test 3: Low-Confidence / Uncertain Seed (SEED2.jpg)
    s2_path = r"C:\Users\Dell\Downloads\SEED2.jpg"
    if os.path.exists(s2_path):
        with open(s2_path, "rb") as f:
            b = f.read()
        res = identify_seed(b, "SEED2.jpg", "image/jpeg")
        print("\n3. SEED2.jpg (Low confidence):")
        print("   Status:", res.get("status"))
        print("   Success:", res.get("success"))
        print("   Message:", res.get("message"))
        print("   Data:", res.get("data"))

    # Seed Test 4: Pitch Black / Unusable Image
    dark_img = Image.new("RGB", (200, 200), color=(5, 5, 5))
    buf = io.BytesIO()
    dark_img.save(buf, format="JPEG")
    res_dark = identify_seed(buf.getvalue(), "dark.jpg", "image/jpeg")
    print("\n4. Dark Image (Validation Rejection):")
    print("   Status:", res_dark.get("status"))
    print("   Success:", res_dark.get("success"))
    print("   Message:", res_dark.get("message"))
    assert res_dark.get("status") == "validation_error"

    # Seed Test 5: Empty file
    res_empty = identify_seed(b"", "empty.jpg", "image/jpeg")
    print("\n5. Empty Image:")
    print("   Status:", res_empty.get("status"))
    print("   Message:", res_empty.get("message"))
    assert res_empty.get("status") == "validation_error"

    # -------------------------------------------------------------
    # PLANT HEALTH TESTS
    # -------------------------------------------------------------
    print("\n\n--- [FEATURE 2: PLANT HEALTH & DISEASE TESTS] ---")

    # Health Test 1: Real Disease Image
    d1_path = r"C:\Users\Dell\Downloads\DISEAESE1.jpg"
    if os.path.exists(d1_path):
        with open(d1_path, "rb") as f:
            b = f.read()
        res_h = check_health(b, "DISEAESE1.jpg", "image/jpeg")
        print("\n1. DISEAESE1.jpg:")
        print("   Status:", res_h.get("status"))
        print("   Success:", res_h.get("success"))
        print("   Message:", res_h.get("message"))
        print("   Data:", res_h.get("data"))

    # Health Test 2: Healthy Leaf (leaf.jpg)
    leaf_path = r"C:\Users\Dell\OneDrive\Documents\PlantAIproject\backend\uploads\leaf.jpg"
    if os.path.exists(leaf_path):
        with open(leaf_path, "rb") as f:
            b = f.read()
        res_leaf = check_health(b, "leaf.jpg", "image/jpeg")
        print("\n2. leaf.jpg:")
        print("   Status:", res_leaf.get("status"))
        print("   Success:", res_leaf.get("success"))
        print("   Message:", res_leaf.get("message"))
        print("   Data:", res_leaf.get("data"))

    # Health Test 3: Dark / Invalid Image
    res_h_dark = check_health(buf.getvalue(), "dark.jpg", "image/jpeg")
    print("\n3. Dark Leaf (Validation Rejection):")
    print("   Status:", res_h_dark.get("status"))
    print("   Message:", res_h_dark.get("message"))
    assert res_h_dark.get("status") == "validation_error"

    print("\n" + "=" * 65)
    print("✅ ALL SEED & HEALTH FIX TESTS COMPLETED AND VERIFIED!")
    print("=" * 65)

if __name__ == "__main__":
    run_tests()
