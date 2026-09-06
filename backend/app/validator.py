from collections import deque
from typing import Set, Tuple, List
from .schemas import GameWorld

def validate_and_repair_game_world(world: GameWorld) -> GameWorld:
    """
    Ensures 100% playable game world:
    1. Grid bounds clamping.
    2. BFS reachability from player start to all collectibles and exit.
    3. Deterministic auto-repair if any obstacle blocks the player, keys, or exit.
    """
    w = world.map.width
    h = world.map.height

    # Build 2D collision matrix (True = blocked, False = walkable)
    grid = [[False for _ in range(w)] for _ in range(h)]

    # Mark outer perimeter walls
    for x in range(w):
        grid[0][x] = True
        grid[h - 1][x] = True
    for y in range(h):
        grid[y][0] = True
        grid[y][w - 1] = True

    # Mark walls
    for wall in world.walls:
        for dy in range(wall.height):
            for dx in range(wall.width):
                gx = wall.x + dx
                gy = wall.y + dy
                if 0 <= gx < w and 0 <= gy < h:
                    grid[gy][gx] = True

    # Mark obstacles
    for obj in world.objects:
        if obj.type == "obstacle":
            for dy in range(obj.height):
                for dx in range(obj.width):
                    gx = obj.x + dx
                    gy = obj.y + dy
                    if 0 <= gx < w and 0 <= gy < h:
                        grid[gy][gx] = True

    # Find walkable coordinates helper
    def find_nearest_walkable(sx: int, sy: int) -> Tuple[int, int]:
        sx = max(1, min(w - 2, sx))
        sy = max(1, min(h - 2, sy))
        if not grid[sy][sx]:
            return sx, sy
        # Spiral search outward
        for r in range(1, max(w, h)):
            for dy in range(-r, r + 1):
                for dx in range(-r, r + 1):
                    nx, ny = sx + dx, sy + dy
                    if 1 <= nx < w - 1 and 1 <= ny < h - 1:
                        if not grid[ny][nx]:
                            return nx, ny
        # Fallback to (2, 2)
        grid[2][2] = False
        return 2, 2

    # 1. Ensure Player is on walkable tile
    px, py = find_nearest_walkable(world.player.x, world.player.y)
    world.player.x = px
    world.player.y = py

    # 2. Run BFS flood-fill from player to discover all reachable tiles
    reachable: Set[Tuple[int, int]] = set()
    queue = deque([(px, py)])
    reachable.add((px, py))

    while queue:
        cx, cy = queue.popleft()
        for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
            nx, ny = cx + dx, cy + dy
            if 1 <= nx < w - 1 and 1 <= ny < h - 1:
                if not grid[ny][nx] and (nx, ny) not in reachable:
                    reachable.add((nx, ny))
                    queue.append((nx, ny))

    # If reachable area is too small (< 20 tiles), carve open space around player
    if len(reachable) < 20:
        for cy in range(max(1, py - 3), min(h - 1, py + 4)):
            for cx in range(max(1, px - 3), min(w - 1, px + 4)):
                grid[cy][cx] = False
                reachable.add((cx, cy))

    reachable_list = sorted(list(reachable), key=lambda pt: (pt[0] - px)**2 + (pt[1] - py)**2)

    # 3. Validate & Repair Collectibles
    used_spots = {(px, py)}
    for c in world.collectibles:
        c.x = max(1, min(w - 2, c.x))
        c.y = max(1, min(h - 2, c.y))
        if (c.x, c.y) not in reachable or (c.x, c.y) in used_spots:
            # Relocate to a reachable tile far from player
            for spot in reversed(reachable_list):
                if spot not in used_spots:
                    c.x, c.y = spot
                    used_spots.add(spot)
                    break
        else:
            used_spots.add((c.x, c.y))

    # 4. Validate & Repair Exit
    world.exit.x = max(1, min(w - 2, world.exit.x))
    world.exit.y = max(1, min(h - 2, world.exit.y))
    if (world.exit.x, world.exit.y) not in reachable or (world.exit.x, world.exit.y) in used_spots:
        # Relocate exit to furthest reachable point from player
        for spot in reversed(reachable_list):
            if spot not in used_spots:
                world.exit.x, world.exit.y = spot
                used_spots.add(spot)
                break

    # 5. Validate Objective
    if not world.collectibles:
        # Spawn default key
        key_x, key_y = reachable_list[len(reachable_list) // 2]
        world.collectibles.append(
            Collectible(id="room_key", type="key", name="Master Key", x=key_x, y=key_y, value=250)
        )

    # Ensure required items exist
    key_ids = [c.id for c in world.collectibles if c.type == "key" or "key" in c.id.lower()]
    if not key_ids:
        key_ids = [world.collectibles[0].id]

    world.objective.requiredItems = [key_ids[0]]
    if not world.objective.description:
        world.objective.description = "Find the key and reach the exit."

    return world
