import { useState, useEffect, useRef, useMemo, useCallback } from "react";

const ERICEIRA_LAT = 38.9629;
const ERICEIRA_LNG = -9.4155;
const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY || "";

// ============================================================
// VENUE DATA
// ============================================================
const VENUES = [
  { id: 1, name: "Mar das Latas", type: "Wine Bar", zone: "Old Town Cliffs", lat: 38.96285, lng: -9.41720, facing: 250, elevated: true, description: "Cliff-edge wine bar with custom box-trays on the wall. The sunset spot.", tags: ["sunset", "wine", "cliffs"], gmaps: "Mar+das+Latas+Ericeira" },
  { id: 2, name: "Ouriço Terrace", type: "Bar & Club", zone: "Pescadores", lat: 38.96350, lng: -9.41680, facing: 270, elevated: true, description: "Portugal's oldest nightclub with ocean-view terrace above Praia dos Pescadores.", tags: ["nightlife", "terrace", "ocean view"], gmaps: "Ouriço+Ericeira" },
  { id: 3, name: "Balagan", type: "Restaurant & Rooftop", zone: "Praia do Sul", lat: 38.96100, lng: -9.41550, facing: 260, elevated: true, description: "Middle Eastern rooftop overlooking Praia do Sul. Best panoramic ocean view.", tags: ["rooftop", "food", "sunset", "coworking"], gmaps: "Balagan+Ericeira" },
  { id: 4, name: "Sebastião Bar", type: "Beach Bar", zone: "São Sebastião", lat: 38.96520, lng: -9.41750, facing: 280, elevated: false, description: "Sea-view drinks on the cliff walk near Praia de São Sebastião.", tags: ["casual", "ocean view", "beer"], gmaps: "Sebastião+Bar+Ericeira" },
  { id: 5, name: "Jukebox Taproom", type: "Cocktail Bar", zone: "Centro", lat: 38.96270, lng: -9.41490, facing: 220, elevated: false, description: "Industrial-chic taproom. Great cocktails, outdoor people-watching.", tags: ["cocktails", "indoor", "evening"], gmaps: "Jukebox+Taproom+Ericeira" },
  { id: 6, name: "Tubo Bar", type: "Bar", zone: "Misericórdia", lat: 38.96240, lng: -9.41530, facing: 200, elevated: false, description: "Tiny but iconic. The crowd spills into the street — that's where the fun is.", tags: ["nightlife", "local", "street"], gmaps: "Tubo+Ericeira+Bar" },
  { id: 7, name: "Adega Bar 1987", type: "Bar", zone: "Old Town", lat: 38.96310, lng: -9.41500, facing: 230, elevated: false, description: "Affordable drinks in a tight space. Locals' favorite since 1987.", tags: ["local", "cheap", "nightlife"], gmaps: "Adega+Bar+1987+Ericeira" },
  { id: 8, name: "5 e Meio TapRoom", type: "Craft Beer", zone: "Centro", lat: 38.96200, lng: -9.41460, facing: 210, elevated: false, description: "Local craft brewery taproom with tapas and outdoor tables.", tags: ["craft beer", "tapas", "casual"], gmaps: "5+e+meio+Ericeira" },
  { id: 9, name: "Ti Matilde", type: "Seafood", zone: "Praia do Norte", lat: 38.96430, lng: -9.41730, facing: 270, elevated: true, description: "Fresh grilled fish on the cliffs. Request an outdoor table for sunset.", tags: ["seafood", "sunset", "traditional"], gmaps: "Ti+Matilde+Ericeira" },
  { id: 10, name: "Prédio Rooftop", type: "Sushi & Rooftop", zone: "Centro", lat: 38.96260, lng: -9.41510, facing: 240, elevated: true, description: "Rooftop patio with city views. Best sushi in town.", tags: ["rooftop", "sushi", "views"], gmaps: "Prédio+Ericeira" },
  { id: 11, name: "Pedra Dura", type: "Restaurant", zone: "Centro", lat: 38.96230, lng: -9.41470, facing: 200, elevated: false, description: "Reliable Portuguese classics with large patio seating.", tags: ["portuguese", "patio", "family"], gmaps: "Pedra+Dura+Ericeira" },
  { id: 12, name: "Tik Tapas", type: "Tapas Bar", zone: "Centro", lat: 38.96290, lng: -9.41440, facing: 190, elevated: false, description: "Heated outdoor terrace. Round after round of Portuguese small plates.", tags: ["tapas", "terrace", "evening"], gmaps: "Tik+Tapas+Ericeira" },
  { id: 13, name: "Ribeira d'Ilhas Bar", type: "Beach Bar", zone: "Ribeira d'Ilhas", lat: 38.97530, lng: -9.42000, facing: 290, elevated: false, description: "Beanbags on a vast wooden deck at the famous surf beach.", tags: ["surf", "beach", "casual"], gmaps: "Ribeira+d'Ilhas+Bar+Ericeira" },
  { id: 14, name: "Uni Sushi", type: "Sushi", zone: "Largo dos Condes", lat: 38.96320, lng: -9.41460, facing: 220, elevated: false, description: "Modern sushi using local catch. Sheltered outdoor terrace.", tags: ["sushi", "terrace", "quality"], gmaps: "Uni+Sushi+Ericeira" },
  { id: 15, name: "Barzinho", type: "Bar", zone: "Centro", lat: 38.96250, lng: -9.41420, facing: 210, elevated: false, description: "Local favourite with pool tables, darts, and a big outdoor terrace.", tags: ["games", "terrace", "local"], gmaps: "Barzinho+Ericeira" },
  { id: 16, name: "La Popular Taberna", type: "Wine & Tapas", zone: "Misericórdia", lat: 38.96255, lng: -9.41560, facing: 230, elevated: false, description: "Tapas and local wines in the heart of the restaurant quarter.", tags: ["wine", "tapas", "cozy"], gmaps: "La+Popular+Taberna+Ericeira" },
  { id: 17, name: "Ippolito & Maciste", type: "Wine Bar", zone: "Rua do Mercado", lat: 38.96300, lng: -9.41480, facing: 200, elevated: false, description: "Charming wine bar capturing Portuguese hospitality.", tags: ["wine", "portuguese", "intimate"], gmaps: "Ippolito+Maciste+Ericeira" },
  { id: 18, name: "Tasquinha do Joy", type: "Restaurant", zone: "Old Town", lat: 38.96340, lng: -9.41570, facing: 260, elevated: false, description: "Red-checked tablecloths, terracotta dishes, sunset pavement tables.", tags: ["traditional", "sunset", "value"], gmaps: "Tasquinha+do+Joy+Ericeira" },
  { id: 19, name: "Gota d'Álcool", type: "Beach Bar", zone: "São Julião", lat: 38.95400, lng: -9.41800, facing: 280, elevated: false, description: "No-frills beach bar at the rugged southern coastline.", tags: ["beach", "casual", "burgers"], gmaps: "Gota+d'Álcool+Ericeira" },
  { id: 20, name: "Tabuas Algodio", type: "Beach Bar", zone: "Praia do Norte", lat: 38.96470, lng: -9.41760, facing: 280, elevated: false, description: "Seaside escape right on the beach with Atlantic views.", tags: ["beach", "casual", "views"], gmaps: "Tabuas+Algodio+Ericeira" },
  { id: 21, name: "7Janelas Brewery", type: "Brewpub", zone: "Centro", lat: 38.96210, lng: -9.41430, facing: 195, elevated: false, description: "Craft brewery with Portuguese classics and amazing steaks.", tags: ["brewery", "food", "cozy"], gmaps: "7Janelas+Ericeira" },
  { id: 22, name: "Hemingway's Bar", type: "Cocktail Bar", zone: "Old Town", lat: 38.96275, lng: -9.41545, facing: 230, elevated: false, description: "Low-lit cocktail institution. Metal tables on the street.", tags: ["cocktails", "intimate", "classic"], gmaps: "Hemingways+Ericeira" },
  { id: 23, name: "Casa da Fernanda", type: "Café & Bakery", zone: "Pescadores", lat: 38.96370, lng: -9.41660, facing: 270, elevated: true, description: "Overlooking the ocean. Famous for ouriços pastry.", tags: ["café", "pastry", "ocean view", "morning"], gmaps: "Casa+da+Fernanda+Ericeira" },
  { id: 24, name: "Sr Tigre Lounge", type: "Tapas & Lounge", zone: "Centro", lat: 38.96280, lng: -9.41410, facing: 200, elevated: false, description: "Lively atmosphere with tapas and Portuguese tradition.", tags: ["tapas", "lounge", "evening"], gmaps: "Sr+Tigre+Lounge+Ericeira" },
];

