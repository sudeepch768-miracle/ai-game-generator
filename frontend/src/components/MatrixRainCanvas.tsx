import React, { useEffect, useRef } from 'react';

interface MatrixRainCanvasProps {
  opacity?: number;
  color?: string;
  fontSize?: number;
}

export const MatrixRainCanvas: React.FC<MatrixRainCanvasProps> = ({
  opacity = 0.75,
  color = '#00ff66',
  fontSize = 14,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Matrix characters: mix of hex, binary, katakana-like symbols, and hacker keywords
    const chars = '0123456789ABCDEF01010101XYZΩλΨROOTBYPASSHACKNULL0x9F0xDE0x42COREMATRIX';
    const columns = Math.floor(width / fontSize);
    const drops: number[] = Array.from({ length: columns }).map(() => Math.floor(Math.random() * -50));

    let lastFrame = performance.now();
    const fpsInterval = 1000 / 32; // ~32 FPS for retro feel and smooth performance

    const render = (now: number) => {
      animId = requestAnimationFrame(render);
      const elapsed = now - lastFrame;
      if (elapsed < fpsInterval) return;
      lastFrame = now - (elapsed % fpsInterval);

      // Semi-transparent fade layer to create cascading trails
      ctx.fillStyle = 'rgba(4, 10, 7, 0.09)';
      ctx.fillRect(0, 0, width, height);

      ctx.font = `${fontSize}px monospace`;

      for (let i = 0; i < drops.length; i++) {
        const text = chars.charAt(Math.floor(Math.random() * chars.length));
        const x = i * fontSize;
        const y = drops[i] * fontSize;

        // Head of stream is brighter/white-cyan
        if (Math.random() > 0.88) {
          ctx.fillStyle = '#ffffff';
          ctx.shadowColor = '#00f2fe';
          ctx.shadowBlur = 8;
        } else {
          ctx.fillStyle = color;
          ctx.shadowColor = color;
          ctx.shadowBlur = 4;
        }

        ctx.fillText(text, x, y);
        ctx.shadowBlur = 0;

        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [color, fontSize]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        opacity,
      }}
    />
  );
};
