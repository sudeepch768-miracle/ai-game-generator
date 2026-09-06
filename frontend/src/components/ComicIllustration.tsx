import React from 'react';

interface ComicIllustrationProps {
  theme: string;
  panelIndex: number;
  heroCodename?: string;
  userImageUrl?: string;
  showPhotoFilter?: boolean;
}

export const ComicIllustration: React.FC<ComicIllustrationProps> = ({
  theme, panelIndex, userImageUrl, showPhotoFilter,
}) => {
  if (userImageUrl && showPhotoFilter) {
    return (
      <div style={{ position: 'absolute', inset: 0, backgroundImage: `url(${userImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'contrast(140%) saturate(130%) brightness(0.85)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(rgba(0,0,0,0.35) 1.5px, transparent 1.5px)', backgroundSize: '4px 4px', mixBlendMode: 'multiply' }} />
      </div>
    );
  }
  if (theme === 'hospital') return panelIndex === 0 ? <HospitalPanel1 /> : <HospitalPanel2 />;
  if (theme === 'railway') return panelIndex === 0 ? <RailwayPanel1 /> : <RailwayPanel2 />;
  if (theme === 'bank') return panelIndex === 0 ? <BankPanel1 /> : <BankPanel2 />;
  if (theme === 'police') return panelIndex === 0 ? <PolicePanel1 /> : <PolicePanel2 />;
  if (theme === 'snow') return panelIndex === 0 ? <SnowPanel1 /> : <SnowPanel2 />;
  if (theme === 'cyberpunk') return panelIndex === 0 ? <CyberPanel1 /> : <CyberPanel2 />;
  if (theme === 'haunted') return panelIndex === 0 ? <HauntedPanel1 /> : <HauntedPanel2 />;
  if (theme === 'space') return panelIndex === 0 ? <SpacePanel1 /> : <SpacePanel2 />;
  return panelIndex === 0 ? <DefaultPanel1 /> : <DefaultPanel2 />;
};

// ═══════════════════════════════════════════════════════════════
// SVG style helper
const S = { width: '100%', height: '100%', position: 'absolute' as const, inset: 0 };

// ═══════════════════════════════════════════════════════════════
// 🏥 HOSPITAL
// ═══════════════════════════════════════════════════════════════
const HospitalPanel1: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={S}>
    <defs>
      <linearGradient id="hh" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#040e17" /><stop offset="100%" stopColor="#02080d" /></linearGradient>
      <radialGradient id="lc" cx="50%" cy="0%" r="90%"><stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" /><stop offset="100%" stopColor="#000" stopOpacity="0" /></radialGradient>
    </defs>
    <rect width="800" height="480" fill="url(#hh)" />
    <path d="M0 0 L320 200 L320 300 L0 480Z" fill="#081826" stroke="#00f2fe" strokeWidth="1" opacity="0.8" />
    <path d="M800 0 L480 200 L480 300 L800 480Z" fill="#081826" stroke="#00f2fe" strokeWidth="1" opacity="0.8" />
    <rect x="320" y="200" width="160" height="100" fill="#02060b" stroke="#38bdf8" strokeWidth="2.5" />
    <line x1="400" y1="200" x2="400" y2="300" stroke="#38bdf8" strokeWidth="2" />
    <rect x="325" y="290" width="150" height="8" fill="#facc15" />
    <ellipse cx="400" cy="50" rx="120" ry="18" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
    <path d="M280 50 L180 480 L620 480 L520 50Z" fill="url(#lc)" />
    <rect x="60" y="160" width="170" height="95" rx="4" fill="#020911" stroke="#00f2fe" strokeWidth="2" />
    <text x="75" y="180" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">BIO-TELEMETRY // CODE RED</text>
    <path d="M70 215 L105 215 L112 205 L118 228 L125 180 L132 238 L138 215 L220 215" fill="none" stroke="#22c55e" strokeWidth="2.5" />
    <rect x="0" y="110" width="800" height="26" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
    <line x1="0" y1="123" x2="800" y2="123" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />

    {/* AGENT ZERO — crouched on pipe */}
    <g transform="translate(480, 115) scale(0.55)">
      {/* Head */}
      <path d="M-18,4 Q-20,-22 0,-32 Q20,-22 18,4" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <circle cx="0" cy="0" r="18" fill="#0f172a" stroke="#000" strokeWidth="2.5" />
      <path d="M-12,12 Q0,22 12,12" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <polygon points="-14,-4 14,-4 10,5 -10,5" fill="#00f2fe" stroke="#000" strokeWidth="1.5" />
      <polygon points="-9,-2 9,-2 7,3 -7,3" fill="#fff" opacity="0.85" />
      <path d="M-8,8 L8,8 L6,16 L-6,16Z" fill="#334155" stroke="#000" strokeWidth="1.5" />
      <line x1="-3" y1="10" x2="-3" y2="15" stroke="#00f2fe" strokeWidth="1.2" />
      <line x1="3" y1="10" x2="3" y2="15" stroke="#00f2fe" strokeWidth="1.2" />
      {/* Neck */}
      <rect x="-6" y="20" width="12" height="8" fill="#0f172a" stroke="#000" strokeWidth="1.5" />
      {/* Torso — crouched forward */}
      <path d="M-24,28 L24,28 L20,74 L-20,74Z" fill="#0f172a" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="-26" cy="30" rx="8" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <ellipse cx="26" cy="30" rx="8" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <circle cx="18" cy="42" r="8" fill="#dc2626" stroke="#000" strokeWidth="1.5" />
      <text x="18" y="46" textAnchor="middle" fill="#fff" fontSize="10" fontWeight="bold">✚</text>
      <rect x="-20" y="70" width="40" height="8" rx="2" fill="#475569" stroke="#000" strokeWidth="1.5" />
      <rect x="-12" y="71" width="6" height="6" fill="#00f2fe" stroke="#000" strokeWidth="1" />
      <rect x="6" y="71" width="6" height="6" fill="#00f2fe" stroke="#000" strokeWidth="1" />
      {/* Left arm reaching to grip pipe */}
      <path d="M-26,34 Q-48,54 -50,78" stroke="#0f172a" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M-50,78 Q-52,96 -48,112" stroke="#0f172a" strokeWidth="10" strokeLinecap="round" fill="none" />
      <rect x="-56" y="106" width="16" height="12" rx="3" fill="#334155" stroke="#000" strokeWidth="1.5" />
      <ellipse cx="-48" cy="122" rx="8" ry="6" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <line x1="-52" y1="118" x2="-52" y2="126" stroke="#000" strokeWidth="1.5" />
      <line x1="-48" y1="118" x2="-48" y2="128" stroke="#000" strokeWidth="1.5" />
      <line x1="-44" y1="118" x2="-44" y2="126" stroke="#000" strokeWidth="1.5" />
      {/* Right arm bent ready */}
      <path d="M26,34 Q48,52 46,76" stroke="#0f172a" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M46,76 Q44,94 40,106" stroke="#0f172a" strokeWidth="10" strokeLinecap="round" fill="none" />
      <ellipse cx="40" cy="110" rx="7" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      {/* Left leg crouched */}
      <path d="M-14,74 Q-30,100 -34,126" stroke="#0f172a" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M-34,126 Q-32,148 -28,160" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M-36,156 Q-46,164 -40,170 Q-20,172 -16,162Z" fill="#0284c7" stroke="#000" strokeWidth="2" />
      {/* Right leg crouched with knee pad */}
      <path d="M14,74 Q32,98 36,124" stroke="#0f172a" strokeWidth="15" strokeLinecap="round" fill="none" />
      <polygon points="30,118 44,124 40,136 26,130" fill="#0284c7" stroke="#000" strokeWidth="1.5" />
      <path d="M36,124 Q34,146 30,158" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M22,154 Q12,162 18,168 Q38,170 42,160Z" fill="#0284c7" stroke="#000" strokeWidth="2" />
      {/* Ink hatching */}
      <line x1="-16" y1="40" x2="-8" y2="54" stroke="#000" strokeWidth="1.8" opacity="0.5" />
      <line x1="-12" y1="48" x2="-4" y2="62" stroke="#000" strokeWidth="1.5" opacity="0.4" />
      {/* Rim lights */}
      <path d="M-18,-16 Q-24,2 -26,24" stroke="#00f2fe" strokeWidth="2.5" fill="none" />
      <path d="M18,-16 Q24,2 26,24" stroke="#ef4444" strokeWidth="2" fill="none" />
      <path d="M36,124 Q42,145 42,158" stroke="#00f2fe" strokeWidth="2.5" fill="none" />
    </g>
  </svg>
);

const HospitalPanel2: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={S}>
    <defs>
      <linearGradient id="rl" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#450a0a" /><stop offset="100%" stopColor="#050101" /></linearGradient>
      <radialGradient id="rb" cx="50%" cy="0%" r="90%"><stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" /><stop offset="100%" stopColor="#000" stopOpacity="0" /></radialGradient>
    </defs>
    <rect width="800" height="480" fill="url(#rl)" />
    <circle cx="180" cy="30" r="16" fill="#ef4444" filter="drop-shadow(0 0 16px #ef4444)" />
    <path d="M180 30 L40 480 L320 480Z" fill="url(#rb)" />
    <circle cx="620" cy="30" r="16" fill="#ef4444" filter="drop-shadow(0 0 16px #ef4444)" />
    <path d="M620 30 L480 480 L760 480Z" fill="url(#rb)" />
    <path d="M300 0 L500 0 L500 480 L300 480Z" fill="#09090b" stroke="#dc2626" strokeWidth="4" />
    <line x1="400" y1="0" x2="400" y2="480" stroke="#dc2626" strokeWidth="3" />
    <rect x="260" y="120" width="50" height="24" fill="#71717a" stroke="#000" strokeWidth="2" />
    <rect x="490" y="120" width="50" height="24" fill="#71717a" stroke="#000" strokeWidth="2" />

    {/* CHIEF MEDICAL INSPECTOR — towering armored villain */}
    <g transform="translate(580, 180) scale(0.45)">
      <rect x="-20" y="0" width="40" height="40" rx="6" fill="#27272a" stroke="#000" strokeWidth="3" />
      <rect x="-16" y="12" width="32" height="9" rx="2" fill="#ef4444" stroke="#000" strokeWidth="1.5" filter="drop-shadow(0 0 8px #ef4444)" />
      <rect x="-10" y="14" width="20" height="5" rx="1" fill="#fff" opacity="0.5" />
      <polygon points="-4,-4 0,-14 4,-4" fill="#ef4444" stroke="#000" strokeWidth="1.5" />
      <rect x="-8" y="40" width="16" height="12" fill="#27272a" stroke="#000" strokeWidth="2" />
      <path d="M-36,52 L36,52 L30,148 L-30,148Z" fill="#27272a" stroke="#000" strokeWidth="3.5" />
      <ellipse cx="-38" cy="54" rx="12" ry="7" fill="#27272a" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="38" cy="54" rx="12" ry="7" fill="#27272a" stroke="#000" strokeWidth="2.5" />
      <polygon points="-50,48 -62,40 -44,34" fill="#ef4444" stroke="#000" strokeWidth="1.5" />
      <polygon points="50,48 62,40 44,34" fill="#ef4444" stroke="#000" strokeWidth="1.5" />
      <circle cx="0" cy="86" r="14" fill="#09090b" stroke="#ef4444" strokeWidth="2" />
      <text x="0" y="91" textAnchor="middle" fill="#ef4444" fontSize="14" fontWeight="bold">☣</text>
      {/* Left arm raised with syringe weapon */}
      <path d="M-38,58 Q-68,40 -80,12" stroke="#27272a" strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d="M-80,12 Q-88,-14 -82,-32" stroke="#27272a" strokeWidth="14" strokeLinecap="round" fill="none" />
      <rect x="-92" y="-38" width="20" height="16" rx="4" fill="#3f3f46" stroke="#000" strokeWidth="2" />
      <line x1="-82" y1="-38" x2="-82" y2="-62" stroke="#e4e4e7" strokeWidth="5" strokeLinecap="round" />
      <circle cx="-82" cy="-65" r="4" fill="#ef4444" />
      <line x1="-76" y1="-38" x2="-76" y2="-55" stroke="#e4e4e7" strokeWidth="4" strokeLinecap="round" />
      <circle cx="-76" cy="-58" r="3" fill="#ef4444" />
      {/* Right arm at side */}
      <path d="M38,58 Q62,78 68,108" stroke="#27272a" strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d="M68,108 Q72,130 68,148" stroke="#27272a" strokeWidth="14" strokeLinecap="round" fill="none" />
      <rect x="58" y="144" width="20" height="16" rx="4" fill="#3f3f46" stroke="#000" strokeWidth="2" />
      {/* Legs */}
      <path d="M-18,148 Q-22,194 -20,236" stroke="#27272a" strokeWidth="20" strokeLinecap="round" fill="none" />
      <path d="M-20,236 Q-18,260 -18,274" stroke="#27272a" strokeWidth="16" strokeLinecap="round" fill="none" />
      <path d="M-28,270 Q-40,278 -34,286 Q-12,288 -4,278Z" fill="#ef4444" stroke="#000" strokeWidth="2" />
      <path d="M18,148 Q22,194 20,236" stroke="#27272a" strokeWidth="20" strokeLinecap="round" fill="none" />
      <path d="M20,236 Q18,260 18,274" stroke="#27272a" strokeWidth="16" strokeLinecap="round" fill="none" />
      <path d="M10,270 Q-2,278 4,286 Q24,288 32,278Z" fill="#ef4444" stroke="#000" strokeWidth="2" />
      <path d="M-36,52 Q-50,54 -50,48" stroke="#ef4444" strokeWidth="3" fill="none" opacity="0.9" />
      <path d="M36,52 Q50,54 50,48" stroke="#94a3b8" strokeWidth="2.5" fill="none" />
    </g>

    {/* AGENT ZERO — slide under blast door */}
    <g transform="translate(220, 350) scale(0.55)">
      {/* Speed lines */}
      <line x1="-160" y1="0" x2="-40" y2="0" stroke="#00f2fe" strokeWidth="3" opacity="0.8" />
      <line x1="-180" y1="20" x2="-30" y2="20" stroke="#00f2fe" strokeWidth="4" opacity="0.9" />
      <line x1="-140" y1="40" x2="-20" y2="40" stroke="#fff" strokeWidth="2" opacity="0.6" />
      {/* Head leading the slide */}
      <path d="M44,-6 Q42,-26 60,-36 Q78,-26 76,-6" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <circle cx="60" cy="-10" r="16" fill="#0f172a" stroke="#000" strokeWidth="2.5" />
      <polygon points="48,-14 72,-14 68,-6 52,-6" fill="#00f2fe" stroke="#000" strokeWidth="1.5" />
      <polygon points="52,-12 68,-12 66,-8 54,-8" fill="#fff" opacity="0.8" />
      {/* Neck angled */}
      <rect x="36" y="4" width="12" height="8" fill="#0f172a" stroke="#000" strokeWidth="1.5" transform="rotate(-15, 42, 8)" />
      {/* Torso nearly horizontal */}
      <path d="M-20,0 L42,0 L38,40 L-16,40Z" fill="#0f172a" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="-22" cy="4" rx="7" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <ellipse cx="44" cy="4" rx="7" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      {/* Right arm reaching for door handle */}
      <path d="M40,8 Q66,0 82,-8" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M82,-8 Q94,-14 100,-18" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" fill="none" />
      <ellipse cx="102" cy="-20" rx="7" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <rect x="100" y="-28" width="16" height="12" rx="2" fill="#facc15" stroke="#000" strokeWidth="1.5" />
      {/* Left arm bracing */}
      <path d="M-18,8 Q-38,20 -46,38" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M-46,38 Q-50,52 -44,62" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" fill="none" />
      <ellipse cx="-44" cy="66" rx="7" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      {/* Legs trailing behind */}
      <path d="M-18,38 Q-46,42 -72,36" stroke="#0f172a" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M-72,36 Q-96,34 -110,28" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M-116,24 Q-128,16 -118,10 Q-102,8 -98,18Z" fill="#0284c7" stroke="#000" strokeWidth="2" />
      <path d="M-14,42 Q-40,50 -66,48" stroke="#0f172a" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M-66,48 Q-88,50 -102,44" stroke="#0f172a" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M-108,40 Q-120,34 -112,26 Q-96,24 -92,34Z" fill="#0284c7" stroke="#000" strokeWidth="2" />
      {/* Rim + sparks */}
      <path d="M60,-26 Q70,-10 70,0" stroke="#00f2fe" strokeWidth="2.5" fill="none" />
      <polygon points="-100,18 -88,12 -92,24 -82,28 -96,30 -100,18" fill="#facc15" stroke="#000" strokeWidth="1.5" />
    </g>
  </svg>
);

// ═══════════════════════════════════════════════════════════════
// 🚆 RAILWAY
// ═══════════════════════════════════════════════════════════════
const RailwayPanel1: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={S}>
    <defs><linearGradient id="sd" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#0a0f1d" /><stop offset="100%" stopColor="#04060a" /></linearGradient></defs>
    <rect width="800" height="480" fill="url(#sd)" />
    <path d="M0 130 Q400 20 800 130" stroke="#334155" strokeWidth="10" fill="none" />
    <line x1="240" y1="70" x2="240" y2="150" stroke="#475569" strokeWidth="3" />
    <polygon points="225,150 255,150 250,165 230,165" fill="#facc15" />
    <line x1="560" y1="70" x2="560" y2="150" stroke="#475569" strokeWidth="3" />
    <polygon points="545,150 575,150 570,165 550,165" fill="#facc15" />
    <path d="M300 260 L500 260 L750 480 L50 480Z" fill="#090d16" />
    <line x1="360" y1="260" x2="200" y2="480" stroke="#94a3b8" strokeWidth="5" />
    <line x1="440" y1="260" x2="600" y2="480" stroke="#94a3b8" strokeWidth="5" />
    <rect x="350" y="190" width="100" height="85" rx="8" fill="#0f172a" stroke="#f59e0b" strokeWidth="3" />
    <circle cx="375" cy="245" r="12" fill="#fbbf24" filter="drop-shadow(0 0 15px #f59e0b)" />
    <circle cx="425" cy="245" r="12" fill="#fbbf24" filter="drop-shadow(0 0 15px #f59e0b)" />
    <ellipse cx="400" cy="180" rx="60" ry="25" fill="rgba(241,245,249,0.3)" />

    {/* Turnstile bar */}
    <rect x="120" y="340" width="180" height="8" rx="4" fill="#334155" stroke="#475569" strokeWidth="2" />
    <rect x="198" y="300" width="8" height="48" rx="2" fill="#64748b" />

    {/* TRACK RUNNER — leaping over turnstile */}
    <g transform="translate(220, 260) scale(0.55)">
      {/* Head with amber visor */}
      <path d="M-17,4 Q-19,-20 0,-30 Q19,-20 17,4" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <circle cx="0" cy="0" r="17" fill="#0f172a" stroke="#000" strokeWidth="2.5" />
      <polygon points="-13,-4 13,-4 9,4 -9,4" fill="#f59e0b" stroke="#000" strokeWidth="1.5" />
      <polygon points="-8,-2 8,-2 6,2 -6,2" fill="#fef08a" opacity="0.85" />
      {/* Neck */}
      <rect x="-5" y="16" width="10" height="8" fill="#1e293b" stroke="#000" strokeWidth="1.5" />
      {/* Torso */}
      <path d="M-22,24 L22,24 L18,68 L-18,68Z" fill="#1e293b" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="-24" cy="26" rx="8" ry="5" fill="#1e293b" stroke="#000" strokeWidth="2" />
      <ellipse cx="24" cy="26" rx="8" ry="5" fill="#1e293b" stroke="#000" strokeWidth="2" />
      {/* Bold yellow V chevron on chest */}
      <polygon points="-14,36 0,52 14,36 16,42 0,58 -16,42" fill="#facc15" stroke="#000" strokeWidth="1.5" />
      {/* Left arm flung wide */}
      <path d="M-24,30 Q-52,22 -68,10" stroke="#1e293b" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M-68,10 Q-80,-4 -76,-18" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" fill="none" />
      <ellipse cx="-76" cy="-22" rx="7" ry="5" fill="#1e293b" stroke="#000" strokeWidth="2" />
      {/* Right arm reaching ahead */}
      <path d="M24,30 Q50,14 64,-4" stroke="#1e293b" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M64,-4 Q74,-18 72,-32" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" fill="none" />
      <ellipse cx="72" cy="-36" rx="7" ry="5" fill="#1e293b" stroke="#000" strokeWidth="2" />
      {/* Legs splayed mid-leap */}
      <path d="M-12,68 Q-32,92 -46,116" stroke="#0f172a" strokeWidth="16" strokeLinecap="round" fill="none" />
      <path d="M-46,116 Q-54,138 -50,154" stroke="#0f172a" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M-58,150 Q-68,158 -62,164 Q-42,166 -38,156Z" fill="#eab308" stroke="#000" strokeWidth="2" />
      <path d="M12,68 Q36,88 50,112" stroke="#0f172a" strokeWidth="16" strokeLinecap="round" fill="none" />
      <path d="M50,112 Q58,134 56,150" stroke="#0f172a" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M48,146 Q38,154 44,160 Q64,162 68,152Z" fill="#eab308" stroke="#000" strokeWidth="2" />
      {/* Rim lights */}
      <path d="M-17,-14 Q-24,0 -24,20" stroke="#facc15" strokeWidth="2.5" fill="none" />
      <path d="M17,-14 Q24,0 24,20" stroke="#f97316" strokeWidth="2" fill="none" />
      {/* Sparks from turnstile impact */}
      <polygon points="44,160 56,154 50,168 62,172 46,176 44,160" fill="#facc15" stroke="#000" strokeWidth="1.5" />
    </g>
  </svg>
);

const RailwayPanel2: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={S}>
    <rect width="800" height="480" fill="#180c04" />
    <path d="M80 480 L280 260 L310 270 L500 120" stroke="#00f2fe" strokeWidth="4" filter="drop-shadow(0 0 12px #00f2fe)" fill="none" />
    <path d="M720 480 L520 260 L490 270 L300 120" stroke="#00f2fe" strokeWidth="4" filter="drop-shadow(0 0 12px #00f2fe)" fill="none" />

    {/* CONDUCTOR BOSS — towering villain */}
    <g transform="translate(560, 180) scale(0.45)">
      {/* Peaked cap */}
      <polygon points="-22,-8 22,-8 30,-20 -30,-20" fill="#ea580c" stroke="#000" strokeWidth="2" />
      <circle cx="0" cy="-14" r="6" fill="#facc15" />
      {/* Head */}
      <rect x="-18" y="-6" width="36" height="36" rx="6" fill="#0f172a" stroke="#000" strokeWidth="3" />
      <circle cx="-8" cy="12" r="5" fill="#ef4444" filter="drop-shadow(0 0 6px #ef4444)" />
      <circle cx="8" cy="12" r="5" fill="#ef4444" filter="drop-shadow(0 0 6px #ef4444)" />
      {/* Neck */}
      <rect x="-7" y="30" width="14" height="10" fill="#0f172a" stroke="#000" strokeWidth="2" />
      {/* Massive torso */}
      <path d="M-32,40 L32,40 L28,128 L-28,128Z" fill="#0f172a" stroke="#f97316" strokeWidth="3" />
      <ellipse cx="-34" cy="42" rx="10" ry="6" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <ellipse cx="34" cy="42" rx="10" ry="6" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <polygon points="-44,38 -56,30 -40,24" fill="#ea580c" stroke="#000" strokeWidth="1.5" />
      <polygon points="44,38 56,30 40,24" fill="#ea580c" stroke="#000" strokeWidth="1.5" />
      {/* Left arm raised with stun baton */}
      <path d="M-34,46 Q-58,30 -70,4" stroke="#0f172a" strokeWidth="16" strokeLinecap="round" fill="none" />
      <path d="M-70,4 Q-78,-18 -74,-36" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <rect x="-82" y="-42" width="18" height="14" rx="3" fill="#334155" stroke="#000" strokeWidth="2" />
      <line x1="-73" y1="-42" x2="-73" y2="-76" stroke="#cbd5e1" strokeWidth="6" strokeLinecap="round" />
      <circle cx="-73" cy="-80" r="16" fill="#00f2fe" filter="drop-shadow(0 0 14px #00f2fe)" />
      <circle cx="-73" cy="-80" r="6" fill="#fff" />
      {/* Right arm at side */}
      <path d="M34,46 Q58,68 62,96" stroke="#0f172a" strokeWidth="16" strokeLinecap="round" fill="none" />
      <path d="M62,96 Q64,118 60,134" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <rect x="52" y="130" width="18" height="14" rx="3" fill="#334155" stroke="#000" strokeWidth="2" />
      {/* Legs */}
      <path d="M-16,128 Q-20,176 -18,218" stroke="#0f172a" strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d="M-18,218 Q-16,242 -16,256" stroke="#0f172a" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M-24,252 Q-36,260 -30,268 Q-10,270 -4,260Z" fill="#ea580c" stroke="#000" strokeWidth="2" />
      <path d="M16,128 Q20,176 18,218" stroke="#0f172a" strokeWidth="18" strokeLinecap="round" fill="none" />
      <path d="M18,218 Q16,242 16,256" stroke="#0f172a" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M8,252 Q-4,260 2,268 Q22,270 28,260Z" fill="#ea580c" stroke="#000" strokeWidth="2" />
      <path d="M-32,40 Q-44,42 -44,38" stroke="#ea580c" strokeWidth="3" fill="none" />
    </g>

    {/* TRACK RUNNER — sliding under lightning */}
    <g transform="translate(180, 360) scale(0.55)">
      <line x1="-120" y1="0" x2="-20" y2="0" stroke="#facc15" strokeWidth="3" opacity="0.8" />
      <line x1="-140" y1="16" x2="-10" y2="16" stroke="#00f2fe" strokeWidth="3" opacity="0.9" />
      <path d="M35,-2 Q33,-22 50,-30 Q67,-22 65,-2" fill="#1e293b" stroke="#000" strokeWidth="2" />
      <circle cx="50" cy="-6" r="15" fill="#1e293b" stroke="#000" strokeWidth="2.5" />
      <polygon points="38,-10 62,-10 58,-2 42,-2" fill="#f59e0b" stroke="#000" strokeWidth="1.5" />
      <polygon points="43,-8 57,-8 55,-4 45,-4" fill="#fff" opacity="0.8" />
      <path d="M-16,2 L36,2 L32,36 L-12,36Z" fill="#1e293b" stroke="#000" strokeWidth="2.5" />
      <path d="M32,8 Q56,0 70,-8" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M70,-8 Q80,-14 86,-18" stroke="#1e293b" strokeWidth="9" strokeLinecap="round" fill="none" />
      <ellipse cx="88" cy="-20" rx="6" ry="5" fill="#1e293b" stroke="#000" strokeWidth="2" />
      <path d="M-14,34 Q-42,38 -68,32" stroke="#0f172a" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M-68,32 Q-90,28 -104,22" stroke="#0f172a" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M-110,18 Q-122,12 -114,4 Q-98,2 -94,14Z" fill="#eab308" stroke="#000" strokeWidth="2" />
      <path d="M-10,38 Q-36,44 -60,42" stroke="#0f172a" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M-60,42 Q-80,42 -94,36" stroke="#0f172a" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M-100,32 Q-112,26 -106,18 Q-90,16 -86,28Z" fill="#eab308" stroke="#000" strokeWidth="2" />
      <polygon points="-100,16 -88,10 -92,22 -80,26 -96,28 -100,16" fill="#facc15" stroke="#ea580c" strokeWidth="1" />
    </g>
  </svg>
);

// ═══════════════════════════════════════════════════════════════
// 🏦 BANK
// ═══════════════════════════════════════════════════════════════
const BankPanel1: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={S}>
    <rect width="800" height="480" fill="#070c18" />
    <circle cx="400" cy="240" r="165" fill="#0f172a" stroke="#ffd700" strokeWidth="7" />
    <circle cx="400" cy="240" r="130" fill="#1e293b" stroke="#475569" strokeWidth="4" />
    <line x1="400" y1="75" x2="400" y2="110" stroke="#ffd700" strokeWidth="8" />
    <line x1="400" y1="405" x2="400" y2="370" stroke="#ffd700" strokeWidth="8" />
    <line x1="235" y1="240" x2="270" y2="240" stroke="#ffd700" strokeWidth="8" />
    <line x1="565" y1="240" x2="530" y2="240" stroke="#ffd700" strokeWidth="8" />
    <line x1="400" y1="0" x2="400" y2="160" stroke="#e2e8f0" strokeWidth="2.5" />

    {/* MASTER THIEF — inverted descent */}
    <g transform="translate(400, 280) scale(0.6,-0.6)">
      <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#000" strokeWidth="2.5" />
      <circle cx="-6" cy="-2" r="6" fill="#ffd700" stroke="#000" strokeWidth="1.5" filter="drop-shadow(0 0 6px #ffd700)" />
      <circle cx="6" cy="-2" r="6" fill="#ffd700" stroke="#000" strokeWidth="1.5" filter="drop-shadow(0 0 6px #ffd700)" />
      <circle cx="-6" cy="-2" r="3" fill="#fff" opacity="0.8" />
      <circle cx="6" cy="-2" r="3" fill="#fff" opacity="0.8" />
      <line x1="-2" y1="-2" x2="2" y2="-2" stroke="#000" strokeWidth="2" />
      <rect x="-5" y="14" width="10" height="8" fill="#0f172a" stroke="#000" strokeWidth="1.5" />
      <path d="M-20,22 L20,22 L16,66 L-16,66Z" fill="#0f172a" stroke="#ffd700" strokeWidth="2" />
      <ellipse cx="-22" cy="24" rx="7" ry="4" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <ellipse cx="22" cy="24" rx="7" ry="4" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <path d="M-22,28 Q-42,46 -48,68" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M-48,68 Q-52,82 -48,94" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" fill="none" />
      <ellipse cx="-48" cy="98" rx="7" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <polygon points="-52,94 -58,106 -44,104" fill="#ffd700" />
      <path d="M22,28 Q42,46 48,68" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M48,68 Q52,82 48,94" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" fill="none" />
      <ellipse cx="48" cy="98" rx="7" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <polygon points="52,94 58,106 44,104" fill="#ffd700" />
      <path d="M-10,66 Q-10,88 -10,108" stroke="#0f172a" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M10,66 Q10,88 10,108" stroke="#0f172a" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M-18,-14 Q-22,0 -22,18" stroke="#ffd700" strokeWidth="2" fill="none" />
      <path d="M18,-14 Q22,0 22,18" stroke="#ffd700" strokeWidth="2" fill="none" />
    </g>
  </svg>
);

const BankPanel2: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={S}>
    <rect width="800" height="480" fill="#06070d" />
    <line x1="0" y1="140" x2="800" y2="340" stroke="#ff0055" strokeWidth="3" filter="drop-shadow(0 0 8px #ff0055)" />
    <line x1="0" y1="340" x2="800" y2="140" stroke="#ff0055" strokeWidth="3" filter="drop-shadow(0 0 8px #ff0055)" />
    <line x1="0" y1="240" x2="800" y2="240" stroke="#ff0055" strokeWidth="2" filter="drop-shadow(0 0 6px #ff0055)" opacity="0.6" />
    <line x1="200" y1="0" x2="350" y2="480" stroke="#ff0055" strokeWidth="2.5" filter="drop-shadow(0 0 6px #ff0055)" />
    <line x1="600" y1="0" x2="450" y2="480" stroke="#ff0055" strokeWidth="2.5" filter="drop-shadow(0 0 6px #ff0055)" />
    <rect x="80" y="340" width="120" height="50" rx="4" fill="#ca8a04" stroke="#fef08a" strokeWidth="2" />
    <rect x="620" y="340" width="120" height="50" rx="4" fill="#ca8a04" stroke="#fef08a" strokeWidth="2" />

    {/* MASTER THIEF — horizontal dive through lasers */}
    <g transform="translate(380, 300) scale(0.55)">
      <line x1="-140" y1="0" x2="-30" y2="0" stroke="#ffd700" strokeWidth="3" opacity="0.7" />
      <line x1="-160" y1="18" x2="-20" y2="18" stroke="#ffd700" strokeWidth="4" opacity="0.9" />
      <path d="M41,-4 Q39,-24 56,-34 Q73,-24 71,-4" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <circle cx="56" cy="-8" r="15" fill="#0f172a" stroke="#000" strokeWidth="2.5" />
      <circle cx="52" cy="-10" r="5" fill="#ffd700" filter="drop-shadow(0 0 6px #ffd700)" />
      <circle cx="60" cy="-10" r="5" fill="#ffd700" filter="drop-shadow(0 0 6px #ffd700)" />
      <path d="M-18,2 L38,2 L34,36 L-14,36Z" fill="#0f172a" stroke="#ffd700" strokeWidth="2" />
      <path d="M34,8 Q58,0 74,-8" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M74,-8 Q86,-16 92,-22" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" fill="none" />
      <ellipse cx="94" cy="-24" rx="6" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <rect x="92" y="-34" width="18" height="12" rx="3" fill="#00f2fe" stroke="#fff" strokeWidth="1.5" filter="drop-shadow(0 0 8px #00f2fe)" />
      <path d="M-16,34 Q-44,38 -70,32" stroke="#0f172a" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M-70,32 Q-92,28 -106,22" stroke="#0f172a" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M-112,18 Q-124,12 -118,4 Q-100,2 -96,14Z" fill="#ffd700" stroke="#000" strokeWidth="2" />
      <path d="M-12,38 Q-38,46 -62,44" stroke="#0f172a" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M-62,44 Q-82,44 -96,38" stroke="#0f172a" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M-102,34 Q-114,28 -108,20 Q-92,18 -88,30Z" fill="#ffd700" stroke="#000" strokeWidth="2" />
      <path d="M56,-24 Q64,-8 64,2" stroke="#ffd700" strokeWidth="2.5" fill="none" />
    </g>
  </svg>
);

// ═══════════════════════════════════════════════════════════════
// 🚨 POLICE
// ═══════════════════════════════════════════════════════════════
const PolicePanel1: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={S}>
    <rect width="800" height="480" fill="#080d1a" />
    <line x1="0" y1="40" x2="800" y2="40" stroke="#000" strokeWidth="22" opacity="0.65" />
    <line x1="0" y1="110" x2="800" y2="110" stroke="#000" strokeWidth="22" opacity="0.65" />
    <line x1="0" y1="180" x2="800" y2="180" stroke="#000" strokeWidth="22" opacity="0.65" />
    <line x1="0" y1="250" x2="800" y2="250" stroke="#000" strokeWidth="22" opacity="0.65" />
    <rect x="0" y="0" width="400" height="480" fill="#1e3a8a" opacity="0.3" />
    <rect x="400" y="0" width="400" height="480" fill="#dc2626" opacity="0.3" />
    <line x1="140" y1="0" x2="140" y2="480" stroke="#0f172a" strokeWidth="16" />
    <line x1="280" y1="0" x2="280" y2="480" stroke="#0f172a" strokeWidth="16" />
    <line x1="420" y1="0" x2="420" y2="480" stroke="#0f172a" strokeWidth="16" />
    <line x1="560" y1="0" x2="560" y2="480" stroke="#0f172a" strokeWidth="16" />
    <rect x="430" y="260" width="28" height="38" rx="4" fill="#ca8a04" stroke="#000" strokeWidth="2" />
    <circle cx="444" cy="275" r="4" fill="#000" />

    {/* AGENT X — noir cowl, crouched lockpicking */}
    <g transform="translate(360, 230) scale(0.55)">
      <circle cx="0" cy="0" r="18" fill="#020617" stroke="#000" strokeWidth="2.5" />
      <path d="M-14,12 Q0,22 14,12" fill="#020617" stroke="#000" strokeWidth="2" />
      <rect x="-16" y="-8" width="32" height="7" rx="2" fill="#ffffff" stroke="#000" strokeWidth="1.5" filter="drop-shadow(0 0 5px #38bdf8)" />
      <rect x="-10" y="-6" width="20" height="3" rx="1" fill="#cce4ff" opacity="0.7" />
      <rect x="-6" y="18" width="12" height="8" fill="#020617" stroke="#000" strokeWidth="1.5" />
      {/* Trenchcoat torso */}
      <path d="M-24,26 L24,26 L20,74 L-20,74Z" fill="#0f172a" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="-26" cy="28" rx="8" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <ellipse cx="26" cy="28" rx="8" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      {/* High collar flaps */}
      <polygon points="-24,26 -14,10 -6,24 -18,30" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
      <polygon points="24,26 14,10 6,24 18,30" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
      {/* Left arm */}
      <path d="M-26,32 Q-46,50 -46,74" stroke="#0f172a" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M-46,74 Q-44,92 -40,106" stroke="#0f172a" strokeWidth="10" strokeLinecap="round" fill="none" />
      <ellipse cx="-40" cy="110" rx="7" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      {/* Right arm reaching for lock — with lockpick tools */}
      <path d="M26,32 Q48,48 56,68" stroke="#0f172a" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M56,68 Q62,84 66,96" stroke="#0f172a" strokeWidth="10" strokeLinecap="round" fill="none" />
      <ellipse cx="66" cy="100" rx="7" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <line x1="66" y1="100" x2="86" y2="100" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
      <line x1="66" y1="104" x2="84" y2="108" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
      {/* Crouched legs */}
      <path d="M-14,74 Q-28,100 -30,126" stroke="#0f172a" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M-30,126 Q-28,146 -26,158" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M-34,154 Q-44,162 -38,168 Q-18,170 -14,160Z" fill="#38bdf8" stroke="#000" strokeWidth="2" />
      <path d="M14,74 Q28,100 30,126" stroke="#0f172a" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M30,126 Q28,146 26,158" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M18,154 Q8,162 14,168 Q34,170 38,160Z" fill="#38bdf8" stroke="#000" strokeWidth="2" />
      {/* Rim lights: blue left, red right */}
      <path d="M-24,26 Q-30,50 -30,74" stroke="#3b82f6" strokeWidth="3" fill="none" />
      <path d="M24,26 Q30,50 30,74" stroke="#ef4444" strokeWidth="3" fill="none" />
    </g>
  </svg>
);

const PolicePanel2: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={S}>
    <rect width="800" height="480" fill="#040813" />
    <polygon points="120,480 320,0 480,0 160,480" fill="rgba(255,255,255,0.22)" />
    <polygon points="680,480 480,0 320,0 640,480" fill="rgba(0,242,254,0.18)" />
    <line x1="80" y1="20" x2="60" y2="120" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />
    <line x1="240" y1="40" x2="220" y2="160" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />
    <line x1="420" y1="30" x2="400" y2="180" stroke="#38bdf8" strokeWidth="2.5" opacity="0.8" />
    <line x1="600" y1="50" x2="580" y2="190" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />
    <rect x="0" y="320" width="280" height="160" fill="#090d16" stroke="#1e293b" strokeWidth="2" />
    <rect x="480" y="340" width="320" height="140" fill="#090d16" stroke="#1e293b" strokeWidth="2" />

    {/* AGENT X — leaping between rooftops, trenchcoat tails */}
    <g transform="translate(360, 260) scale(0.55)">
      {/* Billowing coat tails behind */}
      <path d="M-30,50 Q-80,40 -110,80" stroke="#1e293b" strokeWidth="24" strokeLinecap="round" fill="none" opacity="0.9" />
      <path d="M-26,58 Q-70,60 -100,100" stroke="#0f172a" strokeWidth="18" strokeLinecap="round" fill="none" opacity="0.9" />
      {/* Head */}
      <path d="M-16,4 Q-18,-18 0,-28 Q18,-18 16,4" fill="#020617" stroke="#000" strokeWidth="2" />
      <circle cx="0" cy="0" r="16" fill="#020617" stroke="#000" strokeWidth="2.5" />
      <rect x="-14" y="-6" width="28" height="6" rx="2" fill="#fff" stroke="#000" strokeWidth="1.5" filter="drop-shadow(0 0 5px #00f2fe)" />
      <rect x="-9" y="-4" width="18" height="2" rx="1" fill="#bfdbfe" />
      {/* Neck */}
      <rect x="-5" y="14" width="10" height="7" fill="#020617" />
      {/* Torso */}
      <path d="M-22,22 L22,22 L18,62 L-18,62Z" fill="#0f172a" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="-24" cy="24" rx="7" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <ellipse cx="24" cy="24" rx="7" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      {/* Left arm flung back */}
      <path d="M-24,28 Q-50,20 -66,6" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M-66,6 Q-76,-6 -72,-18" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" fill="none" />
      <ellipse cx="-72" cy="-22" rx="6" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      {/* Right arm reaching for next rooftop */}
      <path d="M24,28 Q52,12 66,-4" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M66,-4 Q76,-16 74,-28" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" fill="none" />
      <ellipse cx="74" cy="-32" rx="6" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      {/* Legs splayed mid-air */}
      <path d="M-12,62 Q-32,86 -44,110" stroke="#0f172a" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M-44,110 Q-50,130 -46,144" stroke="#0f172a" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M-54,140 Q-64,148 -58,154 Q-38,156 -34,146Z" fill="#38bdf8" stroke="#000" strokeWidth="2" />
      <path d="M12,62 Q36,82 48,106" stroke="#0f172a" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M48,106 Q54,126 52,140" stroke="#0f172a" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M44,136 Q34,144 40,150 Q60,152 64,142Z" fill="#38bdf8" stroke="#000" strokeWidth="2" />
      <path d="M0,-16 Q16,-8 20,0" stroke="#00f2fe" strokeWidth="2.5" fill="none" />
      <path d="M24,22 Q36,40 34,60" stroke="#ef4444" strokeWidth="2" fill="none" />
    </g>
  </svg>
);

// ═══════════════════════════════════════════════════════════════
// ❄️ SNOW
// ═══════════════════════════════════════════════════════════════
const SnowPanel1: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={S}>
    <rect width="800" height="480" fill="#050e1f" />
    <path d="M0 120 Q200 40 400 90 T800 60" stroke="#00f2fe" strokeWidth="18" fill="none" opacity="0.35" />
    <path d="M0 150 Q200 80 400 120 T800 90" stroke="#10b981" strokeWidth="14" fill="none" opacity="0.3" />
    <circle cx="680" cy="85" r="42" fill="#f0f9ff" filter="drop-shadow(0 0 24px #38bdf8)" />
    <polygon points="120,160 0,480 320,480" fill="#0f294a" />
    <polygon points="120,160 80,230 160,230" fill="#bae6fd" />
    <polygon points="440,120 220,480 640,480" fill="#163963" />
    <polygon points="440,120 380,210 500,210" fill="#e0f2fe" />

    {/* ARCTIC RANGER — climbing glacier with ice axe */}
    <g transform="translate(420, 220) scale(0.55)">
      <path d="M-17,4 Q-19,-20 0,-30 Q19,-20 17,4" fill="#0369a1" stroke="#000" strokeWidth="2" />
      <circle cx="0" cy="0" r="17" fill="#0369a1" stroke="#000" strokeWidth="2.5" />
      <polygon points="-12,-4 12,-4 8,4 -8,4" fill="#f97316" stroke="#000" strokeWidth="1.5" />
      <polygon points="-7,-2 7,-2 5,2 -5,2" fill="#fef08a" opacity="0.85" />
      <ellipse cx="-14" cy="-2" rx="7" ry="7" fill="#e0f2fe" opacity="0.8" />
      <ellipse cx="14" cy="-2" rx="7" ry="7" fill="#e0f2fe" opacity="0.8" />
      <rect x="-5" y="16" width="10" height="8" fill="#0369a1" stroke="#000" strokeWidth="1.5" />
      <path d="M-22,24 L22,24 L18,68 L-18,68Z" fill="#0369a1" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="-24" cy="26" rx="7" ry="5" fill="#0369a1" stroke="#000" strokeWidth="2" />
      <ellipse cx="24" cy="26" rx="7" ry="5" fill="#0369a1" stroke="#000" strokeWidth="2" />
      {/* Right arm raised striking ice axe */}
      <path d="M24,30 Q40,8 44,-18" stroke="#0284c7" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M44,-18 Q46,-36 42,-48" stroke="#0284c7" strokeWidth="10" strokeLinecap="round" fill="none" />
      <ellipse cx="42" cy="-52" rx="7" ry="5" fill="#0284c7" stroke="#000" strokeWidth="2" />
      <line x1="42" y1="-52" x2="62" y2="-78" stroke="#cbd5e1" strokeWidth="4" strokeLinecap="round" />
      <polygon points="56,-84 74,-80 64,-70" fill="#f8fafc" stroke="#000" strokeWidth="1" />
      {/* Left arm gripping lower */}
      <path d="M-24,30 Q-42,50 -44,72" stroke="#0284c7" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M-44,72 Q-42,90 -38,104" stroke="#0284c7" strokeWidth="10" strokeLinecap="round" fill="none" />
      <ellipse cx="-38" cy="108" rx="7" ry="5" fill="#0284c7" stroke="#000" strokeWidth="2" />
      {/* Legs braced on ice */}
      <path d="M-14,68 Q-22,96 -24,122" stroke="#0f172a" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M-24,122 Q-22,142 -20,154" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M-28,150 Q-38,158 -32,164 Q-12,166 -8,156Z" fill="#f97316" stroke="#000" strokeWidth="2" />
      <polygon points="-34,164 -44,170 -26,168" fill="#cbd5e1" stroke="#000" strokeWidth="1" />
      <path d="M14,68 Q24,94 28,118" stroke="#0f172a" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M28,118 Q26,138 24,150" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M16,146 Q6,154 12,160 Q32,162 36,152Z" fill="#f97316" stroke="#000" strokeWidth="2" />
      <path d="M-17,-14 Q-22,0 -24,20" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
      <path d="M17,-14 Q22,0 24,20" stroke="#f97316" strokeWidth="2" fill="none" />
    </g>
  </svg>
);

const SnowPanel2: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={S}>
    <rect width="800" height="480" fill="#030914" />
    <line x1="0" y1="80" x2="800" y2="120" stroke="#fff" strokeWidth="3" opacity="0.6" />
    <line x1="0" y1="180" x2="800" y2="230" stroke="#fff" strokeWidth="4" opacity="0.8" />
    <line x1="0" y1="290" x2="800" y2="330" stroke="#38bdf8" strokeWidth="3" opacity="0.5" />
    {/* Wolf predator */}
    <circle cx="580" cy="220" r="8" fill="#38bdf8" filter="drop-shadow(0 0 10px #38bdf8)" />
    <circle cx="615" cy="220" r="8" fill="#38bdf8" filter="drop-shadow(0 0 10px #38bdf8)" />
    <polygon points="570,240 625,240 597,268" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
    <path d="M550,240 Q598,200 640,240 Q660,290 598,310 Q545,290 550,240Z" fill="#0a1628" stroke="#38bdf8" strokeWidth="2" opacity="0.8" />

    {/* ARCTIC RANGER — standing with flare */}
    <g transform="translate(230, 210) scale(0.55)">
      <path d="M-17,4 Q-19,-20 0,-30 Q19,-20 17,4" fill="#0369a1" stroke="#000" strokeWidth="2" />
      <circle cx="0" cy="0" r="17" fill="#0369a1" stroke="#000" strokeWidth="2.5" />
      <polygon points="-12,-4 12,-4 8,4 -8,4" fill="#ef4444" stroke="#000" strokeWidth="1.5" />
      <polygon points="-7,-2 7,-2 5,2 -5,2" fill="#fef08a" opacity="0.85" />
      <rect x="-5" y="16" width="10" height="8" fill="#0369a1" stroke="#000" strokeWidth="1.5" />
      <path d="M-22,24 L22,24 L18,76 L-18,76Z" fill="#0369a1" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="-24" cy="26" rx="7" ry="5" fill="#0369a1" stroke="#000" strokeWidth="2" />
      <ellipse cx="24" cy="26" rx="7" ry="5" fill="#0369a1" stroke="#000" strokeWidth="2" />
      {/* Left arm at side */}
      <path d="M-24,30 Q-38,50 -42,74" stroke="#0284c7" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M-42,74 Q-40,94 -38,108" stroke="#0284c7" strokeWidth="10" strokeLinecap="round" fill="none" />
      <ellipse cx="-38" cy="112" rx="7" ry="5" fill="#0284c7" stroke="#000" strokeWidth="2" />
      {/* Right arm holding flare forward */}
      <path d="M24,30 Q46,36 60,38" stroke="#0284c7" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M60,38 Q74,40 84,38" stroke="#0284c7" strokeWidth="10" strokeLinecap="round" fill="none" />
      <ellipse cx="86" cy="38" rx="7" ry="5" fill="#0284c7" stroke="#000" strokeWidth="2" />
      {/* Flare stick */}
      <rect x="90" y="30" width="10" height="26" rx="3" fill="#71717a" stroke="#000" strokeWidth="1.5" />
      <circle cx="95" cy="25" r="14" fill="rgba(239,68,68,0.4)" />
      <circle cx="95" cy="25" r="8" fill="#ef4444" filter="drop-shadow(0 0 12px #f87171)" />
      <polygon points="95,8 99,22 112,25 99,28 95,42 91,28 78,25 91,22" fill="#facc15" />
      {/* Legs standing */}
      <path d="M-12,76 Q-14,110 -14,140" stroke="#0f172a" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M-14,140 Q-14,158 -14,170" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M-22,166 Q-32,174 -26,180 Q-6,182 -2,172Z" fill="#f97316" stroke="#000" strokeWidth="2" />
      <path d="M12,76 Q14,110 14,140" stroke="#0f172a" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M14,140 Q14,158 14,170" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M6,166 Q-4,174 2,180 Q22,182 26,172Z" fill="#f97316" stroke="#000" strokeWidth="2" />
      <path d="M-22,24 Q-28,50 -28,76" stroke="#38bdf8" strokeWidth="2.5" fill="none" />
      <path d="M22,24 Q28,50 28,76" stroke="#ef4444" strokeWidth="2" fill="none" />
    </g>
  </svg>
);

// ═══════════════════════════════════════════════════════════════
// 🏙️ CYBERPUNK
// ═══════════════════════════════════════════════════════════════
const CyberPanel1: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={S}>
    <rect width="800" height="480" fill="#050510" />
    <rect x="80" y="80" width="120" height="60" fill="none" stroke="#00f2fe" strokeWidth="2" filter="drop-shadow(0 0 8px #00f2fe)" />
    <text x="140" y="115" textAnchor="middle" fill="#00f2fe" fontSize="14" fontFamily="monospace" fontWeight="bold">CYBER-CORP</text>
    <rect x="600" y="120" width="140" height="50" fill="none" stroke="#ff0055" strokeWidth="2" filter="drop-shadow(0 0 8px #ff0055)" />
    <text x="670" y="152" textAnchor="middle" fill="#ff0055" fontSize="14" fontFamily="monospace" fontWeight="bold">SYNTH-NET</text>
    <line x1="0" y1="260" x2="800" y2="290" stroke="#facc15" strokeWidth="3" opacity="0.6" />
    <line x1="800" y1="310" x2="0" y2="340" stroke="#00f2fe" strokeWidth="3" opacity="0.6" />
    <polygon points="0,480 300,480 380,340 220,320 0,380" fill="#090d16" stroke="#00f2fe" strokeWidth="2" />

    {/* CYBER-RUNNER — crouched on gargoyle */}
    <g transform="translate(260, 240) scale(0.55)">
      <path d="M-17,4 Q-19,-20 0,-30 Q19,-20 17,4" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <circle cx="0" cy="0" r="17" fill="#0f172a" stroke="#000" strokeWidth="2.5" />
      <polygon points="-13,-4 13,-4 9,4 -9,4" fill="#00f2fe" stroke="#000" strokeWidth="1.5" filter="drop-shadow(0 0 5px #00f2fe)" />
      <polygon points="-8,-2 8,-2 6,2 -6,2" fill="#fff" opacity="0.85" />
      <rect x="-5" y="16" width="10" height="8" fill="#0f172a" stroke="#000" strokeWidth="1.5" />
      <path d="M-22,24 L22,24 L18,68 L-18,68Z" fill="#0f172a" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="-24" cy="26" rx="7" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <ellipse cx="24" cy="26" rx="7" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <path d="M-24,30 Q-44,50 -44,74" stroke="#0f172a" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M-44,74 Q-42,92 -38,106" stroke="#0f172a" strokeWidth="10" strokeLinecap="round" fill="none" />
      <ellipse cx="-38" cy="110" rx="7" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      {/* Right arm with cybernetic glow */}
      <path d="M24,30 Q46,48 48,72" stroke="#0f172a" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M24,30 Q46,48 48,72" stroke="#00f2fe" strokeWidth="2" fill="none" filter="drop-shadow(0 0 6px #00f2fe)" opacity="0.7" />
      <path d="M48,72 Q46,90 42,104" stroke="#0f172a" strokeWidth="10" strokeLinecap="round" fill="none" />
      <ellipse cx="42" cy="108" rx="7" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <circle cx="42" cy="108" r="10" fill="#00f2fe" stroke="#fff" strokeWidth="1.5" filter="drop-shadow(0 0 8px #00f2fe)" opacity="0.9" />
      {/* Legs crouched */}
      <path d="M-14,68 Q-28,96 -30,122" stroke="#0f172a" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M-30,122 Q-28,142 -26,154" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M-34,150 Q-44,158 -38,164 Q-18,166 -14,156Z" fill="#00f2fe" stroke="#000" strokeWidth="2" />
      <path d="M14,68 Q30,94 34,118" stroke="#0f172a" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M34,118 Q32,138 28,150" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M20,146 Q10,154 16,160 Q36,162 40,152Z" fill="#00f2fe" stroke="#000" strokeWidth="2" />
      <path d="M-17,-14 Q-22,0 -24,20" stroke="#00f2fe" strokeWidth="2.5" fill="none" />
      <path d="M17,-14 Q22,0 24,20" stroke="#ff0055" strokeWidth="2" fill="none" />
    </g>
  </svg>
);

const CyberPanel2: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={S}>
    <rect width="800" height="480" fill="#0a0518" />
    <line x1="120" y1="120" x2="380" y2="280" stroke="#ff0055" strokeWidth="4" filter="drop-shadow(0 0 10px #ff0055)" />
    <line x1="680" y1="100" x2="420" y2="280" stroke="#ff0055" strokeWidth="4" filter="drop-shadow(0 0 10px #ff0055)" />
    <g transform="translate(100,80)"><polygon points="20,20 60,10 80,30 50,45" fill="#1e1b4b" stroke="#ff0055" strokeWidth="2" /><circle cx="50" cy="25" r="8" fill="#ff0055" filter="drop-shadow(0 0 8px #ff0055)" /></g>
    <g transform="translate(620,70)"><polygon points="20,20 60,10 80,30 50,45" fill="#1e1b4b" stroke="#ff0055" strokeWidth="2" /><circle cx="50" cy="25" r="8" fill="#ff0055" filter="drop-shadow(0 0 8px #ff0055)" /></g>

    {/* EMP pulse halo */}
    <circle cx="400" cy="310" r="55" fill="rgba(0,242,254,0.2)" filter="blur(14px)" />

    {/* CYBER-RUNNER — running, EMP burst */}
    <g transform="translate(400, 260) scale(0.55)">
      <path d="M-17,4 Q-19,-20 0,-30 Q19,-20 17,4" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <circle cx="0" cy="0" r="17" fill="#0f172a" stroke="#000" strokeWidth="2.5" />
      <polygon points="-13,-4 13,-4 9,4 -9,4" fill="#00f2fe" stroke="#000" strokeWidth="1.5" filter="drop-shadow(0 0 5px #00f2fe)" />
      <polygon points="-8,-2 8,-2 6,2 -6,2" fill="#fff" opacity="0.85" />
      <rect x="-5" y="16" width="10" height="8" fill="#0f172a" />
      <path d="M-20,24 L20,24 L16,64 L-16,64Z" fill="#0f172a" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="-22" cy="26" rx="7" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <ellipse cx="22" cy="26" rx="7" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      {/* Left arm pumping back */}
      <path d="M-22,30 Q-44,22 -56,8" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M-56,8 Q-62,-6 -58,-18" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" fill="none" />
      <ellipse cx="-58" cy="-22" rx="6" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      {/* Right arm forward with EMP */}
      <path d="M22,30 Q46,20 58,6" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M58,6 Q66,-6 64,-18" stroke="#0f172a" strokeWidth="9" strokeLinecap="round" fill="none" />
      <ellipse cx="64" cy="-22" rx="6" ry="5" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <circle cx="64" cy="-22" r="18" fill="#00f2fe" filter="drop-shadow(0 0 16px #00f2fe)" opacity="0.8" />
      <circle cx="64" cy="-22" r="7" fill="#ffffff" />
      {/* Left leg stride forward */}
      <path d="M-10,64 Q-4,92 10,116" stroke="#0f172a" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M10,116 Q16,136 14,150" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M6,146 Q-4,154 2,160 Q22,162 26,152Z" fill="#00f2fe" stroke="#000" strokeWidth="2" />
      {/* Right leg stride back */}
      <path d="M10,64 Q0,86 -12,104" stroke="#0f172a" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M-12,104 Q-20,120 -24,132" stroke="#0f172a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M-32,128 Q-42,134 -36,142 Q-16,144 -12,134Z" fill="#00f2fe" stroke="#000" strokeWidth="2" />
      <path d="M-20,24 Q-26,46 -26,64" stroke="#00f2fe" strokeWidth="2.5" fill="none" />
      <path d="M20,24 Q26,46 26,64" stroke="#ff0055" strokeWidth="2" fill="none" />
    </g>
  </svg>
);

// ═══════════════════════════════════════════════════════════════
// 👻 HAUNTED
// ═══════════════════════════════════════════════════════════════
const HauntedPanel1: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={S}>
    <rect width="800" height="480" fill="#0a0614" />
    <path d="M100 480 L100 150 Q400 40 700 150 L700 480" stroke="#1f1435" strokeWidth="12" fill="none" />
    <circle cx="140" cy="180" r="8" fill="#eab308" filter="drop-shadow(0 0 10px #eab308)" />
    <circle cx="660" cy="180" r="8" fill="#eab308" filter="drop-shadow(0 0 10px #eab308)" />
    <circle cx="280" cy="140" r="5" fill="#a855f7" filter="drop-shadow(0 0 8px #a855f7)" />
    <circle cx="310" cy="140" r="5" fill="#a855f7" filter="drop-shadow(0 0 8px #a855f7)" />

    {/* OCCULT INVESTIGATOR — standing with lantern */}
    <g transform="translate(400, 210) scale(0.55)">
      <path d="M-17,4 Q-19,-20 0,-30 Q19,-20 17,4" fill="#130d24" stroke="#000" strokeWidth="2" />
      <circle cx="0" cy="0" r="17" fill="#130d24" stroke="#000" strokeWidth="2.5" />
      <rect x="-15" y="-6" width="30" height="6" rx="2" fill="#fff" stroke="#000" strokeWidth="1.5" filter="drop-shadow(0 0 5px #c084fc)" />
      <rect x="-10" y="-4" width="20" height="2" rx="1" fill="#e9d5ff" />
      <rect x="-5" y="16" width="10" height="8" fill="#130d24" stroke="#000" strokeWidth="1.5" />
      <path d="M-22,24 L22,24 L18,80 L-18,80Z" fill="#130d24" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="-24" cy="26" rx="7" ry="5" fill="#130d24" stroke="#000" strokeWidth="2" />
      <ellipse cx="24" cy="26" rx="7" ry="5" fill="#130d24" stroke="#000" strokeWidth="2" />
      <path d="M-24,30 Q-38,50 -40,74" stroke="#130d24" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M-40,74 Q-38,94 -36,108" stroke="#130d24" strokeWidth="10" strokeLinecap="round" fill="none" />
      <ellipse cx="-36" cy="112" rx="7" ry="5" fill="#130d24" stroke="#000" strokeWidth="2" />
      {/* Right arm holding lantern */}
      <path d="M24,30 Q42,40 52,52" stroke="#130d24" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M52,52 Q58,66 56,78" stroke="#130d24" strokeWidth="10" strokeLinecap="round" fill="none" />
      <ellipse cx="56" cy="82" rx="7" ry="5" fill="#130d24" stroke="#000" strokeWidth="2" />
      <line x1="56" y1="82" x2="68" y2="96" stroke="#6b21a8" strokeWidth="3" />
      <rect x="60" y="94" width="18" height="26" rx="3" fill="#3b0764" stroke="#e9d5ff" strokeWidth="2" />
      <circle cx="69" cy="107" r="8" fill="#c084fc" filter="drop-shadow(0 0 12px #c084fc)" />
      <circle cx="69" cy="107" r="3" fill="#fff" />
      {/* Legs standing */}
      <path d="M-12,80 Q-14,114 -14,144" stroke="#130d24" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M-14,144 Q-14,162 -14,174" stroke="#130d24" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M-22,170 Q-32,178 -26,184 Q-6,186 -2,176Z" fill="#a855f7" stroke="#000" strokeWidth="2" />
      <path d="M12,80 Q14,114 14,144" stroke="#130d24" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M14,144 Q14,162 14,174" stroke="#130d24" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M6,170 Q-4,178 2,184 Q22,186 26,176Z" fill="#a855f7" stroke="#000" strokeWidth="2" />
      <path d="M-22,24 Q-28,50 -28,80" stroke="#a855f7" strokeWidth="2.5" fill="none" />
      <path d="M22,24 Q28,50 28,80" stroke="#c084fc" strokeWidth="2" fill="none" />
    </g>
  </svg>
);

const HauntedPanel2: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={S}>
    <rect width="800" height="480" fill="#06020e" />
    {/* Spectral Wraith */}
    <g transform="translate(480,60)">
      <path d="M30 40 Q100 0 140 50 Q170 150 130 270 Q80 250 40 220 Q10 140 30 40Z" fill="rgba(88,28,135,0.45)" />
      <circle cx="80" cy="80" r="14" fill="#e9d5ff" filter="drop-shadow(0 0 14px #c084fc)" />
      <circle cx="120" cy="80" r="14" fill="#e9d5ff" filter="drop-shadow(0 0 14px #c084fc)" />
      <path d="M88,104 Q100,114 112,104" stroke="#e9d5ff" strokeWidth="2.5" fill="none" />
      <path d="M40,180 Q20,240 40,300 Q80,340 120,310 Q140,270 130,270" stroke="rgba(196,132,252,0.5)" strokeWidth="20" strokeLinecap="round" fill="none" />
    </g>
    {/* OCCULT INVESTIGATOR — rune shield */}
    <g transform="translate(220, 230) scale(0.55)">
      <path d="M-17,4 Q-19,-20 0,-30 Q19,-20 17,4" fill="#130d24" stroke="#000" strokeWidth="2" />
      <circle cx="0" cy="0" r="17" fill="#130d24" stroke="#000" strokeWidth="2.5" />
      <rect x="-15" y="-6" width="30" height="6" rx="2" fill="#fff" stroke="#000" strokeWidth="1.5" filter="drop-shadow(0 0 5px #c084fc)" />
      <rect x="-5" y="16" width="10" height="8" fill="#130d24" />
      <path d="M-22,24 L22,24 L18,80 L-18,80Z" fill="#130d24" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="-24" cy="26" rx="7" ry="5" fill="#130d24" stroke="#000" strokeWidth="2" />
      <ellipse cx="24" cy="26" rx="7" ry="5" fill="#130d24" stroke="#000" strokeWidth="2" />
      <path d="M-24,30 Q-38,50 -40,74" stroke="#130d24" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M-40,74 Q-38,94 -36,108" stroke="#130d24" strokeWidth="10" strokeLinecap="round" fill="none" />
      <ellipse cx="-36" cy="112" rx="7" ry="5" fill="#130d24" stroke="#000" strokeWidth="2" />
      <path d="M24,30 Q42,40 52,48" stroke="#130d24" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M52,48 Q58,62 56,74" stroke="#130d24" strokeWidth="10" strokeLinecap="round" fill="none" />
      <ellipse cx="56" cy="78" rx="7" ry="5" fill="#130d24" stroke="#000" strokeWidth="2" />
      {/* Rune shield projected from right hand */}
      <circle cx="56" cy="50" r="55" fill="none" stroke="#a855f7" strokeWidth="4" filter="drop-shadow(0 0 15px #c084fc)" />
      <polygon points="56,-5 98,70 14,70" fill="none" stroke="#c084fc" strokeWidth="2" />
      <circle cx="56" cy="50" r="14" fill="rgba(168,85,247,0.4)" />
      <path d="M-12,80 Q-14,114 -14,144" stroke="#130d24" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M-14,144 Q-14,162 -14,174" stroke="#130d24" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M-22,170 Q-32,178 -26,184 Q-6,186 -2,176Z" fill="#a855f7" stroke="#000" strokeWidth="2" />
      <path d="M12,80 Q14,114 14,144" stroke="#130d24" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M14,144 Q14,162 14,174" stroke="#130d24" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M6,170 Q-4,178 2,184 Q22,186 26,176Z" fill="#a855f7" stroke="#000" strokeWidth="2" />
      <path d="M-22,24 Q-28,50 -28,80" stroke="#a855f7" strokeWidth="2.5" fill="none" />
    </g>
  </svg>
);

// ═══════════════════════════════════════════════════════════════
// 🚀 SPACE
// ═══════════════════════════════════════════════════════════════
const SpacePanel1: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={S}>
    <rect width="800" height="480" fill="#02040a" />
    <path d="M0 380 Q400 240 800 380 L800 480 L0 480Z" fill="#0369a1" filter="drop-shadow(0 0 25px #38bdf8)" />
    <circle cx="120" cy="80" r="1.5" fill="#fff" />
    <circle cx="340" cy="50" r="2" fill="#fff" />
    <circle cx="620" cy="100" r="1.5" fill="#fff" />
    <circle cx="200" cy="160" r="1" fill="#fff" />
    <circle cx="500" cy="40" r="1.5" fill="#fff" />
    <line x1="200" y1="0" x2="200" y2="480" stroke="#334155" strokeWidth="8" />
    <line x1="180" y1="80" x2="220" y2="80" stroke="#475569" strokeWidth="5" />
    <line x1="180" y1="160" x2="220" y2="160" stroke="#475569" strokeWidth="5" />
    <line x1="180" y1="240" x2="220" y2="240" stroke="#475569" strokeWidth="5" />

    {/* VOID OPERATIVE — EVA suit on gantry */}
    <g transform="translate(240, 180) scale(0.55)">
      <circle cx="0" cy="0" r="20" fill="#f8fafc" stroke="#000" strokeWidth="3" />
      <ellipse cx="4" cy="0" rx="12" ry="8" fill="#facc15" stroke="#000" strokeWidth="1.5" filter="drop-shadow(0 0 8px #facc15)" />
      <ellipse cx="4" cy="0" rx="6" ry="4" fill="#fff" opacity="0.7" />
      <rect x="-7" y="18" width="14" height="10" fill="#f8fafc" stroke="#000" strokeWidth="2" />
      <path d="M-24,28 L24,28 L20,76 L-20,76Z" fill="#f8fafc" stroke="#000" strokeWidth="3" />
      <ellipse cx="-26" cy="30" rx="8" ry="5" fill="#f8fafc" stroke="#000" strokeWidth="2" />
      <ellipse cx="26" cy="30" rx="8" ry="5" fill="#f8fafc" stroke="#000" strokeWidth="2" />
      {/* Thruster backpack */}
      <rect x="-34" y="34" width="14" height="36" rx="4" fill="#475569" stroke="#000" strokeWidth="2" />
      <polygon points="-27,70 -34,90 -20,90" fill="#00f2fe" filter="drop-shadow(0 0 8px #00f2fe)" />
      {/* Left arm gripping gantry */}
      <path d="M-26,34 Q-44,52 -46,74" stroke="#f8fafc" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M-46,74 Q-44,92 -40,106" stroke="#f8fafc" strokeWidth="10" strokeLinecap="round" fill="none" />
      <ellipse cx="-40" cy="110" rx="7" ry="5" fill="#f8fafc" stroke="#000" strokeWidth="2" />
      {/* Right arm */}
      <path d="M26,34 Q46,50 46,72" stroke="#f8fafc" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M46,72 Q44,90 40,104" stroke="#f8fafc" strokeWidth="10" strokeLinecap="round" fill="none" />
      <ellipse cx="40" cy="108" rx="7" ry="5" fill="#f8fafc" stroke="#000" strokeWidth="2" />
      {/* Legs crouched */}
      <path d="M-14,76 Q-26,100 -28,124" stroke="#f8fafc" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M-28,124 Q-26,144 -24,156" stroke="#f8fafc" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M-32,152 Q-42,160 -36,166 Q-16,168 -12,158Z" fill="#facc15" stroke="#000" strokeWidth="2" />
      <path d="M14,76 Q28,98 32,120" stroke="#f8fafc" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M32,120 Q30,140 26,152" stroke="#f8fafc" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M18,148 Q8,156 14,162 Q34,164 38,154Z" fill="#facc15" stroke="#000" strokeWidth="2" />
      <path d="M-20,-16 Q-26,0 -26,24" stroke="#facc15" strokeWidth="2.5" fill="none" />
      <path d="M20,-16 Q26,0 26,24" stroke="#00f2fe" strokeWidth="2" fill="none" />
    </g>
  </svg>
);

const SpacePanel2: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={S}>
    <rect width="800" height="480" fill="#020308" />
    <circle cx="80" cy="50" r="1.5" fill="#fff" />
    <circle cx="400" cy="80" r="2" fill="#fff" />
    <circle cx="650" cy="40" r="1.5" fill="#fff" />
    <line x1="800" y1="120" x2="300" y2="280" stroke="#ef4444" strokeWidth="3" filter="drop-shadow(0 0 10px #ef4444)" />
    <line x1="800" y1="360" x2="320" y2="260" stroke="#ef4444" strokeWidth="3" filter="drop-shadow(0 0 10px #ef4444)" />
    <rect x="760" y="100" width="40" height="30" rx="4" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />
    <rect x="760" y="340" width="40" height="30" rx="4" fill="#1e293b" stroke="#ef4444" strokeWidth="2" />

    {/* VOID OPERATIVE — zero-G dodge */}
    <g transform="translate(320, 220) scale(0.55)">
      <circle cx="0" cy="0" r="18" fill="#f8fafc" stroke="#000" strokeWidth="3" />
      <ellipse cx="4" cy="0" rx="12" ry="8" fill="#facc15" stroke="#000" strokeWidth="1.5" filter="drop-shadow(0 0 8px #facc15)" />
      <rect x="-5" y="16" width="10" height="8" fill="#f8fafc" stroke="#000" strokeWidth="1.5" />
      <path d="M-22,24 L22,24 L18,64 L-18,64Z" fill="#f8fafc" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="-24" cy="26" rx="7" ry="5" fill="#f8fafc" stroke="#000" strokeWidth="2" />
      <ellipse cx="24" cy="26" rx="7" ry="5" fill="#f8fafc" stroke="#000" strokeWidth="2" />
      {/* Left arm flung wide */}
      <path d="M-24,30 Q-52,22 -66,8" stroke="#f8fafc" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M-66,8 Q-76,-6 -72,-18" stroke="#f8fafc" strokeWidth="9" strokeLinecap="round" fill="none" />
      <ellipse cx="-72" cy="-22" rx="6" ry="5" fill="#f8fafc" stroke="#000" strokeWidth="2" />
      {/* Right arm with thruster burst */}
      <path d="M24,30 Q50,14 64,-4" stroke="#f8fafc" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M64,-4 Q74,-16 72,-28" stroke="#f8fafc" strokeWidth="9" strokeLinecap="round" fill="none" />
      <ellipse cx="72" cy="-32" rx="6" ry="5" fill="#f8fafc" stroke="#000" strokeWidth="2" />
      <circle cx="72" cy="-32" r="16" fill="#00f2fe" filter="drop-shadow(0 0 14px #00f2fe)" opacity="0.85" />
      <circle cx="72" cy="-32" r="6" fill="#fff" />
      {/* Legs splayed */}
      <path d="M-12,64 Q-30,86 -42,108" stroke="#f8fafc" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M-42,108 Q-50,128 -46,142" stroke="#f8fafc" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M-54,138 Q-64,146 -58,152 Q-38,154 -34,144Z" fill="#facc15" stroke="#000" strokeWidth="2" />
      <path d="M12,64 Q36,82 48,104" stroke="#f8fafc" strokeWidth="14" strokeLinecap="round" fill="none" />
      <path d="M48,104 Q56,124 52,138" stroke="#f8fafc" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M44,134 Q34,142 40,148 Q60,150 64,140Z" fill="#facc15" stroke="#000" strokeWidth="2" />
      <path d="M-18,-14 Q-24,0 -24,20" stroke="#facc15" strokeWidth="2.5" fill="none" />
      <path d="M18,-14 Q24,0 24,20" stroke="#00f2fe" strokeWidth="2" fill="none" />
    </g>
    <ellipse cx="220" cy="130" rx="30" ry="12" fill="#00f2fe" opacity="0.5" filter="drop-shadow(0 0 12px #00f2fe)" />
  </svg>
);

// ═══════════════════════════════════════════════════════════════
// 🌙 DEFAULT / CITY
// ═══════════════════════════════════════════════════════════════
const DefaultPanel1: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={S}>
    <defs>
      <linearGradient id="ns" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#070a16" /><stop offset="45%" stopColor="#0d1b38" /><stop offset="100%" stopColor="#1a2e56" /></linearGradient>
      <radialGradient id="lc2" cx="50%" cy="50%" r="50%"><stop offset="0%" stopColor="#fff" /><stop offset="55%" stopColor="#93c5fd" stopOpacity="0.4" /><stop offset="100%" stopColor="#3b82f6" stopOpacity="0" /></radialGradient>
      <pattern id="cw" width="12" height="18" patternUnits="userSpaceOnUse"><rect x="2" y="2" width="4" height="6" fill="#fef08a" opacity="0.65" /><rect x="8" y="2" width="3" height="6" fill="#67e8f9" opacity="0.5" /></pattern>
    </defs>
    <rect width="800" height="480" fill="url(#ns)" />
    <circle cx="490" cy="95" r="85" fill="url(#lc2)" />
    <circle cx="490" cy="95" r="32" fill="#f8fafc" />
    <rect x="50" y="200" width="70" height="280" fill="#0c1322" />
    <rect x="140" y="160" width="85" height="320" fill="#080e1a" />
    <rect x="145" y="170" width="75" height="150" fill="url(#cw)" />
    <rect x="620" y="180" width="90" height="300" fill="#070c17" />
    <rect x="630" y="195" width="70" height="120" fill="url(#cw)" />
    <path d="M0 320 L800 300 L800 480 L0 480Z" fill="#030712" />
    <path d="M0 320 L800 300" stroke="#3b82f6" strokeWidth="3" opacity="0.5" />

    {/* Two operatives standing on rooftop in moonlight */}
    <g transform="translate(390, 230) scale(0.55)">
      {/* Figure 1 */}
      <circle cx="0" cy="0" r="16" fill="#090d16" stroke="#000" strokeWidth="2" />
      <rect x="-14" y="-5" width="28" height="5" rx="2" fill="#93c5fd" stroke="#000" strokeWidth="1.5" />
      <rect x="-4" y="14" width="8" height="7" fill="#090d16" />
      <path d="M-18,21 L18,21 L14,68 L-14,68Z" fill="#050811" stroke="#000" strokeWidth="2" />
      <ellipse cx="-20" cy="23" rx="6" ry="4" fill="#050811" stroke="#000" strokeWidth="1.5" />
      <ellipse cx="20" cy="23" rx="6" ry="4" fill="#050811" stroke="#000" strokeWidth="1.5" />
      <path d="M-20,26 Q-32,44 -34,64" stroke="#050811" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M-34,64 Q-32,78 -30,88" stroke="#050811" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M20,26 Q32,44 34,64" stroke="#050811" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M34,64 Q32,78 30,88" stroke="#050811" strokeWidth="8" strokeLinecap="round" fill="none" />
      <path d="M-10,68 Q-10,96 -10,122" stroke="#050811" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M-10,122 Q-10,136 -10,146" stroke="#050811" strokeWidth="10" strokeLinecap="round" fill="none" />
      <path d="M10,68 Q10,96 10,122" stroke="#050811" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M10,122 Q10,136 10,146" stroke="#050811" strokeWidth="10" strokeLinecap="round" fill="none" />
      {/* Stripe */}
      <path d="M14,42 L26,44 L24,52 L12,50Z" fill="#e2e8f0" opacity="0.8" />
      {/* Rim light */}
      <path d="M-16,-12 Q-20,4 -18,18" stroke="#93c5fd" strokeWidth="2.5" fill="none" opacity="0.9" />
      <path d="M-18,21 Q-24,40 -24,60" stroke="#60a5fa" strokeWidth="2" fill="none" opacity="0.8" />

      {/* Figure 2 (slightly behind and to right) */}
      <g transform="translate(60, 6)">
        <circle cx="0" cy="0" r="15" fill="#090d16" stroke="#000" strokeWidth="2" />
        <polygon points="-12,-4 12,-4 8,3 -8,3" fill="#e2e8f0" stroke="#000" strokeWidth="1.5" />
        <rect x="-4" y="13" width="8" height="7" fill="#090d16" />
        <path d="M-16,20 L16,20 L12,62 L-12,62Z" fill="#050811" stroke="#000" strokeWidth="2" />
        <path d="M-16,24 Q-28,42 -28,58" stroke="#050811" strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M16,24 Q28,42 28,58" stroke="#050811" strokeWidth="10" strokeLinecap="round" fill="none" />
        <path d="M-8,62 Q-8,90 -8,116" stroke="#050811" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M-8,116 Q-8,130 -8,138" stroke="#050811" strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M8,62 Q8,90 8,116" stroke="#050811" strokeWidth="12" strokeLinecap="round" fill="none" />
        <path d="M8,116 Q8,130 8,138" stroke="#050811" strokeWidth="9" strokeLinecap="round" fill="none" />
        <path d="M-15,-12 Q-18,4 -16,16" stroke="#60a5fa" strokeWidth="2" fill="none" opacity="0.8" />
      </g>
    </g>
  </svg>
);

const DefaultPanel2: React.FC = () => (
  <svg viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" style={S}>
    <defs><linearGradient id="cg" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stopColor="#1e293b" /><stop offset="100%" stopColor="#020617" /></linearGradient></defs>
    <rect width="800" height="520" fill="url(#cg)" />
    <path d="M520 180 L760 180 L800 520 L580 520Z" fill="#090d16" />
    <line x1="565" y1="200" x2="640" y2="520" stroke="#f59e0b" strokeWidth="4" opacity="0.85" />
    <line x1="710" y1="200" x2="760" y2="520" stroke="#67e8f9" strokeWidth="3" opacity="0.75" />
    <path d="M0 360 L550 260 L660 380 L0 490Z" fill="#18181b" stroke="#27272a" strokeWidth="3" />
    <line x1="0" y1="360" x2="550" y2="260" stroke="#38bdf8" strokeWidth="2" opacity="0.6" />

    {/* HERO crouched on skyscraper parapet, looking down */}
    <g transform="translate(350, 240) scale(0.55)">
      <circle cx="0" cy="0" r="18" fill="#dc2626" stroke="#000" strokeWidth="2.5" />
      <polygon points="-14,-4 14,-4 10,5 -10,5" fill="#fff" stroke="#000" strokeWidth="2" />
      <polygon points="-9,-2 9,-2 7,3 -7,3" fill="#fff" opacity="0.6" />
      <rect x="-6" y="16" width="12" height="8" fill="#dc2626" stroke="#000" strokeWidth="1.5" />
      <path d="M-24,24 L24,24 L20,72 L-20,72Z" fill="#dc2626" stroke="#000" strokeWidth="2.5" />
      <ellipse cx="-26" cy="26" rx="8" ry="5" fill="#dc2626" stroke="#000" strokeWidth="2" />
      <ellipse cx="26" cy="26" rx="8" ry="5" fill="#dc2626" stroke="#000" strokeWidth="2" />
      <path d="M-8,34 Q0,42 8,34 L6,48 Q0,52 -6,48Z" fill="#1e3a8a" stroke="#000" strokeWidth="1.5" />
      {/* Left arm */}
      <path d="M-26,30 Q-46,50 -46,74" stroke="#dc2626" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M-46,74 Q-44,92 -40,106" stroke="#dc2626" strokeWidth="10" strokeLinecap="round" fill="none" />
      <ellipse cx="-40" cy="110" rx="7" ry="5" fill="#dc2626" stroke="#000" strokeWidth="2" />
      {/* Right arm gripping ledge */}
      <path d="M26,30 Q48,54 50,82" stroke="#dc2626" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M50,82 Q52,102 54,118" stroke="#dc2626" strokeWidth="10" strokeLinecap="round" fill="none" />
      <ellipse cx="54" cy="122" rx="7" ry="5" fill="#dc2626" stroke="#000" strokeWidth="2" />
      {/* Legs crouched */}
      <path d="M-14,72 Q-28,98 -30,124" stroke="#1e3a8a" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M-30,124 Q-28,144 -26,156" stroke="#1e3a8a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M-34,152 Q-44,160 -38,166 Q-18,168 -14,158Z" fill="#dc2626" stroke="#000" strokeWidth="2" />
      <path d="M14,72 Q30,96 34,120" stroke="#1e3a8a" strokeWidth="15" strokeLinecap="round" fill="none" />
      <path d="M34,120 Q32,140 28,152" stroke="#1e3a8a" strokeWidth="12" strokeLinecap="round" fill="none" />
      <path d="M20,148 Q10,156 16,162 Q36,164 40,154Z" fill="#dc2626" stroke="#000" strokeWidth="2" />
      <path d="M-18,-16 Q-26,0 -26,24" stroke="#ef4444" strokeWidth="3" fill="none" />
      <path d="M18,-16 Q26,0 26,24" stroke="#00f2fe" strokeWidth="2.5" fill="none" />
    </g>

    {/* Distant leaping figure below */}
    <g transform="translate(630, 400) scale(0.25)">
      <circle cx="0" cy="0" r="16" fill="#dc2626" stroke="#000" strokeWidth="2.5" />
      <polygon points="-12,-4 12,-4 8,3 -8,3" fill="#fff" stroke="#000" strokeWidth="1.5" />
      <path d="M-18,20 L18,20 L14,54 L-14,54Z" fill="#1e3a8a" stroke="#000" strokeWidth="2" />
      <path d="M-18,24 Q-38,16 -50,2" stroke="#dc2626" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M18,24 Q38,10 52,-4" stroke="#dc2626" strokeWidth="11" strokeLinecap="round" fill="none" />
      <path d="M-10,54 Q-24,72 -34,92" stroke="#1e3a8a" strokeWidth="13" strokeLinecap="round" fill="none" />
      <path d="M10,54 Q28,70 40,88" stroke="#1e3a8a" strokeWidth="13" strokeLinecap="round" fill="none" />
      <circle cx="0" cy="0" r="28" fill="none" stroke="#00f2fe" strokeWidth="2" filter="drop-shadow(0 0 8px #00f2fe)" opacity="0.6" />
    </g>
    <path d="M560,360 Q590,330 620,350" stroke="#f8fafc" strokeWidth="2.5" fill="none" opacity="0.85" strokeDasharray="6,4" />
  </svg>
);
