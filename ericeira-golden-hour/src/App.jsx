import { useState, useEffect, useRef, useCallback, useMemo } from "react";

// ============================================================
// ERICEIRA GOLDEN HOUR — Production App
// Real venues, real sun math, real coastal geography
// ============================================================

// Ericeira center coordinates
const ERICEIRA_LAT = 38.9629;
const ERICEIRA_LNG = -9.4155;

// ============================================================
// REAL VENUE DATA — researched locations in Ericeira
// ============================================================
const VENUES = [
  // Cliff-top / Ocean-facing bars
  {
    id: 1, name: "Mar das Latas", type: "Wine Bar", zone: "Old Town Cliffs",
    lat: 38.96285, lng: -9.41720,
    facing: 250, elevated: true, elevation: 30,
    description: "Cliff-edge wine bar with custom box-trays on the wall. The sunset spot.",
    tags: ["sunset", "wine", "cliffs"],
  },
  {
    id: 2, name: "Ouriço Terrace", type: "Bar & Club", zone: "Praia dos Pescadores",
    lat: 38.96350, lng: -9.41680,
    facing: 270, elevated: true, elevation: 25,
    description: "Portugal's oldest nightclub with ocean-view terrace above Praia dos Pescadores.",
    tags: ["nightlife", "terrace", "ocean view"],
  },
  {
    id: 3, name: "Balagan", type: "Restaurant & Rooftop", zone: "Praia do Sul",
    lat: 38.96100, lng: -9.41550,
    facing: 260, elevated: true, elevation: 20,
    description: "Middle Eastern rooftop overlooking Praia do Sul. Best panoramic ocean view.",
    tags: ["rooftop", "food", "sunset", "coworking"],
  },
  {
    id: 4, name: "Sebastião Bar", type: "Beach Bar", zone: "Praia de São Sebastião",
    lat: 38.96520, lng: -9.41750,
    facing: 280, elevated: false, elevation: 8,
    description: "Sea-view drinks on the cliff walk near Praia de São Sebastião.",
    tags: ["casual", "ocean view", "beer"],
  },
  // Town center bars
  {
    id: 5, name: "Jukebox Taproom", type: "Cocktail Bar", zone: "Centro",
    lat: 38.96270, lng: -9.41490,
    facing: 220, elevated: false, elevation: 35,
    description: "Industrial-chic taproom. Great cocktails, outdoor people-watching.",
    tags: ["cocktails", "indoor", "evening"],
  },
  {
    id: 6, name: "Tubo Bar", type: "Bar", zone: "Rua da Misericórdia",
    lat: 38.96240, lng: -9.41530,
    facing: 200, elevated: false, elevation: 32,
    description: "Tiny but iconic. The crowd spills into the street — that's where the fun is.",
    tags: ["nightlife", "local", "street"],
  },
  {
    id: 7, name: "Adega Bar 1987", type: "Bar", zone: "Old Town",
    lat: 38.96310, lng: -9.41500,
    facing: 230, elevated: false, elevation: 34,
    description: "Affordable drinks in a tight space. Locals' favorite since 1987.",
    tags: ["local", "cheap", "nightlife"],
  },
  {
    id: 8, name: "5 e Meio TapRoom", type: "Craft Beer", zone: "Centro",
    lat: 38.96200, lng: -9.41460,
    facing: 210, elevated: false, elevation: 36,
    description: "Local craft brewery taproom with tapas and outdoor tables.",
    tags: ["craft beer", "tapas", "casual"],
  },
  // Beach-adjacent spots
  {
    id: 9, name: "Ti Matilde", type: "Seafood Restaurant", zone: "Praia do Norte",
    lat: 38.96430, lng: -9.41730,
    facing: 270, elevated: true, elevation: 22,
    description: "Fresh grilled fish on the cliffs. Request an outdoor table for sunset.",
    tags: ["seafood", "sunset", "traditional"],
  },
  {
    id: 10, name: "Prédio Rooftop", type: "Sushi & Rooftop", zone: "Centro",
    lat: 38.96260, lng: -9.41510,
    facing: 240, elevated: true, elevation: 38,
    description: "Rooftop patio with city views. Best sushi in town.",
    tags: ["rooftop", "sushi", "views"],
  },
  {
    id: 11, name: "Pedra Dura", type: "Restaurant", zone: "Centro",
    lat: 38.96230, lng: -9.41470,
    facing: 200, elevated: false, elevation: 33,
    description: "Reliable Portuguese classics with large patio seating.",
    tags: ["portuguese", "patio", "family"],
  },
  {
    id: 12, name: "Tik Tapas", type: "Tapas Bar", zone: "Centro",
    lat: 38.96290, lng: -9.41440,
    facing: 190, elevated: false, elevation: 35,
    description: "Heated outdoor terrace. Round after round of Portuguese small plates.",
    tags: ["tapas", "terrace", "evening"],
  },
  {
    id: 13, name: "Ribeira d'Ilhas Bar", type: "Beach Bar", zone: "Ribeira d'Ilhas",
    lat: 38.97530, lng: -9.42000,
    facing: 290, elevated: false, elevation: 5,
    description: "Beanbags on a vast wooden deck at the famous surf beach. Piña coladas.",
    tags: ["surf", "beach", "casual"],
  },
  {
    id: 14, name: "Uni Sushi", type: "Sushi Restaurant", zone: "Largo dos Condes",
    lat: 38.96320, lng: -9.41460,
    facing: 220, elevated: false, elevation: 34,
    description: "Modern sushi using local catch. Sheltered outdoor terrace.",
    tags: ["sushi", "terrace", "quality"],
  },
  {
    id: 15, name: "Barzinho", type: "Bar", zone: "Centro",
    lat: 38.96250, lng: -9.41420,
    facing: 210, elevated: false, elevation: 35,
    description: "Local favourite with pool tables, darts, and a big outdoor terrace.",
    tags: ["games", "terrace", "local"],
  },
  {
    id: 16, name: "La Popular Taberna", type: "Wine & Tapas", zone: "Rua da Misericórdia",
    lat: 38.96255, lng: -9.41560,
    facing: 230, elevated: false, elevation: 30,
    description: "Tapas and local wines in the heart of the restaurant quarter.",
    tags: ["wine", "tapas", "cozy"],
  },
  {
    id: 17, name: "Ippolito & Maciste", type: "Wine Bar", zone: "Rua do Mercado",
    lat: 38.96300, lng: -9.41480,
    facing: 200, elevated: false, elevation: 34,
    description: "Charming wine bar capturing Portuguese hospitality at its finest.",
    tags: ["wine", "portuguese", "intimate"],
  },
  {
    id: 18, name: "Tasquinha do Joy", type: "Restaurant", zone: "Old Town",
    lat: 38.96340, lng: -9.41570,
    facing: 260, elevated: false, elevation: 28,
    description: "Red-checked tablecloths, terracotta dishes, generous portions. Sunset pavement tables.",
    tags: ["traditional", "sunset", "value"],
  },
  {
    id: 19, name: "Gota d'Álcool", type: "Beach Bar", zone: "Praia de São Julião",
    lat: 38.95400, lng: -9.41800,
    facing: 280, elevated: false, elevation: 6,
    description: "No-frills beach bar at the rugged southern coastline. Cold beer, great burgers.",
    tags: ["beach", "casual", "burgers"],
  },
  {
    id: 20, name: "Tabuas Algodio Beach Bar", type: "Beach Bar", zone: "Praia do Norte",
    lat: 38.96470, lng: -9.41760,
    facing: 280, elevated: false, elevation: 5,
    description: "Seaside escape right on the beach with Atlantic views.",
    tags: ["beach", "casual", "views"],
  },
  {
    id: 21, name: "7Janelas Brewery", type: "Brewpub", zone: "Centro",
    lat: 38.96210, lng: -9.41430,
    facing: 195, elevated: false, elevation: 36,
    description: "Craft brewery with Portuguese classics, amazing steaks, cozy indoor-outdoor seating.",
    tags: ["brewery", "food", "cozy"],
  },
  {
    id: 22, name: "Hemingway's Bar", type: "Cocktail Bar", zone: "Old Town",
    lat: 38.96275, lng: -9.41545,
    facing: 230, elevated: false, elevation: 32,
    description: "Low-lit cocktail institution. Metal tables on the street for warm evenings.",
    tags: ["cocktails", "intimate", "classic"],
  },
  {
    id: 23, name: "Casa da Fernanda", type: "Café & Bakery", zone: "Praia dos Pescadores",
    lat: 38.96370, lng: -9.41660,
    facing: 270, elevated: true, elevation: 24,
    description: "Overlooking the ocean. Famous for ouriços — Ericeira's signature pastry.",
    tags: ["café", "pastry", "ocean view", "morning"],
  },
  {
    id: 24, name: "Sr Tigre Lounge", type: "Tapas & Lounge", zone: "Rua do Caldeira",
    lat: 38.96280, lng: -9.41410,
    facing: 200, elevated: false, elevation: 35,
    description: "Lively atmosphere with tapas and a taste of Portuguese tradition.",
    tags: ["tapas", "lounge", "evening"],
  },
];

