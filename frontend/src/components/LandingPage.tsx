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

    // Phase 1: Begin singularity gravitational suction
    setWarpPhase('suction');
    sound.playBlackHoleSuction();

    // Trigger radiant singularity flash just before total collapse
    const flashTimer = setTimeout(() => {
      setShowFlash(true);
    }, 1100);

    // Phase 2: At total collapse point, toggle theme and unfold
    const unfoldTimer = setTimeout(() => {
      setIsHackerMode((prev) => !prev);
      setWarpPhase('unfolding');
      sound.playHackerMatrix();
    }, 1300);

    // Hide flash overlay shortly after unfold begins
    const hideFlashTimer = setTimeout(() => {
      setShowFlash(false);
    }, 1600);

    // Phase 3: Settle back into normal idle state
    const idleTimer = setTimeout(() => {
      setWarpPhase('idle');
    }, 2200);

    return () => {
      clearTimeout(flashTimer);
      clearTimeout(unfoldTimer);
      clearTimeout(hideFlashTimer);
      clearTimeout(idleTimer);
    };
  };

  // Animated miniature canvas preview
  useEffect(() => {
    const canvas = miniCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;
    let charX = 60;
    let charY = 80;
    let targetX = 220;
    let targetY = 80;

    const renderMini = () => {
      t += 0.03;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Floor
      const tileSize = 20;
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 14; c++) {
          if (isHackerMode) {
            ctx.fillStyle = (r + c) % 2 === 0 ? '#05180e' : '#020b06';
          } else {
            ctx.fillStyle = (r + c) % 2 === 0 ? '#111728' : '#0d1220';
          }
          ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
        }
      }

      // Walls
      ctx.fillStyle = isHackerMode ? '#003b1a' : '#1e293b';
      ctx.fillRect(0, 0, canvas.width, 6);
      ctx.fillRect(0, canvas.height - 6, canvas.width, 6);
      ctx.fillRect(0, 0, 6, canvas.height);
      ctx.fillRect(canvas.width - 6, 0, 6, canvas.height);

      // Terminal / Desk Obstacle
      ctx.fillStyle = isHackerMode ? '#00552b' : '#8b5a2b';
      ctx.fillRect(110, 40, 50, 24);
      ctx.fillStyle = isHackerMode ? '#00ff66' : '#00f2fe';
      ctx.fillRect(125, 46, 20, 10);

      // Exit Doorway / Node
      const exitPulse = Math.sin(t * 4) * 2;
      ctx.fillStyle = isHackerMode ? '#00ff66' : '#43e97b';
      ctx.fillRect(canvas.width - 24, 50, 14, 28);
      ctx.strokeStyle = isHackerMode ? 'rgba(0, 255, 102, 0.8)' : 'rgba(67, 233, 123, 0.6)';
      ctx.lineWidth = 2 + exitPulse;
      ctx.strokeRect(canvas.width - 24, 50, 14, 28);

      // Golden / Cyber Key
      const keyBob = Math.sin(t * 5) * 3;
      ctx.fillStyle = isHackerMode ? '#00f2fe' : '#ffd700';
      ctx.beginPath();
      ctx.arc(80, 50 + keyBob, 5, 0, Math.PI * 2);
      ctx.fill();

      // Moving mini character
      charX += (targetX - charX) * 0.02;
      charY += (targetY - charY) * 0.02;

      if (Math.hypot(charX - targetX, charY - targetY) < 5) {
        if (targetX === 220) {
          targetX = 40;
          targetY = 100;
        } else {
          targetX = 220;
          targetY = 60;
        }
      }

      const walkBob = Math.sin(t * 12) * 2;
      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.4)';
      ctx.beginPath();
      ctx.ellipse(charX, charY + 9, 7, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.fillStyle = isHackerMode ? '#00ff66' : '#ff007f';
      ctx.fillRect(charX - 5, charY - 3 + walkBob, 10, 10);

      // Head
      ctx.fillStyle = isHackerMode ? '#a7f3d0' : '#ffdfba';
      ctx.beginPath();
      ctx.arc(charX, charY - 8 + walkBob, 5, 0, Math.PI * 2);
      ctx.fill();

      // Hacker CRT Scanline on canvas
      if (isHackerMode) {
        ctx.fillStyle = 'rgba(0, 255, 102, 0.06)';
        for (let y = 0; y < canvas.height; y += 4) {
          ctx.fillRect(0, y, canvas.width, 1.5);
        }
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
        /* Dramatic Gravitational Singularity Suction Animation */
        @keyframes uiSingularitySuction {
          0% {
            transform: scale(1) rotate(0deg);
            filter: blur(0px) brightness(1);
            opacity: 1;
          }
          20% {
            transform: scale(0.88) rotate(70deg) skewX(2deg);
            filter: blur(2px) brightness(1.2) contrast(110%);
            opacity: 0.95;
          }
          45% {
            transform: scale(0.6) rotate(320deg) skewX(6deg);
            filter: blur(5px) brightness(1.7) contrast(140%);
            opacity: 0.85;
          }
          75% {
            transform: scale(0.22) rotate(720deg) skewX(12deg);
            filter: blur(9px) brightness(2.4) contrast(180%);
            opacity: 0.5;
          }
          100% {
            transform: scale(0.001) rotate(1080deg);
            filter: blur(16px) brightness(3);
            opacity: 0;
          }
        }

        /* Dark Hacker Matrix Emergence / Unfold Animation */
        @keyframes hackerMatrixUnfold {
          0% {
            transform: scale(0.01) rotate(-360deg);
            filter: blur(14px) brightness(2.6);
            opacity: 0;
          }
          40% {
            transform: scale(0.7) rotate(-40deg);
            filter: blur(5px) brightness(1.5);
            opacity: 0.7;
          }
          75% {
            transform: scale(1.04) rotate(4deg);
            filter: blur(1px) brightness(1.15);
            opacity: 0.95;
          }
          100% {
            transform: scale(1) rotate(0deg);
            filter: blur(0px) brightness(1);
            opacity: 1;
          }
        }

        /* Singularity Event Horizon Flash */
        @keyframes singularityFlash {
          0% { opacity: 0; }
          25% { opacity: 0.96; }
          100% { opacity: 0; }
        }

        /* CRT Scanline Overlay for Hacker Mode */
        @keyframes crtFlicker {
          0% { opacity: 0.97; }
          50% { opacity: 1; }
          100% { opacity: 0.98; }
        }

        .singularity-suction-active {
          transform-origin: 50% 190px !important;
          animation: uiSingularitySuction 1.3s cubic-bezier(0.55, 0.055, 0.675, 0.19) forwards !important;
          pointer-events: none !important;
        }

        .hacker-unfold-active {
          transform-origin: 50% 190px !important;
          animation: hackerMatrixUnfold 0.9s cubic-bezier(0.215, 0.61, 0.355, 1) forwards !important;
          pointer-events: none !important;
        }
      `}</style>

      {/* Live Falling Matrix Digital Rain Background (Active in Hacker Mode) */}
      {isHackerMode && <MatrixRainCanvas opacity={0.7} color="#00ff66" fontSize={14} />}

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
          marginBottom: '16px',
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

      {/* Central Black Hole Core: Prominently Centered in the Middle of the Hero Section */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '14px',
          zIndex: 35,
          position: 'relative',
        }}
      >
        <SpiralBlackHole
          isHackerMode={isHackerMode}
          isSucking={warpPhase === 'suction'}
          onClick={handleSingularityTrigger}
          width={310}
          height={215}
        />
      </div>

      {/* Main Collapsible Site UI Container: Sucked into the Singularity Core on Click */}
      <div
        className={`landing-collapsible-ui ${warpPhase === 'suction' ? 'singularity-suction-active' : ''} ${
          warpPhase === 'unfolding' ? 'hacker-unfold-active' : ''
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
            margin: '0 0 8px 0',
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
            margin: '0 0 32px 0',
            lineHeight: '1.6',
            fontFamily: isHackerMode ? '"Share Tech Mono", monospace' : 'inherit',
          }}
        >
          {isHackerMode
            ? '> Feed any visual surveillance snapshot or floorplan. Our zero-day neural compiler deconstructs architectural geometries, injects adversarial daemon hazards, and spawns an interactive sandbox labyrinth.'
            : 'Upload any photo — from haunted mansions to bank vaults — and watch Multimodal AI comprehend the architecture, create custom hazards & thematic enemies, and generate a 100% playable 2D adventure.'}
        </p>

        {/* Interactive Mini Preview Frame */}
        <div
          style={{
            background: isHackerMode ? 'rgba(3, 16, 10, 0.92)' : 'rgba(11, 15, 25, 0.85)',
            border: isHackerMode ? '2px solid rgba(0, 255, 102, 0.45)' : '2px solid rgba(0, 242, 254, 0.3)',
            borderRadius: '20px',
            padding: '12px 16px',
            boxShadow: isHackerMode
              ? '0 15px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(0, 255, 102, 0.2)'
              : '0 15px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 242, 254, 0.15)',
            marginBottom: '32px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isHackerMode ? '#00ff66' : '#ff0844',
                }}
              />
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isHackerMode ? '#00f2fe' : '#ffd700',
                }}
              />
              <div
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: isHackerMode ? '#ffffff' : '#43e97b',
                }}
              />
              <span
                style={{
                  fontSize: '11px',
                  color: isHackerMode ? '#00ff66' : '#64748b',
                  marginLeft: '6px',
                  fontFamily: 'monospace',
                }}
              >
                {isHackerMode ? 'KERNEL_0x7F // LIVE VIRTUAL SANDBOX' : 'LIVE ENGINE PREVIEW'}
              </span>
            </div>
            <span
              style={{
                fontSize: '11px',
                color: isHackerMode ? '#00f2fe' : '#00f2fe',
                fontFamily: 'monospace',
              }}
            >
              {isHackerMode ? 'LATENCY: 0.2ms // SECURE' : '60 FPS DETERMINISTIC'}
            </span>
          </div>

          <canvas
            ref={miniCanvasRef}
            width={280}
            height={140}
            style={{
              borderRadius: '12px',
              border: isHackerMode ? '1px solid #00552b' : '1px solid #1e293b',
              display: 'block',
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '14px',
            }}
          >
            {RECOMMENDATIONS.map((rec) => (
              <div
                key={rec.id}
                style={{
                  background: isHackerMode ? 'rgba(4, 18, 12, 0.88)' : 'rgba(15, 23, 42, 0.85)',
                  border: isHackerMode ? '1px solid rgba(0, 255, 102, 0.35)' : '1px solid rgba(0, 242, 254, 0.25)',
                  borderRadius: '16px',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = isHackerMode ? '#00ff66' : '#00f2fe';
                  e.currentTarget.style.boxShadow = isHackerMode
                    ? '0 10px 25px rgba(0, 255, 102, 0.3)'
                    : '0 10px 25px rgba(0, 242, 254, 0.25)';
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
                      marginBottom: '8px',
                    }}
                  >
                    <span style={{ fontSize: '24px' }}>{rec.icon}</span>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: 800,
                          color:
                            rec.suggestedDifficulty === 'nightmare'
                              ? '#ff0844'
                              : rec.suggestedDifficulty === 'hard'
                              ? '#f59e0b'
                              : '#43e97b',
                          background: 'rgba(0, 0, 0, 0.5)',
                          padding: '3px 7px',
                          borderRadius: '8px',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        {rec.suggestedDifficulty.toUpperCase()}
                      </span>
                      <span
                        style={{
                          fontSize: '9px',
                          fontWeight: 700,
                          color: isHackerMode ? '#00ff66' : '#00f2fe',
                          background: isHackerMode ? 'rgba(0, 255, 102, 0.12)' : 'rgba(0, 242, 254, 0.1)',
                          padding: '3px 7px',
                          borderRadius: '8px',
                        }}
                      >
                        {isHackerMode ? `[NODE_${rec.tag}]` : rec.tag}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                    {rec.title}
                  </div>

                  <div
                    style={{
                      fontSize: '12px',
                      color: isHackerMode ? '#a7f3d0' : '#94a3b8',
                      lineHeight: '1.4',
                      marginBottom: '10px',
                    }}
                  >
                    {rec.desc}
                  </div>

                  <div
                    style={{
                      fontSize: '11px',
                      color: isHackerMode ? '#6ee7b7' : '#e2e8f0',
                      background: isHackerMode ? 'rgba(0, 255, 102, 0.08)' : 'rgba(255, 255, 255, 0.05)',
                      padding: '6px 10px',
                      borderRadius: '8px',
                      fontStyle: 'italic',
                      marginBottom: '12px',
                      border: isHackerMode ? '1px solid rgba(0, 255, 102, 0.2)' : 'none',
                    }}
                  >
                    💡 {rec.promptIdea}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => onCreateWithPreset && onCreateWithPreset(rec)}
                    style={{
                      flex: 1,
                      background: isHackerMode
                        ? 'linear-gradient(90deg, #00ff66, #00f2fe)'
                        : 'linear-gradient(90deg, #ff007f, #7928ca)',
                      color: isHackerMode ? '#030805' : '#ffffff',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '9px 12px',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '5px',
                      boxShadow: isHackerMode
                        ? '0 4px 12px rgba(0, 255, 102, 0.3)'
                        : '0 4px 12px rgba(255, 0, 127, 0.3)',
                    }}
                  >
                    {isHackerMode ? <Zap size={13} fill="#030805" /> : <Sparkles size={13} />}
                    <span>{isHackerMode ? 'Inject Vector' : 'Create with Idea'}</span>
                  </button>

                  {DEMO_MAP[rec.demoGameKey] && (
                    <button
                      onClick={() => onPlayDemo(DEMO_MAP[rec.demoGameKey])}
                      style={{
                        background: isHackerMode ? 'rgba(0, 255, 102, 0.15)' : 'rgba(67, 233, 123, 0.15)',
                        color: isHackerMode ? '#00ff66' : '#43e97b',
                        border: isHackerMode ? '1px solid #00ff66' : '1px solid #43e97b',
                        borderRadius: '10px',
                        padding: '9px 12px',
                        fontSize: '11px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '5px',
                      }}
                    >
                      <Play size={12} fill={isHackerMode ? '#00ff66' : '#43e97b'} />
                      <span>Quick Play</span>
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
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px',
            }}
          >
            {ALL_DEMO_GAMES.map((game) => (
              <div
                key={game.title}
                onClick={() => onPlayDemo(game)}
                style={{
                  background: isHackerMode ? 'rgba(4, 18, 12, 0.82)' : 'rgba(15, 23, 42, 0.75)',
                  border: isHackerMode ? '1px solid rgba(0, 255, 102, 0.28)' : '1px solid rgba(255, 255, 255, 0.12)',
                  borderRadius: '16px',
                  padding: '16px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.borderColor = isHackerMode ? '#00ff66' : '#00f2fe';
                  e.currentTarget.style.boxShadow = isHackerMode
                    ? '0 10px 25px rgba(0, 255, 102, 0.25)'
                    : '0 10px 25px rgba(0, 242, 254, 0.2)';
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
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
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
                        fontSize: '11px',
                        color: isHackerMode ? '#00f2fe' : '#f6d365',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      ⏱️ {game.timeLimit}s
                    </span>
                  </div>
                  <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '6px', lineHeight: '1.3' }}>
                    {game.title}
                  </div>
                  <div
                    style={{
                      fontSize: '11px',
                      color: isHackerMode ? '#a7f3d0' : '#94a3b8',
                      lineHeight: '1.4',
                    }}
                  >
                    {game.description}
                  </div>
                </div>

                <div
                  style={{
                    marginTop: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: isHackerMode ? '#00ff66' : '#00f2fe',
                  }}
                >
                  <Play size={13} fill={isHackerMode ? '#00ff66' : '#00f2fe'} />
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
