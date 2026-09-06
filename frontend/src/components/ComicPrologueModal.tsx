import React, { useState, useMemo, useEffect } from 'react';
import { GameWorld } from '../types/game';
import { generateComicStory, ComicStory, ComicPanel, ComicDialogue } from '../utils/comicStoryGenerator';
import { sound } from '../engine/sound';
import { Play, ChevronRight, ChevronLeft, FastForward, BookOpen, Layers, Volume2, VolumeX, Sparkles, Zap, Flame, Radio } from 'lucide-react';

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
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [panelAnimKey, setPanelAnimKey] = useState<number>(0);

  const totalPanels = story.panels.length;
  const currentPanel: ComicPanel = story.panels[currentPanelIndex];

  // Trigger sound effect on panel entry
  useEffect(() => {
    if (!soundMuted) {
      sound.playComicPageTurn();
    }
    setPanelAnimKey((k) => k + 1);
  }, [currentPanelIndex, soundMuted]);

  const handleNext = () => {
    if (currentPanelIndex < totalPanels - 1) {
      setCurrentPanelIndex((prev) => prev + 1);
    } else {
      handleLaunch();
    }
  };

  const handlePrev = () => {
    if (currentPanelIndex > 0) {
      setCurrentPanelIndex((prev) => prev - 1);
    }
  };

  const handleLaunch = () => {
    if (!soundMuted) {
      sound.playComicPunch();
    }
    onStartGame();
  };

  const handleSFXClick = () => {
    if (!soundMuted) {
      sound.playComicPunch();
    }
    setPunchAnim(true);
    setTimeout(() => setPunchAnim(false), 450);
  };

  const handleToggleSound = () => {
    setSoundMuted(!soundMuted);
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#06040b',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '20px 24px',
        overflowY: 'auto',
        overflowX: 'hidden',
        color: '#ffffff',
        fontFamily: '"Chakra Petch", sans-serif',
        // Layered Spider-Verse Ben-Day Dot Grid
        backgroundImage: `
          radial-gradient(rgba(0, 242, 254, 0.18) 1.5px, transparent 1.5px),
          radial-gradient(rgba(255, 0, 85, 0.14) 1.5px, transparent 1.5px)
        `,
        backgroundSize: '24px 24px, 32px 32px',
        backgroundPosition: '0 0, 12px 12px',
        animation: 'benDayScroll 30s linear infinite',
      }}
    >
      {/* Spider-Verse Radial Speed Lines Overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          backgroundImage: `repeating-conic-gradient(from 0deg, rgba(255,255,255,0.03) 0deg 5deg, transparent 5deg 15deg)`,
          animation: 'speedLines 8s ease-in-out infinite',
          zIndex: 1,
        }}
      />

      {/* TOP HEADER: Spider-Verse Dimension Bar & Controls */}
      <div
        style={{
          width: '100%',
          maxWidth: '1200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 10,
          marginBottom: '16px',
        }}
      >
        {/* Universe Tag & Comic Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Dimension Badge with Glitch */}
          <div
            style={{
              background: '#000000',
              border: '2px solid #00f2fe',
              boxShadow: '4px 4px 0 #ff0055, 0 0 15px rgba(0, 242, 254, 0.5)',
              padding: '6px 12px',
              borderRadius: '4px',
              transform: 'skew(-3deg)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Zap size={14} color="#00f2fe" fill="#00f2fe" />
            <span
              style={{
                fontFamily: '"Bangers", "Press Start 2P", cursive, sans-serif',
                fontSize: '14px',
                letterSpacing: '1.5px',
                color: '#ffffff',
                textShadow: '-1px -1px 0 #00f2fe, 1px 1px 0 #ff0055',
              }}
            >
              {story.universeTag || 'EARTH-808'}
            </span>
          </div>

          <div>
            <div
              style={{
                fontFamily: '"Bangers", "Press Start 2P", cursive, sans-serif',
                fontSize: '26px',
                letterSpacing: '2px',
                color: '#ffffff',
                textTransform: 'uppercase',
                margin: 0,
                lineHeight: 1.1,
                textShadow: '-2px -2px 0 #00f2fe, 2px 2px 0 #ff0055, 0 0 20px rgba(0, 242, 254, 0.6)',
              }}
            >
              {story.title}
            </div>
            <div style={{ fontSize: '12px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.8px' }}>
              {story.subtitle}
            </div>
          </div>
        </div>

        {/* Action Controls (Sound, Strip Mode, Skip) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              padding: '8px 12px',
              color: soundMuted ? '#94a3b8' : '#00f2fe',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 700,
            }}
            title={soundMuted ? 'Unmute comic SFX' : 'Mute comic SFX'}
          >
            {soundMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
            {soundMuted ? 'MUTED' : 'AUDIO ON'}
          </button>

          {/* Mode Switch: Slideshow vs Full Strip */}
          <button
            type="button"
            onClick={() => setIsStripMode(!isStripMode)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '6px',
              padding: '8px 14px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 700,
              fontFamily: '"Chakra Petch", sans-serif',
            }}
          >
            {isStripMode ? <BookOpen size={16} color="#ffd700" /> : <Layers size={16} color="#00f2fe" />}
            {isStripMode ? 'CINEMATIC MODE' : 'COMIC WALL'}
          </button>

          {/* SKIP TO GAME BUTTON */}
          <button
            type="button"
            onClick={handleLaunch}
            style={{
              background: 'linear-gradient(135deg, #ff0055 0%, #ff5500 100%)',
              border: '2px solid #000000',
              boxShadow: '4px 4px 0 #000000, 0 0 20px rgba(255, 0, 85, 0.6)',
              borderRadius: '8px',
              padding: '8px 18px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '13px',
              fontWeight: 900,
              fontFamily: '"Bangers", "Press Start 2P", cursive, sans-serif',
              letterSpacing: '1px',
              transform: 'skew(-4deg)',
              transition: 'transform 0.15s, box-shadow 0.15s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'skew(-4deg) scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'skew(-4deg) scale(1)';
            }}
          >
            <FastForward size={16} /> SKIP TO GAME
          </button>
        </div>
      </div>

      {/* MAIN CINEMATIC STAGE */}
      <div
        key={panelAnimKey}
        style={{
          width: '100%',
          maxWidth: '1200px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10,
          animation: isStripMode ? 'none' : 'spiderVerseZoom 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
          transform: punchAnim ? 'scale(0.99) rotate(-0.5deg)' : 'scale(1) rotate(0deg)',
          transition: 'transform 0.15s ease-out',
        }}
      >
        {isStripMode ? (
          /* Comic Wall Mode (all panels stacked in dynamic magazine format) */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '28px', paddingBottom: '30px' }}>
            {story.panels.map((panel) => (
              <SpiderVersePanel
                key={panel.panelNumber}
                panel={panel}
                totalPanels={totalPanels}
                heroCodename={story.heroCodename}
                onSFXClick={handleSFXClick}
                isFullWidth
              />
            ))}

            <div style={{ textAlign: 'center', marginTop: '10px' }}>
              <button
                type="button"
                onClick={handleLaunch}
                style={{
                  background: 'linear-gradient(90deg, #00f2fe 0%, #ff0055 100%)',
                  color: '#000000',
                  border: '4px solid #000000',
                  boxShadow: '6px 6px 0 #000000, 0 0 35px rgba(0, 242, 254, 0.7)',
                  borderRadius: '14px',
                  padding: '16px 48px',
                  fontSize: '20px',
                  fontWeight: 900,
                  fontFamily: '"Bangers", "Press Start 2P", cursive, sans-serif',
                  letterSpacing: '2px',
                  cursor: 'pointer',
                  transform: 'skew(-3deg)',
                }}
              >
                🚀 LEAP OF FAITH // START MISSION!
              </button>
            </div>
          </div>
        ) : (
          /* Cinematic Slideshow Mode (Full Focus with Spider-Verse Layout) */
          <SpiderVersePanel
            panel={currentPanel}
            totalPanels={totalPanels}
            heroCodename={story.heroCodename}
            onSFXClick={handleSFXClick}
            punchAnim={punchAnim}
          />
        )}
      </div>

      {/* BOTTOM FOOTER: Progress Navigation & Big Action Button */}
      {!isStripMode && (
        <div
          style={{
            width: '100%',
            maxWidth: '1200px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
            position: 'relative',
            zIndex: 10,
            marginTop: '16px',
            paddingTop: '12px',
            borderTop: '2px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Back Button */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentPanelIndex === 0}
            style={{
              background: currentPanelIndex === 0 ? 'rgba(255,255,255,0.05)' : '#1e293b',
              color: currentPanelIndex === 0 ? '#475569' : '#ffffff',
              border: '2px solid #000000',
              boxShadow: currentPanelIndex === 0 ? 'none' : '4px 4px 0 #000000',
              borderRadius: '8px',
              padding: '10px 20px',
              fontSize: '13px',
              fontWeight: 800,
              cursor: currentPanelIndex === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontFamily: '"Bangers", "Press Start 2P", cursive, sans-serif',
              letterSpacing: '1px',
              opacity: currentPanelIndex === 0 ? 0.4 : 1,
            }}
          >
            <ChevronLeft size={18} /> PREV BEAT
          </button>

          {/* Spider-Verse Segmented Progress Pill */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {story.panels.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentPanelIndex(idx)}
                style={{
                  width: idx === currentPanelIndex ? '42px' : '14px',
                  height: '12px',
                  borderRadius: '6px',
                  background: idx === currentPanelIndex ? '#00f2fe' : 'rgba(255, 255, 255, 0.2)',
                  border: '2px solid #000000',
                  boxShadow: idx === currentPanelIndex ? '0 0 12px #00f2fe' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: idx === currentPanelIndex ? 'skew(-6deg) scale(1.1)' : 'skew(-6deg)',
                }}
                title={`Jump to panel ${idx + 1}`}
              />
            ))}
          </div>

          {/* Next Beat or Final Mission Launch */}
          {currentPanelIndex < totalPanels - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              style={{
                background: 'linear-gradient(90deg, #ffd700 0%, #ff9900 100%)',
                color: '#000000',
                border: '3px solid #000000',
                boxShadow: '4px 4px 0 #000000, 0 0 20px rgba(255, 215, 0, 0.5)',
                borderRadius: '8px',
                padding: '10px 26px',
                fontSize: '14px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontFamily: '"Bangers", "Press Start 2P", cursive, sans-serif',
                letterSpacing: '1.5px',
                transform: 'skew(-4deg)',
                transition: 'transform 0.15s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'skew(-4deg) scale(1.05)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'skew(-4deg) scale(1)';
              }}
            >
              NEXT BEAT <ChevronRight size={18} />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleLaunch}
              style={{
                background: 'linear-gradient(90deg, #00f2fe 0%, #ff0055 100%)',
                color: '#000000',
                border: '3px solid #000000',
                boxShadow: '5px 5px 0 #000000, 0 0 30px rgba(0, 242, 254, 0.8)',
                borderRadius: '10px',
                padding: '12px 32px',
                fontSize: '15px',
                fontWeight: 900,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                fontFamily: '"Bangers", "Press Start 2P", cursive, sans-serif',
                letterSpacing: '2px',
                transform: 'skew(-4deg)',
                animation: 'pulse 1.6s infinite ease-in-out',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'skew(-4deg) scale(1.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'skew(-4deg) scale(1)';
              }}
            >
              <Play size={18} fill="#000000" /> LEAP OF FAITH // ENTER SECTOR!
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ============================================================================
// Spider-Verse Panel Subcomponent
// ============================================================================
interface SpiderVersePanelProps {
  panel: ComicPanel;
  totalPanels: number;
  heroCodename: string;
  onSFXClick: () => void;
  punchAnim?: boolean;
  isFullWidth?: boolean;
}

const SpiderVersePanel: React.FC<SpiderVersePanelProps> = ({
  panel,
  totalPanels,
  heroCodename,
  onSFXClick,
  punchAnim,
  isFullWidth,
}) => {
  return (
    <div
      style={{
        background: 'rgba(10, 14, 26, 0.95)',
        border: '4px solid #000000',
        borderRadius: '14px',
        boxShadow: `
          8px 8px 0px #000000,
          -4px -4px 0px rgba(0, 242, 254, 0.6),
          4px 4px 25px rgba(255, 0, 85, 0.3)
        `,
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(12px)',
        transform: punchAnim ? 'scale(0.99) rotate(-0.5deg)' : 'scale(1)',
        transition: 'transform 0.15s ease',
      }}
    >
      {/* Chromatic Top Corner Accent Slashes */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '180px',
          height: '6px',
          background: 'linear-gradient(90deg, transparent 0%, #00f2fe 50%, #ff0055 100%)',
        }}
      />

      {/* TOP ROW: Panel Number Tag & Freeze-Frame Badge */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '16px',
        }}
      >
        {/* Panel Tag */}
        <div
          style={{
            background: '#ff0055',
            color: '#ffffff',
            border: '2px solid #000000',
            boxShadow: '3px 3px 0 #000000',
            padding: '4px 14px',
            fontSize: '12px',
            fontWeight: 900,
            letterSpacing: '1px',
            fontFamily: '"Bangers", "Press Start 2P", cursive, sans-serif',
            transform: 'skew(-6deg)',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <Sparkles size={13} />
          PANEL {panel.panelNumber} // {totalPanels}: {panel.title}
        </div>

        {/* Freeze-Frame Hero Tag */}
        {panel.freezeFrameBadge && (
          <div
            style={{
              background: '#000000',
              color: '#00f2fe',
              border: '2px solid #00f2fe',
              boxShadow: '3px 3px 0 #ff0055',
              padding: '4px 12px',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '1px',
              fontFamily: '"Bangers", "Press Start 2P", cursive, sans-serif',
              transform: 'skew(-4deg)',
              textShadow: '0 0 8px #00f2fe',
            }}
          >
            {panel.freezeFrameBadge}
          </div>
        )}
      </div>

      {/* SPIDER-VERSE YELLOW NOTEBOOK MONOLOGUE CARD (Miles voiceover thought box) */}
      {panel.thoughtMonologue && (
        <div
          style={{
            background: '#ffeb3b',
            color: '#111827',
            border: '3px solid #000000',
            boxShadow: '5px 5px 0 #000000',
            borderRadius: '4px',
            padding: '12px 18px',
            marginBottom: '18px',
            position: 'relative',
            transform: 'rotate(-0.8deg)',
            backgroundImage: 'repeating-linear-gradient(#ffeb3b, #ffeb3b 22px, #facc15 23px, #ffeb3b 24px)',
            lineHeight: '1.45',
          }}
        >
          {/* Red Pin Icon / Tape effect */}
          <div
            style={{
              position: 'absolute',
              top: '-8px',
              left: '18px',
              width: '16px',
              height: '16px',
              borderRadius: '50%',
              background: '#ef4444',
              border: '2px solid #000',
              boxShadow: '1px 1px 0 #000',
            }}
          />

          <div
            style={{
              fontSize: '10px',
              fontWeight: 900,
              color: '#92400e',
              letterSpacing: '1px',
              textTransform: 'uppercase',
              marginBottom: '4px',
              fontFamily: '"Bangers", "Press Start 2P", cursive, sans-serif',
            }}
          >
            INTERNAL MONOLOGUE // {heroCodename}
          </div>

          <div
            style={{
              fontFamily: '"Fredoka", "Chakra Petch", sans-serif',
              fontSize: '14px',
              fontWeight: 700,
              color: '#1c1917',
              fontStyle: 'italic',
            }}
          >
            "{panel.thoughtMonologue}"
          </div>
        </div>
      )}

      {/* LOCATION & NARRATIVE CAPTION STRIP */}
      <div
        style={{
          background: 'rgba(0, 0, 0, 0.75)',
          borderLeft: `5px solid ${panel.accentColor}`,
          padding: '8px 16px',
          fontSize: '12px',
          color: '#e2e8f0',
          fontWeight: 700,
          marginBottom: '18px',
          letterSpacing: '0.8px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
        }}
      >
        <Radio size={14} color={panel.accentColor} />
        <span>{panel.narrationBox}</span>
      </div>

      {/* CENTER VIGNETTE: Visual Emojis + Giant 3D Action SFX Sticker */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          marginBottom: '20px',
          flexWrap: 'wrap',
          background: panel.bgGradient,
          border: '3px solid #000000',
          borderRadius: '12px',
          padding: '16px 20px',
          boxShadow: 'inset 0 0 30px rgba(0, 0, 0, 0.7)',
        }}
      >
        {/* Scene Icons & Descriptive Subtext */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div
            style={{
              fontSize: '44px',
              background: 'rgba(0, 0, 0, 0.6)',
              border: '2px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '12px',
              padding: '8px 16px',
              lineHeight: 1,
              textShadow: '0 0 20px rgba(0, 242, 254, 0.6)',
            }}
          >
            {panel.sceneEmoji}
          </div>

          <div style={{ maxWidth: '420px', fontSize: '13px', color: '#f1f5f9', fontWeight: 600, lineHeight: 1.4 }}>
            {panel.sceneDescription}
          </div>
        </div>

        {/* GIANT 3D SPIDER-VERSE ACTION SOUND BADGE (Interactive!) */}
        <button
          type="button"
          onClick={onSFXClick}
          title="Click to rumble and trigger sound effect!"
          style={{
            background: panel.sfxColor,
            color: '#000000',
            border: '4px solid #000000',
            boxShadow: `
              3px 3px 0 #000,
              6px 6px 0 #ff0055,
              -3px -3px 0 #00f2fe
            `,
            borderRadius: '6px',
            padding: '8px 18px',
            fontSize: '18px',
            fontWeight: 900,
            fontFamily: '"Bangers", "Press Start 2P", cursive, sans-serif',
            letterSpacing: '1.5px',
            cursor: 'pointer',
            transform: 'rotate(-5deg) skew(-4deg)',
            transition: 'transform 0.1s ease',
            userSelect: 'none',
          }}
          onMouseDown={(e) => {
            e.currentTarget.style.transform = 'rotate(3deg) skew(-2deg) scale(1.15)';
          }}
          onMouseUp={(e) => {
            e.currentTarget.style.transform = 'rotate(-5deg) skew(-4deg) scale(1)';
          }}
        >
          {panel.soundEffect}
        </button>
      </div>

      {/* DIALOGUE BUBBLES SECTION */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {panel.dialogues.map((dlg, idx) => (
          <SpiderVerseSpeechBubble key={idx} dialogue={dlg} />
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// Spider-Verse Speech Bubble Subcomponent
// ============================================================================
interface SpiderVerseSpeechBubbleProps {
  dialogue: ComicDialogue;
}

const SpiderVerseSpeechBubble: React.FC<SpiderVerseSpeechBubbleProps> = ({ dialogue }) => {
  const isHero = dialogue.speaker === 'hero';
  const isBoss = dialogue.speaker === 'boss';
  const isAlly = dialogue.speaker === 'ally';

  let bubbleBg = '#ffffff';
  let bubbleColor = '#000000';
  let borderColor = '#000000';
  let badgeBg = '#00f2fe';
  let shadowColor = '#00f2fe';

  if (isHero) {
    bubbleBg = '#f0fdff';
    borderColor = '#00f2fe';
    badgeBg = '#00f2fe';
    shadowColor = '#00f2fe';
  } else if (isBoss) {
    bubbleBg = '#fff1f2';
    borderColor = '#ff0055';
    badgeBg = '#ff0055';
    shadowColor = '#ff0055';
  } else if (isAlly) {
    bubbleBg = '#fffbeb';
    borderColor = '#f59e0b';
    badgeBg = '#f59e0b';
    shadowColor = '#f59e0b';
  }

  const isAlignRight = dialogue.tailPosition === 'right' || isBoss;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: isAlignRight ? 'row-reverse' : 'row',
        alignItems: 'flex-start',
        gap: '12px',
        animation: 'bubblePop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      {/* Avatar Pill with Chromatic Border */}
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: badgeBg,
          border: '3px solid #000000',
          boxShadow: `3px 3px 0 #000000, 0 0 12px ${shadowColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '22px',
          flexShrink: 0,
        }}
      >
        {dialogue.avatar}
      </div>

      {/* Speech Bubble Container */}
      <div style={{ maxWidth: '80%', position: 'relative' }}>
        {/* Speaker Name Tag */}
        <div
          style={{
            fontSize: '11px',
            fontWeight: 900,
            color: '#cbd5e1',
            marginBottom: '4px',
            textAlign: isAlignRight ? 'right' : 'left',
            fontFamily: '"Bangers", "Press Start 2P", cursive, sans-serif',
            letterSpacing: '1px',
            textShadow: '1px 1px 0 #000',
          }}
        >
          {dialogue.speakerName}
        </div>

        {/* Bubble Shape with Pointer Tail */}
        <div
          style={{
            background: bubbleBg,
            color: bubbleColor,
            border: `3px solid ${borderColor}`,
            borderRadius: '14px',
            boxShadow: `4px 4px 0 #000000, 0 0 14px ${shadowColor}40`,
            padding: '10px 16px',
            fontSize: '14px',
            fontWeight: 700,
            lineHeight: '1.4',
            fontFamily: '"Chakra Petch", sans-serif',
            transform: isAlignRight ? 'skew(1.5deg)' : 'skew(-1.5deg)',
          }}
        >
          {dialogue.text}
        </div>
      </div>
    </div>
  );
};
