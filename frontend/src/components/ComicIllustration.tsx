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
        {/* Comic Halftone Dot Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(rgba(0,0,0,0.3) 1.5px, transparent 1.5px)',
            backgroundSize: '4px 4px',
            mixBlendMode: 'multiply',
          }}
        />
        {/* Speed Lines */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.03) 0px, transparent 2px, transparent 8px)',
          }}
        />
      </div>
    );
  }

  // Choose visual scene based on theme & panel index:
  // For panel 0: Rooftop night scene with moon (exact aesthetic from top panel of reference image)
  // For panel 1: High-angle skyscraper ledge looking down on the city (bottom panel of reference image)
  const isHospital = theme === 'hospital';
  const isRailway = theme === 'railway';
  const isBank = theme === 'bank';
  const isPolice = theme === 'police';
  const isSnow = theme === 'snow';

  if (isHospital) {
    if (panelIndex === 0) {
      return <HospitalCorridorScene />;
    } else if (panelIndex === 1) {
      return <HospitalQuarantineAlarmScene />;
    }
    return <HospitalEscapeVentScene />;
  }

  if (isRailway) {
    if (panelIndex === 0) {
      return <RailwayStationPlatformScene />;
    } else if (panelIndex === 1) {
      return <RailwayTrainSpeedScene />;
    }
    return <RailwayNightTracksScene />;
  }

  if (isBank) {
    if (panelIndex === 0) {
      return <BankVaultDoorScene />;
    }
    return <BankLaserGridScene />;
  }

  if (isPolice) {
    if (panelIndex === 0) {
      return <PolicePrecinctHoldingScene />;
    }
    return <CityRooftopRainScene />;
  }

  if (isSnow) {
    return <SnowGlacierSummitScene panelIndex={panelIndex} />;
  }

  // Default / City / Spider-Verse:
  // Panel 0: Night Rooftop with Moon (exact match to user's top panel!)
  // Panel 1: Skyscraper Corner Ledge High-Angle (exact match to user's bottom panel!)
  if (panelIndex === 0) {
    return <NightRooftopMoonScene />;
  }
  return <SkyscraperHighAngleScene />;
};

