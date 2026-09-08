import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameWorld, EngineState, Difficulty } from '../types/game';
import { GameEngine } from '../engine/GameEngine';
import { HUD } from './HUD';
import { DialogueBox } from './DialogueBox';
import { GameStartModal } from './GameStartModal';
import { GameOverModal } from './GameOverModal';
import { AvatarShopModal } from './AvatarShopModal';
import { MobileControls } from './MobileControls';
import { sound } from '../engine/sound';

interface GameViewProps {
  world: GameWorld;
  onExitToMenu: () => void;
  onCreateNew: () => void;
}

export const GameView: React.FC<GameViewProps> = ({ world, onExitToMenu, onCreateNew }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<GameEngine | null>(null);

  const [engineState, setEngineState] = useState<EngineState | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWon, setIsWon] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [gameOverReason, setGameOverReason] = useState('');
  const [finalScore, setFinalScore] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showShop, setShowShop] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouch = () => {
      const hasTouch =
        'ontouchstart' in window ||
        navigator.maxTouchPoints > 0 ||
        window.innerWidth <= 900;
      setIsTouchDevice(hasTouch);
    };
    checkTouch();
    window.addEventListener('resize', checkTouch);
    return () => window.removeEventListener('resize', checkTouch);
  }, []);

  // Initialize engine
  const initEngine = useCallback(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    canvasRef.current.width = width;
    canvasRef.current.height = height;

    if (engineRef.current) {
      engineRef.current.stop();
    }

    const engine = new GameEngine(canvasRef.current, world);

    engine.onStateChange = (state) => {
      setEngineState(state);
    };

    engine.onWin = (score, timeLeft) => {
      setIsWon(true);
      setFinalScore(score);
      setTimeRemaining(timeLeft);
    };

    engine.onLose = (reason, score) => {
      setIsGameOver(true);
      setGameOverReason(reason);
      setFinalScore(score);
    };

    engineRef.current = engine;
    setIsReady(true);
  }, [world]);

  useEffect(() => {
    initEngine();

    const handleResize = () => {
      if (containerRef.current && engineRef.current) {
        engineRef.current.resize(
          containerRef.current.clientWidth,
          containerRef.current.clientHeight
        );
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (engineRef.current) {
        engineRef.current.stop();
      }
    };
  }, [initEngine]);

  const handleStartPlay = (selectedDifficulty?: Difficulty) => {
    if (selectedDifficulty) {
      world.difficulty = selectedDifficulty;
      if (selectedDifficulty === 'easy') {
        world.timeLimit = Math.max(world.timeLimit || 90, 140);
        if (world.objective && world.objective.requiredScore && world.objective.requiredScore > 100) {
          world.objective.requiredScore = 80;
        }
      } else if (selectedDifficulty === 'medium') {
        world.timeLimit = Math.max(world.timeLimit || 90, 110);
      } else if (selectedDifficulty === 'hard') {
        world.timeLimit = Math.min(world.timeLimit || 90, 65);
      } else if (selectedDifficulty === 'nightmare') {
        world.timeLimit = Math.min(world.timeLimit || 90, 45);
      }

      // Propagate to all campaign levels if present
      if (world.levels && world.levels.length > 0) {
        world.levels.forEach((lvl, idx) => {
          lvl.difficulty = selectedDifficulty;
          if (selectedDifficulty === 'easy') {
            lvl.timeLimit = Math.max(lvl.timeLimit || 90, 140);
            if (lvl.objective && lvl.objective.requiredScore && lvl.objective.requiredScore > 100) {
              lvl.objective.requiredScore = idx === 0 ? 80 : (idx === 1 ? 100 : 120);
            }
          } else if (selectedDifficulty === 'medium') {
            lvl.timeLimit = Math.max(lvl.timeLimit || 90, 110);
          }
        });
      }

      initEngine();
    }
    setIsPlaying(true);
    if (engineRef.current) {
      engineRef.current.start();
    }
  };

  const handleRestart = () => {
    sound.stopBGM(0.1);
    setIsWon(false);
    setIsGameOver(false);
    setIsPlaying(false);
    setShowShop(false);
    initEngine();
  };

  const handleTogglePause = () => {
    if (engineRef.current && engineState) {
      engineRef.current.setPaused(!engineState.isPaused);
    }
  };

  const handleToggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.enabled = next;
    sound.bgmEnabled = next;
    if (next) {
      sound.resumeBGM();
    } else {
      sound.pauseBGM();
    }
  };

  const handleDismissDialogue = () => {
    if (engineRef.current) {
      engineRef.current.dismissDialogue();
    }
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100vw',
        height: '100vh',
        overflow: 'hidden',
        background: '#070912',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* HUD Bar */}
      {engineState && (
        <HUD
          world={world}
          state={engineState}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onTogglePause={handleTogglePause}
          onExit={onExitToMenu}
          onOpenShop={() => setShowShop(true)}
        />
      )}

      {/* Main Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          imageRendering: 'pixelated',
        }}
      />

      {/* Dialogue Overlay */}
      {engineState?.activeDialogue && (
        <DialogueBox
          title={engineState.activeDialogue.title}
          text={engineState.activeDialogue.text}
          onDismiss={handleDismissDialogue}
        />
      )}

      {/* Game Ready Modal (Pick Difficulty & Start Game) */}
      {!isPlaying && isReady && (
        <GameStartModal
          world={world}
          onPlay={(diff) => handleStartPlay(diff)}
        />
      )}

      {/* Win Screen / Game Over Screen */}
      {(isWon || isGameOver) && (
        <GameOverModal
          isWon={isWon}
          score={finalScore}
          timeRemaining={timeRemaining}
          reason={gameOverReason}
          onPlayAgain={handleRestart}
          onCreateAnother={onCreateNew}
          onExitToMenu={onExitToMenu}
        />
      )}

      {/* Avatar Wardrobe & Skin Shop Modal */}
      {showShop && (
        <AvatarShopModal onClose={() => setShowShop(false)} />
      )}

      {/* Mobile Virtual Controls */}
      {isPlaying && !isWon && !isGameOver && isTouchDevice && (
        <MobileControls
          onMove={(dx, dy) => {
            if (engineRef.current) engineRef.current.setVirtualMovement(dx, dy);
          }}
          onAction={(action) => {
            if (engineRef.current) engineRef.current.triggerVirtualAction(action);
          }}
          nearbyInteractable={engineState?.nearbyInteractable}
          stealthActive={engineState?.isStealth}
          dashCooldownProgress={engineState?.player ? Math.max(0, Math.min(1, 1 - (engineState.player.dashCooldown || 0) / 1.15)) : 1}
        />
      )}

      {/* Bottom Controls Pill (Desktop Keyboard Only) */}
      {isPlaying && !isWon && !isGameOver && !isTouchDevice && (
        <div style={{
          position: 'absolute',
          bottom: '12px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          background: 'rgba(11, 15, 25, 0.85)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          padding: '6px 16px',
          borderRadius: '20px',
          fontSize: '11px',
          color: '#94a3b8',
          fontFamily: '"Chakra Petch", sans-serif',
          pointerEvents: 'none',
          userSelect: 'none',
          zIndex: 10,
        }}>
          <span><b style={{ color: '#00f2fe' }}>WASD</b> / <b style={{ color: '#00f2fe' }}>Arrows</b> Move</span>
          <span>•</span>
          <span><b style={{ color: '#f6d365' }}>[Space]</b> Dash</span>
          <span>•</span>
          <span><b style={{ color: '#00f2fe' }}>[F]</b> Stun EMP</span>
          <span>•</span>
          <span><b style={{ color: '#a855f7' }}>[C]</b> Sneak</span>
          <span>•</span>
          <span><b style={{ color: '#ffd700' }}>[E]</b> Interact / Takedown</span>
          <span>•</span>
          <span>Portal: <b style={{ color: '#43e97b' }}>Score Quota</b></span>
        </div>
      )}
    </div>
  );
};
