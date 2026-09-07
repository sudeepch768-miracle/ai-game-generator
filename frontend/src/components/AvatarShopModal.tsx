import React, { useState, useEffect, useRef } from 'react';
import {
  ALL_AVATAR_SKINS,
  AvatarSkin,
  getGemBalance,
  getOwnedSkinIds,
  getEquippedSkinId,
  buySkin,
  setEquippedSkin,
} from '../types/avatar';
import { sound } from '../engine/sound';
import { X, Sparkles, Check, Lock, ShoppingBag, ShieldCheck, Zap } from 'lucide-react';

interface AvatarShopModalProps {
  onClose: () => void;
  onSkinChanged?: () => void;
}

export const AvatarShopModal: React.FC<AvatarShopModalProps> = ({ onClose, onSkinChanged }) => {
  const [gems, setGems] = useState<number>(getGemBalance());
  const [ownedSkins, setOwnedSkins] = useState<string[]>(getOwnedSkinIds());
  const [equippedSkinId, setEquippedId] = useState<string>(getEquippedSkinId());
  const [selectedSkin, setSelectedSkin] = useState<AvatarSkin>(
    ALL_AVATAR_SKINS.find((s) => s.id === getEquippedSkinId()) || ALL_AVATAR_SKINS[0]
  );
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const previewCanvasRef = useRef<HTMLCanvasElement>(null);

  // Live Canvas Character Preview
  useEffect(() => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const renderPreview = () => {
      t += 0.05;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = canvas.width / 2;
      const cy = canvas.height / 2 + 10;
      const walkBob = Math.sin(t * 8) * 3;

      // Platform glow
      ctx.fillStyle = 'rgba(0, 242, 254, 0.12)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 30, 36, 12, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = selectedSkin.primaryColor;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.beginPath();
      ctx.ellipse(cx, cy + 28, 22, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Trail FX
      const trailColors: Record<string, string> = {
        electric: '#00f2fe',
        fire: '#f97316',
        ghostly: '#a855f7',
        smoke: '#64748b',
        sparkles: '#ec4899',
      };
      const trailColor = trailColors[selectedSkin.trailEffect] || '#00f2fe';
      for (let i = 0; i < 4; i++) {
        const pAngle = t * 4 + (i * Math.PI) / 2;
        const pRad = 26 + Math.sin(t * 3 + i) * 6;
        ctx.fillStyle = trailColor;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(pAngle) * pRad, cy + 10 + Math.sin(pAngle) * 8, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Body (Scaled 1.8x for preview)
      ctx.fillStyle = selectedSkin.primaryColor;
      ctx.beginPath();
      ctx.roundRect(cx - 16, cy - 8 + walkBob, 32, 26, 6);
      ctx.fill();

      // Accent Belt
      ctx.fillStyle = selectedSkin.accentColor;
      ctx.fillRect(cx - 14, cy + 6 + walkBob, 28, 5);

      // Head
      ctx.fillStyle = '#ffdfba';
      ctx.beginPath();
      ctx.arc(cx, cy - 18 + walkBob, 14, 0, Math.PI * 2);
      ctx.fill();

      // Headgear
      if (selectedSkin.hatType === 'fedora') {
        ctx.fillStyle = '#78350f';
        ctx.fillRect(cx - 22, cy - 26 + walkBob, 44, 5);
        ctx.fillRect(cx - 13, cy - 38 + walkBob, 26, 14);
        ctx.fillStyle = '#451a03';
        ctx.fillRect(cx - 13, cy - 28 + walkBob, 26, 3);
      } else if (selectedSkin.hatType === 'knight_helm') {
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(cx, cy - 20 + walkBob, 16, Math.PI, 0, false);
        ctx.lineTo(cx + 14, cy - 6 + walkBob);
        ctx.lineTo(cx - 14, cy - 6 + walkBob);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#0f172a';
        ctx.fillRect(cx - 10, cy - 18 + walkBob, 20, 4);
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(cx - 3, cy - 34 + walkBob, 6, 12);
      } else if (selectedSkin.hatType === 'ninja_headband') {
        ctx.fillStyle = selectedSkin.accentColor;
        ctx.fillRect(cx - 14, cy - 24 + walkBob, 28, 5);
        ctx.fillRect(cx + 12, cy - 22 + walkBob, 10, 4);
      } else if (selectedSkin.hatType === 'hood') {
        ctx.fillStyle = selectedSkin.primaryColor;
        ctx.beginPath();
        ctx.arc(cx, cy - 20 + walkBob, 18, Math.PI * 0.9, Math.PI * 2.1);
        ctx.fill();
      } else if (selectedSkin.hatType === 'space_helmet') {
        ctx.fillStyle = 'rgba(56, 189, 248, 0.25)';
        ctx.beginPath();
        ctx.arc(cx, cy - 18 + walkBob, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.fillStyle = '#0284c7';
        ctx.fillRect(cx - 15, cy - 4 + walkBob, 30, 5);
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(cx - 4, cy - 20 + walkBob, 11, Math.PI * 1.1, Math.PI * 1.6);
        ctx.stroke();
      } else if (selectedSkin.hatType === 'samurai_kabuto') {
        ctx.fillStyle = '#991b1b';
        ctx.beginPath();
        ctx.arc(cx, cy - 20 + walkBob, 16, Math.PI, 0);
        ctx.fill();
        ctx.fillStyle = '#450a0a';
        ctx.fillRect(cx - 18, cy - 18 + walkBob, 36, 6);
        ctx.fillStyle = '#fbbf24';
        ctx.beginPath();
        ctx.moveTo(cx - 13, cy - 28 + walkBob);
        ctx.quadraticCurveTo(cx, cy - 23 + walkBob, cx + 13, cy - 28 + walkBob);
        ctx.lineTo(cx, cy - 35 + walkBob);
        ctx.closePath();
        ctx.fill();
      } else if (selectedSkin.hatType === 'cowboy_hat') {
        ctx.fillStyle = '#92400e';
        ctx.beginPath();
        ctx.ellipse(cx, cy - 24 + walkBob, 22, 6, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#b45309';
        ctx.fillRect(cx - 11, cy - 35 + walkBob, 22, 13);
        ctx.fillStyle = '#451a03';
        ctx.fillRect(cx - 11, cy - 26 + walkBob, 22, 4);
      } else if (selectedSkin.hatType === 'gas_mask') {
        ctx.fillStyle = '#14532d';
        ctx.beginPath();
        ctx.arc(cx, cy - 19 + walkBob, 17, Math.PI * 0.9, Math.PI * 2.1);
        ctx.fill();
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(cx - 8, cy - 8 + walkBob, 16, 7);
        ctx.fillStyle = '#4ade80';
        ctx.fillRect(cx - 11, cy - 20 + walkBob, 8, 6);
        ctx.fillRect(cx + 3, cy - 20 + walkBob, 8, 6);
      } else if (selectedSkin.hatType === 'wizard_hat') {
        ctx.fillStyle = '#581c87';
        ctx.beginPath();
        ctx.ellipse(cx, cy - 24 + walkBob, 22, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#7c3aed';
        ctx.beginPath();
        ctx.moveTo(cx - 13, cy - 24 + walkBob);
        ctx.lineTo(cx + 14, cy - 44 + walkBob);
        ctx.lineTo(cx + 11, cy - 24 + walkBob);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(cx - 4, cy - 26 + walkBob, 8, 4.5);
      } else if (selectedSkin.hatType === 'crown') {
        ctx.fillStyle = '#eab308';
        ctx.fillRect(cx - 14, cy - 24 + walkBob, 28, 5);
        ctx.beginPath();
        ctx.moveTo(cx - 14, cy - 24 + walkBob);
        ctx.lineTo(cx - 12, cy - 36 + walkBob);
        ctx.lineTo(cx - 5, cy - 27 + walkBob);
        ctx.lineTo(cx, cy - 39 + walkBob);
        ctx.lineTo(cx + 5, cy - 27 + walkBob);
        ctx.lineTo(cx + 12, cy - 36 + walkBob);
        ctx.lineTo(cx + 14, cy - 24 + walkBob);
        ctx.closePath();
        ctx.fill();
        ctx.fillStyle = '#ef4444';
        ctx.fillRect(cx - 2, cy - 33 + walkBob, 4, 4);
        ctx.fillStyle = '#3b82f6';
        ctx.fillRect(cx - 11, cy - 31 + walkBob, 3, 3);
        ctx.fillRect(cx + 8, cy - 31 + walkBob, 3, 3);
      } else {
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath();
        ctx.arc(cx, cy - 22 + walkBob, 15, Math.PI, Math.PI * 2);
        ctx.fill();
      }

      // Visor / Eyes
      if (selectedSkin.hatType === 'visor') {
        ctx.fillStyle = selectedSkin.accentColor;
        ctx.fillRect(cx - 12, cy - 20 + walkBob, 24, 6);
      } else {
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(cx - 5, cy - 18 + walkBob, 3, 0, Math.PI * 2);
        ctx.arc(cx + 5, cy - 18 + walkBob, 3, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(renderPreview);
    };

    renderPreview();
    return () => cancelAnimationFrame(animId);
  }, [selectedSkin]);

  const handleEquip = (skin: AvatarSkin) => {
    setEquippedSkin(skin.id);
    setEquippedId(skin.id);
    setSelectedSkin(skin);
    sound.playKey();
    showToast(`Equipped ${skin.name}!`);
    if (onSkinChanged) onSkinChanged();
  };

  const handleBuy = (skin: AvatarSkin) => {
    if (gems < skin.cost) {
      sound.playBump();
      showToast('Need more gems! Collect orbs in-game.');
      return;
    }

    if (buySkin(skin.id)) {
      sound.playPurchase();
      setGems(getGemBalance());
      setOwnedSkins(getOwnedSkinIds());
      setEquippedId(skin.id);
      setSelectedSkin(skin);
      showToast(`Unlocked & Equipped ${skin.name}!`);
      if (onSkinChanged) onSkinChanged();
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 18, 0.88)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
      padding: '20px',
      userSelect: 'none',
      fontFamily: '"Chakra Petch", sans-serif',
    }}>
      <div style={{
        maxWidth: '820px',
        width: '100%',
        background: 'linear-gradient(145deg, #11162a 0%, #0c0f1d 100%)',
        border: '2px solid rgba(0, 242, 254, 0.4)',
        borderRadius: '24px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.85), 0 0 30px rgba(0, 242, 254, 0.15)',
        padding: '24px 28px',
        color: '#ffffff',
        position: 'relative',
        animation: 'popIn 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
        maxHeight: '90vh',
        overflowY: 'auto',
      }}>
        {/* Toast Alert */}
        {toastMessage && (
          <div style={{
            position: 'absolute',
            top: '16px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(90deg, #10b981, #059669)',
            color: '#ffffff',
            padding: '8px 20px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 700,
            boxShadow: '0 6px 20px rgba(16, 185, 129, 0.4)',
            zIndex: 60,
          }}>
            {toastMessage}
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: 'none',
            color: '#94a3b8',
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
            e.currentTarget.style.color = '#94a3b8';
          }}
        >
          <X size={20} />
        </button>

        {/* Header with Gem Balance */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(0, 242, 254, 0.15)',
              border: '1px solid #00f2fe',
              padding: '3px 12px',
              borderRadius: '20px',
              color: '#00f2fe',
              fontSize: '11px',
              fontWeight: 800,
              letterSpacing: '1px',
              marginBottom: '6px',
            }}>
              <ShoppingBag size={13} /> AVATAR WARDROBE & GEM VAULT
            </div>
            <h2 style={{
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '16px',
              margin: '0',
              color: '#ffffff',
            }}>
              CHARACTER CUSTOMIZATION
            </h2>
          </div>

          {/* Persistent Gem Wallet */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 215, 0, 0.15)',
            border: '2px solid #ffd700',
            padding: '6px 16px',
            borderRadius: '16px',
            boxShadow: '0 0 16px rgba(255, 215, 0, 0.25)',
          }}>
            <span style={{ fontSize: '18px' }}>💎</span>
            <div>
              <div style={{ fontSize: '10px', color: '#fef08a', fontWeight: 700 }}>YOUR GEMS</div>
              <div style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '14px', color: '#ffd700' }}>
                {gems}
              </div>
            </div>
          </div>
        </div>

        {/* Top Preview Section */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))',
          gap: '18px',
          background: 'rgba(0, 0, 0, 0.4)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '18px',
          padding: '16px',
          marginBottom: '20px',
          alignItems: 'center',
          justifyItems: 'center',
        }}>
          {/* Canvas Preview */}
          <canvas
            ref={previewCanvasRef}
            width={170}
            height={130}
            style={{ borderRadius: '12px', background: 'radial-gradient(ellipse at center, #172038 0%, #090c16 80%)' }}
          />

          {/* Skin Details & Action */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ fontSize: '20px' }}>{selectedSkin.icon}</span>
              <span style={{ fontFamily: '"Press Start 2P", monospace', fontSize: '13px', color: selectedSkin.primaryColor }}>
                {selectedSkin.name}
              </span>
              <span style={{
                fontSize: '10px',
                fontWeight: 800,
                color: '#94a3b8',
                background: 'rgba(255,255,255,0.08)',
                padding: '2px 8px',
                borderRadius: '10px',
              }}>
                {selectedSkin.tagline}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', margin: '0 0 12px 0', lineHeight: '1.4' }}>
              {selectedSkin.description}
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              {equippedSkinId === selectedSkin.id ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  border: '1px solid #10b981',
                  color: '#10b981',
                  padding: '8px 18px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '12px',
                }}>
                  <ShieldCheck size={16} /> CURRENTLY EQUIPPED
                </div>
              ) : ownedSkins.includes(selectedSkin.id) ? (
                <button
                  onClick={() => handleEquip(selectedSkin)}
                  style={{
                    background: 'linear-gradient(90deg, #00f2fe, #4facfe)',
                    border: 'none',
                    color: '#070a14',
                    padding: '8px 22px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '12px',
                    cursor: 'pointer',
                    boxShadow: '0 4px 15px rgba(0, 242, 254, 0.4)',
                    transition: 'transform 0.15s',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  EQUIP AVATAR
                </button>
              ) : (
                <button
                  onClick={() => handleBuy(selectedSkin)}
                  style={{
                    background: gems >= selectedSkin.cost
                      ? 'linear-gradient(90deg, #ffd700, #ff8800)'
                      : 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: gems >= selectedSkin.cost ? '#000000' : '#64748b',
                    padding: '8px 22px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '12px',
                    cursor: gems >= selectedSkin.cost ? 'pointer' : 'not-allowed',
                    boxShadow: gems >= selectedSkin.cost ? '0 4px 15px rgba(255, 215, 0, 0.4)' : 'none',
                    transition: 'transform 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (gems >= selectedSkin.cost) e.currentTarget.style.transform = 'scale(1.03)';
                  }}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                >
                  {gems >= selectedSkin.cost ? `UNLOCK FOR 💎 ${selectedSkin.cost}` : `NEED 💎 ${selectedSkin.cost}`}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Skins Catalog Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
        }}>
          {ALL_AVATAR_SKINS.map((skin) => {
            const isOwned = ownedSkins.includes(skin.id);
            const isEquipped = equippedSkinId === skin.id;
            const isSelected = selectedSkin.id === skin.id;

            return (
              <div
                key={skin.id}
                onClick={() => setSelectedSkin(skin)}
                style={{
                  background: isSelected ? 'rgba(0, 242, 254, 0.12)' : 'rgba(255, 255, 255, 0.04)',
                  border: `2px solid ${isEquipped ? '#10b981' : isSelected ? '#00f2fe' : 'rgba(255, 255, 255, 0.1)'}`,
                  borderRadius: '16px',
                  padding: '14px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '8px',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '24px' }}>{skin.icon}</span>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 800,
                      color: isEquipped ? '#10b981' : isOwned ? '#38bdf8' : '#ffd700',
                      background: 'rgba(0,0,0,0.4)',
                      padding: '3px 8px',
                      borderRadius: '8px',
                    }}>
                      {isEquipped ? 'EQUIPPED' : isOwned ? 'OWNED' : `💎 ${skin.cost}`}
                    </span>
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: 800, color: isSelected ? '#00f2fe' : '#ffffff', marginBottom: '2px' }}>
                    {skin.name}
                  </div>
                  <div style={{ fontSize: '11px', color: '#94a3b8', lineHeight: '1.3' }}>
                    {skin.description}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '6px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: skin.primaryColor }} />
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: skin.accentColor }} />
                  </div>

                  <div style={{ fontSize: '10px', fontWeight: 700, color: '#64748b' }}>
                    {skin.hatType.toUpperCase()}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
