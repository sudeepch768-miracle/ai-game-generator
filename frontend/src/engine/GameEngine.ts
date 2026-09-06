import { GameWorld, EngineState, FloatingText, Particle, GameObject, NPC, Enemy, StunProjectile } from '../types/game';
import { InputManager } from './input';
import { CanvasRenderer } from './renderer';
import { sound } from './sound';
import { getEquippedSkinId, addGems } from '../types/avatar';

export interface DifficultyPersistence {
  aggroDuration: number;
  detectRangeMult: number;
  speedMultiplier: number;
  packAlertRadius: number;
  stealthEvadeRate: number;
  burstInterval: number;
  burstSpeedMult: number;
  leashDistance: number;
}

export const DIFFICULTY_PROFILES: Record<string, DifficultyPersistence> = {
  easy: {
    aggroDuration: 3.2,
    detectRangeMult: 0.78,
    speedMultiplier: 1.15,
    packAlertRadius: 3.5,
    stealthEvadeRate: 3.8,
    burstInterval: 5.0,
    burstSpeedMult: 1.15,
    leashDistance: 6.5,
  },
  medium: {
    aggroDuration: 6.0,
    detectRangeMult: 1.0,
    speedMultiplier: 1.42,
    packAlertRadius: 6.5,
    stealthEvadeRate: 2.5,
    burstInterval: 3.5,
    burstSpeedMult: 1.3,
    leashDistance: 10.0,
  },
  hard: {
    aggroDuration: 9.5,
    detectRangeMult: 1.25,
    speedMultiplier: 1.68,
    packAlertRadius: 9.5,
    stealthEvadeRate: 1.7,
    burstInterval: 2.8,
    burstSpeedMult: 1.45,
    leashDistance: 15.0,
  },
  nightmare: {
    aggroDuration: 16.0,
    detectRangeMult: 1.45,
    speedMultiplier: 1.92,
    packAlertRadius: 15.0,
    stealthEvadeRate: 1.1,
    burstInterval: 2.0,
    burstSpeedMult: 1.6,
    leashDistance: 999.0,
  },
};

export class GameEngine {
  private canvas: HTMLCanvasElement;
  private renderer: CanvasRenderer;
  private input: InputManager;
  private world: GameWorld;
  public state: EngineState;

  private isRunning: boolean = false;
  private animFrameId: number = 0;
  private lastTime: number = 0;
  private elapsedSeconds: number = 0;
  private camera: { x: number; y: number };

  private floatingTexts: FloatingText[] = [];
  private particles: Particle[] = [];
  private stunProjectiles: StunProjectile[] = [];
  private nextTextId: number = 0;
  private lastExitWarningTime: number = 0;
  private isExitUnlocked: boolean = false;
  public onStateChange?: (state: EngineState) => void;
  public onWin?: (score: number, timeLeft: number) => void;
  public onLose?: (reason: string, score: number) => void;

  public getStartingHealthForWorld(world: GameWorld): number {
    const diff = (world.difficulty || 'medium').toLowerCase();
    if (diff === 'nightmare') return 1;
    if (diff === 'hard') return 2;
    if (diff === 'easy') return 4;
    return 3;
  }

  constructor(
    canvas: HTMLCanvasElement,
    world: GameWorld,
    onStateChange?: (state: EngineState) => void
  ) {
    this.canvas = canvas;
    this.world = JSON.parse(JSON.stringify(world)); // Deep clone
    this.onStateChange = onStateChange;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not create 2D canvas context');
    this.renderer = new CanvasRenderer(ctx, canvas.width, canvas.height);
    this.input = new InputManager();

    const tileSize = this.world.map.tileSize;
    const playerWidth = tileSize * 0.7;
    const playerHeight = tileSize * 0.7;

    const startingHealth = this.getStartingHealthForWorld(world);
    let initialTime = world.timeLimit || 90;
    if (world.difficulty === 'nightmare') {
      initialTime = Math.min(initialTime, 45);
    } else if (world.difficulty === 'hard') {
      initialTime = Math.min(initialTime, 65);
    } else if (world.difficulty === 'easy') {
      initialTime = initialTime + 30;
    }

    this.state = {
      player: {
        x: world.player.x * tileSize + (tileSize - playerWidth) / 2,
        y: world.player.y * tileSize + (tileSize - playerHeight) / 2,
        width: playerWidth,
        height: playerHeight,
        speed: tileSize * (world.difficulty === 'nightmare' ? 4.8 : 4.2),
        facing: 'down',
        isMoving: false,
        walkFrame: 0,
        invincibleTime: 0,
        dashCooldown: 0,
        isDashing: false,
      },
      score: 0,
      levelScore: 0,
      comboCount: 0,
      comboTimer: 0,
      hackedTerminals: {},
      health: startingHealth,
      maxHealth: startingHealth,
      timeLeft: initialTime,
      currentLevel: world.levelNumber || 1,
      maxLevels: world.maxLevels || (world.levels ? world.levels.length : 3),
      isWon: false,
      isGameOver: false,
      isPaused: false,
      collectedItems: {},
      nearbyInteractable: null,
      activeDialogue: null,
      screenShake: 0,
      // Stealth & Stun mechanics
      isStealth: false,
      stunAmmo: 3,
      maxStunAmmo: 3,
      stunCooldown: 0,
      equippedSkinId: getEquippedSkinId(),
      canSneakTakedown: null,
    };

    this.camera = { x: 0, y: 0 };
    this.updateCamera();
  }

