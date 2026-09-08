import React, { useEffect, useState, useRef } from 'react';
import { Eye, Map, Gamepad2, Zap } from 'lucide-react';

interface GenerationModalProps {
  imagePreviewUrl?: string;
  isComplete: boolean;
  onFinish: () => void;
}

const STEPS = [
  { id: 1, title: 'ANALYZING YOUR WORLD', desc: 'Identifying environment, boundaries & obstacles', icon: Eye, color: '#00f2fe' },
  { id: 2, title: 'BUILDING THE MAP', desc: 'Generating walkable paths and collision grid', icon: Map, color: '#f6d365' },
  { id: 3, title: 'CREATING YOUR ADVENTURE', desc: 'Spawning collectibles, secrets & exit objective', icon: Gamepad2, color: '#ff007f' },
  { id: 4, title: 'READY TO PLAY!', desc: 'Deterministic game world validated & compiled', icon: Zap, color: '#43e97b' },
];

export const GenerationModal: React.FC<GenerationModalProps> = ({
  imagePreviewUrl,
  isComplete,
  onFinish,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    // Progress through visual steps
    const timer1 = setTimeout(() => setCurrentStep(1), 1200);
    const timer2 = setTimeout(() => setCurrentStep(2), 2400);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  useEffect(() => {
    if (isComplete) {
      setCurrentStep(3);
      const timerReady = setTimeout(() => {
        onFinishRef.current();
      }, 800);
      return () => clearTimeout(timerReady);
    }
  }, [isComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(7, 9, 18, 0.94)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '540px',
        background: 'linear-gradient(160deg, #111827 0%, #0b0f19 100%)',
        border: '2px solid #00f2fe',
        borderRadius: '24px',
        boxShadow: '0 0 50px rgba(0, 242, 254, 0.25), 0 25px 60px rgba(0,0,0,0.9)',
        padding: '36px 32px',
        color: '#ffffff',
        fontFamily: '"Chakra Petch", sans-serif',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Animated Cyber scanline overlay */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, transparent, #00f2fe, transparent)',
          animation: 'scanline 2s linear infinite',
        }} />

        {/* Thumbnail Preview */}
        {imagePreviewUrl && (
          <div style={{
            width: '110px',
            height: '80px',
            margin: '0 auto 20px auto',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '2px solid rgba(0, 242, 254, 0.5)',
            boxShadow: '0 0 15px rgba(0, 242, 254, 0.3)',
            position: 'relative',
          }}>
            <img
              src={imagePreviewUrl}
              alt="Source"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0, 242, 254, 0.1) 0%, rgba(255, 0, 127, 0.1) 100%)',
            }} />
          </div>
        )}

        <h2 style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '14px',
          color: '#00f2fe',
          margin: '0 0 24px 0',
          letterSpacing: '1px',
          textShadow: '0 0 10px rgba(0, 242, 254, 0.6)',
        }}>
          GENERATIVE AI AT WORK
        </h2>

        {/* Step Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', textAlign: 'left', marginBottom: '28px' }}>
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            const isActive = currentStep === idx;
            const isDone = currentStep > idx;

            return (
              <div
                key={step.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: isActive
                    ? 'rgba(0, 242, 254, 0.12)'
                    : isDone
                    ? 'rgba(255, 255, 255, 0.04)'
                    : 'rgba(255, 255, 255, 0.02)',
                  border: `1px solid ${isActive ? step.color : isDone ? '#334155' : 'rgba(255, 255, 255, 0.05)'}`,
                  transition: 'all 0.3s ease',
                  opacity: isActive || isDone ? 1 : 0.45,
                }}
              >
                <div style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '10px',
                  background: isDone ? '#22c55e' : isActive ? step.color : '#1e293b',
                  color: isDone || isActive ? '#000000' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'all 0.3s ease',
                }}>
                  <Icon size={20} />
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: '"Press Start 2P", monospace',
                    fontSize: '10px',
                    color: isActive ? step.color : isDone ? '#f8fafc' : '#64748b',
                    marginBottom: '4px',
                  }}>
                    {step.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#94a3b8' }}>
                    {step.desc}
                  </div>
                </div>

                {isActive && (
                  <div style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: step.color,
                    boxShadow: `0 0 10px ${step.color}`,
                    animation: 'pulse 0.8s infinite',
                  }} />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div style={{
          height: '6px',
          background: 'rgba(255, 255, 255, 0.1)',
          borderRadius: '10px',
          overflow: 'hidden',
        }}>
          <div style={{
            height: '100%',
            width: `${((currentStep + 1) / 4) * 100}%`,
            background: 'linear-gradient(90deg, #00f2fe 0%, #ff007f 100%)',
            transition: 'width 0.4s ease',
            boxShadow: '0 0 10px #00f2fe',
          }} />
        </div>
      </div>
    </div>
  );
};