// Zone colors for the map
const ZONE_COLORS = {
  "Old Town Cliffs": "#e8a840",
  "Praia dos Pescadores": "#d4853a",
  "Praia do Sul": "#c96b35",
  "Praia de São Sebastião": "#b8522f",
  "Centro": "#8b9aad",
  "Rua da Misericórdia": "#7a8fa5",
  "Old Town": "#6d8299",
  "Praia do Norte": "#d4853a",
  "Ribeira d'Ilhas": "#5a9e6f",
  "Largo dos Condes": "#8b9aad",
  "Rua do Mercado": "#7a8fa5",
  "Praia de São Julião": "#5a9e6f",
  "Rua do Caldeira": "#8b9aad",
};

// ============================================================
// ASTRONOMICAL SUN CALCULATIONS
// Accurate solar position for Ericeira's latitude
// ============================================================
function getSunPosition(date, lat, lng) {
  const rad = Math.PI / 180;
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const hours = date.getHours() + date.getMinutes() / 60;

  // Solar declination
  const declination = -23.45 * Math.cos(rad * (360 / 365) * (dayOfYear + 10));

  // Equation of time (minutes)
  const B = rad * (360 / 365) * (dayOfYear - 81);
  const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);

  // Solar time
  const LSTM = 15 * Math.round(lng / 15);
  const TC = 4 * (lng - LSTM) + EoT;
  const LST = hours + TC / 60;
  const HRA = 15 * (LST - 12);

  // Altitude
  const sinAlt =
    Math.sin(rad * lat) * Math.sin(rad * declination) +
    Math.cos(rad * lat) * Math.cos(rad * declination) * Math.cos(rad * HRA);
  const altitude = Math.asin(sinAlt) / rad;

  // Azimuth
  const cosAz =
    (Math.sin(rad * declination) - Math.sin(rad * altitude) * Math.sin(rad * lat)) /
    (Math.cos(rad * altitude) * Math.cos(rad * lat));
  let azimuth = Math.acos(Math.max(-1, Math.min(1, cosAz))) / rad;
  if (HRA > 0) azimuth = 360 - azimuth;

  // Golden hour detection
  let golden = 0;
  if (altitude > 0 && altitude < 10) golden = 1 - altitude / 10;

  // Blue hour
  let blue = 0;
  if (altitude > -6 && altitude < 0) blue = 1 + altitude / 6;

  return {
    altitude,
    azimuth,
    golden,
    blue,
    isDay: altitude > 0,
    intensity: Math.max(0, Math.min(1, altitude / 15)),
  };
}