  start() {
    if (this.isRunning) return;
    this.isRunning = true;
    this.input.attach();
    this.lastTime = performance.now();
    sound.startBGM(this.world.map?.theme || 'default');
    this.loop = this.loop.bind(this);
    this.animFrameId = requestAnimationFrame(this.loop);
  }

  stop() {
    this.isRunning = false;
    this.input.detach();
    sound.stopBGM(0.3);
    cancelAnimationFrame(this.animFrameId);
  }

  togglePause() {
    this.setPaused(!this.state.isPaused);
  }

  setPaused(paused: boolean) {
    this.state.isPaused = paused;
    if (paused) {
      sound.pauseBGM();
    } else {
      sound.resumeBGM();
    }
    this.notifyState();
  }

  setMuted(muted: boolean) {
    sound.enabled = !muted;
    if (muted) {
      sound.pauseBGM();
    } else {
      sound.resumeBGM();
    }
  }

  closeDialogue() {
    this.state.activeDialogue = null;
    this.notifyState();
  }

  private loop(now: number) {
    if (!this.isRunning) return;

    const dt = Math.min((now - this.lastTime) / 1000, 0.1); // Cap delta time at 100ms
    this.lastTime = now;

    if (!this.state.isPaused && !this.state.isWon && !this.state.isGameOver) {
      this.update(dt, now / 1000);
    }

    this.renderer.render(
      this.world,
      this.state,
      this.camera,
      this.floatingTexts,
      this.particles,
      now / 1000,
      this.stunProjectiles
    );

    this.animFrameId = requestAnimationFrame(this.loop);
  }

  private update(dt: number, timeSec: number) {
    // 1. Timer & Cooldown updates
    this.elapsedSeconds += dt;
    this.state.timeLeft = Math.max(0, this.world.timeLimit - this.elapsedSeconds);
    if (this.state.timeLeft <= 0) {
      this.triggerGameOver("Time's Up!");
      return;
    }

    const player = this.state.player;
    player.dashCooldown = Math.max(0, player.dashCooldown - dt);
    this.state.stunCooldown = Math.max(0, this.state.stunCooldown - dt);

    // Passive Stun Ammo Recharge (1 every 8 seconds up to max)
    if (this.state.stunAmmo < this.state.maxStunAmmo) {
      if (Math.floor(this.elapsedSeconds) % 8 === 0 && Math.random() < dt * 1.5) {
        this.state.stunAmmo = Math.min(this.state.maxStunAmmo, this.state.stunAmmo + 1);
        const px = player.x + player.width / 2;
        const py = player.y + player.height / 2;
        this.addFloatingText('⚡ STUN CHARGED!', px, py - 16, '#00f2fe');
      }
    }

    if (this.state.comboTimer > 0) {
      this.state.comboTimer -= dt;
      if (this.state.comboTimer <= 0) {
        this.state.comboCount = 0;
      }
    }

    if (this.state.screenShake > 0) {
      this.state.screenShake = Math.max(0, this.state.screenShake - dt * 3.5);
    }

    // 2. Stealth Mode (Hold C or Ctrl, or toggle)
    this.state.isStealth = this.input.isStealthHeld();

    // 3. Stun Weapon Fire (F or Q)
    if (this.input.isStunJustPressed() && this.state.stunAmmo > 0 && this.state.stunCooldown <= 0) {
      this.fireStunWeapon();
    }

    // 4. Dash Check (Space or Shift)
    const { dx, dy, facing } = this.input.getMovementVector();

    if (this.input.isDashJustPressed() && player.dashCooldown <= 0) {
      player.dashCooldown = 0.85;
      player.isDashing = true;
      player.invincibleTime = Math.max(player.invincibleTime || 0, 0.22);
      sound.playDash();

      const tileSize = this.world.map.tileSize;
      const dashDist = tileSize * 1.55; // Controllable, tight tactical dash
      let dashDx = dx;
      let dashDy = dy;
      if (dashDx === 0 && dashDy === 0) {
        if (player.facing === 'up') dashDy = -1;
        else if (player.facing === 'down') dashDy = 1;
        else if (player.facing === 'left') dashDx = -1;
        else if (player.facing === 'right') dashDx = 1;
      }

      // Step along dash path with fixed increment to prevent compounding runaway
      const steps = 4;
      const stepIncX = (dashDx * dashDist) / steps;
      const stepIncY = (dashDy * dashDist) / steps;

      for (let s = 1; s <= steps; s++) {
        const nextX = player.x + stepIncX;
        const nextY = player.y + stepIncY;
        if (!this.checkCollision(nextX, player.y, player.width, player.height)) {
          player.x = nextX;
        }
        if (!this.checkCollision(player.x, nextY, player.width, player.height)) {
          player.y = nextY;
        }
        this.spawnBurstParticles(player.x + player.width / 2, player.y + player.height / 2, '#00f2fe');
      }

      this.addFloatingText('💨 DASH!', player.x + player.width / 2, player.y - 14, '#00f2fe');
      setTimeout(() => { player.isDashing = false; }, 160);
    }

    // 5. Player continuous movement & collision (stealth slows movement to 65%)
    if (facing) {
      player.facing = facing;
    }

    const moveSpeed = this.state.isStealth ? player.speed * 0.65 : player.speed;

    if (dx !== 0 || dy !== 0) {
      player.isMoving = true;
      player.walkFrame += dt * (this.state.isStealth ? 8 : 12);

      // Footstep sound (silent in stealth!)
      if (!this.state.isStealth && Math.floor(player.walkFrame) % 3 === 0 && Math.random() < 0.18) {
        sound.playStep();
      }

      const moveDist = moveSpeed * dt;
      const targetX = player.x + dx * moveDist;
      const targetY = player.y + dy * moveDist;

      // Axis-separated collision for smooth sliding
      if (!this.checkCollision(targetX, player.y, player.width, player.height)) {
        player.x = targetX;
      }
      if (!this.checkCollision(player.x, targetY, player.width, player.height)) {
        player.y = targetY;
      }
    } else {
      player.isMoving = false;
    }

    // 6. Invincible frame countdown
    if (player.invincibleTime && player.invincibleTime > 0) {
      player.invincibleTime -= dt;
    }

    // 7. Update Stun Projectiles
    this.updateStunProjectiles(dt);

    // 8. Update Enemies (Slower speeds, stun countdown, stealth detection reduction)
    this.updateEnemies(dt);

    // 9. Collectibles
    this.checkCollectibles();

    // 10. Check Interactions (NPCs, Terminals, and Sneak Takedowns)
    this.checkInteractions();

    // 11. Exit Unlock & Portal Check
    this.checkExitUnlockState();
    this.checkExit();

    // 12. Floating texts and particles
    this.updateParticlesAndTexts(dt);

    // 13. Camera Follow
    this.updateCamera();

    this.notifyState();
  }