// ============================================================================
// 🌙 SCENE: Night Rooftop & Moon (Matches Top Panel of User Reference Image!)
// ============================================================================
const NightRooftopMoonScene: React.FC = () => (
  <svg
    viewBox="0 0 800 480"
    preserveAspectRatio="xMidYMid slice"
    style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
  >
    <defs>
      <linearGradient id="nightSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#070a16" />
        <stop offset="45%" stopColor="#0d1b38" />
        <stop offset="100%" stopColor="#1a2e56" />
      </linearGradient>
      <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
        <stop offset="25%" stopColor="#e2e8f0" stopOpacity="0.9" />
        <stop offset="50%" stopColor="#93c5fd" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="cloudGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#1e293b" stopOpacity="0" />
        <stop offset="50%" stopColor="#334155" stopOpacity="0.45" />
        <stop offset="100%" stopColor="#1e293b" stopOpacity="0" />
      </linearGradient>
      <pattern id="windowGrid" width="12" height="18" patternUnits="userSpaceOnUse">
        <rect x="2" y="2" width="4" height="6" fill="#fef08a" opacity="0.65" />
        <rect x="8" y="2" width="3" height="6" fill="#67e8f9" opacity="0.5" />
      </pattern>
    </defs>

    {/* Sky Background */}
    <rect width="800" height="480" fill="url(#nightSky)" />

    {/* Distant Stars */}
    <circle cx="90" cy="45" r="1.2" fill="#fff" opacity="0.8" />
    <circle cx="160" cy="85" r="0.8" fill="#fff" opacity="0.6" />
    <circle cx="280" cy="35" r="1.5" fill="#fff" opacity="0.9" />
    <circle cx="680" cy="65" r="1.2" fill="#fff" opacity="0.75" />
    <circle cx="740" cy="115" r="0.8" fill="#fff" opacity="0.6" />
    <circle cx="520" cy="40" r="1.0" fill="#fff" opacity="0.85" />

    {/* Big Luminous Moon with Halo (Center-Right as in screenshot) */}
    <circle cx="490" cy="95" r="85" fill="url(#moonGlow)" />
    <circle cx="490" cy="95" r="32" fill="#f8fafc" />
    {/* Moon Mare / Crater Texture */}
    <ellipse cx="482" cy="90" rx="8" ry="6" fill="#cbd5e1" opacity="0.6" />
    <ellipse cx="502" cy="104" rx="10" ry="7" fill="#cbd5e1" opacity="0.5" />
    <circle cx="492" cy="110" r="4" fill="#94a3b8" opacity="0.55" />

    {/* Soft Drifting Night Clouds */}
    <ellipse cx="430" cy="115" rx="140" ry="24" fill="url(#cloudGlow)" />
    <ellipse cx="560" cy="80" rx="110" ry="18" fill="url(#cloudGlow)" />
    <ellipse cx="320" cy="160" rx="180" ry="30" fill="url(#cloudGlow)" />

    {/* Distant Skyline Silhouettes */}
    <rect x="50" y="200" width="70" height="280" fill="#0c1322" />
    <rect x="140" y="160" width="85" height="320" fill="#080e1a" />
    <rect x="145" y="170" width="75" height="150" fill="url(#windowGrid)" />

    <rect x="250" y="220" width="60" height="260" fill="#0a1220" />
    <rect x="620" y="180" width="90" height="300" fill="#070c17" />
    <rect x="630" y="195" width="70" height="120" fill="url(#windowGrid)" />
    <rect x="730" y="230" width="80" height="250" fill="#0b1424" />

    {/* Midground Rooftop / Antenna Spire */}
    <line x1="182" y1="120" x2="182" y2="160" stroke="#00f2fe" strokeWidth="2" opacity="0.7" />
    <circle cx="182" cy="120" r="3" fill="#ef4444" />
    <line x1="665" y1="140" x2="665" y2="180" stroke="#ff0055" strokeWidth="1.5" opacity="0.6" />

    {/* Foreground Rooftop Wall / Parapet */}
    <path d="M0 320 L800 300 L800 480 L0 480 Z" fill="#030712" />
    <path d="M0 320 L800 300" stroke="#3b82f6" strokeWidth="3" opacity="0.5" />

    {/* Rooftop Silhouettes: Two Characters Embracing in Moonlight (Matches Reference Screenshot!) */}
    <g transform="translate(375, 140)">
      {/* Outer Moonlit Rim Glow */}
      <path
        d="M50 80 Q60 50 75 55 Q90 60 95 85 Q110 110 115 150 Q90 190 60 200 Q40 180 35 140 Q30 110 50 80 Z"
        fill="none"
        stroke="#93c5fd"
        strokeWidth="2.5"
        opacity="0.8"
      />
      {/* Character 1 Head & Messy Anime Hair */}
      <circle cx="65" cy="80" r="22" fill="#090d16" />
      <path d="M45 75 Q40 60 55 55 Q70 50 85 58 Q95 70 85 85 Q65 75 45 75 Z" fill="#090d16" />
      {/* Character 2 Head (Looking Inward) */}
      <circle cx="95" cy="85" r="20" fill="#090d16" />
      <path d="M85 70 Q105 60 115 75 Q120 90 110 100 Z" fill="#090d16" />

      {/* Characters Embracing Body Form */}
      <path
        d="M40 100 Q25 125 35 170 Q45 220 85 225 Q125 215 130 170 Q135 120 115 100 Q95 120 80 115 Q60 110 40 100 Z"
        fill="#050811"
      />
      {/* White Spider-Verse Jacket Shoulder Stripe */}
      <path d="M100 135 L125 140 L120 155 L95 150 Z" fill="#e2e8f0" opacity="0.8" />
      <path d="M102 155 L120 160 L115 172 L98 168 Z" fill="#e2e8f0" opacity="0.6" />

      {/* Dramatic Moonlight Rim Lighting along silhouettes */}
      <path d="M44 65 Q60 52 80 56" stroke="#93c5fd" strokeWidth="3" fill="none" opacity="0.9" />
      <path d="M30 120 Q32 150 40 180" stroke="#60a5fa" strokeWidth="2.5" fill="none" opacity="0.8" />
      <path d="M118 72 Q125 85 120 105" stroke="#93c5fd" strokeWidth="2.5" fill="none" opacity="0.9" />
    </g>

    {/* Ambient Comic Speed / Halftone lines */}
    <line x1="0" y1="440" x2="800" y2="440" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
  </svg>
);

