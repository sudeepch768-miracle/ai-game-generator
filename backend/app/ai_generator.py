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
    active_key = env_key or api_key

    time_limits = {"easy": 140, "medium": 110, "hard": 85, "nightmare": 60}
    target_time = time_limits.get(difficulty, 110)

    # Resolve theme from explicit theme, custom_prompt, image_filename, or sample_id
    resolved_theme = theme if not image_bytes or custom_prompt else None
    prompt_str = f"{custom_prompt or ''} {image_filename or ''}".lower()
    sample_str = (sample_id or "").lower()
    
    if not resolved_theme:
        if any(w in prompt_str for w in ["railway", "train", "station", "subway", "metro", "transit", "locomotive", "track", "platform", "depot"]) or any(w in sample_str for w in ["railway", "train", "station", "subway", "metro"]):
            resolved_theme = "railway"
        elif any(w in prompt_str for w in ["police", "cop", "precinct", "constable", "sheriff", "jail", "prison", "interrogation", "lockup", "detective"]):
            resolved_theme = "police"
        elif any(w in prompt_str for w in ["hospital", "clinic", "medical", "doctor", "nurse", "surgery", "patient", "infirmary", "ambulance"]):
            resolved_theme = "hospital"
        elif any(w in prompt_str for w in ["kitchen", "restaurant", "chef", "cook", "dining", "bakery", "cafe", "bistro", "stove", "pantry"]):
            resolved_theme = "kitchen"
        elif any(w in prompt_str for w in ["airport", "airplane", "plane", "aircraft", "hangar", "runway", "tarmac", "terminal", "flight"]):
            resolved_theme = "airport"
        elif any(w in prompt_str for w in ["snow", "ice", "frost", "mountain", "arctic", "winter", "glacier", "tundra", "cold", "blizzard", "penguin"]) or any(w in sample_str for w in ["snow", "ice", "frost", "mountain", "arctic"]):
            resolved_theme = "snow"
        elif any(w in prompt_str for w in ["volcano", "lava", "fire", "magma", "inferno", "molten"]) or any(w in sample_str for w in ["volcano", "lava"]):
            resolved_theme = "volcano"
        elif any(w in prompt_str for w in ["desert", "sand", "pyramid", "tomb", "dune", "egypt"]) or any(w in sample_str for w in ["desert", "pyramid"]):
            resolved_theme = "desert"
        elif any(w in prompt_str for w in ["ocean", "underwater", "sea", "aquatic", "water", "coral", "reef", "abyss"]) or any(w in sample_str for w in ["ocean", "water"]):
            resolved_theme = "ocean"
        elif any(w in prompt_str for w in ["space", "alien", "cosmic", "void", "galaxy", "starship", "orbit", "space_station"]) or any(w in sample_str for w in ["space", "alien"]):
            resolved_theme = "space"
        elif any(w in prompt_str for w in ["haunt", "ghost", "phantom", "spooky", "wraith", "mansion", "horror", "crypt", "specter", "undead"]) or any(w in sample_str for w in ["haunt", "ghost", "mansion"]):
            resolved_theme = "haunted"
        elif any(w in prompt_str for w in ["bank", "vault", "guard", "security", "laser", "heist", "money", "gold", "cash", "teller", "bullion"]) or any(w in sample_str for w in ["bank", "vault"]):
            resolved_theme = "bank"
        elif any(w in prompt_str for w in ["cyber", "tech", "server", "matrix", "drone", "lab", "robot"]) or any(w in sample_str for w in ["cyber"]):
            resolved_theme = "cyberpunk"
        elif any(w in prompt_str for w in ["dungeon", "tomb", "catacomb", "castle", "relic", "stone", "cave"]) or any(w in sample_str for w in ["dungeon"]):
            resolved_theme = "dungeon"
        elif any(w in prompt_str for w in ["class", "school", "auditorium", "lecture", "study"]) or any(w in sample_str for w in ["classroom"]):
            resolved_theme = "classroom"
        elif any(w in prompt_str for w in ["office", "desk", "work", "cubicle", "corporate"]) or any(w in sample_str for w in ["desk", "office"]):
            resolved_theme = "office"
        elif any(w in prompt_str for w in ["living", "room", "nature", "forest", "park", "garden", "plant", "jungle"]) or any(w in sample_str for w in ["living_room", "nature"]):
            resolved_theme = "nature"
        elif not image_bytes:
            resolved_theme = "bank"

    # 1. Attempt Multimodal Gemini AI Generation with User Key
    ai_metadata = None
    if active_key:
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

Look deeply at what real-world environment, setting, and objects are shown in the image or described in the prompt.
Whatever the photo depicts (a railway station, a bank, a police station, a snowy mountain, a hospital, a restaurant kitchen, an airport, a construction site, an ancient temple, etc.), extract the AUTHENTIC, SPECIFIC real-world features and landmark elements that make this location unmistakably feel like what it is.