  private fireStunWeapon() {
    this.state.stunAmmo = Math.max(0, this.state.stunAmmo - 1);
    this.state.stunCooldown = 1.0;
    sound.playStun();

    const tileSize = this.world.map.tileSize;
    const px = this.state.player.x + this.state.player.width / 2;
    const py = this.state.player.y + this.state.player.height / 2;

    const projSpeed = tileSize * 9;
    let vx = 0;
    let vy = 0;
    if (this.state.player.facing === 'up') vy = -projSpeed;
    else if (this.state.player.facing === 'down') vy = projSpeed;
    else if (this.state.player.facing === 'left') vx = -projSpeed;
    else if (this.state.player.facing === 'right') vx = projSpeed;

    this.stunProjectiles.push({
      id: `stun_${Date.now()}_${Math.random()}`,
      x: px,
      y: py,
      vx,
      vy,
      radius: tileSize * 0.35,
      lifetime: 0.65,
    });

    this.spawnBurstParticles(px, py, '#00f2fe');
    this.addFloatingText('⚡ STUN BOLT!', px, py - 18, '#00f2fe');
  }

  private updateStunProjectiles(dt: number) {
    const tileSize = this.world.map.tileSize;

    for (let i = this.stunProjectiles.length - 1; i >= 0; i--) {
      const p = this.stunProjectiles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.lifetime -= dt;

      // Particle trail
      if (Math.random() < 0.6) {
        this.particles.push({
          x: p.x,
          y: p.y,
          vx: (Math.random() - 0.5) * 20,
          vy: (Math.random() - 0.5) * 20,
          color: '#00f2fe',
          size: 3,
          alpha: 0.8,
          life: 0.25,
          maxLife: 0.25,
        });
      }

      let hit = false;

      // Check collision with enemies
      if (this.world.enemies) {
        for (const enemy of this.world.enemies) {
          const ex = enemy.x * tileSize + tileSize / 2;
          const ey = enemy.y * tileSize + tileSize / 2;
          if (Math.hypot(p.x - ex, p.y - ey) < tileSize * 0.75) {
            // STUN ENEMY (NOT KILL!)
            enemy.isStunned = true;
            enemy.stunTime = 4.0;
            enemy.isAlert = false;
            enemy.aggroTimer = 0;
            sound.playStun();
            this.state.screenShake = 0.3;

            this.spawnBurstParticles(ex, ey, '#00f2fe');
            this.spawnBurstParticles(ex, ey, '#f59e0b');
            this.addFloatingText('💫 STUNNED (4s)!', ex, ey - 20, '#f59e0b');
            hit = true;
            break;
          }
        }
      }

      // Check collision with walls
      if (this.checkCollision(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2)) {
        this.spawnBurstParticles(p.x, p.y, '#00f2fe');
        hit = true;
      }

      if (hit || p.lifetime <= 0) {
        this.stunProjectiles.splice(i, 1);
      }
    }
  }

  private updateCamera() {
    const tileSize = this.world.map.tileSize;
    const mapW = this.world.map.width * tileSize;
    const mapH = this.world.map.height * tileSize;

    const px = this.state.player.x + this.state.player.width / 2;
    const py = this.state.player.y + this.state.player.height / 2;

    let targetX = px - this.canvas.width / 2;
    let targetY = py - this.canvas.height / 2;

    // Shake offset
    if (this.state.screenShake > 0) {
      const shakeMagnitude = this.state.screenShake * 9;
      targetX += (Math.random() - 0.5) * shakeMagnitude;
      targetY += (Math.random() - 0.5) * shakeMagnitude;
    }

    // Clamp camera within map bounds
    this.camera.x = Math.max(0, Math.min(targetX, Math.max(0, mapW - this.canvas.width)));
    this.camera.y = Math.max(0, Math.min(targetY, Math.max(0, mapH - this.canvas.height)));
  }