// ============================================================================
// 🏙️ SCENE: High-Angle Skyscraper Edge (Matches Bottom Panel of Reference Image!)
// ============================================================================
const SkyscraperHighAngleScene: React.FC = () => (
  <svg
    viewBox="0 0 800 520"
    preserveAspectRatio="xMidYMid slice"
    style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}
  >
    <defs>
      <linearGradient id="cityDepth" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1e293b" />
        <stop offset="50%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
      <linearGradient id="streetGlow" x1="0%" y1="0%" x2="100%" y2="0%">
        <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#ef4444" stopOpacity="0.8" />
      </linearGradient>
      <pattern id="streetCars" width="20" height="40" patternUnits="userSpaceOnUse">
        <rect x="5" y="8" width="6" height="12" rx="2" fill="#ef4444" opacity="0.75" />
        <rect x="12" y="22" width="6" height="12" rx="2" fill="#fef08a" opacity="0.85" />
      </pattern>
      <linearGradient id="spideySuitRed" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#dc2626" />
        <stop offset="60%" stopColor="#991b1b" />
        <stop offset="100%" stopColor="#450a0a" />
      </linearGradient>
      <linearGradient id="spideySuitBlue" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#1e3a8a" />
        <stop offset="70%" stopColor="#0f172a" />
        <stop offset="100%" stopColor="#020617" />
      </linearGradient>
    </defs>

    {/* Background High-Angle City Grid */}
    <rect width="800" height="520" fill="url(#cityDepth)" />

    {/* Deep Street Chasm & Avenue Below (Converging in perspective) */}
    <path d="M520 180 L760 180 L800 520 L580 520 Z" fill="#090d16" />
    {/* Street Lights & Car Trails in the Canyon Below */}
    <path d="M550 200 L730 200 L780 520 L610 520 Z" fill="url(#streetCars)" />
    <line x1="565" y1="200" x2="640" y2="520" stroke="url(#streetGlow)" strokeWidth="4" opacity="0.8" />
    <line x1="710" y1="200" x2="760" y2="520" stroke="#67e8f9" strokeWidth="3" opacity="0.7" />

    {/* Flanking Skyscraper Walls (High-angle perspective drop) */}
    <path d="M460 0 L530 0 L580 520 L400 520 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />
    <path d="M720 0 L800 0 L800 520 L760 520 Z" fill="#0f172a" stroke="#1e293b" strokeWidth="2" />

    {/* Distant Web-Slinger Figure Swinging in Mid-Air Between Buildings */}
    <g transform="translate(585, 360) scale(0.65)">
      {/* White Web Line */}
      <line x1="-30" y1="-120" x2="30" y2="10" stroke="#f8fafc" strokeWidth="2" opacity="0.85" />
      {/* Swinging Hero Silhouette */}
      <path
        d="M25 0 Q40 5 35 25 Q30 40 15 45 Q-5 40 -10 20 Q-15 -5 10 -10 Z"
        fill="#dc2626"
      />
      <circle cx="28" cy="15" r="8" fill="#1e3a8a" />
      {/* Extended Leg */}
      <path d="M35 25 L65 45 L58 55 L28 35 Z" fill="#1e3a8a" />
      <path d="M15 45 L-10 65 L-18 55 L8 35 Z" fill="#dc2626" />
      {/* Cyan Rim Glow */}
      <path d="M25 0 Q45 10 38 35" stroke="#00f2fe" strokeWidth="2" fill="none" />
    </g>

    {/* FOREGROUND: Spider-Man / Hero Crouched on High-Rise Cornice Ledge */}
    {/* Looking down over the city - Matches Reference Bottom Panel EXACTLY! */}
    <g transform="translate(140, 210)">
      {/* Concrete Roof Ledge Structure */}
      <path d="M-140 180 L220 80 L320 220 L-140 310 Z" fill="#18181b" stroke="#27272a" strokeWidth="3" />
      <line x1="-140" y1="180" x2="220" y2="80" stroke="#38bdf8" strokeWidth="2" opacity="0.6" />

      {/* Hero Crouched Back & Shoulders (Foreground High Detail) */}
      {/* Red Mask with Webbing Pattern */}
      <path
        d="M220 10 Q260 25 285 70 Q305 120 280 155 Q250 165 200 135 Q180 100 190 50 Q200 20 220 10 Z"
        fill="url(#spideySuitRed)"
        stroke="#000"
        strokeWidth="2"
      />
      {/* Mask Webbing Lines */}
      <path d="M220 15 Q260 50 280 100" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.75" />
      <path d="M205 35 Q245 75 270 120" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.75" />
      <path d="M195 70 Q230 95 260 140" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.75" />
      <path d="M210 10 Q215 70 230 140" stroke="#000" strokeWidth="1.5" fill="none" opacity="0.75" />

      {/* Dramatic Crouched Back / Spine Anatomy */}
      <path
        d="M100 15 Q160 5 210 25 Q190 90 170 140 Q130 180 70 170 Q30 150 10 100 Q40 40 100 15 Z"
        fill="url(#spideySuitRed)"
        stroke="#000"
        strokeWidth="2"
      />
      {/* Dark Navy Blue Side Panels */}
      <path
        d="M30 60 Q90 50 140 70 L130 120 Q80 120 25 100 Z"
        fill="url(#spideySuitBlue)"
        stroke="#000"
        strokeWidth="1.5"
      />
      <path
        d="M70 110 Q120 110 160 130 L150 160 Q100 155 55 140 Z"
        fill="url(#spideySuitBlue)"
        stroke="#000"
        strokeWidth="1.5"
      />

      {/* Massive Crouched Leg with Armored Thigh / Calf Pad */}
      <path
        d="M-50 120 Q30 90 90 140 L140 220 Q80 270 -20 260 Q-80 230 -80 170 Q-70 135 -50 120 Z"
        fill="url(#spideySuitBlue)"
        stroke="#000"
        strokeWidth="2.5"
      />
      {/* Textured Boot / Calf Straps */}
      <path d="M0 160 L40 150 L55 190 L10 200 Z" fill="#334155" stroke="#000" strokeWidth="1.5" />
      <path d="M30 190 L70 180 L85 220 L40 230 Z" fill="#334155" stroke="#000" strokeWidth="1.5" />
      <path d="M-40 200 L-10 250 L-45 280 L-75 230 Z" fill="url(#spideySuitRed)" stroke="#000" strokeWidth="2" />

      {/* Forearm & Red Webbed Glove Gripping the Concrete Ledge */}
      <path
        d="M160 130 Q190 170 210 215 L190 240 Q160 200 135 150 Z"
        fill="url(#spideySuitBlue)"
        stroke="#000"
        strokeWidth="2"
      />
      {/* Red Gauntlet Glove */}
      <path
        d="M190 200 Q225 210 240 245 Q235 285 190 300 Q165 290 160 255 Q165 220 190 200 Z"
        fill="url(#spideySuitRed)"
        stroke="#000"
        strokeWidth="2"
      />
      {/* Distinct Red Spidey Fingers Gripping Surface */}
      <path d="M190 260 L230 275 L225 290 L185 275 Z" fill="#b91c1c" stroke="#000" strokeWidth="1" />
      <path d="M180 275 L215 295 L208 308 L175 288 Z" fill="#991b1b" stroke="#000" strokeWidth="1" />

      {/* Spider-Verse Dynamic Red & Blue Rim Light Glow */}
      <path d="M220 10 Q265 30 285 75 Q305 120 280 155" stroke="#ef4444" strokeWidth="3.5" fill="none" opacity="0.9" />
      <path d="M100 15 Q165 8 215 28" stroke="#00f2fe" strokeWidth="2.5" fill="none" opacity="0.75" />
    </g>

    {/* Cinematic Edge Vignette */}
    <rect width="800" height="520" fill="none" stroke="rgba(0,0,0,0.5)" strokeWidth="16" />
  </svg>
);

