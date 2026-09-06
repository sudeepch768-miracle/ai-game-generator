import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Skull, RotateCcw, PlusCircle, Star, Clock, LogOut } from 'lucide-react';

interface GameOverModalProps {
  isWon: boolean;
  score: number;
  timeRemaining?: number;
  reason?: string;
  onPlayAgain: () => void;
  onCreateAnother: () => void;
  onExitToMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isWon,
  score,
  timeRemaining = 0,
  reason,
  onPlayAgain,
  onCreateAnother,
  onExitToMenu,
}) => {
  useEffect(() => {
    if (isWon) {
      // Fire celebratory confetti cannons
      const end = Date.now() + 1500;
      const colors = ['#00f2fe', '#43e97b', '#ffd700', '#ff007f'];

      const frame = () => {
        confetti({
          particleCount: 4,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: colors,
        });
        confetti({
          particleCount: 4,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [isWon]);

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(5, 8, 18, 0.9)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 35,
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '500px',
        background: isWon
          ? 'linear-gradient(145deg, #102a28 0%, #0c181f 100%)'
          : 'linear-gradient(145deg, #2a1017 0%, #150c12 100%)',
        border: `3px solid ${isWon ? '#43e97b' : '#ff0844'}`,
        borderRadius: '24px',
        boxShadow: isWon
          ? '0 0 45px rgba(67, 233, 123, 0.4), 0 20px 60px rgba(0, 0, 0, 0.9)'
          : '0 0 45px rgba(255, 8, 68, 0.4), 0 20px 60px rgba(0, 0, 0, 0.9)',
        padding: '36px 30px',
        textAlign: 'center',
        color: '#ffffff',
        fontFamily: '"Chakra Petch", sans-serif',
        animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}>
        {/* Icon Header */}
        <div style={{
          width: '70px',
          height: '70px',
          margin: '0 auto 16px auto',
          borderRadius: '50%',
          background: isWon ? 'rgba(67, 233, 123, 0.2)' : 'rgba(255, 8, 68, 0.2)',
          border: `2px solid ${isWon ? '#43e97b' : '#ff0844'}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {isWon ? (
            <Trophy size={36} color="#43e97b" />
          ) : (
            <Skull size={36} color="#ff0844" />
          )}
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '20px',
          margin: '0 0 8px 0',
          color: isWon ? '#43e97b' : '#ff0844',
          textShadow: isWon
            ? '0 0 15px rgba(67, 233, 123, 0.7)'
            : '0 0 15px rgba(255, 8, 68, 0.7)',
        }}>
          {isWon ? 'CAMPAIGN CONQUERED!' : "MISSION FAILED"}
        </h1>

        <p style={{
          fontSize: '14px',
          color: '#94a3b8',
          margin: '0 0 24px 0',
        }}>
          {isWon
            ? 'All 3 Sectors Conquered! You found all keys, met the required points thresholds, and completed the full campaign!'
            : (reason || 'The clock ran out before you could complete the objective.')}
        </p>

        {/* Stats Grid */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          borderRadius: '16px',
          padding: '16px',
          marginBottom: '28px',
          display: 'grid',
          gridTemplateColumns: isWon ? '1fr 1fr' : '1fr',
          gap: '12px',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#ffd700', fontSize: '12px', fontWeight: 700 }}>
              <Star size={16} /> TOTAL SCORE
            </div>
            <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '18px', color: '#ffffff', marginTop: '6px' }}>
              {score}
            </div>
          </div>

          {isWon && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#00f2fe', fontSize: '12px', fontWeight: 700 }}>
                <Clock size={16} /> TIME REMAINING
              </div>
              <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '18px', color: '#ffffff', marginTop: '6px' }}>
                {timeRemaining}s
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
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

          <button
            onClick={onCreateAnother}
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.08)',
              color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '14px',
              padding: '14px 20px',
              fontSize: '14px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
              e.currentTarget.style.color = '#cbd5e1';
            }}
          >
            <PlusCircle size={18} />
            CREATE ANOTHER GAME
          </button>

          <button
            onClick={onExitToMenu}
            style={{
              width: '100%',
              background: 'rgba(239, 68, 68, 0.12)',
              color: '#fca5a5',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '14px',
              padding: '12px 20px',
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
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
              e.currentTarget.style.color = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.12)';
              e.currentTarget.style.color = '#fca5a5';
            }}
          >
            <LogOut size={16} />
            EXIT TO MAIN MENU
          </button>
        </div>
      </div>
    </div>
  );
};