  private updateEnemies(dt: number) {
    if (!this.world.enemies || this.world.enemies.length === 0) return;

    const tileSize = this.world.map.tileSize;
    const px = this.state.player.x + this.state.player.width / 2;
    const py = this.state.player.y + this.state.player.height / 2;

    const diffKey = (this.world.difficulty || 'medium').toLowerCase();
    const diff = DIFFICULTY_PROFILES[diffKey] || DIFFICULTY_PROFILES['medium'];

    // Stealth cuts detection range significantly (65% reduction!)
    const stealthFactor = this.state.isStealth ? 0.35 : 1.0;

    for (const enemy of this.world.enemies) {
      if (enemy.startX === undefined) enemy.startX = enemy.x;
      if (enemy.startY === undefined) enemy.startY = enemy.y;
      if (enemy.direction === undefined) enemy.direction = 1;
      if (enemy.aggroTimer === undefined) enemy.aggroTimer = 0;
      if (enemy.burstTimer === undefined) enemy.burstTimer = 0;

      // Update stun countdown
      if (enemy.stunTime && enemy.stunTime > 0) {
        enemy.stunTime -= dt;
        enemy.aggroTimer = 0;
        enemy.isAlert = false;
        if (enemy.stunTime <= 0) {
          enemy.isStunned = false;
          const ex = enemy.x * tileSize + tileSize / 2;
          const ey = enemy.y * tileSize + tileSize / 2;
          this.addFloatingText('⚡ RECOVERED!', ex, ey - 18, '#94a3b8');
        }
        // When stunned, enemy is completely frozen! No movement, no attacks!
        continue;
      }

      const ex = enemy.x * tileSize + tileSize / 2;
      const ey = enemy.y * tileSize + tileSize / 2;
      const distToPlayer = Math.hypot(px - ex, py - ey);

      // Detection calculation scaled by difficulty vision multiplier
      const baseDetect = enemy.detectionRadius || (enemy.type === 'exit_guardian' ? 6.5 : (enemy.type === 'chaser' ? 5.5 : 4.5));
      const detectRange = baseDetect * diff.detectRangeMult * tileSize * stealthFactor;
      const inDirectVision = distToPlayer < detectRange;

      // 1. Hostile Alert Trigger & Swarm / Pack Beacon
      if (inDirectVision) {
        if (!enemy.isAlert || (enemy.aggroTimer || 0) <= 0) {
          enemy.isAlert = true;
          enemy.aggroTimer = diff.aggroDuration; // Scaled to difficulty!
          enemy.lastKnownX = px;
          enemy.lastKnownY = py;
          sound.playAlert();
          this.state.screenShake = 0.45;

          const alertIcon = enemy.type === 'exit_guardian' ? '👑 BOSS' : (enemy.type === 'chaser' ? '🐺 HUNTER' : '📡 SENTRY');
          this.addFloatingText(`🚨 ${alertIcon} TARGET LOCKED!`, ex, ey - 22, '#ff0844');

          // Pack Hostility: Alert nearby allies within difficulty pack radius
          for (const ally of this.world.enemies) {
            if (ally !== enemy && !ally.isStunned && (!ally.aggroTimer || ally.aggroTimer <= 0)) {
              const ax = ally.x * tileSize + tileSize / 2;
              const ay = ally.y * tileSize + tileSize / 2;
              if (Math.hypot(ax - ex, ay - ey) < tileSize * diff.packAlertRadius) {
                ally.isAlert = true;
                ally.aggroTimer = diff.aggroDuration * 0.85;
                ally.lastKnownX = px;
                ally.lastKnownY = py;
                this.addFloatingText('⚠️ REINFORCING!', ax, ay - 18, '#f59e0b');
              }
            }
          }
        } else {
          // Keep persistence refreshed while in vision
          enemy.aggroTimer = diff.aggroDuration;
          enemy.lastKnownX = px;
          enemy.lastKnownY = py;
        }
      }

      // 2. Persistent Pursuit Movement State Machine
      const isAggro = (enemy.aggroTimer || 0) > 0;

      if (isAggro) {
        // Player broke direct vision / ran away: persistence timer counts down
        if (!inDirectVision) {
          if (this.state.isStealth) {
            // Stealth rapidly drops enemy aggro (scaled counterplay)
            enemy.aggroTimer = (enemy.aggroTimer || 0) - dt * diff.stealthEvadeRate;
            if (enemy.aggroTimer <= 0) {
              enemy.isAlert = false;
              enemy.aggroTimer = 0;
              this.addFloatingText('💨 EVADED PURSUIT!', px, py - 20, '#a855f7');
            }
          } else {
            enemy.aggroTimer = (enemy.aggroTimer || 0) - dt;
            if (enemy.aggroTimer <= 0) {
              enemy.isAlert = false;
              enemy.aggroTimer = 0;
              this.addFloatingText('❓ SEARCH ABANDONED', ex, ey - 18, '#94a3b8');
            }
          }

          // Leash check: If enemy chased too far from post while out of vision, retreat!
          const spawnX = (enemy.startX ?? enemy.x) * tileSize + tileSize / 2;
          const spawnY = (enemy.startY ?? enemy.y) * tileSize + tileSize / 2;
          const distFromSpawn = Math.hypot(spawnX - ex, spawnY - ey);
          if (distFromSpawn > diff.leashDistance * tileSize) {
            enemy.aggroTimer = 0;
            enemy.isAlert = false;
            this.addFloatingText('↩ RETURNING TO POST', ex, ey - 18, '#94a3b8');
          }
        }

        // Pursue Target: Player if in direct vision, else last known position!
        const targetX = inDirectVision ? px : (enemy.lastKnownX ?? px);
        const targetY = inDirectVision ? py : (enemy.lastKnownY ?? py);
        const dirX = targetX - ex;
        const dirY = targetY - ey;
        const distToTarget = Math.hypot(dirX, dirY);

        if (distToTarget > 6) {
          // Hostile Speed Calculation with bursts & difficulty scaling
          const baseSpeed = enemy.speed || (enemy.type === 'exit_guardian' ? 1.5 : (enemy.type === 'chaser' ? 1.45 : 1.3));
          let hostileMult = (enemy.type === 'exit_guardian' ? 1.4 : (enemy.type === 'chaser' ? 1.3 : 1.2)) * diff.speedMultiplier;

          // Periodic burst sprint
          enemy.burstTimer = (enemy.burstTimer || 0) + dt;
          if (enemy.burstTimer > diff.burstInterval && distToPlayer < tileSize * 4.5) {
            hostileMult *= diff.burstSpeedMult;
            if (enemy.burstTimer > diff.burstInterval + 0.6) {
              enemy.burstTimer = 0;
            }
          }

          const moveDist = baseSpeed * hostileMult * dt;
          const stepX = (dirX / distToTarget) * moveDist;
          const stepY = (dirY / distToTarget) * moveDist;

          // Wall-sliding navigation so enemies do not get stuck on corners
          const enemyW = tileSize * 0.6;
          const enemyH = tileSize * 0.6;
          const canMove = (testTileX: number, testTileY: number) => {
            const testPx = testTileX * tileSize + (tileSize - enemyW) / 2;
            const testPy = testTileY * tileSize + (tileSize - enemyH) / 2;
            return !this.checkCollision(testPx, testPy, enemyW, enemyH);
          };

          const newTileX = enemy.x + stepX;
          const newTileY = enemy.y + stepY;

          if (canMove(newTileX, newTileY)) {
            enemy.x = newTileX;
            enemy.y = newTileY;
          } else if (canMove(newTileX, enemy.y)) {
            enemy.x = newTileX;
          } else if (canMove(enemy.x, newTileY)) {
            enemy.y = newTileY;
          } else {
            // Fallback sliding
            enemy.x += stepX * 0.5;
            enemy.y += stepY * 0.5;
          }
        }
      } else {
        // 3. Calm Patrol State (Unalerted)
        enemy.isAlert = false;
        if (enemy.type === 'exit_guardian') {
          // Sweep around exit portal
          enemy.x += (enemy.speed || 1.3) * 0.7 * enemy.direction * dt;
          if (Math.abs(enemy.x - (enemy.startX ?? enemy.x)) >= (enemy.patrolRange || 3)) {
            enemy.direction *= -1;
          }
        } else if (enemy.type === 'chaser') {
          // Prowl territory
          enemy.x += (enemy.speed || 1.2) * 0.85 * enemy.direction * dt;
          if (Math.abs(enemy.x - (enemy.startX ?? enemy.x)) >= (enemy.patrolRange || 5)) {
            enemy.direction *= -1;
          }
        } else {
          // Corridor / Sentry Patrol along assigned axis
          const moveSpeed = (enemy.speed || 1.15) * enemy.direction * dt;
          if (enemy.patrolAxis === 'y') {
            enemy.y += moveSpeed;
            if (Math.abs(enemy.y - (enemy.startY ?? enemy.y)) >= (enemy.patrolRange || 4)) {
              enemy.direction *= -1;
            }
          } else {
            enemy.x += moveSpeed;
            if (Math.abs(enemy.x - (enemy.startX ?? enemy.x)) >= (enemy.patrolRange || 4)) {
              enemy.direction *= -1;
            }
          }
        }
      }

      // 4. Collision with Player (Damage & Health)
      const updatedEx = enemy.x * tileSize + tileSize / 2;
      const updatedEy = enemy.y * tileSize + tileSize / 2;
      const hitDist = Math.hypot(px - updatedEx, py - updatedEy);

      if (hitDist < tileSize * 0.68 && !enemy.isStunned) {
        if (!this.state.player.invincibleTime || this.state.player.invincibleTime <= 0) {
          this.state.player.invincibleTime = 1.6;
          this.state.health = Math.max(0, this.state.health - 1);
          this.state.screenShake = 0.85;
          sound.playBump();

          const hitLabel = enemy.type === 'exit_guardian' ? '💥 GUARDIAN SMASH! -1 LIFE' : '💔 -1 LIFE!';
          this.addFloatingText(hitLabel, px, py - 18, '#ff0844');
          this.spawnBurstParticles(px, py, '#ff0844');

          if (this.state.health <= 0) {
            const reason = enemy.type === 'exit_guardian'
              ? `Intercepted by ${enemy.name}!`
              : `Eliminated by hostile pursuit (${enemy.name})!`;
            this.triggerGameOver(reason);
            return;
          }
        }
      }
    }
  }

