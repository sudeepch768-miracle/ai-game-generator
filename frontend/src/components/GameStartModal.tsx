import React, { useState } from 'react';
import { GameWorld, Difficulty } from '../types/game';
import { Play, ShieldAlert, Clock, Target, Sparkles, Heart, AlertTriangle } from 'lucide-react';

interface GameStartModalProps {
  world: GameWorld;
  onPlay: (difficulty?: Difficulty) => void;
}

export const GameStartModal: React.FC<GameStartModalProps> = ({ world, onPlay }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(world.difficulty || 'medium');

  const diffConfig = {
    easy: { lives: 4, time: (world.timeLimit || 90) + 25, hazards: 'No Hazards', color: '#22c55e', icon: '🟢' },
    medium: { lives: 3, time: world.timeLimit || 75, hazards: '1 Drone', color: '#eab308', icon: '🟡' },
    hard: { lives: 2, time: Math.min(world.timeLimit || 90, 50), hazards: '2 Drones', color: '#f97316', icon: '🔴' },
    nightmare: { lives: 1, time: Math.min(world.timeLimit || 90, 35), hazards: '3 Fast Drones', color: '#ef4444', icon: '💀' },
  };

  const currentConfig = diffConfig[selectedDifficulty];

  const handleStart = () => {
    world.difficulty = selectedDifficulty;
    world.timeLimit = currentConfig.time;
    onPlay(selectedDifficulty);
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      background: 'rgba(5, 7, 15, 0.88)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 30,
      padding: '20px',
    }}>
      <div style={{
        width: '100%',
        maxWidth: '540px',
        background: 'linear-gradient(145deg, #13182b 0%, #0d111d 100%)',
        border: `3px solid ${currentConfig.color}`,
        borderRadius: '24px',
        boxShadow: `0 0 35px ${currentConfig.color}40, 0 20px 50px rgba(0, 0, 0, 0.9)`,
        padding: '30px 26px',
        textAlign: 'center',
        color: '#ffffff',
        fontFamily: '"Chakra Petch", sans-serif',
        position: 'relative',
        animation: 'popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      }}>
        {/* Neon Badge */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 242, 254, 0.15)',
          border: '1px solid #00f2fe',
          padding: '5px 14px',
          borderRadius: '30px',
          fontSize: '12px',
          fontWeight: 700,
          color: '#00f2fe',
          letterSpacing: '1px',
          marginBottom: '12px',
          textTransform: 'uppercase',
        }}>
          <Sparkles size={14} /> Mission Briefing
        </div>

        {/* Title */}
        <h1 style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '16px',
          lineHeight: '1.4',
          margin: '0 0 10px 0',
          color: '#ffffff',
          textShadow: '0 0 12px rgba(0, 242, 254, 0.6)',
        }}>
          {world.title.toUpperCase()}
        </h1>

        {/* Description */}
        <p style={{
          fontSize: '13px',
          lineHeight: '1.4',
          color: '#94a3b8',
          margin: '0 auto 16px auto',
          maxWidth: '460px',
        }}>
          {world.description}
        </p>

        {/* Objective Box */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '14px',
          padding: '12px 16px',
          marginBottom: '16px',
          textAlign: 'left',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', color: '#00f2fe', fontSize: '11px', fontWeight: 700 }}>
            <Target size={14} /> OBJECTIVE:
          </div>
          <div style={{ fontSize: '14px', fontWeight: 600, color: '#f1f5f9' }}>
            {world.objective.description}
          </div>
        </div>

        {/* Interactive Difficulty Selector */}
        <div style={{ marginBottom: '18px', textAlign: 'left' }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#cbd5e1', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <ShieldAlert size={14} color={currentConfig.color} /> SELECT CHALLENGE LEVEL:
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
            {(['easy', 'medium', 'hard', 'nightmare'] as Difficulty[]).map((d) => {
              const cfg = diffConfig[d];
              const isSelected = selectedDifficulty === d;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setSelectedDifficulty(d)}
                  style={{
                    background: isSelected ? `rgba(${d === 'nightmare' ? '239,68,68' : d === 'hard' ? '249,115,22' : d === 'medium' ? '234,179,8' : '34,197,94'}, 0.2)` : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${isSelected ? cfg.color : '#334155'}`,
                    borderRadius: '10px',
                    padding: '8px 4px',
                    cursor: 'pointer',
                    color: isSelected ? cfg.color : '#94a3b8',
                    fontSize: '10px',
                    fontWeight: 700,
                    transition: 'all 0.15s',
                  }}
                >
                  <div style={{ fontSize: '13px', marginBottom: '2px' }}>{cfg.icon}</div>
                  <div>{d.toUpperCase()}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Stats Row based on selected difficulty */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '8px',
          marginBottom: '22px',
        }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ff007f', fontSize: '11px', fontWeight: 700 }}>
              <Heart size={13} fill="#ff007f" /> LIVES
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
              {currentConfig.lives} {currentConfig.lives === 1 ? '(1-Hit KO!)' : 'Hearts'}
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#ffd700', fontSize: '11px', fontWeight: 700 }}>
              <Clock size={13} /> TIMER
            </div>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
              {currentConfig.time}s
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.05)', borderRadius: '10px', padding: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#00f2fe', fontSize: '11px', fontWeight: 700 }}>
              <AlertTriangle size={13} /> HAZARDS
            </div>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', marginTop: '2px' }}>
              {currentConfig.hazards}
            </div>
          </div>
        </div>

        {/* Big PLAY Button */}
        <button
          onClick={handleStart}
          style={{
            width: '100%',
            background: `linear-gradient(90deg, ${currentConfig.color} 0%, #ff4b2b 100%)`,
            color: '#ffffff',
            border: 'none',
            borderRadius: '16px',
            padding: '16px 24px',
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '14px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            boxShadow: `0 8px 25px ${currentConfig.color}60`,
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0) scale(1)';
          }}
        >
          <Play size={18} fill="#ffffff" />
          PLAY {selectedDifficulty.toUpperCase()} LEVEL
        </button>

        {/* Small Controls Hint */}
        <div style={{ marginTop: '14px', fontSize: '11px', color: '#94a3b8', lineHeight: '1.5' }}>
          <b>WASD / Arrows</b> Move • <b>[SPACE / SHIFT]</b> Tactical Dash • <b>[E]</b> Hack / Interact • <b>Mini-Map</b> Radar Tracking
        </div>
      </div>
    </div>
  );
};
