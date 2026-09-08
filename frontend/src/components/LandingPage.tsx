import React, { useEffect, useRef, useState } from 'react';
import { Camera, Gamepad2, Sparkles, Zap, Play, Shield, Compass, Shirt, Terminal, Cpu, Binary, RefreshCw } from 'lucide-react';
import {
  ALL_DEMO_GAMES,
  DEMO_HAUNTED,
  DEMO_HOSPITAL,
  DEMO_RAILWAY,
  DEMO_POLICE,
  DEMO_SNOW,
  DEMO_BANK,
  DEMO_KITCHEN,
  DEMO_AIRPORT,
  DEMO_CYBER,
  DEMO_CLASSROOM,
  DEMO_VOLCANO,
  DEMO_DESERT,
} from '../demoGames';
import { RECOMMENDATIONS, RecommendationItem } from '../data/recommendations';
import { GameWorld } from '../types/game';
import { getGemBalance } from '../types/avatar';
import { SpiralBlackHole } from './SpiralBlackHole';
import { MatrixRainCanvas } from './MatrixRainCanvas';
import { sound } from '../engine/sound';

const DEMO_MAP: Record<string, GameWorld> = {
  DEMO_HOSPITAL,
  DEMO_RAILWAY,
  DEMO_POLICE,
  DEMO_SNOW,
  DEMO_BANK,
  DEMO_KITCHEN,
  DEMO_AIRPORT,
  DEMO_CYBER,
  DEMO_HAUNTED,
  DEMO_CLASSROOM,
  DEMO_VOLCANO,
  DEMO_DESERT,
};

