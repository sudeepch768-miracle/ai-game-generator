import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Zap, Eye, Footprints, Terminal, MessageSquare, ShieldAlert, Maximize2, Minimize2, ZoomIn, ZoomOut } from 'lucide-react';
import { EngineState } from '../types/game';

interface MobileControlsProps {
  onMove: (dx: number, dy: number) => void;
  onAction: (action: 'dash' | 'interact' | 'stun' | 'stealth') => void;
  nearbyInteractable?: EngineState['nearbyInteractable'];
  dashCooldownProgress?: number; // 0 to 1
  stealthActive?: boolean;
  currentZoom?: number;
  onCycleZoom?: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  onMove,
  onAction,
  nearbyInteractable,
  dashCooldownProgress = 1,
  stealthActive = false,
  currentZoom = 0.68,
  onCycleZoom,
}) => {
  // Fullscreen State
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  useEffect(() => {
    const handleFsChange = () => {
      const isFs = Boolean(
        document.fullscreenElement ||
        (document as any).webkitFullscreenElement ||
        (document as any).mozFullScreenElement ||
        (document as any).msFullscreenElement
      );
      setIsFullscreen(isFs);
    };

    document.addEventListener('fullscreenchange', handleFsChange);
    document.addEventListener('webkitfullscreenchange', handleFsChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange);
      document.removeEventListener('webkitfullscreenchange', handleFsChange);
    };
  }, []);

  const toggleFullscreen = (e: React.TouchEvent | React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      if (!document.fullscreenElement && !(document as any).webkitFullscreenElement) {
        const docEl = document.documentElement as any;
        if (docEl.requestFullscreen) docEl.requestFullscreen();
        else if (docEl.webkitRequestFullscreen) docEl.webkitRequestFullscreen();
        else if (docEl.msRequestFullscreen) docEl.msRequestFullscreen();
      } else {
        if (document.exitFullscreen) document.exitFullscreen();
        else if ((document as any).webkitExitFullscreen) (document as any).webkitExitFullscreen();
        else if ((document as any).msExitFullscreen) (document as any).msExitFullscreen();
      }
    } catch (err) {
      console.warn('Fullscreen toggle failed:', err);
    }
  };

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

      {/* TOP-RIGHT: Fullscreen & Zoom Floating Controls */}
      <div
        style={{
          position: 'absolute',
          top: '68px',
          right: '16px',
          pointerEvents: 'auto',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          zIndex: 30,
        }}
      >
        {/* Zoom Mode Toggle Button */}
        {onCycleZoom && (
          <button
            onTouchStart={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCycleZoom();
            }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onCycleZoom();
            }}
            aria-label="Toggle Camera Zoom"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'rgba(15, 23, 42, 0.88)',
              backdropFilter: 'blur(10px)',
              border: '1.5px solid rgba(245, 158, 11, 0.6)',
              color: '#fbbf24',
              padding: '7px 11px',
              borderRadius: '20px',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '0.5px',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.5), 0 0 10px rgba(245, 158, 11, 0.25)',
              cursor: 'pointer',
              outline: 'none',
              touchAction: 'manipulation',
              transition: 'all 0.15s ease',
            }}
          >
            {currentZoom <= 0.72 ? (
              <ZoomOut size={15} color="#fbbf24" />
            ) : (
              <ZoomIn size={15} color="#fbbf24" />
            )}
            <span>
              {currentZoom <= 0.72
                ? 'WIDE'
                : currentZoom <= 0.88
                  ? 'TACTICAL'
                  : 'CLOSE'}
            </span>
          </button>
        )}

        {/* Fullscreen Floating Button */}
        <button
          onTouchStart={toggleFullscreen}
          onClick={toggleFullscreen}
          aria-label="Toggle Fullscreen"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: isFullscreen ? 'rgba(0, 242, 254, 0.25)' : 'rgba(15, 23, 42, 0.85)',
            backdropFilter: 'blur(10px)',
            border: `1.5px solid ${isFullscreen ? '#00f2fe' : 'rgba(0, 242, 254, 0.45)'}`,
            color: isFullscreen ? '#00f2fe' : '#e2e8f0',
            padding: '7px 13px',
            borderRadius: '20px',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.5px',
            boxShadow: isFullscreen
              ? '0 0 16px rgba(0, 242, 254, 0.45), 0 4px 12px rgba(0,0,0,0.5)'
              : '0 4px 14px rgba(0, 0, 0, 0.5)',
            cursor: 'pointer',
            outline: 'none',
            touchAction: 'manipulation',
            transition: 'all 0.15s ease',
          }}
        >
          {isFullscreen ? <Minimize2 size={16} color="#00f2fe" /> : <Maximize2 size={16} color="#00f2fe" />}
          <span>{isFullscreen ? 'EXIT FULL' : 'FULLSCREEN'}</span>
        </button>
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
        {/* Top Mini Tactical Actions: Sneak & Stun EMP */}
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginRight: '4px' }}>
          {/* SNEAK / STEALTH BUTTON */}
          <button
            onTouchStart={(e) => triggerAction('stealth', e)}
            onClick={(e) => triggerAction('stealth', e)}
            aria-label="Sneak Stealth"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: stealthActive ? 'rgba(168, 85, 247, 0.35)' : 'rgba(15, 23, 42, 0.82)',
              border: `2px solid ${stealthActive ? '#c084fc' : 'rgba(168, 85, 247, 0.45)'}`,
              color: stealthActive ? '#f3e8ff' : '#c084fc',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: stealthActive ? '0 0 16px rgba(168, 85, 247, 0.6)' : '0 4px 12px rgba(0,0,0,0.5)',
              cursor: 'pointer',
              outline: 'none',
              backdropFilter: 'blur(8px)',
              touchAction: 'manipulation',
            }}
          >
            <Eye size={16} />
            <span style={{ fontSize: '8px', fontWeight: 800, marginTop: '1px' }}>SNEAK</span>
          </button>

          {/* STUN EMP BUTTON */}
          <button
            onTouchStart={(e) => triggerAction('stun', e)}
            onClick={(e) => triggerAction('stun', e)}
            aria-label="Stun EMP"
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '50%',
              background: 'rgba(15, 23, 42, 0.82)',
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
              touchAction: 'manipulation',
            }}
          >
            <Zap size={16} />
            <span style={{ fontSize: '8px', fontWeight: 800, marginTop: '1px' }}>STUN</span>
          </button>
        </div>

        {/* Bottom Actions: Small Interaction Button + BIG Dash Button */}
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
          {/* SMALL INTERACT / HACK / TAKEDOWN BUTTON */}
          <button
            onTouchStart={(e) => triggerAction('interact', e)}
            onClick={(e) => triggerAction('interact', e)}
            aria-label="Interact or Hack"
            style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: isNearTerminal
                ? 'linear-gradient(135deg, #00f2fe 0%, #0284c7 100%)'
                : isTakedown
                  ? 'linear-gradient(135deg, #a855f7 0%, #6d28d9 100%)'
                  : isNearNPC
                    ? 'linear-gradient(135deg, #10b981 0%, #047857 100%)'
                    : 'rgba(15, 23, 42, 0.85)',
              border: isNearTerminal
                ? '2.5px solid #ffffff'
                : nearbyInteractable
                  ? '2px solid #00f2fe'
                  : '1.5px solid rgba(255, 255, 255, 0.25)',
              color: isNearTerminal || isTakedown || isNearNPC ? '#ffffff' : '#94a3b8',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: isNearTerminal
                ? '0 0 20px rgba(0, 242, 254, 0.8), inset 0 0 10px rgba(255, 255, 255, 0.4)'
                : nearbyInteractable
                  ? '0 0 15px rgba(0, 242, 254, 0.5)'
                  : '0 4px 12px rgba(0, 0, 0, 0.5)',
              cursor: 'pointer',
              outline: 'none',
              transform: isNearTerminal || nearbyInteractable ? 'scale(1.05)' : 'none',
              transition: 'transform 0.15s, background 0.15s, box-shadow 0.15s',
              backdropFilter: 'blur(8px)',
              touchAction: 'manipulation',
            }}
          >
            {isNearTerminal ? (
              <>
                <Terminal size={18} />
                <span style={{ fontSize: '8px', fontWeight: 900, marginTop: '1px' }}>HACK</span>
              </>
            ) : isTakedown ? (
              <>
                <ShieldAlert size={18} />
                <span style={{ fontSize: '7.5px', fontWeight: 900, marginTop: '1px' }}>EXEC</span>
              </>
            ) : isNearNPC ? (
              <>
                <MessageSquare size={18} />
                <span style={{ fontSize: '8px', fontWeight: 900, marginTop: '1px' }}>TALK</span>
              </>
            ) : (
              <>
                <Terminal size={16} color="#94a3b8" />
                <span style={{ fontSize: '7.5px', fontWeight: 800, marginTop: '1px' }}>USE</span>
              </>
            )}
          </button>

          {/* BIG PRIMARY DASH BUTTON */}
          <button
            onTouchStart={(e) => triggerAction('dash', e)}
            onClick={(e) => triggerAction('dash', e)}
            aria-label="Dash Ability"
            style={{
              width: '78px',
              height: '78px',
              borderRadius: '50%',
              background: dashCooldownProgress >= 1
                ? 'linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)'
                : 'linear-gradient(135deg, rgba(245, 158, 11, 0.4) 0%, rgba(239, 68, 68, 0.4) 100%)',
              border: dashCooldownProgress >= 1 ? '3px solid #ffffff' : '2px solid rgba(245, 158, 11, 0.5)',
              color: '#ffffff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: dashCooldownProgress >= 1
                ? '0 0 24px rgba(245, 158, 11, 0.65), 0 4px 16px rgba(0, 0, 0, 0.6)'
                : '0 0 10px rgba(245, 158, 11, 0.2)',
              opacity: dashCooldownProgress >= 1 ? 1 : 0.75,
              cursor: 'pointer',
              outline: 'none',
              backdropFilter: 'blur(8px)',
              position: 'relative',
              touchAction: 'manipulation',
              transition: 'all 0.15s ease',
            }}
          >
            <Footprints size={28} />
            <span style={{ fontSize: '10px', fontWeight: 900, letterSpacing: '0.6px', marginTop: '2px' }}>DASH</span>
          </button>
        </div>
      </div>
    </div>
  );
};
