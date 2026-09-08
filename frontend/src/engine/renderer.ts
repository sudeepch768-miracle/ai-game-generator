import { GameWorld, EngineState, FloatingText, Particle, GameObject, StunProjectile } from '../types/game';
import { getEquippedSkin, AvatarSkin } from '../types/avatar';

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvasWidth: number;
  private canvasHeight: number;
  private zoom: number = 1.0;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number, zoom: number = 1.0) {
    this.ctx = ctx;
    this.canvasWidth = width;
    this.canvasHeight = height;
    this.zoom = zoom;
  }

  resize(width: number, height: number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  setZoom(zoom: number) {
    this.zoom = zoom;
  }

  getZoom(): number {
    return this.zoom;
  }

  render(
    world: GameWorld,
    state: EngineState,
    camera: { x: number; y: number },
    floatingTexts: FloatingText[],
    particles: Particle[],
    time: number,
    stunProjectiles: StunProjectile[] = []
  ) {
    const ctx = this.ctx;
    const tileSize = world.map.tileSize;

    ctx.save();
    // Deep dark background
    ctx.fillStyle = '#060812';
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Apply Camera & Zoom transform
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-Math.round(camera.x), -Math.round(camera.y));

    // 1. Render Map Floor with Procedural Textures
    this.renderFloor(world, tileSize, time);

    // 2. Render 3D Beveled Walls
    this.renderWalls(world, tileSize, time);

    // 3. Render Objects / Obstacles & Terminals
    this.renderObjects(world, tileSize, time, state);

    // 4. Render Exit Portal
    this.renderExit(world, tileSize, state, time);

    // 5. Render Collectibles
    this.renderCollectibles(world, tileSize, time);

    // 6. Render NPCs
    if (world.npcs) {
      this.renderNPCs(world.npcs, tileSize, time);
    }

    // 7. Render Enemies (Thematic: Ghosts, Guards, Lasers, Drones)
    if (world.enemies) {
      this.renderEnemies(world.enemies, tileSize, time);
    }

    // 8. Render Stun Projectiles
    if (stunProjectiles && stunProjectiles.length > 0) {
      this.renderStunProjectiles(stunProjectiles, time);
    }

    // 9. Render Player (with custom equipped skin, hat, and stealth camo)
    this.renderPlayer(state.player, time, state);

    // 10. Atmospheric Lighting & Vignette
    this.renderLighting(world, state.player, time);

    // 10.5 Dynamic Ambient Weather Particles (Snowflakes, Embers, Bubbles, Fog, Dust)
    this.renderWeather(world, time);

    // 11. Particles
    this.renderParticles(particles);

    // 12. Floating Texts
    this.renderFloatingTexts(floatingTexts);

    // 13. Screen-Space HUD: Radar Mini-Map
    ctx.restore();
    this.renderRadar(world, state);

    // 14. Screen-Space Interaction Prompts
    ctx.save();
    ctx.scale(this.zoom, this.zoom);
    ctx.translate(-Math.round(camera.x), -Math.round(camera.y));
    this.renderInteractPrompt(state.nearbyInteractable, state.player, time);
    ctx.restore();
  }

  private renderFloor(world: GameWorld, tileSize: number, time: number) {
    const ctx = this.ctx;
    const mapW = world.map.width * tileSize;
    const mapH = world.map.height * tileSize;
    const theme = (world.map.theme || 'cyberpunk').toLowerCase();
    const palette = world.palette;

    ctx.save();

    // Base Floor color
    const baseColors: Record<string, string> = {
      castle: '#13111c',
      living_room: '#1c140e',
      gym: '#111317',
      snow: '#0c1a2e',
      volcano: '#180606',
      desert: '#1a1307',
      ocean: '#04192b',
      space: '#060714',
      cyberpunk: '#0a0e1c',
      haunted: '#0f0a17',
      bank: '#0f172a',
      dungeon: '#141419',
      classroom: '#17120e',
      nature: '#0a1711',
      office: '#0f172a',
      railway: '#141720',
      police: '#0d1322',
      hospital: '#0c1a24',
      kitchen: '#1c1412',
      airport: '#111827',
    };
    ctx.fillStyle = palette?.floorColor || baseColors[theme] || '#0d111d';
    ctx.fillRect(0, 0, mapW, mapH);

    // Determine floor texture
    const floorTex = palette?.floorTexture || (
      theme.includes('castle') || theme.includes('fortress') || theme.includes('citadel') || theme.includes('palace') || theme.includes('throne') ? 'castle_stone' :
        theme.includes('hospital') || theme.includes('clinic') || theme.includes('medical') || theme.includes('surgery') || theme.includes('ward') ? 'hospital' :
          theme.includes('living') || theme.includes('couch') || theme.includes('sofa') || theme.includes('bedroom') || theme.includes('home') || theme.includes('lounge') || theme.includes('room') ? 'wood' :
            theme.includes('gym') || theme.includes('fitness') || theme.includes('workout') || theme.includes('weights') ? 'gym' :
              theme.includes('railway') || theme.includes('train') || theme.includes('station') || theme.includes('metro') || theme.includes('subway') || theme.includes('airport') ? 'railway' :
                theme.includes('police') || theme.includes('cop') || theme.includes('precinct') || theme.includes('jail') ? 'police' :
                  theme.includes('kitchen') || theme.includes('restaurant') || theme.includes('chef') ? 'kitchen' :
                    theme.includes('snow') || theme.includes('ice') || theme.includes('frost') || theme.includes('mountain') || theme.includes('arctic') ? 'snow' :
                      theme.includes('volcano') || theme.includes('lava') || theme.includes('fire') ? 'cracks' :
                        theme.includes('desert') || theme.includes('sand') || theme.includes('pyramid') ? 'sand' :
                          theme.includes('ocean') || theme.includes('water') || theme.includes('sea') ? 'water' :
                            theme.includes('haunted') || theme.includes('dungeon') ? 'cobblestone' :
                              theme.includes('nature') ? 'organic' :
                                theme.includes('cyber') || theme.includes('space') ? 'circuit' : 'grid'
    );

    // Procedural Floor Tile Pattern
    for (let y = 0; y < world.map.height; y++) {
      for (let x = 0; x < world.map.width; x++) {
        const px = x * tileSize;
        const py = y * tileSize;

        if (floorTex === 'snow') {
          // ❄️ Glacial Ice & Snow Texture
          ctx.strokeStyle = 'rgba(224, 242, 254, 0.08)';
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 1, py + 1, tileSize - 2, tileSize - 2);
          if ((x + y * 3) % 4 === 0) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
            ctx.fillRect(px + 2, py + 2, tileSize - 4, tileSize - 4);
          }
          if ((x * 7 + y * 13) % 11 === 0) {
            ctx.strokeStyle = 'rgba(125, 211, 252, 0.2)';
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(px + 4, py + 4);
            ctx.lineTo(px + tileSize - 6, py + tileSize - 6);
            ctx.stroke();
          }
        } else if (floorTex === 'cracks') {
          // 🌋 Molten Magma Fissure Lines
          ctx.strokeStyle = 'rgba(249, 115, 22, 0.15)';
          ctx.lineWidth = 1;
          ctx.strokeRect(px, py, tileSize, tileSize);
          if ((x + y) % 3 === 0) {
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.25)';
            ctx.beginPath();
            ctx.moveTo(px, py + tileSize / 2);
            ctx.lineTo(px + tileSize / 2, py + tileSize);
            ctx.stroke();
          }
        } else if (floorTex === 'sand') {
          // 🏜️ Desert Sand Dunes
          ctx.fillStyle = (x + y) % 2 === 0 ? 'rgba(251, 191, 36, 0.03)' : 'rgba(217, 119, 6, 0.02)';
          ctx.fillRect(px, py, tileSize, tileSize);
          ctx.strokeStyle = 'rgba(245, 158, 11, 0.08)';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(px, py, tileSize, tileSize);
        } else if (floorTex === 'water') {
          // 🌊 Ocean Caustics
          ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 1, py + 1, tileSize - 2, tileSize - 2);
          if ((x + y) % 4 === 0) {
            ctx.fillStyle = 'rgba(14, 165, 233, 0.06)';
            ctx.fillRect(px + 3, py + 3, tileSize - 6, tileSize - 6);
          }
        } else if (floorTex === 'cobblestone') {
          // 🏰 Rough Stone Pavers
          ctx.strokeStyle = 'rgba(148, 163, 184, 0.1)';
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 1, py + 1, tileSize - 2, tileSize - 2);
          if ((x + y) % 5 === 0) {
            ctx.fillStyle = 'rgba(168, 85, 247, 0.04)';
            ctx.fillRect(px + 2, py + 2, tileSize - 4, tileSize - 4);
          }
        } else if (floorTex === 'circuit') {
          // ⚡ Cyber Circuit Grid
          ctx.strokeStyle = 'rgba(0, 242, 254, 0.08)';
          ctx.lineWidth = 1;
          ctx.strokeRect(px, py, tileSize, tileSize);
        } else if (floorTex === 'railway') {
          // 🚆 Authentic Train Tracks & Raised Concourse Platform
          const isTrackZone = (y % 6 === 0 || y % 6 === 1);
          const isPlatformEdge = (y % 6 === 2);

          if (isTrackZone) {
            // Ballast Stone Gravel
            ctx.fillStyle = '#0b0e14';
            ctx.fillRect(px, py, tileSize, tileSize);
            ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.fillRect(px + 3, py + 4, 3, 3);
            ctx.fillRect(px + 18, py + 12, 3, 3);

            // Wooden Sleeper Cross-ties
            ctx.fillStyle = '#451a03';
            ctx.fillRect(px + 3, py + 1, 6, tileSize - 2);
            ctx.fillRect(px + tileSize / 2 + 1, py + 1, 6, tileSize - 2);

            // Twin Polished Steel Rails running horizontally
            ctx.fillStyle = '#64748b';
            ctx.fillRect(px, py + 7, tileSize, 4);
            ctx.fillRect(px, py + tileSize - 11, tileSize, 4);

            // Shining Silver Rail Highlights
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(px, py + 8, tileSize, 1.5);
            ctx.fillRect(px, py + tileSize - 10, tileSize, 1.5);
          } else if (isPlatformEdge) {
            // Raised Platform Curb with Yellow Tactile Warning Pavers
            ctx.fillStyle = '#1e293b';
            ctx.fillRect(px, py, tileSize, tileSize);

            // Bright Yellow Tactile Hazard Border
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(px, py + tileSize - 6, tileSize, 6);
            ctx.fillStyle = '#000000';
            for (let d = 0; d < tileSize; d += 6) {
              ctx.fillRect(px + d, py + tileSize - 5, 2, 4);
            }
          } else {
            // Polished Concourse Floor Tiles
            ctx.fillStyle = (x + y) % 2 === 0 ? 'rgba(255, 255, 255, 0.025)' : 'rgba(0, 0, 0, 0.05)';
            ctx.fillRect(px, py, tileSize, tileSize);
            ctx.strokeStyle = 'rgba(71, 85, 105, 0.15)';
            ctx.lineWidth = 1;
            ctx.strokeRect(px + 1, py + 1, tileSize - 2, tileSize - 2);
          }
        } else if (floorTex === 'castle_stone') {
          // 🏰 ROYAL CITADEL STONE PAVEMENT & CRIMSON VELVET RUNNER
          const centerAisleX = Math.floor(world.map.width / 2);
          const isAisle = Math.abs(x - centerAisleX) <= 1;

          if (isAisle) {
            // Royal Crimson Velvet Processional Carpet Runner
            ctx.fillStyle = '#881337';
            ctx.fillRect(px, py, tileSize, tileSize);

            // Rich velvet plush texture
            if ((x + y) % 2 === 0) {
              ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
              ctx.fillRect(px, py, tileSize, tileSize);
            }

            // Gold Braided Fringe Borders on Outer Edges of Aisle
            if (x === centerAisleX - 1) {
              ctx.fillStyle = '#f59e0b';
              ctx.fillRect(px, py, 3.5, tileSize);
              ctx.fillStyle = '#fbbf24';
              for (let d = 0; d < tileSize; d += 4) {
                ctx.fillRect(px + 3.5, py + d, 1.5, 2);
              }
            } else if (x === centerAisleX + 1) {
              ctx.fillStyle = '#f59e0b';
              ctx.fillRect(px + tileSize - 3.5, py, 3.5, tileSize);
              ctx.fillStyle = '#fbbf24';
              for (let d = 0; d < tileSize; d += 4) {
                ctx.fillRect(px + tileSize - 5, py + d, 1.5, 2);
              }
            }

            // Royal Gold Fleur-de-lis / Star Medallion in Center
            if (x === centerAisleX && y % 3 === 0) {
              const mcx = px + tileSize / 2;
              const mcy = py + tileSize / 2;
              ctx.fillStyle = '#fbbf24';
              ctx.beginPath();
              ctx.arc(mcx, mcy, 3.5, 0, Math.PI * 2);
              ctx.fill();
              ctx.strokeStyle = '#f59e0b';
              ctx.lineWidth = 1;
              ctx.stroke();
              // Diamond accents
              ctx.fillRect(mcx - 1, mcy - 6, 2, 12);
              ctx.fillRect(mcx - 6, mcy - 1, 12, 2);
            }
          } else {
            // Ancient Chiseled Flagstone Pavers
            const isStoneAlt = (x * 3 + y * 7) % 5 === 0;
            ctx.fillStyle = isStoneAlt ? '#1a1624' : '#14111c';
            ctx.fillRect(px, py, tileSize, tileSize);

            // Mortar joint seams
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
            ctx.lineWidth = 1.2;
            ctx.strokeRect(px + 0.5, py + 0.5, tileSize - 1, tileSize - 1);

            // Chiseled flagstone edge highlight
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(px + 2, py + tileSize - 2);
            ctx.lineTo(px + 2, py + 2);
            ctx.lineTo(px + tileSize - 2, py + 2);
            ctx.stroke();

            // Weathered stone cracks / moss accents
            if ((x * 11 + y * 17) % 13 === 0) {
              ctx.fillStyle = 'rgba(34, 197, 94, 0.12)';
              ctx.fillRect(px + 3, py + tileSize - 5, 4, 3);
            }
          }

        } else if (floorTex === 'hospital') {
          // 🏥 STERILE CLINICAL VINYL TILES & DIRECTIONAL TRIAGE STRIPES
          const isLight = (x + y) % 2 === 0;
          ctx.fillStyle = isLight ? '#122536' : '#0c1b29';
          ctx.fillRect(px, py, tileSize, tileSize);

          // Sterile sealant grout lines
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
          ctx.lineWidth = 0.75;
          ctx.strokeRect(px, py, tileSize, tileSize);

          // Diagonal wax sheen reflection
          if (isLight) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.035)';
            ctx.beginPath();
            ctx.moveTo(px + 4, py + 2);
            ctx.lineTo(px + tileSize - 2, py + tileSize - 4);
            ctx.lineTo(px + tileSize - 6, py + tileSize - 2);
            ctx.lineTo(px + 2, py + 6);
            ctx.fill();
          }

          // Colored Directional Triage Navigation Floor Lines
          // (Real hospitals use colored floor lines to direct patients to ER, ICU, Surgery)
          const isCorridorY = y % 5 === 2;
          if (isCorridorY) {
            // Red Line: Emergency / Trauma
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(px, py + 7, tileSize, 2.5);
            // Cyan Line: Intensive Care Unit (ICU)
            ctx.fillStyle = '#00f2fe';
            ctx.fillRect(px, py + tileSize / 2 - 1, tileSize, 2.5);
            // Amber Line: Surgery & Radiology
            ctx.fillStyle = '#f59e0b';
            ctx.fillRect(px, py + tileSize - 9, tileSize, 2.5);
          }

          // Red Cross Emergency Floor Medallion at corridor intersections
          if ((x * 5 + y * 7) % 19 === 0) {
            const cx = px + tileSize / 2;
            const cy = py + tileSize / 2;
            // White circular badge base
            ctx.fillStyle = '#ffffff';
            ctx.beginPath();
            ctx.arc(cx, cy, 6, 0, Math.PI * 2);
            ctx.fill();
            // Red Cross
            ctx.fillStyle = '#ef4444';
            ctx.fillRect(cx - 4, cy - 1.5, 8, 3);
            ctx.fillRect(cx - 1.5, cy - 4, 3, 8);
          }

        } else if (floorTex === 'wood') {
          // 🪵 HARDWOOD PARQUET PLANKS & ORNATE LIVING ROOM AREA RUG
          const isCenterRoom = (
            x >= Math.floor(world.map.width * 0.35) &&
            x <= Math.floor(world.map.width * 0.65) &&
            y >= Math.floor(world.map.height * 0.35) &&
            y <= Math.floor(world.map.height * 0.65)
          );

          if (isCenterRoom) {
            // Ornate Woven Persian Area Rug
            ctx.fillStyle = '#7f1d1d'; // Rich crimson base
            ctx.fillRect(px, py, tileSize, tileSize);

            // Navy blue inner medallion field
            ctx.fillStyle = '#1e1b4b';
            ctx.fillRect(px + 3, py + 3, tileSize - 6, tileSize - 6);

            // Gold floral border fretwork
            ctx.strokeStyle = '#d97706';
            ctx.lineWidth = 1;
            ctx.strokeRect(px + 2, py + 2, tileSize - 4, tileSize - 4);

            // Center gold medallion
            if ((x + y) % 2 === 0) {
              ctx.fillStyle = '#fbbf24';
              ctx.beginPath();
              ctx.arc(px + tileSize / 2, py + tileSize / 2, 3, 0, Math.PI * 2);
              ctx.fill();
            }

            // Rug fringe along north and south perimeter of the rug
            if (y === Math.floor(world.map.height * 0.35)) {
              ctx.fillStyle = '#f8fafc';
              for (let f = 0; f < tileSize; f += 3) {
                ctx.fillRect(px + f, py, 1.5, 2.5);
              }
            } else if (y === Math.floor(world.map.height * 0.65)) {
              ctx.fillStyle = '#f8fafc';
              for (let f = 0; f < tileSize; f += 3) {
                ctx.fillRect(px + f, py + tileSize - 2.5, 1.5, 2.5);
              }
            }
          } else {
            // Warm Staggered Oak / Walnut Hardwood Planks
            const plankOffset = (y % 2) * (tileSize * 0.4);
            const isPlankAlt = (x + y) % 2 === 0;
            ctx.fillStyle = isPlankAlt ? '#261811' : '#1d120c';
            ctx.fillRect(px, py, tileSize, tileSize);

            // Horizontal plank seams
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(px, py + tileSize / 2);
            ctx.lineTo(px + tileSize, py + tileSize / 2);
            ctx.moveTo(px, py + tileSize);
            ctx.lineTo(px + tileSize, py + tileSize);
            ctx.stroke();

            // Vertical staggered end-joints
            const jointX = px + ((plankOffset + 12) % tileSize);
            ctx.beginPath();
            ctx.moveTo(jointX, py);
            ctx.lineTo(jointX, py + tileSize / 2);
            ctx.stroke();

            // Tiny brass / copper finish nail heads
            ctx.fillStyle = '#b45309';
            ctx.fillRect(jointX - 2, py + 3, 1.5, 1.5);
            ctx.fillRect(jointX + 2, py + 3, 1.5, 1.5);

            // Fine wood grain lines
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.025)';
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(px, py + 4);
            ctx.lineTo(px + tileSize, py + 4);
            ctx.moveTo(px, py + tileSize / 2 + 5);
            ctx.lineTo(px + tileSize, py + tileSize / 2 + 5);
            ctx.stroke();
          }

        } else if (floorTex === 'gym') {
          // 🏋️ INTERLOCKING HEAVY RUBBER ATHLETIC MATS & HAZARD ZONES
          ctx.fillStyle = '#14161b';
          ctx.fillRect(px, py, tileSize, tileSize);

          // Interlocking puzzle seam border
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 1, py + 1, tileSize - 2, tileSize - 2);

          // Speckled multicolored EPDM rubber flecks (authentic gym floor texture!)
          const seed = (x * 37 + y * 67);
          ctx.fillStyle = '#f43f5e'; // Crimson fleck
          ctx.fillRect(px + (seed % (tileSize - 6)) + 3, py + ((seed * 3) % (tileSize - 6)) + 3, 1.5, 1.5);
          ctx.fillStyle = '#38bdf8'; // Cyan fleck
          ctx.fillRect(px + ((seed * 7) % (tileSize - 6)) + 3, py + ((seed * 5) % (tileSize - 6)) + 3, 1.5, 1.5);
          ctx.fillStyle = '#fbbf24'; // Gold fleck
          ctx.fillRect(px + ((seed * 11) % (tileSize - 6)) + 3, py + ((seed * 2) % (tileSize - 6)) + 3, 1.5, 1.5);

          // High-visibility yellow safety border around room perimeters
          const isBorderZone = (x === 2 || x === world.map.width - 3 || y === 2 || y === world.map.height - 3);
          if (isBorderZone) {
            ctx.fillStyle = '#eab308';
            ctx.fillRect(px, py + tileSize - 4, tileSize, 4);
            ctx.fillStyle = '#000000';
            for (let d = 0; d < tileSize; d += 6) {
              ctx.fillRect(px + d, py + tileSize - 4, 3, 4);
            }
          }

        } else if (floorTex === 'kitchen') {
          // 🍳 COMMERCIAL QUARRY KITCHEN TILES & DRAINAGE GRATES
          const isQuarryLight = (x + y) % 2 === 0;
          ctx.fillStyle = isQuarryLight ? '#381c15' : '#28130d';
          ctx.fillRect(px, py, tileSize, tileSize);

          ctx.strokeStyle = '#140805';
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 0.5, py + 0.5, tileSize - 1, tileSize - 1);

          // Occasional stainless steel drainage grate
          if ((x * 7 + y * 13) % 23 === 0) {
            ctx.fillStyle = '#475569';
            ctx.fillRect(px + 4, py + 4, tileSize - 8, tileSize - 8);
            ctx.fillStyle = '#0f172a';
            for (let g = 6; g < tileSize - 6; g += 4) {
              ctx.fillRect(px + 6, py + g, tileSize - 12, 1.5);
            }
          }

        } else if (floorTex === 'police') {
          // 👮 POLICE PRECINCT CHECKERED LINOLEUM TILES
          const isLight = (x + y) % 2 === 0;
          ctx.fillStyle = isLight ? '#131b2e' : '#0c1220';
          ctx.fillRect(px, py, tileSize, tileSize);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
          ctx.lineWidth = 0.75;
          ctx.strokeRect(px, py, tileSize, tileSize);
          if (isLight) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
            ctx.beginPath();
            ctx.moveTo(px + 4, py + 2);
            ctx.lineTo(px + tileSize - 2, py + tileSize - 4);
            ctx.lineTo(px + tileSize - 6, py + tileSize - 2);
            ctx.lineTo(px + 2, py + 6);
            ctx.fill();
          }
        } else if (floorTex === 'organic') {
          // 🌿 Organic Moss & Grass
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.08)';
          ctx.lineWidth = 1;
          ctx.strokeRect(px + 1, py + 1, tileSize - 2, tileSize - 2);
        } else {
          // Default grid
          ctx.fillStyle = (x + y) % 2 === 0 ? 'rgba(255, 255, 255, 0.015)' : 'rgba(0, 0, 0, 0.05)';
          ctx.fillRect(px, py, tileSize, tileSize);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
          ctx.lineWidth = 0.5;
          ctx.strokeRect(px, py, tileSize, tileSize);
        }
      }
    }

    ctx.restore();
  }

  private renderWalls(world: GameWorld, tileSize: number, time: number) {
    const ctx = this.ctx;
    const theme = (world.map.theme || 'cyberpunk').toLowerCase();
    const palette = world.palette;

    const wallThemes: Record<string, { top: string; front: string; rim: string }> = {
      castle: { top: '#475569', front: '#1e293b', rim: '#f59e0b' },
      living_room: { top: '#451a03', front: '#270e02', rim: '#f59e0b' },
      gym: { top: '#334155', front: '#18181b', rim: '#f43f5e' },
      railway: { top: '#334155', front: '#1e293b', rim: '#f59e0b' },
      police: { top: '#1e293b', front: '#0f172a', rim: '#3b82f6' },
      hospital: { top: '#1e3a5f', front: '#0f233d', rim: '#38bdf8' },
      kitchen: { top: '#451a03', front: '#260e02', rim: '#f97316' },
      airport: { top: '#374151', front: '#1f2937', rim: '#00f2fe' },
      snow: { top: '#1e3a5f', front: '#0f233d', rim: '#7dd3fc' },
      volcano: { top: '#451212', front: '#260a0a', rim: '#f97316' },
      desert: { top: '#78350f', front: '#451a03', rim: '#fbbf24' },
      ocean: { top: '#075985', front: '#082f49', rim: '#38bdf8' },
      space: { top: '#1e1b4b', front: '#0f0c29', rim: '#c084fc' },
      haunted: { top: '#2e1065', front: '#1e0a38', rim: '#a855f7' },
      bank: { top: '#1e293b', front: '#0f172a', rim: '#ffd700' },
      cyberpunk: { top: '#1e293b', front: '#0f172a', rim: '#00f2fe' },
      dungeon: { top: '#334155', front: '#1e293b', rim: '#94a3b8' },
      classroom: { top: '#451a03', front: '#270e02', rim: '#d97706' },
      nature: { top: '#14532d', front: '#052e16', rim: '#22c55e' },
      office: { top: '#1e293b', front: '#0f172a', rim: '#38bdf8' },
    };

    const fallbackColors = wallThemes[theme] || wallThemes.cyberpunk;
    const topColor = palette?.wallTop || fallbackColors.top;
    const frontColor = palette?.wallFront || fallbackColors.front;
    const rimColor = palette?.wallRim || fallbackColors.rim;
    const isSnow = theme.includes('snow') || theme.includes('ice') || theme.includes('frost') || theme.includes('mountain') || palette?.weather === 'snow';

    const isCastle = theme.includes('castle') || theme.includes('fortress') || theme.includes('citadel') || theme.includes('palace') || theme.includes('throne');
    const isHospital = theme.includes('hospital') || theme.includes('clinic') || theme.includes('medical') || theme.includes('surgery') || theme.includes('ward');
    const isLiving = theme.includes('living') || theme.includes('couch') || theme.includes('sofa') || theme.includes('bedroom') || theme.includes('home') || theme.includes('lounge');
    const isGym = theme.includes('gym') || theme.includes('fitness') || theme.includes('workout');
    const isRailway = theme.includes('railway') || theme.includes('train') || theme.includes('subway') || theme.includes('metro');
    const isBank = theme.includes('bank') || theme.includes('vault');

    ctx.save();
    for (const wall of world.walls) {
      const wx = wall.x * tileSize;
      const wy = wall.y * tileSize;
      const ww = wall.width * tileSize;
      const wh = wall.height * tileSize;

      // Drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fillRect(wx + 3, wy + 5, ww, wh);

      // Base Front Face
      ctx.fillStyle = frontColor;
      ctx.fillRect(wx, wy, ww, wh);

      // Top Bevel Face (3D effect)
      const bevelH = Math.min(8, wh * 0.35);
      ctx.fillStyle = topColor;
      ctx.fillRect(wx, wy, ww, bevelH);

      // Snow caps on top face if snowy theme
      if (isSnow) {
        ctx.fillStyle = 'rgba(241, 245, 249, 0.65)';
        ctx.fillRect(wx + 1, wy + 1, ww - 2, 2.5);
      }

      // --- THEME-SPECIFIC ARCHITECTURAL WALL SURFACE DETAILS ---
      if (isCastle) {
        // 🏰 Medieval Ashlar Stone Masonry Courses
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 1;
        const courseH = 8;
        for (let cy = wy + bevelH + courseH; cy < wy + wh; cy += courseH) {
          ctx.beginPath();
          ctx.moveTo(wx, cy);
          ctx.lineTo(wx + ww, cy);
          ctx.stroke();

          // Staggered vertical stone joints
          const courseIdx = Math.floor((cy - wy) / courseH);
          const jointOffset = (courseIdx % 2) * 12;
          for (let jx = wx + jointOffset; jx < wx + ww; jx += 24) {
            ctx.beginPath();
            ctx.moveTo(jx, cy - courseH);
            ctx.lineTo(jx, cy);
            ctx.stroke();
          }
        }

        // Top Battlements / Crenellations along top bevel face
        const merlonW = Math.max(5, tileSize / 4);
        for (let mx = wx; mx < wx + ww; mx += merlonW * 2) {
          ctx.fillStyle = 'rgba(0, 0, 0, 0.28)';
          ctx.fillRect(mx, wy, Math.min(merlonW, wx + ww - mx), bevelH);
        }

        // Wall-Mounted Flickering Iron Torch Sconce on walls of length >= 2 tiles
        if (ww >= tileSize * 1.8 && wh >= tileSize) {
          const torchX = wx + ww / 2;
          const torchY = wy + bevelH + 5;
          const flamePulse = Math.sin(time * 9 + wx) * 2;

          // Torch warm radial wall glow
          const torchGlow = ctx.createRadialGradient(torchX, torchY, 2, torchX, torchY, 18);
          torchGlow.addColorStop(0, 'rgba(245, 158, 11, 0.55)');
          torchGlow.addColorStop(0.5, 'rgba(234, 88, 12, 0.2)');
          torchGlow.addColorStop(1, 'rgba(234, 88, 12, 0)');
          ctx.fillStyle = torchGlow;
          ctx.beginPath();
          ctx.arc(torchX, torchY, 18, 0, Math.PI * 2);
          ctx.fill();

          // Iron sconce bracket
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(torchX - 1.5, torchY, 3, 7);
          ctx.fillRect(torchX - 4, torchY + 1, 8, 2);

          // Animated fire tongues
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.arc(torchX, torchY - 2 + flamePulse * 0.4, 3.5, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(torchX, torchY - 2 + flamePulse * 0.4, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (isHospital) {
        // 🏥 Glazed Ceramic Subway Tiles & Rubber Crash Bumper Rail
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.07)';
        ctx.lineWidth = 0.5;
        const tileH = 6;
        for (let hy = wy + bevelH + tileH; hy < wy + wh; hy += tileH) {
          ctx.beginPath();
          ctx.moveTo(wx, hy);
          ctx.lineTo(wx + ww, hy);
          ctx.stroke();
        }

        // Continuous Horizontal Rubber Crash Bumper Rail (Gurney Guard)
        const railY = wy + bevelH + Math.max(4, (wh - bevelH) * 0.42);
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(wx, railY, ww, 4);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(wx, railY, ww, 1.2);

        // Stainless Steel Bottom Kickplate
        ctx.fillStyle = '#64748b';
        ctx.fillRect(wx, wy + wh - 3, ww, 3);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(wx, wy + wh - 3, ww, 0.75);

        // Red Cross Medical Wall Plaque on walls of length >= 2 tiles
        if (ww >= tileSize * 1.8 && wh >= tileSize) {
          const plaqueX = wx + ww / 2 - 5;
          const plaqueY = wy + bevelH + 3;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.roundRect(plaqueX, plaqueY, 10, 10, 2);
          ctx.fill();
          // Red cross
          ctx.fillStyle = '#ef4444';
          ctx.fillRect(plaqueX + 2, plaqueY + 4, 6, 2);
          ctx.fillRect(plaqueX + 4, plaqueY + 2, 2, 6);
        }

      } else if (isLiving) {
        // 🛋️ Striped Damask Wallpaper, Walnut Crown Molding, & Framed Art
        // Striped wallpaper pinstripes
        ctx.fillStyle = 'rgba(255, 255, 255, 0.04)';
        for (let lx = wx + 4; lx < wx + ww; lx += 8) {
          ctx.fillRect(lx, wy + bevelH, 3, wh - bevelH - 4);
        }

        // Walnut Crown Molding on top bevel
        ctx.fillStyle = '#3b1809';
        ctx.fillRect(wx, wy, ww, bevelH);
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1;
        ctx.strokeRect(wx, wy, ww, bevelH);

        // Classic White Baseboard Trim along floor
        ctx.fillStyle = '#f1f5f9';
        ctx.fillRect(wx, wy + wh - 4, ww, 4);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(wx, wy + wh - 4, ww, 1);

        // Gilded Framed Oil Painting hung on wall if wide enough
        if (ww >= tileSize * 2 && wh >= tileSize) {
          const picW = 16;
          const picH = 11;
          const picX = wx + ww / 2 - picW / 2;
          const picY = wy + bevelH + 2;

          // Gold frame
          ctx.fillStyle = '#ffd700';
          ctx.beginPath();
          ctx.roundRect(picX, picY, picW, picH, 1.5);
          ctx.fill();
          ctx.strokeStyle = '#b45309';
          ctx.lineWidth = 0.75;
          ctx.stroke();

          // Canvas landscape art
          ctx.fillStyle = '#0284c7'; // Sky
          ctx.fillRect(picX + 2, picY + 2, picW - 4, picH - 4);
          ctx.fillStyle = '#16a34a'; // Rolling hills
          ctx.beginPath();
          ctx.arc(picX + 6, picY + picH - 2, 4, Math.PI, 0, false);
          ctx.arc(picX + 11, picY + picH - 2, 3.5, Math.PI, 0, false);
          ctx.fill();
          ctx.fillStyle = '#fef08a'; // Sun
          ctx.beginPath();
          ctx.arc(picX + 4, picY + 4, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

      } else if (isGym) {
        // 🏋️ Mirrored Wall Panels & Hazard Base Stripe
        // Mirrored upper panels
        const mirrorH = Math.max(4, (wh - bevelH) * 0.55);
        ctx.fillStyle = 'rgba(148, 163, 184, 0.22)';
        ctx.fillRect(wx + 2, wy + bevelH + 2, ww - 4, mirrorH);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
        ctx.lineWidth = 0.75;
        ctx.strokeRect(wx + 2, wy + bevelH + 2, ww - 4, mirrorH);

        // Diagonal mirror reflection glint
        ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
        ctx.beginPath();
        ctx.moveTo(wx + 6, wy + bevelH + 2);
        ctx.lineTo(wx + 14, wy + bevelH + 2);
        ctx.lineTo(wx + 8, wy + bevelH + 2 + mirrorH);
        ctx.lineTo(wx + 2, wy + bevelH + 2 + mirrorH);
        ctx.fill();

        // Safety caution base stripe
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(wx, wy + wh - 4, ww, 4);
        ctx.fillStyle = '#000000';
        for (let d = 0; d < ww; d += 8) {
          ctx.fillRect(wx + d, wy + wh - 4, 4, 4);
        }

      } else if (isRailway) {
        // 🚆 Enamelled Ceramic Subway Tiles with Colored Transit Line Stripe
        const bandY = wy + bevelH + (wh - bevelH) * 0.45;
        ctx.fillStyle = '#2563eb';
        ctx.fillRect(wx, bandY, ww, 4);
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(wx, bandY - 1, ww, 1);
        ctx.fillRect(wx, bandY + 4, ww, 1);

      } else if (isBank) {
        // 🏦 Polished Granite with Inlaid Gold Seams
        ctx.strokeStyle = 'rgba(255, 215, 0, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(wx, wy + bevelH + (wh - bevelH) / 2);
        ctx.lineTo(wx + ww, wy + bevelH + (wh - bevelH) / 2);
        ctx.stroke();

        // Chrome hex rivets on corners
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(wx + 2, wy + bevelH + 2, 2, 2);
        ctx.fillRect(wx + ww - 4, wy + bevelH + 2, 2, 2);
      }

      // Neon / Highlight Rim
      ctx.strokeStyle = rimColor;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(wx + 0.5, wy + 0.5, ww - 1, wh - 1);
    }
    ctx.restore();
  }

  private renderObjects(world: GameWorld, tileSize: number, time: number, state: EngineState) {
    const ctx = this.ctx;

    for (const obj of world.objects) {
      const ox = obj.x * tileSize;
      const oy = obj.y * tileSize;
      const ow = obj.width * tileSize;
      const oh = obj.height * tileSize;
      const isBarrier = obj.type === 'terminal_barrier' || obj.id.includes('terminal_barrier');
      const isTerm = !isBarrier && (obj.id.includes('terminal') || obj.id.includes('term'));

      ctx.save();

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(ox + 2, oy + 4, ow, oh);

      if (isBarrier) {
        this.renderTerminalBarrier(obj, ox, oy, ow, oh, time, state, world);
      } else if (isTerm) {
        this.renderThematicTerminal(obj, ox, oy, ow, oh, time, state, world);
      } else {
        // Dynamic Procedural Prop / Obstacle
        this.renderProp(obj, ox, oy, ow, oh, time);
      }

      ctx.restore();
    }
  }

  private renderTerminalBarrier(
    obj: GameObject,
    ox: number,
    oy: number,
    ow: number,
    oh: number,
    time: number,
    state: EngineState,
    world: GameWorld
  ) {
    const ctx = this.ctx;
    const required = world.objective.requiredItems || [];
    const hasAllItems = required.every(id => (state.collectedItems[id] || 0) > 0);
    const reqScore = world.objective.requiredScore || 0;
    const hasReqScore = (state.levelScore !== undefined ? state.levelScore : state.score) >= reqScore;
    const isUnlocked = hasAllItems && hasReqScore;

    const pulse = Math.sin(time * 7) * 0.25 + 0.75;
    const isHorizontal = ow >= oh;
    const cx = ox + ow / 2;
    const cy = oy + oh / 2;

    if (!isUnlocked) {
      // 🔒 LOCKED SANCTUM CONTAINMENT BARRIER
      // 1. Heavy Base Grid Background
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.beginPath();
      ctx.roundRect(ox, oy, ow, oh, 4);
      ctx.fill();

      // 2. High-Voltage Laser Containment Beams
      ctx.save();
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 12 * pulse;
      ctx.strokeStyle = `rgba(239, 68, 68, ${0.85 * pulse})`;
      ctx.lineWidth = 2.5;

      if (isHorizontal) {
        const lineY1 = oy + oh * 0.3;
        const lineY2 = oy + oh * 0.7;
        ctx.beginPath();
        ctx.moveTo(ox, lineY1);
        ctx.lineTo(ox + ow, lineY1);
        ctx.moveTo(ox, lineY2);
        ctx.lineTo(ox + ow, lineY2);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ox, lineY1);
        ctx.lineTo(ox + ow, lineY1);
        ctx.moveTo(ox, lineY2);
        ctx.lineTo(ox + ow, lineY2);
        ctx.stroke();
      } else {
        const lineX1 = ox + ow * 0.3;
        const lineX2 = ox + ow * 0.7;
        ctx.beginPath();
        ctx.moveTo(lineX1, oy);
        ctx.lineTo(lineX1, oy + oh);
        ctx.moveTo(lineX2, oy);
        ctx.lineTo(lineX2, oy + oh);
        ctx.stroke();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(lineX1, oy);
        ctx.lineTo(lineX1, oy + oh);
        ctx.moveTo(lineX2, oy);
        ctx.lineTo(lineX2, oy + oh);
        ctx.stroke();
      }
      ctx.restore();

      // 3. Side Pylons / Emitter Posts
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      if (isHorizontal) {
        ctx.fillRect(ox, oy, 6, oh);
        ctx.strokeRect(ox, oy, 6, oh);
        ctx.fillRect(ox + ow - 6, oy, 6, oh);
        ctx.strokeRect(ox + ow - 6, oy, 6, oh);
      } else {
        ctx.fillRect(ox, oy, ow, 6);
        ctx.strokeRect(ox, oy, ow, 6);
        ctx.fillRect(ox, oy + oh - 6, ow, 6);
        ctx.strokeRect(ox, oy + oh - 6, ow, 6);
      }

      // 4. Central Glowing Padlock Emblem
      ctx.fillStyle = 'rgba(239, 68, 68, 0.9)';
      ctx.beginPath();
      ctx.arc(cx, cy, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Padlock shackle
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(cx, cy - 2, 3, Math.PI, 0, false);
      ctx.stroke();
      // Padlock body
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(cx - 3.5, cy - 1, 7, 5);

      // 5. Floating Badge Label
      ctx.fillStyle = '#ef4444';
      ctx.font = 'bold 8px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🔒 SANCTUM LOCKED', cx, oy - 7);
    } else {
      // 🔓 UNLOCKED SANCTUM BARRIER (Deactivated!)
      ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
      ctx.beginPath();
      ctx.roundRect(ox, oy, ow, oh, 4);
      ctx.fill();

      // Soft green emitter posts
      ctx.fillStyle = '#0f172a';
      ctx.strokeStyle = '#43e97b';
      ctx.lineWidth = 1.5;
      if (isHorizontal) {
        ctx.fillRect(ox, oy, 5, oh);
        ctx.strokeRect(ox, oy, 5, oh);
        ctx.fillRect(ox + ow - 5, oy, 5, oh);
        ctx.strokeRect(ox + ow - 5, oy, 5, oh);
      } else {
        ctx.fillRect(ox, oy, ow, 5);
        ctx.strokeRect(ox, oy, ow, 5);
        ctx.fillRect(ox, oy + oh - 5, ow, 5);
        ctx.strokeRect(ox, oy + oh - 5, ow, 5);
      }

      // Dissolved energy shimmer
      ctx.strokeStyle = 'rgba(67, 233, 123, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      if (isHorizontal) {
        ctx.moveTo(ox + 6, cy);
        ctx.lineTo(ox + ow - 6, cy);
      } else {
        ctx.moveTo(cx, oy + 6);
        ctx.lineTo(cx, oy + oh - 6);
      }
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#43e97b';
      ctx.font = 'bold 8px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('🔓 SANCTUM OPEN', cx, oy - 7);
    }
  }

  private renderThematicTerminal(
    obj: GameObject,
    ox: number,
    oy: number,
    ow: number,
    oh: number,
    time: number,
    state: EngineState,
    world: GameWorld
  ) {
    const isHacked = Boolean(state.hackedTerminals && state.hackedTerminals[obj.id]);
    const theme = (world.map.theme || 'cyberpunk').toLowerCase();

    if (theme.includes('castle') || theme.includes('citadel') || theme.includes('throne') || theme.includes('palace')) {
      this.renderCastleTerminal(obj, ox, oy, ow, oh, time, isHacked);
    } else if (theme.includes('hospital') || theme.includes('clinic') || theme.includes('medical') || theme.includes('surgery')) {
      this.renderHospitalTerminal(obj, ox, oy, ow, oh, time, isHacked);
    } else if (theme.includes('living') || theme.includes('couch') || theme.includes('sofa') || theme.includes('bedroom') || theme.includes('home')) {
      this.renderLivingRoomTerminal(obj, ox, oy, ow, oh, time, isHacked);
    } else if (theme.includes('gym') || theme.includes('fitness') || theme.includes('workout')) {
      this.renderGymTerminal(obj, ox, oy, ow, oh, time, isHacked);
    } else if (theme.includes('bank') || theme.includes('vault') || theme.includes('heist')) {
      this.renderBankTerminal(obj, ox, oy, ow, oh, time, isHacked);
    } else if (theme.includes('police') || theme.includes('cop') || theme.includes('jail') || theme.includes('precinct')) {
      this.renderPoliceTerminal(obj, ox, oy, ow, oh, time, isHacked);
    } else if (theme.includes('railway') || theme.includes('train') || theme.includes('metro') || theme.includes('station')) {
      this.renderRailwayTerminal(obj, ox, oy, ow, oh, time, isHacked);
    } else if (theme.includes('snow') || theme.includes('ice') || theme.includes('frost') || theme.includes('arctic')) {
      this.renderSnowTerminal(obj, ox, oy, ow, oh, time, isHacked);
    } else if (theme.includes('volcano') || theme.includes('lava') || theme.includes('fire')) {
      this.renderVolcanoTerminal(obj, ox, oy, ow, oh, time, isHacked);
    } else {
      this.renderCyberTerminal(obj, ox, oy, ow, oh, time, isHacked);
    }
  }

  private renderCastleTerminal(obj: GameObject, ox: number, oy: number, ow: number, oh: number, time: number, isHacked: boolean) {
    const ctx = this.ctx;
    const pulse = Math.sin(time * 5) * 0.15 + 0.85;
    const cx = ox + ow / 2;

    // 1. Gothic Carved Stone Altar Plinth
    ctx.fillStyle = '#1e1b2e';
    ctx.beginPath();
    ctx.roundRect(ox + 2, oy + 4, ow - 4, oh - 6, 4);
    ctx.fill();
    ctx.strokeStyle = isHacked ? '#43e97b' : '#d97706';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Stepped altar top
    ctx.fillStyle = '#2e2540';
    ctx.fillRect(ox + 6, oy + 2, ow - 12, 5);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(ox + 8, oy + 2, ow - 16, 1.5);

    // 2. Dual Twin Candelabras with Flickering Flame
    for (const lx of [ox + 6, ox + ow - 8]) {
      // Golden candle holder
      ctx.fillStyle = '#d97706';
      ctx.fillRect(lx, oy - 4, 3, 7);
      ctx.fillRect(lx - 2, oy - 1, 7, 2);
      // Flickering flame
      const flameBob = Math.sin(time * 9 + lx) * 1.5;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.ellipse(lx + 1.5, oy - 7 + flameBob, 2, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(lx + 1.5, oy - 6 + flameBob, 1, 2, 0, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3. Ancient Illuminated Grimoire Book
    const bookW = 20;
    const bookH = 10;
    const bx = cx - bookW / 2;
    const by = oy + 6;
    ctx.fillStyle = '#451a03'; // leather cover
    ctx.fillRect(bx - 1, by - 1, bookW + 2, bookH + 2);
    ctx.fillStyle = '#fef3c7'; // parchment pages
    ctx.fillRect(bx, by, bookW / 2 - 0.5, bookH);
    ctx.fillRect(bx + bookW / 2 + 0.5, by, bookW / 2 - 0.5, bookH);
    // Glowing script lines
    ctx.fillStyle = isHacked ? '#43e97b' : '#d97706';
    for (let l = 0; l < 3; l++) {
      ctx.fillRect(bx + 2, by + 2 + l * 2.5, 6, 1);
      ctx.fillRect(bx + bookW / 2 + 2, by + 2 + l * 2.5, 6, 1);
    }

    // 4. Floating Arcane Royal Seal / Crest
    const sealY = oy - 12;
    const rot = time * 2;
    ctx.save();
    ctx.translate(cx, sealY);
    ctx.rotate(rot);
    ctx.strokeStyle = isHacked ? `rgba(67, 233, 123, ${pulse})` : `rgba(251, 191, 36, ${pulse})`;
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-5, -5, 10, 10);
    ctx.rotate(Math.PI / 4);
    ctx.strokeRect(-5, -5, 10, 10);
    ctx.restore();

    // 5. Label
    ctx.fillStyle = isHacked ? '#43e97b' : '#fbbf24';
    ctx.font = 'bold 8.5px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isHacked ? '✅ ROYAL SEAL CLAIMED' : '✨ ROYAL ALTAR [E]', cx, oy - 22);
  }

  private renderHospitalTerminal(obj: GameObject, ox: number, oy: number, ow: number, oh: number, time: number, isHacked: boolean) {
    const ctx = this.ctx;
    const cx = ox + ow / 2;
    const pulse = Math.sin(time * 6) * 0.15 + 0.85;

    // 1. Clinical Mobile Cart / Chassis (Pristine White & Teal)
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(ox + 2, oy + 3, ow - 4, oh - 5, 5);
    ctx.fill();
    ctx.strokeStyle = isHacked ? '#43e97b' : '#06b6d4';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // 2. Dual Screens
    const scrW = (ow - 14) / 2;
    const scrH = oh - 12;
    const sY = oy + 6;

    // Left Screen: Live ECG Heartbeat Waveform
    const s1X = ox + 5;
    ctx.fillStyle = '#022c22';
    ctx.fillRect(s1X, sY, scrW, scrH);
    ctx.strokeStyle = '#065f46';
    ctx.lineWidth = 0.5;
    ctx.strokeRect(s1X, sY, scrW, scrH);

    // Dynamic ECG wave line
    ctx.strokeStyle = isHacked ? '#43e97b' : '#22c55e';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    const ecgMid = sY + scrH / 2;
    const ecgPhase = (time * 28) % scrW;
    ctx.moveTo(s1X, ecgMid);
    for (let x = 0; x < scrW; x += 2) {
      let dy = 0;
      const distFromPulse = Math.abs(x - ecgPhase);
      if (distFromPulse < 3) {
        dy = -scrH * 0.38; // QRS spike
      } else if (distFromPulse < 6) {
        dy = scrH * 0.22;
      }
      ctx.lineTo(s1X + x, ecgMid + dy);
    }
    ctx.stroke();

    // Right Screen: Digital Telemetry
    const s2X = s1X + scrW + 4;
    ctx.fillStyle = '#0c4a6e';
    ctx.fillRect(s2X, sY, scrW, scrH);
    ctx.fillStyle = isHacked ? '#43e97b' : '#38bdf8';
    ctx.font = 'bold 6px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('BPM 78', s2X + 3, sY + 7);
    ctx.fillText(isHacked ? 'SPO2 99%' : 'SECURE', s2X + 3, sY + 14);

    // 3. Status LEDs
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = isHacked ? '#43e97b' : (i === 0 ? `rgba(6, 182, 212, ${pulse})` : '#64748b');
      ctx.beginPath();
      ctx.arc(s2X + 6 + i * 6, sY + scrH - 3, 1.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4. Label
    ctx.fillStyle = isHacked ? '#43e97b' : '#00f2fe';
    ctx.font = 'bold 8.5px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isHacked ? '✅ ICU OVERRIDDEN' : '💻 ICU WORKSTATION [E]', cx, oy - 8);
  }

  private renderLivingRoomTerminal(obj: GameObject, ox: number, oy: number, ow: number, oh: number, time: number, isHacked: boolean) {
    const ctx = this.ctx;
    const cx = ox + ow / 2;
    const pulse = Math.sin(time * 5) * 0.2 + 0.8;

    // 1. Handcrafted Dark Walnut Wood Pedestal
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.roundRect(ox + 3, oy + 4, ow - 6, oh - 6, 4);
    ctx.fill();
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Brass corner brackets
    ctx.fillStyle = '#d97706';
    ctx.fillRect(ox + 4, oy + 5, 4, 4);
    ctx.fillRect(ox + ow - 8, oy + 5, 4, 4);

    // 2. Frameless Glass Smart-Home Tablet Console
    const tabW = ow - 16;
    const tabH = oh - 12;
    const tabX = cx - tabW / 2;
    const tabY = oy + 6;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(tabX, tabY, tabW, tabH, 3);
    ctx.fill();
    ctx.strokeStyle = isHacked ? '#43e97b' : `rgba(251, 191, 36, ${pulse})`;
    ctx.lineWidth = 1;
    ctx.stroke();

    // Blueprint floor plan lines on screen
    ctx.strokeStyle = isHacked ? 'rgba(67, 233, 123, 0.4)' : 'rgba(56, 189, 248, 0.4)';
    ctx.lineWidth = 0.8;
    ctx.strokeRect(tabX + 3, tabY + 3, 10, 8);
    ctx.strokeRect(tabX + 15, tabY + 3, 12, 8);
    // Indicator LED
    ctx.fillStyle = isHacked ? '#43e97b' : '#fbbf24';
    ctx.beginPath();
    ctx.arc(tabX + tabW - 4, tabY + tabH - 4, 2, 0, Math.PI * 2);
    ctx.fill();

    // 3. Label
    ctx.fillStyle = isHacked ? '#43e97b' : '#fbbf24';
    ctx.font = 'bold 8.5px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isHacked ? '✅ HOME AUTOMATION OVERRIDDEN' : '💻 SMART HOME HUB [E]', cx, oy - 8);
  }

  private renderGymTerminal(obj: GameObject, ox: number, oy: number, ow: number, oh: number, time: number, isHacked: boolean) {
    const ctx = this.ctx;
    const cx = ox + ow / 2;
    const pulse = Math.sin(time * 6) * 0.2 + 0.8;

    // 1. High-Impact Carbon Fiber Kiosk (Matte Black & Crimson)
    ctx.fillStyle = '#18181b';
    ctx.beginPath();
    ctx.roundRect(ox + 2, oy + 3, ow - 4, oh - 5, 4);
    ctx.fill();
    ctx.strokeStyle = isHacked ? '#43e97b' : '#ef4444';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Athletic racing stripes
    ctx.fillStyle = '#ef4444';
    ctx.fillRect(ox + 4, oy + 4, 3, oh - 7);
    ctx.fillRect(ox + ow - 7, oy + 4, 3, oh - 7);

    // 2. Biometric Laser Palm Scanner Plate
    const scanW = 18;
    const scanH = oh - 12;
    const scanX = ox + 10;
    const scanY = oy + 6;
    ctx.fillStyle = '#09090b';
    ctx.fillRect(scanX, scanY, scanW, scanH);
    ctx.strokeStyle = isHacked ? '#43e97b' : '#00f2fe';
    ctx.lineWidth = 1;
    ctx.strokeRect(scanX, scanY, scanW, scanH);

    // Laser scanning beam
    const beamY = scanY + (Math.sin(time * 6) * 0.5 + 0.5) * (scanH - 2);
    ctx.strokeStyle = isHacked ? '#43e97b' : '#00f2fe';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(scanX, beamY);
    ctx.lineTo(scanX + scanW, beamY);
    ctx.stroke();

    // 3. Telemetry Matrix Display
    const telX = scanX + scanW + 4;
    const telW = ow - scanW - 22;
    ctx.fillStyle = '#042f2e';
    ctx.fillRect(telX, scanY, telW, scanH);
    // Performance bars
    for (let b = 0; b < 4; b++) {
      const bH = (Math.sin(time * 4 + b) * 0.3 + 0.6) * (scanH - 4);
      ctx.fillStyle = isHacked ? '#43e97b' : (b % 2 === 0 ? '#00f2fe' : '#ef4444');
      ctx.fillRect(telX + 3 + b * 5, scanY + scanH - 2 - bH, 3.5, bH);
    }

    // 4. Label
    ctx.fillStyle = isHacked ? '#43e97b' : '#00f2fe';
    ctx.font = 'bold 8.5px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isHacked ? '✅ BIOMETRIC ACCESS GRANTED' : '💻 BIOMETRIC HUB [E]', cx, oy - 8);
  }

  private renderBankTerminal(obj: GameObject, ox: number, oy: number, ow: number, oh: number, time: number, isHacked: boolean) {
    const ctx = this.ctx;
    const cx = ox + ow / 2;
    const pulse = Math.sin(time * 5) * 0.2 + 0.8;

    // 1. Heavy Titanium Vault Console
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(ox + 2, oy + 3, ow - 4, oh - 5, 4);
    ctx.fill();
    ctx.strokeStyle = isHacked ? '#43e97b' : '#eab308';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Hazard Stripes
    for (let s = 0; s < ow - 10; s += 8) {
      ctx.fillStyle = '#eab308';
      ctx.fillRect(ox + 5 + s, oy + 4, 4, 3);
    }

    // 2. Monochrome Green CRT Security Screen
    const crtW = ow - 24;
    const crtH = oh - 14;
    const crtX = ox + 6;
    const crtY = oy + 9;
    ctx.fillStyle = '#052e16';
    ctx.fillRect(crtX, crtY, crtW, crtH);
    ctx.strokeStyle = '#166534';
    ctx.lineWidth = 1;
    ctx.strokeRect(crtX, crtY, crtW, crtH);

    // Cryptographic stream text
    ctx.fillStyle = isHacked ? '#43e97b' : `rgba(34, 197, 94, ${pulse})`;
    ctx.font = 'bold 6.5px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(isHacked ? 'OVERRIDE: 100%' : 'DECRYPT: [OK]', crtX + 3, crtY + 8);

    // 3. Rotary Dial on Right
    const dialX = ox + ow - 10;
    const dialY = oy + oh / 2 + 2;
    ctx.fillStyle = '#64748b';
    ctx.beginPath();
    ctx.arc(dialX, dialY, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.stroke();

    // 4. Label
    ctx.fillStyle = isHacked ? '#43e97b' : '#eab308';
    ctx.font = 'bold 8.5px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isHacked ? '✅ VAULT LOCK BYPASSED' : '💻 VAULT TERMINAL [E]', cx, oy - 8);
  }

  private renderPoliceTerminal(obj: GameObject, ox: number, oy: number, ow: number, oh: number, time: number, isHacked: boolean) {
    const ctx = this.ctx;
    const cx = ox + ow / 2;

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(ox + 2, oy + 3, ow - 4, oh - 5, 4);
    ctx.fill();
    ctx.strokeStyle = isHacked ? '#43e97b' : '#3b82f6';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Dispatch beacon (alternating blue & red)
    const isBluePhase = Math.floor(time * 6) % 2 === 0;
    ctx.fillStyle = isHacked ? '#43e97b' : (isBluePhase ? '#3b82f6' : '#ef4444');
    ctx.fillRect(cx - 5, oy - 2, 10, 4);

    // CCTV grid
    const cW = (ow - 16) / 2;
    const cH = oh - 12;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(ox + 6, oy + 6, cW, cH);
    ctx.fillRect(ox + 8 + cW, oy + 6, cW, cH);

    ctx.fillStyle = isHacked ? '#43e97b' : '#3b82f6';
    ctx.font = 'bold 8.5px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isHacked ? '✅ DISPATCH CLEARED' : '💻 DISPATCH CONSOLE [E]', cx, oy - 8);
  }

  private renderRailwayTerminal(obj: GameObject, ox: number, oy: number, ow: number, oh: number, time: number, isHacked: boolean) {
    const ctx = this.ctx;
    const cx = ox + ow / 2;

    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.roundRect(ox + 2, oy + 3, ow - 4, oh - 5, 4);
    ctx.fill();
    ctx.strokeStyle = isHacked ? '#43e97b' : '#f59e0b';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Brass levers
    for (let l = 0; l < 4; l++) {
      ctx.fillStyle = '#d97706';
      ctx.fillRect(ox + 8 + l * 8, oy + 6, 3, oh - 12);
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(ox + 7 + l * 8, oy + 5, 5, 3);
    }

    // Signal lights
    ctx.fillStyle = isHacked ? '#43e97b' : '#ef4444';
    ctx.beginPath();
    ctx.arc(ox + ow - 10, oy + oh / 2, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = isHacked ? '#43e97b' : '#f59e0b';
    ctx.font = 'bold 8.5px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isHacked ? '✅ RAIL INTERLOCK CLEARED' : '💻 SIGNAL CONSOLE [E]', cx, oy - 8);
  }

  private renderSnowTerminal(obj: GameObject, ox: number, oy: number, ow: number, oh: number, time: number, isHacked: boolean) {
    const ctx = this.ctx;
    const cx = ox + ow / 2;

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(ox + 2, oy + 3, ow - 4, oh - 5, 4);
    ctx.fill();
    ctx.strokeStyle = isHacked ? '#43e97b' : '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Frost glazing on top
    ctx.fillStyle = 'rgba(224, 242, 254, 0.4)';
    ctx.fillRect(ox + 3, oy + 3, ow - 6, 3);

    // Screen
    ctx.fillStyle = '#082f49';
    ctx.fillRect(ox + 6, oy + 7, ow - 12, oh - 12);
    ctx.fillStyle = isHacked ? '#43e97b' : '#7dd3fc';
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isHacked ? 'CRYO: STABLE' : '-40°C CRYO LOCK', cx, oy + oh / 2 + 3);

    ctx.fillStyle = isHacked ? '#43e97b' : '#38bdf8';
    ctx.font = 'bold 8.5px "Press Start 2P", monospace';
    ctx.fillText(isHacked ? '✅ CRYO MATRIX UNLOCKED' : '💻 CRYO TERMINAL [E]', cx, oy - 8);
  }

  private renderVolcanoTerminal(obj: GameObject, ox: number, oy: number, ow: number, oh: number, time: number, isHacked: boolean) {
    const ctx = this.ctx;
    const cx = ox + ow / 2;
    const pulse = Math.sin(time * 6) * 0.2 + 0.8;

    ctx.fillStyle = '#1c1917';
    ctx.beginPath();
    ctx.roundRect(ox + 2, oy + 3, ow - 4, oh - 5, 4);
    ctx.fill();
    ctx.strokeStyle = isHacked ? '#43e97b' : '#f97316';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Molten lava conduit pipe
    ctx.fillStyle = isHacked ? '#43e97b' : `rgba(249, 115, 22, ${pulse})`;
    ctx.fillRect(ox + 6, oy + oh - 7, ow - 12, 3);

    // Gauge
    ctx.fillStyle = '#451a03';
    ctx.beginPath();
    ctx.arc(cx, oy + 12, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = isHacked ? '#43e97b' : '#f97316';
    ctx.stroke();

    ctx.fillStyle = isHacked ? '#43e97b' : '#f97316';
    ctx.font = 'bold 8.5px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isHacked ? '✅ GEOTHERMAL CORE STABILIZED' : '💻 CORE REGULATOR [E]', cx, oy - 8);
  }

  private renderCyberTerminal(obj: GameObject, ox: number, oy: number, ow: number, oh: number, time: number, isHacked: boolean) {
    const ctx = this.ctx;
    const cx = ox + ow / 2;
    const pulse = Math.sin(time * 5) * 0.2 + 0.8;

    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(ox + 2, oy + 2, ow - 4, oh - 4, 6);
    ctx.fill();
    ctx.strokeStyle = isHacked ? '#43e97b' : '#00f2fe';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Screen glow
    ctx.fillStyle = isHacked ? 'rgba(67, 233, 123, 0.25)' : `rgba(0, 242, 254, ${0.2 * pulse})`;
    ctx.beginPath();
    ctx.roundRect(ox + 5, oy + 5, ow - 10, oh - 10, 4);
    ctx.fill();

    // Matrix lines
    ctx.fillStyle = isHacked ? '#43e97b' : '#00f2fe';
    ctx.font = 'bold 6.5px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(isHacked ? 'BYPASS: 100%' : 'ROOT_ACCESS: 0x9F', ox + 8, oy + 14);

    // Terminal Label
    ctx.fillStyle = isHacked ? '#43e97b' : '#00f2fe';
    ctx.font = 'bold 8.5px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isHacked ? '✅ FIREWALL BYPASSED' : '💻 HACK TERMINAL [E]', cx, oy - 8);
  }

  private renderProp(obj: GameObject, ox: number, oy: number, ow: number, oh: number, time: number) {
    const ctx = this.ctx;
    const name = (obj.name || '').toLowerCase();

    if (name.includes('train') || name.includes('locomotive') || name.includes('carriage') || name.includes('metro car') || name.includes('railcar')) {
      // 🚆 STREAMLINED TRAIN CARRIAGE / LOCOMOTIVE
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.roundRect(ox + 2, oy + 4, ow - 4, oh - 4, 6);
      ctx.fill();

      // Main Train Body (Royal Blue / Gunmetal)
      const isEngine = name.includes('locomotive') || name.includes('engine');
      ctx.fillStyle = isEngine ? '#1e3a8a' : '#1e293b';
      ctx.beginPath();
      ctx.roundRect(ox + 3, oy + 2, ow - 6, oh - 6, 6);
      ctx.fill();

      // Silver Streamline Roof
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.roundRect(ox + 4, oy + 3, ow - 8, Math.max(4, oh * 0.22), 3);
      ctx.fill();

      // High-Voltage Pantograph on Roof
      const cx = ox + ow / 2;
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx - 8, oy + 3);
      ctx.lineTo(cx, oy - 4);
      ctx.lineTo(cx + 8, oy + 3);
      ctx.stroke();
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(cx - 6, oy - 5, 12, 2);

      // Warning Speed Stripes
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(ox + 4, oy + oh * 0.35, ow - 8, 2.5);

      // Passenger Windows with Illuminated Interior & Passenger Silhouettes
      const winCount = Math.max(2, Math.floor((ow - 16) / 16));
      const winW = (ow - 20 - (winCount - 1) * 4) / winCount;
      const winH = Math.max(5, oh * 0.28);
      const winY = oy + oh * 0.45;

      for (let w = 0; w < winCount; w++) {
        const wx = ox + 10 + w * (winW + 4);
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(wx - 1, winY - 1, winW + 2, winH + 2, 2);
        ctx.fill();

        ctx.fillStyle = '#fef08a';
        ctx.fillRect(wx, winY, winW, winH);

        // Commuter Silhouette inside window
        ctx.fillStyle = '#334155';
        ctx.beginPath();
        ctx.arc(wx + winW / 2, winY + winH - 1, 2.5, Math.PI, 0, false);
        ctx.fill();
      }

      // Dual Front Headlights
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ox + ow - 5, oy + oh * 0.38, 2.5, 0, Math.PI * 2);
      ctx.arc(ox + ow - 5, oy + oh * 0.72, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Forward Headlight Glow Cones
      const headGrad = ctx.createLinearGradient(ox + ow - 4, oy + oh / 2, ox + ow + 20, oy + oh / 2);
      headGrad.addColorStop(0, 'rgba(254, 240, 138, 0.4)');
      headGrad.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = headGrad;
      ctx.beginPath();
      ctx.moveTo(ox + ow - 3, oy + 4);
      ctx.lineTo(ox + ow + 18, oy - 4);
      ctx.lineTo(ox + ow + 18, oy + oh + 4);
      ctx.lineTo(ox + ow - 3, oy + oh - 4);
      ctx.closePath();
      ctx.fill();

      // Steel Wheel Bogies underneath
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(ox + 8, oy + oh - 6, 10, 3);
      ctx.fillRect(ox + ow - 18, oy + oh - 6, 10, 3);

    } else if (name.includes('airplane') || name.includes('aircraft') || name.includes('plane') || name.includes('airliner') || name.includes('jet')) {
      // ✈️ COMMERCIAL JET AIRLINER
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(ox + 4, oy + oh * 0.25, ow - 8, oh * 0.5, 8);
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Swept Wings
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.moveTo(ox + ow * 0.35, oy + oh * 0.25);
      ctx.lineTo(ox + ow * 0.2, oy + 2);
      ctx.lineTo(ox + ow * 0.45, oy + oh * 0.25);
      ctx.moveTo(ox + ow * 0.35, oy + oh * 0.75);
      ctx.lineTo(ox + ow * 0.2, oy + oh - 2);
      ctx.lineTo(ox + ow * 0.45, oy + oh * 0.75);
      ctx.fill();

      // Jet Turbines
      ctx.fillStyle = '#475569';
      ctx.fillRect(ox + ow * 0.3, oy + 4, 8, 4);
      ctx.fillRect(ox + ow * 0.3, oy + oh - 8, 8, 4);

      // Cockpit Windshield
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(ox + ow - 7, oy + oh / 2, 4, -Math.PI / 2, Math.PI / 2);
      ctx.fill();

      // Portholes
      ctx.fillStyle = '#38bdf8';
      for (let p = 0; p < 4; p++) {
        ctx.fillRect(ox + 10 + p * 6, oy + oh * 0.4, 2.5, 2.5);
      }

    } else if (name.includes('vault door') || name.includes('bank vault') || name.includes('blast door')) {
      // 🏦 MASSIVE CIRCULAR BANK VAULT DOOR
      const cx = ox + ow / 2;
      const cy = oy + oh / 2;
      const radius = Math.min(ow, oh) * 0.44;

      // Outer Square Blast Frame
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(ox + 2, oy + 2, ow - 4, oh - 4, 6);
      ctx.fill();
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Hinges
      ctx.fillStyle = '#64748b';
      ctx.fillRect(ox + 2, oy + 6, 6, 8);
      ctx.fillRect(ox + 2, oy + oh - 14, 6, 8);

      // Circular Hatch
      const hatchGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, radius);
      hatchGrad.addColorStop(0, '#64748b');
      hatchGrad.addColorStop(0.7, '#334155');
      hatchGrad.addColorStop(1, '#0f172a');
      ctx.fillStyle = hatchGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Radial Locking Deadbolts
      for (let b = 0; b < 8; b++) {
        const bAngle = (b * Math.PI * 2) / 8;
        const bx = cx + Math.cos(bAngle) * (radius - 2);
        const by = cy + Math.sin(bAngle) * (radius - 2);
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(bx, by, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // Central Chrome 4-Spoke Wheel
      const wheelRot = time * 0.5;
      ctx.strokeStyle = '#f8fafc';
      ctx.lineWidth = 2.5;
      for (let s = 0; s < 4; s++) {
        const sAngle = wheelRot + (s * Math.PI) / 2;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(sAngle) * (radius * 0.6), cy + Math.sin(sAngle) * (radius * 0.6));
        ctx.stroke();
      }
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 0.28, 0, Math.PI * 2);
      ctx.fill();

      // Keypad
      ctx.fillStyle = '#10b981';
      ctx.fillRect(ox + ow - 12, oy + 6, 6, 4);

    } else if (name.includes('gold') || name.includes('bullion') || name.includes('ingot')) {
      // 🪙 GOLD BULLION PYRAMID STACK
      ctx.fillStyle = '#78350f';
      ctx.fillRect(ox + 3, oy + oh - 5, ow - 6, 4);

      const drawGoldBar = (bx: number, by: number, bw: number, bh: number) => {
        const barGrad = ctx.createLinearGradient(bx, by, bx, by + bh);
        barGrad.addColorStop(0, '#fef08a');
        barGrad.addColorStop(0.3, '#ffd700');
        barGrad.addColorStop(1, '#b45309');
        ctx.fillStyle = barGrad;
        ctx.beginPath();
        ctx.moveTo(bx + 2, by);
        ctx.lineTo(bx + bw - 2, by);
        ctx.lineTo(bx + bw, by + bh);
        ctx.lineTo(bx, by + bh);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 0.75;
        ctx.stroke();

        ctx.fillStyle = '#78350f';
        ctx.fillRect(bx + bw * 0.25, by + bh * 0.45, bw * 0.5, 1);
      };

      const barW = Math.min(18, (ow - 10) / 2);
      const barH = 5;
      const baseY = oy + oh - 10;

      drawGoldBar(ox + ow * 0.1, baseY, barW, barH);
      drawGoldBar(ox + ow * 0.5, baseY, barW, barH);
      drawGoldBar(ox + ow * 0.3, baseY - barH, barW, barH);

      const glintPulse = Math.sin(time * 6) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${glintPulse})`;
      ctx.beginPath();
      ctx.arc(ox + ow * 0.32, baseY - barH, 2, 0, Math.PI * 2);
      ctx.arc(ox + ow * 0.68, baseY, 2, 0, Math.PI * 2);
      ctx.fill();

    } else if (name.includes('cash') || name.includes('money') || name.includes('banknote') || name.includes('currency') || name.includes('dollar')) {
      // 💵 BANDED CASH RESERVE STACKS
      ctx.fillStyle = '#78350f';
      ctx.fillRect(ox + 3, oy + oh - 5, ow - 6, 3);

      const stackCount = Math.max(2, Math.floor((ow - 8) / 14));
      const stackW = (ow - 10) / stackCount;
      const stackH = Math.max(8, oh * 0.45);

      for (let s = 0; s < stackCount; s++) {
        const sx = ox + 5 + s * stackW;
        const sy = oy + oh - 8 - stackH;

        ctx.fillStyle = '#065f46';
        ctx.beginPath();
        ctx.roundRect(sx, sy, stackW - 3, stackH, 2);
        ctx.fill();

        ctx.fillStyle = '#10b981';
        ctx.fillRect(sx + 1, sy + 1, stackW - 5, Math.max(3, stackH * 0.3));

        ctx.strokeStyle = '#ecfdf5';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(sx + 2, sy + 2, stackW - 7, Math.max(2, stackH * 0.3 - 2));

        ctx.fillStyle = '#fde047';
        ctx.fillRect(sx + (stackW - 3) * 0.35, sy, 4, stackH);

        ctx.fillStyle = '#064e3b';
        ctx.font = 'bold 6px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('$', sx + (stackW - 3) / 2, sy + stackH * 0.6);
      }

    } else if (name.includes('cell') || name.includes('jail') || name.includes('cage') || name.includes('prison')) {
      // 👮 HOLDING CELL WITH VERTICAL STEEL BARS & BUNK
      ctx.fillStyle = '#0a0d14';
      ctx.beginPath();
      ctx.roundRect(ox + 2, oy + 2, ow - 4, oh - 4, 3);
      ctx.fill();

      // Cot inside
      ctx.fillStyle = '#334155';
      ctx.fillRect(ox + 5, oy + oh * 0.3, ow * 0.45, Math.max(6, oh * 0.4));
      ctx.fillStyle = '#64748b';
      ctx.fillRect(ox + 7, oy + oh * 0.32, ow * 0.25, Math.max(4, oh * 0.35));
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(ox + ow * 0.32, oy + oh * 0.35, 6, 6);

      // Vertical Steel Bars
      const barSpacing = 8;
      const barTotal = Math.max(3, Math.floor((ow - 6) / barSpacing));
      for (let b = 0; b < barTotal; b++) {
        const bx = ox + 4 + b * barSpacing;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(bx, oy + 3, 3, oh - 6);
        ctx.fillStyle = '#cbd5e1';
        ctx.fillRect(bx + 1, oy + 3, 1, oh - 6);
      }

      ctx.fillStyle = '#475569';
      ctx.fillRect(ox + 2, oy + oh / 2 - 2, ow - 4, 4);
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(ox + ow - 10, oy + oh / 2 - 4, 6, 8);

    } else if (name.includes('booking') || (name.includes('police') && name.includes('desk'))) {
      // 👮 POLICE PRECINCT BOOKING DESK
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(ox + 2, oy + 2, ow - 4, oh - 4, 4);
      ctx.fill();

      // Height scale
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(ox + 4, oy + 4, ow * 0.3, Math.max(6, oh * 0.35));
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 0.5;
      for (let l = 0; l < 4; l++) {
        ctx.beginPath();
        ctx.moveTo(ox + 5, oy + 6 + l * 3);
        ctx.lineTo(ox + 4 + ow * 0.3 - 2, oy + 6 + l * 3);
        ctx.stroke();
      }

      // Monitor
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(ox + ow * 0.4, oy + 4, ow * 0.35, Math.max(6, oh * 0.45));
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(ox + ow * 0.42, oy + 6, ow * 0.31, Math.max(4, oh * 0.35));

      // Fingerprint scanner
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.roundRect(ox + ow * 0.8, oy + 6, 8, 8, 2);
      ctx.fill();

      // Handcuffs
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(ox + 10, oy + oh - 8, 3, 0, Math.PI * 2);
      ctx.arc(ox + 17, oy + oh - 8, 3, 0, Math.PI * 2);
      ctx.stroke();

    } else if (name.includes('interrogation')) {
      // 🕵️ INTERROGATION ROOM TABLE & OVERHEAD SPOTLIGHT
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(ox + 4, oy + 6, ow - 8, oh - 10, 4);
      ctx.fill();

      ctx.fillStyle = '#475569';
      ctx.fillRect(ox + 8, oy + oh * 0.3, ow - 16, oh * 0.45);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.strokeRect(ox + 8, oy + oh * 0.3, ow - 16, oh * 0.45);

      // Recorder with red LED
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(ox + ow / 2 - 5, oy + oh * 0.35, 10, 6);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(ox + ow / 2 - 2, oy + oh * 0.35 + 3, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Spotlight
      const spotGrad = ctx.createRadialGradient(ox + ow / 2, oy + oh / 2, 2, ox + ow / 2, oy + oh / 2, Math.min(ow, oh) * 0.7);
      spotGrad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      spotGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = spotGrad;
      ctx.beginPath();
      ctx.arc(ox + ow / 2, oy + oh / 2, Math.min(ow, oh) * 0.7, 0, Math.PI * 2);
      ctx.fill();

    } else if (name.includes('siren') || name.includes('beacon') || name.includes('alarm')) {
      // 🚨 POLICE EMERGENCY STROBE BEACON
      const cx = ox + ow / 2;
      const cy = oy + oh / 2;
      const pulse = Math.sin(time * 12) > 0;

      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(ox + ow * 0.2, oy + oh * 0.4, ow * 0.6, oh * 0.5, 4);
      ctx.fill();

      ctx.fillStyle = pulse ? '#ef4444' : '#3b82f6';
      ctx.beginPath();
      ctx.arc(cx, cy - 2, Math.min(10, ow * 0.35), Math.PI, 0, false);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = pulse ? 'rgba(239, 68, 68, 0.4)' : 'rgba(59, 130, 246, 0.4)';
      ctx.beginPath();
      ctx.arc(cx, cy - 2, Math.min(22, ow * 0.7), 0, Math.PI * 2);
      ctx.fill();

    } else if (name.includes('hospital bed') || name.includes('stretcher') || (name.includes('bed') && !name.includes('bunk'))) {
      // 🏥 HOSPITAL PATIENT BED & IV DRIP STAND
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(ox + 4, oy + 4, ow - 12, oh - 8, 4);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(ox + 6, oy + 8, ow - 16, oh - 14);
      ctx.fillStyle = '#e0f2fe';
      ctx.fillRect(ox + 6, oy + 8, ow - 16, Math.max(4, oh * 0.35));

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.roundRect(ox + ow - 20, oy + 10, 10, oh - 18, 3);
      ctx.fill();

      // IV Stand
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(ox + ow - 6, oy + 3, 2, oh - 6);
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(ox + ow - 5, oy + 5, 3, 0, Math.PI * 2);
      ctx.fill();

    } else if (name.includes('heart') || name.includes('ecg') || name.includes('vitals') || (name.includes('monitor') && !name.includes('board'))) {
      // 📈 PATIENT VITALS ECG MONITOR
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(ox + 3, oy + 3, ow - 6, oh - 6, 4);
      ctx.fill();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.strokeStyle = '#4ade80';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      const my = oy + oh / 2;
      ctx.moveTo(ox + 6, my);
      ctx.lineTo(ox + ow * 0.3, my);
      ctx.lineTo(ox + ow * 0.4, my - 6);
      ctx.lineTo(ox + ow * 0.5, my + 8);
      ctx.lineTo(ox + ow * 0.6, my - 8);
      ctx.lineTo(ox + ow * 0.7, my);
      ctx.lineTo(ox + ow - 6, my);
      ctx.stroke();

      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 7px monospace';
      ctx.fillText('78', ox + 6, oy + 10);

    } else if (name.includes('surgical') || name.includes('operating lamp')) {
      // 💡 SURGICAL OPERATING LAMP
      const cx = ox + ow / 2;
      const cy = oy + oh / 2;
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, oy + 2);
      ctx.lineTo(cx, cy);
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(10, ow * 0.4), 0, Math.PI * 2);
      ctx.fill();

      const lampGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, Math.min(ow, oh) * 0.8);
      lampGrad.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
      lampGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = lampGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(ow, oh) * 0.8, 0, Math.PI * 2);
      ctx.fill();

    } else if (name.includes('medicine') || name.includes('pharmacy') || name.includes('cabinet') || name.includes('medical supply')) {
      // 💊 EMERGENCY PHARMACY & MEDICINE CABINET
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(ox + 3, oy + 3, ow - 6, oh - 6, 4);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Top Red Cross Badge
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(ox + ow / 2 - 4, oy + 5, 8, 2.5);
      ctx.fillRect(ox + ow / 2 - 1.25, oy + 2.5, 2.5, 7.5);

      // Glass Door Shelves
      ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
      ctx.fillRect(ox + 5, oy + 12, ow - 10, oh - 16);
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(ox + 5, oy + oh * 0.5);
      ctx.lineTo(ox + ow - 5, oy + oh * 0.5);
      ctx.stroke();

      // Amber Pill Bottles & Blue Saline Vials on Shelves
      ctx.fillStyle = '#d97706'; // Amber bottle
      ctx.fillRect(ox + 7, oy + 14, 4, 6);
      ctx.fillStyle = '#ffffff'; // White cap
      ctx.fillRect(ox + 7, oy + 13, 4, 1.5);

      ctx.fillStyle = '#38bdf8'; // Blue vial
      ctx.fillRect(ox + 14, oy + 15, 3.5, 5);
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(ox + 14, oy + 14, 3.5, 1.5);

      ctx.fillStyle = '#10b981'; // Green tincture
      ctx.fillRect(ox + ow - 12, oy + oh * 0.55, 4, 6);

    } else if (name.includes('mri') || name.includes('scanner') || name.includes('ct ') || name.includes('diagnostic')) {
      // 🩻 MOBILE MRI / CT SCANNER GANTRY
      const cx = ox + ow * 0.42;
      const cy = oy + oh / 2;

      // Outer Aerodynamic White Gantry
      ctx.fillStyle = '#f1f5f9';
      ctx.beginPath();
      ctx.roundRect(ox + 2, oy + 2, ow * 0.75, oh - 4, 8);
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Circular Magnet Bore
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(ow * 0.25, oh * 0.35), 0, Math.PI * 2);
      ctx.fill();

      // Cyan Bore Illumination Ring
      const borePulse = Math.sin(time * 4) * 0.2 + 0.8;
      ctx.strokeStyle = `rgba(0, 242, 254, ${borePulse})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(ow * 0.25, oh * 0.35) - 2, 0, Math.PI * 2);
      ctx.stroke();

      // Sliding Motorized Examination Table extending to the right
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.roundRect(cx, cy - 3, ow - cx + ox - 3, 6, 2);
      ctx.fill();

      // Diagnostic LED Panel
      ctx.fillStyle = '#10b981';
      ctx.fillRect(ox + 6, oy + 5, 8, 3);

    } else if (name.includes('stove') || name.includes('range') || name.includes('burner') || name.includes('cooking')) {
      // 🍳 COMMERCIAL KITCHEN STOVE RANGE WITH GAS BURNERS
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.roundRect(ox + 3, oy + 3, ow - 6, oh - 6, 4);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.stroke();

      const bRad = Math.min(6, (oh - 12) * 0.35);
      const bOffset = ow * 0.25;
      const flamePulse = Math.sin(time * 10) * 0.2 + 0.8;

      for (let bx = 0; bx < 2; bx++) {
        for (let by = 0; by < 2; by++) {
          const bpx = ox + ow * 0.3 + bx * bOffset;
          const bpy = oy + oh * 0.3 + by * (oh * 0.4);

          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.arc(bpx, bpy, bRad, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = `rgba(56, 189, 248, ${0.8 * flamePulse})`;
          ctx.beginPath();
          ctx.arc(bpx, bpy, bRad * 0.65, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(249, 115, 22, ${0.9 * flamePulse})`;
          ctx.beginPath();
          ctx.arc(bpx, bpy, bRad * 0.35, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.fillStyle = '#f59e0b';
      for (let k = 0; k < 4; k++) {
        ctx.fillRect(ox + 6 + k * 8, oy + oh - 5, 4, 2);
      }

    } else if (name.includes('refrigerator') || name.includes('fridge') || name.includes('freezer')) {
      // 🧊 COMMERCIAL STAINLESS REFRIGERATOR
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.roundRect(ox + 3, oy + 2, ow - 6, oh - 4, 4);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.fillStyle = '#475569';
      ctx.fillRect(ox + ow / 2 - 1, oy + 4, 2, oh - 8);

      ctx.fillStyle = '#1e293b';
      ctx.fillRect(ox + ow / 2 - 5, oy + oh * 0.25, 2, oh * 0.5);
      ctx.fillRect(ox + ow / 2 + 3, oy + oh * 0.25, 2, oh * 0.5);

    } else if (name.includes('conveyor') || name.includes('carousel')) {
      // 🧳 BAGGAGE CONVEYOR BELT
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(ox + 2, oy + 2, ow - 4, oh - 4, 6);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(ox + 4, oy + 4, ow - 8, oh - 8);

      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      const slatOffset = (time * 20) % 10;
      for (let s = -10; s < ow; s += 10) {
        ctx.beginPath();
        ctx.moveTo(ox + s + slatOffset, oy + 5);
        ctx.lineTo(ox + s + slatOffset, oy + oh - 5);
        ctx.stroke();
      }

    } else if (name.includes('radar') || name.includes('antenna')) {
      // 📡 AIR TRAFFIC RADAR TOWER
      const cx = ox + ow / 2;
      const cy = oy + oh / 2;

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx - 10, oy + oh - 3);
      ctx.lineTo(cx, cy);
      ctx.lineTo(cx + 10, oy + oh - 3);
      ctx.stroke();

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(time * 3);
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, Math.min(10, ow * 0.4), 0, Math.PI);
      ctx.stroke();
      ctx.restore();

      ctx.fillStyle = 'rgba(0, 242, 254, 0.2)';
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(16, ow * 0.65), 0, Math.PI * 2);
      ctx.fill();

    } else if (name.includes('penguin') || name.includes('colony')) {
      // 🐧 PENGUIN NESTING COLONY / HUDDLE
      ctx.fillStyle = 'rgba(224, 242, 254, 0.35)';
      ctx.beginPath();
      ctx.ellipse(ox + ow / 2, oy + oh / 2, ow * 0.45, oh * 0.4, 0, 0, Math.PI * 2);
      ctx.fill();

      const drawLittlePenguin = (px: number, py: number) => {
        const pBob = Math.sin(time * 8 + px) * 1.5;
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(px, py + pBob, 5, 7, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.ellipse(px, py + 1 + pBob, 3, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.moveTo(px - 1, py - 4 + pBob);
        ctx.lineTo(px + 3, py - 3 + pBob);
        ctx.lineTo(px - 1, py - 2 + pBob);
        ctx.fill();
        ctx.fillStyle = '#f97316';
        ctx.fillRect(px - 3, py + 6 + pBob, 2.5, 2);
        ctx.fillRect(px + 1, py + 6 + pBob, 2.5, 2);
      };

      drawLittlePenguin(ox + ow * 0.35, oy + oh * 0.5);
      drawLittlePenguin(ox + ow * 0.65, oy + oh * 0.45);

    } else if (name.includes('departure') || name.includes('schedule') || (name.includes('timetable') && !name.includes('whiteboard'))) {
      // 🚆 DEPARTURE SCHEDULE BOARD (Amber Digital Flip-dot)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(ox + 2, oy + 2, ow - 4, oh - 4, 3);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const rowCount = Math.max(2, Math.floor((oh - 8) / 6));
      const rowH = (oh - 8) / rowCount;
      for (let r = 0; r < rowCount; r++) {
        const ry = oy + 4 + r * rowH;
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(ox + 5, ry + 1, Math.min(18, ow * 0.4), 2);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(ox + ow - 14, ry + 1, 8, 2);
      }

    } else if (name.includes('ticket') || name.includes('kiosk') || name.includes('vending')) {
      // 🎫 TICKET VENDING KIOSK
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(ox + 2, oy + 2, ow - 4, oh - 4, 4);
      ctx.fill();
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#0284c7';
      ctx.fillRect(ox + 5, oy + 5, ow - 10, Math.max(6, (oh - 10) * 0.45));
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(ox + 7, oy + 7, ow - 14, Math.max(3, (oh - 10) * 0.35));

      ctx.fillStyle = '#ffd700';
      ctx.fillRect(ox + 6, oy + oh - 8, 8, 2);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(ox + ow - 16, oy + oh - 9, 12, 4);

    } else if (name.includes('turnstile') || name.includes('gate') || name.includes('barrier')) {
      // 🚇 METRO TURNSTILE / SECURITY GATE
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(ox + 2, oy + 2, ow - 4, oh - 4, 3);
      ctx.fill();
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.strokeRect(ox + 3, oy + 3, ow - 6, oh - 6);

      const cx = ox + ow / 2;
      const cy = oy + oh / 2;
      ctx.strokeStyle = '#cbd5e1';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx + Math.min(10, ow * 0.4), cy - 4);
      ctx.moveTo(cx, cy);
      ctx.lineTo(cx - Math.min(8, ow * 0.3), cy + 4);
      ctx.stroke();

      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(cx, oy + 5, 2.5, 0, Math.PI * 2);
      ctx.fill();

    } else if (name.includes('luggage') || name.includes('baggage') || name.includes('suitcase') || name.includes('trolley')) {
      // 🧳 LUGGAGE STACK / TROLLEY
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(ox + 4, oy + oh - 4, ow - 8, 2);
      ctx.fillRect(ox + 4, oy + 4, 2, oh - 8);

      const bagColors = ['#dc2626', '#2563eb', '#059669', '#d97706'];
      const bagCount = Math.min(3, Math.max(1, Math.floor(oh / 10)));
      for (let b = 0; b < bagCount; b++) {
        const by = oy + oh - 6 - (b + 1) * 8;
        ctx.fillStyle = bagColors[b % bagColors.length];
        ctx.beginPath();
        ctx.roundRect(ox + 6, by, ow - 12, 7, 2);
        ctx.fill();
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(ox + ow / 2 - 2, by - 1.5, 4, 1.5);
      }

    } else if (name.includes('bench') || name.includes('seating') || name.includes('waiting')) {
      // 🪑 TRANSIT PLATFORM BENCH
      ctx.fillStyle = '#854d0e';
      ctx.beginPath();
      ctx.roundRect(ox + 3, oy + 4, ow - 6, oh - 8, 3);
      ctx.fill();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.fillRect(ox + 4, oy + oh / 2 - 1, ow - 8, 2);
      ctx.fillStyle = '#475569';
      ctx.fillRect(ox + 4, oy + 2, 2, oh - 4);
      ctx.fillRect(ox + ow - 6, oy + 2, 2, oh - 4);

    } else if (name.includes('whiteboard') || name.includes('chalkboard') || name.includes('blackboard')) {
      // 📋 WHITEBOARD / CHALKBOARD
      const isChalk = name.includes('chalk') || name.includes('black');
      ctx.fillStyle = isChalk ? '#78350f' : '#64748b';
      ctx.beginPath();
      ctx.roundRect(ox + 2, oy + 2, ow - 4, oh - 4, 3);
      ctx.fill();
      ctx.fillStyle = isChalk ? '#064e3b' : '#f8fafc';
      ctx.fillRect(ox + 4, oy + 4, ow - 8, oh - 10);

      if (isChalk) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ox + 7, oy + 8); ctx.lineTo(ox + ow - 10, oy + 8);
        ctx.moveTo(ox + 7, oy + 12); ctx.lineTo(ox + ow - 16, oy + 12);
        ctx.stroke();
      } else {
        ctx.strokeStyle = '#2563eb';
        ctx.lineWidth = 1.2;
        ctx.strokeRect(ox + 7, oy + 7, Math.min(16, (ow - 14) * 0.45), 8);
        ctx.fillStyle = '#475569';
        ctx.fillRect(ox + 8, oy + 18, Math.min(22, ow - 16), 2);
      }
      ctx.fillStyle = '#475569';
      ctx.fillRect(ox + 6, oy + oh - 6, ow - 12, 3);

    } else if (name.includes('table') || name.includes('desk') || name.includes('podium') || name.includes('workstation') || name.includes('counter')) {
      // 🪵 TABLE / DESK / PODIUM
      const isPodium = name.includes('podium');
      const woodColor = obj.color && obj.color !== '#334155' ? obj.color : '#854d0e';
      ctx.fillStyle = woodColor;
      ctx.beginPath();
      ctx.roundRect(ox + 2, oy + 2, ow - 4, oh - 4, 4);
      ctx.fill();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(ox + 3, oy + 3, ow - 6, Math.max(4, (oh - 6) * 0.35));

      if (!isPodium && ow > 40) {
        ctx.fillStyle = '#334155';
        ctx.fillRect(ox + 8, oy + 6, 14, 10);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(ox + 9, oy + 7, 12, 7);
      }

    } else if (name.includes('shelf') || name.includes('cabinet') || name.includes('filing') || name.includes('rack')) {
      // 📚 BOOKSHELF / FILING CABINET
      const isFiling = name.includes('filing') || name.includes('cabinet');
      ctx.fillStyle = isFiling ? '#475569' : '#78350f';
      ctx.beginPath();
      ctx.roundRect(ox + 2, oy + 2, ow - 4, oh - 4, 3);
      ctx.fill();

      if (isFiling) {
        const drawerCount = Math.max(2, Math.floor(oh / 12));
        const drawerH = (oh - 6) / drawerCount;
        for (let d = 0; d < drawerCount; d++) {
          const dy = oy + 3 + d * drawerH;
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1;
          ctx.strokeRect(ox + 4, dy, ow - 8, drawerH - 2);
          ctx.fillStyle = '#94a3b8';
          ctx.fillRect(ox + ow / 2 - 5, dy + drawerH / 2 - 2, 10, 2);
        }
      } else {
        const bookCols = ['#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
        let bx = ox + 4;
        let bIdx = 0;
        while (bx < ox + ow - 6) {
          const bWidth = 3 + (bIdx % 3);
          if (bx + bWidth > ox + ow - 4) break;
          ctx.fillStyle = bookCols[bIdx % bookCols.length];
          ctx.fillRect(bx, oy + 4, bWidth, oh - 8);
          bx += bWidth + 1;
          bIdx++;
        }
      }

    } else if (name.includes('ice') || name.includes('spire') || name.includes('stalagmite') || name.includes('crystal') || name.includes('frost')) {
      // ❄️ GLACIAL ICE SPIRE / FROZEN STALAGMITE
      const cx = ox + ow / 2;
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.moveTo(cx, oy + 2);
      ctx.lineTo(ox + 4, oy + oh - 4);
      ctx.lineTo(cx, oy + oh - 2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.moveTo(cx, oy + 2);
      ctx.lineTo(cx, oy + oh - 2);
      ctx.lineTo(ox + ow - 4, oy + oh - 4);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx - 2, oy + 8, 2, 0, Math.PI * 2);
      ctx.fill();

    } else if (name.includes('snow') || name.includes('drift') || name.includes('sled') || name.includes('pod') || name.includes('cryo')) {
      // ❄️ SNOWDRIFT / CRYO-POD
      ctx.fillStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.arc(ox + ow * 0.35, oy + oh * 0.5, ow * 0.28, 0, Math.PI * 2);
      ctx.arc(ox + ow * 0.65, oy + oh * 0.55, ow * 0.26, 0, Math.PI * 2);
      ctx.fill();

    } else if (name.includes('safe') || name.includes('deposit') || name.includes('strongbox')) {
      // 🔒 TITANIUM SAFE / LOCKBOX
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(ox + 2, oy + 2, ow - 4, oh - 4, 4);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 2;
      ctx.strokeRect(ox + 4, oy + 4, ow - 8, oh - 8);
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.arc(ox + ow / 2, oy + oh / 2, Math.min(7, (oh - 10) * 0.35), 0, Math.PI * 2);
      ctx.fill();

    } else if (name.includes('server') || name.includes('array') || name.includes('mainframe') || name.includes('console') || name.includes('relay')) {
      // 🖥️ SERVER RACK / MAINFRAME
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(ox + 2, oy + 2, ow - 4, oh - 4, 3);
      ctx.fill();
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.stroke();
      const slotCount = Math.max(3, Math.floor(oh / 8));
      const slotH = (oh - 8) / slotCount;
      for (let s = 0; s < slotCount; s++) {
        const sy = oy + 4 + s * slotH;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(ox + 4, sy, ow - 8, slotH - 1.5);
        const isBlink = Math.sin(time * 8 + s * 2) > 0;
        ctx.fillStyle = isBlink ? '#10b981' : '#00f2fe';
        ctx.fillRect(ox + 6, sy + 1.5, 2, 2);
      }

    } else if (name.includes('magma') || name.includes('geyser') || name.includes('vent') || name.includes('volcano') || name.includes('obsidian') || name.includes('basalt')) {
      // 🌋 MAGMA GEYSER / BASALT ROCK
      const cx = ox + ow / 2;
      const cy = oy + oh / 2;
      ctx.fillStyle = '#1c1917';
      ctx.beginPath();
      ctx.moveTo(ox + 4, oy + oh - 3);
      ctx.lineTo(ox + 2, oy + oh * 0.4);
      ctx.lineTo(cx - 3, oy + 2);
      ctx.lineTo(ox + ow - 3, oy + 4);
      ctx.lineTo(ox + ow - 2, oy + oh - 3);
      ctx.closePath();
      ctx.fill();
      const pulse = Math.sin(time * 5) * 0.2 + 0.8;
      ctx.fillStyle = `rgba(249, 115, 22, ${0.7 * pulse})`;
      ctx.beginPath();
      ctx.arc(cx, cy, Math.min(6, (oh - 8) * 0.3), 0, Math.PI * 2);
      ctx.fill();

    } else if (name.includes('tomb') || name.includes('grave') || name.includes('crypt') || name.includes('sarcophagus') || name.includes('gargoyle')) {
      // ⚰️ TOMBSTONE / COFFER
      const cx = ox + ow / 2;
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(cx, oy + 9, Math.min(10, (ow - 6) * 0.4), Math.PI, 0, false);
      ctx.lineTo(ox + ow - 4, oy + oh - 3);
      ctx.lineTo(ox + 4, oy + oh - 3);
      ctx.closePath();
      ctx.fill();

    } else if (name.includes('plant') || name.includes('tree') || name.includes('fern') || name.includes('flora')) {
      // 🌿 INDOOR PLANT / TREE
      const cx = ox + ow / 2;
      ctx.fillStyle = '#c2410c';
      ctx.fillRect(ox + ow * 0.3, oy + oh * 0.6, ow * 0.4, oh * 0.35);
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.arc(cx, oy + oh * 0.35, Math.min(10, ow * 0.4), 0, Math.PI * 2);
      ctx.fill();

    } else if (name.includes('chest') || name.includes('treasure')) {
      // 💎 TREASURE CHEST
      ctx.fillStyle = '#78350f';
      ctx.beginPath();
      ctx.roundRect(ox + 3, oy + 3, ow - 6, oh - 6, 4);
      ctx.fill();
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(ox + 3, oy + oh * 0.4, ow - 6, 2.5);
      ctx.fillRect(ox + ow / 2 - 3, oy + oh * 0.35, 6, 5);

    } else if (name.includes('crate') || name.includes('cargo') || name.includes('box')) {
      // 📦 WOODEN CRATE / CARGO
      ctx.fillStyle = '#a16207';
      ctx.beginPath();
      ctx.roundRect(ox + 2, oy + 2, ow - 4, oh - 4, 3);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(ox + 3, oy + 3, ow - 6, oh - 6);
      ctx.beginPath();
      ctx.moveTo(ox + 4, oy + 4); ctx.lineTo(ox + ow - 4, oy + oh - 4);
      ctx.moveTo(ox + ow - 4, oy + 4); ctx.lineTo(ox + 4, oy + oh - 4);
      ctx.stroke();

    } else if (name.includes('barrel') || name.includes('drum') || name.includes('canister')) {
      // 🛢️ HAZMAT DRUM / BARREL
      ctx.fillStyle = obj.color || '#dc2626';
      ctx.beginPath();
      ctx.roundRect(ox + 3, oy + 2, ow - 6, oh - 4, 5);
      ctx.fill();
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(ox + 3, oy + oh * 0.3, ow - 6, 2);
      ctx.fillRect(ox + 3, oy + oh * 0.7, ow - 6, 2);

    } else if (name.includes('pillar') || name.includes('column') || name.includes('monolith') || name.includes('altar')) {
      // 🏛️ ANCIENT PILLAR / ALTAR
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(ox + 3, oy + 2, ow - 6, oh - 4, 3);
      ctx.fill();
      ctx.fillStyle = '#475569';
      ctx.fillRect(ox + 2, oy + 2, ow - 4, 4);
      ctx.fillRect(ox + 2, oy + oh - 6, ow - 4, 4);

    } else if (name.includes('throne')) {
      // 👑 ROYAL VELVET THRONE
      // Stone Step Dais
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(ox + 2, oy + oh - 7, ow - 4, 6, 2);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Ornate Carved Gold Chair Frame
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.roundRect(ox + 4, oy + 4, ow - 8, oh - 10, 4);
      ctx.fill();
      ctx.strokeStyle = '#ffd700';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Gothic Arched Backrest with Crimson Velvet Padding
      ctx.fillStyle = '#881337';
      ctx.beginPath();
      ctx.roundRect(ox + 7, oy + 6, ow - 14, Math.max(8, (oh - 14) * 0.6), 3);
      ctx.fill();

      // Gold Diamond Button Tufting Grid on Velvet
      ctx.fillStyle = '#ffd700';
      const tuftCols = 3;
      for (let c = 0; c < tuftCols; c++) {
        const tx = ox + 10 + c * ((ow - 20) / (tuftCols - 1 || 1));
        ctx.fillRect(tx - 1, oy + 10, 2, 2);
        ctx.fillRect(tx - 1, oy + 16, 2, 2);
      }

      // Plush Crimson Seat Cushion
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.roundRect(ox + 6, oy + oh - 13, ow - 12, 6, 2);
      ctx.fill();

      // Gilded Crown Finials on Left & Right Peaks
      ctx.fillStyle = '#ffd700';
      ctx.beginPath();
      ctx.moveTo(ox + 5, oy + 4);
      ctx.lineTo(ox + 3, oy - 2);
      ctx.lineTo(ox + 7, oy + 2);
      ctx.moveTo(ox + ow - 5, oy + 4);
      ctx.lineTo(ox + ow - 3, oy - 2);
      ctx.lineTo(ox + ow - 7, oy + 2);
      ctx.fill();

      // Ruby Jewels on Finials
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(ox + 2, oy - 3, 2, 2);
      ctx.fillRect(ox + ow - 4, oy - 3, 2, 2);

    } else if (name.includes('armor') || name.includes('knight') || name.includes('cuirass')) {
      // 🛡️ SUIT OF MEDIEVAL PLATE ARMOR
      const cx = ox + ow / 2;

      // Wooden Oak Plinth Base
      ctx.fillStyle = '#451a03';
      ctx.beginPath();
      ctx.roundRect(ox + 4, oy + oh - 6, ow - 8, 5, 2);
      ctx.fill();

      // Steel Sabatons & Greaves (Legs)
      ctx.fillStyle = '#475569';
      ctx.fillRect(cx - 6, oy + oh * 0.55, 4, oh * 0.35);
      ctx.fillRect(cx + 2, oy + oh * 0.55, 4, oh * 0.35);

      // Steel Cuirass (Breastplate)
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.roundRect(cx - 8, oy + oh * 0.28, 16, Math.max(8, oh * 0.32), 4);
      ctx.fill();
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Flared Pauldrons (Shoulder Guards)
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(cx - 8, oy + oh * 0.32, 4, 0, Math.PI * 2);
      ctx.arc(cx + 8, oy + oh * 0.32, 4, 0, Math.PI * 2);
      ctx.fill();

      // Knight Visored Great Helm
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(cx, oy + oh * 0.18, 6, 0, Math.PI * 2);
      ctx.fill();
      // Visor eye slit
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(cx - 4, oy + oh * 0.18 - 1, 8, 2);

      // Crimson Plume Feather on Helm
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.moveTo(cx, oy + oh * 0.18 - 6);
      ctx.quadraticCurveTo(cx + 6, oy + oh * 0.18 - 12, cx + 10, oy + oh * 0.18 - 5);
      ctx.stroke();

      // Ceremonial Broadsword held tip down
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(cx - 0.75, oy + oh * 0.3, 1.5, oh * 0.6);
      ctx.fillStyle = '#ffd700'; // Crossguard & pommel
      ctx.fillRect(cx - 4, oy + oh * 0.35, 8, 2);
      ctx.beginPath();
      ctx.arc(cx, oy + oh * 0.3, 2, 0, Math.PI * 2);
      ctx.fill();

    } else if (name.includes('brazier') || name.includes('fire basin') || name.includes('fire pit') || name.includes('cauldron')) {
      // 🔥 MEDIEVAL FLAMING IRON BRAZIER
      const cx = ox + ow / 2;
      const cy = oy + oh / 2;
      const bRad = Math.min(ow, oh) * 0.38;

      // Radial Torchlight Warm Floor Illumination
      const bGlow = ctx.createRadialGradient(cx, cy, 3, cx, cy, bRad * 2.2);
      bGlow.addColorStop(0, 'rgba(249, 115, 22, 0.45)');
      bGlow.addColorStop(0.5, 'rgba(234, 88, 12, 0.15)');
      bGlow.addColorStop(1, 'rgba(234, 88, 12, 0)');
      ctx.fillStyle = bGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, bRad * 2.2, 0, Math.PI * 2);
      ctx.fill();

      // Wrought Iron Tripod Leg Splay
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy + 4);
      ctx.lineTo(ox + 4, oy + oh - 2);
      ctx.moveTo(cx, cy + 4);
      ctx.lineTo(ox + ow - 4, oy + oh - 2);
      ctx.moveTo(cx, cy + 4);
      ctx.lineTo(cx, oy + oh - 1);
      ctx.stroke();

      // Heavy Iron Cauldron Basin Bowl
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(cx, cy + 2, bRad, 0, Math.PI);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Glowing Hot Coals
      ctx.fillStyle = '#7c2d12';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 2, bRad * 0.85, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Procedural Animated Dancing Flame Tongues
      const fPulse1 = Math.sin(time * 12) * 3;
      const fPulse2 = Math.cos(time * 15) * 3;
      const fPulse3 = Math.sin(time * 9 + 1) * 2;

      // Outer Orange Flames
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.moveTo(cx - bRad * 0.6, cy);
      ctx.quadraticCurveTo(cx - 3 + fPulse1, cy - bRad * 1.3, cx, cy - bRad * 1.5 + fPulse2);
      ctx.quadraticCurveTo(cx + 3 + fPulse2, cy - bRad * 1.3, cx + bRad * 0.6, cy);
      ctx.closePath();
      ctx.fill();

      // Inner Yellow/Gold Flame Core
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.moveTo(cx - bRad * 0.35, cy + 1);
      ctx.quadraticCurveTo(cx + fPulse3, cy - bRad * 0.9, cx, cy - bRad * 1.1 + fPulse1);
      ctx.quadraticCurveTo(cx + fPulse2, cy - bRad * 0.9, cx + bRad * 0.35, cy + 1);
      ctx.closePath();
      ctx.fill();

      // Hot White Core
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(cx, cy, bRad * 0.25, 0, Math.PI * 2);
      ctx.fill();

    } else if (name.includes('chest') || name.includes('treasure')) {
      // 💎 BRASS-BANDED TREASURE CHEST
      // Drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.roundRect(ox + 4, oy + 4, ow - 8, oh - 6, 4);
      ctx.fill();

      // Rich Hardwood Oak Box Base
      ctx.fillStyle = '#5c2c16';
      ctx.beginPath();
      ctx.roundRect(ox + 3, oy + 4, ow - 6, oh - 8, 3);
      ctx.fill();

      // Arched Wooden Lid
      ctx.fillStyle = '#7c3a1d';
      ctx.beginPath();
      ctx.roundRect(ox + 2, oy + 2, ow - 4, Math.max(5, (oh - 8) * 0.45), 4);
      ctx.fill();

      // Brass Strapping Bands with Rivets
      ctx.fillStyle = '#d97706';
      ctx.fillRect(ox + 6, oy + 2, 4, oh - 8);
      ctx.fillRect(ox + ow - 10, oy + 2, 4, oh - 8);

      // Gold rivets
      ctx.fillStyle = '#ffd700';
      ctx.fillRect(ox + 7, oy + 4, 2, 2);
      ctx.fillRect(ox + 7, oy + oh - 8, 2, 2);
      ctx.fillRect(ox + ow - 9, oy + 4, 2, 2);
      ctx.fillRect(ox + ow - 9, oy + oh - 8, 2, 2);

      // Heavy Brass Lock Plate & Keyhole
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.roundRect(ox + ow / 2 - 4, oy + oh * 0.35, 8, 7, 2);
      ctx.fill();
      ctx.fillStyle = '#0f172a'; // Keyhole
      ctx.fillRect(ox + ow / 2 - 1, oy + oh * 0.35 + 2, 2, 3);

      // Glistening gold coins peeking out under lid
      const glint = Math.sin(time * 6) > 0;
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(ox + ow * 0.38, oy + oh * 0.38, 2, 0, Math.PI * 2);
      ctx.arc(ox + ow * 0.65, oy + oh * 0.4, 2, 0, Math.PI * 2);
      ctx.fill();
      if (glint) {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(ox + ow * 0.37, oy + oh * 0.37, 2, 2);
      }

    } else if (name.includes('sarcophagus') || name.includes('tomb') || name.includes('crypt')) {
      // ⚰️ CARVED STONE SARCOPHAGUS
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(ox + 3, oy + 3, ow - 6, oh - 6, 5);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Raised Chiseled Stone Lid
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(ox + 6, oy + 6, ow - 12, oh - 12, 4);
      ctx.fill();

      // Carved Sovereign Effigy / Cross Motif on Lid
      const cx = ox + ow / 2;
      const cy = oy + oh / 2;
      ctx.fillStyle = '#64748b';
      // Effigy head
      ctx.beginPath();
      ctx.arc(cx, oy + 12, 4, 0, Math.PI * 2);
      ctx.fill();
      // Effigy body / cross
      ctx.fillRect(cx - 2, oy + 16, 4, oh - 26);
      ctx.fillRect(cx - 8, oy + 20, 16, 3);

      // Celtic / Gothic Runes engraved along border
      ctx.fillStyle = '#94a3b8';
      for (let r = 0; r < 4; r++) {
        ctx.fillRect(ox + 8 + r * 6, oy + oh - 8, 3, 1.5);
      }

    } else if (name.includes('sofa') || name.includes('couch') || name.includes('sectional')) {
      // 🛋️ PLUSH VELVET SECTIONAL SOFA
      // Drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.roundRect(ox + 3, oy + 5, ow - 6, oh - 6, 6);
      ctx.fill();

      // Main Plush Sofa Base (Warm Amber-Gold / Cognac Velvet)
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.roundRect(ox + 3, oy + 3, ow - 6, oh - 6, 6);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Thick Padded Deep Seat Cushions
      const cushionW = (ow - 12) / 2;
      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.roundRect(ox + 6, oy + 8, cushionW - 2, oh - 14, 4);
      ctx.roundRect(ox + 6 + cushionW, oy + 8, cushionW - 2, oh - 14, 4);
      ctx.fill();

      // Rounded Armrests on Left & Right
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.roundRect(ox + 2, oy + 4, 5, oh - 8, 3);
      ctx.roundRect(ox + ow - 7, oy + 4, 5, oh - 8, 3);
      ctx.fill();

      // Throw Pillows in Contrasting Colors
      ctx.fillStyle = '#e11d48'; // Crimson throw pillow
      ctx.beginPath();
      ctx.roundRect(ox + 8, oy + 10, 6, 6, 2);
      ctx.fill();

      ctx.fillStyle = '#0284c7'; // Navy throw pillow
      ctx.beginPath();
      ctx.roundRect(ox + ow - 14, oy + 10, 6, 6, 2);
      ctx.fill();

    } else if (name.includes('coffee table') || name.includes('tea table') || (name.includes('table') && !name.includes('interrogation'))) {
      // ☕ POLISHED MAHOGANY COFFEE TABLE WITH STEAMING MUG
      ctx.fillStyle = '#3b1809';
      ctx.beginPath();
      ctx.roundRect(ox + 4, oy + 4, ow - 8, oh - 8, 4);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Beveled Tabletop Surface Highlight
      ctx.fillStyle = '#5c2c16';
      ctx.fillRect(ox + 6, oy + 6, ow - 12, oh - 12);

      // Stack of Art Books / Magazines
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(ox + 8, oy + oh * 0.45, 10, 6);
      ctx.fillStyle = '#e11d48';
      ctx.fillRect(ox + 9, oy + oh * 0.45 - 2, 8, 2);

      // Porcelain Coffee Mug on Saucer
      const mugX = ox + ow - 12;
      const mugY = oy + oh * 0.45;
      // White saucer
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(mugX, mugY + 4, 4, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      // Mug body
      ctx.fillStyle = '#f8fafc';
      ctx.beginPath();
      ctx.roundRect(mugX - 2.5, mugY - 2, 5, 6, 1.5);
      ctx.fill();
      // Steaming Vapor animated curls
      const steamY = mugY - 4 - ((time * 12) % 8);
      const steamAlpha = 1 - ((time * 12) % 8) / 8;
      ctx.strokeStyle = `rgba(255, 255, 255, ${0.6 * steamAlpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(mugX, mugY - 2);
      ctx.quadraticCurveTo(mugX + 2, steamY + 2, mugX - 1, steamY);
      ctx.stroke();

    } else if (name.includes('bookshelf') || name.includes('bookcase') || name.includes('library')) {
      // 📚 TALL HARDWOOD BOOKSHELF WITH COLORFUL BOOKS
      ctx.fillStyle = '#3b1809';
      ctx.beginPath();
      ctx.roundRect(ox + 3, oy + 3, ow - 6, oh - 6, 3);
      ctx.fill();
      ctx.strokeStyle = '#78350f';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Inner Shelves
      const shelfCount = 3;
      const shelfH = (oh - 10) / shelfCount;
      const bookColors = ['#dc2626', '#2563eb', '#16a34a', '#d97706', '#9333ea', '#0284c7'];

      for (let s = 0; s < shelfCount; s++) {
        const sy = oy + 5 + s * shelfH;
        // Shelf divider
        ctx.fillStyle = '#5c2c16';
        ctx.fillRect(ox + 5, sy + shelfH - 2, ow - 10, 2);

        // Books stacked vertically on shelf
        let bx = ox + 6;
        let cIdx = s * 2;
        while (bx < ox + ow - 10) {
          const bw = Math.min(4, ox + ow - 8 - bx);
          const bh = Math.max(5, shelfH - 4 - (cIdx % 3));
          ctx.fillStyle = bookColors[cIdx % bookColors.length];
          ctx.fillRect(bx, sy + shelfH - 2 - bh, bw, bh);
          // Book spine gold title foil
          ctx.fillStyle = '#ffd700';
          ctx.fillRect(bx + 1, sy + shelfH - 2 - bh + 2, bw - 2, 1);
          bx += bw + 1.5;
          cIdx++;
        }
      }

    } else if (name.includes('standing lamp') || name.includes('floor lamp') || name.includes('arc lamp')) {
      // 💡 MODERN ARCHED FLOOR LAMP WITH WARM LIGHT POOL
      const cx = ox + ow * 0.35;
      const shadeX = ox + ow * 0.7;
      const shadeY = oy + oh * 0.35;

      // Warm Golden Floor Light Pool
      const lampGlow = ctx.createRadialGradient(shadeX, shadeY, 3, shadeX, shadeY, Math.min(ow, oh) * 0.9);
      lampGlow.addColorStop(0, 'rgba(254, 240, 138, 0.45)');
      lampGlow.addColorStop(0.6, 'rgba(251, 191, 36, 0.15)');
      lampGlow.addColorStop(1, 'rgba(251, 191, 36, 0)');
      ctx.fillStyle = lampGlow;
      ctx.beginPath();
      ctx.arc(shadeX, shadeY, Math.min(ow, oh) * 0.9, 0, Math.PI * 2);
      ctx.fill();

      // Heavy Brass Round Base
      ctx.fillStyle = '#b45309';
      ctx.beginPath();
      ctx.arc(cx, oy + oh - 5, 5, 0, Math.PI * 2);
      ctx.fill();

      // Elegant Curved Brass Arc Pole
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx, oy + oh - 5);
      ctx.quadraticCurveTo(cx - 2, oy + 4, shadeX, shadeY - 4);
      ctx.stroke();

      // Glowing Pleated Translucent Lampshade
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.moveTo(shadeX - 5, shadeY + 4);
      ctx.lineTo(shadeX - 3, shadeY - 4);
      ctx.lineTo(shadeX + 3, shadeY - 4);
      ctx.lineTo(shadeX + 5, shadeY + 4);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1;
      ctx.stroke();

    } else if (name.includes('bench') || name.includes('barbell') || name.includes('weight bench')) {
      // 🏋️ OLYMPIC FLAT BENCH PRESS & HEAVY 45LB BUMPER PLATES
      const cx = ox + ow / 2;
      const cy = oy + oh / 2;

      // Padded Black Vinyl Weight Bench with Red Trim
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(cx - 4, oy + 3, 8, oh - 6, 2);
      ctx.fill();
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Twin Upright Barbell Cradle Posts
      ctx.fillStyle = '#334155';
      ctx.fillRect(ox + 4, cy - 4, 3, 8);
      ctx.fillRect(ox + ow - 7, cy - 4, 3, 8);

      // Knurled Polished Steel Olympic Barbell (7ft bar)
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(ox + 2, cy - 1.5, ow - 4, 3);

      // Heavy 45lb Black Bumper Plates on Both Ends
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(ox + 2, cy - 8, 4, 16, 2);
      ctx.roundRect(ox + 7, cy - 7, 3, 14, 2);
      ctx.roundRect(ox + ow - 6, cy - 8, 4, 16, 2);
      ctx.roundRect(ox + ow - 10, cy - 7, 3, 14, 2);
      ctx.fill();

      // Chrome Spring Collars
      ctx.fillStyle = '#e2e8f0';
      ctx.fillRect(ox + 10.5, cy - 3, 2, 6);
      ctx.fillRect(ox + ow - 12.5, cy - 3, 2, 6);

    } else if (name.includes('dumbbell') || name.includes('weights') || name.includes('free weights')) {
      // 🏋️ TWO-TIER COMMERCIAL DUMBBELL RACK
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(ox + 2, oy + 3, ow - 4, oh - 6, 3);
      ctx.fill();
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Two Tier Angled Racks
      ctx.fillStyle = '#334155';
      ctx.fillRect(ox + 3, oy + 5, ow - 6, 3);
      ctx.fillRect(ox + 3, oy + oh - 8, ow - 6, 3);

      // Pairs of Hexagonal Dumbbells on Tiers
      const pairCount = Math.max(3, Math.floor((ow - 8) / 8));
      for (let d = 0; d < pairCount; d++) {
        const dx = ox + 5 + d * 8;
        // Upper tier dumbbell
        ctx.fillStyle = '#0f172a'; // Hex heads
        ctx.fillRect(dx, oy + 4, 2.5, 4);
        ctx.fillRect(dx + 3.5, oy + 4, 2.5, 4);
        ctx.fillStyle = '#e2e8f0'; // Chrome handle
        ctx.fillRect(dx + 2, oy + 5, 2, 2);

        // Lower tier dumbbell (heavier)
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(dx, oy + oh - 9, 2.5, 5);
        ctx.fillRect(dx + 3.5, oy + oh - 9, 2.5, 5);
        ctx.fillStyle = '#e2e8f0';
        ctx.fillRect(dx + 2, oy + oh - 8, 2, 2);
      }

    } else if (name.includes('squat') || name.includes('cage') || name.includes('power rack')) {
      // 🏋️ POWER SQUAT CAGE / RACK
      // 4 Heavy Steel Upright Corner Posts
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(ox + 3, oy + 3, 4, 4);
      ctx.fillRect(ox + ow - 7, oy + 3, 4, 4);
      ctx.fillRect(ox + 3, oy + oh - 7, 4, 4);
      ctx.fillRect(ox + ow - 7, oy + oh - 7, 4, 4);

      // Overhead Crossbars & Pull-up Bar
      ctx.strokeStyle = '#475569';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(ox + 5, oy + 5, ow - 10, oh - 10);

      // Bright Yellow Safety Spotter Catch Arms
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(ox + 3, oy + oh * 0.45, 4, oh * 0.35);
      ctx.fillRect(ox + ow - 7, oy + oh * 0.45, 4, oh * 0.35);

      // Barbell racked inside
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(ox + 2, oy + oh * 0.48, ow - 4, 2.5);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(ox + 2, oy + oh * 0.48 - 3, 3, 8.5);
      ctx.fillRect(ox + ow - 5, oy + oh * 0.48 - 3, 3, 8.5);

    } else if (name.includes('treadmill') || name.includes('cardio')) {
      // 🏃 COMMERCIAL CARDIO TREADMILL STATION
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.roundRect(ox + 3, oy + 3, ow - 6, oh - 6, 4);
      ctx.fill();

      // Slanted Black Textured Running Belt
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(ox + 6, oy + 12, ow - 12, oh - 16);

      // White Foot-Rest Rails on Sides
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(ox + 4, oy + 12, 2, oh - 16);
      ctx.fillRect(ox + ow - 6, oy + 12, 2, oh - 16);

      // Elevated Console Dashboard & LED Display
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(ox + 4, oy + 4, ow - 8, 7, 2);
      ctx.fill();

      // Digital Green LED Metrics Display
      ctx.fillStyle = '#10b981';
      ctx.fillRect(ox + ow * 0.3, oy + 6, ow * 0.4, 3);

      // Red Emergency Safety Stop Clip
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(ox + ow / 2 - 1.5, oy + 9, 3, 2);

    } else if (name.includes('kettlebell')) {
      // 🔔 KETTLEBELL GRADUATED PYRAMID STACK
      const kbData = [
        { col: '#ef4444', rad: 5, x: ox + ow * 0.3, y: oy + oh * 0.6 },
        { col: '#3b82f6', rad: 4.5, x: ox + ow * 0.7, y: oy + oh * 0.6 },
        { col: '#f59e0b', rad: 3.8, x: ox + ow * 0.5, y: oy + oh * 0.35 },
      ];

      for (const kb of kbData) {
        // Cast Iron Ball
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(kb.x, kb.y, kb.rad, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#334155';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Color-coded Handle Arch
        ctx.strokeStyle = kb.col;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(kb.x, kb.y - kb.rad * 0.8, kb.rad * 0.65, Math.PI, 0, false);
        ctx.stroke();
      }

    } else {
      // ⚙️ UNIVERSAL SMART PROCEDURAL APPARATUS (Fallback for ANY novel real-world prop!)
      // Never a flat grey box! Rich 3D beveled volumetric equipment chassis.
      const mainCol = obj.color && obj.color !== '#334155' ? obj.color : '#1e293b';

      // Drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.beginPath();
      ctx.roundRect(ox + 3, oy + 5, ow - 6, oh - 5, 5);
      ctx.fill();

      // Main Beveled Base Chassis
      ctx.fillStyle = mainCol;
      ctx.beginPath();
      ctx.roundRect(ox + 2, oy + 2, ow - 4, oh - 4, 5);
      ctx.fill();

      // Top Surface Highlight (3D lighting)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.18)';
      ctx.fillRect(ox + 3, oy + 3, ow - 6, Math.max(3, (oh - 6) * 0.28));

      // Metallic Outer Rim
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // Recessed Access Faceplate
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.beginPath();
      ctx.roundRect(ox + 5, oy + 5, ow - 10, oh - 10, 3);
      ctx.fill();

      // Corner Hex Screws / Rivets
      ctx.fillStyle = '#94a3b8';
      ctx.fillRect(ox + 4, oy + 4, 2, 2);
      ctx.fillRect(ox + ow - 6, oy + 4, 2, 2);
      ctx.fillRect(ox + 4, oy + oh - 6, 2, 2);
      ctx.fillRect(ox + ow - 6, oy + oh - 6, 2, 2);

      // Horizontal Vent Slits
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      const ventCount = Math.max(2, Math.floor((oh - 14) / 4));
      for (let v = 0; v < Math.min(3, ventCount); v++) {
        ctx.fillRect(ox + 8, oy + oh - 10 - v * 4, ow - 16, 1.5);
      }

      // Status Indicator LEDs (Green, Amber)
      const isLedBlink = Math.sin(time * 6) > 0;
      ctx.fillStyle = isLedBlink ? '#10b981' : '#059669';
      ctx.fillRect(ox + ow - 10, oy + 7, 2.5, 2.5);
      ctx.fillStyle = !isLedBlink ? '#f59e0b' : '#d97706';
      ctx.fillRect(ox + ow - 14, oy + 7, 2.5, 2.5);

      // Equipment Glyph / Iconography
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      const cx = ox + ow / 2;
      const cy = oy + oh * 0.42;
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Name Badge Label Above Object
    ctx.fillStyle = '#f8fafc';
    ctx.font = 'bold 8.5px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 4;
    ctx.fillText(obj.name, ox + ow / 2, oy - 4);
    ctx.shadowBlur = 0;
  }

  private renderExit(world: GameWorld, tileSize: number, state: EngineState, time: number) {
    const ctx = this.ctx;
    const ex = world.exit.x * tileSize + tileSize / 2;
    const ey = world.exit.y * tileSize + tileSize / 2;

    const reqKey = world.objective.requiredItems || [];
    const hasKey = reqKey.every((k) => (state.collectedItems[k] || 0) > 0);
    const reqScore = world.objective.requiredScore || 0;
    const hasScore = (state.levelScore !== undefined ? state.levelScore : state.score) >= reqScore;
    const reqTerm = world.objective.requiredTerminals || [];
    const hasTerm = reqTerm.every((t) => !!state.hackedTerminals[t]);

    const isUnlocked = hasKey && hasScore && hasTerm;
    const theme = this.resolveExitTheme(world);

    ctx.save();

    // Floor aura glow under door
    const floorGlow = ctx.createRadialGradient(ex, ey, tileSize * 0.2, ex, ey, tileSize * 1.1);
    if (isUnlocked) {
      floorGlow.addColorStop(0, 'rgba(67, 233, 123, 0.45)');
      floorGlow.addColorStop(0.6, 'rgba(16, 185, 129, 0.2)');
      floorGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
    } else {
      floorGlow.addColorStop(0, 'rgba(239, 68, 68, 0.35)');
      floorGlow.addColorStop(0.6, 'rgba(220, 38, 38, 0.15)');
      floorGlow.addColorStop(1, 'rgba(220, 38, 38, 0)');
    }
    ctx.fillStyle = floorGlow;
    ctx.beginPath();
    ctx.arc(ex, ey, tileSize * 1.1, 0, Math.PI * 2);
    ctx.fill();

    // Render theme-authentic custom door
    switch (theme) {
      case 'bank':
        this.renderBankExitDoor(ex, ey, tileSize, isUnlocked, time);
        break;
      case 'hospital':
        this.renderHospitalExitDoor(ex, ey, tileSize, isUnlocked, time);
        break;
      case 'railway':
        this.renderRailwayExitDoor(ex, ey, tileSize, isUnlocked, time);
        break;
      case 'police':
        this.renderPoliceExitDoor(ex, ey, tileSize, isUnlocked, time);
        break;
      case 'snow':
        this.renderSnowExitDoor(ex, ey, tileSize, isUnlocked, time);
        break;
      case 'kitchen':
        this.renderKitchenExitDoor(ex, ey, tileSize, isUnlocked, time);
        break;
      case 'airport':
        this.renderAirportExitDoor(ex, ey, tileSize, isUnlocked, time);
        break;
      case 'haunted':
        this.renderHauntedExitDoor(ex, ey, tileSize, isUnlocked, time);
        break;
      case 'cyberpunk':
        this.renderCyberpunkExitDoor(ex, ey, tileSize, isUnlocked, time);
        break;
      case 'volcano':
        this.renderVolcanoExitDoor(ex, ey, tileSize, isUnlocked, time);
        break;
      case 'desert':
        this.renderDesertExitDoor(ex, ey, tileSize, isUnlocked, time);
        break;
      case 'ocean':
        this.renderOceanExitDoor(ex, ey, tileSize, isUnlocked, time);
        break;
      case 'space':
        this.renderSpaceExitDoor(ex, ey, tileSize, isUnlocked, time);
        break;
      case 'classroom':
        this.renderClassroomExitDoor(ex, ey, tileSize, isUnlocked, time);
        break;
      case 'office':
        this.renderOfficeExitDoor(ex, ey, tileSize, isUnlocked, time);
        break;
      case 'nature':
        this.renderNatureExitDoor(ex, ey, tileSize, isUnlocked, time);
        break;
      case 'dungeon':
        this.renderDungeonExitDoor(ex, ey, tileSize, isUnlocked, time);
        break;
      case 'castle':
        this.renderCastleExitDoor(ex, ey, tileSize, isUnlocked, time);
        break;
      case 'living_room':
        this.renderLivingRoomExitDoor(ex, ey, tileSize, isUnlocked, time);
        break;
      case 'gym':
        this.renderGymExitDoor(ex, ey, tileSize, isUnlocked, time);
        break;
      default:
        this.renderDefaultExitDoor(ex, ey, tileSize, isUnlocked, time);
        break;
    }

    ctx.restore();
  }

  private resolveExitTheme(world: GameWorld): string {
    const explicit = (world.map?.theme || (world as any).theme || '').toLowerCase().trim();
    if (explicit && explicit !== 'default') return explicit;
    const text = `${world.title || ''} ${world.description || ''}`.toLowerCase();
    if (text.includes('castle') || text.includes('fortress') || text.includes('citadel') || text.includes('palace') || text.includes('throne')) return 'castle';
    if (text.includes('gym') || text.includes('fitness') || text.includes('workout') || text.includes('weights')) return 'gym';
    if (text.includes('living') || text.includes('couch') || text.includes('sofa') || text.includes('bedroom') || text.includes('home') || text.includes('lounge')) return 'living_room';
    if (text.includes('bank') || text.includes('vault') || text.includes('heist') || text.includes('gold')) return 'bank';
    if (text.includes('hospital') || text.includes('clinic') || text.includes('trauma') || text.includes('medical') || text.includes('ward')) return 'hospital';
    if (text.includes('train') || text.includes('rail') || text.includes('station') || text.includes('metro') || text.includes('subway')) return 'railway';
    if (text.includes('police') || text.includes('precinct') || text.includes('cop') || text.includes('jail') || text.includes('cell')) return 'police';
    if (text.includes('snow') || text.includes('ice') || text.includes('arctic') || text.includes('frozen') || text.includes('glacier') || text.includes('blizzard') || text.includes('winter') || text.includes('penguin')) return 'snow';
    if (text.includes('kitchen') || text.includes('cook') || text.includes('chef') || text.includes('restaurant') || text.includes('bakery') || text.includes('diner')) return 'kitchen';
    if (text.includes('airport') || text.includes('flight') || text.includes('hangar') || text.includes('terminal') || text.includes('plane') || text.includes('jet')) return 'airport';
    if (text.includes('haunted') || text.includes('ghost') || text.includes('spooky') || text.includes('mansion') || text.includes('cemetery') || text.includes('crypt')) return 'haunted';
    if (text.includes('volcano') || text.includes('lava') || text.includes('magma') || text.includes('inferno') || text.includes('crater')) return 'volcano';
    if (text.includes('desert') || text.includes('pyramid') || text.includes('dune') || text.includes('pharaoh') || text.includes('tomb') || text.includes('sand')) return 'desert';
    if (text.includes('ocean') || text.includes('underwater') || text.includes('sea') || text.includes('sub') || text.includes('marine') || text.includes('coral') || text.includes('atlantis')) return 'ocean';
    if (text.includes('space') || text.includes('star') || text.includes('galaxy') || text.includes('station') || text.includes('alien') || text.includes('orbit')) return 'space';
    if (text.includes('classroom') || text.includes('school') || text.includes('academy') || text.includes('teacher') || text.includes('student')) return 'classroom';
    if (text.includes('office') || text.includes('corporate') || text.includes('cubicle') || text.includes('firm') || text.includes('agency')) return 'office';
    if (text.includes('nature') || text.includes('forest') || text.includes('jungle') || text.includes('grove') || text.includes('garden')) return 'nature';
    if (text.includes('dungeon') || text.includes('relic') || text.includes('catacomb')) return 'dungeon';
    if (text.includes('cyber') || text.includes('neon') || text.includes('matrix') || text.includes('hacker') || text.includes('tech')) return 'cyberpunk';
    return 'default';
  }

  private renderDoorBadge(ex: number, ey: number, tileSize: number, isUnlocked: boolean, label: string) {
    const ctx = this.ctx;
    const badgeY = ey - tileSize * 0.96;
    const text = isUnlocked ? `🔓 ${label}` : `🔒 ${label}`;

    ctx.font = 'bold 8px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    const metrics = ctx.measureText(text);
    const bw = Math.max(76, metrics.width + 16);
    const bh = 17;
    const bx = ex - bw / 2;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.strokeStyle = isUnlocked ? '#10b981' : '#ef4444';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.rect(bx, badgeY, bw, bh);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = isUnlocked ? '#34d399' : '#f87171';
    ctx.shadowColor = isUnlocked ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)';
    ctx.shadowBlur = 6;
    ctx.fillText(text, ex, badgeY + 12);
    ctx.shadowBlur = 0;
  }

  // 1. BANK: Heavy Circular Vault Door with Locking Bolts & Wheel
  private renderBankExitDoor(ex: number, ey: number, tileSize: number, isUnlocked: boolean, time: number) {
    const ctx = this.ctx;
    const r = tileSize * 0.62;

    // Outer gear frame with rivet studs
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = isUnlocked ? '#10b981' : '#475569';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(ex, ey, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 12 Perimeter heavy rivets
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      const rx = ex + Math.cos(angle) * (r - 4);
      const ry = ey + Math.sin(angle) * (r - 4);
      ctx.fillStyle = isUnlocked ? '#34d399' : '#94a3b8';
      ctx.beginPath();
      ctx.arc(rx, ry, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 4 Heavy Radial Deadbolts
    const boltExt = isUnlocked ? 0 : 7;
    for (let b = 0; b < 4; b++) {
      const bAngle = (b * Math.PI) / 2;
      const bx = ex + Math.cos(bAngle) * (r - 8);
      const by = ey + Math.sin(bAngle) * (r - 8);
      const bxEnd = ex + Math.cos(bAngle) * (r + boltExt);
      const byEnd = ey + Math.sin(bAngle) * (r + boltExt);

      ctx.strokeStyle = isUnlocked ? '#475569' : '#e2e8f0';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(bx, by);
      ctx.lineTo(bxEnd, byEnd);
      ctx.stroke();
    }

    // Vault Interior Portal (when unlocked, reveals golden chamber)
    if (isUnlocked) {
      const goldGlow = ctx.createRadialGradient(ex, ey, 2, ex, ey, r * 0.75);
      goldGlow.addColorStop(0, '#fef08a');
      goldGlow.addColorStop(0.5, '#ffd700');
      goldGlow.addColorStop(1, '#b45309');
      ctx.fillStyle = goldGlow;
      ctx.beginPath();
      ctx.arc(ex, ey, r * 0.72, 0, Math.PI * 2);
      ctx.fill();

      // Gold sparkles
      for (let s = 0; s < 5; s++) {
        const sx = ex + Math.cos(time * 2 + s * 1.3) * (r * 0.45);
        const sy = ey + Math.sin(time * 2.5 + s * 1.7) * (r * 0.45);
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(sx, sy, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(ex, ey, r * 0.72, 0, Math.PI * 2);
      ctx.fill();
    }

    // Central 4-spoke Turn Wheel
    const wheelRot = isUnlocked ? time * 2.2 : 0;
    ctx.strokeStyle = isUnlocked ? '#fef08a' : '#94a3b8';
    ctx.lineWidth = 3;
    for (let s = 0; s < 4; s++) {
      const sa = wheelRot + (s * Math.PI) / 2;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex + Math.cos(sa) * (r * 0.48), ey + Math.sin(sa) * (r * 0.48));
      ctx.stroke();
    }
    ctx.fillStyle = isUnlocked ? '#10b981' : '#ef4444';
    ctx.beginPath();
    ctx.arc(ex, ey, 6, 0, Math.PI * 2);
    ctx.fill();

    this.renderDoorBadge(ex, ey, tileSize, isUnlocked, 'VAULT');
  }

  // 2. HOSPITAL: Double Sliding Frosted Glass Doors with Emergency Cross
  private renderHospitalExitDoor(ex: number, ey: number, tileSize: number, isUnlocked: boolean, time: number) {
    const ctx = this.ctx;
    const w = tileSize * 1.25;
    const h = tileSize * 1.35;
    const x = ex - w / 2;
    const y = ey - h / 2;
    const slide = isUnlocked ? tileSize * 0.32 : 0;

    // Outer door jamb casing
    ctx.fillStyle = '#334155';
    ctx.fillRect(x - 3, y - 4, w + 6, h + 6);

    // Corridor interior behind doors (bright clinic lights)
    ctx.fillStyle = isUnlocked ? '#e2e8f0' : '#0f172a';
    ctx.fillRect(x, y, w, h);
    if (isUnlocked) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.25)';
      ctx.fillRect(x, y, w, h);
    }

    // Overhead Sensor Bar & Strobe Beacon
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x - 4, y - 10, w + 8, 8);
    const beaconPulse = Math.sin(time * 6) > 0;
    ctx.fillStyle = isUnlocked ? '#10b981' : (beaconPulse ? '#ef4444' : '#7f1d1d');
    ctx.beginPath();
    ctx.arc(ex, y - 6, 4, 0, Math.PI * 2);
    ctx.fill();

    // Left Sliding Glass Door Leaf
    const leafW = w / 2 - 2;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.45)';
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.fillRect(x - slide, y, leafW, h);
    ctx.strokeRect(x - slide, y, leafW, h);

    // Right Sliding Glass Door Leaf
    ctx.fillRect(ex + 2 + slide, y, leafW, h);
    ctx.strokeRect(ex + 2 + slide, y, leafW, h);

    // Medical Cross Icon
    const crossX = isUnlocked ? ex : ex;
    const crossY = ey;
    const arm = 9;
    const thick = 4.5;
    ctx.fillStyle = isUnlocked ? '#10b981' : '#ef4444';
    // Horizontal arm
    ctx.fillRect(crossX - arm, crossY - thick / 2, arm * 2, thick);
    // Vertical arm
    ctx.fillRect(crossX - thick / 2, crossY - arm, thick, arm * 2);

    this.renderDoorBadge(ex, ey, tileSize, isUnlocked, 'HOSPITAL');
  }

  // 3. RAILWAY: Metro Turnstile Gate & Illuminated Subway Tunnel
  private renderRailwayExitDoor(ex: number, ey: number, tileSize: number, isUnlocked: boolean, time: number) {
    const ctx = this.ctx;
    const w = tileSize * 1.3;
    const h = tileSize * 1.35;
    const x = ex - w / 2;
    const y = ey - h / 2;

    // Tunnel Arch Background
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.arc(ex, y + h * 0.45, w * 0.5, Math.PI, 0);
    ctx.lineTo(x + w, y + h);
    ctx.lineTo(x, y + h);
    ctx.closePath();
    ctx.fill();

    // Track Rails
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(ex - 12, y + h * 0.3);
    ctx.lineTo(ex - 16, y + h);
    ctx.moveTo(ex + 12, y + h * 0.3);
    ctx.lineTo(ex + 16, y + h);
    ctx.stroke();

    // Sleepers (Ties)
    ctx.strokeStyle = '#78350f';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 3; i++) {
      const sy = y + h * 0.45 + i * 11;
      ctx.beginPath();
      ctx.moveTo(ex - 18, sy);
      ctx.lineTo(ex + 18, sy);
      ctx.stroke();
    }

    if (isUnlocked) {
      // Illuminated Train Headlights in the Tunnel
      const trainGlow = ctx.createRadialGradient(ex, y + h * 0.4, 2, ex, y + h * 0.4, 22);
      trainGlow.addColorStop(0, '#fef08a');
      trainGlow.addColorStop(0.5, 'rgba(254, 240, 138, 0.4)');
      trainGlow.addColorStop(1, 'rgba(254, 240, 138, 0)');
      ctx.fillStyle = trainGlow;
      ctx.beginPath();
      ctx.arc(ex, y + h * 0.4, 22, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(ex - 7, y + h * 0.4, 3, 0, Math.PI * 2);
      ctx.arc(ex + 7, y + h * 0.4, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    // Turnstile Stanchions
    ctx.fillStyle = '#475569';
    ctx.fillRect(x, y + h * 0.35, 9, h * 0.65);
    ctx.fillRect(x + w - 9, y + h * 0.35, 9, h * 0.65);

    // Turnstile Barrier Paddle
    if (!isUnlocked) {
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(x + 9, y + h * 0.65);
      ctx.lineTo(ex, y + h * 0.72);
      ctx.moveTo(x + w - 9, y + h * 0.65);
      ctx.lineTo(ex, y + h * 0.72);
      ctx.stroke();
    }

    // Signal Light
    ctx.fillStyle = isUnlocked ? '#10b981' : '#ef4444';
    ctx.beginPath();
    ctx.arc(ex, y + 4, 4.5, 0, Math.PI * 2);
    ctx.fill();

    this.renderDoorBadge(ex, ey, tileSize, isUnlocked, 'METRO');
  }

  // 4. POLICE: Reinforced Precinct Cell Gate with Strobe Siren
  private renderPoliceExitDoor(ex: number, ey: number, tileSize: number, isUnlocked: boolean, time: number) {
    const ctx = this.ctx;
    const w = tileSize * 1.25;
    const h = tileSize * 1.35;
    const x = ex - w / 2;
    const y = ey - h / 2;
    const lift = isUnlocked ? tileSize * 0.42 : 0;

    // Dark Cell Frame
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 3, y - 4, w + 6, h + 6);

    // Cell Interior (warm light if unlocked)
    ctx.fillStyle = isUnlocked ? '#fef3c7' : '#090d16';
    ctx.fillRect(x, y, w, h);

    // Alternating Police Siren Bar
    const isBlueStrobe = Math.sin(time * 10) > 0;
    ctx.fillStyle = isBlueStrobe ? '#3b82f6' : '#1e3a8a';
    ctx.fillRect(ex - 14, y - 10, 12, 6);
    ctx.fillStyle = !isBlueStrobe ? '#ef4444' : '#7f1d1d';
    ctx.fillRect(ex + 2, y - 10, 12, 6);

    // Rebar Bars
    const barCount = 5;
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    for (let b = 1; b <= barCount; b++) {
      const bx = x + (w / (barCount + 1)) * b;
      ctx.beginPath();
      ctx.moveTo(bx, y - lift);
      ctx.lineTo(bx, y + h - lift);
      ctx.stroke();
    }

    // Padlock in center
    if (!isUnlocked) {
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(ex - 6, ey - 4, 12, 10);
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(ex, ey - 4, 5, Math.PI, 0);
      ctx.stroke();
    }

    this.renderDoorBadge(ex, ey, tileSize, isUnlocked, 'PRECINCT');
  }

  // 5. SNOW: Glacial Ice Cavern Arch with Aurora Borealis Borehole
  private renderSnowExitDoor(ex: number, ey: number, tileSize: number, isUnlocked: boolean, time: number) {
    const ctx = this.ctx;
    const r = tileSize * 0.62;

    // Icy cavern outer stones
    ctx.fillStyle = '#0369a1';
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(ex, ey, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Hanging Icicles
    ctx.fillStyle = '#e0f2fe';
    for (let ic = -3; ic <= 3; ic++) {
      const ix = ex + ic * 7;
      const iy = ey - r + 3;
      ctx.beginPath();
      ctx.moveTo(ix - 3, iy);
      ctx.lineTo(ix + 3, iy);
      ctx.lineTo(ix, iy + 9);
      ctx.closePath();
      ctx.fill();
    }

    if (isUnlocked) {
      // Swirling Aurora Portal
      const auroraRot = time * 2;
      const aurora = ctx.createRadialGradient(ex, ey, 2, ex, ey, r * 0.72);
      aurora.addColorStop(0, '#ffffff');
      aurora.addColorStop(0.35, '#38bdf8');
      aurora.addColorStop(0.7, '#a855f7');
      aurora.addColorStop(1, '#0284c7');
      ctx.fillStyle = aurora;
      ctx.beginPath();
      ctx.arc(ex, ey, r * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Rotating aurora spiral arms
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 2;
      for (let arm = 0; arm < 3; arm++) {
        const a = auroraRot + (arm * Math.PI * 2) / 3;
        ctx.beginPath();
        ctx.arc(ex, ey, r * 0.45, a, a + 1.2);
        ctx.stroke();
      }
    } else {
      // Frozen Ice Wall
      ctx.fillStyle = '#0284c7';
      ctx.beginPath();
      ctx.arc(ex, ey, r * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Frost fracture cracks
      ctx.strokeStyle = '#bae6fd';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(ex - 12, ey - 8);
      ctx.lineTo(ex, ey);
      ctx.lineTo(ex + 10, ey - 10);
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex + 4, ey + 12);
      ctx.stroke();
    }

    this.renderDoorBadge(ex, ey, tileSize, isUnlocked, 'GLACIER');
  }

  // 6. KITCHEN: Restaurant Stainless Steel Push Doors with Portholes
  private renderKitchenExitDoor(ex: number, ey: number, tileSize: number, isUnlocked: boolean, time: number) {
    const ctx = this.ctx;
    const w = tileSize * 1.25;
    const h = tileSize * 1.35;
    const x = ex - w / 2;
    const y = ey - h / 2;
    const openGap = isUnlocked ? tileSize * 0.3 : 0;

    // Wood / Stainless Frame
    ctx.fillStyle = '#475569';
    ctx.fillRect(x - 3, y - 4, w + 6, h + 6);

    // Warm Kitchen interior behind doors
    ctx.fillStyle = isUnlocked ? '#fef3c7' : '#0f172a';
    ctx.fillRect(x, y, w, h);

    if (isUnlocked) {
      // Golden culinary glow
      const glow = ctx.createRadialGradient(ex, ey, 2, ex, ey, w * 0.6);
      glow.addColorStop(0, '#f59e0b');
      glow.addColorStop(1, 'rgba(245, 158, 11, 0.15)');
      ctx.fillStyle = glow;
      ctx.fillRect(x, y, w, h);

      // Steam plumes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      for (let st = 0; st < 3; st++) {
        const sx = ex - 8 + st * 8 + Math.sin(time * 3 + st) * 3;
        const sy = y + h * 0.35 - (st * 4);
        ctx.beginPath();
        ctx.arc(sx, sy, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Left Stainless Door Leaf
    const leafW = w / 2 - 1;
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x - openGap, y, leafW, h);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - openGap, y, leafW, h);

    // Right Stainless Door Leaf
    ctx.fillRect(ex + 1 + openGap, y, leafW, h);
    ctx.strokeRect(ex + 1 + openGap, y, leafW, h);

    // Circular Porthole Windows
    ctx.fillStyle = isUnlocked ? '#fef08a' : '#1e293b';
    ctx.strokeStyle = '#d97706';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(x + leafW * 0.5 - openGap, ey - 4, 6, 0, Math.PI * 2);
    ctx.arc(ex + 1 + openGap + leafW * 0.5, ey - 4, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Brass Push-Plates
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(x + leafW * 0.2 - openGap, ey + 10, leafW * 0.6, 5);
    ctx.fillRect(ex + 1 + openGap + leafW * 0.2, ey + 10, leafW * 0.6, 5);

    this.renderDoorBadge(ex, ey, tileSize, isUnlocked, 'PANTRY');
  }

  // 7. AIRPORT: Jetway Boarding Gate with Skybridge Scanner
  private renderAirportExitDoor(ex: number, ey: number, tileSize: number, isUnlocked: boolean, time: number) {
    const ctx = this.ctx;
    const w = tileSize * 1.25;
    const h = tileSize * 1.35;
    const x = ex - w / 2;
    const y = ey - h / 2;
    const slide = isUnlocked ? tileSize * 0.28 : 0;

    // Modern White Gate Casing
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 3, y - 4, w + 6, h + 6);
    ctx.fillStyle = isUnlocked ? '#0284c7' : '#0f172a';
    ctx.fillRect(x, y, w, h);

    if (isUnlocked) {
      // Runway blue lights visible in skybridge
      for (let r = 0; r < 4; r++) {
        const rx = ex - 10 + (r % 2) * 20;
        const ry = y + h * 0.35 + Math.floor(r / 2) * 14;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(rx, ry, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Sliding Glass Panels
    const panelW = w / 2 - 2;
    ctx.fillStyle = 'rgba(148, 163, 184, 0.4)';
    ctx.fillRect(x - slide, y, panelW, h);
    ctx.fillRect(ex + 2 + slide, y, panelW, h);

    // Laser Barricade (when locked)
    if (!isUnlocked) {
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#ef4444';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(x, ey);
      ctx.lineTo(x + w, ey);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    // Boarding Kiosk Scanner
    ctx.fillStyle = isUnlocked ? '#10b981' : '#f59e0b';
    ctx.fillRect(x - 5, y + h * 0.55, 4, 12);

    this.renderDoorBadge(ex, ey, tileSize, isUnlocked, 'GATE 12A');
  }

  // 8. HAUNTED: Spiked Gothic Portcullis & Gargoyle Crypt Arch
  private renderHauntedExitDoor(ex: number, ey: number, tileSize: number, isUnlocked: boolean, time: number) {
    const ctx = this.ctx;
    const w = tileSize * 1.25;
    const h = tileSize * 1.35;
    const x = ex - w / 2;
    const y = ey - h / 2;
    const lift = isUnlocked ? tileSize * 0.45 : 0;

    // Stone Archway
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(x - 3, y - 4, w + 6, h + 6);
    ctx.fillStyle = isUnlocked ? '#064e3b' : '#030712';
    ctx.fillRect(x, y, w, h);

    if (isUnlocked) {
      // Eerie Emerald Mist
      const mistGlow = ctx.createRadialGradient(ex, ey, 2, ex, ey, w * 0.6);
      mistGlow.addColorStop(0, 'rgba(52, 211, 153, 0.6)');
      mistGlow.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.fillStyle = mistGlow;
      ctx.fillRect(x, y, w, h);
    }

    // Spiked Portcullis Lattice
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2.5;
    // Vertical spiked bars
    for (let b = 1; b <= 4; b++) {
      const bx = x + (w / 5) * b;
      ctx.beginPath();
      ctx.moveTo(bx, y - lift);
      ctx.lineTo(bx, y + h - 6 - lift);
      // Spike tip
      ctx.lineTo(bx, y + h - lift);
      ctx.stroke();
    }
    // Horizontal crossbars
    for (let hb = 1; hb <= 3; hb++) {
      const hby = y + (h / 4) * hb - lift;
      ctx.beginPath();
      ctx.moveTo(x, hby);
      ctx.lineTo(x + w, hby);
      ctx.stroke();
    }

    // Glowing Gargoyle Skull Kept at Lintel
    ctx.fillStyle = isUnlocked ? '#10b981' : '#a855f7';
    ctx.beginPath();
    ctx.arc(ex, y + 2, 4.5, 0, Math.PI * 2);
    ctx.fill();

    this.renderDoorBadge(ex, ey, tileSize, isUnlocked, 'CRYPT');
  }

  // 9. CYBERPUNK: Holographic Hex-Shield & Matrix Airlock
  private renderCyberpunkExitDoor(ex: number, ey: number, tileSize: number, isUnlocked: boolean, time: number) {
    const ctx = this.ctx;
    const r = tileSize * 0.62;

    // Carbon Frame
    ctx.fillStyle = '#030712';
    ctx.strokeStyle = isUnlocked ? '#00f2fe' : '#f43f5e';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(ex, ey, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (isUnlocked) {
      // Hyperspace Quantum Vortex
      const vortex = ctx.createRadialGradient(ex, ey, 2, ex, ey, r * 0.8);
      vortex.addColorStop(0, '#ffffff');
      vortex.addColorStop(0.4, '#00f2fe');
      vortex.addColorStop(0.8, '#8b5cf6');
      vortex.addColorStop(1, '#0284c7');
      ctx.fillStyle = vortex;
      ctx.beginPath();
      ctx.arc(ex, ey, r * 0.75, 0, Math.PI * 2);
      ctx.fill();

      // Pulsing Neon Rings
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      const pulseR = (time * 18) % (r * 0.65);
      ctx.beginPath();
      ctx.arc(ex, ey, pulseR, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Red Holographic Hex Grid Barrier
      ctx.fillStyle = 'rgba(244, 63, 94, 0.18)';
      ctx.beginPath();
      ctx.arc(ex, ey, r * 0.75, 0, Math.PI * 2);
      ctx.fill();

      // Horizontal Laser Scanline
      const scanY = ey + Math.sin(time * 5) * (r * 0.6);
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.5;
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.moveTo(ex - r * 0.6, scanY);
      ctx.lineTo(ex + r * 0.6, scanY);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }

    this.renderDoorBadge(ex, ey, tileSize, isUnlocked, 'AIRLOCK');
  }

  // 10. VOLCANO: Obsidian Pillars & Parted Magma Waterfall Gate
  private renderVolcanoExitDoor(ex: number, ey: number, tileSize: number, isUnlocked: boolean, time: number) {
    const ctx = this.ctx;
    const w = tileSize * 1.25;
    const h = tileSize * 1.35;
    const x = ex - w / 2;
    const y = ey - h / 2;

    // Dark Basalt Pillars
    ctx.fillStyle = '#18181b';
    ctx.fillRect(x - 4, y - 4, 8, h + 8);
    ctx.fillRect(x + w - 4, y - 4, 8, h + 8);

    if (isUnlocked) {
      // Cooled Stepped Obsidian Passage with glowing orange embers
      ctx.fillStyle = '#27272a';
      ctx.fillRect(x + 4, y, w - 8, h);

      ctx.fillStyle = '#ea580c';
      for (let em = 0; em < 5; em++) {
        const exx = ex - 10 + Math.sin(time * 3 + em) * 12;
        const eyy = y + h * 0.2 + em * 7;
        ctx.beginPath();
        ctx.arc(exx, eyy, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Boiling Magma Curtain
      const magma = ctx.createLinearGradient(ex, y, ex, y + h);
      magma.addColorStop(0, '#fef08a');
      magma.addColorStop(0.3, '#ea580c');
      magma.addColorStop(1, '#dc2626');
      ctx.fillStyle = magma;
      ctx.fillRect(x + 4, y, w - 8, h);

      // Bubbles
      ctx.fillStyle = '#ffffff';
      for (let b = 0; b < 4; b++) {
        const bx = ex - 8 + b * 5 + Math.sin(time * 6 + b) * 2;
        const by = y + h * 0.7 + Math.cos(time * 5 + b) * 4;
        ctx.beginPath();
        ctx.arc(bx, by, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    this.renderDoorBadge(ex, ey, tileSize, isUnlocked, 'MAGMA');
  }

  // 11. DESERT: Pharaoh Tomb Pylon & Golden Scarab Arch
  private renderDesertExitDoor(ex: number, ey: number, tileSize: number, isUnlocked: boolean, time: number) {
    const ctx = this.ctx;
    const w = tileSize * 1.3;
    const h = tileSize * 1.35;
    const x = ex - w / 2;
    const y = ey - h / 2;

    // Sandstone Sloping Pylon Pillars
    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.moveTo(x, y + h);
    ctx.lineTo(x + 4, y);
    ctx.lineTo(x + 12, y);
    ctx.lineTo(x + 16, y + h);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(x + w, y + h);
    ctx.lineTo(x + w - 4, y);
    ctx.lineTo(x + w - 12, y);
    ctx.lineTo(x + w - 16, y + h);
    ctx.closePath();
    ctx.fill();

    // Central Chamber
    if (isUnlocked) {
      // Golden Treasury Interior
      const gold = ctx.createRadialGradient(ex, ey, 2, ex, ey, w * 0.55);
      gold.addColorStop(0, '#fef08a');
      gold.addColorStop(0.6, '#ffd700');
      gold.addColorStop(1, '#92400e');
      ctx.fillStyle = gold;
      ctx.fillRect(x + 12, y + 6, w - 24, h - 6);
    } else {
      // Sealed Inscribed Slab
      ctx.fillStyle = '#78350f';
      ctx.fillRect(x + 12, y + 6, w - 24, h - 6);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x + 14, y + 8, w - 28, h - 10);
    }

    // Golden Winged Scarab Disc at Lintel
    ctx.fillStyle = isUnlocked ? '#ffd700' : '#b45309';
    ctx.beginPath();
    ctx.arc(ex, y + 4, 6, 0, Math.PI * 2);
    ctx.fill();

    this.renderDoorBadge(ex, ey, tileSize, isUnlocked, 'TOMB');
  }

  // 12. OCEAN: Watertight Submarine Bulkhead Pressure Hatch
  private renderOceanExitDoor(ex: number, ey: number, tileSize: number, isUnlocked: boolean, time: number) {
    const ctx = this.ctx;
    const r = tileSize * 0.62;

    // Bronze Outer Bulkhead Ring
    ctx.fillStyle = '#78350f';
    ctx.strokeStyle = isUnlocked ? '#0284c7' : '#d97706';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(ex, ey, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 8 Marine Studs
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      ctx.fillStyle = '#fde68a';
      ctx.beginPath();
      ctx.arc(ex + Math.cos(a) * (r - 4), ey + Math.sin(a) * (r - 4), 2, 0, Math.PI * 2);
      ctx.fill();
    }

    if (isUnlocked) {
      // Deep Ocean Turquoise Water
      const water = ctx.createRadialGradient(ex, ey, 2, ex, ey, r * 0.7);
      water.addColorStop(0, '#bae6fd');
      water.addColorStop(0.5, '#0284c7');
      water.addColorStop(1, '#075985');
      ctx.fillStyle = water;
      ctx.beginPath();
      ctx.arc(ex, ey, r * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Rising bubbles
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
      for (let bb = 0; bb < 4; bb++) {
        const bx = ex - 6 + bb * 4 + Math.sin(time * 4 + bb) * 2;
        const by = ey + 8 - ((time * 15 + bb * 8) % (r * 0.9));
        ctx.beginPath();
        ctx.arc(bx, by, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      ctx.fillStyle = '#1e293b';
      ctx.beginPath();
      ctx.arc(ex, ey, r * 0.7, 0, Math.PI * 2);
      ctx.fill();
    }

    // Heavy 6-spoke Brass Turning Wheel
    const wheelRot = isUnlocked ? time * 2 : 0;
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.5;
    for (let s = 0; s < 6; s++) {
      const sa = wheelRot + (s * Math.PI) / 3;
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex + Math.cos(sa) * (r * 0.45), ey + Math.sin(sa) * (r * 0.45));
      ctx.stroke();
    }
    ctx.fillStyle = isUnlocked ? '#10b981' : '#ef4444';
    ctx.beginPath();
    ctx.arc(ex, ey, 4.5, 0, Math.PI * 2);
    ctx.fill();

    this.renderDoorBadge(ex, ey, tileSize, isUnlocked, 'HATCH');
  }

  // 13. SPACE: Starship Hydraulic Blast Doors with Hazard Chevrons
  private renderSpaceExitDoor(ex: number, ey: number, tileSize: number, isUnlocked: boolean, time: number) {
    const ctx = this.ctx;
    const w = tileSize * 1.25;
    const h = tileSize * 1.35;
    const x = ex - w / 2;
    const y = ey - h / 2;
    const slide = isUnlocked ? tileSize * 0.32 : 0;

    // Titanium Casing with Hazard Chevrons
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(x - 4, y - 4, w + 8, h + 8);

    // Hazard Stripes on frame
    ctx.fillStyle = '#eab308';
    for (let hz = 0; hz < 4; hz++) {
      ctx.fillRect(x - 4, y + hz * 12, 4, 6);
      ctx.fillRect(x + w, y + hz * 12, 4, 6);
    }

    // Cosmic Portal Background
    ctx.fillStyle = isUnlocked ? '#020617' : '#090d16';
    ctx.fillRect(x, y, w, h);

    if (isUnlocked) {
      // Starfield dots
      for (let st = 0; st < 6; st++) {
        const sx = x + 4 + (st * 7) % (w - 8);
        const sy = y + 4 + (st * 9) % (h - 8);
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(sx, sy, 2, 2);
      }
    }

    // Heavy Blast Plates
    const plateW = w / 2 - 1;
    ctx.fillStyle = '#475569';
    ctx.fillRect(x - slide, y, plateW, h);
    ctx.fillRect(ex + 1 + slide, y, plateW, h);

    // Hydraulic Pistons
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(x - slide + 4, y + 4, 4, 8);
    ctx.fillRect(ex + 1 + slide + plateW - 8, y + 4, 4, 8);

    this.renderDoorBadge(ex, ey, tileSize, isUnlocked, 'AIRLOCK');
  }

  // 14. CLASSROOM: Oak Hallway Double Doors with Chalkboard Header
  private renderClassroomExitDoor(ex: number, ey: number, tileSize: number, isUnlocked: boolean, time: number) {
    const ctx = this.ctx;
    const w = tileSize * 1.25;
    const h = tileSize * 1.35;
    const x = ex - w / 2;
    const y = ey - h / 2;
    const openGap = isUnlocked ? tileSize * 0.3 : 0;

    // Frame
    ctx.fillStyle = '#451a03';
    ctx.fillRect(x - 3, y - 4, w + 6, h + 6);

    // Courtyard sunshine behind doors
    ctx.fillStyle = isUnlocked ? '#fef08a' : '#1e1b4b';
    ctx.fillRect(x, y, w, h);

    // Left Oak Door
    const dw = w / 2 - 1;
    ctx.fillStyle = '#92400e';
    ctx.fillRect(x - openGap, y, dw, h);
    ctx.strokeRect(x - openGap, y, dw, h);

    // Right Oak Door
    ctx.fillRect(ex + 1 + openGap, y, dw, h);
    ctx.strokeRect(ex + 1 + openGap, y, dw, h);

    // Wire-Glass Panes
    ctx.fillStyle = 'rgba(254, 240, 138, 0.4)';
    ctx.fillRect(x + 4 - openGap, y + 6, dw - 8, 14);
    ctx.fillRect(ex + 5 + openGap, y + 6, dw - 8, 14);

    // Brass Push-Bars
    ctx.fillStyle = '#d97706';
    ctx.fillRect(x + 4 - openGap, ey + 4, dw - 8, 4);
    ctx.fillRect(ex + 5 + openGap, ey + 4, dw - 8, 4);

    this.renderDoorBadge(ex, ey, tileSize, isUnlocked, 'DISMISSAL');
  }

  // 15. OFFICE: Corporate Frosted Glass Suite Doors
  private renderOfficeExitDoor(ex: number, ey: number, tileSize: number, isUnlocked: boolean, time: number) {
    const ctx = this.ctx;
    const w = tileSize * 1.25;
    const h = tileSize * 1.35;
    const x = ex - w / 2;
    const y = ey - h / 2;
    const slide = isUnlocked ? tileSize * 0.28 : 0;

    // Aluminum Frame
    ctx.fillStyle = '#334155';
    ctx.fillRect(x - 3, y - 4, w + 6, h + 6);

    // Lobby interior
    ctx.fillStyle = isUnlocked ? '#e2e8f0' : '#0f172a';
    ctx.fillRect(x, y, w, h);

    // Frosted Glass Panels
    const pw = w / 2 - 2;
    ctx.fillStyle = 'rgba(203, 213, 225, 0.55)';
    ctx.fillRect(x - slide, y, pw, h);
    ctx.fillRect(ex + 2 + slide, y, pw, h);

    // Vertical Chrome Handles
    ctx.fillStyle = '#cbd5e1';
    ctx.fillRect(ex - 4 - slide, ey - 10, 2.5, 20);
    ctx.fillRect(ex + 2 + slide, ey - 10, 2.5, 20);

    // Wall RFID Card Reader
    ctx.fillStyle = isUnlocked ? '#10b981' : '#ef4444';
    ctx.beginPath();
    ctx.arc(x - 5, ey, 3.5, 0, Math.PI * 2);
    ctx.fill();

    this.renderDoorBadge(ex, ey, tileSize, isUnlocked, 'SUITE');
  }

  // 16. NATURE: Ancient Mossy Tree Root Archway & Floral Grove
  private renderNatureExitDoor(ex: number, ey: number, tileSize: number, isUnlocked: boolean, time: number) {
    const ctx = this.ctx;
    const r = tileSize * 0.62;

    // Twisted Root Arch
    ctx.fillStyle = '#451a03';
    ctx.strokeStyle = '#15803d';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.arc(ex, ey, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (isUnlocked) {
      // Sunlit Meadow Opening
      const meadow = ctx.createRadialGradient(ex, ey, 2, ex, ey, r * 0.72);
      meadow.addColorStop(0, '#fef08a');
      meadow.addColorStop(0.5, '#86efac');
      meadow.addColorStop(1, '#15803d');
      ctx.fillStyle = meadow;
      ctx.beginPath();
      ctx.arc(ex, ey, r * 0.7, 0, Math.PI * 2);
      ctx.fill();

      // Fireflies
      ctx.fillStyle = '#ffffff';
      for (let f = 0; f < 4; f++) {
        const fx = ex + Math.cos(time * 3 + f * 1.5) * (r * 0.4);
        const fy = ey + Math.sin(time * 3 + f * 1.8) * (r * 0.4);
        ctx.beginPath();
        ctx.arc(fx, fy, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    } else {
      // Thorny Brambles blocking entry
      ctx.fillStyle = '#292524';
      ctx.beginPath();
      ctx.arc(ex, ey, r * 0.7, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#713f12';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(ex - r * 0.5, ey - r * 0.3);
      ctx.lineTo(ex + r * 0.5, ey + r * 0.3);
      ctx.moveTo(ex - r * 0.5, ey + r * 0.3);
      ctx.lineTo(ex + r * 0.5, ey - r * 0.3);
      ctx.stroke();

      // Red thorns
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(ex, ey, 3, 0, Math.PI * 2);
      ctx.fill();
    }

    this.renderDoorBadge(ex, ey, tileSize, isUnlocked, 'GROVE');
  }

  // 17. DUNGEON: Castle Iron-Banded Fortress Gate with Torches
  private renderDungeonExitDoor(ex: number, ey: number, tileSize: number, isUnlocked: boolean, time: number) {
    const ctx = this.ctx;
    const w = tileSize * 1.25;
    const h = tileSize * 1.35;
    const x = ex - w / 2;
    const y = ey - h / 2;
    const openGap = isUnlocked ? tileSize * 0.32 : 0;

    // Stone Frame
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(x - 4, y - 4, w + 8, h + 8);

    // Stairway to freedom behind gates
    ctx.fillStyle = isUnlocked ? '#38bdf8' : '#0c0a09';
    ctx.fillRect(x, y, w, h);

    // Left Gate Leaf
    const leafW = w / 2 - 1;
    ctx.fillStyle = '#44403c';
    ctx.fillRect(x - openGap, y, leafW, h);

    // Right Gate Leaf
    ctx.fillRect(ex + 1 + openGap, y, leafW, h);

    // Iron Banding
    ctx.fillStyle = '#1c1917';
    ctx.fillRect(x - openGap, y + 6, leafW, 4);
    ctx.fillRect(x - openGap, y + h - 10, leafW, 4);
    ctx.fillRect(ex + 1 + openGap, y + 6, leafW, 4);
    ctx.fillRect(ex + 1 + openGap, y + h - 10, leafW, 4);

    // Massive Crossbeam (when locked)
    if (!isUnlocked) {
      ctx.fillStyle = '#78350f';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 1.5;
      ctx.fillRect(x + 4, ey - 4, w - 8, 8);
      ctx.strokeRect(x + 4, ey - 4, w - 8, 8);
    }

    // Torch on wall sconce
    const flameY = y + 4 + Math.sin(time * 8) * 1.5;
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(x - 5, flameY, 3, 0, Math.PI * 2);
    ctx.arc(x + w + 5, flameY, 3, 0, Math.PI * 2);
    ctx.fill();

    this.renderDoorBadge(ex, ey, tileSize, isUnlocked, 'GATE');
  }

  // 18. CASTLE: Grand Citadel Portcullis & Flanking Wall Torches
  private renderCastleExitDoor(ex: number, ey: number, tileSize: number, isUnlocked: boolean, time: number) {
    const ctx = this.ctx;
    const w = tileSize * 1.35;
    const h = tileSize * 1.45;
    const x = ex - w / 2;
    const y = ey - h / 2;

    // Heavy Ashlar Stone Arch Frame
    ctx.fillStyle = '#1e1b29';
    ctx.fillRect(x - 5, y - 6, w + 10, h + 10);
    ctx.strokeStyle = '#475569';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 5, y - 6, w + 10, h + 10);

    // Stone Arch Keystone with Sculpted Gold Lion
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(ex - 4, y - 9, 8, 5);

    // Royal Throne Chamber behind portcullis
    ctx.fillStyle = isUnlocked ? '#881337' : '#0b0914';
    ctx.fillRect(x, y, w, h);
    if (isUnlocked) {
      // Golden sovereign light beam streaming from throne room
      const gateGlow = ctx.createLinearGradient(ex, y, ex, y + h);
      gateGlow.addColorStop(0, 'rgba(251, 191, 36, 0.45)');
      gateGlow.addColorStop(1, 'rgba(245, 158, 11, 0.1)');
      ctx.fillStyle = gateGlow;
      ctx.fillRect(x, y, w, h);
    }

    // Heavy Iron Portcullis Spikes
    // When unlocked: hoisted high into ceiling slot; when locked: dropped down
    const portcullisYOffset = isUnlocked ? -h * 0.65 : 0;
    const barSpacing = 7;
    const barCount = Math.floor((w - 8) / barSpacing);

    ctx.save();
    // Clip to doorway opening so raised portcullis disappears into stone lintel
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();

    for (let b = 0; b < barCount; b++) {
      const bx = x + 4 + b * barSpacing;
      const by = y + portcullisYOffset;

      // Vertical Iron Bar
      ctx.fillStyle = '#334155';
      ctx.fillRect(bx, by, 3, h - 8);
      ctx.fillStyle = '#64748b';
      ctx.fillRect(bx + 1, by, 1, h - 8);

      // Pointed Iron Lower Spike Tip
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.moveTo(bx, by + h - 8);
      ctx.lineTo(bx + 1.5, by + h - 2);
      ctx.lineTo(bx + 3, by + h - 8);
      ctx.closePath();
      ctx.fill();
    }

    // Horizontal Iron Portcullis Crossbars
    const crossY1 = y + 10 + portcullisYOffset;
    const crossY2 = y + h / 2 + portcullisYOffset;
    const crossY3 = y + h - 14 + portcullisYOffset;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(x + 2, crossY1, w - 4, 3);
    ctx.fillRect(x + 2, crossY2, w - 4, 3);
    ctx.fillRect(x + 2, crossY3, w - 4, 3);
    ctx.restore();

    // Twin Flanking Wall Torch Sconces with Animated Fire
    const flameY = y + 4 + Math.sin(time * 9) * 2;
    // Left torch
    const lGlow = ctx.createRadialGradient(x - 7, flameY, 2, x - 7, flameY, 16);
    lGlow.addColorStop(0, 'rgba(245, 158, 11, 0.55)');
    lGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = lGlow;
    ctx.beginPath();
    ctx.arc(x - 7, flameY, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(x - 7, flameY, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(x - 7, flameY, 1.8, 0, Math.PI * 2);
    ctx.fill();

    // Right torch
    const rGlow = ctx.createRadialGradient(x + w + 7, flameY, 2, x + w + 7, flameY, 16);
    rGlow.addColorStop(0, 'rgba(245, 158, 11, 0.55)');
    rGlow.addColorStop(1, 'rgba(245, 158, 11, 0)');
    ctx.fillStyle = rGlow;
    ctx.beginPath();
    ctx.arc(x + w + 7, flameY, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(x + w + 7, flameY, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(x + w + 7, flameY, 1.8, 0, Math.PI * 2);
    ctx.fill();

    this.renderDoorBadge(ex, ey, tileSize, isUnlocked, 'PORTCULLIS');
  }

  // 19. LIVING ROOM: French Terrace Garden Doors & Warm Sunlight
  private renderLivingRoomExitDoor(ex: number, ey: number, tileSize: number, isUnlocked: boolean, time: number) {
    const ctx = this.ctx;
    const w = tileSize * 1.3;
    const h = tileSize * 1.4;
    const x = ex - w / 2;
    const y = ey - h / 2;

    // Classic White Lacquered Door Casing
    ctx.fillStyle = '#f8fafc';
    ctx.beginPath();
    ctx.roundRect(x - 4, y - 5, w + 8, h + 8, 3);
    ctx.fill();
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Garden Terrace View behind Doors
    if (isUnlocked) {
      // Lush green blooming terrace & streaming sunbeam
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(x, y, w, h);

      const sunbeam = ctx.createLinearGradient(ex, y, ex, y + h);
      sunbeam.addColorStop(0, 'rgba(254, 240, 138, 0.55)');
      sunbeam.addColorStop(1, 'rgba(251, 191, 36, 0.15)');
      ctx.fillStyle = sunbeam;
      ctx.fillRect(x, y, w, h);
    } else {
      ctx.fillStyle = '#1e1b4b'; // Night terrace exterior
      ctx.fillRect(x, y, w, h);
    }

    // Double French Door Leaves
    const leafW = w / 2 - 2;
    const openAngle = isUnlocked ? tileSize * 0.32 : 0;

    // Left French Door Leaf
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(x - openAngle, y, leafW, h);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - openAngle, y, leafW, h);

    // 4 Glass Divided Panes in Left Door
    for (let p = 0; p < 4; p++) {
      const py_pane = y + 6 + p * (h / 4 - 2);
      ctx.fillStyle = isUnlocked ? 'rgba(254, 240, 138, 0.4)' : 'rgba(56, 189, 248, 0.3)';
      ctx.fillRect(x - openAngle + 3, py_pane, leafW - 6, h / 4 - 5);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(x - openAngle + 3, py_pane, leafW - 6, h / 4 - 5);
    }

    // Right French Door Leaf
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
    ctx.fillRect(ex + 2 + openAngle, y, leafW, h);
    ctx.strokeStyle = '#94a3b8';
    ctx.strokeRect(ex + 2 + openAngle, y, leafW, h);

    // 4 Glass Divided Panes in Right Door
    for (let p = 0; p < 4; p++) {
      const py_pane = y + 6 + p * (h / 4 - 2);
      ctx.fillStyle = isUnlocked ? 'rgba(254, 240, 138, 0.4)' : 'rgba(56, 189, 248, 0.3)';
      ctx.fillRect(ex + 2 + openAngle + 3, py_pane, leafW - 6, h / 4 - 5);
      ctx.strokeStyle = '#cbd5e1';
      ctx.strokeRect(ex + 2 + openAngle + 3, py_pane, leafW - 6, h / 4 - 5);
    }

    // Polished Brass Lever Handles
    ctx.fillStyle = '#ffd700';
    ctx.fillRect(ex - 3 - openAngle, ey - 2, 4, 3);
    ctx.fillRect(ex + 3 + openAngle, ey - 2, 4, 3);

    this.renderDoorBadge(ex, ey, tileSize, isUnlocked, 'TERRACE');
  }

  // 20. GYM: Heavy Commercial Glass Double Exit & RFID Biometrics
  private renderGymExitDoor(ex: number, ey: number, tileSize: number, isUnlocked: boolean, time: number) {
    const ctx = this.ctx;
    const w = tileSize * 1.35;
    const h = tileSize * 1.4;
    const x = ex - w / 2;
    const y = ey - h / 2;
    const slide = isUnlocked ? tileSize * 0.32 : 0;

    // Brushed Stainless Steel Jamb Casing
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(x - 4, y - 5, w + 8, h + 8, 3);
    ctx.fill();
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Interior Concourse behind glass
    ctx.fillStyle = isUnlocked ? '#0f172a' : '#05070a';
    ctx.fillRect(x, y, w, h);
    if (isUnlocked) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.22)';
      ctx.fillRect(x, y, w, h);
    }

    // Frosted Heavy Tempered Glass Door Leaves
    const leafW = w / 2 - 2;

    // Left Door Leaf
    ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.fillRect(x - slide, y, leafW, h);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(x - slide, y, leafW, h);

    // Frosted Privacy Safety Stripes across glass
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(x - slide + 2, ey - 10, leafW - 4, 4);
    ctx.fillRect(x - slide + 2, ey - 3, leafW - 4, 4);
    ctx.fillRect(x - slide + 2, ey + 4, leafW - 4, 4);

    // Right Door Leaf
    ctx.fillStyle = 'rgba(148, 163, 184, 0.35)';
    ctx.fillRect(ex + 2 + slide, y, leafW, h);
    ctx.strokeStyle = '#cbd5e1';
    ctx.strokeRect(ex + 2 + slide, y, leafW, h);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(ex + 4 + slide, ey - 10, leafW - 4, 4);
    ctx.fillRect(ex + 4 + slide, ey - 3, leafW - 4, 4);
    ctx.fillRect(ex + 4 + slide, ey + 4, leafW - 4, 4);

    // Long Vertical Chrome Tubular Push Handles
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(ex - 4 - slide, ey - 16, 2.5, 32);
    ctx.fillRect(ex + 4 + slide, ey - 16, 2.5, 32);

    // Wall-Mounted Biometric RFID Access Scanner on Side
    const scanX = x + w + 3;
    const scanY = ey - 8;
    ctx.fillStyle = '#0f172a';
    ctx.beginPath();
    ctx.roundRect(scanX, scanY, 6, 16, 2);
    ctx.fill();
    ctx.strokeStyle = '#334155';
    ctx.stroke();

    // Biometric Status LED (Green if unlocked, pulsating red if locked)
    const scanBlink = Math.sin(time * 8) > 0;
    ctx.fillStyle = isUnlocked ? '#10b981' : (scanBlink ? '#ef4444' : '#7f1d1d');
    ctx.beginPath();
    ctx.arc(scanX + 3, scanY + 4, 2, 0, Math.PI * 2);
    ctx.fill();

    this.renderDoorBadge(ex, ey, tileSize, isUnlocked, 'VIP EXIT');
  }

  // 21. DEFAULT: Sci-Fi Quantum Energy Gate
  private renderDefaultExitDoor(ex: number, ey: number, tileSize: number, isUnlocked: boolean, time: number) {
    const ctx = this.ctx;
    const pulse = Math.sin(time * 4) * 3;

    // Portal Floor Rings
    ctx.strokeStyle = isUnlocked ? '#43e97b' : '#ff0844';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(ex, ey, tileSize * 0.75 + pulse, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = isUnlocked ? 'rgba(67, 233, 123, 0.25)' : 'rgba(255, 8, 68, 0.2)';
    ctx.beginPath();
    ctx.arc(ex, ey, tileSize * 0.65, 0, Math.PI * 2);
    ctx.fill();

    this.renderDoorBadge(ex, ey, tileSize, isUnlocked, 'PORTAL');
  }

  private renderCollectibles(world: GameWorld, tileSize: number, time: number) {
    const ctx = this.ctx;

    for (const c of world.collectibles) {
      if (c.collected) continue;

      const cx = c.x * tileSize + tileSize / 2;
      const cy = c.y * tileSize + tileSize / 2;
      const bob = Math.sin(time * 5 + c.x * 2) * 3;
      const typeLower = (c.type || '').toLowerCase();
      const nameLower = (c.name || '').toLowerCase();
      const idLower = (c.id || '').toLowerCase();

      const isKey = typeLower === 'key' || idLower.includes('key') || nameLower.includes('key');
      const isCash = typeLower === 'cash' || nameLower.includes('cash') || nameLower.includes('money') || nameLower.includes('dollar') || nameLower.includes('banknote');
      const isGold = typeLower === 'gold' || nameLower.includes('gold') || nameLower.includes('bullion') || nameLower.includes('ingot');
      const isBadge = typeLower === 'badge' || nameLower.includes('badge') || nameLower.includes('shield');
      const isEvidence = typeLower === 'evidence' || typeLower === 'document' || nameLower.includes('evidence') || nameLower.includes('dossier') || nameLower.includes('file');
      const isPass = typeLower === 'pass' || nameLower.includes('pass') || nameLower.includes('ticket') || nameLower.includes('card');
      const isToken = typeLower === 'token' || nameLower.includes('token') || typeLower === 'coin' || nameLower.includes('coin');
      const isStar = typeLower === 'star' || nameLower.includes('star');

      ctx.save();

      // Soft ground contact shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 10, 8, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      if (isCash) {
        // 💵 Banded Stack of Currency Notes
        ctx.fillStyle = '#065f46';
        ctx.fillRect(cx - 8, cy - 3 + bob, 16, 7);
        ctx.fillStyle = '#047857';
        ctx.fillRect(cx - 8, cy - 5 + bob, 16, 7);

        // Top Crisp Banknote
        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.roundRect(cx - 9, cy - 7 + bob, 18, 10, 2);
        ctx.fill();
        ctx.strokeStyle = '#6ee7b7';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Security Border & Emblem
        ctx.strokeStyle = '#064e3b';
        ctx.lineWidth = 0.8;
        ctx.strokeRect(cx - 7, cy - 5 + bob, 14, 6);
        ctx.beginPath();
        ctx.arc(cx, cy - 2 + bob, 2.2, 0, Math.PI * 2);
        ctx.stroke();

        // Currency Band Strap
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(cx - 2.5, cy - 7 + bob, 5, 10);

        ctx.fillStyle = '#064e3b';
        ctx.font = 'bold 6px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('$', cx, cy + 0.5 + bob);

        ctx.fillStyle = '#34d399';
        ctx.font = 'bold 7px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('CASH', cx, cy - 11 + bob);
      } else if (isGold) {
        // 🧈 Gleaming 3D Gold Bullion Ingot
        const goldFrontGrad = ctx.createLinearGradient(cx - 9, cy + bob, cx + 9, cy + 6 + bob);
        goldFrontGrad.addColorStop(0, '#b45309');
        goldFrontGrad.addColorStop(0.5, '#d97706');
        goldFrontGrad.addColorStop(1, '#92400e');
        ctx.fillStyle = goldFrontGrad;
        ctx.beginPath();
        ctx.moveTo(cx - 9, cy + bob);
        ctx.lineTo(cx + 9, cy + bob);
        ctx.lineTo(cx + 7, cy + 6 + bob);
        ctx.lineTo(cx - 7, cy + 6 + bob);
        ctx.closePath();
        ctx.fill();

        // Top Beveled Face
        const goldTopGrad = ctx.createLinearGradient(cx - 9, cy - 5 + bob, cx + 9, cy + bob);
        goldTopGrad.addColorStop(0, '#fef08a');
        goldTopGrad.addColorStop(0.5, '#fde047');
        goldTopGrad.addColorStop(1, '#f59e0b');
        ctx.fillStyle = goldTopGrad;
        ctx.beginPath();
        ctx.moveTo(cx - 6, cy - 5 + bob);
        ctx.lineTo(cx + 6, cy - 5 + bob);
        ctx.lineTo(cx + 9, cy + bob);
        ctx.lineTo(cx - 9, cy + bob);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Ingot Stamp 999.9
        ctx.fillStyle = '#78350f';
        ctx.font = 'bold 5px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('999.9', cx, cy - 1 + bob);

        // Dynamic Glint
        const glint = (Math.sin(time * 6 + cx) + 1) / 2;
        if (glint > 0.75) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(cx + 4, cy - 3 + bob, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 7px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('GOLD', cx, cy - 9 + bob);
      } else if (isBadge) {
        // 🛡️ Star Badge / Police Shield
        const badgeGrad = ctx.createLinearGradient(cx - 7, cy - 7 + bob, cx + 7, cy + 7 + bob);
        badgeGrad.addColorStop(0, '#f8fafc');
        badgeGrad.addColorStop(0.5, '#cbd5e1');
        badgeGrad.addColorStop(1, '#64748b');

        ctx.fillStyle = badgeGrad;
        ctx.beginPath();
        const spikes = 6;
        for (let i = 0; i < spikes * 2; i++) {
          const r = i % 2 === 0 ? 8 : 4.5;
          const angle = (i * Math.PI) / spikes - Math.PI / 2;
          const px = cx + Math.cos(angle) * r;
          const py = cy + Math.sin(angle) * r + bob;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#ffd700';
        ctx.lineWidth = 1.2;
        ctx.stroke();

        // Center Blue Police Ring
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.arc(cx, cy + bob, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(cx, cy + bob, 1.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#93c5fd';
        ctx.font = 'bold 7px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('STAR', cx, cy - 11 + bob);
      } else if (isEvidence) {
        // 📁 Manila Classified Dossier / Evidence File
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.roundRect(cx - 8, cy - 7 + bob, 16, 12, 1.5);
        ctx.fill();
        ctx.fillRect(cx - 8, cy - 9 + bob, 7, 3);

        // White paper document
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(cx - 6, cy - 6 + bob, 12, 8);

        // Red Confiscated/Classified Stamp
        ctx.fillStyle = 'rgba(239, 68, 68, 0.85)';
        ctx.fillRect(cx - 7, cy - 3 + bob, 14, 3);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 4px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('FILE', cx, cy - 0.5 + bob);

        ctx.fillStyle = '#ef4444';
        ctx.font = 'bold 7px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('EVID', cx, cy - 11 + bob);
      } else if (isPass) {
        // 💳 Transit Metro Smartcard / Security Badge
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.roundRect(cx - 8, cy - 5 + bob, 16, 10, 1.5);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 0.8;
        ctx.stroke();

        // Chip
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(cx - 5, cy - 2 + bob, 3.5, 3);

        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 7px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('PASS', cx, cy - 9 + bob);
      } else if (isToken) {
        // 🪙 Brass Transit Token / Coin
        ctx.fillStyle = '#d97706';
        ctx.beginPath();
        ctx.arc(cx, cy + bob, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(cx, cy + bob, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 7px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('COIN', cx, cy - 10 + bob);
      } else if (isKey) {
        // 🔑 Golden Sector Key
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(cx - 3, cy - 2 + bob, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(cx - 2, cy - 4 + bob, 9, 3);
        ctx.fillRect(cx + 4, cy - 1 + bob, 2.5, 4);

        ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 8px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('KEY', cx, cy - 12 + bob);
      } else if (isStar) {
        // ⭐ Gold Relic / Star
        ctx.fillStyle = '#ffd700';
        ctx.beginPath();
        ctx.arc(cx, cy + bob, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.stroke();
      } else {
        // 💎 Energy Shard / Crystal
        ctx.fillStyle = '#00f2fe';
        ctx.beginPath();
        ctx.moveTo(cx, cy - 7 + bob);
        ctx.lineTo(cx + 5, cy + bob);
        ctx.lineTo(cx, cy + 7 + bob);
        ctx.lineTo(cx - 5, cy + bob);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(0, 242, 254, 0.8)';
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  private renderNPCs(npcs: any[], tileSize: number, time: number) {
    const ctx = this.ctx;
    for (const npc of npcs) {
      const nx = npc.x * tileSize + tileSize / 2;
      const ny = npc.y * tileSize + tileSize / 2;
      const nameLower = (npc.name || '').toLowerCase();
      const isPenguin = nameLower.includes('penguin');
      const isPolice = nameLower.includes('officer') || nameLower.includes('constable') || nameLower.includes('cop') || nameLower.includes('police') || nameLower.includes('sergeant');
      const isChef = nameLower.includes('chef') || nameLower.includes('cook');
      const isConductor = nameLower.includes('conductor') || nameLower.includes('station master') || nameLower.includes('attendant');

      ctx.save();

      if (isPenguin) {
        // 🐧 ADORABLE WADDLING EMPEROR PENGUIN
        const waddleCycle = Math.sin(time * 8 + npc.x);
        const waddleBob = Math.abs(Math.sin(time * 8)) * 2;
        const waddleTilt = waddleCycle * 0.15;

        // Ground shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.beginPath();
        ctx.ellipse(nx, ny + 9, 10, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.save();
        ctx.translate(nx, ny + 4);
        ctx.rotate(waddleTilt);

        // Alternating Webbed Feet
        const leftFootLift = Math.max(0, -waddleCycle * 3);
        const rightFootLift = Math.max(0, waddleCycle * 3);

        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.ellipse(-5, 4 - leftFootLift, 4, 2.2, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(5, 4 - rightFootLift, 4, 2.2, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Sleek Teardrop Body
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(0, -5 - waddleBob, 8, 11, 0, 0, Math.PI * 2);
        ctx.fill();

        // Flapping Flippers
        const flapAngle = Math.sin(time * 8) * 0.35;
        ctx.save();
        ctx.translate(-7, -6 - waddleBob);
        ctx.rotate(-0.3 - flapAngle);
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(-3, 3, 2.5, 6, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        ctx.save();
        ctx.translate(7, -6 - waddleBob);
        ctx.rotate(0.3 + flapAngle);
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.ellipse(3, 3, 2.5, 6, 0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Golden Emperor Throat Patch
        const goldPatch = ctx.createLinearGradient(0, -12 - waddleBob, 0, -6 - waddleBob);
        goldPatch.addColorStop(0, '#f59e0b');
        goldPatch.addColorStop(1, '#fbbf24');
        ctx.fillStyle = goldPatch;
        ctx.beginPath();
        ctx.ellipse(0, -9 - waddleBob, 5, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // White Chest
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.ellipse(0, -4 - waddleBob, 5.5, 7.5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Head & Beak
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(0, -13 - waddleBob, 5.5, 0, Math.PI * 2);
        ctx.fill();

        // Eyes
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(-2, -14 - waddleBob, 1.8, 0, Math.PI * 2);
        ctx.arc(2, -14 - waddleBob, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(-2, -14 - waddleBob, 1, 0, Math.PI * 2);
        ctx.arc(2, -14 - waddleBob, 1, 0, Math.PI * 2);
        ctx.fill();

        // Beak
        ctx.fillStyle = '#ea580c';
        ctx.beginPath();
        ctx.moveTo(-2, -12 - waddleBob);
        ctx.lineTo(2, -12 - waddleBob);
        ctx.lineTo(0, -8 - waddleBob);
        ctx.closePath();
        ctx.fill();

        ctx.restore();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`🐧 ${npc.name}`, nx, ny - 19);

      } else if (isPolice) {
        // 👮 FRIENDLY POLICE OFFICER / DESK SERGEANT
        const bob = Math.sin(time * 3 + npc.x) * 2;
        ctx.fillStyle = 'rgba(59, 130, 246, 0.2)';
        ctx.beginPath();
        ctx.arc(nx, ny + 4, 14, 0, Math.PI * 2);
        ctx.fill();

        // Navy Uniform Tunic
        ctx.fillStyle = '#1e3a8a';
        ctx.beginPath();
        ctx.roundRect(nx - 7, ny - 3 + bob, 14, 14, 3);
        ctx.fill();

        // High-vis yellow epaulettes
        ctx.fillStyle = '#84cc16';
        ctx.fillRect(nx - 7, ny - 3 + bob, 3, 2);
        ctx.fillRect(nx + 4, ny - 3 + bob, 3, 2);

        // Head
        ctx.fillStyle = '#ffdfba';
        ctx.beginPath();
        ctx.arc(nx, ny - 8 + bob, 6, 0, Math.PI * 2);
        ctx.fill();

        // Peaked Cap with Checkerboard Band
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(nx, ny - 11 + bob, 6.5, Math.PI, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(nx - 5, ny - 11 + bob, 10, 1.5);
        ctx.fillStyle = '#000000';
        ctx.fillRect(nx - 3, ny - 11 + bob, 2, 1.5);
        ctx.fillRect(nx + 1, ny - 11 + bob, 2, 1.5);

        // Badge
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(nx - 4, ny - 1 + bob, 3, 3);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`👮 ${npc.name}`, nx, ny - 19 + bob);

      } else if (isChef) {
        // 👨‍🍳 FRIENDLY MASTER CHEF
        const bob = Math.sin(time * 3 + npc.x) * 2;
        ctx.fillStyle = 'rgba(234, 88, 12, 0.2)';
        ctx.beginPath();
        ctx.arc(nx, ny + 4, 14, 0, Math.PI * 2);
        ctx.fill();

        // White Chef Jacket
        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.roundRect(nx - 7, ny - 3 + bob, 14, 14, 3);
        ctx.fill();

        ctx.fillStyle = '#ef4444';
        ctx.fillRect(nx - 3, ny - 3 + bob, 6, 2);

        // Head
        ctx.fillStyle = '#ffdfba';
        ctx.beginPath();
        ctx.arc(nx, ny - 8 + bob, 6, 0, Math.PI * 2);
        ctx.fill();

        // Chef Toque
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.roundRect(nx - 5, ny - 19 + bob, 10, 10, [4, 4, 1, 1]);
        ctx.fill();
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`👨‍🍳 ${npc.name}`, nx, ny - 23 + bob);

      } else if (isConductor) {
        // 🚆 TRANSIT CONDUCTOR / STATION MASTER
        const bob = Math.sin(time * 3 + npc.x) * 2;
        ctx.fillStyle = 'rgba(6, 182, 212, 0.2)';
        ctx.beginPath();
        ctx.arc(nx, ny + 4, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#0e7490';
        ctx.beginPath();
        ctx.roundRect(nx - 7, ny - 3 + bob, 14, 14, 3);
        ctx.fill();

        ctx.fillStyle = '#ffd700';
        ctx.fillRect(nx - 1, ny - 1 + bob, 2, 2);
        ctx.fillRect(nx - 1, ny + 3 + bob, 2, 2);

        ctx.fillStyle = '#ffdfba';
        ctx.beginPath();
        ctx.arc(nx, ny - 8 + bob, 6, 0, Math.PI * 2);
        ctx.fill();

        // Pillbox Conductor Cap
        ctx.fillStyle = '#155e75';
        ctx.beginPath();
        ctx.roundRect(nx - 6, ny - 14 + bob, 12, 5, 2);
        ctx.fill();
        ctx.fillStyle = '#ffd700';
        ctx.fillRect(nx - 5, ny - 10 + bob, 10, 1.5);

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`🚆 ${npc.name}`, nx, ny - 19 + bob);

      } else {
        // Default Civilian / Friendly Guide
        const bob = Math.sin(time * 3 + npc.x) * 2;
        ctx.fillStyle = 'rgba(0, 242, 254, 0.2)';
        ctx.beginPath();
        ctx.arc(nx, ny + 4, 14, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#10b981';
        ctx.beginPath();
        ctx.roundRect(nx - 7, ny - 3 + bob, 14, 14, 4);
        ctx.fill();

        ctx.fillStyle = '#ffdfba';
        ctx.beginPath();
        ctx.arc(nx, ny - 8 + bob, 6, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 9px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`💬 ${npc.name}`, nx, ny - 18 + bob);
      }

      ctx.restore();
    }
  }

  private renderEnemies(enemies: any[], tileSize: number, time: number) {
    const ctx = this.ctx;

    for (const enemy of enemies) {
      const ex = enemy.x * tileSize + tileSize / 2;
      const ey = enemy.y * tileSize + tileSize / 2;
      const isGuardian = enemy.type === 'exit_guardian';
      const isAlert = enemy.isAlert;
      const isStunned = !!enemy.isStunned;
      const spriteTheme = enemy.spriteTheme || (enemy.name.toLowerCase().includes('ghost') ? 'ghost' : enemy.name.toLowerCase().includes('guard') ? 'guard' : 'drone');

      ctx.save();

      // If enemy is stunned, draw dizzy effect and stars!
      if (isStunned) {
        // Dizzy Stars circling over head
        const starCount = 3;
        for (let s = 0; s < starCount; s++) {
          const starAngle = time * 7 + (s * Math.PI * 2) / starCount;
          const sx = ex + Math.cos(starAngle) * 14;
          const sy = ey - 22 + Math.sin(starAngle) * 5;
          ctx.fillStyle = '#f59e0b';
          ctx.beginPath();
          ctx.arc(sx, sy, 3, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#ffd700';
        ctx.font = 'bold 8px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText('💫 STUNNED', ex, ey - 28);
      } else if (isAlert || (enemy.aggroTimer && enemy.aggroTimer > 0)) {
        // 🚨 Aggressive Hostile Pursuit Indicator & Threat Ring
        const pulse = Math.sin(time * 12) * 0.25 + 0.75;
        ctx.strokeStyle = `rgba(255, 8, 68, ${0.75 * pulse})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ex, ey, tileSize * 0.6 + Math.sin(time * 8) * 3, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = '#ff0844';
        ctx.font = 'bold 8px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
        ctx.shadowBlur = 4;
        ctx.fillText('❗ HOSTILE', ex, ey - 32);
        ctx.shadowBlur = 0;
      }

      // Resolve dynamic body shape
      const nameLower = (enemy.name || '').toLowerCase();
      const bodyShape = enemy.bodyShape || (
        enemy.spriteTheme === 'yeti' ? 'golem_titan' :
          enemy.spriteTheme === 'ghost' ? 'floating_spirit' :
            enemy.spriteTheme === 'guard' ? 'humanoid_guard' :
              enemy.spriteTheme === 'laser' ? 'mechanical_turret' :
                enemy.spriteTheme === 'beast' || enemy.spriteTheme === 'monster' ? 'quadruped_beast' :
                  nameLower.includes('yeti') || nameLower.includes('titan') || nameLower.includes('golem') || nameLower.includes('colossus') ? 'golem_titan' :
                    nameLower.includes('wolf') || nameLower.includes('hound') || nameLower.includes('stalker') || nameLower.includes('beast') || nameLower.includes('viper') || nameLower.includes('scorpion') ? 'quadruped_beast' :
                      nameLower.includes('ghost') || nameLower.includes('wraith') || nameLower.includes('phantom') || nameLower.includes('specter') || nameLower.includes('spirit') ? 'floating_spirit' :
                        nameLower.includes('guard') || nameLower.includes('officer') || nameLower.includes('warden') || nameLower.includes('soldier') ? 'humanoid_guard' :
                          nameLower.includes('sentry') || nameLower.includes('turret') || nameLower.includes('laser') ? 'mechanical_turret' :
                            'winged_drone'
      );

      if (bodyShape === 'golem_titan') {
        // 👹 / ❄️ GOLEM TITAN (Frost Yeti, Magma Colossus, Stone Golem)
        const scale = isGuardian ? 1.35 : 1.1;
        const bob = Math.sin(time * 5 + enemy.x) * 2;
        const isFrost = nameLower.includes('frost') || nameLower.includes('yeti') || nameLower.includes('ice');
        const isMagma = nameLower.includes('magma') || nameLower.includes('lava') || nameLower.includes('fire');
        const pColor = enemy.primaryColor || (isFrost ? '#f1f5f9' : (isMagma ? '#1c1917' : '#475569'));
        const eyeCol = enemy.eyeColor || (isAlert ? '#ff0844' : (isFrost ? '#38bdf8' : (isMagma ? '#f97316' : '#ef4444')));

        // Elemental Aura Glow
        ctx.fillStyle = isAlert ? 'rgba(239, 68, 68, 0.3)' : (isFrost ? 'rgba(56, 189, 248, 0.25)' : (isMagma ? 'rgba(249, 115, 22, 0.25)' : 'rgba(100, 116, 139, 0.2)'));
        ctx.beginPath();
        ctx.arc(ex, ey + bob, tileSize * (isGuardian ? 0.9 : 0.7), 0, Math.PI * 2);
        ctx.fill();

        // Heavy Hulking Torso & Shoulders
        ctx.fillStyle = pColor;
        ctx.beginPath();
        ctx.roundRect(ex - 15 * scale, ey - 12 * scale + bob, 30 * scale, 24 * scale, 6);
        ctx.fill();

        // Shading Plates
        ctx.fillStyle = isFrost ? '#cbd5e1' : (isMagma ? '#ea580c' : '#334155');
        ctx.beginPath();
        ctx.roundRect(ex - 10 * scale, ey - 7 * scale + bob, 20 * scale, 16 * scale, 4);
        ctx.fill();

        // Head
        ctx.fillStyle = pColor;
        ctx.beginPath();
        ctx.arc(ex, ey - 14 * scale + bob, 9 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Horns / Ice Crown / Spikes
        if (enemy.accessory === 'ice_crown' || isFrost) {
          // Sharp Crystalline Icicle Crown
          ctx.fillStyle = '#7dd3fc';
          ctx.beginPath();
          ctx.moveTo(ex - 9 * scale, ey - 15 * scale + bob);
          ctx.lineTo(ex - 7 * scale, ey - 24 * scale + bob);
          ctx.lineTo(ex - 4 * scale, ey - 17 * scale + bob);
          ctx.lineTo(ex, ey - 27 * scale + bob);
          ctx.lineTo(ex + 4 * scale, ey - 17 * scale + bob);
          ctx.lineTo(ex + 7 * scale, ey - 24 * scale + bob);
          ctx.lineTo(ex + 9 * scale, ey - 15 * scale + bob);
          ctx.closePath();
          ctx.fill();
        } else if (enemy.accessory === 'horns' || isMagma) {
          // Curved Beast Horns
          ctx.fillStyle = '#f97316';
          ctx.beginPath();
          ctx.moveTo(ex - 8 * scale, ey - 16 * scale + bob);
          ctx.quadraticCurveTo(ex - 15 * scale, ey - 24 * scale + bob, ex - 10 * scale, ey - 26 * scale + bob);
          ctx.lineTo(ex - 6 * scale, ey - 19 * scale + bob);
          ctx.moveTo(ex + 8 * scale, ey - 16 * scale + bob);
          ctx.quadraticCurveTo(ex + 15 * scale, ey - 24 * scale + bob, ex + 10 * scale, ey - 26 * scale + bob);
          ctx.lineTo(ex + 6 * scale, ey - 19 * scale + bob);
          ctx.fill();
        }

        // Glowing Eyes
        ctx.fillStyle = eyeCol;
        ctx.beginPath();
        ctx.arc(ex - 4 * scale, ey - 14 * scale + bob, 2.5 * scale, 0, Math.PI * 2);
        ctx.arc(ex + 4 * scale, ey - 14 * scale + bob, 2.5 * scale, 0, Math.PI * 2);
        ctx.fill();

        // Stomping Feet
        ctx.fillStyle = isFrost ? '#94a3b8' : '#1c1917';
        ctx.fillRect(ex - 12 * scale, ey + 10 * scale + bob, 8 * scale, 5 * scale);
        ctx.fillRect(ex + 4 * scale, ey + 10 * scale + bob, 8 * scale, 5 * scale);

        // Name / Boss Banner
        ctx.fillStyle = isAlert ? '#ff0844' : (isFrost ? '#7dd3fc' : (isMagma ? '#f97316' : '#94a3b8'));
        ctx.font = isGuardian ? 'bold 8px "Press Start 2P", monospace' : 'bold 8px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(isGuardian ? `👑 BOSS: ${enemy.name}` : (isFrost ? `❄️ ${enemy.name}` : `👹 ${enemy.name}`), ex, ey - 26 * scale + bob);

      } else if (bodyShape === 'quadruped_beast') {
        // 🐺 / 🐾 QUADRUPED BEAST (Blizzard Wolf, Hellhound, Desert Scorpion, Shadow Stalker)
        const walkCycle = Math.sin(time * 8 + enemy.x) * 3;
        const isFrost = nameLower.includes('frost') || nameLower.includes('blizzard') || nameLower.includes('ice');
        const pColor = enemy.primaryColor || (isFrost ? '#cbd5e1' : '#64748b');
        const eyeCol = enemy.eyeColor || (isAlert ? '#ff0844' : (isFrost ? '#7dd3fc' : '#facc15'));

        // Four Stalking Paws
        ctx.fillStyle = isFrost ? '#94a3b8' : '#334155';
        ctx.fillRect(ex - 12 + walkCycle, ey + 6, 5, 6);
        ctx.fillRect(ex - 4 - walkCycle, ey + 6, 5, 6);
        ctx.fillRect(ex + 4 + walkCycle, ey + 6, 5, 6);
        ctx.fillRect(ex + 10 - walkCycle, ey + 6, 5, 6);

        // Sleek Predatory Body
        ctx.fillStyle = pColor;
        ctx.beginPath();
        ctx.ellipse(ex, ey + 2, 14, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        // Spine Ridges along back
        ctx.fillStyle = isFrost ? '#7dd3fc' : '#475569';
        for (let r = -2; r <= 2; r++) {
          ctx.beginPath();
          ctx.moveTo(ex + r * 5 - 2, ey - 6);
          ctx.lineTo(ex + r * 5, ey - 10);
          ctx.lineTo(ex + r * 5 + 2, ey - 6);
          ctx.fill();
        }

        // Swishing Tail
        ctx.strokeStyle = pColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ex - 12, ey + 2);
        ctx.quadraticCurveTo(ex - 20, ey - 4 + Math.sin(time * 6) * 4, ex - 16, ey - 8);
        ctx.stroke();

        // Predatory Head
        ctx.fillStyle = pColor;
        ctx.beginPath();
        ctx.ellipse(ex + 12, ey - 2, 7, 5, 0.2, 0, Math.PI * 2);
        ctx.fill();

        // Ears / Horns
        ctx.beginPath();
        ctx.moveTo(ex + 10, ey - 6);
        ctx.lineTo(ex + 12, ey - 12);
        ctx.lineTo(ex + 15, ey - 6);
        ctx.fill();

        // Glowing Predator Eyes
        ctx.fillStyle = eyeCol;
        ctx.beginPath();
        ctx.arc(ex + 14, ey - 3, 2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isAlert ? '#ff0844' : '#e2e8f0';
        ctx.font = 'bold 8px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`🐺 ${enemy.name}`, ex, ey - 16);

      } else if (bodyShape === 'floating_spirit') {
        // 👻 FLOATING SPIRIT / WRAITH / PHANTOM
        const ghostBob = Math.sin(time * 5 + enemy.x) * 4;
        ctx.globalAlpha = isStunned ? 0.5 : (isAlert ? 0.95 : 0.85);

        // Ethereal Aura Glow
        ctx.fillStyle = isAlert ? 'rgba(239, 68, 68, 0.25)' : (enemy.eyeColor ? `${enemy.eyeColor}33` : 'rgba(168, 85, 247, 0.25)');
        ctx.beginPath();
        ctx.arc(ex, ey + ghostBob, tileSize * 0.7, 0, Math.PI * 2);
        ctx.fill();

        // Ghost Body & Dome Head
        ctx.fillStyle = enemy.primaryColor || (isAlert ? '#fca5a5' : '#e9d5ff');
        ctx.beginPath();
        ctx.arc(ex, ey - 6 + ghostBob, 12, Math.PI, 0, false);
        ctx.lineTo(ex + 12, ey + 10 + ghostBob);
        ctx.quadraticCurveTo(ex + 6, ey + 4 + ghostBob, ex, ey + 10 + ghostBob);
        ctx.quadraticCurveTo(ex - 6, ey + 4 + ghostBob, ex - 12, ey + 10 + ghostBob);
        ctx.closePath();
        ctx.fill();

        // Hollow Glowing Eyes
        ctx.fillStyle = enemy.eyeColor || (isAlert ? '#ff003c' : '#7c3aed');
        ctx.beginPath();
        ctx.ellipse(ex - 4, ey - 6 + ghostBob, 2.5, 3.5, 0, 0, Math.PI * 2);
        ctx.ellipse(ex + 4, ey - 6 + ghostBob, 2.5, 3.5, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isAlert ? '#ff0844' : (enemy.eyeColor || '#c084fc');
        ctx.font = 'bold 8px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`👻 ${enemy.name}`, ex, ey - 18 + ghostBob);

      } else if (bodyShape === 'humanoid_guard') {
        // 👮 HUMANOID GUARD / INFILTRATOR / POLICE CONSTABLE
        const walkBob = Math.sin(time * 6 + enemy.x) * 2;
        const isPolice = nameLower.includes('constable') || nameLower.includes('police') || nameLower.includes('cop') || nameLower.includes('sheriff') || nameLower.includes('patrol') || enemy.spriteTheme === 'police';

        // Flashlight Beam Cone
        ctx.save();
        const beamAngle = enemy.direction === -1 ? Math.PI : 0;
        const beamLength = tileSize * 2.5;
        const coneWidth = 0.5;

        const flashGrad = ctx.createRadialGradient(ex, ey, 5, ex, ey, beamLength);
        flashGrad.addColorStop(0, isAlert ? 'rgba(255, 8, 68, 0.45)' : (isPolice ? 'rgba(147, 197, 253, 0.35)' : 'rgba(254, 240, 138, 0.35)'));
        flashGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = flashGrad;
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.arc(ex, ey, beamLength, beamAngle - coneWidth, beamAngle + coneWidth);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Uniform Body
        ctx.fillStyle = enemy.primaryColor || (isPolice ? '#0f172a' : '#1e293b');
        ctx.beginPath();
        ctx.roundRect(ex - 9, ey - 6 + walkBob, 18, 16, 3);
        ctx.fill();

        if (isPolice) {
          // High-Visibility Neon Harness / Epaulettes
          ctx.fillStyle = '#84cc16';
          ctx.fillRect(ex - 8, ey - 6 + walkBob, 4, 3);
          ctx.fillRect(ex + 4, ey - 6 + walkBob, 4, 3);

          // Alternating Red/Blue Emergency Shoulder Strobes!
          const strobePulse = Math.sin(time * 14) > 0;
          ctx.fillStyle = strobePulse ? '#ef4444' : '#2563eb';
          ctx.beginPath();
          ctx.arc(ex - 6, ey - 7 + walkBob, 2, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = strobePulse ? '#2563eb' : '#ef4444';
          ctx.beginPath();
          ctx.arc(ex + 6, ey - 7 + walkBob, 2, 0, Math.PI * 2);
          ctx.fill();
        }

        // Silver/Gold Badge
        ctx.fillStyle = isPolice ? '#f8fafc' : '#ffd700';
        ctx.fillRect(ex - 5, ey - 2 + walkBob, 4, 4);

        // Head
        ctx.fillStyle = '#ffdfba';
        ctx.beginPath();
        ctx.arc(ex, ey - 10 + walkBob, 7, 0, Math.PI * 2);
        ctx.fill();

        // Peaked Cap / Helmet
        ctx.fillStyle = isPolice ? '#020617' : '#0f172a';
        ctx.beginPath();
        ctx.arc(ex, ey - 13 + walkBob, 7.5, Math.PI, Math.PI * 2);
        ctx.fill();

        if (isPolice) {
          // Sillitoe Checkerboard Band (Black & White checkered band)
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(ex - 7, ey - 13 + walkBob, 14, 2.2);
          ctx.fillStyle = '#000000';
          ctx.fillRect(ex - 6, ey - 13 + walkBob, 2.5, 2.2);
          ctx.fillRect(ex - 1, ey - 13 + walkBob, 2.5, 2.2);
          ctx.fillRect(ex + 4, ey - 13 + walkBob, 2.5, 2.2);
        } else {
          ctx.fillStyle = '#ffd700';
          ctx.fillRect(ex - 6, ey - 13 + walkBob, 12, 2);
        }

        ctx.fillStyle = isAlert ? '#ff0844' : '#f8fafc';
        ctx.font = 'bold 8px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(isPolice ? `🚨 ${enemy.name}` : `👮 ${enemy.name}`, ex, ey - 19 + walkBob);

      } else if (bodyShape === 'mechanical_turret') {
        // 📡 MECHANICAL TURRET / CRYO-TURRET / SENTRY
        const pulse = Math.sin(time * 6) * 0.3 + 0.7;
        const beamCol = enemy.eyeColor || (isAlert ? '#ff0844' : '#00f2fe');

        // Tripod Legs
        ctx.strokeStyle = enemy.primaryColor || '#475569';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - 10, ey + 10);
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex + 10, ey + 10);
        ctx.stroke();

        // Laser Sensor Head
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(ex, ey - 3, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = beamCol;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Pulsing Diode
        ctx.fillStyle = beamCol;
        ctx.beginPath();
        ctx.arc(ex, ey - 3, 4 * pulse, 0, Math.PI * 2);
        ctx.fill();

        // Sweeping Tripwire Beam
        ctx.strokeStyle = isAlert ? 'rgba(255, 8, 68, 0.85)' : `${beamCol}66`;
        ctx.lineWidth = isAlert ? 2.5 : 1.5;
        ctx.beginPath();
        ctx.moveTo(ex, ey - 3);
        const scanOffset = Math.sin(time * 3) * tileSize * 2;
        ctx.lineTo(ex + scanOffset, ey + tileSize * 1.8);
        ctx.stroke();

        ctx.fillStyle = isAlert ? '#ff0844' : beamCol;
        ctx.font = 'bold 8px "Chakra Petch", sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(`📡 ${enemy.name}`, ex, ey - 15);

      } else {
        // 🤖 DRONE / MECH
        const bob = Math.sin(time * 6 + enemy.x) * 3;
        const beamCol = enemy.eyeColor || '#00f2fe';

        if (isGuardian) {
          ctx.save();
          ctx.translate(ex, ey + bob);
          ctx.rotate(time * 2);
          ctx.strokeStyle = isAlert ? '#ff0844' : 'rgba(255, 8, 68, 0.4)';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(0, 0, tileSize * 0.85, 0, Math.PI * 0.75);
          ctx.stroke();
          ctx.restore();

          ctx.fillStyle = enemy.primaryColor || '#1e1115';
          ctx.beginPath();
          ctx.roundRect(ex - 14, ey - 12 + bob, 28, 24, 6);
          ctx.fill();
          ctx.strokeStyle = isAlert ? '#ff0844' : '#b91c1c';
          ctx.lineWidth = 2;
          ctx.stroke();

          ctx.fillStyle = isAlert ? '#ff0844' : beamCol;
          ctx.beginPath();
          ctx.arc(ex, ey + bob, 5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#ff0844';
          ctx.font = 'bold 8px "Press Start 2P", monospace';
          ctx.textAlign = 'center';
          ctx.fillText('💀 BOSS', ex, ey - 18 + bob);
        } else {
          ctx.fillStyle = enemy.primaryColor || '#181b2a';
          ctx.beginPath();
          ctx.roundRect(ex - 10, ey - 8 + bob, 20, 16, 4);
          ctx.fill();
          ctx.strokeStyle = isAlert ? '#ff0844' : beamCol;
          ctx.lineWidth = 1.5;
          ctx.stroke();

          ctx.strokeStyle = '#64748b';
          ctx.lineWidth = 1;
          ctx.strokeRect(ex - 14, ey - 10 + bob, 8, 2);
          ctx.strokeRect(ex + 6, ey - 10 + bob, 8, 2);

          ctx.fillStyle = isAlert ? '#ff0844' : beamCol;
          ctx.beginPath();
          ctx.arc(ex, ey + bob, 3.5, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = isAlert ? '#ff0844' : beamCol;
          ctx.font = 'bold 8px "Chakra Petch", sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText(`🤖 ${enemy.name}`, ex, ey - 14 + bob);
        }
      }

      ctx.restore();
    }
  }

  private renderWeather(world: GameWorld, time: number) {
    const ctx = this.ctx;
    const theme = (world.map.theme || '').toLowerCase();
    const weather = world.palette?.weather || (
      theme.includes('snow') || theme.includes('ice') || theme.includes('frost') || theme.includes('mountain') || theme.includes('arctic') ? 'snow' :
        theme.includes('volcano') || theme.includes('lava') || theme.includes('fire') ? 'embers' :
          theme.includes('ocean') || theme.includes('water') || theme.includes('sea') ? 'bubbles' :
            theme.includes('haunted') ? 'fog' :
              theme.includes('desert') ? 'sand' :
                theme.includes('cyber') || theme.includes('space') ? 'sparks' : null
    );

    if (!weather) return;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);

    if (weather === 'snow') {
      const flakeCount = 55;
      for (let i = 0; i < flakeCount; i++) {
        const speedY = 22 + (i % 5) * 8;
        const swayAmp = 15 + (i % 4) * 5;
        const sy = (i * 47.1 + time * speedY) % this.canvasHeight;
        const sx = ((i * 89.3 + Math.sin(time * 1.8 + i) * swayAmp) % this.canvasWidth + this.canvasWidth) % this.canvasWidth;
        const rad = 1.0 + (i % 3) * 0.9;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 255, 255, 0.85)' : 'rgba(224, 242, 254, 0.7)';
        ctx.beginPath();
        ctx.arc(sx, sy, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (weather === 'embers') {
      const emberCount = 40;
      for (let i = 0; i < emberCount; i++) {
        const speedY = 25 + (i % 4) * 10;
        const ey = this.canvasHeight - ((i * 53.7 + time * speedY) % this.canvasHeight);
        const ex = ((i * 113.1 + Math.sin(time * 2.5 + i) * 20) % this.canvasWidth + this.canvasWidth) % this.canvasWidth;
        const rad = 1.0 + (i % 3) * 0.8;
        ctx.fillStyle = i % 3 === 0 ? 'rgba(249, 115, 22, 0.85)' : (i % 3 === 1 ? 'rgba(250, 204, 21, 0.9)' : 'rgba(239, 68, 68, 0.75)');
        ctx.beginPath();
        ctx.arc(ex, ey, rad, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (weather === 'bubbles') {
      const bubbleCount = 30;
      for (let i = 0; i < bubbleCount; i++) {
        const speedY = 18 + (i % 4) * 6;
        const by = this.canvasHeight - ((i * 61.3 + time * speedY) % this.canvasHeight);
        const bx = ((i * 97.7 + Math.sin(time * 2 + i) * 12) % this.canvasWidth + this.canvasWidth) % this.canvasWidth;
        const rad = 2.0 + (i % 3) * 1.5;
        ctx.strokeStyle = 'rgba(56, 189, 248, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(bx, by, rad, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(bx - rad * 0.3, by - rad * 0.3, rad * 0.3, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (weather === 'fog') {
      const puffCount = 5;
      for (let i = 0; i < puffCount; i++) {
        const fx = ((i * 240 + time * 8) % (this.canvasWidth + 200)) - 100;
        const fy = 60 + i * 110;
        const grad = ctx.createRadialGradient(fx, fy, 20, fx, fy, 140);
        grad.addColorStop(0, 'rgba(168, 85, 247, 0.08)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(fx, fy, 140, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (weather === 'sand') {
      const dustCount = 40;
      for (let i = 0; i < dustCount; i++) {
        const speedX = 40 + (i % 4) * 15;
        const dx = (i * 73.1 + time * speedX) % this.canvasWidth;
        const dy = (i * 41.3 + Math.sin(time + i) * 15) % this.canvasHeight;
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.45)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(dx, dy);
        ctx.lineTo(dx + 6, dy + 1);
        ctx.stroke();
      }
    }

    ctx.restore();
  }

  private renderStunProjectiles(projectiles: StunProjectile[], time: number) {
    const ctx = this.ctx;
    for (const p of projectiles) {
      ctx.save();
      // Outer electric pulse
      ctx.fillStyle = 'rgba(0, 242, 254, 0.4)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius * 1.6, 0, Math.PI * 2);
      ctx.fill();

      // Core bolt
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.restore();
    }
  }

  private renderPlayer(player: EngineState['player'], time: number, state: EngineState) {
    const ctx = this.ctx;
    const px = player.x + player.width / 2;
    const py = player.y + player.height / 2;
    const skin: AvatarSkin = getEquippedSkin();

    if (player.invincibleTime && player.invincibleTime > 0) {
      if (Math.floor(time * 24) % 2 === 0) {
        return;
      }
    }

    const walkBob = player.isMoving ? Math.sin(player.walkFrame * 0.4) * 3 : 0;

    ctx.save();

    // Stealth Camo (Stealth active: 55% opacity without artificial bubble aura)
    if (state.isStealth) {
      ctx.globalAlpha = 0.55;
    }

    // Dash Trail based on equipped skin trail effect
    if (player.isDashing) {
      const trailColors: Record<string, string> = {
        electric: 'rgba(0, 242, 254, 0.4)',
        fire: 'rgba(249, 115, 22, 0.45)',
        ghostly: 'rgba(168, 85, 247, 0.45)',
        smoke: 'rgba(71, 85, 105, 0.5)',
        sparkles: 'rgba(236, 72, 153, 0.45)',
      };
      ctx.fillStyle = trailColors[skin.trailEffect] || 'rgba(0, 242, 254, 0.35)';
      ctx.beginPath();
      ctx.arc(px - 14, py, 14, 0, Math.PI * 2);
      ctx.arc(px - 26, py, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
    ctx.beginPath();
    ctx.ellipse(px, py + 12, 11, 5, 0, 0, Math.PI * 2);
    ctx.fill();

    // Player Body (Skin primary color)
    ctx.fillStyle = skin.primaryColor;
    ctx.beginPath();
    ctx.roundRect(px - 9, py - 4 + walkBob, 18, 14, 4);
    ctx.fill();

    // Belt / Trim (Skin accent color)
    ctx.fillStyle = skin.accentColor;
    ctx.fillRect(px - 8, py + 4 + walkBob, 16, 2.5);

    // Head
    ctx.fillStyle = '#ffdfba';
    ctx.beginPath();
    ctx.arc(px, py - 9 + walkBob, 8, 0, Math.PI * 2);
    ctx.fill();

    // CUSTOM HEADGEAR based on AvatarSkin hatType
    if (skin.hatType === 'fedora') {
      // 🕵️ Wide-brim fedora
      ctx.fillStyle = '#78350f';
      ctx.fillRect(px - 12, py - 14 + walkBob, 24, 3); // brim
      ctx.fillRect(px - 7, py - 20 + walkBob, 14, 7);  // crown
      ctx.fillStyle = '#451a03';
      ctx.fillRect(px - 7, py - 15 + walkBob, 14, 2);  // band
    } else if (skin.hatType === 'knight_helm') {
      // 🛡️ Knight Helmet
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(px, py - 10 + walkBob, 9, Math.PI, 0, false);
      ctx.lineTo(px + 8, py - 3 + walkBob);
      ctx.lineTo(px - 8, py - 3 + walkBob);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(px - 6, py - 9 + walkBob, 12, 2.5); // visor slit
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(px - 2, py - 18 + walkBob, 4, 7); // plume
    } else if (skin.hatType === 'ninja_headband') {
      // ⚡ Ninja Headband
      ctx.fillStyle = skin.accentColor;
      ctx.fillRect(px - 8, py - 13 + walkBob, 16, 3);
      // Ribbon tail
      ctx.fillRect(px + 7, py - 12 + walkBob, 6, 2);
    } else if (skin.hatType === 'hood') {
      // 🔮 Spectral Hood
      ctx.fillStyle = skin.primaryColor;
      ctx.beginPath();
      ctx.arc(px, py - 10 + walkBob, 10, Math.PI * 0.9, Math.PI * 2.1);
      ctx.fill();
    } else if (skin.hatType === 'space_helmet') {
      // 🚀 Astronaut Pressure Bubble Helmet
      ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
      ctx.beginPath();
      ctx.arc(px, py - 9 + walkBob, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.stroke();
      ctx.fillStyle = '#0284c7';
      ctx.fillRect(px - 8, py - 2 + walkBob, 16, 2.5); // neck collar
      // Visor reflection
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.arc(px - 2, py - 11 + walkBob, 6, Math.PI * 1.1, Math.PI * 1.6);
      ctx.stroke();
    } else if (skin.hatType === 'samurai_kabuto') {
      // ⚔️ Samurai Crested Kabuto
      ctx.fillStyle = '#991b1b';
      ctx.beginPath();
      ctx.arc(px, py - 11 + walkBob, 9, Math.PI, 0);
      ctx.fill();
      ctx.fillStyle = '#450a0a';
      ctx.fillRect(px - 10, py - 10 + walkBob, 20, 3.5); // shikoro neck guard
      // Golden crescent maedate horn
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.moveTo(px - 7, py - 16 + walkBob);
      ctx.quadraticCurveTo(px, py - 13 + walkBob, px + 7, py - 16 + walkBob);
      ctx.lineTo(px, py - 19 + walkBob);
      ctx.closePath();
      ctx.fill();
    } else if (skin.hatType === 'cowboy_hat') {
      // 🤠 Western Stetson Hat
      ctx.fillStyle = '#92400e';
      ctx.beginPath();
      ctx.ellipse(px, py - 13 + walkBob, 12, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#b45309';
      ctx.fillRect(px - 6, py - 19 + walkBob, 12, 7);
      ctx.fillStyle = '#451a03';
      ctx.fillRect(px - 6, py - 14 + walkBob, 12, 2);
    } else if (skin.hatType === 'gas_mask') {
      // ☣️ Tactical CBRN Gas Mask
      ctx.fillStyle = '#14532d';
      ctx.beginPath();
      ctx.arc(px, py - 10 + walkBob, 9, Math.PI * 0.9, Math.PI * 2.1);
      ctx.fill();
      ctx.fillStyle = '#22c55e';
      ctx.fillRect(px - 4, py - 4 + walkBob, 8, 4); // canister
      ctx.fillStyle = '#4ade80';
      ctx.fillRect(px - 6, py - 10 + walkBob, 4, 3); // left lens
      ctx.fillRect(px + 2, py - 10 + walkBob, 4, 3); // right lens
    } else if (skin.hatType === 'wizard_hat') {
      // 🧙 Pointed Sorcerer Hat
      ctx.fillStyle = '#581c87';
      ctx.beginPath();
      ctx.ellipse(px, py - 13 + walkBob, 12, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#7c3aed';
      ctx.beginPath();
      ctx.moveTo(px - 7, py - 13 + walkBob);
      ctx.lineTo(px + 8, py - 24 + walkBob);
      ctx.lineTo(px + 6, py - 13 + walkBob);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#fbbf24';
      ctx.fillRect(px - 2, py - 14 + walkBob, 4, 2.5); // gold buckle
    } else if (skin.hatType === 'crown') {
      // 👑 Ornate Golden Crown
      ctx.fillStyle = '#eab308';
      ctx.fillRect(px - 8, py - 13 + walkBob, 16, 2.5); // band
      ctx.beginPath();
      ctx.moveTo(px - 8, py - 13 + walkBob);
      ctx.lineTo(px - 7, py - 19 + walkBob);
      ctx.lineTo(px - 3, py - 14 + walkBob);
      ctx.lineTo(px, py - 21 + walkBob);
      ctx.lineTo(px + 3, py - 14 + walkBob);
      ctx.lineTo(px + 7, py - 19 + walkBob);
      ctx.lineTo(px + 8, py - 13 + walkBob);
      ctx.closePath();
      ctx.fill();
      // Rubies
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(px - 1, py - 17 + walkBob, 2, 2);
      ctx.fillStyle = '#3b82f6';
      ctx.fillRect(px - 6, py - 16 + walkBob, 2, 2);
      ctx.fillRect(px + 4, py - 16 + walkBob, 2, 2);
    } else {
      // Standard Hair / Cap
      ctx.fillStyle = '#1e1b4b';
      ctx.beginPath();
      ctx.arc(px, py - 12 + walkBob, 8.5, Math.PI, Math.PI * 2);
      ctx.fill();
    }

    // Eyes / Visor
    if (skin.hatType === 'visor') {
      // Sleek Recon Visor
      ctx.fillStyle = skin.accentColor;
      ctx.fillRect(px - 7, py - 10 + walkBob, 14, 3.5);
    } else {
      ctx.fillStyle = '#0f172a';
      let eyeX1 = px - 3;
      let eyeX2 = px + 3;
      let eyeY = py - 9 + walkBob;

      if (player.facing === 'left') {
        eyeX1 = px - 6;
        eyeX2 = px - 2;
      } else if (player.facing === 'right') {
        eyeX1 = px + 2;
        eyeX2 = px + 6;
      } else if (player.facing === 'up') {
        eyeY -= 2;
      } else if (player.facing === 'down') {
        eyeY += 1;
      }

      if (player.facing !== 'up') {
        ctx.beginPath();
        ctx.arc(eyeX1, eyeY, 1.8, 0, Math.PI * 2);
        ctx.arc(eyeX2, eyeY, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  private renderLighting(world: GameWorld, player: EngineState['player'], time: number) {
    // Artificial player-following aura removed per user requirement!
    // Environment is crisply visible with authentic thematic palettes.
  }

  private renderRadar(world: GameWorld, state: EngineState) {
    const ctx = this.ctx;
    const tileSize = world.map.tileSize;
    const mapW = world.map.width * tileSize;
    const mapH = world.map.height * tileSize;

    const isMobile = this.canvasWidth <= 900;
    const radarW = isMobile ? 116 : 144;
    const radarH = isMobile ? 76 : 96;
    const rx = isMobile ? 14 : this.canvasWidth - radarW - 14;
    const ry = isMobile ? 68 : this.canvasHeight - radarH - 14;

    ctx.save();
    ctx.fillStyle = 'rgba(11, 15, 25, 0.88)';
    ctx.beginPath();
    ctx.roundRect(rx, ry, radarW, radarH, 10);
    ctx.fill();
    ctx.strokeStyle = 'rgba(0, 242, 254, 0.4)';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = '#00f2fe';
    ctx.font = 'bold 8px "Press Start 2P", monospace';
    ctx.fillText('RADAR', rx + 8, ry + 12);

    const scaleX = (radarW - 16) / mapW;
    const scaleY = (radarH - 22) / mapH;
    const offsetX = rx + 8;
    const offsetY = ry + 16;

    // Walls
    ctx.fillStyle = 'rgba(71, 85, 105, 0.5)';
    for (const wall of world.walls) {
      ctx.fillRect(
        offsetX + wall.x * tileSize * scaleX,
        offsetY + wall.y * tileSize * scaleY,
        Math.max(1.5, wall.width * tileSize * scaleX),
        Math.max(1.5, wall.height * tileSize * scaleY)
      );
    }

    // Sanctum Barriers & Terminals
    const required = world.objective.requiredItems || [];
    const hasAllItems = required.every(id => (state.collectedItems[id] || 0) > 0);
    const reqScore = world.objective.requiredScore || 0;
    const hasReqScore = (state.levelScore !== undefined ? state.levelScore : state.score) >= reqScore;
    const isSanctumOpen = hasAllItems && hasReqScore;

    for (const obj of world.objects) {
      const isBarrier = obj.type === 'terminal_barrier' || obj.id.includes('terminal_barrier');
      const isTerm = !isBarrier && (obj.id.includes('terminal') || obj.id.includes('term'));
      if (isBarrier) {
        ctx.fillStyle = isSanctumOpen ? '#43e97b' : '#ef4444';
        ctx.fillRect(
          offsetX + obj.x * tileSize * scaleX,
          offsetY + obj.y * tileSize * scaleY,
          Math.max(2, obj.width * tileSize * scaleX),
          Math.max(2, obj.height * tileSize * scaleY)
        );
      } else if (isTerm) {
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(offsetX + obj.x * tileSize * scaleX, offsetY + obj.y * tileSize * scaleY, 4, 4);
      }
    }

    // Keys
    ctx.fillStyle = '#ffd700';
    for (const c of world.collectibles) {
      if (!c.collected && (c.type === 'key' || c.id.includes('key'))) {
        ctx.fillRect(offsetX + c.x * tileSize * scaleX, offsetY + c.y * tileSize * scaleY, 3, 3);
      }
    }

    // Exit
    ctx.fillStyle = '#43e97b';
    ctx.fillRect(offsetX + world.exit.x * tileSize * scaleX - 1, offsetY + world.exit.y * tileSize * scaleY - 1, 5, 5);

    // Enemies (Red or Yellow if stunned, flashing alert if hostile aggro)
    if (world.enemies) {
      for (const enemy of world.enemies) {
        const isAggro = (enemy.isAlert || (enemy.aggroTimer && enemy.aggroTimer > 0)) && !enemy.isStunned;
        const ex = offsetX + enemy.x * tileSize * scaleX;
        const ey = offsetY + enemy.y * tileSize * scaleY;
        const eSize = enemy.type === 'exit_guardian' ? 4 : 3;

        if (isAggro) {
          ctx.strokeStyle = '#ff0844';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(ex, ey, eSize + 2, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.fillStyle = enemy.isStunned ? '#f59e0b' : (isAggro ? '#ff0844' : (enemy.type === 'exit_guardian' ? '#ff0844' : '#ef4444'));
        ctx.beginPath();
        ctx.arc(ex, ey, eSize, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Player (Cyan Dot)
    ctx.fillStyle = state.isStealth ? '#c084fc' : '#00f2fe';
    const pX = offsetX + (state.player.x + state.player.width / 2) * scaleX;
    const pY = offsetY + (state.player.y + state.player.height / 2) * scaleY;
    ctx.beginPath();
    ctx.arc(pX, pY, 3, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private renderInteractPrompt(
    interactable: EngineState['nearbyInteractable'],
    player: EngineState['player'],
    time: number
  ) {
    if (!interactable) return;
    const ctx = this.ctx;
    const px = player.x + player.width / 2;
    const py = player.y - 24;
    const floatOffset = Math.sin(time * 6) * 3;

    ctx.save();
    ctx.font = 'bold 12px "Chakra Petch", sans-serif';
    ctx.textAlign = 'center';

    const text = `[E] ${interactable.prompt}`;
    const textMetrics = ctx.measureText(text);
    const boxWidth = textMetrics.width + 16;
    const boxHeight = 22;

    const isTakedown = interactable.type === 'sneak_takedown';
    ctx.fillStyle = isTakedown ? 'rgba(88, 28, 135, 0.95)' : 'rgba(10, 13, 24, 0.9)';
    ctx.beginPath();
    ctx.roundRect(px - boxWidth / 2, py - 14 + floatOffset, boxWidth, boxHeight, 6);
    ctx.fill();
    ctx.strokeStyle = isTakedown ? '#c084fc' : '#00f2fe';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.fillStyle = isTakedown ? '#e9d5ff' : '#00f2fe';
    ctx.fillText(text, px, py + 2 + floatOffset);
    ctx.restore();
  }

  private renderParticles(particles: Particle[]) {
    const ctx = this.ctx;
    for (const p of particles) {
      ctx.save();
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  private renderFloatingTexts(texts: FloatingText[]) {
    const ctx = this.ctx;
    for (const ft of texts) {
      ctx.save();
      ctx.globalAlpha = ft.alpha;
      ctx.fillStyle = ft.color;
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3;
      ctx.font = 'bold 12px "Press Start 2P", monospace';
      ctx.textAlign = 'center';
      ctx.strokeText(ft.text, ft.x, ft.y);
      ctx.fillText(ft.text, ft.x, ft.y);
      ctx.restore();
    }
  }
}