  private checkCollision(x: number, y: number, w: number, h: number): boolean {
    const tileSize = this.world.map.tileSize;
    const mapW = this.world.map.width * tileSize;
    const mapH = this.world.map.height * tileSize;

    // 1. Map Outer Bounds
    if (x < 0 || y < 0 || x + w > mapW || y + h > mapH) {
      return true;
    }

    const px = x + 4;
    const py = y + 8;
    const pw = w - 8;
    const ph = h - 10;

    // 2. Walls Collision
    for (const wall of this.world.walls) {
      const wx = wall.x * tileSize;
      const wy = wall.y * tileSize;
      const ww = wall.width * tileSize;
      const wh = wall.height * tileSize;

      if (px < wx + ww && px + pw > wx && py < wy + wh && py + ph > wy) {
        return true;
      }
    }

    // 3. Obstacles Collision
    for (const obj of this.world.objects) {
      if (obj.type === 'obstacle') {
        const ox = obj.x * tileSize;
        const oy = obj.y * tileSize;
        const ow = obj.width * tileSize;
        const oh = obj.height * tileSize;

        if (px < ox + ow && px + pw > ox && py < oy + oh && py + ph > oy) {
          return true;
        }
      }
    }

    return false;
  }

  private checkCollectibles() {
    const tileSize = this.world.map.tileSize;
    const px = this.state.player.x + this.state.player.width / 2;
    const py = this.state.player.y + this.state.player.height / 2;

    for (const c of this.world.collectibles) {
      if (c.collected) continue;

      const cx = c.x * tileSize + tileSize / 2;
      const cy = c.y * tileSize + tileSize / 2;
      const dist = Math.hypot(px - cx, py - cy);

      if (dist < tileSize * 0.7) {
        c.collected = true;
        this.state.collectedItems[c.id] = (this.state.collectedItems[c.id] || 0) + 1;

        // Combo system
        this.state.comboCount = (this.state.comboCount || 0) + 1;
        this.state.comboTimer = 2.8;

        // Rebalanced scarce point values: Key=20, Star=15, Common Shard/Orb=10
        const isKey = c.type === 'key' || c.id.includes('key');
        const defaultVal = isKey ? 20 : (c.type === 'star' ? 15 : 10);
        let baseVal = c.value ?? defaultVal;
        if (baseVal > 20 && isKey) baseVal = 20;
        if (baseVal > 15 && c.type === 'star') baseVal = 15;
        if (baseVal > 10 && !isKey && c.type !== 'star') baseVal = 10;

        // Controlled combo bonus: +1 point per combo tier above 1, capped at +3 pts
        const comboTier = Math.max(1, this.state.comboCount);
        const comboBonus = Math.min(3, comboTier - 1);
        const totalVal = baseVal + comboBonus;

        this.state.score += totalVal;
        this.state.levelScore += totalVal;

        // Bank collectible into persistent gem wallet!
        addGems(isKey ? 5 : (c.type === 'star' ? 3 : 1));

        if (isKey) {
          sound.playKey();
          this.addFloatingText(`🔑 KEY FOUND! +${totalVal}`, cx, cy - 10, '#f6d365');
        } else {
          sound.playCoinCollect();
          if (comboTier > 1) {
            this.addFloatingText(`🔥 x${comboTier} COMBO! +${totalVal}`, cx, cy - 12, '#ff9800');
          } else {
            this.addFloatingText(`+${totalVal}`, cx, cy - 10, '#00f2fe');
          }
        }

        this.spawnBurstParticles(cx, cy, isKey ? '#ffd700' : '#00f2fe');
      }
    }
  }

