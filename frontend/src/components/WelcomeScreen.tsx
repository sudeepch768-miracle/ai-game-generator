import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Shield, Zap, ChevronRight } from 'lucide-react';
import { sound } from '../engine/sound';

export interface WelcomeScreenProps {
  onEnter: () => void;
  onTransitionStart?: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onEnter, onTransitionStart }) => {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const triggeredRef = useRef(false);

  const startTransition = useCallback(() => {
    if (triggeredRef.current) return;
    triggeredRef.current = true;

    setIsTransitioning(true);
    sound.playWelcomeIgnition();
    onTransitionStart?.();

    // 1100ms cinematic fluid zoom dive into the game
    setTimeout(() => {
      onEnter();
    }, 1100);
  }, [onEnter, onTransitionStart]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      startTransition();
    };

    const handlePointerDown = () => {
      startTransition();
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('pointerdown', handlePointerDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [startTransition]);

  // 15 Accordion slats forming the curved arch
  const SLAT_COUNT = 15;
  const midIndex = (SLAT_COUNT - 1) / 2; // index 7 is center
  const slats = Array.from({ length: SLAT_COUNT }, (_, i) => i);

  // Easing constant for ultra-fluid cinematic motion
  const FLUID_BEZIER = 'cubic-bezier(0.22, 1, 0.36, 1)';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 9999,
        overflow: 'hidden',
        cursor: isTransitioning ? 'default' : 'pointer',
        background: isTransitioning ? 'transparent' : '#04060d',
        userSelect: 'none',
        perspective: '1200px',
        perspectiveOrigin: '50% 50%',
        transformStyle: 'preserve-3d',
        transition: `background 0.8s ease`,
      }}
    >
      <style>{`
        @keyframes welcomeGridPan {
          0% { background-position: 0 0; }
          100% { background-position: 60px 60px; }
        }

        @keyframes welcomePromptBlink {
          0%, 100% { opacity: 0.95; transform: translateY(0); }
          50% { opacity: 0.4; transform: translateY(2px); }
        }

        @keyframes welcomeGlitchText {
          0%, 100% {
            text-shadow: -2px -2px 0 #00f2fe, 2px 2px 0 #ff007f, 0 0 35px rgba(0, 242, 254, 0.65);
            transform: translate3d(0, 0, 0);
          }
          25% {
            text-shadow: -3px 2px 0 #00f2fe, 3px -2px 0 #ff007f, 0 0 50px rgba(0, 242, 254, 0.85);
            transform: translate3d(-1px, 1px, 0);
          }
          50% {
            text-shadow: 2px -2px 0 #00ff66, -2px 2px 0 #ff007f, 0 0 40px rgba(0, 255, 102, 0.7);
            transform: translate3d(1px, -1px, 0);
          }
          75% {
            text-shadow: -2px 1px 0 #00f2fe, 2px -1px 0 #ff007f, 0 0 45px rgba(255, 0, 127, 0.75);
            transform: translate3d(-1px, -1px, 0);
          }
        }
      `}</style>

      {/* Cyberpunk Grid Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(to right, rgba(0, 242, 254, 0.07) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 242, 254, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          animation: 'welcomeGridPan 20s linear infinite',
          opacity: isTransitioning ? 0 : 0.75,
          transform: isTransitioning ? 'scale3d(2.4, 2.4, 1)' : 'scale3d(1, 1, 1)',
          transition: `transform 1100ms ${FLUID_BEZIER}, opacity 750ms ease`,
          pointerEvents: 'none',
          willChange: 'transform, opacity',
        }}
      />

      {/* Solid Black Vignette Mask that dissolves smoothly during the zoom-in reveal */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(4, 6, 13, 0.8) 0%, #04060d 75%)',
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'scale3d(1.8, 1.8, 1)' : 'scale3d(1, 1, 1)',
          transition: `transform 1100ms ${FLUID_BEZIER}, opacity 800ms ease`,
          pointerEvents: 'none',
          willChange: 'transform, opacity',
        }}
      />

      {/* Radial Ambient Holographic Flare */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, rgba(0, 242, 254, 0.2) 0%, rgba(255, 0, 127, 0.1) 35%, transparent 70%)',
          opacity: isTransitioning ? 0 : 1,
          transform: isTransitioning ? 'scale3d(2.6, 2.6, 1)' : 'scale3d(1, 1, 1)',
          transition: `transform 1100ms ${FLUID_BEZIER}, opacity 700ms ease`,
          pointerEvents: 'none',
          willChange: 'transform, opacity',
        }}
      />

      {/* Top and Bottom Curved Accordion Arch Borders (Inspired by Awwwards concave frame) */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '14vh',
          pointerEvents: 'none',
          zIndex: 8,
          transform: isTransitioning ? 'translate3d(0, -135%, 0) scaleY(1.4)' : 'translate3d(0, 0, 0) scaleY(1)',
          transition: `transform 1100ms ${FLUID_BEZIER}`,
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <path
            d="M 0,0 L 1000,0 L 1000,45 Q 500,95 0,45 Z"
            fill="#04060d"
          />
        </svg>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          width: '100%',
          height: '14vh',
          pointerEvents: 'none',
          zIndex: 8,
          transform: isTransitioning ? 'translate3d(0, 135%, 0) scaleY(1.4)' : 'translate3d(0, 0, 0) scaleY(1)',
          transition: `transform 1100ms ${FLUID_BEZIER}`,
          willChange: 'transform',
        }}
      >
        <svg
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          style={{ width: '100%', height: '100%', display: 'block' }}
        >
          <path
            d="M 0,55 Q 500,5 1000,55 L 1000,100 L 0,100 Z"
            fill="#04060d"
          />
        </svg>
      </div>

      {/* Accordion Slats: Curved Arch that parts smoothly and fluidly outward */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 'clamp(4px, 0.8vw, 10px)',
            width: 'clamp(320px, 86vw, 1100px)',
            height: 'clamp(280px, 44vh, 460px)',
            position: 'relative',
          }}
        >
          {slats.map((index) => {
            const normalizedDist = Math.abs(index - midIndex) / midIndex; // 0 center -> 1 edge
            const heightPercent = 38 + Math.pow(normalizedDist, 2) * 58; // 38% center -> 96% edge
            const isCenterSlat = index === midIndex;
            const isNearCenter = Math.abs(index - midIndex) <= 1;

            let slatTransform = 'translate3d(0, 0, 0) scale3d(1, 1, 1)';
            if (isTransitioning) {
              if (isCenterSlat) {
                // Center slat expands into wide aperture
                slatTransform = 'translate3d(0, 0, 0) scale3d(22, 14, 1)';
              } else if (index < midIndex) {
                // Left slats glide rapidly off to the left with liquid inertia
                const dist = midIndex - index;
                slatTransform = `translate3d(-${dist * 20 + 26}vw, 0, 0) scale3d(${1 + dist * 0.15}, ${1 + dist * 0.3}, 1)`;
              } else {
                // Right slats glide rapidly off to the right
                const dist = index - midIndex;
                slatTransform = `translate3d(${dist * 20 + 26}vw, 0, 0) scale3d(${1 + dist * 0.15}, ${1 + dist * 0.3}, 1)`;
              }
            }

            // Staggered delay based on distance from center for liquid ripple wave
            const staggerDelay = Math.pow(normalizedDist, 1.2) * 80;

            return (
              <div
                key={index}
                style={{
                  flex: 1,
                  height: `${heightPercent}%`,
                  borderRadius: '6px',
                  background: isNearCenter
                    ? 'linear-gradient(180deg, rgba(0, 242, 254, 0.08) 0%, rgba(255, 0, 127, 0.05) 50%, rgba(0, 242, 254, 0.08) 100%)'
                    : 'linear-gradient(180deg, rgba(0, 242, 254, 0.04) 0%, rgba(15, 23, 42, 0.6) 50%, rgba(0, 242, 254, 0.04) 100%)',
                  border: isNearCenter
                    ? '1px solid rgba(0, 242, 254, 0.4)'
                    : '1px solid rgba(0, 242, 254, 0.18)',
                  boxShadow: isNearCenter
                    ? '0 0 20px rgba(0, 242, 254, 0.15), inset 0 0 15px rgba(255, 0, 127, 0.08)'
                    : 'none',
                  transform: slatTransform,
                  opacity: isTransitioning ? 0 : 0.85,
                  transition: `transform 1100ms ${FLUID_BEZIER} ${staggerDelay}ms, opacity 850ms ${FLUID_BEZIER} ${staggerDelay}ms`,
                  willChange: 'transform, opacity',
                  position: 'relative',
                }}
              />
            );
          })}
        </div>
      </div>

      {/* Optical Warp Aperture / Hyperspace Bloom centered on HOLOVERSE title */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '280px',
          height: '280px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0, 242, 254, 0.85) 0%, rgba(255, 0, 127, 0.45) 40%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 18,
          transform: isTransitioning
            ? 'translate3d(-50%, -50%, 0) scale3d(16, 16, 1)'
            : 'translate3d(-50%, -50%, 0) scale3d(0.5, 0.5, 1)',
          opacity: isTransitioning ? 0 : 0,
          transition: isTransitioning
            ? `transform 1100ms ${FLUID_BEZIER}, opacity 850ms ease 250ms`
            : 'none',
          willChange: 'transform, opacity',
        }}
      />

      {/* Main Center Content: Title, Badass Tagline, and Interactive Prompt */}
      <div
        style={{
          position: 'relative',
          zIndex: 20,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          padding: '20px',
          textAlign: 'center',
          pointerEvents: 'none',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Top Badass Cyber Tag / Status */}
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(15, 23, 42, 0.92)',
            border: '1px solid rgba(0, 242, 254, 0.55)',
            borderRadius: '24px',
            padding: '7px 20px',
            color: '#00f2fe',
            fontFamily: '"Chakra Petch", sans-serif',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '2.5px',
            textTransform: 'uppercase',
            marginBottom: '26px',
            boxShadow: '0 0 25px rgba(0, 242, 254, 0.3)',
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translate3d(0, -35px, 0) scale3d(0.92, 0.92, 1)' : 'translate3d(0, 0, 0) scale3d(1, 1, 1)',
            transition: `transform 400ms ${FLUID_BEZIER}, opacity 350ms ease`,
            willChange: 'transform, opacity',
          }}
        >
          <Sparkles size={14} color="#00f2fe" />
          <span>NEURAL WORLD COMPILER // PROTOCOL OMEGA</span>
          <Shield size={14} color="#00f2fe" />
        </div>

        {/* WELCOME TO Subtitle */}
        <p
          style={{
            fontFamily: '"Chakra Petch", sans-serif',
            fontSize: 'clamp(14px, 2vw, 22px)',
            fontWeight: 700,
            letterSpacing: '8px',
            color: '#94a3b8',
            textTransform: 'uppercase',
            margin: '0 0 10px 0',
            opacity: isTransitioning ? 0 : 0.9,
            transform: isTransitioning ? 'translate3d(0, -25px, 0) scale3d(0.92, 0.92, 1)' : 'translate3d(0, 0, 0) scale3d(1, 1, 1)',
            transition: `transform 400ms ${FLUID_BEZIER}, opacity 350ms ease`,
            willChange: 'transform, opacity',
          }}
        >
          WELCOME TO
        </p>

        {/* Main Giant HOLOVERSE Title: Ultra-fluid 3D Camera Dive */}
        <div
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: '50% 50%',
            transform: isTransitioning ? 'translate3d(0, 0, 950px)' : 'translate3d(0, 0, 0)',
            opacity: isTransitioning ? 0 : 1,
            transition: `transform 1100ms ${FLUID_BEZIER}, opacity 450ms ease 550ms`,
            willChange: 'transform, opacity',
            position: 'relative',
            zIndex: 25,
          }}
        >
          <h1
            style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 'clamp(34px, 8vw, 88px)',
              letterSpacing: 'clamp(4px, 1.2vw, 12px)',
              margin: '0 0 24px 0',
              lineHeight: 1.1,
              animation: isTransitioning ? 'none' : 'welcomeGlitchText 3.5s ease-in-out infinite',
              color: '#ffffff',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              transformStyle: 'preserve-3d',
            }}
          >
            {'HOLOVERSE'.split('').map((char, i) => {
              // Offset from center character 'E' (index 4)
              const charOffset = i - 4; // -4, -3, -2, -1, 0, 1, 2, 3, 4
              const xTravel = charOffset * 105;
              const yParallax = Math.sin(charOffset * 0.85) * 22;
              const zParallax = (4 - Math.abs(charOffset)) * 85; // Center 'E' pushes deepest into camera

              return (
                <span
                  key={i}
                  style={{
                    display: 'inline-block',
                    transform: isTransitioning
                      ? `translate3d(${xTravel}px, ${yParallax}px, ${zParallax}px) scale3d(${1.25 + Math.abs(charOffset) * 0.12}, ${1.25 + Math.abs(charOffset) * 0.12}, 1)`
                      : 'translate3d(0, 0, 0) scale3d(1, 1, 1)',
                    transition: `transform 1100ms ${FLUID_BEZIER}`,
                    willChange: 'transform',
                    textShadow: isTransitioning
                      ? '0 0 45px #00f2fe, 0 0 90px #ff007f, 0 0 140px #00f2fe'
                      : undefined,
                  }}
                >
                  {char}
                </span>
              );
            })}
          </h1>
        </div>

        {/* Badass Tagline */}
        <div
          style={{
            maxWidth: '780px',
            margin: '0 auto 36px auto',
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translate3d(0, 35px, 0) scale3d(0.94, 0.94, 1)' : 'translate3d(0, 0, 0) scale3d(1, 1, 1)',
            transition: `transform 400ms ${FLUID_BEZIER}, opacity 350ms ease`,
            willChange: 'transform, opacity',
          }}
        >
          <p
            style={{
              fontSize: 'clamp(16px, 2.3vw, 23px)',
              fontWeight: 800,
              color: '#00f2fe',
              letterSpacing: '1.5px',
              textTransform: 'uppercase',
              margin: '0 0 12px 0',
              fontFamily: '"Chakra Petch", sans-serif',
              textShadow: '0 0 20px rgba(0, 242, 254, 0.45)',
            }}
          >
            "REALITY IS OBSOLETE. FORGE WORLDS FROM VISUAL CHAOS."
          </p>
          <p
            style={{
              fontSize: 'clamp(13px, 1.5vw, 15px)',
              color: '#94a3b8',
              lineHeight: '1.6',
              maxWidth: '640px',
              margin: '0 auto',
            }}
          >
            Upload any snapshot. Multimodal neural agents deconstruct physical geometry into a living, fully interactive 2D adventure.
          </p>
        </div>

        {/* Interactive Call To Action: Click any key to continue */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            opacity: isTransitioning ? 0 : 1,
            transform: isTransitioning ? 'translate3d(0, 35px, 0) scale3d(0.9, 0.9, 1)' : 'translate3d(0, 0, 0) scale3d(1, 1, 1)',
            transition: `transform 380ms ${FLUID_BEZIER}, opacity 320ms ease`,
            willChange: 'transform, opacity',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '12px',
              padding: '16px 36px',
              background: 'linear-gradient(90deg, rgba(255, 0, 127, 0.22) 0%, rgba(0, 242, 254, 0.22) 100%)',
              border: '2px solid #00f2fe',
              borderRadius: '20px',
              boxShadow: '0 0 35px rgba(0, 242, 254, 0.4), inset 0 0 20px rgba(255, 0, 127, 0.25)',
              color: '#ffffff',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: 'clamp(11px, 1.3vw, 13px)',
              animation: 'welcomePromptBlink 2s ease-in-out infinite',
              letterSpacing: '1.5px',
            }}
          >
            <Zap size={18} color="#00f2fe" fill="#00f2fe" />
            <span>CLICK ANY KEY TO CONTINUE</span>
            <ChevronRight size={18} color="#ff007f" />
          </div>

          <span
            style={{
              fontSize: '11px',
              color: '#64748b',
              fontFamily: '"Share Tech Mono", monospace',
              letterSpacing: '1px',
            }}
          >
            [ CLICK SCREEN OR PRESS ANY KEYBOARD BUTTON ]
          </span>
        </div>
      </div>
    </div>
  );
};
