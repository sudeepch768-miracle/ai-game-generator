import React from 'react';

interface BlackHoleIconProps {
  size?: number;
  className?: string;
  showTooltip?: boolean;
}

export const BlackHoleIcon: React.FC<BlackHoleIconProps> = ({
  size = 72,
  className = '',
  showTooltip = true,
}) => {
  return (
    <div
      className={`blackhole-container ${className}`}
      style={{
        position: 'relative',
        width: `${size}px`,
        height: `${size}px`,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        userSelect: 'none',
        cursor: 'pointer',
      }}
      title={showTooltip ? 'Holoverse Gravitational Singularity: Multimodal Warp Engine' : undefined}
    >
      <style>{`
        @keyframes blackHoleAccretion {
          0% { transform: rotate(0deg) scaleY(0.44); }
          50% { transform: rotate(180deg) scaleY(0.52); }
          100% { transform: rotate(360deg) scaleY(0.44); }
        }

        @keyframes blackHoleAccretionInner {
          0% { transform: rotate(360deg) scaleY(0.40); }
          100% { transform: rotate(0deg) scaleY(0.40); }
        }

        @keyframes blackHolePhotonRing {
          0%, 100% {
            box-shadow: 0 0 14px rgba(0, 242, 254, 0.9), 0 0 28px rgba(168, 85, 247, 0.7), inset 0 0 8px rgba(0, 242, 254, 0.8);
            transform: scale(1.0);
          }
          50% {
            box-shadow: 0 0 22px rgba(0, 242, 254, 1), 0 0 40px rgba(255, 0, 127, 0.85), inset 0 0 14px rgba(0, 242, 254, 1);
            transform: scale(1.08);
          }
        }

        @keyframes lensingDistortion {
          0%, 100% {
            border-radius: 50%;
            transform: scale(1.15) rotate(0deg);
          }
          50% {
            border-radius: 48% 52% 47% 53% / 53% 48% 52% 47%;
            transform: scale(1.22) rotate(180deg);
          }
        }

        @keyframes relativisticJet {
          0%, 100% { opacity: 0.6; height: 28%; }
          50% { opacity: 0.95; height: 44%; }
        }

        .blackhole-hover-scale {
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .blackhole-hover-scale:hover {
          transform: scale(1.15);
        }
      `}</style>

      {/* Relativistic Polar Jets */}
      <div
        style={{
          position: 'absolute',
          top: '-15%',
          width: '3px',
          background: 'linear-gradient(to top, rgba(0, 242, 254, 0.9), transparent)',
          borderRadius: '4px',
          boxShadow: '0 0 10px #00f2fe',
          animation: 'relativisticJet 2.2s ease-in-out infinite',
          zIndex: 1,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '-15%',
          width: '3px',
          background: 'linear-gradient(to bottom, rgba(255, 0, 127, 0.9), transparent)',
          borderRadius: '4px',
          boxShadow: '0 0 10px #ff007f',
          animation: 'relativisticJet 2.2s ease-in-out infinite 0.5s',
          zIndex: 1,
        }}
      />

      {/* Gravitational Lensing Outer Halo */}
      <div
        style={{
          position: 'absolute',
          inset: '-10%',
          border: '2px solid rgba(0, 242, 254, 0.35)',
          animation: 'lensingDistortion 7s linear infinite',
          filter: 'blur(3px)',
          pointerEvents: 'none',
        }}
      />

      {/* Outer Swirling Accretion Disk */}
      <div
        style={{
          position: 'absolute',
          width: '135%',
          height: '135%',
          borderRadius: '50%',
          background: 'conic-gradient(from 0deg, #ff007f, #a855f7 25%, #00f2fe 50%, #ffd700 75%, #ff007f)',
          filter: 'blur(4px)',
          opacity: 0.85,
          animation: 'blackHoleAccretion 4.5s linear infinite',
          zIndex: 2,
        }}
      />

      {/* Inner High-Velocity Accretion Stream */}
      <div
        style={{
          position: 'absolute',
          width: '112%',
          height: '112%',
          borderRadius: '50%',
          background: 'conic-gradient(from 180deg, #00f2fe, #ffd700 35%, #ff007f 70%, #00f2fe)',
          filter: 'blur(2px)',
          opacity: 0.95,
          animation: 'blackHoleAccretionInner 2.2s linear infinite',
          zIndex: 3,
        }}
      />

      {/* Photon Sphere Ring (Einstein Ring Glow) */}
      <div
        style={{
          position: 'absolute',
          width: '54%',
          height: '54%',
          borderRadius: '50%',
          border: '2px solid #ffffff',
          animation: 'blackHolePhotonRing 2.5s ease-in-out infinite',
          zIndex: 4,
        }}
      />

      {/* Event Horizon (Pure Black Singularity Core) */}
      <div
        className="blackhole-hover-scale"
        style={{
          position: 'relative',
          width: '46%',
          height: '46%',
          borderRadius: '50%',
          background: 'radial-gradient(circle at 40% 40%, #02040a 0%, #000000 100%)',
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.95), inset 0 0 12px #000000',
          border: '1px solid rgba(0, 242, 254, 0.4)',
          zIndex: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div
          style={{
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.85)',
            boxShadow: '0 0 6px #00f2fe',
          }}
        />
      </div>
    </div>
  );
};
