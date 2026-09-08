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
  width = 200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isHoveredRef = useRef<boolean>(false);
  const isSuckingRef = useRef<boolean>(false);
  const isHackerModeRef = useRef<boolean>(isHackerMode);

  useEffect(() => {
    isSuckingRef.current = isSucking;
  }, [isSucking]);

  useEffect(() => {
    isHackerModeRef.current = isHackerMode;
  }, [isHackerMode]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    // Load user reference image for base texture & cosmic stars
    const baseImg = new Image();
    baseImg.src = '/assets/blackhole_smooth.png';
    let imgLoaded = false;
    baseImg.onload = () => {
      imgLoaded = true;
    };

    // Plasma streamline particles for differential Keplerian accretion flow
    const numParticles = 240;
    const particles: Array<{
      r: number;
      baseTheta: number;
      speedFactor: number;
      size: number;
      alpha: number;
      colorIdx: number;
    }> = [];

    for (let i = 0; i < numParticles; i++) {
      particles.push({
        r: 34 + Math.pow(Math.random(), 1.35) * 145, // radial distance from event horizon
        baseTheta: Math.random() * Math.PI * 2,
        speedFactor: 0.85 + Math.random() * 0.35,
        size: 1.4 + Math.random() * 3.0,
        alpha: 0.35 + Math.random() * 0.65,
        colorIdx: Math.floor(Math.random() * 4),
      });
    }

    const numArms = 5;

    const render = () => {
      // Speed modulation: normal slow cosmic drift, faster on hover, hyper-whirlpool during suction
      let speed = 0.016;
      if (isSuckingRef.current) {
        speed = 0.065;
      } else if (isHoveredRef.current) {
        speed = 0.032;
      }
      t += speed;

      const dpr = window.devicePixelRatio || 1;
      const displayWidth = canvas.clientWidth || width;
      const displayHeight = canvas.clientHeight || Math.round(width * 0.625);

      if (canvas.width !== Math.round(displayWidth * dpr) || canvas.height !== Math.round(displayHeight * dpr)) {
        canvas.width = Math.round(displayWidth * dpr);
        canvas.height = Math.round(displayHeight * dpr);
      }

      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, displayWidth, displayHeight);

      const cx = displayWidth / 2;
      const cy = displayHeight / 2;
      const s = displayWidth / 460; // Proportional scale factor
      const hacker = isHackerModeRef.current;

      // Colors matching user reference image vs Hacker Mode
      const colors = hacker
        ? [
            'rgba(255, 255, 255, ',
            'rgba(167, 243, 208, ',
            'rgba(0, 255, 102, ',
            'rgba(0, 242, 254, ',
          ]
        : [
            'rgba(255, 255, 255, ',
            'rgba(235, 215, 255, ',
            'rgba(192, 132, 252, ',
            'rgba(124, 58, 237, ',
          ];

      // 1. Draw base user image with subtle gravitational breathing (silhouette remains stationary!)
      if (imgLoaded) {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(s, s);
        ctx.globalAlpha = 0.68 + Math.sin(t * 1.2) * 0.08;

        if (hacker) {
          ctx.filter = 'hue-rotate(240deg) saturate(1.8) brightness(1.2)';
        }

        ctx.drawImage(baseImg, -244, -204, 489, 408);
        ctx.restore();
      }

      // 2. Tilted Accretion Disk Space: -11.3 deg inclination, scaleY: 0.62
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(s, s);
      ctx.rotate((-11.3 * Math.PI) / 180);
      ctx.scale(1.0, 0.62);

      // Diffuse outer gravitational glow
      const hazeGrad = ctx.createRadialGradient(0, 0, 32, 0, 0, 195);
      if (hacker) {
        hazeGrad.addColorStop(0, 'rgba(0, 255, 102, 0.4)');
        hazeGrad.addColorStop(0.35, 'rgba(0, 242, 254, 0.2)');
        hazeGrad.addColorStop(0.7, 'rgba(0, 50, 20, 0.1)');
        hazeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        hazeGrad.addColorStop(0, 'rgba(147, 51, 234, 0.45)');
        hazeGrad.addColorStop(0.35, 'rgba(192, 132, 252, 0.22)');
        hazeGrad.addColorStop(0.7, 'rgba(75, 20, 120, 0.1)');
        hazeGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = hazeGrad;
      ctx.beginPath();
      ctx.arc(0, 0, 195, 0, Math.PI * 2);
      ctx.fill();

      // Flowing logarithmic spiral arms (inner spins faster = Keplerian differential rotation)
      for (let a = 0; a < numArms; a++) {
        const armOffset = (a / numArms) * Math.PI * 2;
        ctx.beginPath();
        let first = true;
        for (let r = 34; r < 185; r += 4) {
          // Keplerian differential rotation: v ~ 1 / r^0.65
          const keplerAngle = (115 / Math.pow(r, 0.65)) * t * 0.45;
          const theta = armOffset + Math.log(r / 32) * 2.75 + keplerAngle;
          const x = r * Math.cos(theta);
          const y = r * Math.sin(theta);

          if (first) {
            ctx.moveTo(x, y);
            first = false;
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.strokeStyle = hacker
          ? (a % 2 === 0 ? 'rgba(0, 255, 102, 0.45)' : 'rgba(0, 242, 254, 0.38)')
          : (a % 2 === 0 ? 'rgba(235, 215, 255, 0.45)' : 'rgba(168, 85, 247, 0.38)');
        ctx.lineWidth = 12 * (1 - a * 0.07);
        ctx.stroke();

        // High-energy inner core streamer
        ctx.strokeStyle = hacker ? 'rgba(255, 255, 255, 0.65)' : 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 3.5;
        ctx.stroke();
      }

      // Flowing plasma particles / stars orbiting the singularity
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const omega = (92 / Math.pow(p.r, 0.65)) * p.speedFactor;
        const currentTheta = p.baseTheta + omega * t;

        const x = p.r * Math.cos(currentTheta);
        const y = p.r * Math.sin(currentTheta);

        // Relativistic Doppler beaming: approaching side (left x < 0) shines brighter
        const dopplerBoost = x < 0 ? 1.4 : 0.75;
        const alpha = Math.min(1.0, p.alpha * dopplerBoost);

        ctx.fillStyle = colors[p.colorIdx] + alpha + ')';
        ctx.beginPath();
        ctx.arc(x, y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Inner accretion edge high-temperature photon glow
      const innerGlow = ctx.createRadialGradient(0, 0, 28, 0, 0, 48);
      if (hacker) {
        innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        innerGlow.addColorStop(0.3, 'rgba(0, 255, 102, 0.85)');
        innerGlow.addColorStop(0.7, 'rgba(0, 242, 254, 0.35)');
        innerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      } else {
        innerGlow.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        innerGlow.addColorStop(0.3, 'rgba(225, 195, 255, 0.85)');
        innerGlow.addColorStop(0.7, 'rgba(147, 51, 234, 0.4)');
        innerGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
      }
      ctx.fillStyle = innerGlow;
      ctx.beginPath();
      ctx.arc(0, 0, 48, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // 3. Central Event Horizon Void (Pure Circular Pitch-Black Shadow with Glowing Einstein Photon Ring)
      ctx.save();
      ctx.translate(cx, cy);
      ctx.scale(s, s);

      // Einstein Photon Ring (thin brilliant circular boundary)
      const photonGlow = 0.85 + Math.sin(t * 3.5) * 0.15;
      ctx.strokeStyle = hacker ? `rgba(0, 255, 102, ${photonGlow})` : `rgba(255, 255, 255, ${photonGlow})`;
      ctx.lineWidth = 2.0;
      ctx.shadowColor = hacker ? '#00ff66' : '#d8b4fe';
      ctx.shadowBlur = hacker ? 14 : 12;
      ctx.beginPath();
      ctx.arc(0, 0, 29, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Pure pitch-black event horizon void (completely opaque)
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(0, 0, 28, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [width]);

  return (
    <div
      className={`realistic-blackhole-root ${className}`}
      onClick={onClick}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
      }}
      style={{
        position: 'relative',
        width: `${width}px`,
        maxWidth: '92vw',
        aspectRatio: '16 / 10',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        margin: '0 auto',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          pointerEvents: 'auto',
        }}
      />
    </div>
  );
};