  private checkExitUnlockState() {
    const required = this.world.objective.requiredItems || [];
    const hasAllItems = required.every(
      (itemId) => (this.state.collectedItems[itemId] || 0) > 0
    );
    const reqScore = this.world.objective.requiredScore || 0;
    const hasReqScore = (this.state.levelScore !== undefined ? this.state.levelScore : this.state.score) >= reqScore;

    const reqTerminals = this.world.objective.requiredTerminals || [];
    const hasAllTerminals = reqTerminals.every((termId) => !!this.state.hackedTerminals[termId]);

    const isUnlocked = hasAllItems && hasReqScore && hasAllTerminals;

    if (isUnlocked && !this.isExitUnlocked) {
      this.isExitUnlocked = true;
      sound.playExitOpen();

      const tileSize = this.world.map.tileSize;
      const ex = this.world.exit.x * tileSize + tileSize / 2;
      const ey = this.world.exit.y * tileSize + tileSize / 2;
      this.spawnBurstParticles(ex, ey, '#43e97b');
      this.spawnBurstParticles(ex, ey, '#f59e0b');
      this.addFloatingText('🔓 EXIT DOOR UNLOCKED! ESCAPE NOW!', ex, ey - 24, '#43e97b');

      const px = this.state.player.x + this.state.player.width / 2;
      const py = this.state.player.y + this.state.player.height / 2;
      this.addFloatingText('🔓 EXIT UNLOCKED!', px, py - 20, '#43e97b');
    }
  }

  private checkExit() {
    const tileSize = this.world.map.tileSize;
    const px = this.state.player.x + this.state.player.width / 2;
    const py = this.state.player.y + this.state.player.height / 2;

    const ex = this.world.exit.x * tileSize + tileSize / 2;
    const ey = this.world.exit.y * tileSize + tileSize / 2;
    const dist = Math.hypot(px - ex, py - ey);

    if (dist < tileSize * 0.75) {
      // Check objective requirements
      const required = this.world.objective.requiredItems || [];
      const hasAllItems = required.every(
        (itemId) => (this.state.collectedItems[itemId] || 0) > 0
      );
      const reqScore = this.world.objective.requiredScore || 0;
      const hasReqScore = (this.state.levelScore !== undefined ? this.state.levelScore : this.state.score) >= reqScore;

      const reqTerminals = this.world.objective.requiredTerminals || [];
      const hasAllTerminals = reqTerminals.every((termId) => !!this.state.hackedTerminals[termId]);

      if (hasAllItems && hasReqScore && hasAllTerminals) {
        if (this.state.currentLevel < this.state.maxLevels) {
          this.advanceToNextLevel();
        } else {
          this.triggerWin();
        }
      } else {
        const now = performance.now();
        if (now - this.lastExitWarningTime > 1600) {
          this.lastExitWarningTime = now;
          sound.playBump();
          if (!hasAllItems) {
            this.addFloatingText('🔒 LOCKED! FIND SECTOR KEY', ex, ey - 16, '#ff0844');
          } else if (!hasAllTerminals) {
            this.addFloatingText('🔒 OVERRIDE FIREWALL TERMINAL FIRST!', ex, ey - 16, '#00f2fe');
          } else if (!hasReqScore) {
            this.addFloatingText(`🔒 NEED ${reqScore} PTS! (${this.state.levelScore}/${reqScore})`, ex, ey - 16, '#ff9800');
          }
        }
      }
    }
  }