// ============================================================
// SUN MATH
// ============================================================
function getSunPosition(date, lat, lng) {
  const rad = Math.PI / 180;
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const hours = date.getHours() + date.getMinutes() / 60;
  const declination = -23.45 * Math.cos(rad * (360 / 365) * (dayOfYear + 10));
  const B = rad * (360 / 365) * (dayOfYear - 81);
  const EoT = 9.87 * Math.sin(2 * B) - 7.53 * Math.cos(B) - 1.5 * Math.sin(B);
  const LSTM = 15 * Math.round(lng / 15);
  const LST = hours + (4 * (lng - LSTM) + EoT) / 60;
  const HRA = 15 * (LST - 12);
  const sinAlt = Math.sin(rad * lat) * Math.sin(rad * declination) + Math.cos(rad * lat) * Math.cos(rad * declination) * Math.cos(rad * HRA);
  const altitude = Math.asin(sinAlt) / rad;
  const cosAz = (Math.sin(rad * declination) - Math.sin(rad * altitude) * Math.sin(rad * lat)) / (Math.cos(rad * altitude) * Math.cos(rad * lat));
  let azimuth = Math.acos(Math.max(-1, Math.min(1, cosAz))) / rad;
  if (HRA > 0) azimuth = 360 - azimuth;
  let golden = 0;
  if (altitude > 0 && altitude < 10) golden = 1 - altitude / 10;
  return { altitude, azimuth, golden, isDay: altitude > 0, intensity: Math.max(0, Math.min(1, altitude / 15)) };
}

