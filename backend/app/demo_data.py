from .schemas import GameWorld, MapConfig, Wall, GameObject, Collectible, ExitPoint, NPC, Objective, PlayerPosition

DEMO_CLASSROOM = GameWorld(
    title="Campus Escape: The Auditorium Mystery",
    genre="escape",
    description="The professor locked the auditorium door! Grab the podium key, talk to the TA, and escape before campus lockdown.",
    difficulty="medium",
    timeLimit=90,
    map=MapConfig(width=25, height=18, tileSize=38, theme="classroom"),
    player=PlayerPosition(x=2, y=15),
    walls=[
        Wall(x=0, y=0, width=25, height=1),
        Wall(x=0, y=17, width=25, height=1),
        Wall(x=0, y=0, width=1, height=18),
        Wall(x=24, y=0, width=1, height=18),
        Wall(x=14, y=1, width=1, height=7),
    ],
    objects=[
        GameObject(id="whiteboard", type="obstacle", name="Whiteboard", x=4, y=1, width=7, height=1, color="#e2e8f0"),
        GameObject(id="podium", type="interactive", name="Lecturer Podium", x=12, y=2, width=2, height=1, color="#8b5a2b", description="A sleek wooden podium with notes from today's AI lecture."),
        GameObject(id="desk1", type="obstacle", name="Desk Row 1", x=3, y=5, width=4, height=1, color="#92400e"),
        GameObject(id="desk2", type="obstacle", name="Desk Row 2", x=3, y=8, width=4, height=1, color="#92400e"),
        GameObject(id="desk3", type="obstacle", name="Desk Row 3", x=3, y=11, width=4, height=1, color="#92400e"),
        GameObject(id="desk4", type="obstacle", name="Desk Row 4", x=9, y=5, width=4, height=1, color="#92400e"),
        GameObject(id="desk5", type="obstacle", name="Desk Row 5", x=9, y=8, width=4, height=1, color="#92400e"),
        GameObject(id="desk6", type="obstacle", name="Desk Row 6", x=9, y=11, width=4, height=1, color="#92400e"),
        GameObject(id="bookshelf", type="interactive", name="Reference Shelf", x=16, y=1, width=6, height=1, color="#78350f", description="Volumes of Algorithms, Physics, and Neural Networks."),
        GameObject(id="plant1", type="obstacle", name="Potted Fern", x=1, y=1, width=1, height=1),
        GameObject(id="plant2", type="obstacle", name="Monstera Plant", x=23, y=1, width=1, height=1),
        GameObject(id="plant3", type="obstacle", name="Ficus Plant", x=1, y=16, width=1, height=1),
    ],
    collectibles=[
        Collectible(id="room_key", type="key", name="Golden Auditorium Key", x=21, y=3, value=50),
        Collectible(id="star1", type="star", name="Study Notes", x=5, y=6, value=20),
        Collectible(id="star2", type="star", name="Research Paper", x=11, y=9, value=35),
        Collectible(id="star3", type="star", name="Calculator", x=18, y=14, value=20),
    ],
    exit=ExitPoint(x=23, y=15, name="Main Auditorium Exit"),
    npcs=[
        NPC(id="prof1", name="Prof. Turing", x=7, y=3, dialogue="Greetings student! The auditorium locked automatically. I think I left the master key on the back study table near the reference shelf!"),
    ],
    objective=Objective(
        type="collect_then_exit",
        requiredItems=["room_key"],
        requiredScore=100,
        description="Find the Golden Key on the back table and score 100+ points to escape!"
    )
)

DEMO_CYBER = GameWorld(
    title="Cyber Lab: Quantum Core Breach",
    genre="adventure",
    description="Security breach detected! Collect the 3 decrypted quantum crystals and reach the extraction airlock.",
    difficulty="hard",
    timeLimit=75,
    map=MapConfig(width=26, height=18, tileSize=38, theme="cyberpunk"),
    player=PlayerPosition(x=2, y=2),
    walls=[
        Wall(x=0, y=0, width=26, height=1),
        Wall(x=0, y=17, width=26, height=1),
        Wall(x=0, y=0, width=1, height=18),
        Wall(x=25, y=0, width=1, height=18),
        Wall(x=8, y=1, width=2, height=6),
        Wall(x=8, y=11, width=2, height=6),
        Wall(x=17, y=5, width=2, height=9),
    ],
    objects=[
        GameObject(id="server1", type="obstacle", name="Quantum Mainframe", x=3, y=7, width=3, height=2, color="#1e293b"),
        GameObject(id="server2", type="obstacle", name="Auxiliary Cluster", x=3, y=11, width=3, height=2, color="#1e293b"),
        GameObject(id="terminal", type="interactive", name="Security Terminal", x=12, y=2, width=2, height=1, description="Terminal status: ACCESS GRANTED. Primary key loaded."),
        GameObject(id="cooling_core", type="obstacle", name="Cryo Chamber", x=12, y=8, width=3, height=3, color="#0369a1"),
        GameObject(id="rack1", type="obstacle", name="Storage Unit", x=21, y=4, width=2, height=4, color="#334155"),
    ],
    collectibles=[
        Collectible(id="cyber_key", type="key", name="Encryption Keycard", x=13, y=4, value=50),
        Collectible(id="crystal1", type="gem", name="Quantum Core A", x=4, y=15, value=25),
        Collectible(id="crystal2", type="gem", name="Quantum Core B", x=13, y=14, value=25),
        Collectible(id="crystal3", type="gem", name="Quantum Core C", x=22, y=11, value=25),
    ],
    exit=ExitPoint(x=23, y=2, name="Extraction Airlock"),
    npcs=[
        NPC(id="cyber_bot", name="UNIT-7 AI", x=5, y=4, dialogue="ALERT! System containment failure in 75 seconds. Grab the Encryption Keycard and reach the extraction airlock immediately!"),
    ],
    objective=Objective(
        type="collect_then_exit",
        requiredItems=["cyber_key"],
        requiredScore=125,
        description="Collect the Encryption Keycard, score 125+ points, and escape via the Extraction Airlock!"
    )
)

