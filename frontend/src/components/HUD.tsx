import React from 'react';
import { EngineState, GameWorld } from '../types/game';
import { getGemBalance } from '../types/avatar';
import { Heart, Target, Star, Clock, Volume2, VolumeX, Pause, Play, Key, LogOut, Zap, Flame, ShieldAlert, Cpu, EyeOff, Radio, ShoppingBag } from 'lucide-react';

interface HUDProps {
  world: GameWorld;
  state: EngineState;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onTogglePause: () => void;
  onExit: () => void;
  onOpenShop?: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  world,
  state,
  soundEnabled,
  onToggleSound,
  onTogglePause,
  onExit,
  onOpenShop,
}) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const isLowTime = state.timeLeft <= 15;
  const hasKey = world.objective.requiredItems
    ? world.objective.requiredItems.every((item) => (state.collectedItems[item] || 0) > 0)
    : true;
  const reqScore = world.objective.requiredScore || 0;
  const currentScore = state.levelScore !== undefined ? state.levelScore : state.score;
  const hasScore = currentScore >= reqScore;

  // Terminal hack status
  const reqTerminals = world.objective.requiredTerminals || [];
  const hasTerminals = reqTerminals.length === 0 || reqTerminals.every((t) => Boolean(state.hackedTerminals?.[t]));

  // Exit Guardian status
  const enemies = world.enemies || [];
  const guardianAlerted = enemies.some((e) => e.type === 'exit_guardian' && e.isAlert);

  // Dash status
  const dashCooldown = state.player?.dashCooldown ?? 0;
  const isDashReady = dashCooldown <= 0;
  const dashPercent = Math.max(0, Math.min(100, Math.round((1 - dashCooldown / 1.15) * 100)));

  // Stun Weapon status
  const stunAmmo = state.stunAmmo ?? 0;
  const maxStunAmmo = state.maxStunAmmo ?? 3;
  const stunCooldown = state.stunCooldown ?? 0;
  const isStunReady = stunAmmo > 0 && stunCooldown <= 0;

  // Combo
  const combo = state.comboCount || 1;
  const comboRatio = Math.max(0, Math.min(1, (state.comboTimer || 0) / 2.8));

  // Gem wallet balance
  const gems = getGemBalance();

  return (
    <>
      {/* TOP BAR */}
      <div style={{
        position: 'absolute',
        top: '12px',
        left: '12px',
        right: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
        padding: '8px 16px',
        background: 'rgba(11, 15, 25, 0.88)',
        backdropFilter: 'blur(10px)',
        border: '2px solid rgba(0, 242, 254, 0.3)',
        borderRadius: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 242, 254, 0.15)',
        color: '#ffffff',
        fontFamily: '"Chakra Petch", sans-serif',
        zIndex: 20,
        userSelect: 'none',
        flexWrap: 'wrap',
      }}>
        {/* LEFT: Level Badge & Health & Keys/Terminals */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'linear-gradient(135deg, rgba(255, 0, 127, 0.3), rgba(121, 40, 202, 0.3))',
            border: '1px solid rgba(255, 0, 127, 0.6)',
            padding: '3px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '1px',
            color: '#ff77e9',
            boxShadow: '0 0 10px rgba(255, 0, 127, 0.25)',
          }}>
            🏆 LEVEL {state.currentLevel || 1}/{state.maxLevels || 3}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {Array.from({ length: state.maxHealth }).map((_, i) => (
              <Heart
                key={i}
                size={20}
                color={i < state.health ? '#ff007f' : '#475569'}
                fill={i < state.health ? '#ff007f' : 'transparent'}
                style={{ filter: i < state.health ? 'drop-shadow(0 0 6px rgba(255, 0, 127, 0.8))' : 'none' }}
              />
            ))}
          </div>

          {/* Key Requirement */}
          {world.objective.requiredItems && world.objective.requiredItems.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: hasKey ? 'rgba(67, 233, 123, 0.2)' : 'rgba(255, 255, 255, 0.08)',
              border: `1px solid ${hasKey ? '#43e97b' : '#64748b'}`,
              padding: '3px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 700,
              color: hasKey ? '#43e97b' : '#94a3b8',
            }}>
              <Key size={13} />
              {hasKey ? 'KEY READY' : 'KEY NEEDED'}
            </div>
          )}

          {/* Terminal Override Requirement */}
          {reqTerminals.length > 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: hasTerminals ? 'rgba(0, 242, 254, 0.2)' : 'rgba(255, 170, 0, 0.15)',
              border: `1px solid ${hasTerminals ? '#00f2fe' : '#ffaa00'}`,
              padding: '3px 8px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: 700,
              color: hasTerminals ? '#00f2fe' : '#ffaa00',
            }}>
              <Cpu size={13} />
              {hasTerminals ? 'FIREWALL OVERRIDDEN' : 'TERMINAL LOCK ACTIVE'}
            </div>
          )}
        </div>

        {/* CENTER: Objective Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 0, 0, 0.45)',
          padding: '5px 14px',
          borderRadius: '20px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          maxWidth: '380px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          <Target size={17} color="#00f2fe" style={{ flexShrink: 0 }} />
          <span style={{ fontSize: '12px', fontWeight: 600, color: '#e2e8f0', letterSpacing: '0.5px' }}>
            {world.objective.description}
          </span>
        </div>

        {/* RIGHT: Score, Timer, Gem Shop Button, Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Score & Points Target */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: hasScore ? 'rgba(67, 233, 123, 0.15)' : 'rgba(255, 215, 0, 0.12)',
            border: `1px solid ${hasScore ? '#43e97b' : '#ffd700'}`,
            padding: '4px 10px',
            borderRadius: '10px',
          }}>
            <Star size={15} color="#ffd700" fill="#ffd700" style={{ filter: 'drop-shadow(0 0 5px #ffd700)' }} />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
              <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '11px', color: '#ffd700' }}>
                {state.score}
              </span>
              {reqScore > 0 && (
                <span style={{
                  fontSize: '11px',
                  fontWeight: 700,
                  color: hasScore ? '#43e97b' : '#94a3b8',
                }}>
                  {hasScore ? `✅ (${currentScore}/${reqScore})` : `(${currentScore}/${reqScore} pts)`}
                </span>
              )}
            </div>
          </div>

          {/* Gem Wallet & Shop Button */}
          {onOpenShop && (
            <button
              onClick={onOpenShop}
              title="Open Avatar Wardrobe & Gem Shop"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '5px',
                background: 'rgba(255, 215, 0, 0.15)',
                border: '1px solid rgba(255, 215, 0, 0.5)',
                color: '#ffd700',
                padding: '4px 10px',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '11px',
                fontWeight: 700,
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(255, 215, 0, 0.3)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(255, 215, 0, 0.15)')}
            >
              <span>💎</span>
              <span>{gems}</span>
              <ShoppingBag size={12} />
            </button>
          )}

          {/* Timer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: isLowTime ? 'rgba(255, 8, 68, 0.25)' : 'rgba(0, 0, 0, 0.3)',
            border: `1px solid ${isLowTime ? '#ff0844' : 'rgba(255, 255, 255, 0.1)'}`,
            padding: '4px 9px',
            borderRadius: '10px',
            animation: isLowTime ? 'pulse 1s infinite' : 'none',
          }}>
            <Clock size={15} color={isLowTime ? '#ff0844' : '#00f2fe'} />
            <span style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '11px',
              color: isLowTime ? '#ff0844' : '#ffffff',
            }}>
              {formatTime(state.timeLeft)}
            </span>
          </div>

          {/* Sound & Music Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Background Music & Sound Effects' : 'Enable Background Music & Sound Effects'}
            style={{
              background: soundEnabled ? 'rgba(0, 242, 254, 0.12)' : 'rgba(239, 68, 68, 0.15)',
              border: `1px solid ${soundEnabled ? 'rgba(0, 242, 254, 0.4)' : 'rgba(239, 68, 68, 0.4)'}`,
              color: soundEnabled ? '#00f2fe' : '#ef4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '4px 8px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 700,
              transition: 'all 0.15s ease',
            }}
          >
            {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            <span>{soundEnabled ? '🎵 MUSIC ON' : 'MUTED'}</span>
          </button>

          {/* Pause Button */}
          <button
            onClick={onTogglePause}
            title={state.isPaused ? 'Resume' : 'Pause'}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#e2e8f0',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              padding: '4px',
              borderRadius: '6px',
            }}
          >
            {state.isPaused ? <Play size={17} /> : <Pause size={17} />}
          </button>

          {/* Exit Button */}
          <button
            onClick={onExit}
            title="Exit to Main Menu"
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#fca5a5',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '4px 8px',
              borderRadius: '8px',
              fontSize: '11px',
              fontWeight: 700,
            }}
          >
            <LogOut size={13} />
            Exit
          </button>
        </div>
      </div>

      {/* FLOATING ACTION & COMBAT STATUS WIDGET (BOTTOM-LEFT) */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '7px',
        zIndex: 20,
        fontFamily: '"Chakra Petch", sans-serif',
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        {/* DASH METER */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(11, 15, 25, 0.88)',
          backdropFilter: 'blur(8px)',
          border: isDashReady ? '1px solid #00f2fe' : '1px solid rgba(255, 255, 255, 0.15)',
          padding: '5px 12px',
          borderRadius: '10px',
          boxShadow: isDashReady ? '0 0 10px rgba(0, 242, 254, 0.25)' : 'none',
          minWidth: '190px',
        }}>
          <Zap size={15} color={isDashReady ? '#00f2fe' : '#64748b'} fill={isDashReady ? '#00f2fe' : 'transparent'} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 800, marginBottom: '2px' }}>
              <span style={{ color: isDashReady ? '#00f2fe' : '#94a3b8' }}>DASH [SPACE / SHIFT]</span>
              <span style={{ color: isDashReady ? '#00f2fe' : '#64748b' }}>{isDashReady ? 'READY' : `${dashPercent}%`}</span>
            </div>
            <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div style={{
                width: `${dashPercent}%`,
                height: '100%',
                background: isDashReady ? 'linear-gradient(90deg, #00f2fe, #4facfe)' : '#ffaa00',
                transition: 'width 0.1s linear',
              }} />
            </div>
          </div>
        </div>

        {/* STUN WEAPON METER */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(11, 15, 25, 0.88)',
          backdropFilter: 'blur(8px)',
          border: isStunReady ? '1px solid #f59e0b' : '1px solid rgba(255, 255, 255, 0.15)',
          padding: '5px 12px',
          borderRadius: '10px',
          boxShadow: isStunReady ? '0 0 10px rgba(245, 158, 11, 0.3)' : 'none',
          minWidth: '190px',
        }}>
          <Radio size={15} color={isStunReady ? '#f59e0b' : '#64748b'} />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 800, marginBottom: '2px' }}>
              <span style={{ color: isStunReady ? '#f59e0b' : '#94a3b8' }}>STUN DART [F / Q]</span>
              <span style={{ color: isStunReady ? '#f59e0b' : '#64748b' }}>{stunAmmo}/{maxStunAmmo} CHARGES</span>
            </div>
            <div style={{ display: 'flex', gap: '3px' }}>
              {Array.from({ length: maxStunAmmo }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    height: '4px',
                    borderRadius: '2px',
                    background: i < stunAmmo ? '#f59e0b' : 'rgba(255,255,255,0.1)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* STEALTH SNEAK BADGE */}
        {state.isStealth && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(124, 58, 237, 0.3)',
            backdropFilter: 'blur(8px)',
            border: '1px solid #a855f7',
            padding: '5px 12px',
            borderRadius: '10px',
            boxShadow: '0 0 12px rgba(168, 85, 247, 0.35)',
          }}>
            <EyeOff size={15} color="#c084fc" />
            <div style={{ fontSize: '11px', fontWeight: 900, color: '#e9d5ff', letterSpacing: '0.5px' }}>
              🤫 SNEAKING [C] - SILENT STEALTH (-60% SIGHT)
            </div>
          </div>
        )}

        {/* SNEAK TAKEDOWN PROMPT */}
        {state.canSneakTakedown && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.45), rgba(245, 158, 11, 0.45))',
            backdropFilter: 'blur(8px)',
            border: '2px solid #ffd700',
            padding: '6px 14px',
            borderRadius: '10px',
            boxShadow: '0 0 16px rgba(255, 215, 0, 0.5)',
            animation: 'pulse 0.6s infinite',
          }}>
            <span style={{ fontSize: '14px' }}>⚡</span>
            <div style={{ fontSize: '11px', fontWeight: 900, color: '#ffffff', letterSpacing: '0.5px' }}>
              [E] SNEAK TAKEDOWN (STUN 6s!)
            </div>
          </div>
        )}

        {/* COMBO MULTIPLIER BADGE */}
        {combo > 1 && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'linear-gradient(135deg, rgba(255, 136, 0, 0.35), rgba(255, 0, 90, 0.35))',
            backdropFilter: 'blur(8px)',
            border: '1px solid #ff8800',
            padding: '5px 12px',
            borderRadius: '10px',
            boxShadow: '0 0 14px rgba(255, 136, 0, 0.4)',
            animation: 'pulse 0.8s infinite',
          }}>
            <Flame size={16} color="#ff8800" fill="#ffaa00" />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '11px', fontWeight: 900, color: '#ffea00', letterSpacing: '0.5px' }}>
                🔥 x{combo} COMBO (+{(combo - 1) * 20}% BONUS)
              </div>
              <div style={{ width: '100%', height: '3px', background: 'rgba(0,0,0,0.4)', borderRadius: '2px', overflow: 'hidden', marginTop: '3px' }}>
                <div style={{
                  width: `${comboRatio * 100}%`,
                  height: '100%',
                  background: '#ffea00',
                  transition: 'width 0.05s linear',
                }} />
              </div>
            </div>
          </div>
        )}

        {/* EXIT GUARDIAN ALERT NOTIFICATION */}
        {guardianAlerted && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 0, 60, 0.35)',
            backdropFilter: 'blur(8px)',
            border: '1px solid #ff003c',
            padding: '5px 12px',
            borderRadius: '10px',
            boxShadow: '0 0 16px rgba(255, 0, 60, 0.5)',
            animation: 'pulse 0.5s infinite',
          }}>
            <ShieldAlert size={16} color="#ff3b69" />
            <div style={{ fontSize: '11px', fontWeight: 900, color: '#ff6b8b', letterSpacing: '0.5px' }}>
              ⚠️ GUARDIAN ALERTED! EXTRACTION COMPROMISED!
            </div>
          </div>
        )}
      </div>
    </>
  );
};
