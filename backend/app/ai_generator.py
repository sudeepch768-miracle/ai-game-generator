import os
import json
import io
from typing import Optional
from PIL import Image
from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

from .schemas import GameWorld, SceneAnalysis, MapConfig, PlayerPosition, Wall, GameObject, Collectible, ExitPoint, NPC, Objective, Enemy
from .validator import validate_and_repair_game_world
from .demo_data import ALL_DEMO_WORLDS, DEMO_CLASSROOM
from .cv_analyzer import analyze_image_and_generate_campaign
from .map_generator import generate_procedural_level
import random

def build_campaign_from_base(base: GameWorld, difficulty: str, target_time: int, hazard_level: str) -> GameWorld:
    theme = base.map.theme or "classroom"
    env_name = base.title.split(":")[0] if ":" in base.title else base.title
    map_size = "standard"
    if base.map.width < 22:
        map_size = "compact"
    elif base.map.width > 28:
        map_size = "large"

    campaign_levels: List[GameWorld] = []
    for lvl_num in (1, 2, 3):
        lvl = generate_procedural_level(
            level_num=lvl_num,
            env_name=env_name,
            theme=theme,
            difficulty=difficulty,
            map_size=map_size,
            hazard_level=hazard_level,
            seed=lvl_num * 54321 + random.randint(100, 999)
        )
        campaign_levels.append(lvl)

    lvl1 = campaign_levels[0].model_copy(deep=True)
    lvl1.levels = campaign_levels
    return lvl1


