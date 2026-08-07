import React, { useState, useRef, useMemo, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getAllCollectionItems, getCollectionDetail } from '../data/collections.js';
import axiosInstance from '../api/axiosInstance.js';
import { 
  Rotate3d, 
  Sun, 
  Moon,
  Maximize2, 
  Minimize2, 
  Check, 
  Share2, 
  Sliders, 
  Compass, 
  ArrowRight,
  ArrowLeft,
  Grid,
  ChevronDown,
  ChevronUp
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
    image: '/images/showroom_3d_marble_2.png',
    backlitImage: '/images/stone_image_18.jpg',
    bookmatchImage: '/images/stone_image_17.jpg',
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
  const [searchParams] = useSearchParams();
  const targetStoneId = searchParams.get('stoneId') || searchParams.get('stone');

  const [dbProducts, setDbProducts] = useState([]);

  useEffect(() => {
    const fetchDbProducts = async () => {
      try {
        const res = await axiosInstance.get('/inventory/products?limit=100');
        const data = res.data?.data;
        const list = Array.isArray(data) ? data : (data?.products || []);
        setDbProducts(list);
      } catch (err) {
        console.error('Failed to load DB products in showroom', err);
      }
    };
    fetchDbProducts();
  }, []);

  // Dynamic Slab List combining default showroom slabs + DB products + custom admin uploaded stones!
  const allSlabsList = useMemo(() => {
    const customItems = getAllCollectionItems();

    const formattedDbProducts = dbProducts.map((item) => ({
      id: item.slug || item.id || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rawId: item.id,
      slug: item.slug,
      name: item.name,
      origin: item.origin || 'Carrara, Italy',
      type: item.material || item.category?.name || 'Italian Marble',
      finish: item.finish || (Array.isArray(item.finishes) ? item.finishes[0] : 'Polished'),
      price: item.pricePerSqft ? `$${item.pricePerSqft} / sq ft` : (item.price ? `$${item.price} / sq ft` : '$45 / sq ft'),
      image: item.image || '/images/showroom_3d_marble.png',
      backlitImage: item.image || '/images/showroom_3d_marble.png',
      bookmatchImage: item.image || '/images/showroom_3d_marble.png',
      description: item.description || `${item.name} is a luxury natural marble slab curated for high-end interior spaces.`,
      specifications: {
        hardness: '3.5 Mohs',
        waterAbs: '0.12%',
        density: '2,710 kg/m³',
        thicknessAvailable: ['16mm', '20mm', '30mm'],
      },
      hotspots: [
        { x: 45, y: 40, label: 'Natural Vein Pattern', detail: 'High-density mineral formation.' },
        { x: 65, y: 60, label: 'Reflective Surface', detail: 'Diamond-grit polished finish.' },
      ]
    }));

    const formattedCustom = customItems.map((item) => ({
      id: item.id || item.slug || item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rawId: item.id,
      slug: item.slug,
      name: item.name,
      origin: item.origin || 'International Reserve',
      type: item.category || 'Marble Collection',
      finish: Array.isArray(item.finishes) ? item.finishes[0] : (item.finish || 'Polished'),
      price: '$45 / sq ft',
      image: item.image || '/images/showroom_3d_marble.png',
      backlitImage: item.image || '/images/showroom_3d_marble.png',
      bookmatchImage: item.image || '/images/showroom_3d_marble.png',
      description: item.description || `${item.name} is a luxury natural marble slab curated for high-end interior spaces.`,
      specifications: {
        hardness: '3.5 Mohs',
        waterAbs: item.waterAbsorption || '0.12%',
        density: item.density || '2,710 kg/m³',
        thicknessAvailable: ['16mm', '20mm', '30mm'],
      },
      hotspots: [
        { x: 45, y: 40, label: 'Natural Vein Pattern', detail: 'High-density mineral formation.' },
        { x: 65, y: 60, label: 'Reflective Surface', detail: 'Diamond-grit polished finish.' },
      ]
    }));

    const existingIds = new Set(SHOWROOM_SLABS.map((s) => s.id));
    const uniqueDb = formattedDbProducts.filter((p) => !existingIds.has(p.id));
    const uniqueCustom = formattedCustom.filter((c) => !existingIds.has(c.id) && !uniqueDb.some((d) => d.id === c.id));
    return [...SHOWROOM_SLABS, ...uniqueDb, ...uniqueCustom];
  }, [dbProducts]);

  const findMatchingSlab = (targetId, list) => {
    if (!targetId || !list || list.length === 0) return null;
    const lowerTarget = String(targetId).toLowerCase().trim();
    const targetSlug = lowerTarget.replace(/[^a-z0-9]+/g, '-');

    const found = list.find((s) => {
      if (!s) return false;
      const sId = String(s.id || '').toLowerCase();
      const sRawId = String(s.rawId || '').toLowerCase();
      const sSlug = String(s.slug || '').toLowerCase();
      const sName = String(s.name || '').toLowerCase();
      const sNameSlug = sName.replace(/[^a-z0-9]+/g, '-');
      return (
        sId === lowerTarget ||
        sRawId === lowerTarget ||
        sSlug === lowerTarget ||
        sName === lowerTarget ||
        sNameSlug === targetSlug ||
        sId === targetSlug ||
        sId.includes(lowerTarget) ||
        lowerTarget.includes(sId) ||
        sName.includes(lowerTarget) ||
        lowerTarget.includes(sName)
      );
    });

    if (found) return found;

    // Dynamic fallback for any catalog product detail slug
    const detail = getCollectionDetail(targetId);
    if (detail && detail.name) {
      const img = detail.images?.main || detail.image || '/images/showroom_3d_marble.png';
      return {
        id: detail.id || targetSlug,
        name: detail.name,
        origin: detail.origin || 'International Reserve',
        type: detail.categoryLabel ? detail.categoryLabel.replace('Collections / ', '') : 'Natural Stone',
        finish: (detail.finishes && detail.finishes[0]) || 'Polished',
        price: '$45 / sq ft',
        image: img,
        backlitImage: img,
        bookmatchImage: img,
        description: detail.description || `${detail.name} is a luxury natural marble slab.`,
        specifications: {
          hardness: '3.5 Mohs',
          waterAbs: '0.12%',
          density: '2,710 kg/m³',
          thicknessAvailable: ['16mm', '20mm', '30mm'],
        },
        hotspots: [
          { x: 45, y: 40, label: 'Natural Vein Pattern', detail: 'High-density mineral formation.' },
          { x: 65, y: 60, label: 'Reflective Surface', detail: 'Diamond-grit polished finish.' },
        ]
      };
    }

    return null;
  };

  const initialSlab = useMemo(() => {
    if (targetStoneId) {
      const found = findMatchingSlab(targetStoneId, allSlabsList);
      if (found) return found;
    }
    return allSlabsList[0];
  }, [targetStoneId, allSlabsList]);

  const [isDarkMode, setIsDarkMode] = useState(false); // Default: White / Light Mode!
  const [selectedSlab, setSelectedSlab] = useState(initialSlab);

  useEffect(() => {
    if (targetStoneId) {
      const found = findMatchingSlab(targetStoneId, allSlabsList);
      if (found) setSelectedSlab(found);
    }
  }, [targetStoneId, allSlabsList]);
  
  const environments = isDarkMode ? ENVIRONMENTS_DARK : ENVIRONMENTS_LIGHT;
  const [selectedEnv, setSelectedEnv] = useState(environments[0]);
  
  // 3D View Controls State
  const [rotationX, setRotationX] = useState(12);
  const [rotationY, setRotationY] = useState(-15);
  const [zoom, setZoom] = useState(0.7);
  const [finishMode, setFinishMode] = useState('Polished');
  const [thickness, setThickness] = useState('20mm');
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isInfoCollapsed, setIsInfoCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const containerRef = useRef(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

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
    setZoom(0.7);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Determine current texture image
  const currentImage = selectedSlab.image;

  // Backlight glow shadow class
  const getBacklightGlow = () => 'shadow-2xl';

  return (
    <div className={`h-screen max-h-screen w-screen overflow-hidden flex flex-col font-sans select-none transition-colors duration-300 ${isDarkMode ? 'bg-stone-950 text-stone-100' : 'bg-[#fcf9f8] text-stone-900'}`}>
      
      {/* ── Top Header Navigation ─────────────────────────────────────────── */}
      {!isFullscreen && (
        <header className={`h-16 shrink-0 border-b px-6 flex items-center justify-between backdrop-blur-md sticky top-0 z-50 transition-colors ${isDarkMode ? 'bg-stone-950/90 border-stone-800/80' : 'bg-white/90 border-stone-200/90 shadow-sm'}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-bold transition-all shadow-sm ${
                isDarkMode
                  ? 'bg-stone-900 border-stone-800 text-stone-300 hover:text-white hover:border-stone-700 hover:bg-stone-800'
                  : 'bg-stone-100 border-stone-200 text-stone-700 hover:text-stone-950 hover:bg-stone-200'
              }`}
              title="Go Back"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-full bg-gold-accent flex items-center justify-center text-stone-950 font-bold group-hover:scale-105 transition-transform">
                M
              </div>
              <span className={`font-headline-xl text-xl font-bold tracking-tight ${isDarkMode ? 'text-stone-100' : 'text-stone-900'}`}>
                Marble<span className="text-gold-accent">Craft</span> 3D
              </span>
            </Link>
            <span className="text-xs px-2.5 py-1 rounded-full bg-gold-accent/10 text-gold-accent border border-gold-accent/30 font-label-caps uppercase tracking-wider font-semibold hidden sm:inline-block">
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
      )}

      {/* ── Main 3D Viewport Workspace ───────────────────────────────────── */}
      <div 
        ref={containerRef}
        className={`flex-1 min-h-0 relative flex flex-col md:flex-row overflow-hidden transition-colors duration-700 ${selectedEnv.bgClass}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Left Floating Slab Info Overlay (Compact & Collapsible) */}
        <div className="absolute top-4 left-4 z-20 max-w-[240px] sm:max-w-xs pointer-events-auto">
          <motion.div 
            key={selectedSlab.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={`p-3 sm:p-4 rounded-xl backdrop-blur-xl border shadow-xl transition-all ${isDarkMode ? 'bg-stone-900/80 border-stone-800/80 text-stone-100' : 'bg-white/90 border-stone-200/90 text-stone-900'}`}
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <span className="text-[9px] font-label-caps uppercase tracking-wider text-gold-accent font-bold truncate">
                {selectedSlab.type} • {selectedSlab.origin}
              </span>
              <button
                onClick={() => setIsInfoCollapsed(!isInfoCollapsed)}
                className="p-1 rounded-md hover:bg-stone-500/20 text-stone-400 hover:text-gold-accent transition-colors shrink-0"
                title={isInfoCollapsed ? "Expand Details" : "Collapse Card"}
              >
                {isInfoCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
            </div>

            <h1 className={`text-sm sm:text-base font-serif font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-stone-950'}`}>
              {selectedSlab.name}
            </h1>

            {!isInfoCollapsed && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                <p className={`text-[11px] leading-snug my-2 line-clamp-2 ${isDarkMode ? 'text-stone-300' : 'text-stone-600'}`}>
                  {selectedSlab.description}
                </p>

                <div className={`grid grid-cols-2 gap-1.5 text-[10px] font-label-caps border-t pt-2 mt-2 ${isDarkMode ? 'border-stone-800/60 text-stone-400' : 'border-stone-200 text-stone-500'}`}>
                  <div>
                    <span className="block text-[9px] uppercase opacity-70">Hardness</span>
                    <span className={`font-semibold ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{selectedSlab.specifications.hardness}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase opacity-70">Density</span>
                    <span className={`font-semibold ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{selectedSlab.specifications.density}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase opacity-70">Est. Price</span>
                    <span className="text-gold-accent font-bold">{selectedSlab.price}</span>
                  </div>
                  <div>
                    <span className="block text-[9px] uppercase opacity-70">Finish</span>
                    <span className={`font-semibold ${isDarkMode ? 'text-stone-200' : 'text-stone-800'}`}>{finishMode}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Center 3D Interactive Canvas Box */}
        <div className="flex-1 relative flex items-center justify-center cursor-grab active:cursor-grabbing p-6 md:p-12">
          {/* Interactive Hint */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full border border-stone-700/80 text-xs font-label-caps tracking-widest flex items-center gap-2 pointer-events-none shadow-xl backdrop-blur-md bg-stone-900/80 text-stone-200">
            <Compass className="w-4 h-4 text-gold-accent animate-spin" style={{ animationDuration: '8s' }} />
            Click & Drag to Rotate 3D Slab • Use − / + to Zoom
          </div>

          {/* Floating Zoom & Full View Control Bar */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-stone-900/90 backdrop-blur-md border border-stone-700/80 px-4 py-2 rounded-full shadow-2xl text-stone-200 text-xs">
            <button
              onClick={() => setZoom((prev) => Math.max(0.5, parseFloat((prev - 0.1).toFixed(2))))}
              className="w-6 h-6 rounded-full hover:bg-stone-800 flex items-center justify-center font-bold text-gold-accent transition-colors"
              title="Zoom Out (-)"
            >
              −
            </button>
            <span className="font-mono text-[11px] min-w-[42px] text-center font-semibold">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom((prev) => Math.min(1.8, parseFloat((prev + 0.1).toFixed(2))))}
              className="w-6 h-6 rounded-full hover:bg-stone-800 flex items-center justify-center font-bold text-gold-accent transition-colors"
              title="Zoom In (+)"
            >
              +
            </button>
            <button
              onClick={resetCamera}
              className="ml-1 pl-2.5 border-l border-stone-700/80 text-[11px] hover:text-gold-accent font-semibold transition-colors"
              title="Reset View"
            >
              Reset
            </button>
            <button
              onClick={toggleFullscreen}
              className="ml-1 pl-2.5 border-l border-stone-700/80 text-gold-accent hover:text-amber-300 font-bold flex items-center gap-1.5 transition-colors"
              title={isFullscreen ? "Exit Full Screen" : "Full View (Full Screen)"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
              <span>{isFullscreen ? "Exit Full View" : "Full View"}</span>
            </button>
          </div>

          {/* 3D Perspective Slab Representation (Unified Solid Cuboid) */}
          <motion.div
            className="relative w-[340px] h-[360px] sm:w-[560px] sm:h-[440px] md:w-[640px] md:h-[460px] lg:w-[720px] lg:h-[480px] transition-transform duration-100 ease-out"
            style={{
              transform: `perspective(1200px) rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${zoom})`,
              transformStyle: 'preserve-3d',
            }}
          >
            {/* 1. Front Slab Face (Z = 0) */}
            <div 
              className={`absolute inset-0 rounded-2xl overflow-hidden border-2 transition-all duration-500 ${isDarkMode ? 'border-stone-700/50' : 'border-stone-300/80 shadow-2xl'} ${getBacklightGlow()}`}
              style={{ 
                transform: 'translateZ(0px)',
                backfaceVisibility: 'hidden', 
                WebkitBackfaceVisibility: 'hidden' 
              }}
            >
              {/* Main Texture Image with Dynamic Finish Filter */}
              <img 
                src={currentImage} 
                alt={selectedSlab.name}
                onError={(e) => { e.currentTarget.src = '/images/showroom_3d_marble.png'; }}
                className={`w-full h-full object-cover transition-all duration-500 ${
                  finishMode === 'Polished'
                    ? 'brightness-110 contrast-110 saturate-[1.08]'
                    : finishMode === 'Honed'
                    ? 'brightness-95 contrast-95 saturate-[0.88] sepia-[0.03]'
                    : 'brightness-105 contrast-140 saturate-[1.15]'
                }`}
              />

              {/* Polished Finish: Ultra High-Gloss Specular Reflection Sweeps */}
              {finishMode === 'Polished' && (
                <>
                  <div 
                    className="absolute inset-0 pointer-events-none transition-all duration-300 z-10"
                    style={{
                      background: `linear-gradient(${120 + rotationY * 1.5}deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.2) 30%, rgba(255,255,255,0) 70%)`,
                      mixBlendMode: 'overlay'
                    }}
                  />
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-40 z-10"
                    style={{
                      background: `radial-gradient(circle at ${50 + rotationY * 0.8}% ${30 + rotationX * 0.8}%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0) 55%)`,
                      mixBlendMode: 'color-dodge'
                    }}
                  />
                </>
              )}

              {/* Honed Finish: Soft Satin Matte Eggshell Diffuse Layer */}
              {finishMode === 'Honed' && (
                <div 
                  className="absolute inset-0 pointer-events-none transition-all duration-500 z-10"
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.12) 0%, rgba(0,0,0,0.12) 100%)',
                    mixBlendMode: 'soft-light'
                  }}
                />
              )}

              {/* Leathered Finish: Tactile Embossed 3D Pebble Grain & Relief Shadows */}
              {finishMode === 'Leathered' && (
                <>
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-50 mix-blend-overlay transition-all duration-500 z-10"
                    style={{
                      backgroundImage: `radial-gradient(#000 0.8px, transparent 0.8px), radial-gradient(#fff 0.8px, transparent 0.8px)`,
                      backgroundSize: '10px 10px',
                      backgroundPosition: '0 0, 5px 5px',
                      filter: 'contrast(170%)'
                    }}
                  />
                  <div 
                    className="absolute inset-0 pointer-events-none opacity-40 transition-all duration-500 z-10"
                    style={{
                      background: `linear-gradient(${45 + rotationY}deg, rgba(0,0,0,0.45) 0%, transparent 45%, rgba(255,255,255,0.25) 100%)`,
                      mixBlendMode: 'multiply'
                    }}
                  />
                </>
              )}

              {/* Active Finish Indicator Badge on Top Corner */}
              <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-[10px] font-bold tracking-wider text-white uppercase shadow-lg flex items-center gap-1.5 pointer-events-none">
                <span className={`w-2 h-2 rounded-full ${finishMode === 'Polished' ? 'bg-amber-400 animate-pulse' : finishMode === 'Honed' ? 'bg-slate-300' : 'bg-amber-600'}`} />
                {finishMode === 'Polished' ? 'Polished High-Gloss Mirror' : finishMode === 'Honed' ? 'Honed Satin Matte' : 'Leathered 3D Relief'}
              </div>

            </div>

            {/* 2. Back Face (Z = -depth, facing backward) */}
            <div 
              className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none border-2"
              style={{
                transform: `translateZ(-${thickness === '30mm' ? 24 : thickness === '20mm' ? 16 : 10}px) rotateY(180deg)`,
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                borderColor: isDarkMode ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.15)'
              }}
            >
              <img 
                src={currentImage} 
                alt="Slab back face" 
                className="w-full h-full object-cover brightness-70 contrast-110 scale-x-[-1]" 
              />
              <div 
                className="absolute inset-0"
                style={{
                  background: isDarkMode 
                    ? 'linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.85))' 
                    : 'linear-gradient(to bottom, rgba(0,0,0,0.25), rgba(0,0,0,0.45))'
                }}
              />
            </div>

            {/* 3. Right 3D Side Edge */}
            <div 
              className="absolute top-4 bottom-4 left-full overflow-hidden pointer-events-none"
              style={{
                width: `${thickness === '30mm' ? 24 : thickness === '20mm' ? 16 : 10}px`,
                transformOrigin: 'left center',
                transform: 'rotateY(90deg)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                borderLeft: isDarkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.2)'
              }}
            >
              <img 
                src={currentImage} 
                alt="Slab right edge" 
                className="w-full h-full object-cover brightness-75 contrast-125 scale-x-150" 
              />
              <div 
                className="absolute inset-0"
                style={{
                  background: isDarkMode 
                    ? 'linear-gradient(to right, rgba(0,0,0,0.4), rgba(0,0,0,0.85))' 
                    : 'linear-gradient(to right, rgba(255,255,255,0.2), rgba(0,0,0,0.5))'
                }}
              />
            </div>

            {/* 4. Left 3D Side Edge */}
            <div 
              className="absolute top-4 bottom-4 right-full overflow-hidden pointer-events-none"
              style={{
                width: `${thickness === '30mm' ? 24 : thickness === '20mm' ? 16 : 10}px`,
                transformOrigin: 'right center',
                transform: 'rotateY(-90deg)',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
                borderRight: isDarkMode ? '1px solid rgba(255,255,255,0.2)' : '1px solid rgba(0,0,0,0.2)'
              }}
            >
              <img 
                src={currentImage} 
                alt="Slab left edge" 
                className="w-full h-full object-cover brightness-75 contrast-125 scale-x-150" 
              />
              <div 
                className="absolute inset-0"
                style={{
                  background: isDarkMode 
                    ? 'linear-gradient(to left, rgba(0,0,0,0.4), rgba(0,0,0,0.85))' 
                    : 'linear-gradient(to left, rgba(255,255,255,0.2), rgba(0,0,0,0.5))'
                }}
              />
            </div>
          </motion.div>
        </div>

        {/* ── Right Floating Control Studio Panel ──────────────────────────── */}
        {!isFullscreen && (
          <div className={`w-full md:w-80 h-full border-t md:border-t-0 md:border-l p-6 flex flex-col gap-6 overflow-y-auto z-20 shrink-0 transition-colors ${isDarkMode ? 'bg-stone-950/95 border-stone-800/80 text-stone-100' : 'bg-white border-stone-200/90 text-stone-900 shadow-xl'}`}>
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
          </div>

          {/* Slab Selection Library */}
          <div className="flex-1">
            <h3 className={`text-xs font-label-caps uppercase tracking-widest mb-3 flex items-center gap-2 ${isDarkMode ? 'text-stone-400' : 'text-stone-500 font-semibold'}`}>
              <Grid className="w-4 h-4 text-gold-accent" /> Marble Slabs ({allSlabsList.length})
            </h3>
            <div className="flex flex-col gap-2.5 max-h-72 overflow-y-auto pr-1">
              {allSlabsList.map((slab) => (
                <button
                  key={slab.id}
                  onClick={() => setSelectedSlab(slab)}
                  className={`w-full p-2.5 rounded-xl border flex items-center gap-3 text-left transition-all ${selectedSlab.id === slab.id ? (isDarkMode ? 'bg-stone-900 border-gold-accent text-white shadow-lg' : 'bg-stone-100 border-gold-accent text-stone-950 font-medium shadow-md') : (isDarkMode ? 'bg-stone-900/40 border-stone-800/80 text-stone-400 hover:border-stone-700 hover:text-stone-200' : 'bg-stone-50/70 border-stone-200 text-stone-600 hover:bg-stone-100 hover:text-stone-900')}`}
                >
                  <img 
                    src={slab.image} 
                    alt={slab.name} 
                    onError={(e) => { e.currentTarget.src = '/images/showroom_3d_marble.png'; }}
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
      )}
    </div>
  </div>
);
}