interface LandingPageProps {
  onCreateGame: () => void;
  onPlayDemo: (game: GameWorld) => void;
  onCreateWithPreset?: (rec: RecommendationItem) => void;
  onOpenShop?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onCreateGame, onPlayDemo, onCreateWithPreset, onOpenShop }) => {
  const miniCanvasRef = useRef<HTMLCanvasElement>(null);
  const [gemCount, setGemCount] = useState<number>(0);
  const [isHackerMode, setIsHackerMode] = useState<boolean>(false);
  const [warpPhase, setWarpPhase] = useState<'idle' | 'suction' | 'unfolding'>('idle');
  const [showFlash, setShowFlash] = useState<boolean>(false);

  useEffect(() => {
    setGemCount(getGemBalance());
  }, []);

  const handleSingularityTrigger = () => {
    if (warpPhase !== 'idle') return;

    // Phase 1: Begin liquid toilet flush spiral vortex suction
    setWarpPhase('suction');
    sound.playBlackHoleSuction();

    // Trigger radiant singularity flash just as the whirlpool collapses into the drain
    const flashTimer = setTimeout(() => {
      setShowFlash(true);
    }, 1250);

    // Phase 2: At total drain collapse point, swap theme and emerge from vortex
    const unfoldTimer = setTimeout(() => {
      setIsHackerMode((prev) => !prev);
      setWarpPhase('unfolding');
      sound.playHackerMatrix();
    }, 1450);

    // Hide flash overlay
    const hideFlashTimer = setTimeout(() => {
      setShowFlash(false);
    }, 1750);

    // Phase 3: Complete emerge transition
    const idleTimer = setTimeout(() => {
      setWarpPhase('idle');
    }, 2450);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(unfoldTimer);
      clearTimeout(hideFlashTimer);
      clearTimeout(idleTimer);
    };
  };

  // Animated miniature canvas preview (Enlarged 560x280 live engine showcase)
  useEffect(() => {
    const canvas = miniCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    // Waypoints for smooth character traversal across the 560x280 level
    const waypoints = [
      { x: 65, y: 215 },
      { x: 140, y: 90 },
      { x: 230, y: 155 },
      { x: 310, y: 220 },
      { x: 440, y: 195 },
      { x: 505, y: 135 },
      { x: 390, y: 80 },
    ];
    let wpIndex = 0;
    let charX = waypoints[0].x;
    let charY = waypoints[0].y;
    let facingLeft = false;

    // Sentry drone patrol
    let droneX = 350;
    let droneDir = 1;

    // Dust particles for footsteps
    const particles: { x: number; y: number; alpha: number; radius: number }[] = [];

    const renderMini = () => {
      t += 0.035;
      const w = canvas.width;  // 560
      const h = canvas.height; // 280
      ctx.clearRect(0, 0, w, h);

      // 1. Grid Floor Tiles (20 cols x 10 rows, 28px each)
      const tileSize = 28;
      const cols = 20;
      const rows = 10;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (isHackerMode) {
            ctx.fillStyle = (r + c) % 2 === 0 ? '#04180e' : '#020e07';
          } else {
            ctx.fillStyle = (r + c) % 2 === 0 ? '#111728' : '#0b101e';
          }
          ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);

          // Subtle tech grid dots at intersections
          if (r > 0 && c > 0 && (r + c) % 3 === 0) {
            ctx.fillStyle = isHackerMode ? 'rgba(0, 255, 102, 0.08)' : 'rgba(0, 242, 254, 0.06)';
            ctx.fillRect(c * tileSize - 1, r * tileSize - 1, 2, 2);
          }
        }
      }

      // 2. High-Tech Perimeter Walls
      const wallThickness = 8;
      ctx.fillStyle = isHackerMode ? '#003318' : '#1e293b';
      ctx.fillRect(0, 0, w, wallThickness);
      ctx.fillRect(0, h - wallThickness, w, wallThickness);
      ctx.fillRect(0, 0, wallThickness, h);
      ctx.fillRect(w - wallThickness, 0, wallThickness, h);

      // Neon Wall Inset Accent Lines
      ctx.strokeStyle = isHackerMode ? 'rgba(0, 255, 102, 0.35)' : 'rgba(0, 242, 254, 0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(wallThickness + 0.5, wallThickness + 0.5, w - wallThickness * 2 - 1, h - wallThickness * 2 - 1);

      // 3. Central Mainframe / Terminal Server Racks (x: 180, y: 55, w: 90, h: 48)
      ctx.fillStyle = isHackerMode ? '#002613' : '#1e1b4b';
      ctx.fillRect(180, 55, 88, 46);
      ctx.strokeStyle = isHackerMode ? '#00ff66' : '#6366f1';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(180, 55, 88, 46);

      // Server rack screens & blinking LED status diodes
      ctx.fillStyle = isHackerMode ? '#001a0d' : '#0f172a';
      ctx.fillRect(186, 62, 40, 32);
      ctx.fillStyle = isHackerMode ? '#00ff66' : '#00f2fe';
      ctx.font = '7px monospace';
      ctx.fillText('>SYS_OK', 189, 74);
      ctx.fillText(' 99.8%', 189, 85);

      // Blinking LEDs
      const ledColors = [
        Math.sin(t * 8) > 0 ? '#00ff66' : '#00441a',
        Math.sin(t * 12 + 1) > 0 ? '#00f2fe' : '#003344',
        Math.sin(t * 6 + 2) > 0 ? '#ffd700' : '#443300',
        Math.sin(t * 10 + 3) > 0 ? '#ff0055' : '#330011',
      ];
      ledColors.forEach((col, idx) => {
        ctx.fillStyle = col;
        ctx.beginPath();
        ctx.arc(238 + (idx % 2) * 14, 68 + Math.floor(idx / 2) * 16, 3, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Laser Security Gate Barrier (x: 310, y: 50, w: 10, h: 70)
      ctx.fillStyle = isHackerMode ? '#00381b' : '#334155';
      ctx.fillRect(310, 50, 10, 12);
      ctx.fillRect(310, 108, 10, 12);
      const laserAlpha = 0.4 + Math.sin(t * 10) * 0.3;
      ctx.strokeStyle = isHackerMode ? `rgba(0, 255, 102, ${laserAlpha})` : `rgba(255, 0, 127, ${laserAlpha})`;
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(315, 62);
      ctx.lineTo(315, 108);
      ctx.stroke();

      // 5. Exit Teleporter Gate (Right side: x: w - 38, y: 110, w: 24, h: 54)
      const exitX = w - 38;
      const exitY = 110;
      const exitPulse = Math.sin(t * 4) * 3;
      ctx.fillStyle = isHackerMode ? '#002a15' : '#0f172a';
      ctx.fillRect(exitX, exitY, 24, 54);
      ctx.strokeStyle = isHackerMode ? '#00ff66' : '#43e97b';
      ctx.lineWidth = 2;
      ctx.strokeRect(exitX, exitY, 24, 54);

      // Swirling portal interior
      const portalGrad = ctx.createRadialGradient(exitX + 12, exitY + 27, 2, exitX + 12, exitY + 27, 20 + exitPulse);
      portalGrad.addColorStop(0, '#ffffff');
      portalGrad.addColorStop(0.4, isHackerMode ? '#00ff66' : '#00f2fe');
      portalGrad.addColorStop(1, isHackerMode ? 'rgba(0, 255, 102, 0.1)' : 'rgba(67, 233, 123, 0.1)');
      ctx.fillStyle = portalGrad;
      ctx.fillRect(exitX + 2, exitY + 2, 20, 50);

      // Portal swirl vortex ring
      ctx.strokeStyle = isHackerMode ? 'rgba(0, 255, 102, 0.8)' : 'rgba(67, 233, 123, 0.8)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.ellipse(exitX + 12, exitY + 27, 6 + Math.sin(t * 6) * 3, 16 + Math.cos(t * 6) * 3, t * 2, 0, Math.PI * 2);
      ctx.stroke();

      // 6. Collectible Items
      // Item A: Floating Cyan/Gold Gem at (110, 85)
      const gemBob = Math.sin(t * 5) * 4;
      ctx.fillStyle = isHackerMode ? '#00f2fe' : '#ffd700';
      ctx.beginPath();
      ctx.moveTo(110, 80 + gemBob);
      ctx.lineTo(116, 88 + gemBob);
      ctx.lineTo(110, 96 + gemBob);
      ctx.lineTo(104, 88 + gemBob);
      ctx.closePath();
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.strokeStyle = isHackerMode ? 'rgba(0, 242, 254, 0.5)' : 'rgba(255, 215, 0, 0.5)';
      ctx.beginPath();
      ctx.arc(110, 88 + gemBob, 10 + Math.sin(t * 7) * 3, 0, Math.PI * 2);
      ctx.stroke();

      // Item B: Cyber Token at (290, 215)
      const tokenBob = Math.sin(t * 4 + 1.5) * 3;
      ctx.fillStyle = isHackerMode ? '#00ff66' : '#a855f7';
      ctx.beginPath();
      ctx.arc(290, 215 + tokenBob, 7, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = '8px monospace';
      ctx.fillText('◈', 286.5, 218 + tokenBob);

      // Item C: Health Medkit at (460, 65)
      const heartBob = Math.sin(t * 4 + 3) * 3;
      ctx.fillStyle = isHackerMode ? '#00ff66' : '#ff0844';
      ctx.fillRect(454, 60 + heartBob, 12, 10);
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(458, 62 + heartBob, 4, 6);
      ctx.fillRect(456, 64 + heartBob, 8, 2);

      // 7. Patrolling Sentry Drone (moves horizontally between 340 and 460 at y: 85)
      droneX += droneDir * 0.8;
      if (droneX > 450) {
        droneDir = -1;
      } else if (droneX < 340) {
        droneDir = 1;
      }
      const droneY = 85 + Math.sin(t * 3) * 3;

      // Sentry Detection Cone
      const coneAngle = droneDir > 0 ? 0 : Math.PI;
      ctx.save();
      ctx.translate(droneX, droneY);
      ctx.rotate(coneAngle);
      const coneGrad = ctx.createRadialGradient(0, 0, 5, 65, 0, 70);
      coneGrad.addColorStop(0, isHackerMode ? 'rgba(0, 255, 102, 0.35)' : 'rgba(255, 8, 68, 0.35)');
      coneGrad.addColorStop(1, 'transparent');
      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, 70, -0.4, 0.4);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Sentry Drone Chassis
      ctx.fillStyle = isHackerMode ? '#003318' : '#334155';
      ctx.beginPath();
      ctx.arc(droneX, droneY, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = isHackerMode ? '#00ff66' : '#ff0844';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Sentry Red Eye
      ctx.fillStyle = isHackerMode ? '#00ff66' : '#ff0844';
      ctx.beginPath();
      ctx.arc(droneX + droneDir * 3, droneY, 3, 0, Math.PI * 2);
      ctx.fill();

      // 8. Player Character Waypoint Navigation
      const currentTarget = waypoints[wpIndex];
      const dx = currentTarget.x - charX;
      const dy = currentTarget.y - charY;
      const dist = Math.hypot(dx, dy);

      if (dist < 8) {
        wpIndex = (wpIndex + 1) % waypoints.length;
      } else {
        const moveSpeed = 1.35;
        charX += (dx / dist) * moveSpeed;
        charY += (dy / dist) * moveSpeed;
        if (dx !== 0) {
          facingLeft = dx < 0;
        }

        // Emit footstep dust particles
        if (Math.random() < 0.25) {
          particles.push({
            x: charX + (Math.random() - 0.5) * 6,
            y: charY + 11,
            alpha: 0.7,
            radius: 2 + Math.random() * 2,
          });
        }
      }

      // Draw footstep dust particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.alpha -= 0.025;
        p.radius += 0.08;
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        } else {
          ctx.fillStyle = isHackerMode ? `rgba(0, 255, 102, ${p.alpha * 0.4})` : `rgba(255, 255, 255, ${p.alpha * 0.3})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      const walkBob = Math.sin(t * 11) * 2.5;

      // Character Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.beginPath();
      ctx.ellipse(charX, charY + 12, 9, 3.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Character Body / Suit
      ctx.fillStyle = isHackerMode ? '#00ff66' : '#ff007f';
      ctx.fillRect(charX - 7, charY - 4 + walkBob, 14, 13);
      ctx.strokeStyle = isHackerMode ? '#021e10' : '#5b002d';
      ctx.lineWidth = 1;
      ctx.strokeRect(charX - 7, charY - 4 + walkBob, 14, 13);

      // Character Head / Cyber Helmet
      ctx.fillStyle = isHackerMode ? '#a7f3d0' : '#ffd5b8';
      ctx.beginPath();
      ctx.arc(charX, charY - 10 + walkBob, 7, 0, Math.PI * 2);
      ctx.fill();

      // Character Visor
      ctx.fillStyle = isHackerMode ? '#00331a' : '#00f2fe';
      const visorX = facingLeft ? charX - 6 : charX + 1;
      ctx.fillRect(visorX, charY - 12 + walkBob, 5, 4);

      // 9. Interactive HUD Corner Overlays in Canvas
      ctx.fillStyle = isHackerMode ? 'rgba(0, 255, 102, 0.85)' : 'rgba(0, 242, 254, 0.85)';
      ctx.font = '8px monospace';
      ctx.fillText(`PLAYER POS: [${Math.round(charX)}, ${Math.round(charY)}]`, 16, 22);
      ctx.fillText(`WAYPOINT: ${wpIndex + 1}/${waypoints.length}`, 16, 32);

      ctx.fillStyle = isHackerMode ? 'rgba(0, 255, 102, 0.85)' : 'rgba(255, 215, 0, 0.85)';
      ctx.textAlign = 'right';
      ctx.fillText(`GEMS: 2/2 ◈ KEY: COLLECTED`, w - 16, 22);
      ctx.textAlign = 'left';

      // 10. Scanlines across canvas
      ctx.fillStyle = isHackerMode ? 'rgba(0, 255, 102, 0.05)' : 'rgba(255, 255, 255, 0.03)';
      for (let y = 0; y < h; y += 3) {
        ctx.fillRect(0, y, w, 1);
      }

      animId = requestAnimationFrame(renderMini);
    };

    renderMini();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isHackerMode]);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: isHackerMode
          ? 'radial-gradient(ellipse at 50% 15%, #051a10 0%, #020704 70%)'
          : 'radial-gradient(ellipse at 50% 15%, #18223d 0%, #080a14 70%)',
        color: isHackerMode ? '#e6fffa' : '#ffffff',
        fontFamily: isHackerMode ? '"Share Tech Mono", "Chakra Petch", monospace' : '"Chakra Petch", sans-serif',
        padding: '30px 20px',
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflowX: 'hidden',
        transition: 'background 0.5s ease',
      }}
    >
      <style>{`
        /* Realistic Toilet Flush / Whirlpool Spiral Vortex Suction Animation */
        @keyframes toiletFlushVortex {
          0% {
            transform: perspective(1200px) rotateX(0deg) rotate(0deg) scale(1) skewX(0deg) skewY(0deg);
            filter: blur(0px) contrast(100%);
            opacity: 1;
            border-radius: 0%;
          }
          18% {
            transform: perspective(1200px) rotateX(15deg) rotate(140deg) scale(0.85) skewX(6deg) skewY(3deg);
            filter: blur(1.5px) contrast(115%);
            opacity: 0.98;
            border-radius: 10%;
          }
          40% {
            transform: perspective(1200px) rotateX(32deg) rotate(480deg) scale(0.58) skewX(16deg) skewY(10deg);
            filter: blur(4px) contrast(135%) brightness(1.25);
            opacity: 0.88;
            border-radius: 25%;
          }
          68% {
            transform: perspective(1200px) rotateX(46deg) rotate(1150deg) scale(0.28) skewX(30deg) skewY(20deg);
            filter: blur(8px) contrast(170%) brightness(1.7);
            opacity: 0.7;
            border-radius: 42%;
          }
          86% {
            transform: perspective(1200px) rotateX(56deg) rotate(1850deg) scale(0.08) skewX(45deg) skewY(32deg);
            filter: blur(14px) contrast(210%) brightness(2.4);
            opacity: 0.35;
            border-radius: 50%;
          }
          100% {
            transform: perspective(1200px) rotateX(62deg) rotate(2520deg) scale(0.0001) skewX(60deg) skewY(45deg);
            filter: blur(24px) brightness(3.5);
            opacity: 0;
            border-radius: 50%;
          }
        }

        /* Spiral Vortex Emerge Animation (Reverse whirlpool emergence into dark hacker theme) */
        @keyframes toiletVortexEmerge {
          0% {
            transform: perspective(1200px) rotateX(58deg) rotate(-1800deg) scale(0.0001) skewX(-45deg) skewY(-30deg);
            filter: blur(22px) brightness(3);
            opacity: 0;
            border-radius: 50%;
          }
          38% {
            transform: perspective(1200px) rotateX(28deg) rotate(-450deg) scale(0.68) skewX(-16deg) skewY(-10deg);
            filter: blur(6px) brightness(1.6);
            opacity: 0.78;
            border-radius: 26%;
          }
          72% {
            transform: perspective(1200px) rotateX(10deg) rotate(-60deg) scale(1.04) skewX(-3deg) skewY(-2deg);
            filter: blur(1.5px) brightness(1.2);
            opacity: 0.96;
            border-radius: 8%;
          }
          100% {
            transform: perspective(1200px) rotateX(0deg) rotate(0deg) scale(1) skewX(0deg) skewY(0deg);
            filter: blur(0px) brightness(1);
            opacity: 1;
            border-radius: 0%;
          }
        }

        /* Swirling Liquid Funnel Ring */
        @keyframes liquidFunnelSpin {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) scale(1.3);
            opacity: 0.85;
          }
          50% {
            transform: translate(-50%, -50%) rotate(360deg) scale(0.7);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) rotate(720deg) scale(0.05);
            opacity: 0;
          }
        }

        /* Singularity Event Horizon Flash */
        @keyframes singularityFlash {
          0% { opacity: 0; }
          25% { opacity: 0.98; }
          100% { opacity: 0; }
        }

        .singularity-suction-active {
          transform-origin: 50% 0px !important;
          animation: toiletFlushVortex 1.45s cubic-bezier(0.5, 0.05, 0.75, 0.25) forwards !important;
          pointer-events: none !important;
        }

        .hacker-unfold-active {
          transform-origin: 50% 0px !important;
          animation: toiletVortexEmerge 0.95s cubic-bezier(0.2, 0.7, 0.35, 1) forwards !important;
          pointer-events: none !important;
        }
      `}</style>

      {/* Live Falling Matrix Digital Rain Background (Active in Hacker Mode) */}
      {isHackerMode && <MatrixRainCanvas opacity={0.7} color="#00ff66" fontSize={14} />}

      {/* Swirling Liquid Toilet Flush Vortex Whirlpool Overlay */}
      {warpPhase === 'suction' && (
        <div
          style={{
            position: 'absolute',
            top: '110px',
            left: '50%',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: isHackerMode
              ? 'conic-gradient(from 0deg, transparent 0deg, rgba(0, 255, 102, 0.35) 60deg, transparent 120deg, rgba(0, 242, 254, 0.45) 200deg, transparent 280deg, rgba(255, 255, 255, 0.6) 360deg)'
              : 'conic-gradient(from 0deg, transparent 0deg, rgba(255, 180, 100, 0.4) 60deg, transparent 120deg, rgba(168, 85, 247, 0.5) 200deg, transparent 280deg, rgba(255, 255, 255, 0.7) 360deg)',
            filter: 'blur(10px)',
            animation: 'liquidFunnelSpin 1.4s cubic-bezier(0.4, 0, 0.8, 0.3) forwards',
            pointerEvents: 'none',
            zIndex: 32,
          }}
        />
      )}

      {/* Singularity Implosion White/Cyan/Green Flash Overlay */}
      {showFlash && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: isHackerMode
              ? 'radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 1) 0%, rgba(0, 255, 102, 0.9) 35%, rgba(0, 242, 254, 0.6) 70%, transparent 100%)'
              : 'radial-gradient(circle at 50% 30%, rgba(255, 255, 255, 1) 0%, rgba(200, 180, 255, 0.95) 35%, rgba(168, 85, 247, 0.7) 70%, transparent 100%)',
            zIndex: 9999,
            pointerEvents: 'none',
            animation: 'singularityFlash 0.5s ease-out forwards',
          }}
        />
      )}

      {/* Top Header Bar with Wardrobe, Restore Reality Toggle & Gem Shop Button */}
      <div
        style={{
          width: '100%',
          maxWidth: '1040px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '28px',
          flexWrap: 'wrap',
          gap: '12px',
          zIndex: 20,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: isHackerMode ? 'rgba(0, 255, 102, 0.12)' : 'rgba(0, 242, 254, 0.12)',
            border: isHackerMode ? '1px solid rgba(0, 255, 102, 0.5)' : '1px solid rgba(0, 242, 254, 0.4)',
            padding: '6px 16px',
            borderRadius: '30px',
            color: isHackerMode ? '#00ff66' : '#00f2fe',
            fontSize: '12px',
            fontWeight: 700,
            boxShadow: isHackerMode ? '0 0 20px rgba(0, 255, 102, 0.25)' : '0 0 20px rgba(0, 242, 254, 0.2)',
          }}
        >
          {isHackerMode ? <Terminal size={15} /> : <Sparkles size={15} />}
          <span>{isHackerMode ? '⚡ ROOT@HOLOVERSE_CYBER_MAINFRAME // TERMINAL ACTIVE ⚡' : '◈ HOLOVERSE AI ENGINE ◈'}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {/* Quick Reality Toggle Button */}
          {isHackerMode && (
            <button
              onClick={handleSingularityTrigger}
              disabled={warpPhase !== 'idle'}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                background: 'rgba(0, 255, 102, 0.15)',
                border: '1px solid #00ff66',
                padding: '8px 16px',
                borderRadius: '24px',
                color: '#00ff66',
                fontFamily: '"Press Start 2P", monospace',
                fontSize: '9px',
                cursor: 'pointer',
                boxShadow: '0 0 15px rgba(0, 255, 102, 0.3)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = 'rgba(0, 255, 102, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = 'rgba(0, 255, 102, 0.15)';
              }}
              title="Click to collapse Matrix and return to standard reality"
            >
              <RefreshCw size={12} />
              <span>[RESTORE REALITY]</span>
            </button>
          )}

          {onOpenShop && (
            <button
              onClick={onOpenShop}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: isHackerMode
                  ? 'linear-gradient(135deg, rgba(0, 255, 102, 0.2) 0%, rgba(0, 242, 254, 0.1) 100%)'
                  : 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)',
                border: isHackerMode ? '1px solid rgba(0, 255, 102, 0.6)' : '1px solid rgba(234, 179, 8, 0.6)',
                padding: '8px 18px',
                borderRadius: '24px',
                color: isHackerMode ? '#00ff66' : '#ffd700',
                fontFamily: isHackerMode ? '"Share Tech Mono", monospace' : '"Chakra Petch", sans-serif',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: isHackerMode ? '0 4px 15px rgba(0, 255, 102, 0.25)' : '0 4px 15px rgba(234, 179, 8, 0.25)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = isHackerMode ? '#00ff66' : '#ffd700';
                e.currentTarget.style.boxShadow = isHackerMode
                  ? '0 6px 20px rgba(0, 255, 102, 0.4)'
                  : '0 6px 20px rgba(234, 179, 8, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = isHackerMode ? 'rgba(0, 255, 102, 0.6)' : 'rgba(234, 179, 8, 0.6)';
                e.currentTarget.style.boxShadow = isHackerMode
                  ? '0 4px 15px rgba(0, 255, 102, 0.25)'
                  : '0 4px 15px rgba(234, 179, 8, 0.25)';
              }}
            >
              <span>{isHackerMode ? `💎 ${gemCount} CYBER-TOKENS` : `💎 ${gemCount} GEMS`}</span>
              <span style={{ color: '#64748b' }}>|</span>
              <Shirt size={16} />
              <span>{isHackerMode ? 'EXPLOIT WARDROBE' : 'AVATAR SHOP'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Central Realistic Relativistic Black Hole: Fixed 3D Accretion Stream (No Click Indication) */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 26px auto',
          zIndex: 35,
          position: 'relative',
        }}
      >
        <SpiralBlackHole
          isHackerMode={isHackerMode}
          isSucking={warpPhase === 'suction'}
          onClick={handleSingularityTrigger}
          width={150}
        />
      </div>

      {/* Main Collapsible Site UI Container: Sucked into the Singularity Core on Click */}
      <div
        className={`landing-collapsible-ui ${warpPhase === 'suction' ? 'singularity-suction-active' : ''} ${warpPhase === 'unfolding' ? 'hacker-unfold-active' : ''
          }`}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          zIndex: 10,
        }}
      >
        {/* HOLOVERSE Holographic Hero Title */}
        <div className="holoverse-hero-container">
          {/* Hologram Projector Light Cone / Aura */}
          <div
            className="holoverse-projector-glow"
            style={
              isHackerMode
                ? {
                  background:
                    'radial-gradient(ellipse at center, rgba(0, 255, 102, 0.28) 0%, rgba(0, 242, 254, 0.16) 40%, rgba(0, 255, 102, 0.08) 70%, transparent 80%)',
                }
                : undefined
            }
          />

          {/* Top Holographic / Cyber Tag */}
          <div
            className="holoverse-tagline-badge"
            style={
              isHackerMode
                ? {
                  borderColor: 'rgba(0, 255, 102, 0.5)',
                  color: '#00ff66',
                  boxShadow: '0 0 15px rgba(0, 255, 102, 0.3)',
                }
                : undefined
            }
          >
            <span
              className="holo-dot"
              style={isHackerMode ? { background: '#00ff66', boxShadow: '0 0 8px #00ff66' } : undefined}
            />
            {isHackerMode ? <Cpu size={13} style={{ color: '#00ff66' }} /> : <Sparkles size={13} style={{ color: '#00f2fe' }} />}
            <span>
              {isHackerMode
                ? '[ROOT EXPLOIT] ◈ MULTIMODAL NEURAL MATRIX ◈ [PORT 0x42]'
                : 'SPATIAL GENERATIVE GAME ENGINE'}
            </span>
            <span
              className="holo-dot"
              style={isHackerMode ? { background: '#00ff66', boxShadow: '0 0 8px #00ff66' } : undefined}
            />
          </div>

          {/* Main Brand Title: HOLOVERSE */}
          <div className="holoverse-title-wrap">
            <div
              className="holoverse-scanline"
              style={
                isHackerMode
                  ? {
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(0, 255, 102, 0.9) 30%, rgba(255, 255, 255, 1) 50%, rgba(0, 242, 254, 0.9) 70%, transparent 100%)',
                    boxShadow: '0 0 12px #00ff66, 0 0 24px #00f2fe',
                  }
                  : undefined
              }
            />
            <h1 className="holoverse-title" data-text="HOLOVERSE">
              <span
                className="holoverse-text"
                style={
                  isHackerMode
                    ? {
                      background:
                        'linear-gradient(115deg, #ffffff 0%, #00ff66 25%, #00f2fe 50%, #00ff66 75%, #ffffff 100%)',
                      backgroundSize: '250% 100%',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }
                    : undefined
                }
              >
                HOLOVERSE
              </span>
            </h1>
          </div>
        </div>

        <p
          style={{
            fontSize: 'clamp(16px, 2.5vw, 22px)',
            color: isHackerMode ? '#00ff66' : '#f8fafc',
            fontWeight: 600,
            margin: '0 0 14px 0',
            textAlign: 'center',
            letterSpacing: isHackerMode ? '1px' : 'normal',
          }}
        >
          {isHackerMode ? '> SYSTEM_STATUS: COMPROMISED. ENTER THE CYBER REALM.' : 'Your world. Your game.'}
        </p>

        <p
          style={{
            fontSize: '15px',
            color: isHackerMode ? '#86efac' : '#94a3b8',
            maxWidth: '620px',
            textAlign: 'center',
            margin: '0 0 36px 0',
            lineHeight: '1.6',
            fontFamily: isHackerMode ? '"Share Tech Mono", monospace' : 'inherit',
          }}
        >
          {isHackerMode
            ? '> Feed any visual surveillance snapshot or floorplan. Our zero-day neural compiler deconstructs architectural geometries, injects adversarial daemon hazards, and spawns an interactive sandbox labyrinth.'
            : 'Upload any photo — from haunted mansions to bank vaults — and watch Multimodal AI comprehend the architecture, create custom hazards & thematic enemies, and generate a 100% playable 2D adventure.'}
        </p>

        {/* Interactive Mini Preview Frame (Enlarged 560x280 Showcase) */}
        <div
          style={{
            background: isHackerMode ? 'rgba(3, 16, 10, 0.94)' : 'rgba(11, 15, 25, 0.9)',
            border: isHackerMode ? '2px solid rgba(0, 255, 102, 0.5)' : '2px solid rgba(0, 242, 254, 0.35)',
            borderRadius: '22px',
            padding: '16px 20px',
            boxShadow: isHackerMode
              ? '0 20px 50px rgba(0, 0, 0, 0.75), 0 0 35px rgba(0, 255, 102, 0.22)'
              : '0 20px 50px rgba(0, 0, 0, 0.65), 0 0 35px rgba(0, 242, 254, 0.18)',
            marginBottom: '40px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            width: '100%',
            maxWidth: '640px',
            boxSizing: 'border-box',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              padding: '0 4px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: isHackerMode ? '#00ff66' : '#ff0844',
                }}
              />
              <div
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: isHackerMode ? '#00f2fe' : '#ffd700',
                }}
              />
              <div
                style={{
                  width: '9px',
                  height: '9px',
                  borderRadius: '50%',
                  background: isHackerMode ? '#ffffff' : '#43e97b',
                }}
              />
              <span
                style={{
                  fontSize: '11px',
                  color: isHackerMode ? '#00ff66' : '#94a3b8',
                  marginLeft: '6px',
                  fontFamily: 'monospace',
                  fontWeight: 700,
                  letterSpacing: '0.5px',
                }}
              >
                {isHackerMode ? 'KERNEL_0x7F // LIVE VIRTUAL SANDBOX' : 'LIVE ENGINE PREVIEW // PROCEDURAL 2D ADVENTURE'}
              </span>
            </div>
            <span
              style={{
                fontSize: '11px',
                color: '#00f2fe',
                fontFamily: 'monospace',
                fontWeight: 700,
              }}
            >
              {isHackerMode ? 'LATENCY: 0.2ms // SECURE' : '60 FPS DETERMINISTIC'}
            </span>
          </div>

          <canvas
            ref={miniCanvasRef}
            width={560}
            height={280}
            style={{
              width: '100%',
              maxWidth: '560px',
              aspectRatio: '2 / 1',
              borderRadius: '14px',
              border: isHackerMode ? '1px solid #00552b' : '1px solid #1e293b',
              display: 'block',
              boxShadow: isHackerMode ? '0 0 25px rgba(0, 255, 102, 0.15)' : '0 0 25px rgba(0, 242, 254, 0.1)',
            }}
          />
        </div>

        {/* CTA Buttons */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '18px',
            marginBottom: '44px',
          }}
        >
          {/* Primary CTA: Create My Game */}
          <button
            onClick={onCreateGame}
            style={{
              background: isHackerMode
                ? 'linear-gradient(90deg, #00ff66 0%, #00f2fe 100%)'
                : 'linear-gradient(90deg, #ff007f 0%, #00f2fe 100%)',
              color: isHackerMode ? '#030805' : '#ffffff',
              border: 'none',
              borderRadius: '18px',
              padding: '18px 34px',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '13px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: isHackerMode
                ? '0 8px 30px rgba(0, 255, 102, 0.45), 0 0 15px rgba(0, 242, 254, 0.3)'
                : '0 8px 30px rgba(255, 0, 127, 0.4), 0 0 15px rgba(0, 242, 254, 0.3)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
              e.currentTarget.style.boxShadow = isHackerMode
                ? '0 12px 35px rgba(0, 255, 102, 0.65)'
                : '0 12px 35px rgba(255, 0, 127, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = isHackerMode
                ? '0 8px 30px rgba(0, 255, 102, 0.45)'
                : '0 8px 30px rgba(255, 0, 127, 0.4)';
            }}
          >
            {isHackerMode ? <Zap size={20} fill="#030805" /> : <Camera size={20} />}
            <span>{isHackerMode ? '⚡ DECOMPILE & CREATE GAME' : '📸 CREATE MY GAME'}</span>
          </button>

          {/* Secondary CTA: Try Demo */}
          <button
            onClick={() => onPlayDemo(DEMO_HAUNTED)}
            style={{
              background: isHackerMode ? 'rgba(0, 255, 102, 0.08)' : 'rgba(255, 255, 255, 0.06)',
              color: isHackerMode ? '#00ff66' : '#43e97b',
              border: isHackerMode ? '2px solid #00ff66' : '2px solid #43e97b',
              borderRadius: '18px',
              padding: '18px 30px',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              boxShadow: isHackerMode ? '0 8px 25px rgba(0, 255, 102, 0.2)' : '0 8px 25px rgba(67, 233, 123, 0.2)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = isHackerMode
                ? 'rgba(0, 255, 102, 0.18)'
                : 'rgba(67, 233, 123, 0.15)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = isHackerMode
                ? 'rgba(0, 255, 102, 0.08)'
                : 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            {isHackerMode ? <Binary size={20} /> : <Gamepad2 size={20} />}
            <span>{isHackerMode ? '💾 EXECUTE ZERO-DAY DEMO' : '🎮 QUICK PLAY DEMO'}</span>
          </button>
        </div>

        {/* RECOMMENDATIONS & CREATIVE IDEAS */}
        <div style={{ maxWidth: '980px', width: '100%', marginBottom: '44px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 700,
              color: isHackerMode ? '#00ff66' : '#f6d365',
              marginBottom: '16px',
              letterSpacing: '1px',
              fontFamily: isHackerMode ? '"Share Tech Mono", monospace' : 'inherit',
            }}
          >
            {isHackerMode ? <Terminal size={16} color="#00ff66" /> : <Sparkles size={16} color="#f6d365" />}
            <span>
              {isHackerMode
                ? '[SELECT BREACH VECTOR // EXPLOIT SCHEMATICS]:'
                : 'RECOMMENDED THEMES & WHAT YOU CAN CREATE:'}
            </span>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '10px',
            }}
          >
            {RECOMMENDATIONS.map((rec) => (
              <div
                key={rec.id}
                style={{
                  background: isHackerMode ? 'rgba(4, 18, 12, 0.88)' : 'rgba(15, 23, 42, 0.85)',
                  border: isHackerMode ? '1px solid rgba(0, 255, 102, 0.35)' : '1px solid rgba(0, 242, 254, 0.25)',
                  borderRadius: '14px',
                  padding: '11px 13px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = isHackerMode ? '#00ff66' : '#00f2fe';
                  e.currentTarget.style.boxShadow = isHackerMode
                    ? '0 6px 18px rgba(0, 255, 102, 0.25)'
                    : '0 6px 18px rgba(0, 242, 254, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = isHackerMode
                    ? 'rgba(0, 255, 102, 0.35)'
                    : 'rgba(0, 242, 254, 0.25)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px',
                    }}
                  >
                    <span style={{ fontSize: '20px' }}>{rec.icon}</span>
                    <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: '8px',
                          fontWeight: 800,
                          color:
                            rec.suggestedDifficulty === 'nightmare'
                              ? '#ff0844'
                              : rec.suggestedDifficulty === 'hard'
                                ? '#f59e0b'
                                : '#43e97b',
                          background: 'rgba(0, 0, 0, 0.5)',
                          padding: '2px 5px',
                          borderRadius: '6px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        {rec.suggestedDifficulty.toUpperCase()}
                      </span>
                      <span
                        style={{
                          fontSize: '8px',
                          fontWeight: 700,
                          color: isHackerMode ? '#00ff66' : '#00f2fe',
                          background: isHackerMode ? 'rgba(0, 255, 102, 0.12)' : 'rgba(0, 242, 254, 0.1)',
                          padding: '2px 5px',
                          borderRadius: '6px',
                        }}
                      >
                        {isHackerMode ? `[NODE_${rec.tag}]` : rec.tag}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                    {rec.title}
                  </div>

                  <div
                    style={{
                      fontSize: '11px',
                      color: isHackerMode ? '#a7f3d0' : '#94a3b8',
                      lineHeight: '1.35',
                      marginBottom: '6px',
                    }}
                  >
                    {rec.desc}
                  </div>

                  <div
                    title={rec.promptIdea}
                    style={{
                      fontSize: '10px',
                      color: isHackerMode ? '#6ee7b7' : '#e2e8f0',
                      background: isHackerMode ? 'rgba(0, 255, 102, 0.08)' : 'rgba(255, 255, 255, 0.05)',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontStyle: 'italic',
                      marginBottom: '10px',
                      border: isHackerMode ? '1px solid rgba(0, 255, 102, 0.2)' : 'none',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    💡 {rec.promptIdea}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '6px' }}>
                  <button
                    onClick={() => onCreateWithPreset && onCreateWithPreset(rec)}
                    style={{
                      flex: 1,
                      background: isHackerMode
                        ? 'linear-gradient(90deg, #00ff66, #00f2fe)'
                        : 'linear-gradient(90deg, #ff007f, #7928ca)',
                      color: isHackerMode ? '#030805' : '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '7px 10px',
                      fontSize: '10px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '4px',
                      boxShadow: isHackerMode
                        ? '0 3px 10px rgba(0, 255, 102, 0.25)'
                        : '0 3px 10px rgba(255, 0, 127, 0.25)',
                    }}
                  >
                    {isHackerMode ? <Zap size={12} fill="#030805" /> : <Sparkles size={12} />}
                    <span>{isHackerMode ? 'Inject Vector' : 'Create with Idea'}</span>
                  </button>

                  {DEMO_MAP[rec.demoGameKey] && (
                    <button
                      onClick={() => onPlayDemo(DEMO_MAP[rec.demoGameKey])}
                      style={{
                        background: isHackerMode ? 'rgba(0, 255, 102, 0.15)' : 'rgba(67, 233, 123, 0.15)',
                        color: isHackerMode ? '#00ff66' : '#43e97b',
                        border: isHackerMode ? '1px solid #00ff66' : '1px solid #43e97b',
                        borderRadius: '8px',
                        padding: '7px 10px',
                        fontSize: '10px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '4px',
                      }}
                    >
                      <Play size={11} fill={isHackerMode ? '#00ff66' : '#43e97b'} />
                      <span>Play</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Launch Pre-Baked Worlds */}
        <div style={{ maxWidth: '980px', width: '100%', marginBottom: '40px' }}>
          <div
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: isHackerMode ? '#00ff66' : '#94a3b8',
              textAlign: 'center',
              marginBottom: '16px',
              letterSpacing: '1px',
              fontFamily: isHackerMode ? '"Share Tech Mono", monospace' : 'inherit',
            }}
          >
            {isHackerMode
              ? '[AVAILABLE SANDBOX COMPILATIONS // ZERO SETUP]:'
              : 'EXPLORE DEMO WORLDS (ZERO SETUP REQUIRED):'}
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
              gap: '10px',
            }}
          >
            {ALL_DEMO_GAMES.map((game) => (
              <div
                key={game.title}
                onClick={() => onPlayDemo(game)}
                style={{
                  background: isHackerMode ? 'rgba(4, 18, 12, 0.82)' : 'rgba(15, 23, 42, 0.75)',
                  border: isHackerMode ? '1px solid rgba(0, 255, 102, 0.28)' : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '14px',
                  padding: '10px 12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.borderColor = isHackerMode ? '#00ff66' : '#00f2fe';
                  e.currentTarget.style.boxShadow = isHackerMode
                    ? '0 6px 18px rgba(0, 255, 102, 0.22)'
                    : '0 6px 18px rgba(0, 242, 254, 0.18)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = isHackerMode
                    ? 'rgba(0, 255, 102, 0.28)'
                    : 'rgba(255, 255, 255, 0.12)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '6px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '9px',
                        fontWeight: 700,
                        color: isHackerMode ? '#00ff66' : '#ff007f',
                        textTransform: 'uppercase',
                        fontFamily: isHackerMode ? 'monospace' : 'inherit',
                      }}
                    >
                      {isHackerMode ? `[0x_${game.map?.theme || game.genre}]` : game.map?.theme || game.genre}
                    </span>
                    <span
                      style={{
                        fontSize: '10px',
                        color: isHackerMode ? '#00f2fe' : '#f6d365',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '3px',
                      }}
                    >
                      ⏱️ {game.timeLimit}s
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', marginBottom: '4px', lineHeight: '1.25' }}>
                    {game.title}
                  </div>
                  <div
                    style={{
                      fontSize: '10.5px',
                      color: isHackerMode ? '#a7f3d0' : '#94a3b8',
                      lineHeight: '1.3',
                    }}
                  >
                    {game.description}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '11px',
                    fontWeight: 700,
                    color: isHackerMode ? '#00ff66' : '#00f2fe',
                  }}
                >
                  <Play size={11} fill={isHackerMode ? '#00ff66' : '#00f2fe'} />
                  <span>{isHackerMode ? 'Execute Module' : 'Launch Level'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Badges */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '20px',
            color: isHackerMode ? '#6ee7b7' : '#64748b',
            fontSize: '13px',
            fontFamily: isHackerMode ? '"Share Tech Mono", monospace' : 'inherit',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Shield size={15} color={isHackerMode ? '#00ff66' : '#00f2fe'} />
            <span>{isHackerMode ? 'Zero-Day EMP & Stealth Protocols' : 'Non-Lethal EMP & Stealth Mechanics'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Compass size={15} color={isHackerMode ? '#00f2fe' : '#43e97b'} />
            <span>{isHackerMode ? 'Adversarial Daemon Hazard Subroutines' : 'Thematic Ghost & Bank Guard Ensembles'}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Zap size={15} color={isHackerMode ? '#00ff66' : '#ffd700'} />
            <span>{isHackerMode ? 'Encrypted Token Ledger & Wardrobe' : 'Persistent Gem Wallet & Skins'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