function getSunrise(date, lat) {
  const rad = Math.PI / 180;
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const declination = -23.45 * Math.cos(rad * (360 / 365) * (dayOfYear + 10));
  const cosHA =
    -Math.tan(rad * lat) * Math.tan(rad * declination);
  if (cosHA < -1 || cosHA > 1) return { sunrise: 6, sunset: 18 };
  const HA = Math.acos(cosHA) / rad;
  const sunrise = 12 - HA / 15;
  const sunset = 12 + HA / 15;
  return { sunrise, sunset };
}

// Venue sun score: how much direct sunlight hits this spot
function getVenueSunScore(venue, sun) {
  if (!sun.isDay) return 0;

  // How well does the venue face the sun?
  let facingDiff = Math.abs(venue.facing - sun.azimuth);
  if (facingDiff > 180) facingDiff = 360 - facingDiff;

  // Facing within 90° of sun = gets light
  let score = Math.max(0, 1 - facingDiff / 100);

  // West-facing venues (200-300°) get massive bonus during golden hour
  if (sun.golden > 0 && venue.facing >= 200 && venue.facing <= 310) {
    score = Math.min(1, score + sun.golden * 0.5);
  }

  // Elevated spots avoid cliff shadows
  if (venue.elevated) {
    score = Math.min(1, score * 1.3 + 0.1);
  } else {
    // Lower spots lose sun earlier as sun drops
    if (sun.altitude < 15) score *= 0.6 + (sun.altitude / 15) * 0.4;
  }

  // Ocean-facing cliffs (facing 240-300) have unobstructed western horizon
  if (venue.facing >= 240 && venue.facing <= 300 && sun.azimuth >= 230) {
    score = Math.min(1, score * 1.2);
  }

  return Math.max(0, Math.min(1, score * sun.intensity));
}

