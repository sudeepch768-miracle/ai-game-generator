import React, { useEffect, useRef, useState } from 'react';
import { Camera, Gamepad2, Sparkles, Zap, Play, Shield, Compass, Shirt } from 'lucide-react';
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
import { BlackHoleIcon } from './BlackHoleIcon';

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

  useEffect(() => {
    setGemCount(getGemBalance());
  }, []);

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

      // Dark checkered floor
      const tileSize = 20;
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 14; c++) {
          ctx.fillStyle = (r + c) % 2 === 0 ? '#111728' : '#0d1220';
          ctx.fillRect(c * tileSize, r * tileSize, tileSize, tileSize);
        }
      }

      // Walls
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(0, 0, canvas.width, 6);
      ctx.fillRect(0, canvas.height - 6, canvas.width, 6);
      ctx.fillRect(0, 0, 6, canvas.height);
      ctx.fillRect(canvas.width - 6, 0, 6, canvas.height);

      // Desk Obstacle
      ctx.fillStyle = '#8b5a2b';
      ctx.fillRect(110, 40, 50, 24);
      ctx.fillStyle = '#00f2fe';
      ctx.fillRect(125, 46, 20, 10);

      // Exit Doorway
      const exitPulse = Math.sin(t * 4) * 2;
      ctx.fillStyle = '#43e97b';
      ctx.fillRect(canvas.width - 24, 50, 14, 28);
      ctx.strokeStyle = 'rgba(67, 233, 123, 0.6)';
      ctx.lineWidth = 2 + exitPulse;
      ctx.strokeRect(canvas.width - 24, 50, 14, 28);

      // Golden Key
      const keyBob = Math.sin(t * 5) * 3;
      ctx.fillStyle = '#ffd700';
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
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.beginPath();
      ctx.ellipse(charX, charY + 9, 7, 3, 0, 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.fillStyle = '#ff007f';
      ctx.fillRect(charX - 5, charY - 3 + walkBob, 10, 10);

      // Head
      ctx.fillStyle = '#ffdfba';
      ctx.beginPath();
      ctx.arc(charX, charY - 8 + walkBob, 5, 0, Math.PI * 2);
      ctx.fill();

      animId = requestAnimationFrame(renderMini);
    };

    renderMini();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 50% 15%, #18223d 0%, #080a14 70%)',
      color: '#ffffff',
      fontFamily: '"Chakra Petch", sans-serif',
      padding: '30px 20px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {/* Top Header Bar with Wardrobe & Gem Shop Button & PWA Install */}
      <div style={{
        width: '100%',
        maxWidth: '1040px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 242, 254, 0.12)',
          border: '1px solid rgba(0, 242, 254, 0.4)',
          padding: '6px 16px',
          borderRadius: '30px',
          color: '#00f2fe',
          fontSize: '12px',
          fontWeight: 700,
          boxShadow: '0 0 20px rgba(0, 242, 254, 0.2)',
        }}>
          <Sparkles size={15} /> ◈ HOLOVERSE AI ENGINE ◈
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          {onOpenShop && (
            <button
              onClick={onOpenShop}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px',
                background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.2) 0%, rgba(245, 158, 11, 0.1) 100%)',
                border: '1px solid rgba(234, 179, 8, 0.6)',
                padding: '8px 18px',
                borderRadius: '24px',
                color: '#ffd700',
                fontFamily: '"Chakra Petch", sans-serif',
                fontSize: '13px',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(234, 179, 8, 0.25)',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = '#ffd700';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(234, 179, 8, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(234, 179, 8, 0.6)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(234, 179, 8, 0.25)';
              }}
            >
              <span>💎 {gemCount} GEMS</span>
              <span style={{ color: '#64748b' }}>|</span>
              <Shirt size={16} />
              <span>AVATAR SHOP</span>
            </button>
          )}
        </div>
      </div>

      {/* HOLOVERSE Holographic Hero Title */}
      <div className="holoverse-hero-container">
        {/* Hologram Projector Light Cone / Aura */}
        <div className="holoverse-projector-glow" />

        {/* Animated Gravitational Singularity Black Hole */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: '16px',
        }}>
          <BlackHoleIcon size={88} />
        </div>

        {/* Top Holographic Tag */}
        <div className="holoverse-tagline-badge">
          <span className="holo-dot" />
          <Sparkles size={13} style={{ color: '#00f2fe' }} />
          <span>SPATIAL REALITY TO PLAY ENGINE</span>
          <span className="holo-dot" />
        </div>

        {/* Main Brand Title: HOLOVERSE */}
        <div className="holoverse-title-wrap">
          <div className="holoverse-scanline" />
          <h1 className="holoverse-title" data-text="HOLOVERSE">
            <span className="holoverse-text">HOLOVERSE</span>
          </h1>
        </div>

        {/* Sub-Banner: REALITY → PLAY with Retro Pixel Arrow */}
        <div className="holoverse-sub-banner">
          <span className="holo-sub-left">REALITY</span>

          {/* Scaled & Animated 8-Bit Retro Pixel Arrow */}
          <svg
            viewBox="0 0 16 14"
            aria-hidden="true"
            shapeRendering="crispEdges"
            style={{
              width: 'clamp(30px, 4.5vw, 46px)',
              height: 'clamp(22px, 3.5vw, 36px)',
              flexShrink: 0,
              margin: '0 clamp(4px, 0.8vw, 8px)',
              animation: 'retroArrowPulse 1.8s ease-in-out infinite',
              verticalAlign: 'middle',
            }}
          >
            <defs>
              <linearGradient id="realityPlayArrowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#00f2fe" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ff007f" />
              </linearGradient>
            </defs>
            <rect x="0" y="5" width="8" height="4" fill="url(#realityPlayArrowGrad)" />
            <rect x="8" y="1" width="2" height="12" fill="url(#realityPlayArrowGrad)" />
            <rect x="10" y="3" width="2" height="8" fill="url(#realityPlayArrowGrad)" />
            <rect x="12" y="5" width="2" height="4" fill="url(#realityPlayArrowGrad)" />
            <rect x="14" y="6" width="2" height="2" fill="url(#realityPlayArrowGrad)" />
          </svg>

          <span className="holo-sub-right">PLAY</span>
        </div>
      </div>

      <p style={{
        fontSize: 'clamp(16px, 2.5vw, 22px)',
        color: '#f8fafc',
        fontWeight: 600,
        margin: '0 0 8px 0',
        textAlign: 'center',
      }}>
        Your world. Your game.
      </p>

      <p style={{
        fontSize: '15px',
        color: '#94a3b8',
        maxWidth: '580px',
        textAlign: 'center',
        margin: '0 0 32px 0',
        lineHeight: '1.6',
      }}>
        Upload any photo — from haunted mansions to bank vaults — and watch Multimodal AI comprehend the architecture, create custom hazards & thematic enemies, and generate a 100% playable 2D adventure.
      </p>

      {/* Interactive Mini Preview Frame */}
      <div style={{
        background: 'rgba(11, 15, 25, 0.85)',
        border: '2px solid rgba(0, 242, 254, 0.3)',
        borderRadius: '20px',
        padding: '12px 16px',
        boxShadow: '0 15px 40px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 242, 254, 0.15)',
        marginBottom: '32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '0 4px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff0844' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffd700' }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#43e97b' }} />
            <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '6px', fontFamily: 'monospace' }}>LIVE ENGINE PREVIEW</span>
          </div>
          <span style={{ fontSize: '11px', color: '#00f2fe', fontFamily: 'monospace' }}>60 FPS DETERMINISTIC</span>
        </div>

        <canvas
          ref={miniCanvasRef}
          width={280}
          height={140}
          style={{
            borderRadius: '12px',
            border: '1px solid #1e293b',
            display: 'block',
          }}
        />
      </div>

      {/* CTA Buttons */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '18px',
        marginBottom: '44px',
      }}>
        {/* Primary CTA: Create My Game */}
        <button
          onClick={onCreateGame}
          style={{
            background: 'linear-gradient(90deg, #ff007f 0%, #00f2fe 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '18px',
            padding: '18px 34px',
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 8px 30px rgba(255, 0, 127, 0.4), 0 0 15px rgba(0, 242, 254, 0.3)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px) scale(1.02)';
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(255, 0, 127, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
            e.currentTarget.style.boxShadow = '0 8px 30px rgba(255, 0, 127, 0.4)';
          }}
        >
          <Camera size={20} />
          📸 CREATE MY GAME
        </button>

        {/* Secondary CTA: Try Demo */}
        <button
          onClick={() => onPlayDemo(DEMO_HAUNTED)}
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            color: '#43e97b',
            border: '2px solid #43e97b',
            borderRadius: '18px',
            padding: '18px 30px',
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            boxShadow: '0 8px 25px rgba(67, 233, 123, 0.2)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(67, 233, 123, 0.15)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Gamepad2 size={20} />
          🎮 QUICK PLAY DEMO
        </button>
      </div>

      {/* RECOMMENDATIONS & CREATIVE IDEAS (ONLY ON HOMEPAGE) */}
      <div style={{ maxWidth: '980px', width: '100%', marginBottom: '44px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          fontSize: '13px',
          fontWeight: 700,
          color: '#f6d365',
          marginBottom: '16px',
          letterSpacing: '1px',
        }}>
          <Sparkles size={16} color="#f6d365" /> RECOMMENDED THEMES & WHAT YOU CAN CREATE:
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '14px',
        }}>
          {RECOMMENDATIONS.map((rec) => (
            <div
              key={rec.id}
              style={{
                background: 'rgba(15, 23, 42, 0.85)',
                border: '1px solid rgba(0, 242, 254, 0.25)',
                borderRadius: '16px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.borderColor = '#00f2fe';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 242, 254, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.25)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '24px' }}>{rec.icon}</span>
                  <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 800,
                      color: rec.suggestedDifficulty === 'nightmare' ? '#ff0844' : (rec.suggestedDifficulty === 'hard' ? '#f59e0b' : '#43e97b'),
                      background: 'rgba(0, 0, 0, 0.5)',
                      padding: '3px 7px',
                      borderRadius: '8px',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                    }}>
                      {rec.suggestedDifficulty.toUpperCase()}
                    </span>
                    <span style={{
                      fontSize: '9px',
                      fontWeight: 700,
                      color: '#00f2fe',
                      background: 'rgba(0, 242, 254, 0.1)',
                      padding: '3px 7px',
                      borderRadius: '8px',
                    }}>
                      {rec.tag}
                    </span>
                  </div>
                </div>

                <div style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', marginBottom: '6px' }}>
                  {rec.title}
                </div>

                <div style={{ fontSize: '12px', color: '#94a3b8', lineHeight: '1.4', marginBottom: '10px' }}>
                  {rec.desc}
                </div>

                <div style={{
                  fontSize: '11px',
                  color: '#e2e8f0',
                  background: 'rgba(255, 255, 255, 0.05)',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  fontStyle: 'italic',
                  marginBottom: '12px',
                }}>
                  💡 {rec.promptIdea}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => onCreateWithPreset && onCreateWithPreset(rec)}
                  style={{
                    flex: 1,
                    background: 'linear-gradient(90deg, #ff007f, #7928ca)',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '9px 12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '5px',
                    boxShadow: '0 4px 12px rgba(255, 0, 127, 0.3)',
                  }}
                >
                  <Sparkles size={13} /> Create with Idea
                </button>

                {DEMO_MAP[rec.demoGameKey] && (
                  <button
                    onClick={() => onPlayDemo(DEMO_MAP[rec.demoGameKey])}
                    style={{
                      background: 'rgba(67, 233, 123, 0.15)',
                      color: '#43e97b',
                      border: '1px solid #43e97b',
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
                    <Play size={12} fill="#43e97b" /> Quick Play
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Launch Pre-Baked Worlds */}
      <div style={{ maxWidth: '980px', width: '100%', marginBottom: '40px' }}>
        <div style={{ fontSize: '13px', fontWeight: 700, color: '#94a3b8', textAlign: 'center', marginBottom: '16px', letterSpacing: '1px' }}>
          EXPLORE DEMO WORLDS (ZERO SETUP REQUIRED):
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
          {ALL_DEMO_GAMES.map((game) => (
            <div
              key={game.title}
              onClick={() => onPlayDemo(game)}
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
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
                e.currentTarget.style.borderColor = '#00f2fe';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 242, 254, 0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '10px', fontWeight: 700, color: '#ff007f', textTransform: 'uppercase' }}>
                    {game.map?.theme || game.genre}
                  </span>
                  <span style={{ fontSize: '11px', color: '#f6d365', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    ⏱️ {game.timeLimit}s
                  </span>
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '6px', lineHeight: '1.3' }}>
                  {game.title}
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.4' }}>
                  {game.description}
                </div>
              </div>

              <div style={{
                marginTop: '14px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                fontWeight: 700,
                color: '#00f2fe',
              }}>
                <Play size={13} fill="#00f2fe" /> Launch Level
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Badges */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '20px',
        color: '#64748b',
        fontSize: '13px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Shield size={15} color="#00f2fe" /> Non-Lethal EMP & Stealth Mechanics
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Compass size={15} color="#43e97b" /> Thematic Ghost & Bank Guard Ensembles
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Zap size={15} color="#ffd700" /> Persistent Gem Wallet & Skins
        </div>
      </div>
    </div>
  );
};
