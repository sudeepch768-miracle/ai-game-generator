import React, { useState, useCallback } from 'react';
import { LandingPage } from './components/LandingPage';
import { ImageUploader } from './components/ImageUploader';
import { GenerationModal } from './components/GenerationModal';
import { GameView } from './components/GameView';
import { AvatarShopModal } from './components/AvatarShopModal';
import { WelcomeScreen } from './components/WelcomeScreen';
import {
  DEMO_HAUNTED,
  DEMO_BANK,
  DEMO_CLASSROOM,
  DEMO_CYBER,
  DEMO_DUNGEON,
  DEMO_RAILWAY,
  DEMO_POLICE,
  DEMO_SNOW,
  DEMO_HOSPITAL,
  DEMO_KITCHEN,
  DEMO_AIRPORT,
  DEMO_VOLCANO,
  DEMO_DESERT,
  DEMO_OCEAN,
  DEMO_SPACE,
  DEMO_NATURE,
  DEMO_OFFICE
} from './demoGames';
import { GameWorld, CustomGameSettings, Difficulty } from './types/game';
import { RecommendationItem } from './data/recommendations';
import { buildDynamicGameFromPhoto } from './utils/dynamicFallbackGenerator';

type AppView = 'landing' | 'upload' | 'game';

export const App: React.FC = () => {
  const [showWelcome, setShowWelcome] = useState<boolean>(true);
  const [isEntering, setIsEntering] = useState<boolean>(false);
  const [view, setView] = useState<AppView>('landing');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
  const [initialCreationPreset, setInitialCreationPreset] = useState<{
    sampleId?: string;
    prompt?: string;
    theme?: string;
    difficulty?: Difficulty;
    previewUrl?: string;
  } | undefined>(undefined);
  React.useEffect(() => {
    // Optional stored user API key
  }, []);

  const [currentGameWorld, setCurrentGameWorld] = useState<GameWorld>(DEMO_HAUNTED);
  const [gameSessionId, setGameSessionId] = useState<number>(Date.now());
  const [showShopModal, setShowShopModal] = useState(false);

  const handleImageSelected = (file: File | null, sampleId?: string) => {
    setSelectedFile(file);
    setSelectedSampleId(sampleId);
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else if (sampleId) {
      if (sampleId === 'hospital') setPreviewUrl('https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=600&auto=format&fit=crop&q=80');
      else if (sampleId === 'kitchen') setPreviewUrl('https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=600&auto=format&fit=crop&q=80');
      else if (sampleId === 'airport') setPreviewUrl('https://images.unsplash.com/photo-1530521954074-e64f6810b32d?w=600&auto=format&fit=crop&q=80');
      else if (sampleId === 'haunted') setPreviewUrl('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80');
      else if (sampleId === 'bank') setPreviewUrl('https://images.unsplash.com/photo-1501167786227-4cba60f6d58f?w=600&auto=format&fit=crop&q=80');
      else if (sampleId === 'railway') setPreviewUrl('https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=600&auto=format&fit=crop&q=80');
      else if (sampleId === 'police') setPreviewUrl('https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80');
      else if (sampleId === 'snow') setPreviewUrl('https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600&auto=format&fit=crop&q=80');
      else if (sampleId === 'cyber') setPreviewUrl('https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=600&auto=format&fit=crop&q=80');
      else if (sampleId === 'dungeon') setPreviewUrl('https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=600&auto=format&fit=crop&q=80');
      else if (sampleId === 'classroom') setPreviewUrl('https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=600&auto=format&fit=crop&q=80');
      else setPreviewUrl('https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=80');
    } else {
      setPreviewUrl(undefined);
    }
  };

  const handleCreateNew = () => {
    setSelectedFile(null);
    setSelectedSampleId(undefined);
    setPreviewUrl(undefined);
    setInitialCreationPreset(undefined);
    setGameSessionId(Date.now());
    setView('upload');
  };

  const handleCreateWithPreset = (rec: RecommendationItem) => {
    setSelectedFile(null);
    setSelectedSampleId(rec.id);
    setPreviewUrl(rec.sampleUrl);
    setInitialCreationPreset({
      sampleId: rec.id,
      prompt: rec.title,
      theme: rec.theme || rec.id,
      difficulty: rec.suggestedDifficulty,
      previewUrl: rec.sampleUrl,
    });
    setGameSessionId(Date.now());
    setView('upload');
  };

  const handleExitToMenu = () => {
    setSelectedFile(null);
    setSelectedSampleId(undefined);
    setPreviewUrl(undefined);
    setInitialCreationPreset(undefined);
    setGameSessionId(Date.now());
    setView('landing');
  };

  const handleGenerateGame = async (
    apiKey?: string,
    settings?: CustomGameSettings,
    directFile?: File | null,
    directSampleId?: string
  ) => {
    setIsGenerating(true);
    setGenerationComplete(false);

    const activeFile = directFile !== undefined ? directFile : selectedFile;
    const activeSampleId = directSampleId !== undefined ? directSampleId : selectedSampleId;

    console.log('[App] Initiating game generation:', {
      fileName: activeFile?.name,
      sampleId: activeSampleId,
      settings,
    });

    try {
      // Build form data
      const formData = new FormData();
      if (activeFile) {
        formData.append('image', activeFile);
      } else if (activeSampleId) {
        formData.append('sample_id', activeSampleId);
      }

      if (settings) {
        formData.append('difficulty', settings.difficulty);
        formData.append('map_size', settings.mapSize);
        formData.append('hazard_level', settings.hazardLevel);
        if (settings.theme) {
          formData.append('theme', settings.theme);
        }
        if (settings.customPrompt) {
          formData.append('custom_prompt', settings.customPrompt);
        }
      }

      const headers: Record<string, string> = {};
      const activeKey = apiKey || localStorage.getItem('GEMINI_API_KEY') || '';
      if (activeKey) {
        headers['x-gemini-api-key'] = activeKey;
      }

      // 45-second timeout for serverless function
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 45000);

      // Send to FastAPI backend
      const res = await fetch('/api/generate-game', {
        method: 'POST',
        headers,
        body: formData,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const generatedData: GameWorld = await res.json();
      if (!generatedData || typeof generatedData !== 'object' || !generatedData.map || !generatedData.player) {
        throw new Error('Server returned invalid or incomplete GameWorld structure');
      }

      console.log('[App] Generated world received:', generatedData.title, '| Theme:', generatedData.map?.theme);
      setCurrentGameWorld(generatedData);
      setGameSessionId(Date.now());
      setTimeout(() => {
        setGenerationComplete(true);
      }, 1200);
    } catch (err) {
      console.warn('Backend unavailable or encountered issue. Using intelligent procedural dynamic synthesizer:', err);
      const fallbackGame = await buildDynamicGameFromPhoto(
        activeFile,
        settings?.customPrompt || '',
        settings,
        activeSampleId
      );

      console.log('[App] Client-side dynamic world synthesized:', fallbackGame.title, '| Palette:', fallbackGame.palette);
      setCurrentGameWorld(fallbackGame);
      setGameSessionId(Date.now());

      setTimeout(() => {
        setGenerationComplete(true);
      }, 1500);
    }
  };

  const handleFinishGeneration = useCallback(() => {
    setIsGenerating(false);
    setView('game');
  }, []);

  const handlePlayDemo = (demoGame: GameWorld) => {
    setCurrentGameWorld(demoGame);
    setGameSessionId(Date.now());
    setView('game');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#070912' }}>
      {showWelcome && (
        <WelcomeScreen
          onTransitionStart={() => setIsEntering(true)}
          onEnter={() => {
            setShowWelcome(false);
            setIsEntering(false);
          }}
        />
      )}

      {view === 'landing' && (
        <div
          style={{
            minHeight: '100vh',
            transform: isEntering ? 'scale3d(1, 1, 1)' : showWelcome ? 'scale3d(0.92, 0.92, 1)' : 'none',
            filter: isEntering ? 'blur(0px) brightness(1)' : showWelcome ? 'blur(8px) brightness(0.65)' : 'none',
            opacity: showWelcome && !isEntering ? 0.75 : 1,
            transition: 'transform 1100ms cubic-bezier(0.22, 1, 0.36, 1), filter 1100ms cubic-bezier(0.22, 1, 0.36, 1), opacity 850ms ease-out',
            transformOrigin: 'center 40%',
            willChange: 'transform, filter, opacity',
          }}
        >
          <LandingPage
            onCreateGame={handleCreateNew}
            onPlayDemo={handlePlayDemo}
            onCreateWithPreset={handleCreateWithPreset}
            onOpenShop={() => setShowShopModal(true)}
          />
        </div>
      )}

      {view === 'upload' && (
        <div style={{ padding: '30px 20px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ImageUploader
            key={`uploader_${gameSessionId}`}
            onImageSelected={handleImageSelected}
            onGenerate={handleGenerateGame}
            onCancel={handleExitToMenu}
            isLoading={isGenerating}
            initialPreset={initialCreationPreset}
          />
        </div>
      )}

      {view === 'game' && (
        <GameView
          key={gameSessionId}
          world={currentGameWorld}
          onExitToMenu={handleExitToMenu}
          onCreateNew={handleCreateNew}
        />
      )}

      {/* 4-Step Animated Generation Modal */}
      {isGenerating && (
        <GenerationModal
          imagePreviewUrl={previewUrl}
          isComplete={generationComplete}
          onFinish={handleFinishGeneration}
        />
      )}

      {/* Global Wardrobe & Skin Shop Modal */}
      {showShopModal && (
        <AvatarShopModal onClose={() => setShowShopModal(false)} />
      )}
    </div>
  );
};

export default App;