// ============================================================================
// 🏥 SCENE: Hospital Corridor & Medical Bio-Wing
// ============================================================================
const HospitalCorridorScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <defs>
      <linearGradient id="hospCeiling" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#04121e" />
        <stop offset="100%" stopColor="#08283e" />
      </linearGradient>
      <linearGradient id="hospFloor" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#072b42" />
        <stop offset="100%" stopColor="#020d17" />
      </linearGradient>
      <radialGradient id="surgLampGlow" cx="50%" cy="0%" r="90%">
        <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7" />
        <stop offset="60%" stopColor="#0284c7" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Corridor Ceiling & Floor Perspective */}
    <rect width="800" height="240" fill="url(#hospCeiling)" />
    <rect y="240" width="800" height="240" fill="url(#hospFloor)" />

    {/* Corridors Converging in Perspective to Restricted Lab Door */}
    <path d="M0 0 L320 200 L320 280 L0 480 Z" fill="#0b2233" stroke="#00f2fe" strokeWidth="1" />
    <path d="M800 0 L480 200 L480 280 L800 480 Z" fill="#0b2233" stroke="#00f2fe" strokeWidth="1" />

    {/* Far Blast Door / Triage Entrance */}
    <rect x="320" y="200" width="160" height="80" fill="#040e16" stroke="#38bdf8" strokeWidth="2" />
    <line x1="400" y1="200" x2="400" y2="280" stroke="#38bdf8" strokeWidth="1.5" />
    {/* Hazard Caution Stripes on Door */}
    <rect x="325" y="270" width="150" height="8" fill="#facc15" />
    <line x1="335" y1="270" x2="345" y2="278" stroke="#000" strokeWidth="2" />
    <line x1="355" y1="270" x2="365" y2="278" stroke="#000" strokeWidth="2" />
    <line x1="375" y1="270" x2="385" y2="278" stroke="#000" strokeWidth="2" />
    <line x1="395" y1="270" x2="405" y2="278" stroke="#000" strokeWidth="2" />
    <line x1="415" y1="270" x2="425" y2="278" stroke="#000" strokeWidth="2" />
    <line x1="435" y1="270" x2="445" y2="278" stroke="#000" strokeWidth="2" />

    {/* Overhead Surgical Spotlights */}
    <ellipse cx="400" cy="40" rx="140" ry="20" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
    <path d="M260 40 L180 480 L620 480 L540 40 Z" fill="url(#surgLampGlow)" />

    {/* Glowing Oscilloscope ECG Heartbeat Wave Monitor (Left Wall) */}
    <rect x="60" y="160" width="160" height="90" rx="6" fill="#020911" stroke="#00f2fe" strokeWidth="2" />
    <text x="75" y="180" fill="#38bdf8" fontSize="10" fontFamily="monospace" fontWeight="bold">HEART VITALS // 128 BPM</text>
    {/* Oscilloscope ECG Wave */}
    <path
      d="M70 215 L105 215 L112 205 L118 225 L125 185 L132 235 L138 215 L170 215 L176 195 L182 225 L190 215 L210 215"
      fill="none"
      stroke="#22c55e"
      strokeWidth="2.5"
    />

    {/* Operative Silhouette in Lab Scrubs sneaking through */}
    <g transform="translate(420, 240) scale(0.7)">
      <circle cx="50" cy="50" r="18" fill="#030712" />
      <path d="M35 70 L65 70 L80 180 L20 180 Z" fill="#030712" stroke="#38bdf8" strokeWidth="1.5" />
      <path d="M40 70 L30 120 L15 115" stroke="#38bdf8" strokeWidth="3" fill="none" />
    </g>
  </svg>
);

const HospitalQuarantineAlarmScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <defs>
      <linearGradient id="redAlarm" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#450a0a" />
        <stop offset="50%" stopColor="#1c0404" />
        <stop offset="100%" stopColor="#050101" />
      </linearGradient>
      <radialGradient id="redBeaconCone" cx="50%" cy="0%" r="90%">
        <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
        <stop offset="50%" stopColor="#b91c1c" stopOpacity="0.35" />
        <stop offset="100%" stopColor="#000000" stopOpacity="0" />
      </radialGradient>
    </defs>

    <rect width="800" height="480" fill="url(#redAlarm)" />
    {/* Red Alert Sirens Glare */}
    <circle cx="200" cy="30" r="15" fill="#ef4444" />
    <path d="M200 30 L60 480 L340 480 Z" fill="url(#redBeaconCone)" />

    <circle cx="600" cy="30" r="15" fill="#ef4444" />
    <path d="M600 30 L460 480 L740 480 Z" fill="url(#redBeaconCone)" />

    {/* Bio-Quarantine Lockdown Blast Doors Slamming Shut */}
    <rect x="80" y="80" width="300" height="340" fill="#18181b" stroke="#dc2626" strokeWidth="3" />
    <rect x="420" y="80" width="300" height="340" fill="#18181b" stroke="#dc2626" strokeWidth="3" />

    {/* Hydraulic Pistons */}
    <rect x="60" y="140" width="60" height="24" fill="#52525b" stroke="#000" strokeWidth="2" />
    <rect x="680" y="140" width="60" height="24" fill="#52525b" stroke="#000" strokeWidth="2" />
    <rect x="60" y="320" width="60" height="24" fill="#52525b" stroke="#000" strokeWidth="2" />
    <rect x="680" y="320" width="60" height="24" fill="#52525b" stroke="#000" strokeWidth="2" />

    {/* Biohazard Symbol in Center */}
    <circle cx="400" cy="250" r="50" fill="none" stroke="#ef4444" strokeWidth="4" />
    <text x="400" y="258" textAnchor="middle" fill="#ef4444" fontSize="26" fontWeight="bold" fontFamily="sans-serif">☣</text>
    <text x="400" y="340" textAnchor="middle" fill="#fca5a5" fontSize="16" fontWeight="bold" letterSpacing="3" fontFamily="monospace">BIO-QUARANTINE SEALED</text>
  </svg>
);

const HospitalEscapeVentScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <rect width="800" height="480" fill="#030712" />
    {/* High Ventilation Shaft Perspective */}
    <path d="M0 0 L250 140 L250 340 L0 480 Z" fill="#0f172a" stroke="#0284c7" strokeWidth="2" />
    <path d="M800 0 L550 140 L550 340 L800 480 Z" fill="#0f172a" stroke="#0284c7" strokeWidth="2" />
    <rect x="250" y="140" width="300" height="200" fill="#000" stroke="#38bdf8" strokeWidth="3" />

    {/* Giant Industrial Ventilation Fan Spinning */}
    <circle cx="400" cy="240" r="85" fill="#0284c7" opacity="0.3" />
    <path d="M400 240 L340 180 L365 160 Z" fill="#38bdf8" opacity="0.8" />
    <path d="M400 240 L460 180 L485 205 Z" fill="#38bdf8" opacity="0.8" />
    <path d="M400 240 L460 300 L435 320 Z" fill="#38bdf8" opacity="0.8" />
    <path d="M400 240 L340 300 L315 275 Z" fill="#38bdf8" opacity="0.8" />
    <circle cx="400" cy="240" r="25" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />

    {/* Hero Leaping Forward into the Shaft */}
    <g transform="translate(370, 200)">
      <circle cx="30" cy="30" r="16" fill="#00f2fe" />
      <path d="M10 45 L50 45 L65 110 L-5 110 Z" fill="#0284c7" />
    </g>
  </svg>
);

