import re
import os
import requests
from typing import Dict, Any, Optional
from sqlalchemy.orm import Session
from models import PlantCare

AI_API_KEY = os.getenv("AI_API_KEY")

def ask_assistant(question: str, plant_name: str, db: Session) -> Dict[str, Any]:
    """
    AI Plant Assistant Service:
    Provides context-aware botanical advice leveraging MySQL care data and AI.
    """
    q = question.strip()
    p_name = (plant_name or "").strip()

    if not q:
        return {
            "success": False,
            "status": "error",
            "message": "Question cannot be empty.",
            "answer": "Please ask a question about plant care, watering, sunlight, soil, fertilizers, or troubleshooting.",
            "plant_name": p_name,
            "suggestions": ["How often should I water?", "What kind of sunlight does it need?", "Why are the leaves yellow?"]
        }

    # Fetch care record from database if plant_name is available
    care_record = None
    if p_name:
        search_clean = p_name.lower().strip()
        care_record = db.query(PlantCare).filter(
            (PlantCare.plant_name.ilike(f"%{search_clean}%")) |
            (PlantCare.common_name.ilike(f"%{search_clean}%"))
        ).first()

    # If AI_API_KEY is available (e.g. Gemini or OpenAI), we can optionally query it
    if AI_API_KEY:
        try:
            # Check if it looks like Gemini key or OpenAI key
            if AI_API_KEY.startswith("AIza"):
                # Gemini REST endpoint
                gemini_url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={AI_API_KEY}"
                prompt_text = f"You are PlantAI, an expert botanist and plant care assistant. Plant: {p_name or 'General plant'}. "
                if care_record:
                    prompt_text += f"Care details: Sunlight: {care_record.sunlight}, Water: {care_record.water}, Soil: {care_record.soil}, Care: {care_record.care}. "
                prompt_text += f"User Question: {q}. Provide a concise, clear, and actionable answer (2-4 sentences)."

                resp = requests.post(
                    gemini_url,
                    json={"contents": [{"parts": [{"text": prompt_text}]}]},
                    timeout=10
                )
                if resp.status_code == 200:
                    ans = resp.json().get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "")
                    if ans:
                        return {
                            "success": True,
                            "status": "answered",
                            "message": "Answer generated successfully.",
                            "answer": ans.strip(),
                            "plant_name": p_name,
                            "suggestions": ["Watering tips", "Sunlight guide", "Fertilizer advice"]
                        }
        except Exception as e:
            print("AI API Assistant fallback:", e)

    # Rich botanical domain-knowledge engine
    q_lower = q.lower()
    plant_label = care_record.common_name if care_record and care_record.common_name else (p_name or "your plant")

    # 1. WATERING
    if any(k in q_lower for k in ["water", "watering", "how often", "thirsty", "moist", "dry"]):
        if care_record and care_record.water:
            ans = f"💧 For {plant_label}: {care_record.water}"
        else:
            ans = f"💧 For {plant_label}, water thoroughly when the top 1-2 inches of soil feels dry. Always ensure the pot has drainage holes to prevent waterlogging and root rot."

    # 2. SUNLIGHT / LIGHT
    elif any(k in q_lower for k in ["sun", "sunlight", "light", "shade", "dark", "bright"]):
        if care_record and care_record.sunlight:
            ans = f"☀️ For {plant_label}: {care_record.sunlight}"
        else:
            ans = f"☀️ {plant_label} generally thrives best in bright, indirect natural sunlight. Protect it from harsh, scorching midday rays which can burn delicate foliage."

    # 3. SOIL / POTTING MIX
    elif any(k in q_lower for k in ["soil", "potting", "dirt", "mix", "drainage", "perlite", "peat"]):
        if care_record and care_record.soil:
            ans = f"🌱 For {plant_label}: {care_record.soil}"
        else:
            ans = f"🌱 Use a well-draining, loose potting mix rich in organic compost (such as vermicompost) with added perlite or coarse sand to promote root aeration."

    # 4. CONTAINER / POT
    elif any(k in q_lower for k in ["pot", "container", "planter", "repot", "size"]):
        if care_record and care_record.container:
            ans = f"🪴 For {plant_label}: {care_record.container}"
        else:
            ans = f"🪴 Choose a pot that is 2-3 inches wider than the root ball and must feature bottom drainage holes. Terracotta pots are ideal for aeration."

    # 5. LOCATION / PLACEMENT
    elif any(k in q_lower for k in ["location", "place", "placement", "indoor", "outdoor", "balcony", "room", "window"]):
        if care_record and care_record.location:
            ans = f"🏠 Recommended location for {plant_label}: {care_record.location}"
        else:
            ans = f"🏠 Place {plant_label} in a well-ventilated spot with good ambient light, away from sudden cold drafts or direct air conditioning vents."

    # 6. YELLOW LEAVES / PROBLEM
    elif any(k in q_lower for k in ["yellow", "yellowing", "brown", "drop", "wilting", "dying", "leaves falling"]):
        ans = (
            f"🍂 Yellow or dropping leaves on {plant_label} are most commonly caused by overwatering or poor soil drainage. "
            "Check that the soil is not waterlogged. Allow the topsoil to dry before the next watering, and ensure adequate indirect light."
        )

    # 7. FERTILIZER / FEEDING
    elif any(k in q_lower for k in ["fertilizer", "fertilize", "feed", "nutrients", "compost", "manure"]):
        if care_record and care_record.care:
            ans = f"🌸 Nutrition & Care for {plant_label}: {care_record.care}"
        else:
            ans = f"🌸 Feed {plant_label} with a balanced liquid fertilizer diluted to half strength once every 3-4 weeks during spring and summer (active growing season)."

    # 8. PESTS / BUGS / INSECTS
    elif any(k in q_lower for k in ["pest", "bug", "insect", "aphid", "mite", "fungus", "neem"]):
        ans = (
            f"🛡️ For common pests on {plant_label} (such as aphids, spider mites, or mealybugs), "
            "wipe leaves with a soft damp cloth and spray diluted organic Neem oil solution (5ml neem oil + 2ml liquid soap per liter of water) in the evening."
        )

    # 9. GENERAL CARE
    elif care_record and care_record.care:
        ans = f"🌿 Plant Care summary for {plant_label}: {care_record.care} (Sunlight: {care_record.sunlight} | Water: {care_record.water})"

    else:
        if not p_name:
            ans = "🌱 Hello! Please specify a plant name or ask about watering, sunlight, soil, fertilizers, or common plant issues (e.g. 'How do I care for Money Plant?')."
        else:
            ans = f"🌿 For {plant_label}, maintain regular watering when soil is dry, ensure bright indirect sunlight, and check periodically for healthy new growth."

    suggestions = [
        f"How much sunlight does {plant_label} need?",
        f"How often should I water {plant_label}?",
        f"What is the best soil for {plant_label}?",
        f"Why are my {plant_label} leaves turning yellow?"
    ]

    return {
        "success": True,
        "status": "answered",
        "message": "Response generated.",
        "answer": ans,
        "plant_name": p_name,
        "suggestions": suggestions
    }
