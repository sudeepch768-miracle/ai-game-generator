import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  Sparkles,
  Key,
  Shield,
  Sliders,
  ArrowRight,
  Ghost,
  Building2,
} from 'lucide-react';
import { Difficulty, CustomGameSettings } from '../types/game';

interface ImageUploaderProps {
  onImageSelected: (file: File | null, sampleId?: string) => void;
  onGenerate: (
    apiKey?: string,
    settings?: CustomGameSettings,
    file?: File | null,
    sampleId?: string
  ) => void;
  onCancel: () => void;
  isLoading: boolean;
  initialPreset?: {
    sampleId?: string;
    prompt?: string;
    theme?: string;
    difficulty?: Difficulty;
    previewUrl?: string;
  };
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onImageSelected,
  onGenerate,
  onCancel,
  isLoading,
  initialPreset,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialPreset?.previewUrl || null);
  const [selectedSample, setSelectedSample] = useState<string | null>(initialPreset?.sampleId || null);
  const [customPrompt, setCustomPrompt] = useState<string>(initialPreset?.prompt || '');
  const [selectedTheme, setSelectedTheme] = useState<string>(initialPreset?.theme || '');

  // Default to user's saved Gemini key if available
  const [apiKey, setApiKey] = useState<string>(
    () => localStorage.getItem('GEMINI_API_KEY') || ''
  );
  const [showKeyInput, setShowKeyInput] = useState(false);

  // Custom Level & Difficulty Settings
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [mapSize, setMapSize] = useState<'compact' | 'standard' | 'large'>('standard');
  const [hazardLevel, setHazardLevel] = useState<'none' | 'moderate' | 'extreme'>('moderate');
  const [showCustomOptions, setShowCustomOptions] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setSelectedSample(null);
      // Clean slate: clear stale recommendations so user's image is pure
      setCustomPrompt('');
      setSelectedTheme('');
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageSelected(file, undefined);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      setSelectedSample(null);
      // Clean slate: clear stale recommendations so user's image is pure
      setCustomPrompt('');
      setSelectedTheme('');
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageSelected(file, undefined);
    }
  };

  const handleClearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    setSelectedSample(null);
    setPreviewUrl(null);
    setCustomPrompt('');
    setSelectedTheme('');
    if (fileInputRef.current) fileInputRef.current.value = '';
    onImageSelected(null, undefined);
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('GEMINI_API_KEY', key);
  };

  const handleStartGeneration = () => {
    // If user uploaded an image, do NOT force a recommendation theme unless user explicitly typed a prompt
    const effectiveTheme = selectedFile ? (customPrompt.trim() ? selectedTheme : undefined) : (selectedTheme || undefined);
    const settings: CustomGameSettings = {
      difficulty,
      mapSize,
      hazardLevel,
      timeScale: difficulty === 'nightmare' ? 'tight' : difficulty === 'easy' ? 'relaxed' : 'standard',
      theme: effectiveTheme,
      customPrompt: customPrompt.trim() || undefined,
    };
    onGenerate(apiKey, settings, selectedFile, selectedSample || undefined);
  };

  return (
    <div style={{
      maxWidth: '840px',
      width: '100%',
      margin: '0 auto',
      background: 'linear-gradient(145deg, #131726 0%, #0c0f1d 100%)',
      border: '2px solid rgba(0, 242, 254, 0.4)',
      borderRadius: '24px',
      boxShadow: '0 20px 60px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 242, 254, 0.15)',
      padding: '32px 28px',
      color: '#ffffff',
      fontFamily: '"Chakra Petch", sans-serif',
      position: 'relative',
    }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '22px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(0, 242, 254, 0.15)',
          border: '1px solid #00f2fe',
          padding: '4px 14px',
          borderRadius: '20px',
          color: '#00f2fe',
          fontSize: '12px',
          fontWeight: 700,
          marginBottom: '10px',
        }}>
          <Sparkles size={14} /> AI WORLD GENERATOR & CUSTOM STUDIO
        </div>
        <h2 style={{
          fontFamily: '"Press Start 2P", monospace',
          fontSize: '18px',
          color: '#ffffff',
          margin: '0 0 8px 0',
          textShadow: '0 0 15px rgba(0, 242, 254, 0.4)',
        }}>
          CREATE YOUR GAME
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '14px', margin: 0 }}>
          Upload any room or object photo, tune difficulty & hazards, and AI will turn it into a playable world.
        </p>
      </div>

      {/* Upload Drop Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: '2px dashed rgba(0, 242, 254, 0.5)',
          borderRadius: '18px',
          padding: previewUrl ? '16px' : '28px 20px',
          textAlign: 'center',
          background: previewUrl ? 'rgba(0, 0, 0, 0.4)' : 'rgba(0, 242, 254, 0.03)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          marginBottom: '16px',
        }}
      >
        <input
          type="file"
          ref={fileInputRef}
          onClick={(e) => { (e.target as HTMLInputElement).value = ''; }}
          onChange={handleFileChange}
          accept="image/png, image/jpeg, image/webp"
          style={{ display: 'none' }}
        />

        {previewUrl ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
            <img
              src={previewUrl}
              alt="Environment Preview"
              style={{
                maxHeight: '180px',
                width: 'auto',
                borderRadius: '12px',
                border: '2px solid #00f2fe',
                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.6)',
                objectFit: 'contain',
              }}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                Click or drag another image to replace
              </span>
              <button
                type="button"
                onClick={handleClearImage}
                style={{
                  background: 'rgba(239, 68, 68, 0.2)',
                  border: '1px solid #ef4444',
                  color: '#fca5a5',
                  borderRadius: '8px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                ✕ Remove Photo
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '50%',
              background: 'rgba(0, 242, 254, 0.1)',
              border: '1px solid #00f2fe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#00f2fe',
            }}>
              <UploadCloud size={24} />
            </div>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#f8fafc' }}>
              📸 Drop your photo here or click to browse
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Haunted house, bank vault, bedroom, messy desk, classroom, or backyard!
            </div>
          </div>
        )}
      </div>

      {/* THEME & CUSTOM PROMPT INPUT */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.35)',
        borderRadius: '14px',
        padding: '12px 16px',
        marginBottom: '18px',
        border: '1px solid rgba(0, 242, 254, 0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: '#00f2fe', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={14} /> THEME & WORLD VIBE PROMPT (OPTIONAL):
          </label>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>Overrides or guides AI classification</span>
        </div>
        <input
          type="text"
          placeholder='e.g. "haunted house with ghosts and phantoms", "bank vault with security guards and lasers"'
          value={customPrompt}
          onChange={(e) => {
            const val = e.target.value;
            setCustomPrompt(val);
            const lower = val.toLowerCase();
            if (lower.includes('railway') || lower.includes('train') || lower.includes('station') || lower.includes('metro') || lower.includes('subway') || lower.includes('transit')) setSelectedTheme('railway');
            else if (lower.includes('haunt') || lower.includes('ghost') || lower.includes('mansion') || lower.includes('spook') || lower.includes('phantom') || lower.includes('horror')) setSelectedTheme('haunted');
            else if (lower.includes('bank') || lower.includes('guard') || lower.includes('vault') || lower.includes('laser') || lower.includes('safe') || lower.includes('heist') || lower.includes('security')) setSelectedTheme('bank');
            else if (lower.includes('cyber') || lower.includes('server') || lower.includes('tech') || lower.includes('robot') || lower.includes('mech')) setSelectedTheme('cyberpunk');
            else if (lower.includes('dungeon') || lower.includes('castle') || lower.includes('catacomb') || lower.includes('cave') || lower.includes('stone') || lower.includes('ruin')) setSelectedTheme('dungeon');
            else if (lower.includes('nature') || lower.includes('forest') || lower.includes('garden') || lower.includes('plant') || lower.includes('living')) setSelectedTheme('nature');
            else if (lower.includes('class') || lower.includes('school')) setSelectedTheme('classroom');
          }}
          style={{
            width: '100%',
            boxSizing: 'border-box',
            background: '#0f172a',
            border: '1px solid #334155',
            borderRadius: '8px',
            padding: '10px 12px',
            color: '#ffffff',
            fontSize: '13px',
            fontFamily: '"Chakra Petch", sans-serif',
            outline: 'none',
          }}
        />
        {selectedTheme && (
          <div style={{ marginTop: '6px', fontSize: '11px', color: '#43e97b', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Active Thematic Profile:</span>
            <span style={{ fontWeight: 700, textTransform: 'uppercase', background: 'rgba(67, 233, 123, 0.15)', padding: '2px 8px', borderRadius: '6px' }}>
              {selectedTheme === 'haunted' ? '👻 Haunted House (Phantoms & Wraiths)' :
                selectedTheme === 'bank' ? '🏦 Bank Vault (Flashlight Guards & Lasers)' :
                  selectedTheme === 'cyberpunk' ? '💻 Cyberpunk (Security Mechs)' :
                    selectedTheme === 'dungeon' ? '🏰 Dungeon (Gargoyles & Stone Guardians)' : selectedTheme}
            </span>
          </div>
        )}
      </div>

      {/* DIFFICULTY SELECTION */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.35)',
        borderRadius: '16px',
        padding: '14px 18px',
        marginBottom: '18px',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>
            <Shield size={16} color="#00f2fe" /> SELECT GAME DIFFICULTY & CHALLENGE:
          </div>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            Affects point quotas, lives & enemy speed
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
          {[
            { id: 'easy', label: 'EASY', icon: '🟢', lives: '4 Lives', time: '100s', quota: 'Lower Quota', color: '#22c55e' },
            { id: 'medium', label: 'MEDIUM', icon: '🟡', lives: '3 Lives', time: '80s', quota: 'Standard Quota', color: '#eab308' },
            { id: 'hard', label: 'HARD', icon: '🔴', lives: '2 Lives', time: '60s', quota: 'Higher Quota', color: '#f97316' },
            { id: 'nightmare', label: 'NIGHTMARE', icon: '💀', lives: '1 Life (1-Hit)', time: '45s', quota: 'Maximum Quota', color: '#ef4444' },
          ].map((d) => {
            const isChosen = difficulty === d.id;
            return (
              <button
                key={d.id}
                type="button"
                onClick={() => setDifficulty(d.id as Difficulty)}
                style={{
                  background: isChosen ? `rgba(${d.id === 'nightmare' ? '239, 68, 68' : d.id === 'hard' ? '249, 115, 22' : d.id === 'medium' ? '234, 179, 8' : '34, 197, 94'}, 0.2)` : 'rgba(255, 255, 255, 0.04)',
                  border: `2px solid ${isChosen ? d.color : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '12px',
                  padding: '10px 8px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s',
                  boxShadow: isChosen ? `0 0 15px ${d.color}40` : 'none',
                }}
              >
                <div style={{ fontSize: '14px', marginBottom: '2px' }}>{d.icon}</div>
                <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '9px', color: isChosen ? d.color : '#ffffff', marginBottom: '4px' }}>
                  {d.label}
                </div>
                <div style={{ fontSize: '10px', color: '#cbd5e1', fontWeight: 600 }}>
                  {d.lives}
                </div>
                <div style={{ fontSize: '9px', color: '#94a3b8' }}>
                  {d.time} • {d.quota}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* CUSTOM LEVEL CONTROLS TOGGLE */}
      <div style={{
        background: 'rgba(0, 0, 0, 0.25)',
        borderRadius: '14px',
        padding: '10px 16px',
        marginBottom: '18px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}>
        <div
          onClick={() => setShowCustomOptions(!showCustomOptions)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 700, color: '#00f2fe' }}>
            <Sliders size={14} />
            <span>CUSTOM LEVEL SPECIFICATIONS {showCustomOptions ? '▲' : '▼'}</span>
          </div>
          <span style={{ fontSize: '11px', color: '#94a3b8' }}>
            {mapSize.toUpperCase()} MAP • {hazardLevel.toUpperCase()} HAZARDS
          </span>
        </div>

        {showCustomOptions && (
          <div style={{ marginTop: '14px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {/* Map Size */}
            <div>
              <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                Map Scale:
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['compact', 'standard', 'large'] as const).map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setMapSize(s)}
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      borderRadius: '8px',
                      border: `1px solid ${mapSize === s ? '#00f2fe' : '#334155'}`,
                      background: mapSize === s ? 'rgba(0, 242, 254, 0.2)' : '#0f172a',
                      color: mapSize === s ? '#00f2fe' : '#94a3b8',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {s.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Hazard Density */}
            <div>
              <div style={{ fontSize: '12px', color: '#cbd5e1', marginBottom: '6px', fontWeight: 600 }}>
                Hazard Density:
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                {(['none', 'moderate', 'extreme'] as const).map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setHazardLevel(h)}
                    style={{
                      flex: 1,
                      padding: '6px 8px',
                      borderRadius: '8px',
                      border: `1px solid ${hazardLevel === h ? '#ff0844' : '#334155'}`,
                      background: hazardLevel === h ? 'rgba(255, 8, 68, 0.2)' : '#0f172a',
                      color: hazardLevel === h ? '#ff0844' : '#94a3b8',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    {h.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* GEMINI API KEY STATUS */}
      <div style={{
        marginBottom: '20px',
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '12px',
        padding: '8px 14px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px' }}>
          <Key size={14} color="#22c55e" />
          <span style={{ color: '#22c55e', fontWeight: 700 }}>
            Gemini 3.6 Flash Key Connected ✓
          </span>
        </div>
        <button
          type="button"
          onClick={() => setShowKeyInput(!showKeyInput)}
          style={{ background: 'none', border: 'none', color: '#00f2fe', fontSize: '11px', cursor: 'pointer' }}
        >
          {showKeyInput ? 'Hide Key' : 'Edit Key'}
        </button>
      </div>

      {showKeyInput && (
        <div style={{ marginBottom: '18px' }}>
          <input
            type="password"
            placeholder="Paste your Gemini API key"
            value={apiKey}
            onChange={(e) => handleSaveApiKey(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              background: '#0f172a',
              border: '1px solid #334155',
              borderRadius: '8px',
              padding: '8px 12px',
              color: '#ffffff',
              fontSize: '12px',
              fontFamily: 'monospace',
            }}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '14px' }}>
        <button
          onClick={onCancel}
          style={{
            background: 'transparent',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#94a3b8',
            padding: '14px 22px',
            borderRadius: '14px',
            fontSize: '13px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Back
        </button>

        <button
          disabled={(!previewUrl && !customPrompt.trim()) || isLoading}
          onClick={handleStartGeneration}
          style={{
            flex: 1,
            background: (previewUrl || customPrompt.trim())
              ? 'linear-gradient(90deg, #ff007f 0%, #00f2fe 100%)'
              : 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '14px',
            padding: '16px 24px',
            fontFamily: '"Press Start 2P", monospace',
            fontSize: '12px',
            cursor: (previewUrl || customPrompt.trim()) ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: (previewUrl || customPrompt.trim()) ? '0 6px 25px rgba(255, 0, 127, 0.4)' : 'none',
            transition: 'all 0.2s',
            opacity: (previewUrl || customPrompt.trim()) ? 1 : 0.5,
          }}
        >
          GENERATE & PLAY WORLD
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
};