function getSunrise(date, lat) {
  const rad = Math.PI / 180;
  const dayOfYear = Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000);
  const dec = -23.45 * Math.cos(rad * (360 / 365) * (dayOfYear + 10));
  const cosHA = -Math.tan(rad * lat) * Math.tan(rad * dec);
  if (cosHA < -1 || cosHA > 1) return { sunrise: 6, sunset: 18 };
  const HA = Math.acos(cosHA) / rad;
  return { sunrise: 12 - HA / 15, sunset: 12 + HA / 15 };
}

function getVenueSunScore(venue, sun) {
  if (!sun.isDay) return 0;
  let diff = Math.abs(venue.facing - sun.azimuth);
  if (diff > 180) diff = 360 - diff;
  let score = Math.max(0, 1 - diff / 100);
  if (sun.golden > 0 && venue.facing >= 200 && venue.facing <= 310) score = Math.min(1, score + sun.golden * 0.5);
  if (venue.elevated) score = Math.min(1, score * 1.3 + 0.1);
  else if (sun.altitude < 15) score *= 0.6 + (sun.altitude / 15) * 0.4;
  if (venue.facing >= 240 && venue.facing <= 300 && sun.azimuth >= 230) score = Math.min(1, score * 1.2);
  return Math.max(0, Math.min(1, score * sun.intensity));
}