function formatTime(hours) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  const period = h >= 12 ? "PM" : "AM";
  const h12 = h > 12 ? h - 12 : h === 0 ? 12 : h;
  return `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

function getTimeLabel(sun) {
  if (sun.golden > 0.3) return "Golden Hour";
  if (sun.blue > 0.3) return "Blue Hour";
  if (!sun.isDay) return "Night";
  if (sun.altitude < 20) return sun.azimuth < 180 ? "Early Morning" : "Late Afternoon";
  if (sun.azimuth < 180) return "Morning";
  return "Afternoon";
}

// ============================================================
// COMPONENTS
// ============================================================

function SunDial({ sun, timeHours }) {
  const r = 42;
  const cx = 50;
  const cy = 50;
  // Sun arc from left (sunrise ~east) to right (sunset ~west)
  const sunProgress = sun.azimuth ? Math.max(0, Math.min(1, (sun.azimuth - 80) / 200)) : 0.5;
  const angle = Math.PI - sunProgress * Math.PI;
  const sx = cx + r * Math.cos(angle);
  const sy = cy - r * Math.sin(angle) * 0.6;

  const sunColor = sun.golden > 0.3 ? "#f4a020" : sun.isDay ? "#f0d060" : "#334";
  const glowSize = sun.golden > 0.3 ? 8 : sun.isDay ? 4 : 0;

  return (
    <svg viewBox="0 0 100 55" className="w-full" style={{ maxWidth: 200 }}>
      {/* Horizon line */}
      <line x1="8" y1="50" x2="92" y2="50" stroke="rgba(240,232,216,0.12)" strokeWidth="0.5" />
      {/* Arc path */}
      <path
        d={`M 8 50 Q 50 -10 92 50`}
        fill="none"
        stroke="rgba(240,232,216,0.06)"
        strokeWidth="0.5"
        strokeDasharray="2,2"
      />
      {/* Sun glow */}
      {glowSize > 0 && (
        <circle cx={sx} cy={sy} r={glowSize} fill={sunColor} opacity="0.15" />
      )}
      {/* Sun */}
      <circle cx={sx} cy={sy} r="3" fill={sunColor} />
      {sun.golden > 0.3 && (
        <circle cx={sx} cy={sy} r="5" fill="none" stroke={sunColor} strokeWidth="0.5" opacity="0.4" />
      )}
      {/* Labels */}
      <text x="6" y="54" fill="rgba(240,232,216,0.25)" fontSize="3.5" fontFamily="inherit">E</text>
      <text x="89" y="54" fill="rgba(240,232,216,0.25)" fontSize="3.5" fontFamily="inherit">W</text>
    </svg>
  );
}

function VenueCard({ venue, score, sun, isSelected, onClick }) {
  const sunPct = Math.round(score * 100);
  const status = score > 0.55 ? "full" : score > 0.2 ? "partial" : "shade";
  const statusLabel = score > 0.55 ? "Full Sun" : score > 0.2 ? "Partial" : "Shade";
  const statusColor =
    status === "full" ? "#e8a840" : status === "partial" ? "#8b6a2f" : "rgba(240,232,216,0.25)";

  return (
    <button
      onClick={onClick}
      className={`w-full text-left transition-all duration-200 rounded-xl border p-3.5 ${
        isSelected
          ? "border-amber-500/40 bg-amber-500/8"
          : "border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.08]"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <div
              className="w-2 h-2 rounded-full flex-shrink-0"
              style={{
                background: statusColor,
                boxShadow: status === "full" ? `0 0 8px ${statusColor}60` : "none",
              }}
            />
            <h3 className="text-sm font-medium text-stone-200 truncate">{venue.name}</h3>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-stone-500 ml-4">
            {venue.type} · {venue.zone}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-lg font-light" style={{ color: statusColor }}>
            {sunPct}%
          </div>
          <div className="text-[9px] uppercase tracking-wider" style={{ color: statusColor }}>
            {statusLabel}
          </div>
        </div>
      </div>
      {isSelected && (
        <div className="mt-3 ml-4">
          <p className="text-xs text-stone-400 leading-relaxed mb-2">{venue.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {venue.tags.map((tag) => (
              <span
                key={tag}
                className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.04] text-stone-500 uppercase tracking-wider"
              >
                {tag}
              </span>
            ))}
          </div>
          {/* Sun bar */}
          <div className="mt-2 h-1 rounded-full bg-white/[0.04] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${sunPct}%`,
                background:
                  status === "full"
                    ? "linear-gradient(90deg, #e8a840, #f4c362)"
                    : status === "partial"
                    ? "#8b6a2f"
                    : "rgba(240,232,216,0.15)",
              }}
            />
          </div>
        </div>
      )}
    </button>
  );
}

