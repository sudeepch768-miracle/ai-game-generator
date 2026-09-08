import React, { useState } from 'react';

interface SpiralBlackHoleProps {
  isHackerMode?: boolean;
  isSucking?: boolean;
  onClick?: () => void;
  className?: string;
  width?: number;
}

export const SpiralBlackHole: React.FC<SpiralBlackHoleProps> = ({
  isHackerMode = false,
  isSucking = false,
  onClick,
  className = '',
  width = 175,
}) => {
  const [isHovered, setIsHovered] = useState<boolean>(false);

  return (
    <div
      className={`circular-blackhole-root ${className}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: 'relative',
        width: `${width}px`,
        height: `${width}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        margin: '0 auto',
      }}
    >
      <style>{`
        /* Smooth Circular Spin Around the Singularity Core */
        @keyframes circularAccretionSpin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        @keyframes circularAccretionSpinFast {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        /* Einstein Photon Ring Pulsing Core */
        @keyframes photonCorePulse {
          0%, 100% {
            box-shadow: 0 0 10px rgba(216, 180, 254, 0.7), 0 0 22px rgba(168, 85, 247, 0.5), inset 0 0 8px #000000;
          }
          50% {
            box-shadow: 0 0 18px rgba(235, 215, 255, 0.95), 0 0 32px rgba(192, 132, 252, 0.8), inset 0 0 12px #000000;
          }
        }

        @keyframes photonHackerPulse {
          0%, 100% {
            box-shadow: 0 0 12px rgba(0, 255, 102, 0.8), 0 0 24px rgba(0, 242, 254, 0.5), inset 0 0 8px #000000;
          }
          50% {
            box-shadow: 0 0 20px rgba(0, 255, 102, 1), 0 0 40px rgba(0, 242, 254, 0.85), inset 0 0 12px #000000;
          }
        }
      `}</style>

      {/* Atmospheric Lensing Aura (Seamlessly transparent, zero black background box) */}
      <div
        style={{
          position: 'absolute',
          width: '92%',
          height: '92%',
          borderRadius: '50%',
          background: isHackerMode
            ? 'radial-gradient(circle, rgba(0, 255, 102, 0.25) 0%, rgba(0, 242, 254, 0.1) 48%, transparent 70%)'
            : 'radial-gradient(circle, rgba(168, 85, 247, 0.3) 0%, rgba(124, 58, 237, 0.12) 48%, transparent 70%)',
          filter: 'blur(10px)',
          pointerEvents: 'none',
        }}
      />

      {/* Circular Spinning Accretion Disk: 100% Transparent Background (All Background Blackspace Removed) */}
      <img
        src="/assets/blackhole_cutout.png"
        alt="Black Hole"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          transformOrigin: '50% 50%',
          animation: isSucking
            ? 'circularAccretionSpinFast 0.45s linear infinite'
            : isHovered
            ? 'circularAccretionSpinFast 4.2s linear infinite'
            : 'circularAccretionSpin 14s linear infinite',
          filter: isHackerMode
            ? 'hue-rotate(240deg) saturate(1.8) brightness(1.2) drop-shadow(0 0 16px rgba(0, 255, 102, 0.6))'
            : isHovered
            ? 'brightness(1.22) contrast(1.1) drop-shadow(0 0 20px rgba(192, 132, 252, 0.75))'
            : 'drop-shadow(0 0 12px rgba(168, 85, 247, 0.45))',
          transition: 'filter 0.3s ease',
          pointerEvents: 'none',
          display: 'block',
        }}
      />

      {/* Central Event Horizon Pure Black Void with Glowing Photon Ring */}
      <div
        style={{
          position: 'absolute',
          width: `${Math.round(width * 0.165)}px`,
          height: `${Math.round(width * 0.165)}px`,
          borderRadius: '50%',
          background: '#000000',
          border: isHackerMode ? '1.5px solid rgba(0, 255, 102, 0.85)' : '1.5px solid rgba(235, 215, 255, 0.8)',
          animation: isHackerMode
            ? 'photonHackerPulse 2.5s ease-in-out infinite'
            : 'photonCorePulse 2.5s ease-in-out infinite',
          zIndex: 5,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