  private advanceToNextLevel() {
    const nextLvlNum = this.state.currentLevel + 1;
    let nextWorld: GameWorld | null = null;

    if (this.world.levels && this.world.levels.length >= nextLvlNum) {
      nextWorld = JSON.parse(JSON.stringify(this.world.levels[nextLvlNum - 1]));
    }

    // Level clear bonus!
    const levelBonus = 150;
    const timeBonus = Math.floor(this.state.timeLeft) * 2;
    this.state.score += levelBonus + timeBonus;

    // Bank bonus gems!
    addGems(25);

    sound.playWin();

    const ex = this.world.exit.x * this.world.map.tileSize + this.world.map.tileSize / 2;
    const ey = this.world.exit.y * this.world.map.tileSize + this.world.map.tileSize / 2;
    this.spawnBurstParticles(ex, ey, '#43e97b');
    this.spawnBurstParticles(ex, ey, '#00f2fe');
    this.addFloatingText(`⭐ LEVEL ${this.state.currentLevel} CLEAR! +${levelBonus + timeBonus} PTS ⭐`, ex, ey - 25, '#43e97b');

    if (nextWorld) {
      const campaignLevels = this.world.levels;
      this.world = nextWorld;
      this.world.levels = campaignLevels;

      const tileSize = this.world.map.tileSize;
      const playerWidth = tileSize * 0.7;
      const playerHeight = tileSize * 0.7;

      this.state.player.x = this.world.player.x * tileSize + (tileSize - playerWidth) / 2;
      this.state.player.y = this.world.player.y * tileSize + (tileSize - playerHeight) / 2;
      this.state.player.width = playerWidth;
      this.state.player.height = playerHeight;
      this.state.player.invincibleTime = 2.5;

      this.elapsedSeconds = 0;
      this.state.timeLeft = this.world.timeLimit || 110;
      this.state.levelScore = 0;
      this.state.collectedItems = {};
      this.state.hackedTerminals = {};
      this.state.currentLevel = nextLvlNum;
      this.state.nearbyInteractable = null;
      this.state.stunAmmo = this.state.maxStunAmmo;
      this.isExitUnlocked = false;

      // Lives reset for every level
      const levelStartingHealth = this.getStartingHealthForWorld(this.world);
      this.state.health = levelStartingHealth;
      this.state.maxHealth = levelStartingHealth;

      this.updateCamera();
      const px = this.state.player.x + playerWidth / 2;
      const py = this.state.player.y + playerHeight / 2;
      this.addFloatingText(`🚀 LEVEL ${nextLvlNum} / ${this.state.maxLevels}: ${this.world.title}`, px, py - 30, '#00f2fe');
      this.addFloatingText(`❤️ LIVES RESTORED! (${levelStartingHealth}/${levelStartingHealth})`, px, py - 48, '#ff007f');
      this.spawnBurstParticles(px, py, '#ff007f');

      if (this.world.npcs && this.world.npcs.length > 0) {
        const npc = this.world.npcs[0];
        this.state.activeDialogue = {
          title: npc.name,
          text: npc.dialogue,
        };
      }
      sound.startBGM(this.world.map?.theme || 'default');
    } else {
      this.triggerWin();
    }

    this.notifyState();
  }

