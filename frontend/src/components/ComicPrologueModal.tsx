import React, { useState, useMemo } from 'react';
import { GameWorld } from '../types/game';
import { generateComicStory, ComicStory, ComicPanel, ComicDialogue } from '../utils/comicStoryGenerator';
import { sound } from '../engine/sound';
import { Play, ChevronRight, ChevronLeft, FastForward, BookOpen, Layers, Volume2, Sparkles, Zap } from 'lucide-react';

interface ComicPrologueModalProps {
  world: GameWorld;
  onStartGame: () => void;
  onClose?: () => void;
}

export const ComicPrologueModal: React.FC<ComicPrologueModalProps> = ({
  world,
  onStartGame,
  onClose,
}) => {
  const story: ComicStory = useMemo(() => generateComicStory(world), [world]);
  const [currentPanelIndex, setCurrentPanelIndex] = useState<number>(0);
  const [isStripMode, setIsStripMode] = useState<boolean>(false);
  const [punchAnim, setPunchAnim] = useState<boolean>(false);

  const totalPanels = story.panels.length;
  const currentPanel: ComicPanel = story.panels[currentPanelIndex];

  const handleNext = () => {
    if (currentPanelIndex < totalPanels - 1) {
      sound.playComicPageTurn();
      setCurrentPanelIndex((prev) => prev + 1);
    } else {
      handleLaunch();
    }
  };

  const handlePrev = () => {
    if (currentPanelIndex > 0) {
      sound.playComicPageTurn();
      setCurrentPanelIndex((prev) => prev - 1);
    }
  };

  const handleLaunch = () => {
    sound.playComicPunch();
    onStartGame();
  };

  const handleSFXClick = () => {
    sound.playComicPunch();
    setPunchAnim(true);
    setTimeout(() => setPunchAnim(false), 400);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 50,
        background: 'rgba(5, 7, 15, 0.94)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px',
        overflowY: 'auto',
        // Halftone pattern overlay
        backgroundImage: `radial-gradient(rgba(255, 255, 255, 0.08) 1.5px, transparent 1.5px)`,
        backgroundSize: '16px 16px',
      }}
    >
      {/* Top Header Bar */}
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* Comic Tagline */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              background: '#ffd700',
              color: '#000000',
              fontWeight: 900,
              fontSize: '12px',
              letterSpacing: '1px',
              padding: '4px 10px',
              border: '2px solid #000',
              boxShadow: '3px 3px 0 #000',
              textTransform: 'uppercase',
              fontFamily: '"Bangers", "Press Start 2P", cursive, sans-serif',
            }}
          >
            ORIGIN STORY
          </div>
          <div>
            <h2
              style={{
                fontFamily: '"Bangers", "Press Start 2P", cursive, sans-serif',
                fontSize: '20px',
                letterSpacing: '1.5px',
                color: '#ffffff',
                margin: 0,
                lineHeight: 1.2,
                textShadow: '2px 2px 0px #000, 0 0 10px rgba(0, 242, 254, 0.6)',
              }}
            >
              {story.title}
            </h2>
            <div style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
              {story.subtitle}
            </div>
          </div>
        </div>

        {/* Action Controls (View Mode & Skip) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsStripMode(!isStripMode)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '2px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              padding: '6px 12px',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'all 0.15s',
            }}
          >
            {isStripMode ? <BookOpen size={14} /> : <Layers size={14} />}
            {isStripMode ? 'SLIDESHOW' : 'FULL STRIP'}
          </button>

          <button
            type="button"
            onClick={handleLaunch}
            style={{
              background: 'linear-gradient(90deg, #ff0055 0%, #ff5500 100%)',
              border: '2px solid #000',
              boxShadow: '3px 3px 0 #000',
              borderRadius: '8px',
              padding: '6px 14px',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 900,
              letterSpacing: '0.5px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: '"Bangers", "Press Start 2P", cursive, sans-serif',
            }}
          >
            <FastForward size={14} /> SKIP TO GAME
          </button>
        </div>
      </div>

      {/* Main Comic Container */}
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          background: '#090d19',
          border: '4px solid #000000',
          boxShadow: '10px 10px 0px #000000, 0 0 40px rgba(0, 242, 254, 0.25)',
          borderRadius: '12px',
          overflow: 'hidden',
          position: 'relative',
          padding: '16px',
        }}
      >
        {/* Strip Mode: Show all panels stacked / side-by-side */}
        {isStripMode ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {story.panels.map((panel, idx) => (
              <RenderPanelCard
                key={panel.panelNumber}
                panel={panel}
                totalPanels={totalPanels}
                onSFXClick={handleSFXClick}
                isFullWidth
              />
            ))}

            <div style={{ textAlign: 'center', paddingTop: '10px' }}>
              <button
                type="button"
                onClick={handleLaunch}
                style={{
                  background: 'linear-gradient(90deg, #00f2fe 0%, #4facfe 100%)',
                  color: '#000000',
                  border: '3px solid #000',
                  boxShadow: '5px 5px 0 #000',
                  padding: '14px 36px',
                  fontSize: '16px',
                  fontWeight: 900,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontFamily: '"Bangers", "Press Start 2P", cursive, sans-serif',
                  letterSpacing: '1px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Zap size={20} fill="#000" /> START MISSION NOW!
              </button>
            </div>
          </div>
        ) : (
          /* Slideshow Mode: Single panel with animated navigation */
          <div>
            <RenderPanelCard
              panel={currentPanel}
              totalPanels={totalPanels}
              onSFXClick={handleSFXClick}
              punchAnim={punchAnim}
            />

            {/* Pagination Dots & Navigation Controls */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginTop: '16px',
                paddingTop: '12px',
                borderTop: '2px dashed #1e293b',
                gap: '12px',
              }}
            >
              {/* Back Button */}
              <button
                type="button"
                onClick={handlePrev}
                disabled={currentPanelIndex === 0}
                style={{
                  background: currentPanelIndex === 0 ? '#1e293b' : '#334155',
                  color: currentPanelIndex === 0 ? '#64748b' : '#ffffff',
                  border: '2px solid #000',
                  boxShadow: currentPanelIndex === 0 ? 'none' : '3px 3px 0 #000',
                  borderRadius: '8px',
                  padding: '8px 16px',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: currentPanelIndex === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  opacity: currentPanelIndex === 0 ? 0.5 : 1,
                }}
              >
                <ChevronLeft size={16} /> PREV
              </button>

              {/* Panel Dots */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {story.panels.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      sound.playComicPageTurn();
                      setCurrentPanelIndex(idx);
                    }}
                    style={{
                      width: idx === currentPanelIndex ? '28px' : '10px',
                      height: '10px',
                      borderRadius: '5px',
                      background: idx === currentPanelIndex ? '#ffd700' : 'rgba(255,255,255,0.2)',
                      border: '1px solid #000',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    title={`Go to panel ${idx + 1}`}
                  />
                ))}
              </div>

              {/* Next or Start Game Button */}
              {currentPanelIndex < totalPanels - 1 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  style={{
                    background: '#ffd700',
                    color: '#000000',
                    border: '2px solid #000',
                    boxShadow: '3px 3px 0 #000',
                    borderRadius: '8px',
                    padding: '8px 20px',
                    fontSize: '12px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: '"Bangers", "Press Start 2P", cursive, sans-serif',
                    letterSpacing: '1px',
                  }}
                >
                  NEXT PANEL <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleLaunch}
                  style={{
                    background: 'linear-gradient(90deg, #22c55e 0%, #10b981 100%)',
                    color: '#000000',
                    border: '3px solid #000',
                    boxShadow: '4px 4px 0 #000',
                    borderRadius: '10px',
                    padding: '10px 24px',
                    fontSize: '13px',
                    fontWeight: 900,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontFamily: '"Bangers", "Press Start 2P", cursive, sans-serif',
                    letterSpacing: '1px',
                    animation: 'pulse 1.8s infinite ease-in-out',
                  }}
                >
                  <Play size={16} fill="#000" /> ENTER THE SECTOR!
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Subcomponent: Render individual Comic Panel
interface RenderPanelCardProps {
  panel: ComicPanel;
  totalPanels: number;
  onSFXClick: () => void;
  punchAnim?: boolean;
  isFullWidth?: boolean;
}

const RenderPanelCard: React.FC<RenderPanelCardProps> = ({
  panel,
  totalPanels,
  onSFXClick,
  punchAnim,
  isFullWidth,
}) => {
  return (
    <div
      style={{
        background: panel.bgGradient,
        border: `3px solid #000000`,
        borderRadius: '10px',
        boxShadow: '6px 6px 0px #000000',
        padding: '16px',
        position: 'relative',
        overflow: 'hidden',
        transition: 'transform 0.2s',
        transform: punchAnim ? 'scale(0.99) rotate(-0.5deg)' : 'scale(1)',
      }}
    >
      {/* Top Narration Caption Box */}
      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: '#ffd700',
          color: '#000000',
          border: '2px solid #000000',
          boxShadow: '3px 3px 0 #000',
          padding: '4px 12px',
          fontSize: '11px',
          fontWeight: 900,
          letterSpacing: '0.8px',
          marginBottom: '14px',
          fontFamily: '"Bangers", "Press Start 2P", cursive, sans-serif',
          textTransform: 'uppercase',
        }}
      >
        <Sparkles size={12} fill="#000" />
        PANEL {panel.panelNumber} OF {totalPanels}: {panel.title}
      </div>

      {/* Narration Context Strip */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.65)',
          borderLeft: `4px solid ${panel.accentColor}`,
          padding: '6px 12px',
          fontSize: '11px',
          color: '#e2e8f0',
          fontWeight: 700,
          marginBottom: '14px',
          fontFamily: '"Chakra Petch", sans-serif',
          letterSpacing: '0.5px',
        }}
      >
        {panel.narrationBox}
      </div>

      {/* Center Vignette & Sound Action Burst */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: '10px 0 16px 0',
          gap: '12px',
          flexWrap: 'wrap',
        }}
      >
        {/* Scene Emojis & Description */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div
            style={{
              fontSize: '38px',
              background: 'rgba(0, 0, 0, 0.4)',
              border: '2px solid rgba(255,255,255,0.15)',
              borderRadius: '12px',
              padding: '6px 14px',
              textShadow: '0 0 16px rgba(255, 215, 0, 0.4)',
              lineHeight: 1,
            }}
          >
            {panel.sceneEmoji}
          </div>
          <div style={{ fontSize: '12px', color: '#cbd5e1', maxWidth: '340px', lineHeight: '1.4', fontWeight: 600 }}>
            {panel.sceneDescription}
          </div>
        </div>

        {/* Action SFX Sticker (Interactive Clickable Sound Burst!) */}
        <button
          type="button"
          onClick={onSFXClick}
          title="Click to play comic sound effect!"
          style={{
            background: panel.sfxColor,
            color: '#000000',
            border: '3px solid #000000',
            boxShadow: '4px 4px 0 #000000',
            padding: '6px 14px',
            fontSize: '14px',
            fontWeight: 900,
            fontFamily: '"Bangers", "Press Start 2P", cursive, sans-serif',
            letterSpacing: '1px',
            transform: 'rotate(-4deg)',
            cursor: 'pointer',
            transition: 'transform 0.1s',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            userSelect: 'none',
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'rotate(2deg) scale(1.1)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'rotate(-4deg) scale(1)';
          }}
        >
          {panel.soundEffect}
        </button>
      </div>

      {/* Comic Dialogue Speech Bubbles */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
        {panel.dialogues.map((dlg, idx) => (
          <SpeechBubble key={idx} dialogue={dlg} accentColor={panel.accentColor} />
        ))}
      </div>
    </div>
  );
};

