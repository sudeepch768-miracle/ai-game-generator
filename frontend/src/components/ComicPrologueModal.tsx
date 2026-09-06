import React, { useState, useMemo, useEffect } from 'react';
import { GameWorld } from '../types/game';
import { generateComicStory, ComicStory, ComicPanel, ComicCaptionCardData } from '../utils/comicStoryGenerator';
import { sound } from '../engine/sound';
import { ComicIllustration } from './ComicIllustration';
import {
  Play,
  ChevronRight,
  ChevronLeft,
  FastForward,
  BookOpen,
  Layers,
  Volume2,
  VolumeX,
  Sparkles,
  Zap,
  Camera,
  Globe,
  MessageSquare,
  Flame,
} from 'lucide-react';

interface ComicPrologueModalProps {
  world: GameWorld;
  onStartGame: () => void;
  onClose?: () => void;
  userImageUrl?: string;
}

export const ComicPrologueModal: React.FC<ComicPrologueModalProps> = ({
  world,
  onStartGame,
  onClose,
  userImageUrl,
}) => {
  const story: ComicStory = useMemo(() => generateComicStory(world), [world]);
  const [currentBeatIndex, setCurrentBeatIndex] = useState<number>(0);
  const [isPageView, setIsPageView] = useState<boolean>(true); // Default to Page View (matches reference image!)
  const [soundMuted, setSoundMuted] = useState<boolean>(false);
  const [punchAnim, setPunchAnim] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<number>(0); // Page 0 = Panels 1 & 2; Page 1 = Panel 3 / Climax

  const totalPanels = story.panels.length;
  const currentPanel: ComicPanel = story.panels[currentBeatIndex];

  // Divide panels into pages (2 panels per page, matching classic comic layout)
  const pagePanels = useMemo(() => {
    const pages: ComicPanel[][] = [];
    for (let i = 0; i < story.panels.length; i += 2) {
      pages.push(story.panels.slice(i, i + 2));
    }
    return pages;
  }, [story.panels]);

  // Audio effect on beat/page change
  useEffect(() => {
    if (!soundMuted) {
      sound.playComicPageTurn();
    }
  }, [currentBeatIndex, activePage, isPageView, soundMuted]);

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
    setTimeout(() => setPunchAnim(false), 400);
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
        background: '#04060d',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '16px 18px',
        overflowY: 'auto',
        overflowX: 'hidden',
        color: '#ffffff',
        fontFamily: '"Chakra Petch", sans-serif',
        // Spider-Verse Dot Matrix Grid
        backgroundImage: `
          radial-gradient(rgba(0, 242, 254, 0.16) 1.5px, transparent 1.5px),
          radial-gradient(rgba(225, 29, 72, 0.14) 1.5px, transparent 1.5px)
        `,
        backgroundSize: '24px 24px, 32px 32px',
        backgroundPosition: '0 0, 12px 12px',
      }}
    >
      {/* ==================================================================== */}
      {/* TOP HEADER: Universe Dimension Bar & Interactive Controls */}
      {/* ==================================================================== */}
      <div
        style={{
          width: '100%',
          maxWidth: '820px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          flexWrap: 'wrap',
          marginBottom: '14px',
          zIndex: 20,
        }}
      >
        {/* Left Badge & Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              background: '#000000',
              border: '2px solid #00f2fe',
              boxShadow: '3px 3px 0 #e11d48, 0 0 12px rgba(0, 242, 254, 0.5)',
              padding: '4px 10px',
              borderRadius: '2px',
              transform: 'skew(-3deg)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Zap size={14} color="#00f2fe" fill="#00f2fe" />
            <span
              style={{
                fontFamily: '"Bangers", cursive, sans-serif',
                fontSize: '13px',
                letterSpacing: '1.2px',
                color: '#ffffff',
              }}
            >
              {story.universeTag || 'EARTH-808'}
            </span>
          </div>

          <div>
            <h1
              style={{
                fontFamily: '"Bangers", cursive, sans-serif',
                fontSize: '24px',
                letterSpacing: '1.5px',
                margin: 0,
                lineHeight: 1.1,
                color: '#ffffff',
                textTransform: 'uppercase',
                textShadow: '-2px -2px 0 #00f2fe, 2px 2px 0 #e11d48',
              }}
            >
              {story.title}
            </h1>
            <p style={{ margin: 0, fontSize: '11px', color: '#94a3b8', fontWeight: 700, letterSpacing: '0.6px' }}>
              {story.subtitle}
            </p>
          </div>
        </div>

        {/* Right Navigation & Audio Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Sound Toggle */}
          <button
            type="button"
            onClick={handleToggleSound}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1.5px solid rgba(255, 255, 255, 0.25)',
              borderRadius: '4px',
              padding: '6px 12px',
              color: soundMuted ? '#94a3b8' : '#00f2fe',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 800,
            }}
            title={soundMuted ? 'Turn Sound ON' : 'Mute Sound'}
          >
            {soundMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            {soundMuted ? 'MUTED' : 'AUDIO ON'}
          </button>

          {/* View Mode Toggle: Comic Page vs Beat Slideshow */}
          <button
            type="button"
            onClick={() => setIsPageView(!isPageView)}
            style={{
              background: isPageView ? '#0f172a' : 'rgba(255, 255, 255, 0.08)',
              border: '1.5px solid #00f2fe',
              boxShadow: '2px 2px 0 #e11d48',
              borderRadius: '4px',
              padding: '6px 12px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              fontWeight: 800,
              fontFamily: '"Chakra Petch", sans-serif',
            }}
          >
            {isPageView ? <Layers size={15} color="#00f2fe" /> : <BookOpen size={15} color="#facc15" />}
            {isPageView ? 'PAGE VIEW' : 'BEATS VIEW'}
          </button>

          {/* Fast Skip to Game */}
          <button
            type="button"
            onClick={handleLaunch}
            style={{
              background: 'linear-gradient(135deg, #e11d48 0%, #f97316 100%)',
              border: '1.5px solid #000000',
              boxShadow: '3px 3px 0 #000000',
              borderRadius: '4px',
              padding: '6px 14px',
              color: '#ffffff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '12px',
              fontWeight: 900,
              fontFamily: '"Bangers", cursive, sans-serif',
              letterSpacing: '1px',
              transform: 'skew(-3deg)',
            }}
          >
            <FastForward size={14} /> SKIP
          </button>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* MAIN COMIC STAGE: Graphic Novel Layout (Exact Match to Screenshot!) */}
      {/* ==================================================================== */}
      <div
        style={{
          width: '100%',
          maxWidth: '780px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        {isPageView ? (
          /* ================================================================ */
          /* 📖 GRAPHIC NOVEL PAGE VIEW (Matches User Uploaded Image Layout!) */
          /* ================================================================ */
          <div
            style={{
              width: '100%',
              background: '#ffffff', // Clean white comic paper margins/gutters
              border: '3px solid #000000',
              boxShadow: '10px 10px 0px #000000, 0 0 35px rgba(0, 0, 0, 0.8)',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px', // White horizontal gutter between panels!
              borderRadius: '4px',
              transform: punchAnim ? 'scale(0.995)' : 'scale(1)',
              transition: 'transform 0.15s ease',
            }}
          >
            {/* The 2 Stacked Panels on the active comic page */}
            {(pagePanels[activePage] || pagePanels[0]).map((panel, idx) => (
              <GraphicNovelPanel
                key={panel.panelNumber}
                panel={panel}
                panelIndex={idx === 0 ? 0 : 1}
                theme={story.theme}
                heroCodename={story.heroCodename}
                onSFXClick={handleSFXClick}
                userImageUrl={userImageUrl}
              />
            ))}

            {/* ============================================================ */}
            {/* BOTTOM COMIC ISSUE FOOTER (Matches Reference Screenshot Footer!) */}
            {/* ============================================================ */}
            <div
              style={{
                background: '#090d16',
                border: '1.5px solid #000000',
                padding: '9px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                color: '#e2e8f0',
                fontSize: '11px',
                fontFamily: '"Comic Neue", "Chakra Petch", sans-serif',
                fontWeight: 700,
                letterSpacing: '0.6px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Camera size={13} color="#00f2fe" />
                <span style={{ color: '#cbd5e1' }}>@SECTOR_DISPATCH</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Flame size={13} color="#ef4444" />
                <span style={{ color: '#f87171' }}>{story.universeTag || 'EARTH-808'} • ISSUE #01</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MessageSquare size={13} color="#facc15" />
                <span style={{ color: '#cbd5e1' }}>PROTOCOL // {story.heroCodename}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Globe size={13} color="#38bdf8" />
                <span style={{ color: '#38bdf8' }}>REALITY-TO-PLAY.IO</span>
              </div>
            </div>
          </div>
        ) : (
          /* ================================================================ */
          /* 🎬 BEATS SLIDESHOW VIEW (Beat-by-Beat Focus Mode) */
          /* ================================================================ */
          <div
            style={{
              width: '100%',
              background: '#ffffff',
              border: '3px solid #000000',
              boxShadow: '10px 10px 0px #000000, 0 0 35px rgba(0, 0, 0, 0.8)',
              padding: '12px',
              borderRadius: '4px',
            }}
          >
            <GraphicNovelPanel
              panel={currentPanel}
              panelIndex={currentBeatIndex % 2}
              theme={story.theme}
              heroCodename={story.heroCodename}
              onSFXClick={handleSFXClick}
              userImageUrl={userImageUrl}
              isSingleBeat
            />
          </div>
        )}
      </div>

      {/* ==================================================================== */}
      {/* BOTTOM CONTROLS BAR: Page Switching & Big "START MISSION" Button */}
      {/* ==================================================================== */}
      <div
        style={{
          width: '100%',
          maxWidth: '780px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          marginTop: '16px',
          paddingTop: '12px',
          borderTop: '1.5px solid rgba(255, 255, 255, 0.12)',
          zIndex: 20,
        }}
      >
        {isPageView ? (
          /* Page View Navigation */
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {pagePanels.length > 1 && (
              <>
                <button
                  type="button"
                  disabled={activePage === 0}
                  onClick={() => setActivePage((p) => Math.max(0, p - 1))}
                  style={{
                    background: activePage === 0 ? '#1e293b' : '#0f172a',
                    color: activePage === 0 ? '#475569' : '#ffffff',
                    border: '1.5px solid #000000',
                    boxShadow: activePage === 0 ? 'none' : '3px 3px 0 #000000',
                    borderRadius: '4px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: activePage === 0 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <ChevronLeft size={16} /> PREV PAGE
                </button>

                <span style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.8px' }}>
                  PAGE {activePage + 1} / {pagePanels.length}
                </span>

                <button
                  type="button"
                  disabled={activePage >= pagePanels.length - 1}
                  onClick={() => setActivePage((p) => Math.min(pagePanels.length - 1, p + 1))}
                  style={{
                    background: activePage >= pagePanels.length - 1 ? '#1e293b' : '#0f172a',
                    color: activePage >= pagePanels.length - 1 ? '#475569' : '#ffffff',
                    border: '1.5px solid #000000',
                    boxShadow: activePage >= pagePanels.length - 1 ? 'none' : '3px 3px 0 #000000',
                    borderRadius: '4px',
                    padding: '8px 14px',
                    fontSize: '12px',
                    fontWeight: 800,
                    cursor: activePage >= pagePanels.length - 1 ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  NEXT PAGE <ChevronRight size={16} />
                </button>
              </>
            )}
          </div>
        ) : (
          /* Beat Slideshow Navigation */
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              disabled={currentBeatIndex === 0}
              onClick={() => setCurrentBeatIndex((i) => Math.max(0, i - 1))}
              style={{
                background: currentBeatIndex === 0 ? '#1e293b' : '#0f172a',
                color: currentBeatIndex === 0 ? '#475569' : '#ffffff',
                border: '1.5px solid #000000',
                boxShadow: currentBeatIndex === 0 ? 'none' : '3px 3px 0 #000000',
                borderRadius: '4px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: currentBeatIndex === 0 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <ChevronLeft size={16} /> PREV BEAT
            </button>

            <span style={{ fontSize: '12px', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.8px' }}>
              BEAT {currentBeatIndex + 1} / {totalPanels}
            </span>

            <button
              type="button"
              disabled={currentBeatIndex >= totalPanels - 1}
              onClick={() => setCurrentBeatIndex((i) => Math.min(totalPanels - 1, i + 1))}
              style={{
                background: currentBeatIndex >= totalPanels - 1 ? '#1e293b' : '#0f172a',
                color: currentBeatIndex >= totalPanels - 1 ? '#475569' : '#ffffff',
                border: '1.5px solid #000000',
                boxShadow: currentBeatIndex >= totalPanels - 1 ? 'none' : '3px 3px 0 #000000',
                borderRadius: '4px',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: 800,
                cursor: currentBeatIndex >= totalPanels - 1 ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              NEXT BEAT <ChevronRight size={16} />
            </button>
          </div>
        )}

        {/* Big Action Button: START GAME / LEAP OF FAITH */}
        <button
          type="button"
          onClick={handleLaunch}
          style={{
            background: 'linear-gradient(90deg, #00f2fe 0%, #e11d48 100%)',
            color: '#000000',
            border: '2.5px solid #000000',
            boxShadow: '4px 4px 0 #000000, 0 0 24px rgba(0, 242, 254, 0.6)',
            borderRadius: '6px',
            padding: '10px 28px',
            fontSize: '14px',
            fontWeight: 900,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: '"Bangers", cursive, sans-serif',
            letterSpacing: '1.5px',
            transform: 'skew(-3deg)',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'skew(-3deg) scale(1.04)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'skew(-3deg) scale(1)';
          }}
        >
          <Play size={16} fill="#000000" /> LEAP OF FAITH // ENTER SECTOR
        </button>
      </div>
    </div>
  );
};

// ============================================================================
// 🖼️ GRAPHIC NOVEL PANEL COMPONENT
// ============================================================================
interface GraphicNovelPanelProps {
  panel: ComicPanel;
  panelIndex: number; // 0 = top panel, 1 = bottom panel
  theme: string;
  heroCodename: string;
  onSFXClick: () => void;
  userImageUrl?: string;
  isSingleBeat?: boolean;
}

const GraphicNovelPanel: React.FC<GraphicNovelPanelProps> = ({
  panel,
  panelIndex,
  theme,
  heroCodename,
  onSFXClick,
  userImageUrl,
  isSingleBeat,
}) => {
  // Extract or auto-derive the 2 to 3 caption cards for this panel
  const captionCards: ComicCaptionCardData[] = useMemo(() => {
    if (panel.captionCards && panel.captionCards.length > 0) {
      return panel.captionCards;
    }

    // Auto-generate 3 caption cards from thoughtMonologue and dialogues:
    const cards: ComicCaptionCardData[] = [];

    if (panelIndex === 0) {
      // Top Panel Layout (matches Top Panel in user reference screenshot):
      // Card 1: Top-Left (Monologue opening premise)
      // Card 2: Middle-Right (Escalation)
      // Card 3: Middle-Right lower (Resolve)
      if (panel.thoughtMonologue) {
        cards.push({
          text: panel.thoughtMonologue.split('.')[0] + ',',
          position: 'top-left',
        });
      } else {
        cards.push({
          text: panel.narrationBox || 'UNDERCOVER INFILTRATION IN PROGRESS...',
          position: 'top-left',
        });
      }

      if (panel.dialogues && panel.dialogues[0]) {
        cards.push({
          text: panel.dialogues[0].text,
          speaker: panel.dialogues[0].speakerName,
          position: 'middle-right',
        });
      }

      if (panel.dialogues && panel.dialogues[1]) {
        cards.push({
          text: panel.dialogues[1].text,
          speaker: panel.dialogues[1].speakerName,
          position: 'middle-right',
        });
      } else {
        cards.push({
          text: '...AND HOW I CAN BE A FORCE FOR GOOD IN THIS SECTOR.',
          position: 'middle-right',
        });
      }
    } else {
      // Bottom Panel Layout (matches Bottom Panel in user reference screenshot):
      // Card 1: Top-Left (Oath)
      // Card 2: Middle-Left (The Threat)
      // Card 3: Bottom-Right (The Vow)
      cards.push({
        text: `I SWORE TO TAKE THIS ${theme.toUpperCase()} SECTOR BACK FROM THE BAD GUYS.`,
        position: 'top-left',
      });

      cards.push({
        text: 'FROM THE CORRUPT, THE VILE, AND THE EVIL SHADOW GUARDS...',
        position: 'middle-left',
      });

      cards.push({
        text: "I SWORE TO SAVE PEOPLE FROM THOSE WHO'D DO THEM HARM.",
        position: 'bottom-right',
      });
    }

    return cards;
  }, [panel, panelIndex, theme]);

  return (
    <div
      style={{
        width: '100%',
        height: isSingleBeat ? '440px' : '380px',
        border: '2px solid #000000',
        position: 'relative',
        overflow: 'hidden',
        background: '#040711',
      }}
    >
      {/* 1. Atmospheric Cinematic Illustration (Vector Art Backdrop) */}
      <ComicIllustration
        theme={theme}
        panelIndex={panelIndex}
        heroCodename={heroCodename}
        userImageUrl={userImageUrl}
      />

      {/* 2. Interactive Sound FX Sticker (Spider-Verse Punch Badge) */}
      <button
        type="button"
        onClick={onSFXClick}
        title="Click to rumble sound effect!"
        style={{
          position: 'absolute',
          top: panelIndex === 0 ? '14px' : 'auto',
          bottom: panelIndex === 0 ? 'auto' : '18px',
          left: panelIndex === 0 ? 'auto' : '18px',
          right: panelIndex === 0 ? '16px' : 'auto',
          background: panel.sfxColor || '#ef4444',
          color: '#000000',
          border: '2px solid #000000',
          boxShadow: '3px 3px 0 #000000',
          borderRadius: '2px',
          padding: '4px 10px',
          fontSize: '13px',
          fontWeight: 900,
          fontFamily: '"Bangers", cursive, sans-serif',
          letterSpacing: '1px',
          cursor: 'pointer',
          transform: 'rotate(-4deg)',
          zIndex: 15,
          userSelect: 'none',
        }}
      >
        {panel.soundEffect || '💥 *THWIP!*'}
      </button>

      {/* 3. The Comic Caption Cards (Exact Match to User Reference Screenshot!) */}
      {captionCards.map((card, idx) => (
        <ComicCaptionCard key={idx} card={card} index={idx} panelIndex={panelIndex} />
      ))}
    </div>
  );
};

// ============================================================================
// 💬 COMIC CAPTION CARD (Exact match to the boxes in user's image!)
// ============================================================================
interface ComicCaptionCardProps {
  card: ComicCaptionCardData;
  index: number;
  panelIndex: number;
}

const ComicCaptionCard: React.FC<ComicCaptionCardProps> = ({ card, index, panelIndex }) => {
  // Compute positions across the panel matching the exact reference screenshot layout:
  // In Panel 1:
  // - Card 1: Top-Left
  // - Card 2: Middle-Right
  // - Card 3: Middle-Right lower
  // In Panel 2:
  // - Card 1: Top-Left
  // - Card 2: Middle-Left
  // - Card 3: Bottom-Right

  let posStyle: React.CSSProperties = {
    position: 'absolute',
    maxWidth: '280px',
    zIndex: 10,
  };

  if (panelIndex === 0) {
    if (card.position === 'top-left' || index === 0) {
      posStyle = { position: 'absolute', top: '22px', left: '20px', maxWidth: '270px' };
    } else if (card.position === 'middle-right' && index === 1) {
      posStyle = { position: 'absolute', top: '105px', right: '22px', maxWidth: '260px' };
    } else {
      posStyle = { position: 'absolute', top: '185px', right: '22px', maxWidth: '260px' };
    }
  } else {
    if (card.position === 'top-left' || index === 0) {
      posStyle = { position: 'absolute', top: '22px', left: '20px', maxWidth: '290px' };
    } else if (card.position === 'middle-left' || index === 1) {
      posStyle = { position: 'absolute', top: '105px', left: '20px', maxWidth: '280px' };
    } else {
      posStyle = { position: 'absolute', bottom: '22px', right: '22px', maxWidth: '300px' };
    }
  }

  // Signature Red Block Offset Shadow (from user's uploaded reference image!)
  const shadowColor = card.shadowColor || '#e11d48';

  return (
    <div
      style={{
        ...posStyle,
        background: '#ffffff', // Crisp pure white card
        border: '1.5px solid #000000', // Thin solid dark outline
        borderRadius: '2px', // Sharp comic corners
        boxShadow: `4px 4px 0px ${shadowColor}`, // Bold flat solid red 3D block offset!
        padding: '8px 14px',
        animation: 'bubblePop 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        userSelect: 'none',
      }}
    >
      {/* Optional Speaker / Identifier Tag */}
      {card.speaker && (
        <div
          style={{
            fontSize: '9px',
            fontWeight: 900,
            fontFamily: '"Bangers", cursive, sans-serif',
            color: '#e11d48',
            letterSpacing: '1px',
            textTransform: 'uppercase',
            marginBottom: '2px',
          }}
        >
          {card.speaker}
        </div>
      )}

      {/* Uppercase Comic Lettering Typography */}
      <p
        style={{
          margin: 0,
          fontFamily: '"Comic Neue", "Chakra Petch", sans-serif',
          fontSize: '13px',
          fontWeight: 700,
          lineHeight: '1.35',
          color: '#000000',
          letterSpacing: '0.4px',
          textTransform: 'uppercase',
        }}
      >
        {card.text}
      </p>
    </div>
  );
};
