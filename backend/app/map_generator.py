import random
import math
from typing import List, Dict, Any, Optional, Tuple
from .schemas import GameWorld, MapConfig, Wall, GameObject, Collectible, ExitPoint, NPC, Objective, PlayerPosition, Enemy, VisualPalette

class Room:
    def __init__(self, x: int, y: int, w: int, h: int, tag: str = "room"):
        self.x = x
        self.y = y
        self.w = w
        self.h = h
        self.tag = tag
        self.center = (x + w // 2, y + h // 2)

    def intersects(self, other: 'Room', padding: int = 1) -> bool:
        return not (
            self.x + self.w + padding <= other.x or
            other.x + other.w + padding <= self.x or
            self.y + self.h + padding <= other.y or
            other.y + other.h + padding <= self.y
        )

ENEMY_THEMES = {
    "snow": {
        "guardian_name": "ANCIENT FROST TITAN YETI",
        "guardian_sprite": "yeti",
        "guardian_shape": "golem_titan",
        "guardian_color": "#f1f5f9",
        "guardian_eyes": "#38bdf8",
        "guardian_accessory": "ice_crown",
        "chaser_name": "BLIZZARD WOLF STALKER",
        "chaser_sprite": "beast",
        "chaser_shape": "quadruped_beast",
        "chaser_color": "#cbd5e1",
        "chaser_eyes": "#7dd3fc",
        "patrol_name": "GLACIAL SHARD SENTRY",
        "patrol_sprite": "laser",
        "patrol_shape": "mechanical_turret",
        "patrol_color": "#0284c7",
        "patrol_eyes": "#38bdf8",
        "objects": ["Penguin Nesting Colony", "Glacial Ice Spire", "Frozen Stalagmite", "Snowdrift Cache", "Glacial Cryo-Pod"],
        "object_colors": ["#0284c7", "#7dd3fc", "#bae6fd", "#e0f2fe", "#38bdf8"],
        "palette": {
            "floorColor": "#0c1a2e",
            "floorTexture": "snow",
            "wallTop": "#1e3a5f",
            "wallFront": "#0f233d",
            "wallRim": "#7dd3fc",
            "weather": "snow",
            "ambientLight": "#38bdf8"
        }
    },
    "volcano": {
        "guardian_name": "MAGMA CORE COLOSSUS",
        "guardian_sprite": "monster",
        "guardian_shape": "golem_titan",
        "guardian_color": "#1c1917",
        "guardian_eyes": "#f97316",
        "guardian_accessory": "flame_aura",
        "chaser_name": "INFERNAL HELLHOUND",
        "chaser_sprite": "beast",
        "chaser_shape": "quadruped_beast",
        "chaser_color": "#ea580c",
        "chaser_eyes": "#facc15",
        "patrol_name": "PYRO SENTRY TURRET",
        "patrol_sprite": "laser",
        "patrol_shape": "mechanical_turret",
        "patrol_color": "#b91c1c",
        "patrol_eyes": "#f97316",
        "objects": ["Basalt Monolith", "Magma Geyser", "Obsidian Altar", "Cooling Vent", "Heat Radiator"],
        "object_colors": ["#44403c", "#ea580c", "#292524", "#f97316", "#78350f"],
        "palette": {
            "floorColor": "#180606",
            "floorTexture": "cracks",
            "wallTop": "#451212",
            "wallFront": "#260a0a",
            "wallRim": "#f97316",
            "weather": "embers",
            "ambientLight": "#f97316"
        }
    },
    "desert": {
        "guardian_name": "PHARAOH'S DUNE WARDEN",
        "guardian_sprite": "monster",
        "guardian_shape": "golem_titan",
        "guardian_color": "#d97706",
        "guardian_eyes": "#fbbf24",
        "guardian_accessory": "horns",
        "chaser_name": "DESERT SCORPION STALKER",
        "chaser_sprite": "beast",
        "chaser_shape": "quadruped_beast",
        "chaser_color": "#b45309",
        "chaser_eyes": "#fef08a",
        "patrol_name": "MIRAGE SENTRY TURRET",
        "patrol_sprite": "laser",
        "patrol_shape": "mechanical_turret",
        "patrol_color": "#78350f",
        "patrol_eyes": "#f59e0b",
        "objects": ["Sandstone Obelisk", "Gold Sarcophagus", "Dune Cache", "Hieroglyph Tablet", "Ancient Urn"],
        "object_colors": ["#d97706", "#ffd700", "#b45309", "#f59e0b", "#92400e"],
        "palette": {
            "floorColor": "#1a1307",
            "floorTexture": "sand",
            "wallTop": "#78350f",
            "wallFront": "#451a03",
            "wallRim": "#fbbf24",
            "weather": "sand",
            "ambientLight": "#f59e0b"
        }
    },
    "ocean": {
        "guardian_name": "ABYSSAL LEVIATHAN PRIME",
        "guardian_sprite": "monster",
        "guardian_shape": "golem_titan",
        "guardian_color": "#0369a1",
        "guardian_eyes": "#38bdf8",
        "chaser_name": "DEEP TRENCH STALKER",
        "chaser_sprite": "beast",
        "chaser_shape": "quadruped_beast",
        "chaser_color": "#0284c7",
        "chaser_eyes": "#22d3ee",
        "patrol_name": "SONAR SENTRY TURRET",
        "patrol_sprite": "laser",
        "patrol_shape": "mechanical_turret",
        "patrol_color": "#075985",
        "patrol_eyes": "#00f2fe",
        "objects": ["Coral Spire", "Sunken Chest", "Hydrothermal Vent", "Ancient Anchor", "Submersible Hull"],
        "object_colors": ["#0284c7", "#38bdf8", "#0369a1", "#082f49", "#00f2fe"],
        "palette": {
            "floorColor": "#04192b",
            "floorTexture": "water",
            "wallTop": "#075985",
            "wallFront": "#082f49",
            "wallRim": "#38bdf8",
            "weather": "bubbles",
            "ambientLight": "#0284c7"
        }
    },
    "space": {
        "guardian_name": "VOID OVERLORD BEHEMOTH",
        "guardian_sprite": "monster",
        "guardian_shape": "golem_titan",
        "guardian_color": "#312e81",
        "guardian_eyes": "#c084fc",
        "chaser_name": "XENOMORPH SHADOW STALKER",
        "chaser_sprite": "beast",
        "chaser_shape": "quadruped_beast",
        "chaser_color": "#1e1b4b",
        "chaser_eyes": "#e879f9",
        "patrol_name": "ORBITAL BEAM TURRET",
        "patrol_sprite": "laser",
        "patrol_shape": "mechanical_turret",
        "patrol_color": "#4338ca",
        "patrol_eyes": "#a855f7",
        "objects": ["Alien Bio-Pod", "Gravity Relay", "Navigational Console", "Plasma Canister", "Airlock Valve"],
        "object_colors": ["#6366f1", "#a855f7", "#3b82f6", "#c084fc", "#4338ca"],
        "palette": {
            "floorColor": "#060714",
            "floorTexture": "circuit",
            "wallTop": "#1e1b4b",
            "wallFront": "#0f0c29",
            "wallRim": "#c084fc",
            "weather": "sparks",
            "ambientLight": "#a855f7"
        }
    },
    "haunted": {
        "guardian_name": "GRAND PHANTOM REAPER",
        "guardian_sprite": "ghost",
        "guardian_shape": "floating_spirit",
        "guardian_color": "#e9d5ff",
        "guardian_eyes": "#7c3aed",
        "chaser_name": "VENGEFUL WRAITH",
        "chaser_sprite": "ghost",
        "chaser_shape": "floating_spirit",
        "chaser_color": "#c084fc",
        "chaser_eyes": "#ff003c",
        "patrol_name": "FLOATING SPECTER",
        "patrol_sprite": "ghost",
        "patrol_shape": "floating_spirit",
        "patrol_color": "#d8b4fe",
        "patrol_eyes": "#9333ea",
        "objects": ["Cursed Tombstone", "Crypt Coffer", "Haunted Mirror", "Gargoyle Shrine", "Rune Altar"],
        "object_colors": ["#4c1d95", "#6b21a8", "#3b0764", "#7c3aed", "#581c87"],
        "palette": {
            "floorColor": "#0f0a17",
            "floorTexture": "cobblestone",
            "wallTop": "#2e1065",
            "wallFront": "#1e0a38",
            "wallRim": "#a855f7",
            "weather": "fog",
            "ambientLight": "#a855f7"
        }
    },
    "bank": {
        "guardian_name": "CHIEF SECURITY WARDEN",
        "guardian_sprite": "guard",
        "guardian_shape": "humanoid_guard",
        "guardian_color": "#1e293b",
        "guardian_eyes": "#ffd700",
        "chaser_name": "ARMED SECURITY GUARD",
        "chaser_sprite": "guard",
        "chaser_shape": "humanoid_guard",
        "chaser_color": "#334155",
        "chaser_eyes": "#facc15",
        "patrol_name": "LASER TRIPWIRE SENTRY",
        "patrol_sprite": "laser",
        "patrol_shape": "mechanical_turret",
        "patrol_color": "#0f172a",
        "patrol_eyes": "#ef4444",
        "objects": ["Massive Bank Vault Door", "Gold Bullion Pallet", "Cash Reserve Pallet", "Titanium Security Safe", "Deposit Box Rack"],
        "object_colors": ["#475569", "#ffd700", "#10b981", "#64748b", "#cbd5e1"],
        "palette": {
            "floorColor": "#0f172a",
            "floorTexture": "sand",
            "wallTop": "#1e293b",
            "wallFront": "#0f172a",
            "wallRim": "#ffd700",
            "weather": "dust",
            "ambientLight": "#ffd700"
        }
    },
    "cyberpunk": {
        "guardian_name": "CYBER CORE SENTINEL",
        "guardian_sprite": "drone",
        "guardian_shape": "winged_drone",
        "guardian_color": "#1e1115",
        "guardian_eyes": "#00f2fe",
        "chaser_name": "HUNTER DRONE",
        "chaser_sprite": "drone",
        "chaser_shape": "winged_drone",
        "chaser_color": "#181b2a",
        "chaser_eyes": "#00f2fe",
        "patrol_name": "LASER SENTRY TURRET",
        "patrol_sprite": "laser",
        "patrol_shape": "mechanical_turret",
        "patrol_color": "#0f172a",
        "patrol_eyes": "#ff0844",
        "objects": ["Server Array", "Cooling Terminal", "Substation Core", "Mainframe Console", "Quantum Relay"],
        "object_colors": ["#00f2fe", "#0284c7", "#1e293b", "#38bdf8", "#06b6d4"],
        "palette": {
            "floorColor": "#0a0e1c",
            "floorTexture": "circuit",
            "wallTop": "#1e293b",
            "wallFront": "#0f172a",
            "wallRim": "#00f2fe",
            "weather": "sparks",
            "ambientLight": "#00f2fe"
        }
    },
    "dungeon": {
        "guardian_name": "STONE GARGOYLE WARDEN",
        "guardian_sprite": "monster",
        "guardian_shape": "golem_titan",
        "guardian_color": "#475569",
        "guardian_eyes": "#f59e0b",
        "chaser_name": "SKELETAL STALKER",
        "chaser_sprite": "monster",
        "chaser_shape": "quadruped_beast",
        "chaser_color": "#64748b",
        "chaser_eyes": "#ef4444",
        "patrol_name": "TOMB SHADOW",
        "patrol_sprite": "ghost",
        "patrol_shape": "floating_spirit",
        "patrol_color": "#334155",
        "patrol_eyes": "#94a3b8",
        "objects": ["Ancient Pillar", "Stone Coffer", "Ritual Altar", "Gargoyle Bust", "Iron Maiden"],
        "object_colors": ["#334155", "#475569", "#64748b", "#1e293b", "#94a3b8"],
        "palette": {
            "floorColor": "#141419",
            "floorTexture": "cobblestone",
            "wallTop": "#334155",
            "wallFront": "#1e293b",
            "wallRim": "#94a3b8",
            "weather": "dust",
            "ambientLight": "#64748b"
        }
    },
    "classroom": {
        "guardian_name": "HEAD OF CAMPUS SECURITY",
        "guardian_sprite": "guard",
        "guardian_shape": "humanoid_guard",
        "guardian_color": "#451a03",
        "guardian_eyes": "#d97706",
        "chaser_name": "CAMPUS PATROL OFFICER",
        "chaser_sprite": "guard",
        "chaser_shape": "humanoid_guard",
        "chaser_color": "#78350f",
        "chaser_eyes": "#f59e0b",
        "patrol_name": "SURVEILLANCE SENTRY",
        "patrol_sprite": "laser",
        "patrol_shape": "mechanical_turret",
        "patrol_color": "#270e02",
        "patrol_eyes": "#d97706",
        "objects": ["Lecture Podium", "Reference Cabinet", "Whiteboard", "Desk Cluster", "Filing Unit"],
        "object_colors": ["#92400e", "#b45309", "#d97706", "#78350f", "#f59e0b"],
        "palette": {
            "floorColor": "#17120e",
            "floorTexture": "cobblestone",
            "wallTop": "#451a03",
            "wallFront": "#270e02",
            "wallRim": "#d97706",
            "weather": "dust",
            "ambientLight": "#d97706"
        }
    },
    "office": {
        "guardian_name": "BUILDING SECURITY CHIEF",
        "guardian_sprite": "guard",
        "guardian_shape": "humanoid_guard",
        "guardian_color": "#1e293b",
        "guardian_eyes": "#38bdf8",
        "chaser_name": "FLOOR PATROL GUARD",
        "chaser_sprite": "guard",
        "chaser_shape": "humanoid_guard",
        "chaser_color": "#334155",
        "chaser_eyes": "#0284c7",
        "patrol_name": "OPTICAL SENSOR SENTRY",
        "patrol_sprite": "laser",
        "patrol_shape": "mechanical_turret",
        "patrol_color": "#0f172a",
        "patrol_eyes": "#00f2fe",
        "objects": ["Workstation Desk", "Partition Divider", "Filing Unit", "Server Rack", "Water Cooler"],
        "object_colors": ["#334155", "#475569", "#1e293b", "#64748b", "#38bdf8"],
        "palette": {
            "floorColor": "#0f172a",
            "floorTexture": "grid",
            "wallTop": "#1e293b",
            "wallFront": "#0f172a",
            "wallRim": "#38bdf8",
            "weather": "dust",
            "ambientLight": "#38bdf8"
        }
    },
    "nature": {
        "guardian_name": "ANCIENT GROVE BEAST",
        "guardian_sprite": "monster",
        "guardian_shape": "golem_titan",
        "guardian_color": "#14532d",
        "guardian_eyes": "#4ade80",
        "chaser_name": "SHADOW VIPER",
        "chaser_sprite": "beast",
        "chaser_shape": "quadruped_beast",
        "chaser_color": "#166534",
        "chaser_eyes": "#22c55e",
        "patrol_name": "SPORE STALKER",
        "patrol_sprite": "laser",
        "patrol_shape": "mechanical_turret",
        "patrol_color": "#15803d",
        "patrol_eyes": "#86efac",
        "objects": ["Potted Fern Cluster", "Stone Arbor", "Monstera Tree", "Botanical Bench", "Overgrown Root"],
        "object_colors": ["#15803d", "#166534", "#22c55e", "#14532d", "#4ade80"],
        "palette": {
            "floorColor": "#0a1711",
            "floorTexture": "organic",
            "wallTop": "#14532d",
            "wallFront": "#052e16",
            "wallRim": "#22c55e",
            "weather": "fog",
            "ambientLight": "#22c55e"
        }
    },
    "railway": {
        "guardian_name": "TRANSIT COMMANDER MARSHALL",
        "guardian_sprite": "guard",
        "guardian_shape": "humanoid_guard",
        "guardian_color": "#1e293b",
        "guardian_eyes": "#f59e0b",
        "guardian_accessory": "peaked_cap",
        "chaser_name": "RAILWAY SECURITY OFFICER",
        "chaser_sprite": "guard",
        "chaser_shape": "humanoid_guard",
        "chaser_color": "#0f172a",
        "chaser_eyes": "#38bdf8",
        "patrol_name": "TRACK SURVEILLANCE SENTRY",
        "patrol_sprite": "laser",
        "patrol_shape": "mechanical_turret",
        "patrol_color": "#334155",
        "patrol_eyes": "#ef4444",
        "objects": ["High-Speed Metro Train", "Locomotive Engine", "Departure Schedule Board", "Ticket Vending Kiosk", "Turnstile Gate Barrier", "Platform Waiting Bench"],
        "object_colors": ["#0284c7", "#f59e0b", "#10b981", "#64748b", "#cbd5e1", "#38bdf8"],
        "palette": {
            "floorColor": "#141720",
            "floorTexture": "railway",
            "wallTop": "#334155",
            "wallFront": "#1e293b",
            "wallRim": "#f59e0b",
            "weather": "dust",
            "ambientLight": "#f59e0b"
        }
    },
    "police": {
        "guardian_name": "COMMISSIONER VANCE",
        "guardian_sprite": "guard",
        "guardian_shape": "humanoid_guard",
        "guardian_color": "#0f172a",
        "guardian_eyes": "#38bdf8",
        "guardian_accessory": "police_cap",
        "chaser_name": "POLICE CONSTABLE",
        "chaser_sprite": "guard",
        "chaser_shape": "humanoid_guard",
        "chaser_color": "#1e3a8a",
        "chaser_eyes": "#60a5fa",
        "patrol_name": "PRECINCT CCTV SENTRY",
        "patrol_sprite": "laser",
        "patrol_shape": "mechanical_turret",
        "patrol_color": "#1e293b",
        "patrol_eyes": "#ef4444",
        "objects": ["Holding Cell Bars", "Precinct Booking Desk", "Interrogation Table", "Police Siren Beacon", "Evidence Locker"],
        "object_colors": ["#475569", "#1e3a8a", "#334155", "#ef4444", "#3b82f6"],
        "palette": {
            "floorColor": "#0d1322",
            "floorTexture": "police",
            "wallTop": "#1e293b",
            "wallFront": "#0f172a",
            "wallRim": "#3b82f6",
            "weather": "dust",
            "ambientLight": "#3b82f6"
        }
    },
    "hospital": {
        "guardian_name": "CHIEF MEDICAL INSPECTOR",
        "guardian_sprite": "guard",
        "guardian_shape": "humanoid_guard",
        "guardian_color": "#0284c7",
        "guardian_eyes": "#38bdf8",
        "guardian_accessory": "peaked_cap",
        "chaser_name": "ORDERLY SANITATION PATROL",
        "chaser_sprite": "guard",
        "chaser_shape": "humanoid_guard",
        "chaser_color": "#0369a1",
        "chaser_eyes": "#7dd3fc",
        "patrol_name": "BIO-SCANNER SENTRY",
        "patrol_sprite": "laser",
        "patrol_shape": "mechanical_turret",
        "patrol_color": "#0f172a",
        "patrol_eyes": "#10b981",
        "objects": ["Patient Hospital Bed", "Vitals Heart Monitor", "Surgical Operating Lamp", "Medicine Cabinet", "Mobile MRI Scanner"],
        "object_colors": ["#38bdf8", "#10b981", "#f8fafc", "#0284c7", "#64748b"],
        "palette": {
            "floorColor": "#0c1a24",
            "floorTexture": "hospital",
            "wallTop": "#1e3a5f",
            "wallFront": "#0f233d",
            "wallRim": "#38bdf8",
            "weather": "fog",
            "ambientLight": "#38bdf8"
        }
    },
    "kitchen": {
        "guardian_name": "EXECUTIVE HEAD CHEF",
        "guardian_sprite": "guard",
        "guardian_shape": "humanoid_guard",
        "guardian_color": "#b91c1c",
        "guardian_eyes": "#f97316",
        "guardian_accessory": "peaked_cap",
        "chaser_name": "LINE COOK ENFORCER",
        "chaser_sprite": "guard",
        "chaser_shape": "humanoid_guard",
        "chaser_color": "#c2410c",
        "chaser_eyes": "#fbbf24",
        "patrol_name": "HOOD VENT SENTRY",
        "patrol_sprite": "laser",
        "patrol_shape": "mechanical_turret",
        "patrol_color": "#475569",
        "patrol_eyes": "#ea580c",
        "objects": ["Commercial Stove Range", "Stainless Prep Island", "Walk-in Refrigerator", "Industrial Dish Rack", "Pantry Food Shelf"],
        "object_colors": ["#f97316", "#cbd5e1", "#94a3b8", "#ea580c", "#854d0e"],
        "palette": {
            "floorColor": "#1c1412",
            "floorTexture": "kitchen",
            "wallTop": "#451a03",
            "wallFront": "#260e02",
            "wallRim": "#f97316",
            "weather": "embers",
            "ambientLight": "#f97316"
        }
    },
    "airport": {
        "guardian_name": "TSA CHIEF MARSHAL",
        "guardian_sprite": "guard",
        "guardian_shape": "humanoid_guard",
        "guardian_color": "#1e293b",
        "guardian_eyes": "#00f2fe",
        "guardian_accessory": "peaked_cap",
        "chaser_name": "TARMAC PATROL AGENT",
        "chaser_sprite": "guard",
        "chaser_shape": "humanoid_guard",
        "chaser_color": "#0f172a",
        "chaser_eyes": "#f59e0b",
        "patrol_name": "AIR TRAFFIC RADAR SENTRY",
        "patrol_sprite": "laser",
        "patrol_shape": "mechanical_turret",
        "patrol_color": "#334155",
        "patrol_eyes": "#00f2fe",
        "objects": ["Commercial Passenger Aircraft", "Baggage Conveyor Belt", "Air Traffic Radar Tower", "Boarding Gate Terminal", "Luggage X-Ray Scanner"],
        "object_colors": ["#0284c7", "#f59e0b", "#00f2fe", "#64748b", "#cbd5e1"],
        "palette": {
            "floorColor": "#111827",
            "floorTexture": "railway",
            "wallTop": "#374151",
            "wallFront": "#1f2937",
            "wallRim": "#00f2fe",
            "weather": "dust",
            "ambientLight": "#00f2fe"
        }
    },
    "living_room": {
        "guardian_name": "DOMESTIC SECURITY WARDEN",
        "guardian_sprite": "guard",
        "guardian_shape": "humanoid_guard",
        "guardian_color": "#451a03",
        "guardian_eyes": "#f59e0b",
        "guardian_accessory": "peaked_cap",
        "chaser_name": "ROOM PATROL ENFORCER",
        "chaser_sprite": "guard",
        "chaser_shape": "humanoid_guard",
        "chaser_color": "#78350f",
        "chaser_eyes": "#fbbf24",
        "patrol_name": "SURVEILLANCE SENTRY BOT",
        "patrol_sprite": "laser",
        "patrol_shape": "mechanical_turret",
        "patrol_color": "#270e02",
        "patrol_eyes": "#f59e0b",
        "objects": ["Velvet Sectional Sofa", "Mahogany Coffee Table", "Hardwood Bookshelf", "Decorative Area Rug", "Floor Standing Lamp"],
        "object_colors": ["#c2410c", "#92400e", "#b45309", "#78350f", "#f59e0b"],
        "palette": {
            "floorColor": "#1c140e",
            "floorTexture": "wood",
            "wallTop": "#451a03",
            "wallFront": "#270e02",
            "wallRim": "#f59e0b",
            "weather": "dust",
            "ambientLight": "#f59e0b"
        }
    },
    "cyberpunk_street": {
        "guardian_name": "METRO ENFORCER TITAN",
        "guardian_sprite": "monster",
        "guardian_shape": "golem_titan",
        "guardian_color": "#18181b",
        "guardian_eyes": "#00f2fe",
        "guardian_accessory": "horns",
        "chaser_name": "CYBERNETIC STALKER",
        "chaser_sprite": "guard",
        "chaser_shape": "humanoid_guard",
        "chaser_color": "#27272a",
        "chaser_eyes": "#ff007f",
        "patrol_name": "LASER SCANNER BEACON",
        "patrol_sprite": "laser",
        "patrol_shape": "mechanical_turret",
        "patrol_color": "#09090b",
        "patrol_eyes": "#00f2fe",
        "objects": ["Neon Billboard Frame", "Cyber Dumpster Unit", "Steel Barrier Gate", "Pneumatic Tube Terminal", "Street Hydrant Core"],
        "object_colors": ["#00f2fe", "#ff007f", "#3b82f6", "#71717a", "#e4e4e7"],
        "palette": {
            "floorColor": "#09090b",
            "floorTexture": "circuit",
            "wallTop": "#27272a",
            "wallFront": "#18181b",
            "wallRim": "#00f2fe",
            "weather": "sparks",
            "ambientLight": "#00f2fe"
        }
    },
    "gym": {
        "guardian_name": "TITAN IRON ENFORCER",
        "guardian_sprite": "monster",
        "guardian_shape": "golem_titan",
        "guardian_color": "#be123c",
        "guardian_eyes": "#f43f5e",
        "guardian_accessory": "flame_aura",
        "chaser_name": "CARDIO PATROL BOT",
        "chaser_sprite": "guard",
        "chaser_shape": "humanoid_guard",
        "chaser_color": "#e11d48",
        "chaser_eyes": "#fda4af",
        "patrol_name": "HEAVY SQUAT SENTRY",
        "patrol_sprite": "laser",
        "patrol_shape": "mechanical_turret",
        "patrol_color": "#881337",
        "patrol_eyes": "#f43f5e",
        "objects": ["Heavy Olympic Barbell Rack", "Incline Dumbbell Bench", "Power Squat Cage", "Cardio Treadmill Station", "Kettlebell Pyramids"],
        "object_colors": ["#e11d48", "#f43f5e", "#fda4af", "#be123c", "#4c0519"],
        "palette": {
            "floorColor": "#140c10",
            "floorTexture": "cracks",
            "wallTop": "#4c0519",
            "wallFront": "#280510",
            "wallRim": "#f43f5e",
            "weather": "sparks",
            "ambientLight": "#f43f5e"
        }
    },
    "castle": {
        "guardian_name": "ROYAL CASTLE HIGH COMMANDER",
        "guardian_sprite": "guard",
        "guardian_shape": "humanoid_guard",
        "guardian_color": "#475569",
        "guardian_eyes": "#f59e0b",
        "guardian_accessory": "horns",
        "chaser_name": "CASTLE GUARD SENTINEL",
        "chaser_sprite": "guard",
        "chaser_shape": "humanoid_guard",
        "chaser_color": "#334155",
        "chaser_eyes": "#ef4444",
        "patrol_name": "FLAMING BRAZIER SENTRY",
        "patrol_sprite": "laser",
        "patrol_shape": "mechanical_turret",
        "patrol_color": "#1e293b",
        "patrol_eyes": "#f59e0b",
        "objects": ["Royal Velvet Throne", "Suit of Medieval Plate Armor", "Flaming Iron Brazier", "Brass-banded Treasure Chest", "Stone Sarcophagus"],
        "object_colors": ["#ffd700", "#94a3b8", "#f97316", "#d97706", "#64748b"],
        "palette": {
            "floorColor": "#17141f",
            "floorTexture": "castle_stone",
            "wallTop": "#3f3952",
            "wallFront": "#252033",
            "wallRim": "#f59e0b",
            "weather": "dust",
            "ambientLight": "#f59e0b"
        }
    }
}

import re

def resolve_theme_key(theme_str: str) -> str:
    t = (theme_str or "").lower().strip()
    words = set(re.findall(r'[a-z0-9]+', t))

    if any(w in words for w in ["castle", "fortress", "palace", "citadel", "kingdom", "throne", "medieval", "keep"]):
        return "castle"
    if any(w in words for w in ["gym", "fitness", "workout", "weights", "crossfit", "bench", "barbell", "dumbbell", "treadmill"]):
        return "gym"
    if any(w in words for w in ["hospital", "haspital", "hopital", "hosp", "clinic", "medical", "doctor", "nurse", "surgery", "patient", "infirmary", "ambulance", "stretcher", "ward", "health", "trauma", "triage", "icu", "er", "emergency"]):
        return "hospital"
    if any(w in words for w in ["police", "cop", "precinct", "constable", "sheriff", "jail", "prison", "interrogation", "lockup", "detective"]):
        return "police"
    if any(w in words for w in ["railway", "train", "subway", "metro", "transit", "locomotive", "track", "platform", "depot"]):
        return "railway"
    if "station" in words and not any(x in words for x in ["police", "nurse", "aid", "space", "fire"]):
        return "railway"
    if any(w in words for w in ["kitchen", "restaurant", "chef", "cook", "dining", "bakery", "cafe", "bistro", "stove", "pantry", "culinary"]):
        return "kitchen"
    if any(w in words for w in ["airport", "airplane", "plane", "aircraft", "hangar", "runway", "tarmac", "terminal", "flight"]):
        return "airport"
    if any(w in words for w in ["snow", "ice", "frost", "mountain", "arctic", "winter", "glacier", "tundra", "cold", "blizzard", "penguin"]):
        return "snow"
    if any(w in words for w in ["volcano", "lava", "fire", "inferno", "magma", "molten", "burn"]):
        return "volcano"
    if any(w in words for w in ["desert", "sand", "pyramid", "tomb", "dune", "egypt"]):
        return "desert"
    if any(w in words for w in ["ocean", "underwater", "sea", "aquatic", "abyss", "reef", "water"]):
        return "ocean"
    if any(w in words for w in ["space", "alien", "cosmic", "void", "galaxy", "starship", "orbit", "space_station"]):
        return "space"
    if any(w in words for w in ["haunt", "ghost", "phantom", "spooky", "wraith", "mansion", "horror", "crypt", "specter", "undead"]):
        return "haunted"
    if any(w in words for w in ["bank", "vault", "guard", "security", "laser", "heist", "money", "gold", "cash", "teller", "bullion"]):
        return "bank"
    if any(w in words for w in ["cyber", "cyberpunk", "tech", "server", "matrix", "drone", "lab", "robot"]):
        return "cyberpunk"
    if any(w in words for w in ["dungeon", "catacomb", "relic", "stone", "cave"]):
        return "dungeon"
    if any(w in words for w in ["class", "classroom", "school", "auditorium", "lecture", "study"]):
        return "classroom"
    if any(w in words for w in ["office", "desk", "work", "cubicle", "corporate"]):
        return "office"
    if any(w in words for w in ["living", "couch", "sofa", "bedroom", "home", "house", "lounge", "apartment", "dorm", "room"]):
        return "living_room"
    if any(w in words for w in ["nature", "forest", "park", "garden", "plant", "jungle", "swamp", "tree", "yard"]):
        return "nature"
    if any(w in words for w in ["street", "city", "urban", "road", "alley", "plaza"]):
        return "cyberpunk_street"
    return t if t else "custom"

def generate_procedural_level(
    level_num: int,
    env_name: str,
    theme: str,
    difficulty: str,
    map_size: str,
    hazard_level: str,
    seed: Optional[int] = None,
    color_palette: Optional[Dict[str, str]] = None,
    custom_enemies: Optional[Dict[str, Any]] = None,
    custom_description: Optional[str] = None
) -> GameWorld:
    rng = random.Random(seed if seed is not None else (level_num * 10007 + random.randint(1, 99999)))

    # Resolve enemy theme config via semantic alias resolver
    resolved_theme = resolve_theme_key(theme)
    if resolved_theme in ENEMY_THEMES:
        theme_cfg = dict(ENEMY_THEMES[resolved_theme])
    else:
        # Dynamically synthesize full custom theme config for ANY novel prompt or setting
        clean_env = env_name.split(":")[0].strip() or "Custom Zone"
        theme_cfg = {
            "guardian_name": f"{clean_env.upper()} GUARDIAN",
            "guardian_sprite": "monster",
            "guardian_shape": "golem_titan",
            "guardian_color": "#00f2fe",
            "guardian_eyes": "#ff007f",
            "guardian_accessory": "flame_aura",
            "chaser_name": f"{clean_env.upper()} ENFORCER",
            "chaser_sprite": "beast",
            "chaser_shape": "quadruped_beast",
            "chaser_color": "#3b82f6",
            "chaser_eyes": "#00f2fe",
            "patrol_name": f"{clean_env.upper()} SENTRY",
            "patrol_sprite": "laser",
            "patrol_shape": "mechanical_turret",
            "patrol_color": "#1e293b",
            "patrol_eyes": "#ef4444",
            "objects": [f"{clean_env} Apparatus", f"{clean_env} Terminal Core", "Power Capacitor Array", "Reinforced Pillar", "Energy Pylon"],
            "object_colors": ["#00f2fe", "#3b82f6", "#f59e0b", "#10b981", "#8b5cf6"],
            "palette": {
                "floorColor": "#0a0e1c",
                "floorTexture": "grid",
                "wallTop": "#1e293b",
                "wallFront": "#0f172a",
                "wallRim": "#00f2fe",
                "weather": "dust",
                "ambientLight": "#00f2fe"
            }
        }

    if custom_enemies:
        for k in (
            "guardian_name", "guardian_sprite", "guardian_shape", "guardian_color", "guardian_eyes", "guardian_accessory",
            "chaser_name", "chaser_sprite", "chaser_shape", "chaser_color", "chaser_eyes",
            "patrol_name", "patrol_sprite", "patrol_shape", "patrol_color", "patrol_eyes",
            "objects", "object_colors", "guide_name"
        ):
            if k in custom_enemies and custom_enemies[k]:
                theme_cfg[k] = custom_enemies[k]

    # Resolve Dynamic VisualPalette
    pal_data = color_palette or (custom_enemies.get("palette") if custom_enemies else None) or {}
    default_pal = theme_cfg.get("palette", {})
    final_palette = VisualPalette(
        floorColor=pal_data.get("floor_color") or pal_data.get("floorColor") or default_pal.get("floorColor", "#0a0e1c"),
        floorTexture=pal_data.get("floor_texture") or pal_data.get("floorTexture") or default_pal.get("floorTexture", "grid"),
        wallTop=pal_data.get("wall_top") or pal_data.get("wallTop") or default_pal.get("wallTop", "#1e293b"),
        wallFront=pal_data.get("wall_front") or pal_data.get("wallFront") or default_pal.get("wallFront", "#0f172a"),
        wallRim=pal_data.get("wall_rim") or pal_data.get("wallRim") or default_pal.get("wallRim", "#00f2fe"),
        weather=pal_data.get("weather") or default_pal.get("weather"),
        ambientLight=pal_data.get("ambient_light") or pal_data.get("ambientLight") or default_pal.get("ambientLight")
    )

    # 1. Dimensions based on map_size & level (ENLARGED MAPS)
    base_dims = {"compact": (28, 20), "standard": (34, 24), "large": (42, 28)}.get(map_size, (34, 24))
    mw = base_dims[0] + (level_num - 1) * 4
    mh = base_dims[1] + (level_num - 1) * 2

    # Grid: True = Wall, False = Floor (Open)
    grid = [[True for _ in range(mw)] for _ in range(mh)]

    # 2. Procedural Theme-Specific Architecture
    rooms: List[Room] = []
    terminal_room: Optional[Room] = None

    # For Level >= 2: create a dedicated Terminal Sanctum along an outer boundary
    if level_num >= 2:
        trw = rng.randint(6, 7)
        trh = rng.randint(5, 6)
        edge_choices = [
            (mw - trw - 2, rng.randint(2, mh - trh - 2)),  # East
            (rng.randint(2, mw - trw - 2), 2),              # North
            (2, rng.randint(2, mh - trh - 2)),              # West
            (rng.randint(2, mw - trw - 2), mh - trh - 2),  # South
        ]
        rng.shuffle(edge_choices)
        terminal_room = Room(edge_choices[0][0], edge_choices[0][1], trw, trh, "terminal_room")
        rooms.append(terminal_room)

    if resolved_theme == "castle":
        # 🏰 ROYAL CASTLE ARCHITECTURE:
        gh_w = rng.randint(7, 9)
        gh_h = rng.randint(6, 7)
        gh_x = max(2, min(mw - gh_w - 2, mw // 2 - gh_w // 2 + rng.randint(-2, 2)))
        gh_y = max(2, min(mh - gh_h - 2, mh // 2 - gh_h // 2 + rng.randint(-2, 2)))
        great_hall = Room(gh_x, gh_y, gh_w, gh_h, "great_hall")
        if not any(great_hall.intersects(r, padding=1) for r in rooms):
            rooms.append(great_hall)

        # 4 Corner Towers with randomized dimensions
        towers = [
            (2, 2, rng.randint(5, 6), rng.randint(5, 6), "nw_tower"),
            (mw - 8, 2, rng.randint(5, 6), rng.randint(5, 6), "ne_tower"),
            (2, mh - 8, rng.randint(5, 6), rng.randint(5, 6), "sw_tower"),
            (mw - 8, mh - 8, rng.randint(5, 6), rng.randint(5, 6), "se_tower"),
        ]
        for tx, ty, tw, th, tag in towers:
            tower = Room(tx, ty, tw, th, tag)
            if not any(tower.intersects(r, padding=1) for r in rooms):
                rooms.append(tower)

    elif resolved_theme == "hospital":
        # 🏥 CLINICAL HOSPITAL WING ARCHITECTURE:
        cat_w = rng.randint(7, 9)
        cat_h = rng.randint(5, 6)
        cat_x = max(2, min(mw - cat_w - 2, mw // 2 - cat_w // 2 + rng.randint(-2, 2)))
        cat_y = max(2, min(mh - cat_h - 2, mh // 2 - cat_h // 2 + rng.randint(-1, 1)))
        atrium = Room(cat_x, cat_y, cat_w, cat_h, "triage_atrium")
        if not any(atrium.intersects(r, padding=1) for r in rooms):
            rooms.append(atrium)

    elif resolved_theme in ("living_room", "home", "bedroom"):
        # 🛋️ OPEN-CONCEPT RESIDENTIAL BLUEPRINT:
        l_w = rng.randint(8, 10)
        l_h = rng.randint(6, 7)
        l_x = max(2, min(mw - l_w - 2, mw // 2 - l_w // 2 + rng.randint(-2, 2)))
        l_y = max(2, min(mh - l_h - 2, mh // 2 - l_h // 2 + rng.randint(-2, 2)))
        lounge = Room(l_x, l_y, l_w, l_h, "living_room")
        if not any(lounge.intersects(r, padding=1) for r in rooms):
            rooms.append(lounge)

    elif resolved_theme == "gym":
        # 🏋️ ATHLETIC TRAINING COMPLEX:
        g_w = rng.randint(8, 10)
        g_h = rng.randint(6, 7)
        g_x = max(2, min(mw - g_w - 2, mw // 2 - g_w // 2 + rng.randint(-2, 2)))
        g_y = max(2, min(mh - g_h - 2, mh // 2 - g_h // 2 + rng.randint(-2, 2)))
        iron_bay = Room(g_x, g_y, g_w, g_h, "weight_room")
        if not any(iron_bay.intersects(r, padding=1) for r in rooms):
            rooms.append(iron_bay)

    # Fill remaining space procedurally with randomized theme rooms
    target_count = 7 + level_num * 2
    attempts = 0
    while len(rooms) < target_count and attempts < 350:
        attempts += 1
        rw = rng.randint(5, 7)
        rh = rng.randint(4, 6)
        rx = rng.randint(2, mw - rw - 2)
        ry = rng.randint(2, mh - rh - 2)
        new_room = Room(rx, ry, rw, rh)
        if any(new_room.intersects(r, padding=1) for r in rooms):
            continue
        rooms.append(new_room)

    # Fallback to ensure minimal rooms
    if len([r for r in rooms if r.tag != "terminal_room"]) < 4:
        for fx, fy in [(2, 2), (mw - 8, 2), (2, mh - 8), (mw - 8, mh - 8)]:
            fr = Room(fx, fy, 6, 6)
            if not any(fr.intersects(r, padding=1) for r in rooms):
                rooms.append(fr)

    regular_rooms = [r for r in rooms if r.tag != "terminal_room"]
    regular_rooms.sort(key=lambda r: r.center[0] + r.center[1])
    spawn_room = regular_rooms[0]
    spawn_room.tag = "spawn"
    exit_room = regular_rooms[-1]
    exit_room.tag = "exit"

    middle_rooms = regular_rooms[1:-1]
    rng.shuffle(middle_rooms)
    key_rooms_count = 2 if level_num >= 2 else 1
    key_rooms = middle_rooms[:min(key_rooms_count, len(middle_rooms))]
    for kr in key_rooms:
        kr.tag = "key"

    # 3. Carve Regular Rooms into Grid
    for r in regular_rooms:
        for y in range(r.y, r.y + r.h):
            for x in range(r.x, r.x + r.w):
                if 1 <= x < mw - 1 and 1 <= y < mh - 1:
                    grid[y][x] = False

    def is_in_terminal_room(x: int, y: int) -> bool:
        if terminal_room is None:
            return False
        return (terminal_room.x <= x < terminal_room.x + terminal_room.w and
                terminal_room.y <= y < terminal_room.y + terminal_room.h)

    # 4. Connect Rooms with 2-tile wide corridors (avoiding terminal room)
    def carve_corridor(x1: int, y1: int, x2: int, y2: int):
        if rng.choice([True, False]):
            for x in range(min(x1, x2), max(x1, x2) + 1):
                for dy in range(2):
                    ny = y1 + dy
                    if 1 <= ny < mh - 1 and 1 <= x < mw - 1 and not is_in_terminal_room(x, ny):
                        grid[ny][x] = False
            for y in range(min(y1, y2), max(y1, y2) + 1):
                for dx in range(2):
                    nx = x2 + dx
                    if 1 <= nx < mw - 1 and 1 <= y < mh - 1 and not is_in_terminal_room(nx, y):
                        grid[y][nx] = False
        else:
            for y in range(min(y1, y2), max(y1, y2) + 1):
                for dx in range(2):
                    nx = x1 + dx
                    if 1 <= nx < mw - 1 and 1 <= y < mh - 1 and not is_in_terminal_room(nx, y):
                        grid[y][nx] = False
            for x in range(min(x1, x2), max(x1, x2) + 1):
                for dy in range(2):
                    ny = y2 + dy
                    if 1 <= ny < mh - 1 and 1 <= x < mw - 1 and not is_in_terminal_room(x, ny):
                        grid[ny][x] = False

    # Connect regular rooms in sequence
    for i in range(len(regular_rooms) - 1):
        c1 = regular_rooms[i].center
        c2 = regular_rooms[i + 1].center
        carve_corridor(c1[0], c1[1], c2[0], c2[1])

    # Extra interconnecting loop corridors between regular rooms
    loop_candidates = [r for r in regular_rooms if r.tag != "exit"]
    for _ in range(max(1, len(loop_candidates) // 2)):
        r_a = rng.choice(loop_candidates)
        r_b = rng.choice(loop_candidates)
        if r_a != r_b:
            carve_corridor(r_a.center[0], r_a.center[1], r_b.center[0], r_b.center[1])

    # For Level >= 2: Enclose Terminal Sanctum with solid normal walls and exactly ONE doorway
    terminal_door: Optional[Tuple[int, int]] = None
    if level_num >= 2 and terminal_room is not None:
        trx, try_, trw, trh = terminal_room.x, terminal_room.y, terminal_room.w, terminal_room.h

        # 1. Carve interior tiles only
        for y in range(try_ + 1, try_ + trh - 1):
            for x in range(trx + 1, trx + trw - 1):
                grid[y][x] = False

        # 2. Pick nearest non-exit regular room
        connect_candidates = [r for r in regular_rooms if r.tag != "exit"]
        closest_room = min(
            connect_candidates,
            key=lambda r: (r.center[0] - terminal_room.center[0])**2 + (r.center[1] - terminal_room.center[1])**2
        )

        cx, cy = terminal_room.center
        tx, ty = closest_room.center

        # Candidate doors on each of the 4 perimeter walls
        candidates = []
        if try_ - 1 >= 1:
            candidates.append(((cx, try_), (cx, try_ - 1)))
        if try_ + trh < mh - 1:
            candidates.append(((cx, try_ + trh - 1), (cx, try_ + trh)))
        if trx - 1 >= 1:
            candidates.append(((trx, cy), (trx - 1, cy)))
        if trx + trw < mw - 1:
            candidates.append(((trx + trw - 1, cy), (trx + trw, cy)))

        candidates.sort(key=lambda item: (item[1][0] - tx)**2 + (item[1][1] - ty)**2)
        chosen_door, chosen_outside = candidates[0]
        terminal_door = chosen_door

        # Carve corridor from outside tile to closest room
        carve_corridor(chosen_outside[0], chosen_outside[1], tx, ty)
        grid[chosen_outside[1]][chosen_outside[0]] = False
        grid[chosen_door[1]][chosen_door[0]] = False

        # Strictly enforce ALL other perimeter tiles of terminal_room as SOLID WALLS
        for py in range(try_, try_ + trh):
            for px in range(trx, trx + trw):
                if px == trx or px == trx + trw - 1 or py == try_ or py == try_ + trh - 1:
                    if (px, py) != chosen_door:
                        grid[py][px] = True
                    else:
                        grid[py][px] = False

    # 5. Extract Wall Segments
    walls: List[Wall] = []
    # Outer boundaries
    walls.append(Wall(x=0, y=0, width=mw, height=1))
    walls.append(Wall(x=0, y=mh - 1, width=mw, height=1))
    walls.append(Wall(x=0, y=0, width=1, height=mh))
    walls.append(Wall(x=mw - 1, y=0, width=1, height=mh))

    # Internal wall clustering using greedy horizontal run-length encoding
    visited = [[False for _ in range(mw)] for _ in range(mh)]
    for y in range(1, mh - 1):
        x = 1
        while x < mw - 1:
            if grid[y][x] and not visited[y][x]:
                run_len = 0
                while (x + run_len < mw - 1) and grid[y][x + run_len] and not visited[y][x + run_len]:
                    visited[y][x + run_len] = True
                    run_len += 1
                if run_len > 0:
                    walls.append(Wall(x=x, y=y, width=run_len, height=1))
                    x += run_len
            else:
                x += 1

    # 6. Positions for Player and Exit
    px, py = spawn_room.center
    ex, ey = exit_room.center
    grid[py][px] = False
    grid[ey][ex] = False

    # 7. Collectibles: Keys, Thematic Items, and High-Value Relics
    collectibles: List[Collectible] = []
    required_items: List[str] = []

    # Sector Key name tailored to setting
    key_names_by_theme = {
        "bank": "Vault Master Key",
        "police": "Evidence Locker Key",
        "railway": "Platform Master Key",
        "snow": "Frost Crystal Key",
        "hospital": "Pharmacy Keycard",
        "kitchen": "Pantry Vault Key",
        "airport": "Tarmac Gate Keycard",
        "castle": "Royal Citadel Key",
        "living_room": "Master Suite Key",
        "gym": "VIP Locker Key",
    }

    # Theme-tailored collectibles:
    if resolved_theme == "bank":
        primary_item_name = "Stack of Cash"
        primary_type = "cash"
        high_val_name = "Gold Bullion Bar"
        high_val_type = "gold"
    elif resolved_theme == "police":
        primary_item_name = "Confiscated Evidence Dossier"
        primary_type = "evidence"
        high_val_name = "Police Honor Star"
        high_val_type = "badge"
    elif resolved_theme == "railway":
        primary_item_name = "Commuter Transit Pass"
        primary_type = "pass"
        high_val_name = "Golden Transit Token"
        high_val_type = "token"
    elif resolved_theme == "snow":
        primary_item_name = "Frost Ice Shard"
        primary_type = "gem"
        high_val_name = "Glacial Star Relic"
        high_val_type = "star"
    elif resolved_theme == "hospital":
        primary_item_name = "Sterile Medical Kit"
        primary_type = "medkit"
        high_val_name = "Golden Scalpel"
        high_val_type = "star"
    elif resolved_theme == "kitchen":
        primary_item_name = "Secret Recipe Scroll"
        primary_type = "recipe"
        high_val_name = "Golden Chef Spatula"
        high_val_type = "star"
    elif resolved_theme == "airport":
        primary_item_name = "Baggage Priority Tag"
        primary_type = "tag"
        high_val_name = "Golden Boarding Pass"
        high_val_type = "pass"
    elif resolved_theme == "castle":
        primary_item_name = "Ancient Gold Sovereign"
        primary_type = "gold"
        high_val_name = "Royal Crown Jewel"
        high_val_type = "star"
    elif resolved_theme == "living_room":
        primary_item_name = "Antique Pocket Watch"
        primary_type = "gem"
        high_val_name = "Heirloom Gold Pendant"
        high_val_type = "star"
    elif resolved_theme == "gym":
        primary_item_name = "Electrolyte Energy Gel"
        primary_type = "gem"
        high_val_name = "Championship Gold Trophy"
        high_val_type = "star"
    else:
        primary_item_name = "Energy Shard"
        primary_type = "gem"
        high_val_name = "Gold Star"
        high_val_type = "star"

    if custom_enemies and "collectibles" in custom_enemies and isinstance(custom_enemies["collectibles"], list) and len(custom_enemies["collectibles"]) >= 1:
        primary_item_name = custom_enemies["collectibles"][0]
        if len(custom_enemies["collectibles"]) >= 2:
            high_val_name = custom_enemies["collectibles"][1]

    # Sector Keys placed in distant dead-end / key rooms
    for k_idx, kr in enumerate(key_rooms):
        kid = f"key_{level_num}_{k_idx+1}"
        required_items.append(kid)
        k_label = key_names_by_theme.get(resolved_theme, f"Sector {chr(65 + k_idx)} Key")
        collectibles.append(
            Collectible(
                id=kid,
                type="key",
                name=k_label if k_idx == 0 else f"{k_label} Part {k_idx+1}",
                x=kr.center[0],
                y=kr.center[1],
                value=25
            )
        )

    # Scatter thematic collectibles across rooms and corridors (Abundant points: >4x required score)
    gem_count = 22 + level_num * 6  # 28 items on lvl 1, 34 on lvl 2, 40 on lvl 3
    placed_gems = 0
    gem_attempts = 0
    while placed_gems < gem_count and gem_attempts < 350:
        gem_attempts += 1
        gx = rng.randint(2, mw - 3)
        gy = rng.randint(2, mh - 3)
        if not grid[gy][gx] and (gx, gy) != (px, py) and (gx, gy) != (ex, ey):
            # Keep terminal sanctum free of random gems
            if is_in_terminal_room(gx, gy):
                continue
            if not any(c.x == gx and c.y == gy for c in collectibles):
                is_star = placed_gems % 3 == 0
                collectibles.append(
                    Collectible(
                        id=f"item_{level_num}_{placed_gems}",
                        type=primary_type if not is_star else high_val_type,
                        name=primary_item_name if not is_star else high_val_name,
                        x=gx,
                        y=gy,
                        value=10 if not is_star else 25
                    )
                )
                placed_gems += 1

    # Spawn exactly 2 Healing Items per level (strictly for Level >= 2, 0 on Level 1)
    if level_num >= 2:
        heal_placed = 0
        heal_attempts = 0
        while heal_placed < 2 and heal_attempts < 200:
            heal_attempts += 1
            hx = rng.randint(2, mw - 3)
            hy = rng.randint(2, mh - 3)
            if not grid[hy][hx] and (hx, hy) != (px, py) and (hx, hy) != (ex, ey):
                if is_in_terminal_room(hx, hy):
                    continue
                if not any(c.x == hx and c.y == hy for c in collectibles):
                    collectibles.append(
                        Collectible(
                            id=f"heal_{level_num}_{heal_placed}",
                            type="heal",
                            name="Emergency Medkit (+1 Heart)",
                            x=hx,
                            y=hy,
                            value=15
                        )
                    )
                    heal_placed += 1

    # 8. Interactive Objects, Security Terminals, and Sanctum Barriers
    objects: List[GameObject] = []
    required_terminals: List[str] = []

    # Map theme-specific terminal and barrier naming
    clean_env = env_name.split(":")[0].strip() or "Sector"
    terminal_titles = {
        "castle": "Royal Sovereign Altar",
        "hospital": "Trauma ICU Central Workstation",
        "living_room": "Smart Home Automation Hub",
        "gym": "Titan Athletic Biometric Hub",
        "bank": "Federal Vault Core Terminal",
        "police": "Precinct Central Dispatch Console",
        "railway": "Rail Interlocking Dispatch Board",
        "snow": "Sub-Zero Cryo Command Terminal",
        "volcano": "Geothermal Core Stabilizer",
        "cyberpunk": "Quantum Firewall Terminal"
    }
    terminal_name = terminal_titles.get(resolved_theme, f"{clean_env} Central Terminal")

    barrier_titles = {
        "castle": "Citadel Sanctum Iron Portcullis",
        "hospital": "ICU Quarantine Laser Gate",
        "living_room": "Penthouse Security Blast Door",
        "gym": "Titan Biometric Security Gate",
        "bank": "Federal Vault Laser Containment Grid",
        "police": "Maximum Security Cell Barrier",
        "railway": "Electrified Track Safety Gate",
        "snow": "Cryo Hermetic Blast Gate",
        "volcano": "Thermal Shield Containment Field",
        "cyberpunk": "Cyber Matrix Security Barrier"
    }
    barrier_name = barrier_titles.get(resolved_theme, f"{clean_env} Security Gate")

    # Add a Theme-Specific Terminal inside dedicated sanctum room (Only Level >= 2)
    if level_num >= 2 and terminal_room is not None and terminal_door is not None:
        term_id = f"terminal_{level_num}"
        required_terminals.append(term_id)
        tx = terminal_room.center[0]
        ty = terminal_room.center[1]
        objects.append(
            GameObject(
                id=term_id,
                type="interactive",
                name=terminal_name,
                x=tx,
                y=ty,
                width=1,
                height=1,
                color="#00f2fe",
                description=f"{terminal_name.upper()}: Press E while nearby to override sector lock!"
            )
        )

        # Place exactly ONE terminal_barrier on the single doorway threshold
        bx, by = terminal_door
        objects.append(
            GameObject(
                id=f"terminal_barrier_{level_num}",
                type="terminal_barrier",
                name=barrier_name,
                x=bx,
                y=by,
                width=1,
                height=1,
                color="#ef4444",
                description=f"🔒 {barrier_name}: Sealed until all keys are collected and required score is reached."
            )
        )

    # Thematic obstacle objects in rooms (strictly exclude terminal_room so terminal is never hidden!)
    theme_obj_names = theme_cfg.get("objects", ["Storage Unit", "Control Console", "Barrier Unit"])
    theme_obj_colors = theme_cfg.get("object_colors", ["#334155", "#475569", "#64748b"])
    for i, r in enumerate(rooms):
        if r.tag not in ("spawn", "exit", "terminal_room"):
            ox = r.x + 1
            oy = r.y + 1
            if not grid[oy][ox] and (ox, oy) != (px, py):
                obj_name = theme_obj_names[i % len(theme_obj_names)]
                is_landmark = any(w in obj_name.lower() for w in ["train", "locomotive", "carriage", "vault door", "aircraft", "cell bars", "range", "bed", "carousel"])
                w_size = 3 if (is_landmark and r.w >= 5) else (2 if (i % 2 == 0 or is_landmark) else 1)
                h_size = 2 if (is_landmark and r.h >= 5) else 1
                objects.append(
                    GameObject(
                        id=f"prop_{level_num}_{i}",
                        type="obstacle" if i % 2 == 0 else "interactive",
                        name=obj_name,
                        x=ox,
                        y=oy,
                        width=w_size,
                        height=h_size,
                        color=theme_obj_colors[i % len(theme_obj_colors)],
                        description=f"An authentic {obj_name}."
                    )
                )

    # 9. THEMATIC ENEMIES: Scaled to chosen difficulty and level
    enemies: List[Enemy] = []

    if difficulty == "easy":
        diff_mult = 0.85
        detect_mult = 0.70
    elif difficulty == "medium":
        diff_mult = 1.00
        detect_mult = 0.88
    elif difficulty == "hard":
        diff_mult = 1.20
        detect_mult = 1.00
    else:  # nightmare
        diff_mult = 1.45
        detect_mult = 1.15

    # 🚨 EXIT GUARDIAN (Stationed directly guarding the exit portal)
    guardian_x = max(2, min(mw - 3, ex - 2 if ex > 4 else ex + 2))
    guardian_y = ey
    enemies.append(
        Enemy(
            id=f"exit_guardian_{level_num}",
            name=f"LEVEL {level_num} {theme_cfg['guardian_name']}",
            type="exit_guardian",
            x=guardian_x,
            y=guardian_y,
            patrolRange=3,
            speed=round(1.35 * diff_mult, 2),
            detectionRadius=round(5.5 * detect_mult, 1),
            isAlert=False,
            spriteTheme=theme_cfg.get("guardian_sprite", "monster"),
            bodyShape=theme_cfg.get("guardian_shape", "golem_titan"),
            primaryColor=theme_cfg.get("guardian_color"),
            secondaryColor=theme_cfg.get("guardian_secondary"),
            eyeColor=theme_cfg.get("guardian_eyes"),
            accessory=theme_cfg.get("guardian_accessory")
        )
    )

    # Chaser Enemies: balanced count per difficulty and level
    if difficulty == "easy":
        chaser_count = 1 if level_num == 1 else (1 if level_num == 2 else 2)
    elif difficulty == "medium":
        chaser_count = 1 if level_num == 1 else (2 if level_num == 2 else 2)
    elif difficulty == "hard":
        chaser_count = 2 if level_num == 1 else (2 if level_num == 2 else 3)
    else:  # nightmare
        chaser_count = 2 if level_num == 1 else (3 if level_num == 2 else 4)

    # Candidate rooms for chasers (excluding spawn room and terminal sanctum)
    chaser_rooms = [r for r in (key_rooms + middle_rooms) if r.tag not in ("spawn", "terminal_room")]
    if not chaser_rooms:
        chaser_rooms = [r for r in rooms if r.tag not in ("spawn", "terminal_room")]

    for c_i in range(chaser_count):
        target_r = chaser_rooms[c_i % len(chaser_rooms)]
        cx = max(target_r.x + 1, min(target_r.x + target_r.w - 2, target_r.center[0] + ((c_i % 3) - 1)))
        cy = max(target_r.y + 1, min(target_r.y + target_r.h - 2, target_r.center[1] + ((c_i // 3) % 2)))
        if math.hypot(cx - px, cy - py) < 5:
            cx = max(2, min(mw - 3, cx + 5))
        enemies.append(
            Enemy(
                id=f"chaser_{level_num}_{c_i}",
                name=f"{theme_cfg['chaser_name']} {level_num}.{c_i+1}",
                type="chaser",
                x=cx,
                y=cy,
                patrolRange=5,
                speed=round(1.25 * diff_mult, 2),
                detectionRadius=round(4.8 * detect_mult, 1),
                isAlert=False,
                spriteTheme=theme_cfg.get("chaser_sprite", "monster"),
                bodyShape=theme_cfg.get("chaser_shape", "quadruped_beast"),
                primaryColor=theme_cfg.get("chaser_color"),
                eyeColor=theme_cfg.get("chaser_eyes")
            )
        )

    # Patrol Scouts / Sentries along corridors (fewer enemies to allow tactical maneuvering)
    if difficulty == "easy":
        patrol_count = 0 if level_num == 1 else (1 if level_num == 2 else 1)
    elif difficulty == "medium":
        patrol_count = 1 if level_num == 1 else (1 if level_num == 2 else 2)
    elif difficulty == "hard":
        patrol_count = 1 if level_num == 1 else (2 if level_num == 2 else 2)
    else:  # nightmare
        patrol_count = 2 if level_num == 1 else (2 if level_num == 2 else 3)

    walkable_coords = []
    for wy in range(2, mh - 2):
        for wx in range(2, mw - 2):
            if not grid[wy][wx] and math.hypot(wx - px, wy - py) >= 6 and (wx, wy) != (ex, ey):
                if not is_in_terminal_room(wx, wy):
                    walkable_coords.append((wx, wy))
    rng.shuffle(walkable_coords)

    for p_i in range(patrol_count):
        if walkable_coords:
            p_pos = walkable_coords[p_i % len(walkable_coords)]
        else:
            p_pos = (max(3, min(mw - 4, (px + ex) // 2 + p_i * 2)), max(3, min(mh - 4, (py + ey) // 2)))
        enemies.append(
            Enemy(
                id=f"patrol_{level_num}_{p_i}",
                name=f"{theme_cfg['patrol_name']} {level_num}.{p_i+1}",
                type="patrol",
                x=p_pos[0],
                y=p_pos[1],
                patrolRange=5,
                speed=round(1.10 * diff_mult, 2),
                detectionRadius=round(3.8 * detect_mult, 1),
                isAlert=False,
                spriteTheme=theme_cfg.get("patrol_sprite", "laser"),
                bodyShape=theme_cfg.get("patrol_shape", "mechanical_turret"),
                primaryColor=theme_cfg.get("patrol_color"),
                eyeColor=theme_cfg.get("patrol_eyes")
            )
        )

    # 10. FAIR SCORE QUOTAS (Increases by exactly 10% per level)
    base_scores = {"easy": 80, "medium": 100, "hard": 120, "nightmare": 140}
    base_score = base_scores.get(difficulty, 100)
    req_score = round(base_score * (1.10 ** (level_num - 1)))

    obj_parts = [f"Score {req_score}+ pts"]
    if required_items:
        key_count_str = f"{len(required_items)} Sector Key{'s' if len(required_items)>1 else ''}"
        obj_parts.append(key_count_str)
    if required_terminals:
        obj_parts.append(f"💻 Hack {terminal_name}")
        obj_desc = f"Level {level_num}: Collect Keys & Score {req_score}+ pts to Unlock Sanctum -> Hack {terminal_name} -> Escape!"
        guide_dialogue = f"Sector {level_num} Intel: Evade {theme_cfg['guardian_name']}. Collect {key_count_str if required_items else 'the keys'} and reach {req_score} pts to open the {barrier_name}! Then hack the {terminal_name} to unlock the Sector Exit!"
    else:
        obj_desc = f"Level {level_num}: Collect Keys & Score {req_score}+ pts -> Evade {theme_cfg['guardian_name']} & Escape!"
        guide_dialogue = f"Sector {level_num} Intel: Evade {theme_cfg['guardian_name']}. Collect {key_count_str if required_items else 'the keys'} and reach {req_score} pts to unlock the Sector Exit!"

    objective = Objective(
        type="collect_then_exit",
        requiredItems=required_items,
        requiredScore=req_score,
        requiredTerminals=required_terminals,
        description=obj_desc
    )

    time_limits = {"easy": 160, "medium": 120, "hard": 90, "nightmare": 70}
    time_limit = time_limits.get(difficulty, 120)

    # NPC Guide in spawn room
    guide_names = {
        "snow": "Arctic Explorer Guide",
        "volcano": "Firewalker Specialist",
        "desert": "Dune Nomad",
        "ocean": "Deep Sea Diver",
        "space": "Starfleet Navigator",
        "haunted": "Ghost Hunter Specialist",
        "bank": "Inside Informant",
        "cyberpunk": "Recon Hacker",
        "dungeon": "Ancient Explorer",
        "classroom": "Friendly Classmate",
        "police": "Desk Sergeant Miller",
        "railway": "Station Conductor Dan",
        "hospital": "Triage Nurse Sarah",
        "kitchen": "Sous Chef Marco",
        "airport": "Flight Attendant Chloe",
        "castle": "Royal Herald Raymond",
        "living_room": "Family Butler Alfred",
        "gym": "Head Coach Marcus",
    }
    guide_name = theme_cfg.get("guide_name") or guide_names.get(resolved_theme, "Recon Operative")

    npcs = [
        NPC(
            id=f"guide_{level_num}",
            name=guide_name,
            x=px + 1 if px + 1 < mw - 2 else px - 1,
            y=py,
            dialogue=guide_dialogue
        )
    ]

    # Native Wildlife & Thematic Ambient NPCs
    if resolved_theme == "snow":
        penguin_quotes = [
            "Squawk! *waddle waddle* The ice is slippery! Watch out for the Frost Titan Yeti! Keep moving to stay warm!",
            "Chirp chirp! *flaps flippers* Collect the frost crystals and slide over the ice to the exit!",
            "Honk! *tumbles on snow* Emperor penguin colony reporting in! The blizzard wolves can't catch us if we sneak!"
        ]
        for p_idx, r in enumerate(middle_rooms[:2]):
            px_p = r.center[0]
            py_p = r.center[1] + 1
            npcs.append(
                NPC(
                    id=f"penguin_{level_num}_{p_idx+1}",
                    name="Waddling Adélie Penguin" if p_idx == 0 else "Emperor Penguin Chick",
                    x=px_p,
                    y=py_p,
                    dialogue=penguin_quotes[p_idx % len(penguin_quotes)]
                )
            )

    desc_text = f"{custom_description} (Sector {level_num}). Collect {req_score}+ points, override security, use stealth & stun tools, and escape!" if custom_description else f"Infiltrate {env_name}. Collect {req_score}+ points, override security, use stealth & stun tools, and escape through the exit portal."

    level_world = GameWorld(
        title=f"{env_name} - Sector {level_num}",
        genre="escape",
        description=desc_text,
        difficulty=difficulty,
        timeLimit=time_limit,
        levelNumber=level_num,
        maxLevels=3,
        palette=final_palette,
        map=MapConfig(
            width=mw,
            height=mh,
            tileSize=34,
            theme=resolved_theme
        ),
        player=PlayerPosition(x=px, y=py),
        walls=walls,
        objects=objects,
        collectibles=collectibles,
        exit=ExitPoint(x=ex, y=ey, name=f"Sector {level_num} Exit Portal"),
        npcs=npcs,
        enemies=enemies,
        objective=objective
    )

    return level_world
