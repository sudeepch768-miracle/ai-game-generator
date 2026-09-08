import io
import math
import random
import colorsys
import re
from typing import List, Tuple, Optional, Dict, Any
from PIL import Image, ImageFilter
from .schemas import GameWorld, MapConfig, Wall, GameObject, Collectible, ExitPoint, NPC, Objective, PlayerPosition, Enemy
from .validator import validate_and_repair_game_world
from .map_generator import generate_procedural_level

def extract_image_palette(img: Image.Image) -> Dict[str, str]:
    """
    Extracts the authentic dominant and accent colors directly from the uploaded photo.
    """
    img_rgb = img.convert("RGB")
    pixels = list(img_rgb.getdata())
    stride = max(1, len(pixels) // 1000)
    sampled = pixels[::stride]
    if not sampled:
        return {
            "floor_color": "#0f172a",
            "floor_texture": "grid",
            "wall_top": "#1e293b",
            "wall_front": "#0f172a",
            "wall_rim": "#00f2fe",
            "weather": "dust",
            "ambient_light": "#00f2fe"
        }

    # Calculate average RGB
    tot_r = sum(p[0] for p in sampled)
    tot_g = sum(p[1] for p in sampled)
    tot_b = sum(p[2] for p in sampled)
    n = len(sampled)
    avg_r = int(tot_r / n)
    avg_g = int(tot_g / n)
    avg_b = int(tot_b / n)

    # Floor: dark deep version of average
    floor_r = max(8, min(40, avg_r // 4))
    floor_g = max(8, min(40, avg_g // 4))
    floor_b = max(12, min(50, avg_b // 4))
    floor_hex = f"#{floor_r:02x}{floor_g:02x}{floor_b:02x}"

    # Wall Top: medium shade
    wtop_r = max(20, min(80, avg_r // 2))
    wtop_g = max(20, min(80, avg_g // 2))
    wtop_b = max(25, min(90, avg_b // 2))
    wall_top_hex = f"#{wtop_r:02x}{wtop_g:02x}{wtop_b:02x}"

    # Wall Front: darker shade
    wfront_r = max(10, min(50, avg_r // 3))
    wfront_g = max(10, min(50, avg_g // 3))
    wfront_b = max(15, min(60, avg_b // 3))
    wall_front_hex = f"#{wfront_r:02x}{wfront_g:02x}{wfront_b:02x}"

    # Find highest saturation pixel for vibrant neon rim
    best_sat = 0.0
    best_accent = (0, 242, 254)
    for r, g, b in sampled:
        _, s, v = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
        if s > best_sat and v > 0.4:
            best_sat = s
            best_accent = (r, g, b)

    if best_sat > 0.3:
        rim_hex = f"#{best_accent[0]:02x}{best_accent[1]:02x}{best_accent[2]:02x}"
    else:
        rim_hex = "#00f2fe"

    return {
        "floor_color": floor_hex,
        "floor_texture": "wood" if avg_r > avg_b + 20 else ("organic" if avg_g > avg_r and avg_g > avg_b else "grid"),
        "wall_top": wall_top_hex,
        "wall_front": wall_front_hex,
        "wall_rim": rim_hex,
        "weather": "fog" if avg_g > avg_r and avg_g > avg_b else "dust",
        "ambient_light": rim_hex
    }


def classify_image_theme(
    img: Image.Image,
    image_filename: Optional[str] = None,
    custom_theme: Optional[str] = None,
    custom_prompt: Optional[str] = None
) -> Tuple[str, str, Dict[str, str], List[str], str]:
    """
    Classifies environment theme, title, color palette, and custom obstacles from image properties.
    """
    text_corpus = f"{custom_theme or ''} {custom_prompt or ''} {image_filename or ''}".lower()
    words = set(re.findall(r'[a-z0-9]+', text_corpus))
    extracted_palette = extract_image_palette(img)

    # 1. Exact textual keyword matches
    if any(k in words for k in ("castle", "fortress", "palace", "citadel", "kingdom", "throne", "medieval", "keep", "tower", "knight")):
        clean_name = "Royal Citadel Fortress"
        if image_filename and not any(x in image_filename.lower() for x in ("img_", "photo", "image", "screenshot")):
            clean_name = image_filename.rsplit('.', 1)[0].replace('_', ' ').replace('-', ' ').title()
        return "castle", clean_name, extracted_palette, ["Royal Velvet Throne", "Suit of Medieval Plate Armor", "Flaming Iron Brazier", "Brass-banded Treasure Chest", "Stone Sarcophagus"], "#fbbf24"
    if any(k in words for k in ("gym", "fitness", "workout", "weights", "crossfit", "bench", "barbell", "dumbbell", "treadmill")):
        return "gym", "Titan Athletic Gym", extracted_palette, ["Heavy Olympic Barbell Rack", "Incline Dumbbell Bench", "Power Squat Cage", "Cardio Treadmill Station", "Kettlebell Pyramids"], "#e11d48"
    if any(k in words for k in ("cafe", "coffee", "tea", "espresso", "latte", "barista", "bakery")):
        return "kitchen", "Artisan Roast Cafe", extracted_palette, ["Brass Espresso Machine", "Granite Barista Counter", "Pastry Display Showcase", "Hardwood Cafe Table", "Chalkboard Menu Board"], "#ea580c"
    if any(k in words for k in ("car", "garage", "vehicle", "auto", "mechanic", "workshop", "motor", "engine")):
        return "cyberpunk_street", "Apex Motors Speed Workshop", extracted_palette, ["Hydraulic Car Lift", "Heavy Rolling Tool Chest", "High-Performance Engine Block", "Pneumatic Tire Changer", "Welding Rig Cart"], "#3b82f6"
    if any(k in words for k in ("pet", "dog", "cat", "puppy", "kitten", "animal", "canine", "feline")):
        return "living_room", "Pet Sanctuary Haven", extracted_palette, ["Plush Pet Haven Bed", "Climbing Scratch Tree", "Ceramic Water Fountain", "Interactive Play Tunnel", "Feather Toy Carousel"], "#f59e0b"
    if any(k in words for k in ("supermarket", "store", "shop", "grocery", "mall", "market")):
        return "bank", "Grand Bazaar Supermarket", extracted_palette, ["Gondola Grocery Shelves", "Barcode Checkout Terminal", "Cold Beverage Chiller", "Produce Display Stand", "Rolling Shopping Cart"], "#10b981"
    if any(k in words for k in ("art", "museum", "gallery", "painting", "sculpture", "studio")):
        return "office", "Metropolitan Fine Art Pavilion", extracted_palette, ["Sculpture Pedestal", "Framed Masterpiece Canvas", "Velvet Stanchion Rope", "Art Restoration Easel", "Glass Artifact Vitrine"], "#c084fc"
    if any(k in words for k in ("hospital", "clinic", "medical", "doctor", "nurse", "surgery", "patient", "infirmary", "ambulance", "stretcher", "ward", "trauma", "triage", "icu", "er", "emergency")):
        env_title = custom_prompt.title() if custom_prompt else "St. Jude Trauma Center"
        return "hospital", env_title, extracted_palette, ["Patient Hospital Bed", "Vitals Heart Monitor", "Surgical Operating Lamp", "Medicine Cabinet", "Mobile MRI Scanner"], "#38bdf8"
    if any(k in words for k in ("police", "cop", "precinct", "constable", "sheriff", "jail", "prison", "interrogation", "detective")):
        return "police", "Metropolitan Police Precinct", extracted_palette, ["Holding Cell Bars", "Precinct Booking Desk", "Interrogation Table", "Police Siren Beacon", "Evidence Locker"], "#3b82f6"
    if any(k in words for k in ("railway", "train", "subway", "metro", "transit", "locomotive", "track", "platform", "depot")) or ("station" in words and not any(x in words for x in ("police", "nurse", "space"))):
        return "railway", "Grand Central Transit Hub", extracted_palette, ["High-Speed Metro Train", "Ticket Vending Kiosk", "Turnstile Gate Barrier", "Departure Schedule Board", "Platform Waiting Bench"], "#f59e0b"
    if any(k in words for k in ("kitchen", "restaurant", "chef", "cook", "dining", "bakery", "cafe", "bistro", "stove", "pantry", "culinary")):
        return "kitchen", "Executive Culinary Kitchen", extracted_palette, ["Commercial Stove Range", "Stainless Prep Island", "Industrial Refrigerator", "Spice Storage Rack", "Exhaust Hood Array"], "#f97316"
    if any(k in words for k in ("airport", "airplane", "plane", "aircraft", "hangar", "runway", "tarmac", "terminal", "flight", "jetway")):
        return "airport", "International Jetway Terminal", extracted_palette, ["Commercial Jet Airliner", "Baggage Claim Carousel", "Security Metal Detector", "Gate Waiting Lounge", "Jetway Boarding Ramp"], "#00f2fe"
    if any(k in words for k in ("snow", "ice", "frost", "mountain", "arctic", "winter", "glacier", "tundra", "cold", "blizzard", "penguin")):
        return "snow", "Glacial Frost Summit", extracted_palette, ["Penguin Nesting Colony", "Glacial Ice Spire", "Frozen Stalagmite", "Snowdrift Cache", "Glacial Cryo-Pod"], "#38bdf8"
    if any(k in words for k in ("volcano", "lava", "fire", "magma", "inferno", "molten", "burn")):
        return "volcano", "Volcanic Magma Chamber", extracted_palette, ["Basalt Monolith", "Magma Geyser", "Obsidian Altar", "Cooling Vent", "Heat Radiator"], "#f97316"
    if any(k in words for k in ("desert", "sand", "pyramid", "tomb", "dune", "egypt")):
        return "desert", "Sunken Dune Sanctuary", extracted_palette, ["Sandstone Obelisk", "Gold Sarcophagus", "Dune Cache", "Hieroglyph Tablet", "Ancient Urn"], "#fbbf24"
    if any(k in words for k in ("ocean", "underwater", "sea", "aquatic", "water", "coral", "reef", "abyss")):
        return "ocean", "Abyssal Ocean Trench", extracted_palette, ["Coral Reef Outcropping", "Sunken Ship Prow", "Hydrothermal Vent", "Ancient Anchor Relic", "Deep Trench Chasm"], "#0284c7"
    if any(k in words for k in ("space", "alien", "cosmic", "void", "galaxy", "starship", "orbit", "satellite", "astro")):
        return "space", "Orbital Nebula Outpost", extracted_palette, ["Quantum Hyperdrive Core", "Airlock Pressure Hatch", "Stasis Pod Bank", "Navigational Holo-Globe", "Life Support Scrubber"], "#c084fc"
    if any(k in words for k in ("haunt", "ghost", "mansion", "spook", "horror", "crypt", "graveyard", "phantom", "specter")):
        return "haunted", "Haunted Phantom Manor", extracted_palette, ["Ancient Sarcophagus", "Iron Candelabra", "Cobwebbed Bookcase", "Ornate Antique Mirror", "Gargoyle Pedestal"], "#a855f7"
    if any(k in words for k in ("bank", "vault", "safe", "heist", "money", "gold", "teller", "cash", "guard", "security", "bullion")):
        return "bank", "Federal Reserve Vault", extracted_palette, ["Massive Bank Vault Door", "Gold Bullion Pallet", "Cash Reserve Pallet", "Titanium Security Safe", "Deposit Box Rack"], "#ffd700"
    if any(k in words for k in ("forest", "nature", "garden", "backyard", "tree", "plant", "outdoor", "park", "jungle")):
        return "nature", "Overgrown Flora Domain", extracted_palette, ["Dense Foliage Cluster", "Mossy Boulder", "Ancient Timber Trunk", "Fern Canopy", "Stone Basin"], "#15803d"
    if any(k in words for k in ("living", "couch", "sofa", "bedroom", "home", "house", "lounge", "apartment", "room", "dorm")):
        clean_name = "Domestic Living Quarters"
        if image_filename and not any(x in image_filename.lower() for x in ("img_", "photo", "image", "screenshot")):
            clean_name = image_filename.rsplit('.', 1)[0].replace('_', ' ').replace('-', ' ').title()
        return "living_room", clean_name, extracted_palette, ["Velvet Sectional Sofa", "Mahogany Coffee Table", "Hardwood Bookshelf", "Decorative Area Rug", "Floor Standing Lamp"], "#f59e0b"
    if any(k in words for k in ("school", "class", "classroom", "study", "lecture", "campus", "whiteboard")):
        return "classroom", "Campus Auditorium Archive", extracted_palette, ["Lecture Podium", "Reference Cabinet", "Whiteboard", "Desk Cluster", "Filing Unit"], "#92400e"
    if any(k in words for k in ("office", "desk", "work", "corporate", "cubicle", "keyboard")):
        return "office", "Corporate Executive Center", extracted_palette, ["Executive Workstation Desk", "Ergonomic Mesh Chair", "Document Archive Cabinet", "Water Cooler Dispenser", "Server Tower Array"], "#334155"
    if any(k in words for k in ("street", "city", "urban", "road", "alley", "plaza", "car", "cars")):
        return "cyberpunk_street", "Neon Urban District", extracted_palette, ["Neon Billboard Frame", "Cyber Dumpster Unit", "Steel Barrier Gate", "Pneumatic Tube Terminal", "Street Hydrant Core"], "#00f2fe"

    # If the user typed ANY custom prompt, use it directly to synthesize a dynamic custom world!
    if custom_prompt and custom_prompt.strip():
        clean_prompt = custom_prompt.strip()
        clean_title = clean_prompt.title()
        words_list = clean_title.split()
        prop_base = words_list[0] if words_list else "Sanctum"
        custom_props = [
            f"{clean_title} Primary Core",
            f"{prop_base} Pillar Beacon",
            f"{prop_base} Energy Console",
            f"{clean_title} Security Barrier",
            f"{prop_base} Power Array"
        ]
        accent_color = extracted_palette.get("wall_rim", "#00f2fe")
        theme_slug = re.sub(r'[^a-z0-9]+', '_', clean_prompt.lower()).strip('_')
        return theme_slug or "custom", clean_title, extracted_palette, custom_props, accent_color

    # 2. Deep Visual Pixel & HSV Analysis
    img = img.convert("RGB")
    pixels = list(img.getdata())
    stride = max(1, len(pixels) // 1200)
    sampled = pixels[::stride]

    total = max(1, len(sampled))
    tot_r = sum(p[0] for p in sampled)
    tot_g = sum(p[1] for p in sampled)
    tot_b = sum(p[2] for p in sampled)
    avg_r = tot_r / total
    avg_g = tot_g / total
    avg_b = tot_b / total
    brightness = (avg_r * 299 + avg_g * 587 + avg_b * 114) / 1000

    purple_count = 0
    gold_count = 0
    blue_count = 0
    green_count = 0
    dark_shadow_count = 0

    for r, g, b in sampled:
        h_norm, s_norm, v_norm = colorsys.rgb_to_hsv(r / 255.0, g / 255.0, b / 255.0)
        hue_deg = h_norm * 360.0
        b_val = v_norm * 255.0
        if b_val < 60:
            dark_shadow_count += 1
        if (250 <= hue_deg <= 325) and s_norm > 0.2:
            purple_count += 1
        elif (35 <= hue_deg <= 68) and s_norm > 0.25:
            gold_count += 1
        elif (75 <= hue_deg <= 165) and s_norm > 0.2:
            green_count += 1
        elif (175 <= hue_deg <= 245) and s_norm > 0.25:
            blue_count += 1

    green_ratio = green_count / total
    blue_ratio = blue_count / total
    gold_ratio = gold_count / total
    purple_ratio = purple_count / total
    shadow_ratio = dark_shadow_count / total

    # Derive dynamic title from filename if meaningful
    inferred_title = None
    if image_filename and not any(x in image_filename.lower() for x in ("img_", "photo", "image", "screenshot", "untitled", "asset")):
        inferred_title = image_filename.rsplit('.', 1)[0].replace('_', ' ').replace('-', ' ').title()

    if green_ratio > 0.15:
        return "nature", inferred_title or "Verdant Eco-Territory", extracted_palette, ["Dense Foliage Cluster", "Mossy Stone Boulder", "Ancient Timber Trunk", "Fern Canopy", "Stone Basin"], "#15803d"
    elif blue_ratio > 0.15:
        return "cyberpunk", inferred_title or "Cobalt Research Facility", extracted_palette, ["Server Array", "Holo Terminal", "Cooling Core", "Relay Node", "Optical Cable Conduit"], "#00f2fe"
    elif gold_ratio > 0.12 or (avg_r > avg_b + 25 and brightness < 170):
        # Warm domestic interior or living room
        return "living_room", inferred_title or "Warm Domestic Sanctuary", extracted_palette, ["Velvet Sectional Sofa", "Mahogany Coffee Table", "Hardwood Bookshelf", "Decorative Area Rug", "Floor Standing Lamp"], extracted_palette.get("wall_rim", "#f59e0b")
    elif purple_ratio > 0.10:
        return "haunted", inferred_title or "Twilight Phantom Vault", extracted_palette, ["Ancient Sarcophagus", "Iron Candelabra", "Cobwebbed Bookcase", "Ornate Antique Mirror", "Gargoyle Pedestal"], "#a855f7"
    elif shadow_ratio > 0.45:
        return "dungeon", inferred_title or "Obsidian Underground Complex", extracted_palette, ["Heavy Steel Barrier", "Power Transformer", "Reinforced Pillar", "Industrial Pressure Tank", "Scaffold Tower"], extracted_palette.get("wall_rim", "#64748b")
    else:
        # Balanced daylight / general scene
        return "office", inferred_title or "Apex Sovereign Sector", extracted_palette, ["Architectural Divider", "Executive Workstation Desk", "Security Terminal Kiosk", "Display Pedestal", "Server Array"], extracted_palette.get("wall_rim", "#00f2fe")


def build_image_obstacle_grid(img: Image.Image, mw: int, mh: int, rng: random.Random) -> List[List[int]]:
    """
    Converts actual image composition and edges into a 2D tile grid.
    0 = Walkable floor, 1 = Solid wall/obstacle.
    Guarantees outer perimeter and creates natural room/corridor layouts reflecting the picture.
    """
    small = img.resize((mw, mh), Image.Resampling.BILINEAR)
    gray = small.convert("L")
    edges = gray.filter(ImageFilter.FIND_EDGES)
    edge_data = list(edges.getdata())
    lum_data = list(gray.getdata())

    grid = [[0 for _ in range(mw)] for _ in range(mh)]

    # Outer perimeter walls
    for x in range(mw):
        grid[0][x] = 1
        grid[mh - 1][x] = 1
    for y in range(mh):
        grid[y][0] = 1
        grid[y][mw - 1] = 1

    avg_edge = sum(edge_data) / max(1, len(edge_data))
    edge_threshold = max(28, avg_edge * 1.35)

    for y in range(2, mh - 2):
        for x in range(2, mw - 2):
            idx = y * mw + x
            edge_val = edge_data[idx]
            lum_val = lum_data[idx]
            if edge_val > edge_threshold or lum_val < 35:
                if rng.random() < 0.65:
                    grid[y][x] = 1

    # Carve 2-tile wide corridors to guarantee spaciousness and navigation
    for hy in [mh // 3, (2 * mh) // 3]:
        for hx in range(1, mw - 1):
            grid[hy][hx] = 0
            if hy + 1 < mh - 1:
                grid[hy + 1][hx] = 0

    for vx in [mw // 3, (2 * mw) // 3]:
        for vy in range(1, mh - 1):
            grid[vy][vx] = 0
            if vx + 1 < mw - 1:
                grid[vy][vx + 1] = 0

    return grid


def analyze_image_and_generate_campaign(
    image_bytes: bytes,
    difficulty: str = "medium",
    map_size: str = "standard",
    hazard_level: str = "moderate",
    custom_theme: Optional[str] = None,
    custom_prompt: Optional[str] = None,
    image_filename: Optional[str] = None
) -> GameWorld:
    """
    Advanced Computer Vision Environment Synthesizer:
    Analyzes actual image pixels, extracts authentic color palette, and generates unique 3-level campaign.
    """
    img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    theme, env_name, palette_dict, custom_objects, accent_color = classify_image_theme(
        img,
        image_filename=image_filename,
        custom_theme=custom_theme,
        custom_prompt=custom_prompt
    )

    print(f"[CV Synthesizer] Assigned Theme: {theme.upper()} | Env: {env_name} | Rim: {palette_dict.get('wall_rim')}")

    import random
    base_seed = random.randint(1, 99999999)
    campaign_levels: List[GameWorld] = []

    display_env_name = custom_prompt.title() if custom_prompt else env_name
    env_clean = display_env_name.split(":")[0].strip()

    custom_enemies_dict = {
        "guardian_name": f"{env_clean.upper()} WARDEN",
        "chaser_name": f"{env_clean.upper()} PATROL",
        "patrol_name": f"{env_clean.upper()} SENTRY",
        "objects": custom_objects,
        "palette": palette_dict
    }

    for lvl_num in (1, 2, 3):
        lvl_seed = base_seed + lvl_num * 54321
        lvl_world = generate_procedural_level(
            level_num=lvl_num,
            env_name=display_env_name,
            theme=theme,
            difficulty=difficulty,
            map_size=map_size,
            hazard_level=hazard_level,
            seed=lvl_seed,
            color_palette=palette_dict,
            custom_enemies=custom_enemies_dict
        )
        repaired_world = validate_and_repair_game_world(lvl_world)
        campaign_levels.append(repaired_world)

    primary = campaign_levels[0].model_copy(deep=True)
    primary.levels = campaign_levels
    return primary