// Subcomponent: Render Comic Speech Bubble
interface SpeechBubbleProps {
  dialogue: ComicDialogue;
  accentColor: string;
}

const SpeechBubble: React.FC<SpeechBubbleProps> = ({ dialogue, accentColor }) => {
  const isHero = dialogue.speaker === 'hero';
  const isBoss = dialogue.speaker === 'boss';
  const isAlly = dialogue.speaker === 'ally';

  // Bubble style themes
  let bubbleBg = '#ffffff';
  let bubbleColor = '#000000';
  let borderColor = '#000000';
  let badgeBg = '#0284c7';
  let badgeColor = '#ffffff';

  if (isHero) {
    bubbleBg = '#f0fdfa';
    borderColor = '#0284c7';
    badgeBg = '#0284c7';
  } else if (isBoss) {
    bubbleBg = '#fef2f2';
    borderColor = '#dc2626';
    badgeBg = '#dc2626';
  } else if (isAlly) {
    bubbleBg = '#fefce8';
    borderColor = '#d97706';
    badgeBg = '#d97706';
  }

  const isAlignRight = dialogue.tailPosition === 'right' || isBoss;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isAlignRight ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: '10px',
      }}
    >
      {/* Speaker Avatar Icon */}
      <div
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: badgeBg,
          border: '2px solid #000',
          boxShadow: '2px 2px 0 #000',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '20px',
          flexShrink: 0,
        }}
      >
        {dialogue.avatar}
      </div>

      {/* Speech Bubble Body */}
      <div style={{ maxWidth: '82%', position: 'relative' }}>
        {/* Speaker Name Tag */}
        <div
          style={{
            fontSize: '10px',
            fontWeight: 800,
            color: '#cbd5e1',
            marginBottom: '3px',
            textAlign: isAlignRight ? 'right' : 'left',
            letterSpacing: '0.5px',
          }}
        >
          {dialogue.speakerName}
        </div>

        {/* Bubble Box */}
        <div
          style={{
            background: bubbleBg,
            color: bubbleColor,
            border: `2px solid ${borderColor}`,
            borderRadius: '12px',
            boxShadow: '3px 3px 0 #000000',
            padding: '8px 14px',
            fontSize: '13px',
            fontWeight: 700,
            lineHeight: '1.35',
            fontFamily: '"Chakra Petch", sans-serif',
            position: 'relative',
          }}
        >
          {dialogue.text}
        </div>
      </div>
    </div>
  );
};

