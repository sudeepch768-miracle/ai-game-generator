import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Zap, Eye, Footprints, Terminal, MessageSquare, ShieldAlert } from 'lucide-react';
import { EngineState } from '../types/game';

interface MobileControlsProps {
  onMove: (dx: number, dy: number) => void;
  onAction: (action: 'dash' | 'interact' | 'stun' | 'stealth') => void;
  nearbyInteractable?: EngineState['nearbyInteractable'];
  dashCooldownProgress?: number; // 0 to 1
  stealthActive?: boolean;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMove,
  onAction,
  nearbyInteractable,
  dashCooldownProgress = 1,
  stealthActive = false,
}) => {
  // Joystick State
  const [knobPos, setKnobPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const activeTouchId = useRef<number | null>(null);

  const JOYSTICK_RADIUS = 50;

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (activeTouchId.current !== null) return;
    const touch = e.changedTouches[0];
    activeTouchId.current = touch.identifier;
    setIsDragging(true);
    updateJoystickPos(touch.clientX, touch.clientY);
  };

  const updateJoystickPos = useCallback(
    (clientX: number, clientY: number) => {
      if (!joystickBaseRef.current) return;
      const rect = joystickBaseRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let dx = clientX - centerX;
      let dy = clientY - centerY;
      const dist = Math.hypot(dx, dy);

      if (dist > JOYSTICK_RADIUS) {
        dx = (dx / dist) * JOYSTICK_RADIUS;
        dy = (dy / dist) * JOYSTICK_RADIUS;
      }

      setKnobPos({ x: dx, y: dy });

      // Send normalized vector (-1 to 1)
      const normX = dx / JOYSTICK_RADIUS;
      const normY = dy / JOYSTICK_RADIUS;
      onMove(normX, normY);
    },
    [onMove]
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (activeTouchId.current === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === activeTouchId.current) {
          e.preventDefault();
          updateJoystickPos(touch.clientX, touch.clientY);
          break;
        }
      }
    },
    [updateJoystickPos]
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (activeTouchId.current === null) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === activeTouchId.current) {
          e.preventDefault();
          activeTouchId.current = null;
          setIsDragging(false);
          setKnobPos({ x: 0, y: 0 });
          onMove(0, 0);
          break;
        }
      }
    },
    [onMove]
  );

  useEffect(() => {
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd, { passive: false });
    window.addEventListener('touchcancel', handleTouchEnd, { passive: false });
    return () => {
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, [handleTouchMove, handleTouchEnd]);

  const triggerAction = (action: 'dash' | 'interact' | 'stun' | 'stealth', e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(15);
      } catch { }
    }
    onAction(action);
  };

  const isNearTerminal = nearbyInteractable?.type === 'terminal';
  const isNearNPC = nearbyInteractable?.type === 'npc';
  const isTakedown = nearbyInteractable?.type === 'sneak_takedown';

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 25,
        userSelect: 'none',
        touchAction: 'none',
      }}
    >
      {/* LEFT: Virtual Joystick (D-Pad) */}
      <div
        style={{
          position: 'absolute',
          bottom: '26px',
          left: '24px',
          pointerEvents: 'auto',
          touchAction: 'none',
        }}
      >
        <div
          ref={joystickBaseRef}
          onTouchStart={handleTouchStart}
          style={{
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            background: isDragging
              ? 'radial-gradient(circle, rgba(0, 242, 254, 0.25) 0%, rgba(15, 23, 42, 0.75) 75%)'
              : 'radial-gradient(circle, rgba(15, 23, 42, 0.7) 0%, rgba(7, 10, 18, 0.85) 100%)',
            border: `2px solid ${isDragging ? '#00f2fe' : 'rgba(0, 242, 254, 0.35)'}`,
            boxShadow: isDragging
              ? '0 0 25px rgba(0, 242, 254, 0.4), inset 0 0 15px rgba(0, 242, 254, 0.2)'
              : '0 8px 32px rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Compass direction indicators */}
          <span style={{ position: 'absolute', top: '8px', fontSize: '9px', fontWeight: 800, color: 'rgba(0,242,254,0.5)' }}>▲</span>
          <span style={{ position: 'absolute', bottom: '8px', fontSize: '9px', fontWeight: 800, color: 'rgba(0,242,254,0.5)' }}>▼</span>
          <span style={{ position: 'absolute', left: '8px', fontSize: '9px', fontWeight: 800, color: 'rgba(0,242,254,0.5)' }}>◀</span>
          <span style={{ position: 'absolute', right: '8px', fontSize: '9px', fontWeight: 800, color: 'rgba(0,242,254,0.5)' }}>▶</span>

          {/* Movable Knob */}
          <div
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'linear-gradient(145deg, #00f2fe 0%, #0284c7 100%)',
              border: '2px solid #ffffff',
              boxShadow: '0 4px 14px rgba(0, 242, 254, 0.7)',
              position: 'absolute',
              transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.15s ease-out',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: 'rgba(255,255,255,0.75)' }} />
          </div>
        </div>
      </div>

      {/* RIGHT: Action Cluster */}
      <div
        style={{
          position: 'absolute',
          bottom: '24px',
          right: '20px',
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: '12px',
          touchAction: 'none',
        }}
      >
        {/* Top Mini Actions: Stealth & Stun EMP */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          {/* SNEAK / STEALTH BUTTON */}
          <button
            onTouchStart={(e) => triggerAction('stealth', e)}
            onClick={(e) => triggerAction('stealth', e)}
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: stealthActive ? 'rgba(168, 85, 247, 0.35)' : 'rgba(15, 23, 42, 0.8)',
              border: `2px solid ${stealthActive ? '#c084fc' : 'rgba(168, 85, 247, 0.4)'}`,
              color: stealthActive ? '#f3e8ff' : '#c084fc',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: stealthActive ? '0 0 16px rgba(168, 85, 247, 0.6)' : '0 4px 12px rgba(0,0,0,0.5)',
              cursor: 'pointer',
              outline: 'none',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Eye size={16} />
            <span style={{ fontSize: '8px', fontWeight: 800, marginTop: '1px' }}>SNEAK</span>
          </button>

          {/* STUN EMP BUTTON */}
          <button
            onTouchStart={(e) => triggerAction('stun', e)}
            onClick={(e) => triggerAction('stun', e)}
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.8)',
              border: '2px solid rgba(0, 242, 254, 0.5)',
              color: '#00f2fe',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 14px rgba(0, 242, 254, 0.3)',
              cursor: 'pointer',
              outline: 'none',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Zap size={16} />
            <span style={{ fontSize: '8px', fontWeight: 800, marginTop: '1px' }}>STUN</span>
          </button>
        </div>

        {/* Bottom Primary Actions: Dash & Big Interact/Hack */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          {/* DASH BUTTON */}
          <button
            onTouchStart={(e) => triggerAction('dash', e)}
            onClick={(e) => triggerAction('dash', e)}
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.25) 0%, rgba(239, 68, 68, 0.25) 100%)',
              border: '2px solid #f59e0b',
              color: '#fbbf24',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(245, 158, 11, 0.4)',
              cursor: 'pointer',
              outline: 'none',
              backdropFilter: 'blur(8px)',
              position: 'relative',
            }}
          >
            <Footprints size={20} />
            <span style={{ fontSize: '8px', fontWeight: 900, letterSpacing: '0.5px' }}>DASH</span>
          </button>

          {/* PRIMARY INTERACT / HACK TERMINAL BUTTON */}
          <button
            onTouchStart={(e) => triggerAction('interact', e)}
            onClick={(e) => triggerAction('interact', e)}
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: isNearTerminal
                ? 'linear-gradient(135deg, #00f2fe 0%, #3b82f6 100%)'
                : isTakedown
                  ? 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)'
                  : isNearNPC
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(2, 6, 23, 0.95) 100%)',
              border: `3px solid ${isNearTerminal ? '#ffffff' : nearbyInteractable ? '#00f2fe' : 'rgba(255, 255, 255, 0.3)'}`,
              color: isNearTerminal || isTakedown || isNearNPC ? '#ffffff' : '#cbd5e1',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isNearTerminal
                ? '0 0 30px rgba(0, 242, 254, 0.8), inset 0 0 15px rgba(255, 255, 255, 0.5)'
                : nearbyInteractable
                  ? '0 0 20px rgba(0, 242, 254, 0.5)'
                  : '0 6px 20px rgba(0, 0, 0, 0.6)',
              cursor: 'pointer',
              outline: 'none',
              transform: isNearTerminal ? 'scale(1.06)' : 'none',
              transition: 'transform 0.15s, background 0.15s, box-shadow 0.15s',
              backdropFilter: 'blur(8px)',
            }}
          >
            {isNearTerminal ? (
              <>
                <Terminal size={24} />
                <span style={{ fontSize: '10px', fontWeight: 900, marginTop: '2px', letterSpacing: '0.5px' }}>HACK [E]</span>
              </>
            ) : isTakedown ? (
              <>
                <ShieldAlert size={22} />
                <span style={{ fontSize: '9px', fontWeight: 900, marginTop: '2px' }}>TAKEDOWN</span>
              </>
            ) : isNearNPC ? (
              <>
                <MessageSquare size={22} />
                <span style={{ fontSize: '9px', fontWeight: 900, marginTop: '2px' }}>TALK [E]</span>
              </>
            ) : (
              <>
                <Terminal size={20} color="#94a3b8" />
                <span style={{ fontSize: '9px', fontWeight: 800, marginTop: '2px' }}>ACTION [E]</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