DEMO_DUNGEON = GameWorld(
    title="Dungeon of Secrets: The Sun Relic",
    genre="mystery",
    description="Navigate ancient stone passages, locate the mystic Sun Key, and unlock the sacred portal.",
    difficulty="easy",
    timeLimit=100,
    map=MapConfig(width=24, height=16, tileSize=40, theme="dungeon"),
    player=PlayerPosition(x=2, y=13),
    walls=[
        Wall(x=0, y=0, width=24, height=1),
        Wall(x=0, y=15, width=24, height=1),
        Wall(x=0, y=0, width=1, height=16),
        Wall(x=23, y=0, width=1, height=16),
        Wall(x=6, y=2, width=2, height=8),
        Wall(x=12, y=6, width=2, height=9),
        Wall(x=18, y=2, width=2, height=8),
    ],
    objects=[
        GameObject(id="pillar1", type="obstacle", name="Ancient Stone Pillar", x=3, y=4, width=2, height=2, color="#3f3f46"),
        GameObject(id="chest1", type="interactive", name="Gilded Chest", x=9, y=2, width=2, height=1, description="An ornate chest adorned with ancient glyphs."),
        GameObject(id="statue", type="interactive", name="Gargoyle Shrine", x=15, y=2, width=2, height=2, description="A silent stone guardian watching over the chamber."),
        GameObject(id="altar", type="obstacle", name="Sun Altar", x=21, y=6, width=1, height=3, color="#713f12"),
    ],
    collectibles=[
        Collectible(id="sun_key", type="key", name="Mystic Sun Key", x=9, y=4, value=50),
        Collectible(id="ruby1", type="gem", name="Dungeon Ruby", x=3, y=9, value=25),
        Collectible(id="ruby2", type="gem", name="Emerald Shard", x=15, y=12, value=25),
    ],
    exit=ExitPoint(x=21, y=13, name="Sacred Portal"),
    npcs=[
        NPC(id="ghost", name="Keeper Eldon", x=3, y=11, dialogue="Wanderer, only the Sun Key hidden past the central pillars will unseal the Sacred Portal. Tread swiftly!"),
    ],
    objective=Objective(
        type="collect_then_exit",
        requiredItems=["sun_key"],
        requiredScore=100,
        description="Locate the Mystic Sun Key, score 100+ points, and unseal the Sacred Portal!"
    )
)

from .map_generator import generate_procedural_level

DEMO_HOSPITAL = generate_procedural_level(1, "St. Jude Emergency Trauma Center", "hospital", "medium", "standard", "moderate", seed=909)
DEMO_RAILWAY = generate_procedural_level(1, "Grand Central Terminal", "railway", "medium", "standard", "moderate", seed=606)
DEMO_POLICE = generate_procedural_level(1, "Metropolitan Police Precinct 09", "police", "hard", "standard", "moderate", seed=707)
DEMO_SNOW = generate_procedural_level(1, "Alpine Glacial Ridge", "snow", "medium", "standard", "moderate", seed=808)
DEMO_BANK = generate_procedural_level(1, "Federal Reserve Vault", "bank", "nightmare", "standard", "moderate", seed=303)
DEMO_KITCHEN = generate_procedural_level(1, "Five-Star Culinary Kitchen", "kitchen", "medium", "standard", "moderate", seed=1010)
DEMO_AIRPORT = generate_procedural_level(1, "Jetway International Terminal", "airport", "hard", "standard", "moderate", seed=1111)
DEMO_VOLCANO = generate_procedural_level(1, "Infernal Magma Chamber", "volcano", "hard", "standard", "moderate", seed=1212)
DEMO_DESERT = generate_procedural_level(1, "Pharaoh's Sunken Dune", "desert", "medium", "standard", "moderate", seed=1313)
DEMO_OCEAN = generate_procedural_level(1, "Abyssal Ocean Trench", "ocean", "medium", "standard", "moderate", seed=1414)
DEMO_SPACE = generate_procedural_level(1, "Orbital Nebula Outpost", "space", "nightmare", "standard", "moderate", seed=1515)
DEMO_NATURE = generate_procedural_level(1, "Overgrown Flora Sanctuary", "nature", "easy", "standard", "moderate", seed=1616)
DEMO_OFFICE = generate_procedural_level(1, "Corporate Executive Center", "office", "medium", "standard", "moderate", seed=1717)
DEMO_HAUNTED = generate_procedural_level(1, "Haunted Manor", "haunted", "hard", "standard", "moderate", seed=202)

ALL_DEMO_WORLDS = {
    "hospital": DEMO_HOSPITAL,
    "railway": DEMO_RAILWAY,
    "police": DEMO_POLICE,
    "snow": DEMO_SNOW,
    "bank": DEMO_BANK,
    "kitchen": DEMO_KITCHEN,
    "airport": DEMO_AIRPORT,
    "classroom": DEMO_CLASSROOM,
    "cyber": DEMO_CYBER,
    "dungeon": DEMO_DUNGEON,
    "volcano": DEMO_VOLCANO,
    "desert": DEMO_DESERT,
    "ocean": DEMO_OCEAN,
    "space": DEMO_SPACE,
    "nature": DEMO_NATURE,
    "office": DEMO_OFFICE,
    "haunted": DEMO_HAUNTED,
}
