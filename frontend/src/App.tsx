import React, { useState } from 'react';
import { LandingPage } from './components/LandingPage';
import { ImageUploader } from './components/ImageUploader';
import { GenerationModal } from './components/GenerationModal';
import { GameView } from './components/GameView';
import { AvatarShopModal } from './components/AvatarShopModal';
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
import { GameWorld, CustomGameSettings } from './types/game';

type AppView = 'landing' | 'upload' | 'game';

export const App: React.FC = () => {
  const [view, setView] = useState<AppView>('landing');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedSampleId, setSelectedSampleId] = useState<string | undefined>();
  const [previewUrl, setPreviewUrl] = useState<string | undefined>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(false);
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
    setGameSessionId(Date.now());
    setView('upload');
  };

  const handleExitToMenu = () => {
    setSelectedFile(null);
    setSelectedSampleId(undefined);
    setPreviewUrl(undefined);
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
        // Only append theme if there's no active uploaded file, OR if user explicitly specified a prompt!
        if (settings.theme && (!activeFile || settings.customPrompt)) {
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

      // Send to FastAPI backend
      const res = await fetch('/api/generate-game', {
        method: 'POST',
        headers,
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const generatedData: GameWorld = await res.json();
      console.log('[App] Generated world received:', generatedData.title, '| Theme:', generatedData.map?.theme);
      setCurrentGameWorld(generatedData);
      setGameSessionId(Date.now());
      setGenerationComplete(true);
    } catch (err) {
      console.warn('Backend unavailable or encountered issue. Using intelligent procedural fallback:', err);
      const promptLower = (settings?.customPrompt || '').toLowerCase();
      const themeLower = (settings?.theme || '').toLowerCase();
      const sampleId = (activeSampleId || '').toLowerCase();
      const fileLower = (activeFile?.name || '').toLowerCase();

      let fallbackGame = DEMO_HOSPITAL;
      if (
        themeLower === 'hospital' ||
        promptLower.includes('hospital') ||
        promptLower.includes('clinic') ||
        promptLower.includes('medical') ||
        promptLower.includes('doctor') ||
        promptLower.includes('nurse') ||
        promptLower.includes('patient') ||
        promptLower.includes('surgery') ||
        promptLower.includes('infirmary') ||
        promptLower.includes('ward') ||
        promptLower.includes('stretcher') ||
        promptLower.includes('trauma') ||
        promptLower.includes('health') ||
        promptLower.includes('ambulance') ||
        fileLower.includes('hospital') ||
        fileLower.includes('clinic') ||
        fileLower.includes('medical') ||
        fileLower.includes('doctor') ||
        fileLower.includes('nurse') ||
        fileLower.includes('ward') ||
        fileLower.includes('patient') ||
        fileLower.includes('trauma') ||
        sampleId === 'hospital'
      ) {
        fallbackGame = DEMO_HOSPITAL;
      } else if (
        themeLower === 'kitchen' ||
        promptLower.includes('kitchen') ||
        promptLower.includes('chef') ||
        promptLower.includes('cook') ||
        promptLower.includes('restaurant') ||
        promptLower.includes('bistro') ||
        promptLower.includes('cafe') ||
        promptLower.includes('culinary') ||
        promptLower.includes('stove') ||
        fileLower.includes('kitchen') ||
        fileLower.includes('chef') ||
        fileLower.includes('cook') ||
        fileLower.includes('restaurant') ||
        sampleId === 'kitchen'
      ) {
        fallbackGame = DEMO_KITCHEN;
      } else if (
        themeLower === 'airport' ||
        promptLower.includes('airport') ||
        promptLower.includes('plane') ||
        promptLower.includes('airplane') ||
        promptLower.includes('flight') ||
        promptLower.includes('jet') ||
        promptLower.includes('tarmac') ||
        promptLower.includes('runway') ||
        promptLower.includes('hangar') ||
        fileLower.includes('airport') ||
        fileLower.includes('flight') ||
        fileLower.includes('plane') ||
        fileLower.includes('jet') ||
        sampleId === 'airport'
      ) {
        fallbackGame = DEMO_AIRPORT;
      } else if (
        themeLower === 'police' ||
        promptLower.includes('police') ||
        promptLower.includes('cop') ||
        promptLower.includes('precinct') ||
        promptLower.includes('constable') ||
        promptLower.includes('jail') ||
        promptLower.includes('sheriff') ||
        promptLower.includes('prison') ||
        fileLower.includes('police') ||
        fileLower.includes('cop') ||
        fileLower.includes('jail') ||
        fileLower.includes('precinct') ||
        sampleId === 'police'
      ) {
        fallbackGame = DEMO_POLICE;
      } else if (
        themeLower === 'snow' ||
        promptLower.includes('snow') ||
        promptLower.includes('mountain') ||
        promptLower.includes('ice') ||
        promptLower.includes('frost') ||
        promptLower.includes('penguin') ||
        promptLower.includes('arctic') ||
        promptLower.includes('glacier') ||
        fileLower.includes('snow') ||
        fileLower.includes('mountain') ||
        fileLower.includes('ice') ||
        fileLower.includes('frost') ||
        fileLower.includes('penguin') ||
        sampleId === 'snow'
      ) {
        fallbackGame = DEMO_SNOW;
      } else if (
        themeLower === 'railway' ||
        promptLower.includes('railway') ||
        promptLower.includes('station') ||
        promptLower.includes('train') ||
        promptLower.includes('metro') ||
        promptLower.includes('subway') ||
        promptLower.includes('transit') ||
        promptLower.includes('track') ||
        promptLower.includes('locomotive') ||
        fileLower.includes('rail') ||
        fileLower.includes('train') ||
        fileLower.includes('station') ||
        fileLower.includes('metro') ||
        sampleId === 'railway'
      ) {
        fallbackGame = DEMO_RAILWAY;
      } else if (
        themeLower === 'volcano' ||
        promptLower.includes('volcano') ||
        promptLower.includes('lava') ||
        promptLower.includes('magma') ||
        promptLower.includes('fire') ||
        promptLower.includes('inferno') ||
        fileLower.includes('volcano') ||
        fileLower.includes('lava') ||
        sampleId === 'volcano'
      ) {
        fallbackGame = DEMO_VOLCANO;
      } else if (
        themeLower === 'desert' ||
        promptLower.includes('desert') ||
        promptLower.includes('sand') ||
        promptLower.includes('pyramid') ||
        promptLower.includes('dune') ||
        promptLower.includes('egypt') ||
        fileLower.includes('desert') ||
        fileLower.includes('sand') ||
        fileLower.includes('pyramid') ||
        sampleId === 'desert'
      ) {
        fallbackGame = DEMO_DESERT;
      } else if (
        themeLower === 'ocean' ||
        promptLower.includes('ocean') ||
        promptLower.includes('sea') ||
        promptLower.includes('water') ||
        promptLower.includes('underwater') ||
        promptLower.includes('aquatic') ||
        fileLower.includes('ocean') ||
        fileLower.includes('sea') ||
        fileLower.includes('water') ||
        sampleId === 'ocean'
      ) {
        fallbackGame = DEMO_OCEAN;
      } else if (
        themeLower === 'space' ||
        promptLower.includes('space') ||
        promptLower.includes('alien') ||
        promptLower.includes('cosmic') ||
        promptLower.includes('star') ||
        promptLower.includes('galaxy') ||
        fileLower.includes('space') ||
        fileLower.includes('alien') ||
        sampleId === 'space'
      ) {
        fallbackGame = DEMO_SPACE;
      } else if (
        themeLower === 'haunted' ||
        promptLower.includes('haunt') ||
        promptLower.includes('ghost') ||
        promptLower.includes('spooky') ||
        promptLower.includes('mansion') ||
        fileLower.includes('haunt') ||
        fileLower.includes('ghost') ||
        sampleId === 'haunted'
      ) {
        fallbackGame = DEMO_HAUNTED;
      } else if (
        themeLower === 'cyberpunk' ||
        promptLower.includes('cyber') ||
        promptLower.includes('tech') ||
        promptLower.includes('matrix') ||
        promptLower.includes('drone') ||
        fileLower.includes('cyber') ||
        fileLower.includes('tech') ||
        sampleId === 'cyber'
      ) {
        fallbackGame = DEMO_CYBER;
      } else if (
        themeLower === 'dungeon' ||
        promptLower.includes('dungeon') ||
        promptLower.includes('tomb') ||
        promptLower.includes('catacomb') ||
        promptLower.includes('cave') ||
        fileLower.includes('dungeon') ||
        sampleId === 'dungeon'
      ) {
        fallbackGame = DEMO_DUNGEON;
      } else if (
        themeLower === 'classroom' ||
        promptLower.includes('class') ||
        promptLower.includes('school') ||
        promptLower.includes('lecture') ||
        fileLower.includes('class') ||
        fileLower.includes('school') ||
        sampleId === 'classroom'
      ) {
        fallbackGame = DEMO_CLASSROOM;
      } else if (
        themeLower === 'office' ||
        promptLower.includes('office') ||
        promptLower.includes('desk') ||
        promptLower.includes('cubicle') ||
        fileLower.includes('office') ||
        fileLower.includes('desk') ||
        sampleId === 'desk' ||
        sampleId === 'office'
      ) {
        fallbackGame = DEMO_OFFICE;
      } else if (
        themeLower === 'nature' ||
        promptLower.includes('nature') ||
        promptLower.includes('forest') ||
        promptLower.includes('jungle') ||
        promptLower.includes('garden') ||
        fileLower.includes('nature') ||
        fileLower.includes('forest') ||
        sampleId === 'living_room' ||
        sampleId === 'nature'
      ) {
        fallbackGame = DEMO_NATURE;
      } else if (
        themeLower === 'bank' ||
        promptLower.includes('bank') ||
        promptLower.includes('vault') ||
        promptLower.includes('gold') ||
        promptLower.includes('cash') ||
        promptLower.includes('bullion') ||
        fileLower.includes('bank') ||
        fileLower.includes('vault') ||
        sampleId === 'bank'
      ) {
        fallbackGame = DEMO_BANK;
      } else {
        fallbackGame = DEMO_HOSPITAL;
      }

      const diff = settings?.difficulty || 'medium';
      const timeLimits: Record<string, number> = { easy: 100, medium: 80, hard: 60, nightmare: 45 };

      const rawFileName = activeFile ? activeFile.name.replace(/\.[^/.]+$/, "") : "";
      const formattedFileName = rawFileName ? rawFileName.charAt(0).toUpperCase() + rawFileName.slice(1) : "";

      const gameTitle = settings?.customPrompt
        ? settings.customPrompt.charAt(0).toUpperCase() + settings.customPrompt.slice(1)
        : (formattedFileName ? `Adventure in ${formattedFileName}` : fallbackGame.title);

      const bossName = fallbackGame.enemies?.[0]?.name || 'Sector Boss';

      const customDescription = settings?.customPrompt
        ? `Infiltrate ${gameTitle}. Evade ${bossName}, collect points, and reach the extraction portal.`
        : (formattedFileName
          ? `Infiltrate ${formattedFileName}. Collect ${fallbackGame.objective?.requiredScore || 130}+ points, evade ${bossName}, and escape through the exit portal.`
          : fallbackGame.description);

      const customObjective = {
        ...fallbackGame.objective,
        description: `Level 1: Score ${fallbackGame.objective?.requiredScore || 130}+ pts + 1 Sector Key -> Evade ${bossName}!`,
      };

      setCurrentGameWorld({
        ...fallbackGame,
        title: gameTitle,
        description: customDescription,
        objective: customObjective,
        difficulty: diff,
        timeLimit: timeLimits[diff] || 80,
      });
      setGameSessionId(Date.now());

      setTimeout(() => {
        setGenerationComplete(true);
      }, 2500);
    }
  };

  const handleFinishGeneration = () => {
    setIsGenerating(false);
    setView('game');
  };

  const handlePlayDemo = (demoGame: GameWorld) => {
    setCurrentGameWorld(demoGame);
    setGameSessionId(Date.now());
    setView('game');
  };

  return (
    <div style={{ minHeight: '100vh', background: '#070912' }}>
      {view === 'landing' && (
        <LandingPage
          onCreateGame={handleCreateNew}
          onPlayDemo={handlePlayDemo}
          onOpenShop={() => setShowShopModal(true)}
        />
      )}

      {view === 'upload' && (
        <div style={{ padding: '30px 20px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <ImageUploader
            key={`uploader_${gameSessionId}`}
            onImageSelected={handleImageSelected}
            onGenerate={handleGenerateGame}
            onCancel={handleExitToMenu}
            isLoading={isGenerating}
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