// ============================================================================
// 🚆 SCENE: Grand Central Railway Station
// ============================================================================
const RailwayStationPlatformScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <defs>
      <linearGradient id="railSky" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#0c1220" />
        <stop offset="100%" stopColor="#1e293b" />
      </linearGradient>
    </defs>
    <rect width="800" height="480" fill="url(#railSky)" />

    {/* Vaulted Iron Arches Station Roof */}
    <path d="M0 120 Q400 20 800 120" stroke="#475569" strokeWidth="8" fill="none" />
    <path d="M0 170 Q400 70 800 170" stroke="#334155" strokeWidth="6" fill="none" />

    {/* Suspended Station Clock */}
    <circle cx="400" cy="110" r="32" fill="#f8fafc" stroke="#000" strokeWidth="4" />
    <line x1="400" y1="110" x2="400" y2="88" stroke="#000" strokeWidth="3" />
    <line x1="400" y1="110" x2="420" y2="110" stroke="#000" strokeWidth="3" />

    {/* Platform & Converging Rail Tracks */}
    <path d="M300 280 L500 280 L700 480 L100 480 Z" fill="#090d16" />
    {/* Converging Steel Rails */}
    <line x1="370" y1="280" x2="260" y2="480" stroke="#94a3b8" strokeWidth="4" />
    <line x1="430" y1="280" x2="540" y2="480" stroke="#94a3b8" strokeWidth="4" />
    {/* Rail Ties */}
    <line x1="360" y1="300" x2="440" y2="300" stroke="#475569" strokeWidth="3" />
    <line x1="345" y1="330" x2="455" y2="330" stroke="#475569" strokeWidth="4" />
    <line x1="320" y1="370" x2="480" y2="370" stroke="#475569" strokeWidth="5" />
    <line x1="290" y1="420" x2="510" y2="420" stroke="#475569" strokeWidth="6" />

    {/* High-Speed Metro Locomotive with Blazing Amber Headlights */}
    <rect x="360" y="210" width="80" height="70" rx="10" fill="#0f172a" stroke="#f59e0b" strokeWidth="3" />
    <circle cx="380" cy="260" r="8" fill="#fbbf24" filter="drop-shadow(0 0 10px #f59e0b)" />
    <circle cx="420" cy="260" r="8" fill="#fbbf24" filter="drop-shadow(0 0 10px #f59e0b)" />
  </svg>
);

const RailwayTrainSpeedScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <rect width="800" height="480" fill="#180b02" />
    {/* High-Speed Orange/Amber Motion Streaks */}
    <line x1="0" y1="120" x2="800" y2="120" stroke="#f97316" strokeWidth="6" opacity="0.7" />
    <line x1="0" y1="160" x2="800" y2="160" stroke="#fbbf24" strokeWidth="4" opacity="0.8" />
    <line x1="0" y1="280" x2="800" y2="280" stroke="#f97316" strokeWidth="8" opacity="0.9" />
    <line x1="0" y1="340" x2="800" y2="340" stroke="#ef4444" strokeWidth="5" opacity="0.6" />
    {/* Derailer Sparks */}
    <circle cx="400" cy="280" r="40" fill="#facc15" opacity="0.8" />
    <text x="400" y="295" textAnchor="middle" fill="#000" fontSize="32" fontWeight="bold">💥</text>
  </svg>
);

const RailwayNightTracksScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <rect width="800" height="480" fill="#050a14" />
    {/* Electrified Third Rail Glowing Cyan */}
    <line x1="120" y1="480" x2="380" y2="200" stroke="#00f2fe" strokeWidth="6" filter="drop-shadow(0 0 12px #00f2fe)" />
    <line x1="680" y1="480" x2="420" y2="200" stroke="#00f2fe" strokeWidth="6" filter="drop-shadow(0 0 12px #00f2fe)" />
  </svg>
);

// ============================================================================
// 🏦 SCENE: Bank Vault Heist
// ============================================================================
const BankVaultDoorScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <rect width="800" height="480" fill="#0b1324" />
    {/* Circular Titanium Vault Door with Spoke Wheel */}
    <circle cx="400" cy="240" r="160" fill="#1e293b" stroke="#ffd700" strokeWidth="6" />
    <circle cx="400" cy="240" r="130" fill="#0f172a" stroke="#475569" strokeWidth="4" />
    {/* Locking Bolts radiating outward */}
    <line x1="400" y1="80" x2="400" y2="110" stroke="#ffd700" strokeWidth="8" />
    <line x1="400" y1="400" x2="400" y2="370" stroke="#ffd700" strokeWidth="8" />
    <line x1="240" y1="240" x2="270" y2="240" stroke="#ffd700" strokeWidth="8" />
    <line x1="560" y1="240" x2="530" y2="240" stroke="#ffd700" strokeWidth="8" />
    {/* Center Turn Wheel */}
    <circle cx="400" cy="240" r="40" fill="#334155" stroke="#f1f5f9" strokeWidth="4" />
    <line x1="360" y1="240" x2="440" y2="240" stroke="#f1f5f9" strokeWidth="6" />
    <line x1="400" y1="200" x2="400" y2="280" stroke="#f1f5f9" strokeWidth="6" />
    {/* Gold Bullion Pallets in Forefront */}
    <rect x="120" y="360" width="90" height="40" rx="4" fill="#eab308" stroke="#fef08a" strokeWidth="2" />
    <rect x="590" y="360" width="90" height="40" rx="4" fill="#eab308" stroke="#fef08a" strokeWidth="2" />
  </svg>
);

const BankLaserGridScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <rect width="800" height="480" fill="#050a12" />
    {/* Red Security Laser Grid */}
    <line x1="0" y1="120" x2="800" y2="360" stroke="#ff0055" strokeWidth="3" filter="drop-shadow(0 0 8px #ff0055)" />
    <line x1="0" y1="360" x2="800" y2="120" stroke="#ff0055" strokeWidth="3" filter="drop-shadow(0 0 8px #ff0055)" />
    <line x1="400" y1="0" x2="400" y2="480" stroke="#ff0055" strokeWidth="2" />
    <line x1="0" y1="240" x2="800" y2="240" stroke="#ff0055" strokeWidth="2" />
  </svg>
);

// ============================================================================
// 🚨 SCENE: Police Precinct & Rain Rooftop
// ============================================================================
const PolicePrecinctHoldingScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <rect width="800" height="480" fill="#070c18" />
    {/* Alternating Red and Blue Siren Glare */}
    <rect x="0" y="0" width="400" height="480" fill="#1e3a8a" opacity="0.3" />
    <rect x="400" y="0" width="400" height="480" fill="#991b1b" opacity="0.3" />
    {/* Heavy Iron Holding Cell Bars */}
    <line x1="120" y1="0" x2="120" y2="480" stroke="#000" strokeWidth="12" />
    <line x1="240" y1="0" x2="240" y2="480" stroke="#000" strokeWidth="12" />
    <line x1="360" y1="0" x2="360" y2="480" stroke="#000" strokeWidth="12" />
    <line x1="480" y1="0" x2="480" y2="480" stroke="#000" strokeWidth="12" />
    <line x1="600" y1="0" x2="600" y2="480" stroke="#000" strokeWidth="12" />
    <line x1="720" y1="0" x2="720" y2="480" stroke="#000" strokeWidth="12" />
  </svg>
);

const CityRooftopRainScene: React.FC = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <rect width="800" height="480" fill="#080f1d" />
    {/* Rain Streaks */}
    <line x1="100" y1="20" x2="80" y2="120" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
    <line x1="280" y1="40" x2="260" y2="160" stroke="#38bdf8" strokeWidth="1.5" opacity="0.5" />
    <line x1="460" y1="30" x2="440" y2="180" stroke="#38bdf8" strokeWidth="2" opacity="0.7" />
    <line x1="640" y1="50" x2="620" y2="190" stroke="#38bdf8" strokeWidth="1.5" opacity="0.6" />
  </svg>
);

// ============================================================================
// ❄️ SCENE: Snowy Glacier Summit
// ============================================================================
const SnowGlacierSummitScene: React.FC<{ panelIndex: number }> = () => (
  <svg viewBox="0 0 800 480" preserveAspectRatio="xMidYMid slice" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
    <rect width="800" height="480" fill="#061224" />
    <circle cx="680" cy="90" r="40" fill="#e0f2fe" filter="drop-shadow(0 0 20px #38bdf8)" />
    {/* Jagged Mountain Peaks */}
    <polygon points="120,180 0,480 320,480" fill="#0f294a" />
    <polygon points="120,180 80,240 160,240" fill="#bae6fd" />
    <polygon points="420,130 200,480 620,480" fill="#163963" />
    <polygon points="420,130 360,220 480,220" fill="#e0f2fe" />
    <polygon points="680,200 520,480 800,480" fill="#0f294a" />
  </svg>
);