function MapView({ venues, scores, selectedId, onSelect, sun }) {
  const canvasRef = useRef(null);
  const [cam, setCam] = useState({ x: 0, y: 0, zoom: 1 });
  const dragRef = useRef(null);

  // Convert lat/lng to screen coords
  const project = useCallback(
    (lat, lng) => {
      const scale = 18000 * cam.zoom;
      const x = (lng - ERICEIRA_LNG) * scale * Math.cos((ERICEIRA_LAT * Math.PI) / 180);
      const y = -(lat - ERICEIRA_LAT) * scale;
      return { x: x + cam.x, y: y + cam.y };
    },
    [cam]
  );

  // Draw the map
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);
    const W = rect.width;
    const H = rect.height;

    // Background — varies with sun
    const bgGrad = ctx.createRadialGradient(W / 2, H / 2, 0, W / 2, H / 2, W * 0.8);
    if (sun.golden > 0.3) {
      bgGrad.addColorStop(0, `rgba(40,25,15,1)`);
      bgGrad.addColorStop(1, `rgba(12,10,14,1)`);
    } else if (sun.isDay) {
      bgGrad.addColorStop(0, `rgba(18,20,28,1)`);
      bgGrad.addColorStop(1, `rgba(10,10,16,1)`);
    } else {
      bgGrad.addColorStop(0, `rgba(8,8,12,1)`);
      bgGrad.addColorStop(1, `rgba(4,4,8,1)`);
    }
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Draw coastline approximation (west side = ocean)
    const coastPoints = [
      { lat: 38.980, lng: -9.420 },
      { lat: 38.976, lng: -9.421 },
      { lat: 38.970, lng: -9.419 },
      { lat: 38.966, lng: -9.418 },
      { lat: 38.964, lng: -9.419 },
      { lat: 38.962, lng: -9.417 },
      { lat: 38.960, lng: -9.417 },
      { lat: 38.957, lng: -9.418 },
      { lat: 38.954, lng: -9.419 },
      { lat: 38.950, lng: -9.420 },
    ];

    // Ocean area
    const coastScreen = coastPoints.map((p) => project(p.lat, p.lng));
    ctx.beginPath();
    ctx.moveTo(-W, -H);
    ctx.lineTo(-W, H * 2);
    coastScreen.forEach((p, i) => {
      if (i === 0) ctx.lineTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    ctx.lineTo(-W, coastScreen[coastScreen.length - 1].y);
    ctx.closePath();
    const oceanColor = sun.golden > 0.3 ? "rgba(30,25,45,0.5)" : "rgba(12,15,30,0.6)";
    ctx.fillStyle = oceanColor;
    ctx.fill();

    // Coastline stroke
    ctx.beginPath();
    coastScreen.forEach((p, i) => {
      if (i === 0) ctx.moveTo(p.x, p.y);
      else ctx.lineTo(p.x, p.y);
    });
    const coastStroke = sun.golden > 0.3 ? "rgba(232,168,64,0.15)" : "rgba(100,130,180,0.12)";
    ctx.strokeStyle = coastStroke;
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Grid of streets (subtle)
    ctx.strokeStyle = "rgba(240,232,216,0.025)";
    ctx.lineWidth = 0.5;
    for (let lat = 38.950; lat < 38.980; lat += 0.001) {
      const p1 = project(lat, -9.425);
      const p2 = project(lat, -9.410);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
    for (let lng = -9.425; lng < -9.410; lng += 0.001) {
      const p1 = project(38.950, lng);
      const p2 = project(38.980, lng);
      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }

    // Beach labels
    const beaches = [
      { name: "RIBEIRA D'ILHAS", lat: 38.9753, lng: -9.4210 },
      { name: "PRAIA DO NORTE", lat: 38.9648, lng: -9.4190 },
      { name: "PRAIA DOS PESCADORES", lat: 38.9638, lng: -9.4185 },
      { name: "PRAIA DO SUL", lat: 38.9605, lng: -9.4175 },
      { name: "SÃO SEBASTIÃO", lat: 38.9658, lng: -9.4192 },
    ];
    ctx.font = `500 ${8 * cam.zoom}px -apple-system, system-ui, sans-serif`;
    ctx.textAlign = "center";
    beaches.forEach((b) => {
      const p = project(b.lat, b.lng);
      if (p.x < -50 || p.x > W + 50 || p.y < -50 || p.y > H + 50) return;
      ctx.fillStyle = "rgba(100,140,200,0.18)";
      ctx.fillText(b.name, p.x, p.y);
    });

    // Draw sun direction indicator
    if (sun.isDay) {
      const sunRad = (sun.azimuth * Math.PI) / 180;
      const centerP = project(ERICEIRA_LAT, ERICEIRA_LNG);
      const lineLen = 400 * cam.zoom;
      const endX = centerP.x + Math.sin(sunRad) * lineLen;
      const endY = centerP.y - Math.cos(sunRad) * lineLen;
      const grad = ctx.createLinearGradient(centerP.x, centerP.y, endX, endY);
      const sunLineColor = sun.golden > 0.3 ? "232,168,64" : "240,210,120";
      grad.addColorStop(0, `rgba(${sunLineColor},0)`);
      grad.addColorStop(0.3, `rgba(${sunLineColor},0.06)`);
      grad.addColorStop(1, `rgba(${sunLineColor},0)`);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 80 * cam.zoom;
      ctx.beginPath();
      ctx.moveTo(centerP.x, centerP.y);
      ctx.lineTo(endX, endY);
      ctx.stroke();
    }

    // Draw venue markers
    venues.forEach((v) => {
      const p = project(v.lat, v.lng);
      if (p.x < -30 || p.x > W + 30 || p.y < -30 || p.y > H + 30) return;

      const score = scores[v.id] || 0;
      const isSelected = v.id === selectedId;
      const size = (4 + score * 8) * cam.zoom;
      const alpha = 0.3 + score * 0.7;

      if (score > 0.55) {
        // Full sun glow
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,168,64,${alpha * 0.04})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 2.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,168,64,${alpha * 0.1})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(232,168,64,${alpha})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 0.45, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255,230,170,${alpha * 0.9})`;
        ctx.fill();
      } else if (score > 0.2) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,106,47,${alpha * 0.08})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(139,106,47,${alpha * 0.6})`;
        ctx.fill();
      } else {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * cam.zoom, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(120,120,150,0.25)`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * cam.zoom, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(120,120,150,0.2)`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      // Selection ring
      if (isSelected) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, (size + 6) * cam.zoom, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(232,168,64,0.6)`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // Name label for higher-scoring or selected venues
      if ((score > 0.4 || isSelected) && cam.zoom > 0.6) {
        ctx.font = `500 ${(isSelected ? 11 : 9) * cam.zoom}px -apple-system, system-ui, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillStyle = isSelected
          ? "rgba(240,232,216,0.85)"
          : `rgba(240,232,216,${0.3 + score * 0.5})`;
        ctx.fillText(v.name, p.x, p.y - (size + 8) * cam.zoom);
      }
    });
  }, [venues, scores, selectedId, sun, cam, project]);

  // Pan & zoom handlers
  const handleMouseDown = (e) => {
    dragRef.current = { x: e.clientX, y: e.clientY, camX: cam.x, camY: cam.y };
  };
  const handleMouseMove = (e) => {
    if (!dragRef.current) return;
    setCam((c) => ({
      ...c,
      x: dragRef.current.camX + (e.clientX - dragRef.current.x),
      y: dragRef.current.camY + (e.clientY - dragRef.current.y),
    }));
  };
  const handleMouseUp = () => { dragRef.current = null; };
  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setCam((c) => ({ ...c, zoom: Math.max(0.3, Math.min(4, c.zoom * delta)) }));
  };

  // Touch support
  const touchRef = useRef({ lastDist: 0 });
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      dragRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, camX: cam.x, camY: cam.y };
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchRef.current.lastDist = Math.sqrt(dx * dx + dy * dy);
    }
  };
  const handleTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && dragRef.current) {
      setCam((c) => ({
        ...c,
        x: dragRef.current.camX + (e.touches[0].clientX - dragRef.current.x),
        y: dragRef.current.camY + (e.touches[0].clientY - dragRef.current.y),
      }));
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (touchRef.current.lastDist > 0) {
        setCam((c) => ({ ...c, zoom: Math.max(0.3, Math.min(4, c.zoom * (dist / touchRef.current.lastDist))) }));
      }
      touchRef.current.lastDist = dist;
    }
  };
  const handleTouchEnd = () => { dragRef.current = null; touchRef.current.lastDist = 0; };

  // Click to select venue
  const handleClick = (e) => {
    if (dragRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;

    let closest = null;
    let closestDist = 30;
    venues.forEach((v) => {
      const p = project(v.lat, v.lng);
      const dist = Math.sqrt((mx - p.x) ** 2 + (my - p.y) ** 2);
      if (dist < closestDist) {
        closest = v;
        closestDist = dist;
      }
    });
    if (closest) onSelect(closest.id);
  };

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full cursor-grab active:cursor-grabbing"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    />
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function EricieraGoldenHour() {
  const now = new Date();
  const [timeMinutes, setTimeMinutes] = useState(now.getHours() * 60 + now.getMinutes());
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showPanel, setShowPanel] = useState(true);

  // Build date object from slider
  const currentDate = useMemo(() => {
    const d = new Date();
    d.setHours(Math.floor(timeMinutes / 60), timeMinutes % 60, 0, 0);
    return d;
  }, [timeMinutes]);

  const sun = useMemo(() => getSunPosition(currentDate, ERICEIRA_LAT, ERICEIRA_LNG), [currentDate]);
  const { sunrise, sunset } = useMemo(() => getSunrise(currentDate, ERICEIRA_LAT), [currentDate]);

  // Compute scores for all venues
  const scores = useMemo(() => {
    const s = {};
    VENUES.forEach((v) => {
      s[v.id] = getVenueSunScore(v, sun);
    });
    return s;
  }, [sun]);

  // Filtered & sorted venues
  const sortedVenues = useMemo(() => {
    let filtered = [...VENUES];
    if (filter === "sunlit") filtered = filtered.filter((v) => scores[v.id] > 0.4);
    if (filter === "rooftop") filtered = filtered.filter((v) => v.elevated);
    if (filter === "bars") filtered = filtered.filter((v) => v.type.toLowerCase().includes("bar"));
    if (filter === "food") filtered = filtered.filter((v) => v.type.toLowerCase().includes("restaurant") || v.tags.includes("food") || v.tags.includes("tapas") || v.tags.includes("seafood"));
    return filtered.sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));
  }, [scores, filter]);

  const timeLabel = getTimeLabel(sun);
  const timeStr = formatTime(timeMinutes / 60);

  // Sky gradient for header
  const skyStyle = sun.golden > 0.3
    ? { background: "linear-gradient(135deg, rgba(60,30,10,0.4), rgba(15,12,18,0.9))" }
    : sun.isDay
    ? { background: "linear-gradient(135deg, rgba(20,25,40,0.4), rgba(10,10,16,0.9))" }
    : { background: "linear-gradient(135deg, rgba(8,8,14,0.6), rgba(4,4,8,0.95))" };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#0a0a0f] text-stone-200 overflow-hidden" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif" }}>
      {/* MAP */}
      <div className="flex-1 relative">
        <MapView
          venues={VENUES}
          scores={scores}
          selectedId={selectedId}
          onSelect={setSelectedId}
          sun={sun}
        />

        {/* Top overlay */}
        <div className="absolute top-0 left-0 right-0 pointer-events-none" style={skyStyle}>
          <div className="p-4 md:p-6 flex items-start justify-between pointer-events-auto">
            <div>
              <h1 className="text-xl md:text-2xl font-light tracking-tight">
                Ericeira <span style={{ color: "#e8a840" }}>Golden Hour</span>
              </h1>
              <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mt-0.5">
                Where the sun hits · {VENUES.length} spots
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-4 text-[10px] uppercase tracking-wider text-stone-500">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500" style={{ boxShadow: "0 0 6px rgba(232,168,64,0.5)" }} />
                  Full Sun
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-800" />
                  Partial
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-stone-700 border border-stone-600" />
                  Shade
                </span>
              </div>
              <button
                onClick={() => setShowPanel(!showPanel)}
                className="md:hidden w-9 h-9 rounded-lg bg-white/[0.06] border border-white/[0.08] flex items-center justify-center text-stone-400"
              >
                {showPanel ? "✕" : "☰"}
              </button>
            </div>
          </div>
        </div>

        {/* Side panel */}
        <div
          className={`absolute top-0 right-0 h-full w-full md:w-[340px] lg:w-[380px] transition-transform duration-300 ${
            showPanel ? "translate-x-0" : "translate-x-full"
          }`}
          style={{
            background: "linear-gradient(to right, rgba(10,10,15,0.0), rgba(10,10,15,0.95) 15%, rgba(10,10,15,0.98))",
          }}
        >
          <div className="h-full flex flex-col pt-20 md:pt-24 px-4 pb-4 overflow-hidden">
            {/* Time control */}
            <div className="flex-shrink-0 mb-4">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <div className="text-3xl font-light" style={{ color: sun.golden > 0.3 ? "#e8a840" : sun.isDay ? "#c8c0b0" : "#555" }}>
                    {timeStr}
                  </div>
                  <div className="text-[10px] uppercase tracking-[0.15em] mt-0.5" style={{
                    color: sun.golden > 0.3 ? "rgba(232,168,64,0.7)" : "rgba(160,150,140,0.4)"
                  }}>
                    {timeLabel}
                  </div>
                </div>
                <SunDial sun={sun} timeHours={timeMinutes / 60} />
              </div>

              <div className="relative mt-2">
                <div className="absolute inset-0 h-1 top-1/2 -translate-y-1/2 rounded-full"
                  style={{
                    background: "linear-gradient(to right, #1a1a2e 0%, #2a2040 15%, #e8a840 40%, #f4c362 50%, #e8a840 65%, #8b4513 80%, #1a1a2e 100%)",
                    opacity: 0.4,
                  }}
                />
                <input
                  type="range"
                  min={Math.floor(sunrise * 60) - 30}
                  max={Math.ceil(sunset * 60) + 30}
                  value={timeMinutes}
                  onChange={(e) => setTimeMinutes(Number(e.target.value))}
                  className="w-full relative z-10 appearance-none bg-transparent cursor-pointer h-6"
                  style={{
                    WebkitAppearance: "none",
                  }}
                />
                <style>{`
                  input[type="range"]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 18px; height: 18px; border-radius: 50%;
                    background: #e8a840;
                    box-shadow: 0 0 16px rgba(232,168,64,0.5);
                    border: 2px solid #f4d48a;
                    cursor: grab;
                  }
                  input[type="range"]::-moz-range-thumb {
                    width: 18px; height: 18px; border-radius: 50%;
                    background: #e8a840;
                    box-shadow: 0 0 16px rgba(232,168,64,0.5);
                    border: 2px solid #f4d48a;
                    cursor: grab;
                  }
                `}</style>
                <div className="flex justify-between text-[9px] text-stone-600 mt-0.5 px-1">
                  <span>{formatTime(sunrise)}</span>
                  <span>12:00 PM</span>
                  <span>{formatTime(sunset)}</span>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex-shrink-0 flex gap-1.5 mb-3 overflow-x-auto pb-1">
              {[
                { key: "all", label: "All" },
                { key: "sunlit", label: "Sunlit Now" },
                { key: "rooftop", label: "Rooftops" },
                { key: "bars", label: "Bars" },
                { key: "food", label: "Food" },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                    filter === key
                      ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                      : "bg-white/[0.03] text-stone-500 border border-white/[0.05] hover:bg-white/[0.06]"
                  }`}
                >
                  {label}
                  {key === "sunlit" && (
                    <span className="ml-1 text-amber-500">
                      {VENUES.filter((v) => scores[v.id] > 0.4).length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Venue list */}
            <div className="flex-1 overflow-y-auto space-y-1.5 pr-1 -mr-1" style={{
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(232,168,64,0.15) transparent",
            }}>
              {sortedVenues.length === 0 ? (
                <div className="text-center py-12 text-stone-600">
                  <div className="text-2xl mb-2">◌</div>
                  <p className="text-xs">No venues match this filter right now</p>
                </div>
              ) : (
                sortedVenues.map((v) => (
                  <VenueCard
                    key={v.id}
                    venue={v}
                    score={scores[v.id] || 0}
                    sun={sun}
                    isSelected={selectedId === v.id}
                    onClick={() => setSelectedId(selectedId === v.id ? null : v.id)}
                  />
                ))
              )}
            </div>

            {/* Footer */}
            <div className="flex-shrink-0 pt-3 mt-2 border-t border-white/[0.04]">
              <p className="text-[9px] text-stone-600 text-center leading-relaxed">
                Sun positions calculated astronomically for Ericeira (38.96°N, 9.42°W)
                <br />
                Drag map to explore · Scroll to zoom · Tap venue for details
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
