import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rotate3d, 
  Layers, 
  Sun, 
  Moon,
  Maximize2, 
  Minimize2, 
  Check, 
  Share2, 
  Sliders, 
  Compass, 
  ArrowRight,
  Grid
} from 'lucide-react';

// ── Marble Demo Slabs ──────────────────────────────────────────────────
const SHOWROOM_SLABS = [
  {
    id: 'calacatta-gold',
    name: 'Calacatta Gold Supreme',
    origin: 'Carrara, Italy',
    type: 'Italian Marble',
    finish: 'Polished',
    price: '$45 / sq ft',
    image: '/images/showroom_3d_marble.png',
    backlitImage: '/images/showroom_3d_marble.png',
    bookmatchImage: '/images/showroom_3d_marble.png',
    description: 'Distinctive white marble traversed by bold graphite veining and subtle gold ribbons.',
    specifications: {
      hardness: '3.5 Mohs',
      waterAbs: '0.12%',
      density: '2,710 kg/m³',
      thicknessAvailable: ['20mm', '30mm'],
    },
    hotspots: [
      { x: 35, y: 40, label: 'Gold Calcite Ribbon', detail: 'High-density natural iron & quartz infusion creating golden warmth.' },
      { x: 65, y: 60, label: 'Mirror Polish Surface', detail: 'Diamond-grit polished to 98% reflective sheen.' },
      { x: 50, y: 25, label: 'Book-match Seam', detail: 'Sequentially quarried block precision-sliced for butterfly mirroring.' },
    ]
  },
  {
    id: 'statuario-extra',
    name: 'Statuario Extra White',
    origin: 'Tuscany, Italy',
    type: 'Italian Marble',
    finish: 'Honed',
    price: '$52 / sq ft',
    image: '/images/stone_image_2.jpg',
    backlitImage: '/images/stone_image_18.jpg',
    bookmatchImage: '/images/stone_image_11.jpg',
    description: 'Exclusive pure white field with dramatic slate-grey lightning veining patterns.',
    specifications: {
      hardness: '3.8 Mohs',
      waterAbs: '0.10%',
      density: '2,720 kg/m³',
      thicknessAvailable: ['20mm', '30mm'],
    },
    hotspots: [
      { x: 40, y: 35, label: 'Slate Veining', detail: 'Crystalline slate intrusions formed over millions of years.' },
      { x: 70, y: 55, label: 'Low Porosity', detail: 'Impregnated sealing ensures stain prevention.' },
    ]
  },
  {
    id: 'royal-blue-onyx',
    name: 'Royal Blue & Gold Onyx',
    origin: 'Yazd, Iran',
    type: 'Translucent Onyx',
    finish: 'Polished',
    price: '$68 / sq ft',
    image: '/images/stone_image_19.jpg',
    backlitImage: '/images/stone_image_6.jpg',
    bookmatchImage: '/images/stone_image_20.jpg',
    description: 'Ethereal ocean-blue onyx with translucent calcite waves designed for dramatic LED backlighting.',
    specifications: {
      hardness: '3.0 Mohs',
      waterAbs: '0.15%',
      density: '2,650 kg/m³',
      thicknessAvailable: ['16mm', '20mm'],
    },
    hotspots: [
      { x: 45, y: 50, label: 'Translucent Calcite', detail: 'Transmits 45% of backlighting LED wavelength.' },
      { x: 25, y: 30, label: 'Ocean Blue Wave', detail: 'Rare mineral composition found only in deep Yazd deposits.' },
    ]
  },
  {
    id: 'black-cosmic-granite',
    name: 'Black Cosmic Granite',
    origin: 'Espírito Santo, Brazil',
    type: 'Granite',
    finish: 'Leathered',
    price: '$28 / sq ft',
    image: '/images/stone_image_18.jpg',
    backlitImage: '/images/stone_image_3.jpg',
    bookmatchImage: '/images/stone_image_9.jpg',
    description: 'Deep black background studded with golden-white quartz crystals. Heat and scratch proof.',
    specifications: {
      hardness: '6.5 Mohs',
      waterAbs: '0.04%',
      density: '2,900 kg/m³',
      thicknessAvailable: ['20mm', '30mm'],
    },
    hotspots: [
      { x: 50, y: 45, label: 'Quartz Clusters', detail: 'Highly resistant to scratch and thermal stress.' },
    ]
  },
  {
    id: 'patagonia-quartzite',
    name: 'Patagonia Exotic Quartzite',
    origin: 'Minas Gerais, Brazil',
    type: 'Quartzite',
    finish: 'Polished',
    price: '$75 / sq ft',
    image: '/images/stone_image_7.jpg',
    backlitImage: '/images/stone_image_7.jpg',
    bookmatchImage: '/images/stone_image_33.jpg',
    description: 'Extremely rare geological masterpiece combining clear quartz, feldspar, and gold veins.',
    specifications: {
      hardness: '7.0 Mohs',
      waterAbs: '0.02%',
      density: '2,850 kg/m³',
      thicknessAvailable: ['20mm', '30mm'],
    },
    hotspots: [
      { x: 30, y: 30, label: 'Transparent Quartz Block', detail: 'Glass-like natural quartz chunk.' },
      { x: 70, y: 60, label: 'Feldspar Matrix', detail: 'High hardness rating matching precious gemstones.' },
    ]
  }
];