Return a custom top-down game world JSON matching this exact structure:
{
  "title": "Creative, evocative game title specifically for this environment (e.g. 'St. Pancras Rail Terminus: Red Signal', 'Metropolitan Police Precinct 09', 'First Federal Bullion Vault', 'Glacial Ridge Summit')",
  "theme": "railway, police, bank, snow, hospital, kitchen, airport, cyberpunk, volcano, desert, ocean, space, dungeon, nature, office, or classroom",
  "description": "Two exciting sentences describing the player's infiltration mission in this exact real-world setting.",
  "primary_landmark": "The defining centerpiece or large structure of this environment (e.g. 'High-Speed Metro Train Carriage', 'Circular Steel Bank Vault Door', 'Police Holding Cell Block', 'Commercial Jet Airliner', 'Surgical Operating Theater', 'Commercial Stove Range', 'Glacial Penguin Nesting Colony')",
  "palette": {
    "floor_color": "Hex color matching the terrain/floor (e.g. '#141720' for railway platform, '#0d1322' for police precinct, '#0f172a' for bank marble, '#0c1a2e' for snow/ice, '#0a1711' for jungle)",
    "floor_texture": "railway, police, hospital, kitchen, snow, sand, cracks, cobblestone, circuit, water, or grid",
    "wall_top": "Hex color for top surface of walls",
    "wall_front": "Hex color for front-facing 3D wall face",
    "wall_rim": "Glowing neon or highlight rim color (e.g. '#f59e0b' for railway amber, '#3b82f6' for police blue, '#ffd700' for bank gold, '#7dd3fc' for ice, '#00f2fe' for cyber)",
    "weather": "snow, dust, embers, bubbles, fog, sand, or sparks"
  },
  "guardian_name": "Boss enemy guarding the sector exit portal matching this theme (e.g. 'TRANSIT COMMANDER MARSHALL', 'POLICE COMMISSIONER VANCE', 'CHIEF SECURITY WARDEN', 'ANCIENT FROST TITAN YETI', 'CHIEF MEDICAL INSPECTOR', 'HEAD EXECUTIVE CHEF')",
  "guardian_sprite": "guard, yeti, monster, ghost, laser, or drone",
  "guardian_shape": "humanoid_guard, golem_titan, quadruped_beast, floating_spirit, mechanical_turret, or winged_drone",
  "guardian_color": "Hex color for guardian body/armor",
  "guardian_eyes": "Hex color for glowing eyes/sensor",
  "guardian_accessory": "peaked_cap, police_cap, ice_crown, horns, flame_aura, or frost_aura",
  "chaser_name": "Roaming hostile enemy patrolling corridors matching this theme (e.g. 'RAILWAY SECURITY OFFICER', 'POLICE CONSTABLE', 'ARMED VAULT GUARD', 'BLIZZARD WOLF STALKER', 'ORDERLY PATROL', 'LINE COOK ENFORCER')",
  "chaser_sprite": "guard, beast, monster, ghost, or drone",
  "chaser_shape": "humanoid_guard, quadruped_beast, floating_spirit, golem_titan, or winged_drone",
  "chaser_color": "Hex color for chaser body",
  "chaser_eyes": "Hex color for chaser eyes",
  "patrol_name": "Corridor sentry turret or surveillance scout name (e.g. 'TRACK SURVEILLANCE SENTRY', 'PRECINCT CCTV SENTRY', 'LASER TRIPWIRE SENTRY', 'GLACIAL SHARD SENTRY')",
  "patrol_sprite": "laser, drone, ghost, or guard",
  "patrol_shape": "mechanical_turret, winged_drone, floating_spirit, or quadruped_beast",
  "patrol_color": "Hex color for sentry body",
  "patrol_eyes": "Hex color for sentry beam",
  "objects": ["5 to 6 unique, highly specific obstacle and prop names authentic to this exact photo (e.g. if railway: ['High-Speed Metro Train', 'Ticket Vending Kiosk', 'Turnstile Gate Barrier', 'Departure Schedule Board', 'Platform Waiting Bench']; if bank: ['Massive Bank Vault Door', 'Gold Bullion Pallet', 'Cash Reserve Pallet', 'Titanium Security Safe', 'Deposit Box Rack']; if police: ['Holding Cell Bars', 'Precinct Booking Desk', 'Interrogation Table', 'Police Siren Beacon', 'Evidence Locker']; if snow: ['Penguin Nesting Colony', 'Glacial Ice Spire', 'Frozen Stalagmite', 'Snowdrift Cache', 'Glacial Cryo-Pod']; if hospital: ['Patient Hospital Bed', 'Vitals Heart Monitor', 'Surgical Operating Lamp', 'Medicine Cabinet', 'Mobile MRI Scanner'])"],
  "object_colors": ["#3b82f6", "#f59e0b", "#10b981", "#64748b", "#cbd5e1", "#ffd700"],
  "collectibles": ["Primary collectible name matching theme (e.g. 'Stack of Cash', 'Commuter Transit Pass', 'Police Badge', 'Frost Crystal', 'Medical Kit')", "Secondary high-value collectible (e.g. 'Gold Bullion Bar', 'Platform Keycard', 'Evidence Dossier', 'Frozen Star Relic', 'Golden Scalpel')"],
  "guide_name": "Friendly NPC specialist or native creature name (e.g. 'Station Conductor', 'Desk Sergeant Miller', 'Inside Informant', 'Waddling Adélie Penguin', 'Triage Nurse Sarah')"
}"""
            contents.append(gemini_prompt)

            for model_name in ("gemini-flash-latest", "gemini-3.1-flash-lite-preview"):
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

        import hashlib
        base_seed = int(hashlib.md5(image_bytes if image_bytes else game_title.encode()).hexdigest()[:8], 16)

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
            seed=lvl_num * 54321 + random.randint(100, 999)
        )
        campaign_levels.append(lvl)
    lvl1 = campaign_levels[0].model_copy(deep=True)
    lvl1.levels = campaign_levels
    return lvl1

