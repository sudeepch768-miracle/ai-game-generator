import React, { useState } from 'react';

interface SpiralBlackHoleProps {
  isHackerMode?: boolean;
  isSucking?: boolean;
  onClick?: () => void;
  className?: string;
  width?: number;
  height?: number;
}

export const SpiralBlackHole: React.FC<SpiralBlackHoleProps> = ({
  isHackerMode = false,
  isSucking = false,
  onClick,
  className = '',
  width = 300,
  height = 210,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div
      className={`spiral-blackhole-root ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${height}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        margin: '0 auto',
      }}
      title={isHackerMode ? 'Singularity Core: Click to Restore Reality' : 'Singularity Core: Click to Collapse Reality into Hacker Matrix'}
    >
      <style>{`
        @keyframes spiralVortexRotation {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes spiralVortexFast {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes corePhotonPulse {
          0%, 100% {
            box-shadow: 0 0 14px rgba(200, 180, 230, 0.8), 0 0 28px rgba(168, 85, 247, 0.6), inset 0 0 10px #000000;
          }
          50% {
            box-shadow: 0 0 22px rgba(230, 210, 255, 1), 0 0 45px rgba(192, 132, 252, 0.9), inset 0 0 16px #000000;
          }
        }

        @keyframes coreHackerPhotonPulse {
          0%, 100% {
            box-shadow: 0 0 16px rgba(0, 255, 102, 0.8), 0 0 32px rgba(0, 242, 254, 0.6), inset 0 0 12px #000000;
          }
          50% {
            box-shadow: 0 0 25px rgba(0, 255, 102, 1), 0 0 50px rgba(0, 255, 102, 0.9), inset 0 0 18px #000000;
          }
        }

        @keyframes haloLensingBreathe {
          0%, 100% { transform: scale(1.0); opacity: 0.7; }
          50% { transform: scale(1.08); opacity: 0.95; }
        }

        @keyframes badgePulsePrompt {
          0%, 100% { transform: translateX(-50%) scale(1.0); opacity: 0.85; }
          50% { transform: translateX(-50%) scale(1.05); opacity: 1; }
        }

        .spiral-blackhole-disk {
          transition: filter 0.4s ease, transform 0.3s ease;
        }
      `}</style>

      {/* Outer Cosmic Nebular Glow Backdrop */}
      <div
        style={{
          position: 'absolute',
          width: '125%',
          height: '125%',
          borderRadius: '50%',
          background: isHackerMode
            ? 'radial-gradient(ellipse at 50% 50%, rgba(0, 255, 102, 0.25) 0%, rgba(0, 242, 254, 0.1) 45%, transparent 72%)'
            : 'radial-gradient(ellipse at 50% 50%, rgba(168, 85, 247, 0.35) 0%, rgba(124, 58, 237, 0.15) 45%, transparent 72%)',
          filter: 'blur(14px)',
          animation: 'haloLensingBreathe 5s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Tilted Swirling Accretion Disk (User's Exact Reference Image) */}
      <div
        className="spiral-blackhole-disk"
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: isSucking
            ? 'spiralVortexFast 0.6s linear infinite'
            : (isHovered ? 'spiralVortexFast 4.5s linear infinite' : 'spiralVortexRotation 14s linear infinite'),
          filter: isHackerMode
            ? 'hue-rotate(240deg) saturate(1.5) brightness(1.2) drop-shadow(0 0 20px rgba(0, 255, 102, 0.6))'
            : (isHovered
              ? 'brightness(1.25) contrast(1.1) drop-shadow(0 0 25px rgba(192, 132, 252, 0.75))'
              : 'drop-shadow(0 0 15px rgba(168, 85, 247, 0.45))'),
          transform: isHovered ? 'scale(1.06)' : 'scale(1.0)',
        }}
      >
        <img
          src="/assets/blackhole_smooth.png"
          alt="Singularity Accretion Disk"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            pointerEvents: 'none',
          }}
        />
      </div>

      {/* Counter-Rotating Subtle Wispy Inner Spiral Layer for depth */}
      <div
        style={{
          position: 'absolute',
          width: '75%',
          height: '75%',
          borderRadius: '50%',
          background: isHackerMode
            ? 'conic-gradient(from 180deg, transparent 0deg, rgba(0, 255, 102, 0.25) 90deg, transparent 180deg, rgba(0, 242, 254, 0.35) 270deg, transparent 360deg)'
            : 'conic-gradient(from 180deg, transparent 0deg, rgba(200, 180, 230, 0.3) 90deg, transparent 180deg, rgba(168, 85, 247, 0.4) 270deg, transparent 360deg)',
          filter: 'blur(3px)',
          animation: 'spiralVortexFast 7s linear infinite reverse',
          pointerEvents: 'none',
          opacity: 0.65,
        }}
      />

      {/* Central Pure Pitch-Black Event Horizon Void */}
      <div
        style={{
          position: 'absolute',
          width: `${Math.round(width * 0.17)}px`,
          height: `${Math.round(height * 0.22)}px`,
          borderRadius: '50%',
          background: '#000000',
          border: isHackerMode ? '1.5px solid rgba(0, 255, 102, 0.7)' : '1.5px solid rgba(230, 215, 255, 0.65)',
          animation: isHackerMode ? 'coreHackerPhotonPulse 2.5s ease-in-out infinite' : 'corePhotonPulse 2.5s ease-in-out infinite',
          zIndex: 5,
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '3px',
            height: '3px',
            borderRadius: '50%',
            background: isHackerMode ? '#00ff66' : '#ffffff',
            boxShadow: isHackerMode ? '0 0 6px #00ff66' : '0 0 6px #c084fc',
          }}
        />
      </div>

      {/* Interactive Prompt Badge below Black Hole */}
      <div
        style={{
          position: 'absolute',
          bottom: '-30px',
          left: '50%',
          transform: 'translateX(-50%)',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          padding: '4px 12px',
          borderRadius: '14px',
          background: isHackerMode
            ? 'rgba(0, 255, 102, 0.15)'
            : 'rgba(168, 85, 247, 0.18)',
          border: isHackerMode
            ? '1px solid rgba(0, 255, 102, 0.5)'
            : '1px solid rgba(168, 85, 247, 0.5)',
          color: isHackerMode ? '#00ff66' : '#d8b4fe',
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '8px',
          letterSpacing: '0.5px',
          animation: 'badgePulsePrompt 2.2s ease-in-out infinite',
          boxShadow: isHackerMode
            ? '0 0 12px rgba(0, 255, 102, 0.25)'
            : '0 0 12px rgba(168, 85, 247, 0.25)',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <span>{isHackerMode ? '⚡ [CLICK TO RESTORE REALITY]' : '🌌 [CLICK TO WARP INTO HACKER MATRIX]'}</span>
      </div>
    </div>
  );
};
