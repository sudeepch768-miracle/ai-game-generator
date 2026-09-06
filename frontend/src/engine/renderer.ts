import { GameWorld, EngineState, FloatingText, Particle, GameObject, StunProjectile } from '../types/game';
import { getEquippedSkin, AvatarSkin } from '../types/avatar';

export class CanvasRenderer {
  private ctx: CanvasRenderingContext2D;
  private canvasWidth: number;
  private canvasHeight: number;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number) {
    this.ctx = ctx;
    this.canvasWidth = width;
    this.canvasHeight = height;
  }

  resize(width: number, height: number) {
    this.canvasWidth = width;
    this.canvasHeight = height;
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

    // Apply Camera transform
    ctx.translate(-Math.round(camera.x), -Math.round(camera.y));

    // 1. Render Map Floor with Procedural Textures
    this.renderFloor(world, tileSize, time);

    // 2. Render 3D Beveled Walls
    this.renderWalls(world, tileSize);

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
    this.renderLighting(state.player, time);

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
      theme.includes('railway') || theme.includes('train') || theme.includes('station') || theme.includes('metro') || theme.includes('subway') || theme.includes('airport') ? 'railway' :
        theme.includes('police') || theme.includes('cop') || theme.includes('precinct') || theme.includes('jail') ? 'police' :
          theme.includes('hospital') || theme.includes('clinic') || theme.includes('medical') ? 'hospital' :
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
        } else if (floorTex === 'police' || floorTex === 'hospital' || floorTex === 'kitchen') {
          // 👮 / 🏥 / 🍳 Polished Checkered Linoleum Tiles with Wax Sheen
          const isLight = (x + y) % 2 === 0;
          if (floorTex === 'police') {
            ctx.fillStyle = isLight ? '#131b2e' : '#0c1220';
          } else if (floorTex === 'hospital') {
            ctx.fillStyle = isLight ? '#112233' : '#0a1622';
          } else {
            ctx.fillStyle = isLight ? '#221411' : '#140c09';
          }
          ctx.fillRect(px, py, tileSize, tileSize);

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
          ctx.lineWidth = 0.75;
          ctx.strokeRect(px, py, tileSize, tileSize);

          // Diagonal Wax Sheen Reflection
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

  private renderWalls(world: GameWorld, tileSize: number) {
    const ctx = this.ctx;
    const theme = (world.map.theme || 'cyberpunk').toLowerCase();
    const palette = world.palette;

    const wallThemes: Record<string, { top: string; front: string; rim: string }> = {
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

    ctx.save();
    for (const wall of world.walls) {
      const wx = wall.x * tileSize;
      const wy = wall.y * tileSize;
      const ww = wall.width * tileSize;
      const wh = wall.height * tileSize;

      // Drop shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.fillRect(wx + 3, wy + 5, ww, wh);

      // Front Face
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
      const isTerm = obj.id.includes('terminal') || obj.id.includes('term');

      ctx.save();

      // Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(ox + 2, oy + 4, ow, oh);

      if (isTerm) {
        // 💻 Interactive Security Terminal
        const isHacked = state.hackedTerminals && state.hackedTerminals[obj.id];
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

        // Terminal Label
        ctx.fillStyle = isHacked ? '#43e97b' : '#00f2fe';
        ctx.font = 'bold 9px "Press Start 2P", monospace';
        ctx.textAlign = 'center';
        ctx.fillText(isHacked ? 'OVERRIDDEN' : 'TERMINAL', ox + ow / 2, oy - 8);
      } else {
        // Dynamic Procedural Prop / Obstacle
        this.renderProp(obj, ox, oy, ow, oh, time);
      }

      ctx.restore();
    }
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
    const pulse = Math.sin(time * 4) * 3;

    ctx.save();

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

    // Portal Core Icon
    ctx.fillStyle = isUnlocked ? '#43e97b' : '#ff0844';
    ctx.font = 'bold 9px "Press Start 2P", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(isUnlocked ? 'EXIT' : 'LOCKED', ex, ey - tileSize * 0.9);

    ctx.restore();
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

    // Stealth Camo Aura
    if (state.isStealth) {
      ctx.globalAlpha = 0.75;
      ctx.fillStyle = 'rgba(168, 85, 247, 0.2)';
      ctx.beginPath();
      ctx.arc(px, py, 18 + Math.sin(time * 6) * 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
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

  private renderLighting(player: EngineState['player'], time: number) {
    const ctx = this.ctx;
    const px = player.x + player.width / 2;
    const py = player.y + player.height / 2;

    ctx.save();
    const lightRad = 280;
    const lightGrad = ctx.createRadialGradient(px, py, 60, px, py, lightRad);
    lightGrad.addColorStop(0, 'rgba(0, 242, 254, 0.06)');
    lightGrad.addColorStop(0.5, 'rgba(0, 0, 0, 0)');
    lightGrad.addColorStop(1, 'rgba(5, 8, 18, 0.45)');
    ctx.fillStyle = lightGrad;
    ctx.beginPath();
    ctx.arc(px, py, lightRad, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  private renderRadar(world: GameWorld, state: EngineState) {
    const ctx = this.ctx;
    const tileSize = world.map.tileSize;
    const mapW = world.map.width * tileSize;
    const mapH = world.map.height * tileSize;

    const radarW = 144;
    const radarH = 96;
    const rx = this.canvasWidth - radarW - 14;
    const ry = this.canvasHeight - radarH - 14;

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

    // Terminals
    ctx.fillStyle = '#38bdf8';
    for (const obj of world.objects) {
      if (obj.id.includes('term')) {
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