def analyze_and_generate_world(
    image_bytes: Optional[bytes] = None,
    image_filename: Optional[str] = None,
    sample_id: Optional[str] = None,
    api_key: Optional[str] = None,
    difficulty: str = "medium",
    map_size: str = "standard",
    hazard_level: str = "moderate",
    theme: Optional[str] = None,
    custom_prompt: Optional[str] = None
) -> GameWorld:
    """
    Two-stage AI Pipeline:
    1. If image_bytes is provided: Runs computer vision pixel analysis to extract authentic room layout,
       dominant colors, edge silhouettes, and generates a progressive 3-Level Campaign.
    2. If valid Gemini API key is provided: Enhances with Gemini 3.6 Flash multimodal LLM.
    3. Guarantees 100% BFS reachability validation and multi-level campaigns.
    """
    env_key = os.environ.get("GEMINI_API_KEY") or os.environ.get("GOOGLE_API_KEY")
    active_key = api_key or env_key

    time_limits = {"easy": 140, "medium": 110, "hard": 85, "nightmare": 60}
    target_time = time_limits.get(difficulty, 110)

    # Resolve theme from explicit theme, custom_prompt, image_filename, or sample_id
    resolved_theme = theme if not image_bytes or custom_prompt else None
    prompt_str = f"{custom_prompt or ''} {image_filename or ''}".lower()
    sample_str = (sample_id or "").lower()
    
    import re
    tokens = set(re.findall(r'[a-z0-9]+', prompt_str + " " + sample_str))

    if not resolved_theme:
        if any(w in tokens for w in ["gym", "fitness", "workout", "weights", "crossfit", "bench", "barbell", "dumbbell", "treadmill"]):
            resolved_theme = "gym"
        elif any(w in tokens for w in ["cafe", "coffee", "tea", "espresso", "latte", "barista", "bakery"]):
            resolved_theme = "kitchen"
        elif any(w in tokens for w in ["car", "garage", "vehicle", "auto", "mechanic", "workshop", "motor", "engine"]):
            resolved_theme = "cyberpunk_street"
        elif any(w in tokens for w in ["pet", "dog", "cat", "puppy", "kitten", "animal", "canine", "feline"]):
            resolved_theme = "living_room"
        elif any(w in tokens for w in ["supermarket", "store", "shop", "grocery", "mall", "market"]):
            resolved_theme = "bank"
        elif any(w in tokens for w in ["art", "museum", "gallery", "painting", "sculpture", "studio"]):
            resolved_theme = "office"
        elif any(w in tokens for w in ["hospital", "haspital", "hopital", "hosp", "clinic", "medical", "doctor", "nurse", "surgery", "patient", "infirmary", "ambulance", "stretcher", "ward", "health", "trauma", "triage", "icu", "er", "emergency"]):
            resolved_theme = "hospital"
        elif any(w in tokens for w in ["police", "cop", "precinct", "constable", "sheriff", "jail", "prison", "interrogation", "lockup", "detective"]):
            resolved_theme = "police"
        elif any(w in tokens for w in ["railway", "train", "subway", "metro", "transit", "locomotive", "track", "platform", "depot"]):
            resolved_theme = "railway"
        elif "station" in tokens and not any(x in tokens for x in ["police", "nurse", "aid", "space", "fire"]):
            resolved_theme = "railway"
        elif any(w in tokens for w in ["kitchen", "restaurant", "chef", "cook", "dining", "bakery", "cafe", "bistro", "stove", "pantry", "culinary"]):
            resolved_theme = "kitchen"
        elif any(w in tokens for w in ["airport", "airplane", "plane", "aircraft", "hangar", "runway", "tarmac", "terminal", "flight"]):
            resolved_theme = "airport"
        elif any(w in tokens for w in ["snow", "ice", "frost", "mountain", "arctic", "winter", "glacier", "tundra", "cold", "blizzard", "penguin"]):
            resolved_theme = "snow"
        elif any(w in tokens for w in ["volcano", "lava", "fire", "magma", "inferno", "molten", "burn"]):
            resolved_theme = "volcano"
        elif any(w in tokens for w in ["desert", "sand", "pyramid", "tomb", "dune", "egypt"]):
            resolved_theme = "desert"
        elif any(w in tokens for w in ["ocean", "underwater", "sea", "aquatic", "water", "coral", "reef", "abyss"]):
            resolved_theme = "ocean"
        elif any(w in tokens for w in ["space", "alien", "cosmic", "void", "galaxy", "starship", "orbit", "space_station"]):
            resolved_theme = "space"
        elif any(w in tokens for w in ["haunt", "ghost", "phantom", "spooky", "wraith", "mansion", "horror", "crypt", "specter", "undead"]):
            resolved_theme = "haunted"
        elif any(w in tokens for w in ["bank", "vault", "guard", "security", "laser", "heist", "money", "gold", "cash", "teller", "bullion"]):
            resolved_theme = "bank"
        elif any(w in tokens for w in ["cyber", "cyberpunk", "tech", "server", "matrix", "drone", "lab", "robot"]):
            resolved_theme = "cyberpunk"
        elif any(w in tokens for w in ["castle", "fortress", "palace", "citadel", "kingdom", "throne", "medieval", "keep", "tower", "knight"]):
            resolved_theme = "castle"
        elif any(w in tokens for w in ["dungeon", "tomb", "catacomb", "relic", "stone", "cave"]):
            resolved_theme = "dungeon"
        elif any(w in tokens for w in ["class", "classroom", "school", "auditorium", "lecture", "study"]):
            resolved_theme = "classroom"
        elif any(w in tokens for w in ["office", "desk", "work", "cubicle", "corporate"]):
            resolved_theme = "office"
        elif any(w in tokens for w in ["living", "couch", "sofa", "bedroom", "home", "house", "lounge", "apartment"]):
            resolved_theme = "living_room"
        elif any(w in tokens for w in ["forest", "park", "garden", "plant", "jungle", "nature", "tree", "yard"]):
            resolved_theme = "nature"
        elif not image_bytes:
            resolved_theme = "bank"

    # 1. Attempt Multimodal Gemini AI Generation with Active Key
    ai_metadata = None
    is_usable_gemini_key = bool(active_key and len(active_key) > 20 and not active_key.startswith("AQ."))
    if is_usable_gemini_key:
        try:
            client = genai.Client(api_key=active_key)
            contents = []
            if image_bytes:
                img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
                img.thumbnail((800, 800))
                buf = io.BytesIO()
                img.save(buf, format="JPEG", quality=85)
                part = types.Part.from_bytes(data=buf.getvalue(), mime_type="image/jpeg")
                contents.append(part)

            prompt_hints = []
            if custom_prompt:
                prompt_hints.append(f"User Prompt: '{custom_prompt}'")
            if theme and not image_bytes:
                prompt_hints.append(f"Preferred Theme: '{theme}'")
            if image_filename:
                prompt_hints.append(f"Image Filename: '{image_filename}'")
            guidance = " | ".join(prompt_hints) if prompt_hints else "No text prompt given; infer atmosphere, environment, colors and theme purely from the uploaded photo."

            gemini_prompt = """You are a master video game world director and technical artist. Analyze this uploaded image and guidance carefully:
Guidance: """ + guidance + """

CRITICAL INSTRUCTION: Analyze the uploaded photo in DIRECT SYNERGY with the user's prompt. The user's prompt describes what is in the photo or the specific world vibe they want (e.g. 'medieval stone castle', 'hospital ICU trauma ward', 'cozy living room with sofa', 'gym fitness center', 'bank vault with lasers', etc.).
Deeply synthesize BOTH the visual evidence from the photo AND the user's description to understand the authentic real-world environment.
Extract the AUTHENTIC, SPECIFIC real-world features, exact furniture/props, and landmark elements that make this location unmistakably feel like what it is so the player feels like they are ACTUALLY THERE.

Return a custom top-down game world JSON matching this exact structure:
{
  "title": "Creative, evocative game title specifically for this exact environment (e.g. 'Cozy Hearth Living Room: Data Retrieval', 'Goldsmith Gym: Heavy Iron Sector', 'Metro Rail Terminus: Red Signal', 'Apex Corporate Suite', 'Sunset Rooftop Infiltration')",
  "theme": "A concise 1-2 word identifier for this exact environment (e.g. 'living_room', 'coffee_shop', 'gym', 'garage', 'art_studio', 'garden', 'subway', 'bedroom', 'library', 'supermarket', 'rooftop', 'bakery', 'playground', 'street', 'office', 'bank', 'cyberpunk', etc.)",
  "description": "Two exciting sentences describing the player's infiltration mission in this exact real-world setting.",
  "primary_landmark": "The defining centerpiece or large structure of this environment (e.g. 'Plush Velvet Sectional Sofa', 'High-Speed Metro Train Carriage', 'Heavy Power Squat Rack', 'Circular Steel Bank Vault Door', 'Commercial Stove Range', 'Grand Piano Platform')",
  "palette": {
    "floor_color": "Hex color matching the terrain/floor extracted from the photo",
    "floor_texture": "cobblestone, sand, cracks, circuit, grid, or wood",
    "wall_top": "Hex color for top surface of walls",
    "wall_front": "Hex color for front-facing 3D wall face",
    "wall_rim": "Glowing neon or highlight rim color that accents the environment",
    "weather": "dust, embers, bubbles, fog, sparks, or snow"
  },
  "guardian_name": "Boss enemy guarding the sector exit portal matching this theme (e.g. 'DOMESTIC SECURITY WARDEN', 'CHIEF GYM ENFORCER', 'TRANSIT COMMANDER', 'SECURITY OVERSEER', 'CHIEF INSPECTOR')",
  "guardian_sprite": "guard, monster, yeti, ghost, laser, or drone",
  "guardian_shape": "humanoid_guard, golem_titan, quadruped_beast, floating_spirit, mechanical_turret, or winged_drone",
  "guardian_color": "Hex color for guardian body/armor",
  "guardian_eyes": "Hex color for glowing eyes/sensor",
  "guardian_accessory": "peaked_cap, police_cap, ice_crown, horns, flame_aura, or frost_aura",
  "chaser_name": "Roaming hostile enemy patrolling corridors matching this theme (e.g. 'ROOM PATROL BOT', 'FITNESS ENFORCER', 'SECURITY AGENT', 'CORRIDOR STALKER')",
  "chaser_sprite": "guard, beast, monster, ghost, or drone",
  "chaser_shape": "humanoid_guard, quadruped_beast, floating_spirit, golem_titan, or winged_drone",
  "chaser_color": "Hex color for chaser body",
  "chaser_eyes": "Hex color for chaser eyes",
  "patrol_name": "Corridor sentry turret or surveillance scout name (e.g. 'MOTION DETECTOR SENTRY', 'CCTV CAMERA TURRET', 'LASER SCANNER TURRET')",
  "patrol_sprite": "laser, drone, ghost, or guard",
  "patrol_shape": "mechanical_turret, winged_drone, floating_spirit, or quadruped_beast",
  "patrol_color": "Hex color for sentry body",
  "patrol_eyes": "Hex color for sentry beam",
  "objects": ["5 to 6 unique, highly specific obstacle and prop names authentic to this exact photo (e.g. if living room: ['Velvet Sectional Sofa', 'Mahogany Coffee Table', 'Ornamental Bookshelf', 'Floor Standing Lamp', 'Decorative Area Rug']; if gym: ['Heavy Dumbbell Rack', 'Olympic Bench Press', 'Treadmill Station', 'Kettlebell Tower', 'Cable Pulley Unit']; if office: ['Executive Mahogany Desk', 'Ergonomic Mesh Chair', 'Filing Archive Cabinet', 'Water Cooler Dispenser', 'Server Tower Array'])"],
  "object_colors": ["#3b82f6", "#f59e0b", "#10b981", "#64748b", "#cbd5e1", "#ffd700"],
  "collectibles": ["Primary collectible name matching theme (e.g. 'Hidden Memory Chip', 'Keycard Pass', 'Gold Bar', 'Energy Cell', 'Golden Trophy')", "Secondary high-value collectible (e.g. 'Encrypted Dossier', 'Master Key', 'Diamond Relic', 'Platinum Coin')"],
  "guide_name": "Friendly NPC specialist or native character name (e.g. 'Inside Informant', 'Recon Specialist Alex', 'Desk Agent', 'Helpful Assistant')"
}"""
            contents.append(gemini_prompt)

            for model_name in ("gemini-3.6-flash", "gemini-3.1-flash-lite-preview", "gemini-2.0-flash", "gemini-flash-latest"):
                try:
                    print(f"[AI Generator] Calling Multimodal Gemini ({model_name})...")
                    res = client.models.generate_content(
                        model=model_name,
                        contents=contents,
                        config=types.GenerateContentConfig(
                            response_mime_type="application/json",
                            temperature=0.3
                        )
                    )
                    ai_metadata = json.loads(res.text)
                    print(f"[AI Generator] Gemini Multimodal Success! Title='{ai_metadata.get('title')}', Theme='{ai_metadata.get('theme')}', Guardian='{ai_metadata.get('guardian_name')}'")
                    break
                except Exception as m_err:
                    print(f"[AI Generator] Gemini model {model_name} error: {m_err}")

        except Exception as e:
            print(f"[AI Generator] Gemini client error: {e}")

    # 2. Build Authentic 3-Level Campaign from AI Synthesis
    if ai_metadata:
        game_title = ai_metadata.get("title") or (custom_prompt.title() if custom_prompt else "Synthesized Zone")
        theme_to_use = ai_metadata.get("theme") or resolved_theme or "bank"
        custom_desc = ai_metadata.get("description")

        base_seed = random.randint(1, 99999999)

        campaign_levels = []
        for lvl_num in (1, 2, 3):
            lvl = generate_procedural_level(
                level_num=lvl_num,
                env_name=game_title,
                theme=theme_to_use,
                difficulty=difficulty,
                map_size=map_size,
                hazard_level=hazard_level,
                seed=base_seed + lvl_num * 54321,
                color_palette=ai_metadata.get("palette"),
                custom_enemies=ai_metadata,
                custom_description=custom_desc
            )
            repaired = validate_and_repair_game_world(lvl)
            campaign_levels.append(repaired)

        primary = campaign_levels[0].model_copy(deep=True)
        primary.levels = campaign_levels
        return primary

    # 3. Fallback: Computer Vision pixel synthesizer or procedural generator
    if image_bytes:
        print(f"[AI Generator] Falling back to Computer Vision Scene Analyzer (hinted_theme={resolved_theme})...")
        return analyze_image_and_generate_campaign(
            image_bytes,
            difficulty,
            map_size,
            hazard_level,
            custom_theme=resolved_theme,
            custom_prompt=custom_prompt,
            image_filename=image_filename
        )

    theme_to_use = resolved_theme or "bank"
    title_env = custom_prompt.title() if custom_prompt else "Tactical Zone"
    campaign_levels = []
    for lvl_num in (1, 2, 3):
        lvl = generate_procedural_level(
            level_num=lvl_num,
            env_name=title_env,
            theme=theme_to_use,
            difficulty=difficulty,
            map_size=map_size,
            hazard_level=hazard_level,
            seed=lvl_num * 54321 + random.randint(100, 99999999)
        )
        campaign_levels.append(lvl)
    lvl1 = campaign_levels[0].model_copy(deep=True)
    lvl1.levels = campaign_levels
    return lvl1