function formatTime(h) { const hr = Math.floor(h); const m = Math.round((h - hr) * 60); const p = hr >= 12 ? "PM" : "AM"; const h12 = hr > 12 ? hr - 12 : hr === 0 ? 12 : hr; return `${h12}:${String(m).padStart(2, "0")} ${p}`; }
function getTimeLabel(sun) { if (sun.golden > 0.3) return "Golden Hour"; if (!sun.isDay) return "Night"; if (sun.altitude < 20) return sun.azimuth < 180 ? "Early Morning" : "Late Afternoon"; return sun.azimuth < 180 ? "Morning" : "Afternoon"; }
function getDirectionsLink(v) { return `https://www.google.com/maps/dir/?api=1&destination=${v.lat},${v.lng}&travelmode=walking`; }
function getMapsLink(v) { return `https://www.google.com/maps/search/?api=1&query=${v.lat},${v.lng}`; }

// ============================================================
// MAP (Leaflet + CartoDB dark tiles — no API key needed)
// ============================================================
function MapView({ venues, scores, selectedId, onSelect }) {
  const mapRef = useRef(null);
  const mapObjRef = useRef(null);
  const markersRef = useRef([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (window.L) { setReady(true); return; }
    const css = document.createElement("link");
    css.rel = "stylesheet"; css.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
    document.head.appendChild(css);
    const js = document.createElement("script");
    js.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    js.onload = () => setReady(true);
    document.head.appendChild(js);
  }, []);

  useEffect(() => {
    if (!ready || !mapRef.current || mapObjRef.current) return;
    const L = window.L;
    const map = L.map(mapRef.current, { center: [ERICEIRA_LAT, ERICEIRA_LNG], zoom: 16, zoomControl: false });
    L.control.zoom({ position: "bottomleft" }).addTo(map);
    L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '© <a href="https://carto.com/">CARTO</a> · © <a href="https://osm.org/">OSM</a>',
      maxZoom: 19,
    }).addTo(map);
    mapObjRef.current = map;
    // Fix tile rendering on first load
    setTimeout(() => map.invalidateSize(), 100);
  }, [ready]);

  useEffect(() => {
    if (!mapObjRef.current || !window.L) return;
    const L = window.L;
    const map = mapObjRef.current;
    markersRef.current.forEach(m => map.removeLayer(m));
    markersRef.current = [];

    venues.forEach(v => {
      const score = scores[v.id] || 0;
      const isSel = v.id === selectedId;
      const color = score > 0.55 ? "#e8a840" : score > 0.2 ? "#8b6a2f" : "#555";
      const sz = isSel ? 18 : score > 0.55 ? 14 : score > 0.2 ? 10 : 7;
      const glow = score > 0.55 ? `box-shadow:0 0 ${isSel ? 25 : 18}px ${color}90, 0 0 ${isSel ? 40 : 30}px ${color}40;` : score > 0.2 ? `box-shadow:0 0 8px ${color}50;` : "";

      const icon = L.divIcon({
        className: "",
        html: `<div style="width:${sz}px;height:${sz}px;border-radius:50%;background:${color};border:${isSel ? "2.5px solid #f4d48a" : "1.5px solid " + color + "80"};${glow}transform:translate(-50%,-50%);transition:all 0.3s;"></div>`,
        iconSize: [0, 0],
      });

      const marker = L.marker([v.lat, v.lng], { icon, zIndexOffset: isSel ? 1000 : Math.round(score * 100) }).addTo(map);

      // Popup with directions link
      const statusText = score > 0.55 ? `☀️ Full Sun ${Math.round(score*100)}%` : score > 0.2 ? `🌤 Partial ${Math.round(score*100)}%` : "🌑 Shade";
      marker.bindPopup(`
        <div style="font-family:-apple-system,system-ui,sans-serif;min-width:180px;padding:4px 0;">
          <div style="font-size:15px;font-weight:600;color:#1a1a2e;margin-bottom:1px;">${v.name}</div>
          <div style="font-size:10px;color:#888;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:8px;">${v.type} · ${v.zone}</div>
          <div style="font-size:13px;font-weight:500;margin-bottom:10px;color:${color};">${statusText}</div>
          <div style="display:flex;gap:6px;">
            <a href="${getDirectionsLink(v)}" target="_blank" rel="noopener" style="flex:1;text-align:center;font-size:12px;font-weight:600;color:#fff;background:#e8a840;text-decoration:none;padding:8px 12px;border-radius:8px;">🚶 Walk There</a>
            <a href="${getMapsLink(v)}" target="_blank" rel="noopener" style="flex:1;text-align:center;font-size:12px;font-weight:500;color:#666;background:#f0f0f0;text-decoration:none;padding:8px 12px;border-radius:8px;">📍 Maps</a>
          </div>
        </div>
      `, { className: "custom-popup", maxWidth: 250 });

      if (isSel) { marker.openPopup(); map.panTo([v.lat, v.lng], { animate: true }); }
      marker.on("click", () => onSelect(v.id));
      markersRef.current.push(marker);
    });
  }, [venues, scores, selectedId, onSelect]);

  // Resize fix
  useEffect(() => {
    const handleResize = () => mapObjRef.current?.invalidateSize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return <div ref={mapRef} className="w-full h-full" style={{ background: "#0d0d14" }} />;
}

// ============================================================
// SUN DIAL
// ============================================================
function SunDial({ sun }) {
  const progress = sun.azimuth ? Math.max(0, Math.min(1, (sun.azimuth - 80) / 200)) : 0.5;
  const angle = Math.PI - progress * Math.PI;
  const sx = 50 + 42 * Math.cos(angle);
  const sy = 50 - 42 * Math.sin(angle) * 0.6;
  const col = sun.golden > 0.3 ? "#f4a020" : sun.isDay ? "#f0d060" : "#334";

  return (
    <svg viewBox="0 0 100 55" className="w-full" style={{ maxWidth: 170 }}>
      <line x1="8" y1="50" x2="92" y2="50" stroke="rgba(240,232,216,0.12)" strokeWidth="0.5" />
      <path d="M 8 50 Q 50 -10 92 50" fill="none" stroke="rgba(240,232,216,0.06)" strokeWidth="0.5" strokeDasharray="2,2" />
      {sun.isDay && <circle cx={sx} cy={sy} r={sun.golden > 0.3 ? 8 : 4} fill={col} opacity="0.15" />}
      <circle cx={sx} cy={sy} r="3" fill={col} />
      <text x="6" y="54" fill="rgba(240,232,216,0.25)" fontSize="3.5">E</text>
      <text x="89" y="54" fill="rgba(240,232,216,0.25)" fontSize="3.5">W</text>
    </svg>
  );
}

// ============================================================
// VENUE CARD
// ============================================================
function VenueCard({ venue, score, isSelected, onClick }) {
  const pct = Math.round(score * 100);
  const st = score > 0.55 ? "full" : score > 0.2 ? "partial" : "shade";
  const label = st === "full" ? "Full Sun" : st === "partial" ? "Partial" : "Shade";
  const col = st === "full" ? "#e8a840" : st === "partial" ? "#8b6a2f" : "rgba(240,232,216,0.25)";

  return (
    <button onClick={onClick} className={`w-full text-left transition-all duration-200 rounded-xl border p-3.5 ${isSelected ? "border-amber-500/40 bg-amber-900/15" : "border-white/[0.04] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.08]"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: col, boxShadow: st === "full" ? `0 0 8px ${col}60` : "none" }} />
            <h3 className="text-sm font-medium text-stone-200 truncate">{venue.name}</h3>
          </div>
          <p className="text-[10px] uppercase tracking-wider text-stone-500 ml-4">{venue.type} · {venue.zone}</p>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-lg font-light" style={{ color: col }}>{pct}%</div>
          <div className="text-[9px] uppercase tracking-wider" style={{ color: col }}>{label}</div>
        </div>
      </div>
      {isSelected && (
        <div className="mt-3 ml-4">
          <p className="text-xs text-stone-400 leading-relaxed mb-2">{venue.description}</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {venue.tags.map(t => <span key={t} className="text-[9px] px-2 py-0.5 rounded-full bg-white/[0.04] text-stone-500 uppercase tracking-wider">{t}</span>)}
          </div>
          <div className="h-1 rounded-full bg-white/[0.04] overflow-hidden mb-3">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: st === "full" ? "linear-gradient(90deg,#e8a840,#f4c362)" : st === "partial" ? "#8b6a2f" : "rgba(240,232,216,0.15)" }} />
          </div>
          <div className="flex gap-2">
            <a href={getDirectionsLink(venue)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex-1 text-center text-xs font-medium px-3 py-2.5 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 hover:bg-amber-500/30 transition-colors">
              🚶 Walk There
            </a>
            <a href={getMapsLink(venue)} target="_blank" rel="noopener noreferrer" onClick={e => e.stopPropagation()} className="flex-1 text-center text-xs font-medium px-3 py-2.5 rounded-lg bg-white/[0.04] text-stone-400 border border-white/[0.06] hover:bg-white/[0.08] transition-colors">
              📍 View on Maps
            </a>
          </div>
        </div>
      )}
    </button>
  );
}

// ============================================================
// MAIN APP
// ============================================================
export default function App() {
  const now = new Date();
  const [timeMinutes, setTimeMinutes] = useState(now.getHours() * 60 + now.getMinutes());
  const [selectedId, setSelectedId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [showPanel, setShowPanel] = useState(true);

  const currentDate = useMemo(() => { const d = new Date(); d.setHours(Math.floor(timeMinutes / 60), timeMinutes % 60, 0, 0); return d; }, [timeMinutes]);
  const sun = useMemo(() => getSunPosition(currentDate, ERICEIRA_LAT, ERICEIRA_LNG), [currentDate]);
  const { sunrise, sunset } = useMemo(() => getSunrise(currentDate, ERICEIRA_LAT), [currentDate]);
  const scores = useMemo(() => { const s = {}; VENUES.forEach(v => { s[v.id] = getVenueSunScore(v, sun); }); return s; }, [sun]);

  const sortedVenues = useMemo(() => {
    let f = [...VENUES];
    if (filter === "sunlit") f = f.filter(v => scores[v.id] > 0.4);
    if (filter === "rooftop") f = f.filter(v => v.elevated);
    if (filter === "bars") f = f.filter(v => v.type.toLowerCase().includes("bar"));
    if (filter === "food") f = f.filter(v => v.type.toLowerCase().includes("restaurant") || v.type.toLowerCase().includes("seafood") || v.tags.includes("food") || v.tags.includes("tapas"));
    return f.sort((a, b) => (scores[b.id] || 0) - (scores[a.id] || 0));
  }, [scores, filter]);

  return (
    <div className="h-screen w-screen flex flex-col lg:flex-row bg-[#0a0a0f] text-stone-200 overflow-hidden" style={{ fontFamily: "-apple-system,BlinkMacSystemFont,'Segoe UI',system-ui,sans-serif" }}>
      {/* MAP */}
      <div className="flex-1 relative min-h-[40vh] lg:min-h-0">
        <MapView venues={VENUES} scores={scores} selectedId={selectedId} onSelect={setSelectedId} />
        <div className="absolute top-4 left-4 pointer-events-none z-[500]">
          <h1 className="text-xl md:text-2xl font-light tracking-tight drop-shadow-lg">Ericeira <span style={{ color: "#e8a840" }}>Golden Hour</span></h1>
          <p className="text-[10px] uppercase tracking-[0.2em] text-stone-400 mt-0.5 drop-shadow">{VENUES.length} spots · tap for directions</p>
        </div>
        <button onClick={() => setShowPanel(!showPanel)} className="lg:hidden absolute top-4 right-4 w-10 h-10 rounded-lg bg-black/70 backdrop-blur border border-white/10 flex items-center justify-center text-stone-300 z-[500]">
          {showPanel ? "✕" : "☰"}
        </button>
      </div>

      {/* PANEL */}
      <div className={`${showPanel ? "flex" : "hidden"} lg:flex flex-col w-full lg:w-[360px] xl:w-[400px] bg-[#0a0a0f] border-t lg:border-t-0 lg:border-l border-white/[0.06] overflow-hidden flex-shrink-0 max-h-[60vh] lg:max-h-none`}>
        {/* Time */}
        <div className="flex-shrink-0 px-4 pt-4 pb-3 border-b border-white/[0.04]">
          <div className="flex items-center justify-between mb-2">
            <div>
              <div className="text-3xl font-light" style={{ color: sun.golden > 0.3 ? "#e8a840" : sun.isDay ? "#c8c0b0" : "#555" }}>{formatTime(timeMinutes / 60)}</div>
              <div className="text-[10px] uppercase tracking-[0.15em] mt-0.5" style={{ color: sun.golden > 0.3 ? "rgba(232,168,64,0.7)" : "rgba(160,150,140,0.4)" }}>{getTimeLabel(sun)}</div>
            </div>
            <SunDial sun={sun} />
          </div>
          <div className="relative mt-1">
            <div className="absolute inset-0 h-1 top-1/2 -translate-y-1/2 rounded-full" style={{ background: "linear-gradient(to right, #1a1a2e 0%, #2a2040 15%, #e8a840 40%, #f4c362 50%, #e8a840 65%, #8b4513 80%, #1a1a2e 100%)", opacity: 0.4 }} />
            <input type="range" min={Math.floor(sunrise * 60) - 30} max={Math.ceil(sunset * 60) + 30} value={timeMinutes} onChange={e => setTimeMinutes(Number(e.target.value))} className="w-full relative z-10 bg-transparent cursor-pointer h-6" style={{ WebkitAppearance: "none", appearance: "none" }} />
            <style>{`input[type="range"]::-webkit-slider-thumb{-webkit-appearance:none;width:18px;height:18px;border-radius:50%;background:#e8a840;box-shadow:0 0 16px rgba(232,168,64,0.5);border:2px solid #f4d48a;cursor:grab}input[type="range"]::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#e8a840;box-shadow:0 0 16px rgba(232,168,64,0.5);border:2px solid #f4d48a;cursor:grab}.leaflet-popup-content-wrapper{border-radius:12px!important;box-shadow:0 8px 30px rgba(0,0,0,0.3)!important}.leaflet-popup-tip{display:none!important}`}</style>
            <div className="flex justify-between text-[9px] text-stone-600 mt-0.5 px-1">
              <span>{formatTime(sunrise)}</span><span>12:00 PM</span><span>{formatTime(sunset)}</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex-shrink-0 flex gap-1.5 px-4 py-2.5 overflow-x-auto">
          {[{ key: "all", label: "All" }, { key: "sunlit", label: "Sunlit" }, { key: "rooftop", label: "Rooftops" }, { key: "bars", label: "Bars" }, { key: "food", label: "Food" }].map(({ key, label }) => (
            <button key={key} onClick={() => setFilter(key)} className={`text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${filter === key ? "bg-amber-500/15 text-amber-400 border border-amber-500/30" : "bg-white/[0.03] text-stone-500 border border-white/[0.05] hover:bg-white/[0.06]"}`}>
              {label}{key === "sunlit" && <span className="ml-1 text-amber-500">{VENUES.filter(v => scores[v.id] > 0.4).length}</span>}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-1.5" style={{ scrollbarWidth: "thin", scrollbarColor: "rgba(232,168,64,0.15) transparent" }}>
          {sortedVenues.length === 0 ? (
            <div className="text-center py-12 text-stone-600"><div className="text-2xl mb-2">◌</div><p className="text-xs">No venues match this filter</p></div>
          ) : sortedVenues.map(v => (
            <VenueCard key={v.id} venue={v} score={scores[v.id] || 0} isSelected={selectedId === v.id} onClick={() => setSelectedId(selectedId === v.id ? null : v.id)} />
          ))}
        </div>

        <div className="flex-shrink-0 px-4 py-2.5 border-t border-white/[0.04]">
          <p className="text-[9px] text-stone-600 text-center">Sun calculated for Ericeira (38.96°N) · Tap venue → walk there</p>
        </div>
      </div>
    </div>
  );
}
