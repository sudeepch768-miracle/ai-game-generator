import React from 'react';

interface ComicIllustrationProps {
  theme: string;
  panelIndex: number;
  heroCodename?: string;
  userImageUrl?: string;
  showPhotoFilter?: boolean;
}

export const ComicIllustration: React.FC<ComicIllustrationProps> = ({
  theme,
  panelIndex,
  userImageUrl,
  showPhotoFilter,
}) => {
  // If user uploaded a photo and photo mode is active, render the photo with comic halftone/ink styling
  if (userImageUrl && showPhotoFilter) {
    return (
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `url(${userImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'contrast(140%) saturate(130%) brightness(0.85)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(0,0,0,0.35) 1.5px, transparent 1.5px)',
            backgroundSize: '4px 4px',
            mixBlendMode: 'multiply',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.04) 0px, transparent 2px, transparent 8px)',
          }}
        />
      </div>
    );
  }

  // Theme-specific comic artwork with authentic comic character models
  const isHospital = theme === 'hospital';
  const isRailway = theme === 'railway';
  const isBank = theme === 'bank';
  const isPolice = theme === 'police';
  const isSnow = theme === 'snow';
  const isCyberpunk = theme === 'cyberpunk';
  const isHaunted = theme === 'haunted';
  const isSpace = theme === 'space';

  if (isHospital) {
    return panelIndex === 0 ? <HospitalInfiltratorScene /> : <HospitalEnforcerBossScene />;
  }

  if (isRailway) {
    return panelIndex === 0 ? <RailwayRunnerScene /> : <RailwayConductorBossScene />;
  }

  if (isBank) {
    return panelIndex === 0 ? <BankThiefSuspensionScene /> : <BankLaserSprintScene />;
  }

  if (isPolice) {
    return panelIndex === 0 ? <PoliceNoirLockpickScene /> : <PoliceRooftopPursuitScene />;
  }

  if (isSnow) {
    return panelIndex === 0 ? <SnowIceClimbScene /> : <SnowBlizzardWolfScene />;
  }

  if (isCyberpunk) {
    return panelIndex === 0 ? <CyberRunnerGargoyleScene /> : <CyberDroneSkirmishScene />;
  }

  if (isHaunted) {
    return panelIndex === 0 ? <HauntedInvestigatorScene /> : <HauntedWraithEncounterScene />;
  }

  if (isSpace) {
    return panelIndex === 0 ? <SpaceAirlockEVAClimbScene /> : <SpaceZeroGLaserScene />;
  }

  // Default / City Graphic Novel Scene (Rooftop Moon & Skyscraper Ledge)
  return panelIndex === 0 ? <NightRooftopMoonScene /> : <SkyscraperHighAngleScene />;
};

// ============================================================================
// 🏥 THEME 1: HOSPITAL BIO-WING
// ============================================================================

// Panel 1: Agent Zero in tactical stealth gear crouched on an overhead pipe
const HospitalInfiltratorScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <defs>
      <linearGradient id="hospHall" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#040e17" />
        <stop offset="60%" stopColor="#081e2f" />
        <stop offset="100%" stopColor="#02080d" />
      </linearGradient>
      <linearGradient id="suitDark" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="60%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      <linearGradient id="cyanVisor" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="40%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#0284c7" />
      </linearGradient>
      <radialGradient id="lampCone" cx="50%" cy="0%" r="90%">
        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.45" />
        <stop offset="70%" stopColor="#0284c7" stopOpacity="0.1" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Background Corridor Perspective */}
    <rect width="800" height="480" fill="url(#hospHall)" />
    <path d="M0 0 L320 200 L320 300 L0 480 Z" fill="#081826" stroke="#00f2fe" strokeWidth="1" opacity="0.8" />
    <path d="M800 0 L480 200 L480 300 L800 480 Z" fill="#081826" stroke="#00f2fe" strokeWidth="1" opacity="0.8" />

    {/* Distant Sealed Bio-Lab Blast Door */}
    <rect x="320" y="200" width="160" height="100" fill="#02060b" stroke="#38bdf8" strokeWidth="2.5" />
    <line x1="400" y1="200" x2="400" y2="300" stroke="#38bdf8" strokeWidth="2" />
    {/* Yellow/Black Caution Stripes */}
    <rect x="325" y="290" width="150" height="8" fill="#facc15" />
    <line x1="335" y1="290" x2="345" y2="298" stroke="#000" strokeWidth="2" />
    <line x1="355" y1="290" x2="365" y2="298" stroke="#000" strokeWidth="2" />
    <line x1="375" y1="290" x2="385" y2="298" stroke="#000" strokeWidth="2" />
    <line x1="395" y1="290" x2="405" y2="298" stroke="#000" strokeWidth="2" />
    <line x1="415" y1="290" x2="425" y2="298" stroke="#000" strokeWidth="2" />
    <line x1="435" y1="290" x2="445" y2="298" stroke="#000" strokeWidth="2" />

    {/* Overhead Surgical Spotlight Cone */}
    <ellipse cx="400" cy="50" rx="120" ry="18" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
    <path d="M280 50 L180 480 L620 480 L520 50 Z" fill="url(#lampCone)" />

    {/* Oscilloscope ECG Heartbeat Monitor Display on Wall */}
    <rect x="60" y="160" width="170" height="95" rx="4" fill="#020911" stroke="#00f2fe" strokeWidth="2" />
    <text x="75" y="180" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">BIO-TELEMETRY // CODE RED</text>
    <path
      d="M70 215 L105 215 L112 205 L118 228 L125 180 L132 238 L138 215 L170 215 L176 195 L182 225 L190 215 L220 215"
      fill="none"
      stroke="#22c55e"
      strokeWidth="2.5"
    />

    {/* Overhead Steel Conduit Pipe running horizontally */}
    <rect x="0" y="110" width="800" height="26" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
    <line x1="0" y1="123" x2="800" y2="123" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />

    {/* COMIC HERO: AGENT ZERO CROUCHED ON THE OVERHEAD CONDUIT */}
    <g transform="translate(420, 45)">
      {/* Shadow Silhouette Base */}
      <path
        d="M60 40 Q90 15 130 35 Q170 60 175 110 Q160 160 130 180 Q80 185 50 150 Q30 110 40 70 Z"
        fill="rgba(0,0,0,0.6)"
        filter="blur(4px)"
      />

      {/* Hero Mask / Cowl */}
      <path
        d="M80 30 Q105 15 125 32 Q138 52 130 75 Q115 95 90 90 Q72 85 70 60 Q70 40 80 30 Z"
        fill="url(#suitDark)"
        stroke="#000000"
        strokeWidth="3"
      />
      {/* Glowing Angular Cyan Visor Lens (Spider-Verse Eye Style) */}
      <polygon points="95,45 122,48 116,62 92,56" fill="url(#cyanVisor)" stroke="#000" strokeWidth="1.5" />
      <polygon points="100,48 118,50 114,58 98,55" fill="#ffffff" />
      {/* Lower Face Respirator Plate */}
      <path d="M85 68 L115 72 L110 84 L90 82 Z" fill="#334155" stroke="#000" strokeWidth="2" />
      <line x1="93" y1="72" x2="93" y2="80" stroke="#00f2fe" strokeWidth="1.5" />
      <line x1="100" y1="73" x2="100" y2="81" stroke="#00f2fe" strokeWidth="1.5" />
      <line x1="107" y1="74" x2="107" y2="82" stroke="#00f2fe" strokeWidth="1.5" />

      {/* Muscular Athletic Torso (Crouched Forward) */}
      <path
        d="M65 85 Q95 75 135 85 Q150 120 135 155 Q105 170 70 155 Q55 125 65 85 Z"
        fill="url(#suitDark)"
        stroke="#000000"
        strokeWidth="3.5"
      />
      {/* Red Caduceus Cross Infiltration Patch on Shoulder */}
      <circle cx="130" cy="105" r="10" fill="#dc2626" stroke="#000" strokeWidth="1.5" />
      <text x="130" y="109" textAnchor="middle" fill="#fff" fontSize="11" fontWeight="bold" fontFamily="sans-serif">✚</text>

      {/* Tactical Belt & Bio-Canister Pouches */}
      <path d="M68 150 L132 150 L128 165 L72 165 Z" fill="#475569" stroke="#000" strokeWidth="2" />
      <rect x="80" y="152" width="10" height="11" fill="#00f2fe" stroke="#000" strokeWidth="1" />
      <rect x="96" y="152" width="10" height="11" fill="#00f2fe" stroke="#000" strokeWidth="1" />
      <rect x="112" y="152" width="10" height="11" fill="#00f2fe" stroke="#000" strokeWidth="1" />

      {/* Muscular Arm & Gauntlet Gripping Conduit */}
      <path
        d="M65 95 Q40 120 45 150 L60 155 Q60 130 75 110 Z"
        fill="url(#suitDark)"
        stroke="#000"
        strokeWidth="2.5"
      />
      {/* Reinforced Tactical Gauntlet */}
      <path d="M42 145 L62 148 L58 175 L38 170 Z" fill="#334155" stroke="#000" strokeWidth="2" />
      {/* Glove Hand with Articulated Fingers Clamped on the Pipe */}
      <path d="M38 170 Q30 180 38 190 Q48 192 56 182 L58 172 Z" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <line x1="42" y1="175" x2="42" y2="186" stroke="#000" strokeWidth="1.5" />
      <line x1="47" y1="175" x2="47" y2="188" stroke="#000" strokeWidth="1.5" />

      {/* Bent Crouching Leg with Armored Knee Guard */}
      <path
        d="M125 140 Q160 160 170 195 Q145 220 120 200 Q125 170 115 155 Z"
        fill="url(#suitDark)"
        stroke="#000"
        strokeWidth="3"
      />
      {/* Knee Armor Plate */}
      <polygon points="152,185 175,195 165,212 145,202" fill="#0284c7" stroke="#000" strokeWidth="2" />

      {/* Comic Ink Line-Hatching on Ribs & Shoulder */}
      <line x1="82" y1="105" x2="72" y2="120" stroke="#000" strokeWidth="2" />
      <line x1="88" y1="112" x2="78" y2="127" stroke="#000" strokeWidth="2" />
      <line x1="94" y1="118" x2="84" y2="133" stroke="#000" strokeWidth="2" />

      {/* Vibrant Comic Rim Lights (Cyan on Left, Crimson on Right) */}
      <path d="M78 30 Q70 50 68 80" stroke="#00f2fe" strokeWidth="3" fill="none" />
      <path d="M125 32 Q138 60 132 85" stroke="#ef4444" strokeWidth="2.5" fill="none" />
      <path d="M135 155 Q165 190 165 210" stroke="#00f2fe" strokeWidth="3" fill="none" />
    </g>
  </svg>
);

// Panel 2: Chief Medical Inspector Enforcer & Drones vs Dashing Hero
const HospitalEnforcerBossScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <defs>
      <linearGradient id="redLockdown" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#450a0a" />
        <stop offset="50%" stopColor="#180404" />
        <stop offset="100%" stopColor="#050101" />
      </linearGradient>
      <radialGradient id="redBeaconGlow" cx="50%" cy="0%" r="90%">
        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.85" />
        <stop offset="60%" stopColor="#b91c1c" stopOpacity="0.3" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="mechArmor" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#3f3f46" />
        <stop offset="60%" stopColor="#18181b" />
        <stop offset="100%" stopColor="#09090b" />
      </linearGradient>
    </defs>

    <rect width="800" height="480" fill="url(#redLockdown)" />

    {/* Rotating Emergency Warning Beacons */}
    <circle cx="180" cy="30" r="16" fill="#ef4444" filter="drop-shadow(0 0 16px #ef4444)" />
    <path d="M180 30 L40 480 L320 480 Z" fill="url(#redBeaconGlow)" />
    <circle cx="620" cy="30" r="16" fill="#ef4444" filter="drop-shadow(0 0 16px #ef4444)" />
    <path d="M620 30 L480 480 L760 480 Z" fill="url(#redBeaconGlow)" />

    {/* Heavy Hydraulic Blast Door Slamming Shut in Center */}
    <path d="M300 0 L500 0 L500 480 L300 480 Z" fill="#09090b" stroke="#dc2626" strokeWidth="4" />
    <line x1="400" y1="0" x2="400" y2="480" stroke="#dc2626" strokeWidth="3" />
    {/* Hydraulic Pistons */}
    <rect x="260" y="120" width="50" height="24" fill="#71717a" stroke="#000" strokeWidth="2" />
    <rect x="490" y="120" width="50" height="24" fill="#71717a" stroke="#000" strokeWidth="2" />
    <rect x="260" y="320" width="50" height="24" fill="#71717a" stroke="#000" strokeWidth="2" />
    <rect x="490" y="320" width="50" height="24" fill="#71717a" stroke="#000" strokeWidth="2" />

    {/* Flying Bio-Drone Surveillance Scout (Left) */}
    <g transform="translate(100, 110)">
      <polygon points="40,20 80,10 95,35 60,50 30,35" fill="#18181b" stroke="#ef4444" strokeWidth="2.5" />
      <circle cx="65" cy="30" r="8" fill="#ef4444" filter="drop-shadow(0 0 8px #ef4444)" />
      <line x1="65" y1="38" x2="50" y2="280" stroke="#ef4444" strokeWidth="1.5" opacity="0.6" />
      <line x1="65" y1="38" x2="110" y2="280" stroke="#ef4444" strokeWidth="1.5" opacity="0.6" />
    </g>

    {/* COMIC VILLAIN: TOWERING CHIEF MEDICAL INSPECTOR (Center-Right Boss) */}
    <g transform="translate(450, 100)">
      {/* Massive Mech Shoulders & Collar */}
      <polygon points="50,90 140,50 230,90 200,160 80,160" fill="url(#mechArmor)" stroke="#000" strokeWidth="4" />
      {/* Hazard Chevrons on Shoulder Pauldron */}
      <polygon points="50,90 75,75 85,95 60,110" fill="#facc15" stroke="#000" strokeWidth="1.5" />
      <polygon points="75,75 100,60 110,80 85,95" fill="#000" />
      <polygon points="100,60 125,50 135,70 110,80" fill="#facc15" stroke="#000" strokeWidth="1.5" />

      {/* Intimidating Armored Helmet with Horizontal Red Eye Slit */}
      <path d="M110 30 Q140 20 170 30 L175 75 L105 75 Z" fill="#18181b" stroke="#000" strokeWidth="3" />
      {/* Glowing Horizontal Crimson Eye Visor */}
      <rect x="115" y="45" width="50" height="8" rx="2" fill="#ef4444" filter="drop-shadow(0 0 10px #ef4444)" />
      <rect x="125" y="47" width="30" height="4" fill="#ffffff" />

      {/* Heavy Pneumatic Syringe Clamp Gauntlet Raised in Attack */}
      <path d="M40 120 L0 150 L20 210 L60 170 Z" fill="url(#mechArmor)" stroke="#000" strokeWidth="3" />
      {/* Mechanical Syringe Needles */}
      <line x1="5" y1="190" x2="-25" y2="215" stroke="#e4e4e7" strokeWidth="4" />
      <line x1="15" y1="200" x2="-15" y2="225" stroke="#e4e4e7" strokeWidth="4" />
      <circle cx="-25" cy="215" r="3" fill="#ef4444" />
      <circle cx="-15" cy="225" r="3" fill="#ef4444" />

      {/* Armored Chest Plate with Toxic Gas Filter */}
      <rect x="105" y="95" width="70" height="60" rx="4" fill="#27272a" stroke="#000" strokeWidth="2.5" />
      <circle cx="140" cy="125" r="16" fill="#09090b" stroke="#ef4444" strokeWidth="2" />
      <text x="140" y="130" textAnchor="middle" fill="#ef4444" fontSize="14" fontWeight="bold">☣</text>
    </g>

    {/* COMIC HERO: AGENT ZERO IN DYNAMIC SPRINT/SLIDE UNDER THE BLAST DOOR */}
    <g transform="translate(180, 260)">
      {/* Motion Speed Lines radiating behind him */}
      <line x1="-120" y1="60" x2="-20" y2="60" stroke="#00f2fe" strokeWidth="3" opacity="0.8" />
      <line x1="-150" y1="90" x2="-10" y2="90" stroke="#00f2fe" strokeWidth="4" opacity="0.9" />
      <line x1="-100" y1="120" x2="10" y2="120" stroke="#ffffff" strokeWidth="2" opacity="0.7" />

      {/* Leaning Forward Dashing Body */}
      <path
        d="M30 40 Q60 10 90 25 Q110 50 100 85 Q70 105 35 90 Q15 65 30 40 Z"
        fill="#0f172a"
        stroke="#000"
        strokeWidth="3"
      />
      {/* Visor glowing cyan facing forward */}
      <polygon points="80,35 105,40 98,52 76,46" fill="#00f2fe" stroke="#000" strokeWidth="1.5" />
      <polygon points="85,38 100,42 96,48 82,44" fill="#ffffff" />

      {/* Streaming Windbreaker / Coat Tails Flaring in Motion */}
      <path d="M30 65 L-45 45 L-35 85 L20 85 Z" fill="#0284c7" stroke="#000" strokeWidth="2.5" />
      <path d="M20 75 L-60 70 L-45 105 L15 95 Z" fill="#0369a1" stroke="#000" strokeWidth="2.5" />

      {/* Leading Arm Reaching for the Blast Gate Handle */}
      <path d="M90 50 L145 65 L135 80 L85 65 Z" fill="#0f172a" stroke="#000" strokeWidth="2.5" />
      {/* Tactical Gauntlet with Cipher Key in Hand */}
      <rect x="135" y="60" width="22" height="18" rx="3" fill="#facc15" stroke="#000" strokeWidth="2" />
      <polygon points="148,55 162,60 155,75 142,70" fill="#00f2fe" />

      {/* Sliding Leg Outstretched */}
      <path d="M60 90 L130 140 L110 155 L40 105 Z" fill="#0f172a" stroke="#000" strokeWidth="3" />
      <polygon points="120,135 145,145 135,160 110,150" fill="#38bdf8" stroke="#000" strokeWidth="2" />

      {/* Comic Action Impact Spark on Heel */}
      <polygon points="135,160 150,155 145,170 160,175 140,180 135,160" fill="#facc15" stroke="#000" strokeWidth="1.5" />
    </g>
  </svg>
);

// ============================================================================
// 🚆 THEME 2: GRAND CENTRAL RAILWAY
// ============================================================================

const RailwayRunnerScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <defs>
      <linearGradient id="subwayDark" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0a0f1d" />
        <stop offset="60%" stopColor="#131b2e" />
        <stop offset="100%" stopColor="#04060a" />
      </linearGradient>
    </defs>

    <rect width="800" height="480" fill="url(#subwayDark)" />

    {/* Vaulted Iron Lattice Arch Roof */}
    <path d="M0 130 Q400 20 800 130" stroke="#334155" strokeWidth="10" fill="none" />
    <path d="M0 170 Q400 70 800 170" stroke="#1e293b" strokeWidth="8" fill="none" />
    {/* Hanging Station Bell Lamps */}
    <line x1="240" y1="70" x2="240" y2="150" stroke="#475569" strokeWidth="3" />
    <polygon points="225,150 255,150 250,165 230,165" fill="#facc15" />
    <line x1="560" y1="70" x2="560" y2="150" stroke="#475569" strokeWidth="3" />
    <polygon points="545,150 575,150 570,165 550,165" fill="#facc15" />

    {/* Platform & Steel Tracks in One-Point Perspective */}
    <path d="M300 260 L500 260 L750 480 L50 480 Z" fill="#090d16" />
    <line x1="360" y1="260" x2="200" y2="480" stroke="#94a3b8" strokeWidth="5" />
    <line x1="440" y1="260" x2="600" y2="480" stroke="#94a3b8" strokeWidth="5" />

    {/* High-Speed Express Train Locomotive with Blazing Amber Headlights */}
    <rect x="350" y="190" width="100" height="85" rx="8" fill="#0f172a" stroke="#f59e0b" strokeWidth="3" />
    <circle cx="375" cy="245" r="12" fill="#fbbf24" filter="drop-shadow(0 0 15px #f59e0b)" />
    <circle cx="425" cy="245" r="12" fill="#fbbf24" filter="drop-shadow(0 0 15px #f59e0b)" />
    {/* Billowing Steam Clouds from Locomotive */}
    <ellipse cx="400" cy="180" rx="60" ry="25" fill="rgba(241,245,249,0.3)" filter="blur(8px)" />

    {/* COMIC HERO: TRACK RUNNER VAULTING OVER TURNSTILE IN FOREGROUND */}
    <g transform="translate(180, 180)">
      {/* Yellow Magnetic Sparks from Grip */}
      <polygon points="120,60 145,45 135,70 160,65 130,85" fill="#facc15" stroke="#000" strokeWidth="1" />

      {/* Runner Head with Amber Visor & Hood */}
      <path d="M80 40 Q105 20 125 38 Q135 60 125 82 Q105 100 80 90 Q65 75 70 55 Z" fill="#0f172a" stroke="#000" strokeWidth="3" />
      <polygon points="95,50 120,55 112,68 90,62" fill="#f59e0b" stroke="#000" strokeWidth="1.5" />
      <polygon points="100,53 115,56 110,64 96,60" fill="#fff" />

      {/* Urban Windbreaker with Bold Yellow Chevron Stripes */}
      <path d="M60 85 Q95 70 135 85 Q145 125 125 160 Q90 170 55 155 Z" fill="#1e293b" stroke="#000" strokeWidth="3.5" />
      <polygon points="70,105 95,120 120,105 125,120 95,135 65,120" fill="#facc15" stroke="#000" strokeWidth="1.5" />

      {/* Outstretched Leaping Legs */}
      <path d="M115 150 L175 195 L155 215 L95 170 Z" fill="#0f172a" stroke="#000" strokeWidth="3" />
      <polygon points="160,190 185,200 175,220 150,210" fill="#eab308" stroke="#000" strokeWidth="2" />
    </g>
  </svg>
);

const RailwayConductorBossScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <rect width="800" height="480" fill="#180c04" />
    {/* Electrified Third Rail Lightning Arcs */}
    <path d="M80 480 L280 260 L310 270 L500 120" stroke="#00f2fe" strokeWidth="4" filter="drop-shadow(0 0 12px #00f2fe)" fill="none" />
    <path d="M720 480 L520 260 L490 270 L300 120" stroke="#00f2fe" strokeWidth="4" filter="drop-shadow(0 0 12px #00f2fe)" fill="none" />

    {/* Conductor Dan Boss Silhouette with Electrified Stun Baton */}
    <g transform="translate(420, 80)">
      <polygon points="30,70 110,40 190,70 170,190 50,190" fill="#0f172a" stroke="#f97316" strokeWidth="3" />
      <circle cx="110" cy="50" r="28" fill="#1e293b" stroke="#000" strokeWidth="3" />
      {/* Conductor Peaked Cap */}
      <polygon points="75,40 145,40 155,25 65,25" fill="#ea580c" stroke="#000" strokeWidth="2" />
      <circle cx="110" cy="32" r="6" fill="#facc15" />
      {/* Glowing Red Eyes behind Cap */}
      <circle cx="102" cy="54" r="4" fill="#ef4444" filter="drop-shadow(0 0 6px #ef4444)" />
      <circle cx="118" cy="54" r="4" fill="#ef4444" filter="drop-shadow(0 0 6px #ef4444)" />
      {/* Stun Baton Raised High */}
      <line x1="180" y1="90" x2="260" y2="20" stroke="#cbd5e1" strokeWidth="6" />
      <circle cx="260" cy="20" r="16" fill="#00f2fe" filter="drop-shadow(0 0 14px #00f2fe)" />
    </g>

    {/* COMIC ACTION: TRACK RUNNER SLIDING LOW ACROSS THE TIES UNDER THE LIGHTNING ARCS */}
    <g transform="translate(140, 240)">
      {/* Speed lines */}
      <line x1="-80" y1="80" x2="0" y2="80" stroke="#facc15" strokeWidth="3" />
      <line x1="-120" y1="100" x2="-20" y2="100" stroke="#00f2fe" strokeWidth="3" />
      {/* Low slide torso */}
      <path d="M20 40 Q60 20 90 45 Q95 80 60 90 Q30 90 20 60 Z" fill="#1e293b" stroke="#000" strokeWidth="3" />
      {/* Amber HUD goggles glowing */}
      <polygon points="85,38 105,42 98,52 80,48" fill="#f59e0b" stroke="#000" strokeWidth="1.5" />
      <polygon points="90,40 100,43 96,49 84,46" fill="#fff" />
      {/* Outstretched leg skidding on track rail with sparks */}
      <path d="M60 80 L140 120 L120 135 L40 95 Z" fill="#0f172a" stroke="#000" strokeWidth="3" />
      <polygon points="135,115 155,120 150,135 125,130" fill="#facc15" />
      <polygon points="150,110 170,125 155,140 135,125" fill="#facc15" stroke="#ea580c" strokeWidth="1" />
    </g>
  </svg>
);

// ============================================================================
// 🏦 THEME 3: BANK VAULT HEIST
// ============================================================================

const BankThiefSuspensionScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <rect width="800" height="480" fill="#070c18" />
    {/* Massive Circular Titanium Vault Door with Spoke Wheel */}
    <circle cx="400" cy="240" r="165" fill="#0f172a" stroke="#ffd700" strokeWidth="7" />
    <circle cx="400" cy="240" r="130" fill="#1e293b" stroke="#475569" strokeWidth="4" />
    {/* Locking Bolts */}
    <line x1="400" y1="75" x2="400" y2="110" stroke="#ffd700" strokeWidth="8" />
    <line x1="400" y1="405" x2="400" y2="370" stroke="#ffd700" strokeWidth="8" />
    <line x1="235" y1="240" x2="270" y2="240" stroke="#ffd700" strokeWidth="8" />
    <line x1="565" y1="240" x2="530" y2="240" stroke="#ffd700" strokeWidth="8" />

    {/* High-Tension Suspension Wire hanging from ceiling grate */}
    <line x1="400" y1="0" x2="400" y2="180" stroke="#e2e8f0" strokeWidth="2.5" />

    {/* MASTER THIEF: INVERTED CEILING DROP IN SLEEK CATSUIT */}
    <g transform="translate(340, 140)">
      {/* Inverted Hero Body */}
      <path d="M60 40 Q40 70 50 110 Q75 130 110 110 Q120 70 100 40 Z" fill="#0f172a" stroke="#ffd700" strokeWidth="2.5" />
      {/* Night Vision Multi-Goggles glowing gold */}
      <circle cx="70" cy="115" r="7" fill="#ffd700" filter="drop-shadow(0 0 8px #ffd700)" />
      <circle cx="88" cy="115" r="7" fill="#ffd700" filter="drop-shadow(0 0 8px #ffd700)" />
      <line x1="77" y1="115" x2="81" y2="115" stroke="#000" strokeWidth="2" />
      {/* Sleek Reaching Hands with Articulated Claw-Grip */}
      <path d="M55 80 L25 130 L38 140 L65 90 Z" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <path d="M105 80 L135 130 L122 140 L95 90 Z" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <polygon points="25,130 18,145 32,142" fill="#ffd700" />
      <polygon points="135,130 142,145 128,142" fill="#ffd700" />
    </g>
  </svg>
);

const BankLaserSprintScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <rect width="800" height="480" fill="#06070d" />
    {/* Red Security Lasers Criss-Crossing Grid */}
    <line x1="0" y1="140" x2="800" y2="340" stroke="#ff0055" strokeWidth="3" filter="drop-shadow(0 0 8px #ff0055)" />
    <line x1="0" y1="340" x2="800" y2="140" stroke="#ff0055" strokeWidth="3" filter="drop-shadow(0 0 8px #ff0055)" />
    <line x1="0" y1="240" x2="800" y2="240" stroke="#ff0055" strokeWidth="2" filter="drop-shadow(0 0 6px #ff0055)" opacity="0.6" />
    <line x1="200" y1="0" x2="350" y2="480" stroke="#ff0055" strokeWidth="2.5" filter="drop-shadow(0 0 6px #ff0055)" />
    <line x1="600" y1="0" x2="450" y2="480" stroke="#ff0055" strokeWidth="2.5" filter="drop-shadow(0 0 6px #ff0055)" />

    {/* Stacks of Gold Bullion Pallets */}
    <rect x="80" y="340" width="120" height="50" rx="4" fill="#ca8a04" stroke="#fef08a" strokeWidth="2" />
    <rect x="620" y="340" width="120" height="50" rx="4" fill="#ca8a04" stroke="#fef08a" strokeWidth="2" />

    {/* COMIC ACTION: MASTER THIEF HORIZONTAL DIVE THROUGH LASER GRID */}
    <g transform="translate(320, 160)">
      {/* Speed lines */}
      <line x1="-120" y1="40" x2="-20" y2="40" stroke="#ffd700" strokeWidth="3" />
      <line x1="-140" y1="70" x2="-40" y2="70" stroke="#00f2fe" strokeWidth="2" />
      {/* Horizontal Torso in Mid-Air Dive */}
      <path d="M20 30 Q70 10 120 25 Q130 55 90 65 Q40 60 20 30 Z" fill="#0f172a" stroke="#ffd700" strokeWidth="2.5" />
      {/* Head with Gold NVG Visor looking forward */}
      <circle cx="125" cy="28" r="14" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <circle cx="132" cy="26" r="5" fill="#ffd700" filter="drop-shadow(0 0 6px #ffd700)" />
      {/* Reaching arm clutching glowing cyan cipher canister */}
      <path d="M110 40 L160 50 L155 65 L105 52 Z" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <rect x="155" y="45" width="20" height="15" rx="3" fill="#00f2fe" stroke="#fff" strokeWidth="1.5" filter="drop-shadow(0 0 8px #00f2fe)" />
      {/* Trailing legs arched over laser */}
      <path d="M30 45 L-40 25 L-30 10 L40 30 Z" fill="#0f172a" stroke="#000" strokeWidth="2.5" />
      <path d="M25 55 L-50 50 L-45 35 L30 42 Z" fill="#1e293b" stroke="#000" strokeWidth="2.5" />
    </g>
  </svg>
);

// ============================================================================
// 🚨 THEME 4: POLICE PRECINCT
// ============================================================================

const PoliceNoirLockpickScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <rect width="800" height="480" fill="#080d1a" />
    {/* Heavy Noir Venetian Blind Shadows */}
    <line x1="0" y1="40" x2="800" y2="40" stroke="#000" strokeWidth="22" opacity="0.65" />
    <line x1="0" y1="110" x2="800" y2="110" stroke="#000" strokeWidth="22" opacity="0.65" />
    <line x1="0" y1="180" x2="800" y2="180" stroke="#000" strokeWidth="22" opacity="0.65" />
    <line x1="0" y1="250" x2="800" y2="250" stroke="#000" strokeWidth="22" opacity="0.65" />

    {/* Flashing Blue and Red Siren Glare */}
    <rect x="0" y="0" width="400" height="480" fill="#1e3a8a" opacity="0.3" />
    <rect x="400" y="0" width="400" height="480" fill="#dc2626" opacity="0.3" />

    {/* Heavy Iron Cell Bars */}
    <line x1="140" y1="0" x2="140" y2="480" stroke="#0f172a" strokeWidth="16" />
    <line x1="280" y1="0" x2="280" y2="480" stroke="#0f172a" strokeWidth="16" />
    <line x1="420" y1="0" x2="420" y2="480" stroke="#0f172a" strokeWidth="16" />
    <line x1="560" y1="0" x2="560" y2="480" stroke="#0f172a" strokeWidth="16" />
    <line x1="700" y1="0" x2="700" y2="480" stroke="#0f172a" strokeWidth="16" />

    {/* COMIC HERO: AGENT X IN NOIR COWL PICKING CELL LOCK IN CLOSE-UP */}
    <g transform="translate(320, 150)">
      {/* Trenchcoat collar & shoulders */}
      <path d="M40 80 L10 190 L180 190 L140 80 Z" fill="#0f172a" stroke="#000" strokeWidth="3" />
      {/* High collar flaps */}
      <polygon points="40,80 65,40 80,75 55,90" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
      <polygon points="140,80 115,40 100,75 125,90" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
      {/* Noir Vigilante Cowl / Mask */}
      <path d="M65 30 Q90 10 115 30 L115 65 L65 65 Z" fill="#020617" stroke="#000" strokeWidth="2.5" />
      {/* Narrow Glowing White Eye Slits */}
      <polygon points="72,42 85,44 82,48 70,45" fill="#ffffff" filter="drop-shadow(0 0 5px #38bdf8)" />
      <polygon points="95,44 108,42 110,45 98,48" fill="#ffffff" filter="drop-shadow(0 0 5px #38bdf8)" />
      {/* Tension Wrench & Lockpick Tools clicking at the heavy brass lock */}
      <rect x="135" y="100" width="30" height="40" rx="4" fill="#ca8a04" stroke="#000" strokeWidth="2" />
      <circle cx="150" cy="115" r="4" fill="#000" />
      <line x1="100" y1="120" x2="150" y2="115" stroke="#94a3b8" strokeWidth="3" />
      <line x1="110" y1="135" x2="150" y2="120" stroke="#38bdf8" strokeWidth="2.5" />
      {/* Blue / Red dynamic comic rim light */}
      <path d="M38 80 L10 190" stroke="#3b82f6" strokeWidth="3" fill="none" />
      <path d="M142 80 L180 190" stroke="#ef4444" strokeWidth="3" fill="none" />
    </g>
  </svg>
);

const PoliceRooftopPursuitScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <rect width="800" height="480" fill="#040813" />
    {/* Searchlight Cones Crossing in Stormy Sky */}
    <polygon points="120,480 320,0 480,0 160,480" fill="rgba(255,255,255,0.22)" />
    <polygon points="680,480 480,0 320,0 640,480" fill="rgba(0,242,254,0.18)" />
    {/* Driving Rain */}
    <line x1="80" y1="20" x2="60" y2="120" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />
    <line x1="240" y1="40" x2="220" y2="160" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />
    <line x1="420" y1="30" x2="400" y2="180" stroke="#38bdf8" strokeWidth="2.5" opacity="0.8" />
    <line x1="600" y1="50" x2="580" y2="190" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />

    {/* Brick Rooftop Silhouettes */}
    <rect x="0" y="320" width="280" height="160" fill="#090d16" stroke="#1e293b" strokeWidth="2" />
    <rect x="480" y="340" width="320" height="140" fill="#090d16" stroke="#1e293b" strokeWidth="2" />

    {/* COMIC HERO: AGENT X MID-AIR ROOFTOP LEAP WITH BILLOWING TRENCHCOAT */}
    <g transform="translate(290, 160)">
      {/* Billowing Trenchcoat Flares */}
      <path d="M40 70 L-50 90 L-70 140 L10 110 Z" fill="#1e293b" stroke="#000" strokeWidth="2.5" />
      <path d="M30 80 L-60 130 L-30 160 L20 120 Z" fill="#0f172a" stroke="#000" strokeWidth="2.5" />
      {/* Athletic Leaping Body */}
      <path d="M40 40 Q70 20 100 35 Q110 70 85 95 Q50 90 40 40 Z" fill="#0f172a" stroke="#000" strokeWidth="3" />
      {/* Cowl with White Eye Slit */}
      <circle cx="100" cy="30" r="14" fill="#020617" stroke="#000" strokeWidth="2" />
      <polygon points="98,28 110,26 106,32 96,31" fill="#fff" filter="drop-shadow(0 0 6px #00f2fe)" />
      {/* Reaching hands reaching for the next rooftop */}
      <path d="M90 50 L145 65 L135 80 L80 65 Z" fill="#0f172a" stroke="#000" strokeWidth="2" />
      <path d="M70 90 L120 150 L100 165 L50 105 Z" fill="#0f172a" stroke="#000" strokeWidth="3" />
      {/* Comic Cyan Rim Light in Searchlight */}
      <path d="M100 16 Q120 30 114 45" stroke="#00f2fe" strokeWidth="3" fill="none" />
      <path d="M90 50 L145 65" stroke="#00f2fe" strokeWidth="2.5" fill="none" />
    </g>
  </svg>
);

// ============================================================================
// ❄️ THEME 5: ARCTIC GLACIER
// ============================================================================

const SnowIceClimbScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <rect width="800" height="480" fill="#050e1f" />
    {/* Aurora Borealis in Arctic Sky */}
    <path d="M0 120 Q200 40 400 90 T800 60" stroke="#00f2fe" strokeWidth="18" fill="none" opacity="0.35" filter="blur(12px)" />
    <path d="M0 150 Q200 80 400 120 T800 90" stroke="#10b981" strokeWidth="14" fill="none" opacity="0.3" filter="blur(10px)" />
    <circle cx="680" cy="85" r="42" fill="#f0f9ff" filter="drop-shadow(0 0 24px #38bdf8)" />

    {/* Glacier Wall */}
    <polygon points="120,160 0,480 320,480" fill="#0f294a" />
    <polygon points="120,160 80,230 160,230" fill="#bae6fd" />
    <polygon points="440,120 220,480 640,480" fill="#163963" />
    <polygon points="440,120 380,210 500,210" fill="#e0f2fe" />

    {/* COMIC HERO: ARCTIC RANGER CLIMBING GLACIER WITH TWIN ICE AXES */}
    <g transform="translate(360, 160)">
      {/* Heavy Hooded Thermal Parka */}
      <path d="M40 40 Q70 20 100 40 Q115 80 90 120 Q50 125 35 75 Z" fill="#0369a1" stroke="#000" strokeWidth="3" />
      {/* Orange Goggles Visor glowing */}
      <polygon points="65,45 95,48 90,62 62,58" fill="#f97316" stroke="#000" strokeWidth="1.5" />
      <polygon points="70,48 90,50 86,58 68,55" fill="#fef08a" />
      {/* Fur hood trim */}
      <circle cx="50" cy="45" r="8" fill="#e0f2fe" />
      <circle cx="105" cy="45" r="8" fill="#e0f2fe" />
      {/* Raised Arm Striking Ice Axe into Wall */}
      <path d="M85 55 L130 10 L145 20 L95 70 Z" fill="#0284c7" stroke="#000" strokeWidth="2.5" />
      {/* Titanium Ice Axe */}
      <line x1="130" y1="10" x2="160" y2="-20" stroke="#cbd5e1" strokeWidth="4" />
      <polygon points="150,-25 175,-20 160,-10" fill="#f8fafc" stroke="#000" strokeWidth="1" />
      {/* Crampon boots digging into ice shelf */}
      <path d="M50 115 L40 170 L60 175 L75 125 Z" fill="#0f172a" stroke="#000" strokeWidth="2.5" />
      <polygon points="35,170 25,180 50,178" fill="#cbd5e1" stroke="#000" strokeWidth="1" />
    </g>
  </svg>
);

const SnowBlizzardWolfScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <rect width="800" height="480" fill="#030914" />
    {/* Blizzard Wind Streaks */}
    <line x1="0" y1="80" x2="800" y2="120" stroke="#ffffff" strokeWidth="3" opacity="0.6" />
    <line x1="0" y1="180" x2="800" y2="230" stroke="#ffffff" strokeWidth="4" opacity="0.8" />
    <line x1="0" y1="290" x2="800" y2="330" stroke="#38bdf8" strokeWidth="3" opacity="0.5" />

    {/* Glowing Eyes of Blizzard Predator on Ridge */}
    <circle cx="580" cy="220" r="7" fill="#38bdf8" filter="drop-shadow(0 0 10px #38bdf8)" />
    <circle cx="615" cy="220" r="7" fill="#38bdf8" filter="drop-shadow(0 0 10px #38bdf8)" />
    {/* Wolf Fangs & Muzzle Silhouette */}
    <polygon points="570,240 625,240 597,265" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />

    {/* COMIC HERO: ARCTIC RANGER IGNITING RED MAGNESIUM FLARE IN BLIZZARD */}
    <g transform="translate(180, 160)">
      {/* Sputtering Red Flare Halo */}
      <circle cx="160" cy="70" r="45" fill="rgba(239, 68, 68, 0.4)" filter="blur(15px)" />
      <circle cx="160" cy="70" r="14" fill="#ef4444" filter="drop-shadow(0 0 12px #f87171)" />
      <circle cx="160" cy="70" r="5" fill="#ffffff" />
      {/* Flare Sparkles */}
      <polygon points="160,50 164,66 178,70 164,74 160,90 156,74 142,70 156,66" fill="#facc15" />

      {/* Hero holding flare forward */}
      <path d="M50 70 Q80 40 110 60 Q120 100 95 140 Q55 140 45 95 Z" fill="#0284c7" stroke="#000" strokeWidth="3" />
      <path d="M100 70 L155 70 L150 85 L95 85 Z" fill="#0369a1" stroke="#000" strokeWidth="2.5" />
      {/* Flare Stick in Hand */}
      <rect x="150" y="65" width="12" height="30" fill="#71717a" stroke="#000" strokeWidth="1.5" />
      {/* Orange Goggles Glowing Red from Flare */}
      <polygon points="75,60 105,62 100,74 72,72" fill="#ef4444" stroke="#000" strokeWidth="1.5" />
    </g>
  </svg>
);

// ============================================================================
// 🏙️ THEME 6: CYBERPUNK HIGH-TECH
// ============================================================================

const CyberRunnerGargoyleScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <rect width="800" height="480" fill="#050510" />
    {/* Holographic Ads & Neon Signs */}
    <rect x="80" y="80" width="120" height="60" fill="none" stroke="#00f2fe" strokeWidth="2" filter="drop-shadow(0 0 8px #00f2fe)" />
    <text x="140" y="115" textAnchor="middle" fill="#00f2fe" fontSize="14" fontFamily="monospace" fontWeight="bold">CYBER-CORP</text>
    <rect x="600" y="120" width="140" height="50" fill="none" stroke="#ff0055" strokeWidth="2" filter="drop-shadow(0 0 8px #ff0055)" />
    <text x="670" y="152" textAnchor="middle" fill="#ff0055" fontSize="14" fontFamily="monospace" fontWeight="bold">SYNTH-NET</text>

    {/* Flying Aerocar Streaks */}
    <line x1="0" y1="260" x2="800" y2="290" stroke="#facc15" strokeWidth="3" opacity="0.6" filter="blur(2px)" />
    <line x1="800" y1="310" x2="0" y2="340" stroke="#00f2fe" strokeWidth="3" opacity="0.6" filter="blur(2px)" />

    {/* High-Tech Gargoyle Ledge */}
    <polygon points="0,480 300,480 380,340 220,320 0,380" fill="#090d16" stroke="#00f2fe" strokeWidth="2" />

    {/* COMIC HERO: CYBER-RUNNER CROUCHED ON THE GARGOYLE */}
    <g transform="translate(240, 210)">
      {/* High-Collar Cyber Jacket */}
      <path d="M40 50 Q70 20 100 45 Q115 85 90 120 Q50 125 35 75 Z" fill="#0f172a" stroke="#000" strokeWidth="3" />
      {/* Cybernetic Arm with Glowing Circuit Lines */}
      <path d="M95 60 L140 100 L125 115 L80 75 Z" fill="#1e293b" stroke="#000" strokeWidth="2.5" />
      <line x1="95" y1="65" x2="135" y2="105" stroke="#00f2fe" strokeWidth="2" filter="drop-shadow(0 0 6px #00f2fe)" />
      {/* Cyan Holographic HUD Visor */}
      <polygon points="65,45 95,48 90,62 62,58" fill="#00f2fe" stroke="#000" strokeWidth="1.5" filter="drop-shadow(0 0 6px #00f2fe)" />
      <polygon points="70,48 90,50 86,58 68,55" fill="#ffffff" />
    </g>
  </svg>
);

const CyberDroneSkirmishScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <rect width="800" height="480" fill="#0a0518" />
    {/* Laser Pulse Blasts */}
    <line x1="120" y1="120" x2="380" y2="280" stroke="#ff0055" strokeWidth="4" filter="drop-shadow(0 0 10px #ff0055)" />
    <line x1="680" y1="100" x2="420" y2="280" stroke="#ff0055" strokeWidth="4" filter="drop-shadow(0 0 10px #ff0055)" />

    {/* Pursuit Drone Quadcopter */}
    <g transform="translate(100, 80)">
      <polygon points="20,20 60,10 80,30 50,45" fill="#1e1b4b" stroke="#ff0055" strokeWidth="2" />
      <circle cx="50" cy="25" r="8" fill="#ff0055" filter="drop-shadow(0 0 8px #ff0055)" />
    </g>
    <g transform="translate(620, 70)">
      <polygon points="20,20 60,10 80,30 50,45" fill="#1e1b4b" stroke="#ff0055" strokeWidth="2" />
      <circle cx="50" cy="25" r="8" fill="#ff0055" filter="drop-shadow(0 0 8px #ff0055)" />
    </g>

    {/* COMIC HERO: WALL-RUNNING CYBER-RUNNER DEPLOYING EMP PULSE */}
    <g transform="translate(340, 200)">
      <circle cx="80" cy="80" r="50" fill="rgba(0, 242, 254, 0.25)" filter="blur(12px)" />
      <path d="M30 40 Q60 15 95 35 Q105 70 80 95 Q45 95 30 40 Z" fill="#0f172a" stroke="#000" strokeWidth="3" />
      {/* EMP Glove firing */}
      <circle cx="120" cy="50" r="16" fill="#00f2fe" filter="drop-shadow(0 0 14px #00f2fe)" />
      <circle cx="120" cy="50" r="6" fill="#ffffff" />
    </g>
  </svg>
);

// ============================================================================
// 👻 THEME 7: HAUNTED GOTHIC CRYPT
// ============================================================================

const HauntedInvestigatorScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <rect width="800" height="480" fill="#0a0614" />
    {/* Gothic Candelabra Archways */}
    <path d="M100 480 L100 150 Q400 40 700 150 L700 480" stroke="#1f1435" strokeWidth="12" fill="none" />
    <circle cx="140" cy="180" r="8" fill="#eab308" filter="drop-shadow(0 0 10px #eab308)" />
    <circle cx="660" cy="180" r="8" fill="#eab308" filter="drop-shadow(0 0 10px #eab308)" />

    {/* Floating Spectral Eyes in Shadows */}
    <circle cx="280" cy="140" r="5" fill="#a855f7" filter="drop-shadow(0 0 8px #a855f7)" />
    <circle cx="310" cy="140" r="5" fill="#a855f7" filter="drop-shadow(0 0 8px #a855f7)" />

    {/* COMIC HERO: OCCULT INVESTIGATOR WITH GLOWING SPIRIT LANTERN */}
    <g transform="translate(340, 180)">
      {/* Victorian Trenchcoat */}
      <path d="M30 60 L10 190 L130 190 L110 60 Z" fill="#130d24" stroke="#000" strokeWidth="3" />
      {/* Glowing Spirit Lantern in Hand */}
      <line x1="100" y1="90" x2="135" y2="120" stroke="#6b21a8" strokeWidth="3" />
      <rect x="125" y="115" width="22" height="30" rx="3" fill="#3b0764" stroke="#e9d5ff" strokeWidth="2" />
      <circle cx="136" cy="130" r="8" fill="#c084fc" filter="drop-shadow(0 0 12px #c084fc)" />
      <circle cx="136" cy="130" r="3" fill="#ffffff" />
    </g>
  </svg>
);

const HauntedWraithEncounterScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <rect width="800" height="480" fill="#06020e" />
    {/* Looming Spectral Wraith Boss */}
    <g transform="translate(450, 70)">
      <path d="M60 40 Q130 10 180 60 Q210 160 160 260 Q100 240 60 210 Q20 130 60 40 Z" fill="rgba(88, 28, 135, 0.45)" filter="blur(10px)" />
      <circle cx="110" cy="90" r="12" fill="#e9d5ff" filter="drop-shadow(0 0 14px #c084fc)" />
      <circle cx="150" cy="90" r="12" fill="#e9d5ff" filter="drop-shadow(0 0 14px #c084fc)" />
    </g>

    {/* COMIC HERO: INVESTIGATOR DEPLOYING MYSTIC RUNE SHIELD */}
    <g transform="translate(180, 200)">
      <circle cx="140" cy="100" r="60" fill="none" stroke="#a855f7" strokeWidth="4" filter="drop-shadow(0 0 15px #c084fc)" />
      <polygon points="140,50 185,130 95,130" fill="none" stroke="#c084fc" strokeWidth="2" />
    </g>
  </svg>
);

// ============================================================================
// 🚀 THEME 8: ORBITAL SPACE STATION
// ============================================================================

const SpaceAirlockEVAClimbScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <rect width="800" height="480" fill="#02040a" />
    {/* Earth Curve & Cosmic Stars */}
    <path d="M0 380 Q400 240 800 380 L800 480 L0 480 Z" fill="#0369a1" filter="drop-shadow(0 0 25px #38bdf8)" />
    <circle cx="120" cy="80" r="1.5" fill="#fff" />
    <circle cx="340" cy="50" r="2" fill="#fff" />
    <circle cx="620" cy="100" r="1.5" fill="#fff" />

    {/* Starship Gantry Truss */}
    <line x1="180" y1="0" x2="180" y2="480" stroke="#334155" strokeWidth="8" />

    {/* COMIC HERO: ARMORED VOID OPERATIVE IN EVA COMBAT SUIT */}
    <g transform="translate(180, 150)">
      {/* Heavy EVA Helmet with Gold Reflective Visor */}
      <circle cx="80" cy="50" r="24" fill="#0f172a" stroke="#000" strokeWidth="3" />
      <ellipse cx="85" cy="50" rx="14" ry="10" fill="#facc15" filter="drop-shadow(0 0 8px #facc15)" />
      {/* Heavy Pressurized Suit */}
      <path d="M40 75 Q80 65 120 75 Q135 120 115 160 Q75 165 40 125 Z" fill="#f8fafc" stroke="#000" strokeWidth="3.5" />
      {/* Thruster Pack with Cyan Plasma Plume */}
      <rect x="25" y="80" width="15" height="40" rx="4" fill="#475569" stroke="#000" strokeWidth="2" />
      <polygon points="32,120 25,145 39,145" fill="#00f2fe" filter="drop-shadow(0 0 8px #00f2fe)" />
    </g>
  </svg>
);

const SpaceZeroGLaserScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <rect width="800" height="480" fill="#020308" />
    {/* Laser Turret Grid */}
    <line x1="800" y1="120" x2="300" y2="280" stroke="#ef4444" strokeWidth="3" filter="drop-shadow(0 0 10px #ef4444)" />
    <line x1="800" y1="360" x2="320" y2="260" stroke="#ef4444" strokeWidth="3" filter="drop-shadow(0 0 10px #ef4444)" />

    {/* COMIC HERO: ZERO-G VOID OPERATIVE DODGING DEFENSE TURRETS */}
    <g transform="translate(240, 200)">
      <circle cx="80" cy="60" r="22" fill="#0f172a" stroke="#000" strokeWidth="3" />
      <ellipse cx="85" cy="60" rx="12" ry="8" fill="#facc15" filter="drop-shadow(0 0 8px #facc15)" />
      {/* Thrusters firing emergency burst */}
      <circle cx="20" cy="70" r="14" fill="#00f2fe" filter="drop-shadow(0 0 12px #00f2fe)" />
      <circle cx="20" cy="70" r="5" fill="#ffffff" />
    </g>
  </svg>
);

// ============================================================================
// 🌙 DEFAULT / CITY / SPIDER-VERSE SCENES (From Reference Image)
// ============================================================================

const NightRooftopMoonScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <defs>
      <linearGradient id="cityNightSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#070a16" />
        <stop offset="45%" stopColor="#0d1b38" />
        <stop offset="100%" stopColor="#1a2e56" />
      </linearGradient>
      <radialGradient id="lunarCorona" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
        <stop offset="25%" stopColor="#e2e8f0" stopOpacity="0.9" />
        <stop offset="55%" stopColor="#93c5fd" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
      </radialGradient>
      <pattern id="cityWindows" width="12" height="18" patternUnits="userSpaceOnUse">
        <rect x="2" y="2" width="4" height="6" fill="#fef08a" opacity="0.65" />
        <rect x="8" y="2" width="3" height="6" fill="#67e8f9" opacity="0.5" />
      </pattern>
    </defs>

    <rect width="800" height="480" fill="url(#cityNightSky)" />

    {/* Moon with Glowing Atmospheric Halo (Center-Right as in screenshot) */}
    <circle cx="490" cy="95" r="85" fill="url(#lunarCorona)" />
    <circle cx="490" cy="95" r="32" fill="#f8fafc" />
    <ellipse cx="482" cy="90" rx="8" ry="6" fill="#cbd5e1" opacity="0.6" />
    <ellipse cx="502" cy="104" rx="10" ry="7" fill="#cbd5e1" opacity="0.5" />

    {/* Skyline Silhouettes */}
    <rect x="50" y="200" width="70" height="280" fill="#0c1322" />
    <rect x="140" y="160" width="85" height="320" fill="#080e1a" />
    <rect x="145" y="170" width="75" height="150" fill="url(#cityWindows)" />
    <rect x="620" y="180" width="90" height="300" fill="#070c17" />
    <rect x="630" y="195" width="70" height="120" fill="url(#cityWindows)" />

    {/* Foreground Rooftop Wall & Embracing Silhouettes */}
    <path d="M0 320 L800 300 L800 480 L0 480 Z" fill="#030712" />
    <path d="M0 320 L800 300" stroke="#3b82f6" strokeWidth="3" opacity="0.5" />

    {/* Two Silhouetted Operatives in Moonlight */}
    <g transform="translate(375, 140)">
      <circle cx="65" cy="80" r="22" fill="#090d16" />
      <path d="M45 75 Q40 60 55 55 Q70 50 85 58 Q95 70 85 85 Q65 75 45 75 Z" fill="#090d16" />
      <circle cx="95" cy="85" r="20" fill="#090d16" />
      <path
        d="M40 100 Q25 125 35 170 Q45 220 85 225 Q125 215 130 170 Q135 120 115 100 Q95 120 80 115 Q60 110 40 100 Z"
        fill="#050811"
      />
      {/* Tactical Stripe */}
      <path d="M100 135 L125 140 L120 155 L95 150 Z" fill="#e2e8f0" opacity="0.8" />
      {/* Lunar Rim Light */}
      <path d="M44 65 Q60 52 80 56" stroke="#93c5fd" strokeWidth="3" fill="none" opacity="0.9" />
      <path d="M30 120 Q32 150 40 180" stroke="#60a5fa" strokeWidth="2.5" fill="none" opacity="0.8" />
    </g>
  </svg>
);

const SkyscraperHighAngleScene: React.FC = () => (
  <svg viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <defs>
      <linearGradient id="chasmGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="50%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      <linearGradient id="streetCarGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.85" />
      </linearGradient>
    </defs>

    <rect width="800" height="520" fill="url(#chasmGrad)" />

    {/* Street Avenue Below */}
    <path d="M520 180 L760 180 L800 520 L580 520 Z" fill="#090d16" />
    <line x1="565" y1="200" x2="640" y2="520" stroke="url(#streetCarGlow)" strokeWidth="4" opacity="0.85" />
    <line x1="710" y1="200" x2="760" y2="520" stroke="#67e8f9" strokeWidth="3" opacity="0.75" />

    {/* Distant Leaping Operative with Motion Line */}
    <g transform="translate(585, 360) scale(0.65)">
      <line x1="-30" y1="-120" x2="30" y2="10" stroke="#f8fafc" strokeWidth="2.5" opacity="0.85" />
      <circle cx="28" cy="15" r="10" fill="#00f2fe" filter="drop-shadow(0 0 8px #00f2fe)" />
      <path d="M25 0 Q40 5 35 25 Q30 40 15 45 Q-5 40 -10 20 Z" fill="#dc2626" />
    </g>

    {/* FOREGROUND HERO CROUCHED ON SKYSCRAPER PARAPET */}
    <g transform="translate(140, 210)">
      <path d="M-140 180 L220 80 L320 220 L-140 310 Z" fill="#18181b" stroke="#27272a" strokeWidth="3" />
      <line x1="-140" y1="180" x2="220" y2="80" stroke="#38bdf8" strokeWidth="2" opacity="0.6" />

      {/* Hero Mask / Hood */}
      <path
        d="M220 10 Q260 25 285 70 Q305 120 280 155 Q250 165 200 135 Q180 100 190 50 Q200 20 220 10 Z"
        fill="#dc2626"
        stroke="#000"
        strokeWidth="2.5"
      />
      {/* Spider-Verse Angular White Lens */}
      <polygon points="245,45 280,55 272,75 240,65" fill="#ffffff" stroke="#000" strokeWidth="2" />

      {/* Hero Crouched Back & Shoulder Anatomy */}
      <path
        d="M100 15 Q160 5 210 25 Q190 90 170 140 Q130 180 70 170 Q30 150 10 100 Q40 40 100 15 Z"
        fill="#dc2626"
        stroke="#000"
        strokeWidth="2.5"
      />
      <path d="M30 60 Q90 50 140 70 L130 120 Q80 120 25 100 Z" fill="#1e3a8a" stroke="#000" strokeWidth="2" />

      {/* Arm & Tactical Red Glove Gripping Ledge */}
      <path d="M160 130 Q190 170 210 215 L190 240 Q160 200 135 150 Z" fill="#1e3a8a" stroke="#000" strokeWidth="2" />
      <path d="M190 200 Q225 210 240 245 Q235 285 190 300 Q165 290 160 255 Z" fill="#dc2626" stroke="#000" strokeWidth="2.5" />

      {/* Comic Dynamic Rim Lighting */}
      <path d="M220 10 Q265 30 285 75 Q305 120 280 155" stroke="#ef4444" strokeWidth="3.5" fill="none" />
      <path d="M100 15 Q165 8 215 28" stroke="#00f2fe" strokeWidth="3" fill="none" />
    </g>
  </svg>
);
