import React, { useEffect, useRef } from 'react';

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
  width = 440,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.play().catch(() => {
      // Autoplay handled by muted + playsInline
    });
  }, []);

  // Accelerate playback speed during suction / toilet flush vortex
  useEffect(() => {
    if (!videoRef.current) return;
    if (isSucking) {
      videoRef.current.playbackRate = 2.4;
    } else {
      videoRef.current.playbackRate = 1.0;
    }
  }, [isSucking]);

  return (
    <div
      className={`realistic-blackhole-root ${className}`}
      onClick={onClick}
      style={{
        position: 'relative',
        width: `min(94vw, ${width}px)`,
        aspectRatio: '16 / 9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        margin: '0 auto',
      }}
    >
      <style>{`
        @keyframes blackholeLensingPulse {
          0%, 100% {
            opacity: 0.65;
            transform: scale(0.98);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.04);
          }
        }
      `}</style>

      {/* Atmospheric Gravitational Aura Glow */}
      <div
        style={{
          position: 'absolute',
          width: '75%',
          height: '60%',
          borderRadius: '50%',
          background: isHackerMode
            ? 'radial-gradient(ellipse at 50% 50%, rgba(0, 255, 102, 0.3) 0%, rgba(0, 242, 254, 0.12) 50%, transparent 75%)'
            : 'radial-gradient(ellipse at 50% 50%, rgba(255, 180, 100, 0.35) 0%, rgba(200, 120, 255, 0.15) 50%, transparent 75%)',
          filter: 'blur(16px)',
          animation: 'blackholeLensingPulse 4.5s ease-in-out infinite',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Looping Realistic Video (Exact Blender Relativistic Accretion Simulation from Reddit) */}
      <video
        ref={videoRef}
        src="/assets/blackhole_realistic.mp4"
        poster="/assets/reddit_blackhole.png"
        autoPlay
        loop
        muted
        playsInline
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none',
          zIndex: 2,
          mixBlendMode: 'screen',
          filter: isHackerMode
            ? 'hue-rotate(95deg) saturate(2.0) brightness(1.25) drop-shadow(0 0 20px rgba(0, 255, 102, 0.7))'
            : isSucking
            ? 'brightness(1.7) contrast(1.2) drop-shadow(0 0 35px rgba(255, 200, 120, 0.8))'
            : 'drop-shadow(0 0 22px rgba(255, 190, 120, 0.4)) drop-shadow(0 0 45px rgba(180, 90, 240, 0.25))',
          transition: 'filter 0.5s ease',
        }}
      />

      {/* Central Opaque Void Plate: Guarantees the Event Horizon Shadow Remains Pure Deep Black */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -46%)',
          width: '24%',
          height: '38%',
          borderRadius: '50%',
          background: '#000000',
          boxShadow: isHackerMode
            ? '0 0 10px rgba(0, 255, 102, 0.5), inset 0 0 12px #000000'
            : '0 0 10px rgba(255, 220, 180, 0.5), inset 0 0 12px #000000',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};