// ── Environment Preset Rooms (Dark 3D Canvas Backgrounds) ──────────────
const ENVIRONMENTS_LIGHT = [
  { id: 'studio', label: '3D Gallery Studio', bgClass: 'bg-gradient-to-b from-stone-900 via-stone-950 to-black' },
  { id: 'living', label: 'Luxury Penthouse', bgClass: 'bg-stone-950' },
  { id: 'kitchen', label: 'Chef Kitchen Island', bgClass: 'bg-neutral-950' },
  { id: 'hotel', label: 'Museum Exhibition Hall', bgClass: 'bg-black' },
];

const ENVIRONMENTS_DARK = [
  { id: 'studio', label: '3D Gallery Studio', bgClass: 'bg-gradient-to-b from-stone-900 via-stone-950 to-black' },
  { id: 'living', label: 'Luxury Penthouse', bgClass: 'bg-stone-950' },
  { id: 'kitchen', label: 'Chef Kitchen Island', bgClass: 'bg-neutral-950' },
  { id: 'hotel', label: 'Grand Hotel Atrium', bgClass: 'bg-black' },
];

export default function Showroom() {
  const navigate = useNavigate();
  const [isDarkMode, setIsDarkMode] = useState(false); // Default: White / Light Mode!
  const [selectedSlab, setSelectedSlab] = useState(SHOWROOM_SLABS[0]);
  
  const environments = isDarkMode ? ENVIRONMENTS_DARK : ENVIRONMENTS_LIGHT;
  const [selectedEnv, setSelectedEnv] = useState(environments[0]);
  
  // 3D View Controls State
  const [rotationX, setRotationX] = useState(12);
  const [rotationY, setRotationY] = useState(-15);
  const [zoom, setZoom] = useState(1);
  const [isBacklit, setIsBacklit] = useState(false);
  const [isBookMatch, setIsBookMatch] = useState(false);
  const [finishMode, setFinishMode] = useState('Polished');
  const [thickness, setThickness] = useState('20mm');
  const [lightingColor, setLightingColor] = useState('Warm Gold');
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  // Mouse Orbit Drag Logic
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - dragStart.x;
    const deltaY = e.clientY - dragStart.y;
    setRotationY((prev) => prev + deltaX * 0.4);
    setRotationX((prev) => Math.max(-45, Math.min(45, prev - deltaY * 0.4)));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetCamera = () => {
    setRotationX(12);
    setRotationY(-15);
    setZoom(1);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Determine current texture image
  const currentImage = isBookMatch 
    ? selectedSlab.bookmatchImage 
    : isBacklit 
    ? selectedSlab.backlitImage 
    : selectedSlab.image;

  // Backlight glow shadow class
  const getBacklightGlow = () => {
    if (!isBacklit) return 'shadow-2xl';
    if (lightingColor === 'Warm Gold') return 'shadow-[0_0_90px_rgba(201,162,39,0.75)]';
    if (lightingColor === 'Ice Blue') return 'shadow-[0_0_90px_rgba(56,189,248,0.75)]';
    return 'shadow-[0_0_90px_rgba(255,255,255,0.9)]';
  };

  return (
    <div className={`min-h-screen flex flex-col font-sans select-none overflow-x-hidden transition-colors duration-300 ${isDarkMode ? 'bg-stone-950 text-stone-100' : 'bg-[#fcf9f8] text-stone-900'}`}>
      
      {/* ── Top Header Navigation ─────────────────────────────────────────── */}
      <header className={`h-16 border-b px-6 flex items-center justify-between backdrop-blur-md sticky top-0 z-50 transition-colors ${isDarkMode ? 'bg-stone-950/90 border-stone-800/80' : 'bg-white/90 border-stone-200/90 shadow-sm'}`}>
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gold-accent flex items-center justify-center text-stone-950 font-bold group-hover:scale-105 transition-transform">
              M
            </div>
            <span className={`font-headline-xl text-xl font-bold tracking-tight ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>
              Marble<span className="text-gold-accent">Craft</span> 3D
            </span>
          </Link>
          <span className="text-xs px-2.5 py-1 rounded-full bg-gold-accent/10 text-gold-accent border border-gold-accent/30 font-label-caps uppercase tracking-wider font-semibold">
            Virtual Showroom
          </span>
        </div>

        <div className={`hidden md:flex items-center gap-6 text-sm font-label-caps tracking-wider ${isDarkMode ? 'text-stone-400' : 'text-stone-600'}`}>
          <button 
            onClick={resetCamera}
            className="flex items-center gap-1.5 hover:text-gold-accent transition-colors"
          >
            <Rotate3d className="w-4 h-4" /> Reset View
          </button>
          <button 
            onClick={() => setIsBookMatch(!isBookMatch)}
            className={`flex items-center gap-1.5 transition-colors ${isBookMatch ? 'text-gold-accent font-bold' : isDarkMode ? 'hover:text-stone-200' : 'hover:text-stone-950'}`}
          >
            <Layers className="w-4 h-4" /> Book-Match Mirror
          </button>
          <button 
            onClick={() => setIsBacklit(!isBacklit)}
            className={`flex items-center gap-1.5 transition-colors ${isBacklit ? 'text-gold-accent font-bold' : isDarkMode ? 'hover:text-stone-200' : 'hover:text-stone-950'}`}
          >
            <Sun className="w-4 h-4" /> LED Backlight {isBacklit ? '(ON)' : '(OFF)'}
          </button>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme Toggle Button (Light/Dark) */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-2 rounded-full border transition-colors flex items-center justify-center ${isDarkMode ? 'bg-stone-900 border-stone-800 text-gold-accent' : 'bg-stone-100 border-stone-200 text-stone-700 hover:text-stone-950'}`}
            title="Toggle Light / Dark Mode"
          >
            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={() => navigate('/quote')}
            className="btn-accent px-4 py-2 rounded-full text-xs font-label-caps uppercase tracking-wider flex items-center gap-2 font-bold shadow-md"
          >
            Request Slab Quote <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-full border transition-colors ${isDarkMode ? 'bg-stone-900 border-stone-800 text-stone-300 hover:text-gold-accent' : 'bg-stone-100 border-stone-200 text-stone-700 hover:text-stone-950'}`}
            title="Full Screen Mode"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </header>

      {/* ── Main 3D Viewport Workspace ───────────────────────────────────── */}
      <div 
        ref={containerRef}
        className={`flex-1 relative flex flex-col md:flex-row overflow-hidden transition-colors duration-700 ${selectedEnv.bgClass}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Left Floating Slab Info Overlay */}
        <div className="absolute top-6 left-6 z-20 max-w-sm pointer-events-auto">
          <motion.div 
            key={selectedSlab.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-6 rounded-2xl backdrop-blur-xl border shadow-2xl transition-colors ${isDarkMode ? 'bg-stone-900/80 border-stone-800/80 text-stone-100' : 'bg-white/90 border-stone-200/90 text-stone-900'}`}
          >
            <span className="text-[10px] font-label-caps uppercase tracking-widest text-gold-accent font-bold">
              {selectedSlab.type} • {selectedSlab.origin}
            </span>
            <h1 className={`text-2xl font-headline-xl font-bold mt-1 mb-2 ${isDarkMode ? 'text-white' : 'text-stone-950'}`}>
              {selectedSlab.name}
            </h1>
            <p className={`text-xs leading-relaxed mb-4 ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>
              {selectedSlab.description}
            </p>

            <div className={`grid grid-cols-2 gap-2 text-xs font-label-caps border-t pt-3 ${isDarkMode ? 'border-stone-800/60 text-stone-400' : 'border-stone-200 text-stone-500'}`}>
              <div>
                <span className="block text-[10px] uppercase opacity-70">Hardness</span>
                <span className={`font-semibold ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{selectedSlab.specifications.hardness}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase opacity-70">Density</span>
                <span className={`font-semibold ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{selectedSlab.specifications.density}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase opacity-70">Est. Price</span>
                <span className="text-gold-accent font-bold">{selectedSlab.price}</span>
              </div>
              <div>
                <span className="block text-[10px] uppercase opacity-70">Finish</span>
                <span className={`font-semibold ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{finishMode}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Center 3D Interactive Canvas Box */}
        <div className="flex-1 relative flex items-center justify-center cursor-grab active:cursor-grabbing p-6 md:p-12">
          {/* Interactive Hint */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full border border-stone-700/80 text-xs font-label-caps tracking-widest flex items-center gap-2 pointer-events-none shadow-xl backdrop-blur-md bg-stone-900/80 text-stone-200">
            <Compass className="w-4 h-4 text-gold-accent animate-spin" style={{ animationDuration: '8s' }} />
            Click & Drag to Rotate 3D Slab • Scroll to Zoom
          </div>

          {/* 3D Perspective Slab Representation */}
          <motion.div
            className="relative transition-transform duration-100 ease-out"
            style={{
              transform: `perspective(1200px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${zoom})`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* The Slab Face */}
            <div className={`relative w-[340px] h-[480px] sm:w-[480px] sm:h-[640px] rounded-2xl overflow-hidden border-2 transition-all duration-500 ${isDarkMode ? 'border-stone-700/50' : 'border-stone-300/80 shadow-2xl'} ${getBacklightGlow()}`}>
              {/* Main Texture Image */}
              <img 
                src={currentImage} 
                alt={selectedSlab.name}
                className={`w-full h-full object-cover transition-opacity duration-700 ${finishMode === 'Honed' ? 'brightness-90 contrast-90' : finishMode === 'Leathered' ? 'brightness-95 contrast-125' : 'brightness-105'}`}
              />

              {/* Gloss / Sheen Reflection Overlay for Polished Finish */}
              {finishMode === 'Polished' && (
                <div 
                  className="absolute inset-0 pointer-events-none opacity-40 mix-blend-overlay"
                  style={{
                    background: `linear-gradient(${135 + rotationY}deg, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0) 60%)`
                  }}
                />
              )}

              {/* Book-Match Symmetrical Divider Line */}
              {isBookMatch && (
                <div className="absolute inset-y-0 left-1/2 w-0.5 bg-gold-accent/80 shadow-[0_0_10px_rgba(201,162,39,1)] z-10" />
              )}

              {/* Interactive 3D Hotspots */}
              {selectedSlab.hotspots.map((spot, idx) => (
                <div
                  key={idx}
                  style={{ top: `${spot.y}%`, left: `${spot.x}%` }}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 group"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHotspot(activeHotspot === idx ? null : idx);
                    }}
                    className={`w-7 h-7 rounded-full border-2 border-gold-accent text-gold-accent flex items-center justify-center font-bold text-xs shadow-xl group-hover:scale-125 transition-transform ${isDarkMode ? 'bg-stone-950/80' : 'bg-white'}`}
                  >
                    +
                  </button>

                  {/* Hotspot Tooltip */}
                  <AnimatePresence>
                    {activeHotspot === idx && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.9 }}
                        className={`absolute bottom-10 left-1/2 -translate-x-1/2 w-56 p-3.5 rounded-xl border border-gold-accent/40 backdrop-blur-md shadow-2xl text-left pointer-events-auto ${isDarkMode ? 'bg-stone-950/95 text-stone-100' : 'bg-white/95 text-stone-900'}`}
                      >
                        <p className="text-xs font-bold text-gold-accent mb-1">{spot.label}</p>
                        <p className={`text-[11px] leading-snug ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>{spot.detail}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {/* 3D Thickness Edge Slabs */}
            <div 
              className="absolute top-0 right-0 h-full border-l opacity-90 origin-right"
              style={{
                width: thickness === '30mm' ? '30px' : thickness === '20mm' ? '20px' : '16px',
                transform: `rotateY(90deg) translateZ(${thickness === '30mm' ? 15 : 10}px)`,
                background: isDarkMode ? 'linear-gradient(to right, #444, #111)' : 'linear-gradient(to right, #e5e5e5, #999)',
                borderColor: isDarkMode ? '#555' : '#ccc'
              }}
            />
            <div 
              className="absolute bottom-0 left-0 w-full border-t opacity-90 origin-bottom"
              style={{
                height: thickness === '30mm' ? '30px' : thickness === '20mm' ? '20px' : '16px',
                transform: `rotateX(-90deg) translateZ(${thickness === '30mm' ? 15 : 10}px)`,
                background: isDarkMode ? 'linear-gradient(to bottom, #333, #050505)' : 'linear-gradient(to bottom, #d4d4d4, #888)',
                borderColor: isDarkMode ? '#555' : '#ccc'
              }}
            />
          </motion.div>
        </div>

        {/* ── Right Floating Control Studio Panel ──────────────────────────── */}
        <div className={`w-full md:w-80 border-t md:border-t-0 md:border-l p-6 flex flex-col gap-6 overflow-y-auto z-20 transition-colors ${isDarkMode ? 'bg-stone-950/95 border-stone-800/80 text-stone-100' : 'bg-white border-stone-200/90 text-stone-900 shadow-xl'}`}>
          <div>
            <h3 className={`text-xs font-label-caps uppercase tracking-widest mb-3 flex items-center gap-2 ${isDarkMode ? 'text-stone-400' : 'text-stone-500 font-semibold'}`}>
              <Sliders className="w-4 h-4 text-gold-accent" /> Slab Customizer
            </h3>

            {/* Finish Mode Selector */}
            <div className="mb-4">
              <label className={`text-[11px] font-label-caps block mb-2 ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>Surface Finish</label>
              <div className={`grid grid-cols-3 gap-1.5 p-1 rounded-xl border text-xs ${isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-stone-100 border-stone-200'}`}>
                {['Polished', 'Honed', 'Leathered'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setFinishMode(f)}
                    className={`py-1.5 rounded-lg font-medium transition-colors ${finishMode === f ? (isDarkMode ? 'bg-gold-accent text-stone-950 font-bold' : 'bg-stone-900 text-white font-bold shadow-sm') : (isDarkMode ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-950')}`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Thickness Selector */}
            <div className="mb-4">
              <label className={`text-[11px] font-label-caps block mb-2 ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>Slab Thickness</label>
              <div className={`grid grid-cols-3 gap-1.5 p-1 rounded-xl border text-xs ${isDarkMode ? 'bg-stone-900 border-stone-800' : 'bg-stone-100 border-stone-200'}`}>
                {['16mm', '20mm', '30mm'].map((t) => (
                  <button
                    key={t}
                    onClick={() => setThickness(t)}
                    className={`py-1.5 rounded-lg font-medium transition-colors ${thickness === t ? (isDarkMode ? 'bg-stone-800 text-gold-accent font-bold border border-gold-accent/40' : 'bg-stone-900 text-white font-bold shadow-sm') : (isDarkMode ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-950')}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* LED Backlight Lighting Color */}
            <div className="mb-4">
              <label className={`text-[11px] font-label-caps block mb-2 ${isDarkMode ? 'text-stone-400' : 'text-stone-500'}`}>Backlight Spectrum</label>
              <div className="grid grid-cols-3 gap-1.5 text-xs">
                {[
                  { name: 'Warm Gold', colorClass: 'bg-amber-500' },
                  { name: 'Ice Blue', colorClass: 'bg-sky-400' },
                  { name: 'Neutral White', colorClass: 'bg-slate-300' }
                ].map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setIsBacklit(true);
                      setLightingColor(c.name);
                    }}
                    className={`p-2 rounded-xl border text-[11px] flex flex-col items-center gap-1 transition-all ${isBacklit && lightingColor === c.name ? 'border-gold-accent bg-gold-accent/10 font-bold text-gold-accent' : isDarkMode ? 'border-stone-800 bg-stone-900 text-stone-400 hover:border-stone-700' : 'border-stone-200 bg-stone-50 text-stone-600 hover:border-stone-300'}`}
                  >
                    <span className={`w-3 h-3 rounded-full ${c.colorClass}`} />
                    {c.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Slab Selection Library */}
          <div className="flex-1">
            <h3 className={`text-xs font-label-caps uppercase tracking-widest mb-3 flex items-center gap-2 ${isDarkMode ? 'text-stone-400' : 'text-stone-500 font-semibold'}`}>
              <Grid className="w-4 h-4 text-gold-accent" /> Marble Slabs ({SHOWROOM_SLABS.length})
            </h3>
            <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1">
              {SHOWROOM_SLABS.map((slab) => (
                <button
                  key={slab.id}
                  onClick={() => setSelectedSlab(slab)}
                  className={`w-full p-2.5 rounded-xl border flex items-center gap-3 text-left transition-all ${selectedSlab.id === slab.id ? (isDarkMode ? 'bg-stone-900 border-gold-accent text-white shadow-lg' : 'bg-stone-100 border-gold-accent text-stone-950 font-medium shadow-md') : (isDarkMode ? 'bg-stone-900/40 border-stone-800/80 text-stone-400 hover:border-stone-700 hover:text-stone-200' : 'bg-stone-50/70 border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900')}`}
                >
                  <img 
                    src={slab.image} 
                    alt={slab.name} 
                    className="w-12 h-12 rounded-lg object-cover border border-stone-200" 
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold truncate">{slab.name}</p>
                    <p className={`text-[10px] font-label-caps ${isDarkMode ? 'text-stone-500' : 'text-stone-400'}`}>{slab.origin}</p>
                  </div>
                  {selectedSlab.id === slab.id && <Check className="w-4 h-4 text-gold-accent shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className={`flex flex-col gap-2.5 pt-4 border-t ${isDarkMode ? 'border-stone-800/80' : 'border-stone-200'}`}>
            <button
              onClick={() => navigate('/quote')}
              className="btn-primary py-3 rounded-xl font-label-caps text-xs tracking-wider uppercase flex items-center justify-center gap-2 font-bold shadow-lg transition-transform hover:scale-[1.02]"
            >
              Order 3D Sample Slab
            </button>
            <button
              onClick={() => {
                navigator.clipboard?.writeText(window.location.href);
                alert('3D Showroom link copied to clipboard!');
              }}
              className={`py-2.5 rounded-xl border font-label-caps text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition-colors ${isDarkMode ? 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white' : 'bg-stone-100 border-stone-200 text-stone-700 hover:bg-stone-200 hover:text-stone-950'}`}
            >
              <Share2 className="w-3.5 h-3.5" /> Share 3D Vision
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