  private checkInteractions() {
    const tileSize = this.world.map.tileSize;
    const px = this.state.player.x + this.state.player.width / 2;
    const py = this.state.player.y + this.state.player.height / 2;
    const interactDist = tileSize * 1.35;

    let foundInteractable: EngineState['nearbyInteractable'] = null;

    // 1. Check Sneak Takedown (unaware enemy within range)
    if (this.world.enemies) {
      for (const enemy of this.world.enemies) {
        if (enemy.isStunned) continue;
        const ex = enemy.x * tileSize + tileSize / 2;
        const ey = enemy.y * tileSize + tileSize / 2;
        const dist = Math.hypot(px - ex, py - ey);

        if (dist < interactDist && !enemy.isAlert) {
          foundInteractable = {
            type: 'sneak_takedown',
            entity: enemy,
            prompt: `Press E: Sneak Takedown (Stun ${enemy.name})`,
          };
          this.state.canSneakTakedown = enemy;
          break;
        }
      }
    }

    if (!foundInteractable) {
      this.state.canSneakTakedown = null;
    }

    // 2. Check NPCs
    if (!foundInteractable && this.world.npcs) {
      for (const npc of this.world.npcs) {
        const nx = npc.x * tileSize + tileSize / 2;
        const ny = npc.y * tileSize + tileSize / 2;
        if (Math.hypot(px - nx, py - ny) < interactDist) {
          foundInteractable = {
            type: 'npc',
            entity: npc,
            prompt: `Talk to ${npc.name}`,
          };
          break;
        }
      }
    }

    // 3. Check Interactive Objects
    if (!foundInteractable) {
      for (const obj of this.world.objects) {
        if (obj.type === 'interactive') {
          const ox = obj.x * tileSize + (obj.width * tileSize) / 2;
          const oy = obj.y * tileSize + (obj.height * tileSize) / 2;
          if (Math.hypot(px - ox, py - oy) < interactDist) {
            const isTerm = obj.id.includes('terminal') || obj.id.includes('term');
            const isHacked = this.state.hackedTerminals[obj.id];
            foundInteractable = {
              type: isTerm ? 'terminal' : 'object',
              entity: obj,
              prompt: isTerm
                ? (isHacked ? '✅ Firewall Overridden' : 'Press E: Hack Terminal')
                : `Inspect ${obj.name}`,
            };
            break;
          }
        }
      }
    }

    this.state.nearbyInteractable = foundInteractable;

    // Check if player pressed 'E' / Enter
    if (foundInteractable && this.input.isInteractJustPressed()) {
      if (foundInteractable.type === 'sneak_takedown') {
        const enemy = foundInteractable.entity as Enemy;
        enemy.isStunned = true;
        enemy.stunTime = 6.0; // 6 seconds takedown stun
        enemy.isAlert = false;
        enemy.aggroTimer = 0;
        sound.playSneakTakedown();

        const ex = enemy.x * tileSize + tileSize / 2;
        const ey = enemy.y * tileSize + tileSize / 2;
        this.spawnBurstParticles(ex, ey, '#c084fc');
        this.addFloatingText('🤫 SNEAK TAKEDOWN! 💫 STUNNED (6s)', ex, ey - 22, '#c084fc');
        addGems(5);
      } else if (foundInteractable.type === 'npc') {
        const npc = foundInteractable.entity as NPC;
        sound.playDialogue();
        this.state.activeDialogue = {
          title: npc.name,
          text: npc.dialogue,
        };
      } else if (foundInteractable.type === 'terminal' || (foundInteractable.entity as GameObject).id.includes('term')) {
        const obj = foundInteractable.entity as GameObject;
        if (!this.state.hackedTerminals[obj.id]) {
          this.state.hackedTerminals[obj.id] = true;
          sound.playHack();
          const bonus = 50;
          this.state.score += bonus;
          this.state.levelScore += bonus;
          this.addFloatingText('🔓 FIREWALL OVERRIDDEN! +50 PTS', obj.x * tileSize + tileSize, obj.y * tileSize - 10, '#43e97b');
          this.spawnBurstParticles(obj.x * tileSize + tileSize, obj.y * tileSize, '#00f2fe');
          addGems(10);
        } else {
          sound.playDialogue();
          this.state.activeDialogue = {
            title: obj.name,
            text: 'System status: SECURITY PROTOCOL DECRYPTED. Firewall is offline.',
          };
        }
      } else if (foundInteractable.type === 'object') {
        const obj = foundInteractable.entity as GameObject;
        sound.playDialogue();
        this.state.activeDialogue = {
          title: obj.name,
          text: obj.description || `You inspected the ${obj.name}. Nothing unusual.`,
        };
      }
    }
  }

  private triggerWin() {
    this.state.isWon = true;
    sound.playWin();
    // Bank victory bonus gems!
    addGems(100);
    this.notifyState();
    if (this.onWin) {
      this.onWin(this.state.score, Math.round(this.state.timeLeft));
    }
  }

  private triggerGameOver(reason: string) {
    this.state.isGameOver = true;
    sound.playLose();
    (this.state as any).gameOverReason = reason;
    this.notifyState();
    if (this.onLose) {
      this.onLose(reason, this.state.score);
    }
  }

  public resize(width: number, height: number) {
    this.canvas.width = width;
    this.canvas.height = height;
    const ctx = this.canvas.getContext('2d');
    if (ctx) {
      this.renderer = new CanvasRenderer(ctx, width, height);
    }
  }

  public dismissDialogue() {
    this.state.activeDialogue = null;
    this.notifyState();
  }

  private notifyState() {
    if (this.onStateChange) {
      this.onStateChange({ ...this.state });
    }
  }

  private spawnBurstParticles(x: number, y: number, color: string) {
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.5;
      const speed = 40 + Math.random() * 80;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        size: 3 + Math.random() * 3,
        alpha: 1,
        life: 0.45 + Math.random() * 0.25,
        maxLife: 0.7,
      });
    }
  }

  private addFloatingText(text: string, x: number, y: number, color: string) {
    this.floatingTexts.push({
      id: `text_${this.nextTextId++}`,
      text,
      x,
      y,
      color,
      alpha: 1,
      vy: -28,
      lifetime: 1.1,
    });
  }

  private updateParticlesAndTexts(dt: number) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.life -= dt;
      p.alpha = Math.max(0, p.life / p.maxLife);
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    for (let i = this.floatingTexts.length - 1; i >= 0; i--) {
      const ft = this.floatingTexts[i];
      ft.y += ft.vy * dt;
      ft.lifetime -= dt;
      ft.alpha = Math.max(0, ft.lifetime / 1.1);
      if (ft.lifetime <= 0) {
        this.floatingTexts.splice(i, 1);
      }
    }
  }
}
