import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Skull, RotateCcw, PlusCircle, Star, Clock, LogOut, ArrowLeft, Award, Flame } from 'lucide-react';
import { getPersonalBest, savePersonalBest } from '../utils/scoreboard';

interface GameOverModalProps {
  isWon: boolean;
  score: number;
  timeRemaining?: number;
  reason?: string;
  mapTitle?: string;
  onPlayAgain: () => void;
  onCreateAnother: () => void;
  onExitToMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isWon,
  score,
  timeRemaining = 0,
  reason,
  mapTitle = 'Sector Campaign',
  onPlayAgain,
  onCreateAnother,
  onExitToMenu,
}) => {
  const [personalBest, setPersonalBest] = useState<number>(0);
  const [isNewRecord, setIsNewRecord] = useState<boolean>(false);

  useEffect(() => {
    // Record and check personal best for this specific map
    const result = savePersonalBest(mapTitle, score);
    setPersonalBest(result.pb);
    setIsNewRecord(result.isNewPB);

    if (isWon) {
      // Fire celebratory confetti cannons in progressive waves
      const end = Date.now() + 2400;
      const colors = ['#00f2fe', '#43e97b', '#ffd700', '#ff007f', '#ffffff'];

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 60,
          origin: { x: 0, y: 0.7 },
          colors: colors,
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 60,
          origin: { x: 1, y: 0.7 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isWon, score, mapTitle]);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: isWon ? 'rgba(5, 8, 18, 0.92)' : 'rgba(12, 3, 6, 0.94)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 35,
      padding: '20px',
      overflow: 'hidden',
    }}>
      <style>{`
        @keyframes radiantRaysSpin {
          0% { transform: translate(-50%, -50%) rotate(0deg); }
          100% { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes trophyBounceFloat {
          0%, 100% { transform: translateY(0px) scale(1.0); }
          50% { transform: translateY(-8px) scale(1.08); }
        }

        @keyframes victoryAuraPulse {
          0%, 100% { box-shadow: 0 0 35px rgba(67, 233, 123, 0.5), 0 0 70px rgba(0, 242, 254, 0.3); }
          50% { box-shadow: 0 0 60px rgba(67, 233, 123, 0.8), 0 0 100px rgba(255, 215, 0, 0.45); }
        }

        @keyframes glitchShakeFail {
          0% { transform: translate(0, 0) rotate(0deg); }
          10% { transform: translate(-5px, 3px) rotate(-1deg); }
          20% { transform: translate(4px, -4px) rotate(1deg); }
          30% { transform: translate(-4px, 4px) rotate(-1deg); }
          40% { transform: translate(3px, -2px) rotate(0.5deg); }
          50% { transform: translate(-2px, 2px) rotate(-0.5deg); }
          60% { transform: translate(2px, -1px) rotate(0deg); }
          100% { transform: translate(0, 0) rotate(0deg); }
        }

        @keyframes skullTremble {
          0%, 100% { transform: scale(1.0) rotate(0deg); }
          25% { transform: scale(1.04) rotate(-3deg); }
          75% { transform: scale(1.04) rotate(3deg); }
        }

        @keyframes redEmberFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 0; }
          20% { opacity: 0.8; }
          80% { opacity: 0.8; }
          100% { transform: translateY(600px) rotate(360deg); opacity: 0; }
        }

        @keyframes pbGlowPulse {
          0%, 100% { transform: scale(1.0); box-shadow: 0 0 15px rgba(255, 215, 0, 0.4); }
          50% { transform: scale(1.03); box-shadow: 0 0 25px rgba(255, 215, 0, 0.85); }
        }
      `}</style>

      {/* FAIL BACKGROUND: Falling Crimson Embers Simulation */}
      {!isWon && (
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: '-20px',
                left: `${(i * 5.8) % 100}%`,
                width: `${4 + (i % 5)}px`,
                height: `${4 + (i % 5)}px`,
                borderRadius: '50%',
                background: i % 2 === 0 ? '#ef4444' : '#f97316',
                boxShadow: '0 0 8px #ef4444',
                animation: `redEmberFall ${2.5 + (i % 4) * 0.7}s linear infinite`,
                animationDelay: `${(i * 0.35) % 3}s`,
              }}
            />
          ))}
        </div>
      )}

      {/* Main Modal Card */}
      <div style={{
        width: '100%',
        maxWidth: '520px',
        background: isWon
          ? 'linear-gradient(145deg, #0e2724 0%, #0a171e 100%)'
          : 'linear-gradient(145deg, #2b0b14 0%, #17070e 100%)',
        border: `3px solid ${isWon ? '#43e97b' : '#ff0844'}`,
        borderRadius: '26px',
        padding: '36px 32px',
        textAlign: 'center',
        color: '#ffffff',
        fontFamily: '"Chakra Petch", sans-serif',
        position: 'relative',
        animation: isWon ? 'victoryAuraPulse 3s ease-in-out infinite' : 'glitchShakeFail 0.65s ease-out',
        boxShadow: isWon
          ? '0 0 50px rgba(67, 233, 123, 0.45), 0 25px 70px rgba(0, 0, 0, 0.95)'
          : '0 0 50px rgba(255, 8, 68, 0.45), 0 25px 70px rgba(0, 0, 0, 0.95)',
      }}>

        {/* WIN: Radiant Sunburst Rays behind Trophy */}
        {isWon && (
          <div style={{
            position: 'absolute',
            top: '74px',
            left: '50%',
            width: '260px',
            height: '260px',
            pointerEvents: 'none',
            zIndex: 0,
            opacity: 0.35,
            animation: 'radiantRaysSpin 16s linear infinite',
            background: 'conic-gradient(from 0deg, transparent 0deg 15deg, #ffd700 15deg 30deg, transparent 30deg 45deg, #43e97b 45deg 60deg, transparent 60deg 75deg, #00f2fe 75deg 90deg, transparent 90deg 105deg, #ffd700 105deg 120deg, transparent 120deg 135deg, #43e97b 135deg 150deg, transparent 150deg 165deg, #00f2fe 165deg 180deg, transparent 180deg 195deg, #ffd700 195deg 210deg, transparent 210deg 225deg, #43e97b 225deg 240deg, transparent 240deg 255deg, #00f2fe 255deg 270deg, transparent 270deg 285deg, #ffd700 285deg 300deg, transparent 300deg 315deg, #43e97b 315deg 330deg, transparent 330deg 345deg, #00f2fe 345deg 360deg)',
            borderRadius: '50%',
          }} />
        )}

        {/* Header Icon */}
        <div style={{
          position: 'relative',
          zIndex: 1,
          width: '78px',
          height: '78px',
          margin: '0 auto 16px auto',
          borderRadius: '50%',
          background: isWon ? 'rgba(67, 233, 123, 0.22)' : 'rgba(255, 8, 68, 0.22)',
          border: `2.5px solid ${isWon ? '#43e97b' : '#ff0844'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isWon ? '0 0 25px rgba(67, 233, 123, 0.6)' : '0 0 25px rgba(255, 8, 68, 0.6)',
        }}>
          {isWon ? (
            <div style={{ animation: 'trophyBounceFloat 2s ease-in-out infinite' }}>
              <Trophy size={42} color="#ffd700" style={{ filter: 'drop-shadow(0 0 10px #ffd700)' }} />
            </div>
          ) : (
            <div style={{ animation: 'skullTremble 1.8s ease-in-out infinite' }}>
              <Skull size={42} color="#ff0844" style={{ filter: 'drop-shadow(0 0 10px #ff0844)' }} />
            </div>
          )}
        </div>

        {/* Title */}
        <h1 style={{
          position: 'relative',
          zIndex: 1,
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '18px',
          margin: '0 0 8px 0',
          color: isWon ? '#43e97b' : '#ff0844',
          textShadow: isWon
            ? '0 0 18px rgba(67, 233, 123, 0.8)'
            : '0 0 18px rgba(255, 8, 68, 0.8)',
          letterSpacing: '1px',
        }}>
          {isWon ? 'CAMPAIGN CONQUERED!' : 'MISSION FAILED'}
        </h1>

        <p style={{
          position: 'relative',
          zIndex: 1,
          fontSize: '13px',
          color: '#94a3b8',
          margin: '0 0 20px 0',
          lineHeight: '1.5',
        }}>
          {isWon
            ? 'All 3 Sectors Conquered! You collected the keys, fulfilled the point quota, overrode firewalls, and escaped!'
            : (reason || 'The clock ran out before you could complete the objective.')}
        </p>

        {/* Map Context Header */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(0, 242, 254, 0.12)',
          border: '1px solid rgba(0, 242, 254, 0.35)',
          padding: '4px 14px',
          borderRadius: '20px',
          fontSize: '12px',
          color: '#00f2fe',
          fontWeight: 700,
          marginBottom: '16px',
        }}>
          <span>🗺️ {mapTitle}</span>
        </div>

        {/* SCOREBOARD: Current Score & Map Personal Best */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.55)',
          borderRadius: '18px',
          padding: '16px 20px',
          marginBottom: '20px',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          display: 'grid',
          gridTemplateColumns: isWon ? '1fr 1fr 1fr' : '1fr 1fr',
          gap: '12px',
        }}>
          {/* Current Run Score */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#ffd700', fontSize: '11px', fontWeight: 800 }}>
              <Star size={14} /> SCORE
            </div>
            <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '16px', color: '#ffffff', marginTop: '6px' }}>
              {score}
            </div>
          </div>

          {/* Map Personal Best */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#fbbf24', fontSize: '11px', fontWeight: 800 }}>
              <Award size={14} /> MAP PB
            </div>
            <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '16px', color: '#fbbf24', marginTop: '6px' }}>
              {personalBest}
            </div>
          </div>

          {/* Time Remaining (if Win) */}
          {isWon && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#00f2fe', fontSize: '11px', fontWeight: 800 }}>
                <Clock size={14} /> TIME
              </div>
              <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '16px', color: '#ffffff', marginTop: '6px' }}>
                {timeRemaining}s
              </div>
            </div>
          )}
        </div>

        {/* NEW PERSONAL BEST BANNER */}
        {isNewRecord && (
          <div style={{
            background: 'linear-gradient(90deg, rgba(234, 179, 8, 0.25) 0%, rgba(245, 158, 11, 0.35) 100%)',
            border: '2px solid #ffd700',
            borderRadius: '14px',
            padding: '8px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            color: '#ffd700',
            fontSize: '12px',
            fontWeight: 800,
            animation: 'pbGlowPulse 1.8s ease-in-out infinite',
            letterSpacing: '1px',
          }}>
            <Trophy size={16} /> 🏆 NEW MAP PERSONAL BEST! 🏆
          </div>
        )}

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {/* Retry / Play Again */}
          <button
            onClick={onPlayAgain}
            style={{
              width: '100%',
              background: isWon
                ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                : 'linear-gradient(90deg, #f43f5e 0%, #e11d48 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '14px',
              padding: '14px 20px',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 6px 20px rgba(0, 0, 0, 0.4)',
              transition: 'transform 0.15s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          >
            <RotateCcw size={16} />
            {isWon ? 'PLAY AGAIN' : 'TRY AGAIN'}
          </button>

          {/* BACK TO MAIN MENU BUTTON (Prominent on both Win & Fail) */}
          <button
            onClick={onExitToMenu}
            style={{
              width: '100%',
              background: 'linear-gradient(90deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
              color: '#f8fafc',
              border: '1.5px solid rgba(0, 242, 254, 0.5)',
              borderRadius: '14px',
              padding: '13px 20px',
              fontSize: '13px',
              fontWeight: 800,
              fontFamily: '"Press Start 2P", monospace',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.5), 0 0 12px rgba(0, 242, 254, 0.2)',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.borderColor = '#00f2fe';
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 242, 254, 0.35)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(0, 242, 254, 0.5)';
              e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.5), 0 0 12px rgba(0, 242, 254, 0.2)';
            }}
          >
            <ArrowLeft size={16} color="#00f2fe" />
            BACK TO MAIN MENU
          </button>

          {/* Create Another Game */}
          <button
            onClick={onCreateAnother}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.06)',
              color: '#94a3b8',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '14px',
              padding: '11px 20px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.12)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.color = '#94a3b8';
            }}
          >
            <PlusCircle size={16} />
            CREATE ANOTHER GAME
          </button>
        </div>
      </div>
    </div>
  );
};
