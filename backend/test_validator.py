import sys
from backend.app.schemas import GameWorld, MapConfig, Wall, GameObject, Collectible, ExitPoint, Objective, PlayerPosition
from backend.app.validator import validate_and_repair_game_world

def test_reachability_and_repair():
    print("Running BFS reachability & auto-repair tests...")

    # Create a world where the key and exit are blocked by a full-span wall
    blocked_world = GameWorld(
        title="Test Labyrinth",
        genre="escape",
        description="Testing BFS repair",
        difficulty="medium",
        timeLimit=60,
        map=MapConfig(width=20, height=15, tileSize=32),
        player=PlayerPosition(x=2, y=2),
        walls=[
            Wall(x=10, y=0, width=1, height=15),
        ],
        objects=[
            GameObject(id="blocker", type="obstacle", name="Boulder", x=2, y=2, width=1, height=1)
        ],
        collectibles=[
            Collectible(id="trapped_key", type="key", name="Key", x=16, y=5, value=100)
        ],
        exit=ExitPoint(x=18, y=12, name="Trapped Exit"),
        objective=Objective(type="collect_then_exit", requiredItems=["trapped_key"], description="Escape")
    )

    repaired = validate_and_repair_game_world(blocked_world)

    # 1. Player must NOT be on an obstacle
    assert not (repaired.player.x == 2 and repaired.player.y == 2), "Player should be moved off the obstacle"
    print(f"[OK] Player relocated to safe walkable tile: ({repaired.player.x}, {repaired.player.y})")

    # 2. Key must now be on the same side of the wall as the player (x < 10)
    assert repaired.collectibles[0].x < 10, f"Key should be relocated to reachable side, got x={repaired.collectibles[0].x}"
    print(f"[OK] Key relocated to reachable tile: ({repaired.collectibles[0].x}, {repaired.collectibles[0].y})")

    # 3. Exit must now also be on the reachable side (x < 10)
    assert repaired.exit.x < 10, f"Exit should be relocated to reachable side, got x={repaired.exit.x}"
    print(f"[OK] Exit relocated to reachable tile: ({repaired.exit.x}, {repaired.exit.y})")

    print("[SUCCESS] ALL VALIDATION & REPAIR TESTS PASSED!")

if __name__ == "__main__":
    test_reachability_and_repair()
