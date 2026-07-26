import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  PlayCircle, 
  ArrowRight, 
  Grid, 
  Palette, 
  Layers, 
  Compass, 
  Box, 
  Factory, 
  BadgeCheck,
  Rotate3d,
  Play,
  Diamond,
  ChevronDown
} from 'lucide-react';
import ScrollReveal from '../components/ui/ScrollReveal.jsx';

// ── Announcement Bar ───────────────────────────────────────────────────
function AnnouncementBar() {
  return (
    <div className="bg-primary text-on-primary py-2 px-4 text-center font-label-caps text-[11px] tracking-wider relative z-[60] mt-[-80px] mb-[80px]">
      Experience the new Calacatta Gold collection.{' '}
      <Link to="/collection" className="underline hover:text-gold-accent transition-colors ml-2">
        View Gallery
      </Link>
    </div>
  );
}

// ── Hero Section ────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <header className="relative w-full h-[100vh] min-h-[800px] flex items-center justify-center pt-20 overflow-hidden">
      {/* Background Image with Slow Zoom */}
      <div className="absolute inset-0 z-0 scale-105 transform animate-subtleZoom">
        <img 
          className="w-full h-full object-cover object-center" 
          alt="Architectural marble wall" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbKc30gK8OagaSf-MHpeBpOY8FuDXGYhRTnpumFPj309RzQzLTPPlyDXVPht8tM-aN8xqWyuf05dOchK2gmgtU9mz7a-NtP65lLHMCvCLaE179YWTZg0jsJULXgB0ti12eJiDAJw7PCb4XqD-XWVpVhzFNVy8UmvyboDcwgbB91U2FpoKX-Z8_t3dNsp0TnnWJT0RbZco-ozhKMigKHHAlNsgWoZkZR32tDxX48jdQJLzYldCF-3x1"
        />
        <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]"></div>
      </div>

      {/* Hero Content */}
      <div className="relative z-10 w-full max-w-[1440px] px-margin-mobile md:px-margin-desktop text-center md:text-left flex flex-col md:flex-row items-center md:items-end justify-between pb-20">
        <ScrollReveal className="max-w-3xl">
          <p className="font-label-caps text-label-caps text-black/80 tracking-[0.2em] mb-6 uppercase font-bold">
            Excellence in Stone Heritage
          </p>
          <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-[88px] text-black leading-[1.05] tracking-[-0.03em] mb-8 font-semibold">
            Timeless Luxury<br/>Crafted in Nature.
          </h1>
          <p className="font-body-lg text-[20px] text-black/90 mb-10 max-w-xl font-medium">
            Premium Marble, Granite & Quartz for Exceptional Spaces. Elevating architecture through heritage craftsmanship.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link 
              to="/collection" 
              className="bg-white text-black px-8 py-4 font-label-caps text-label-caps rounded-full w-full sm:w-auto tracking-widest uppercase hover:bg-gold-accent hover:text-white transition-all duration-400 text-center"
            >
              Explore Collection
            </Link>
            <button className="btn-accent px-8 py-4 font-label-caps text-label-caps rounded-full w-full sm:w-auto tracking-widest uppercase flex items-center justify-center gap-2">
              <PlayCircle className="w-5 h-5" />
              Watch Our Story
            </button>
          </div>
        </ScrollReveal>

        {/* Animated Statistics */}
        <div className="hidden md:flex flex-col gap-8">
          <ScrollReveal delay={0.2}>
            <div className="glass-panel p-6 rounded-2xl border-white/20 text-white min-w-[160px]">
              <p className="font-display-lg text-4xl font-light mb-1">25<span className="text-gold-accent">+</span></p>
              <p className="font-label-caps text-[10px] text-white/70 uppercase tracking-widest">Years Heritage</p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.4}>
            <div className="glass-panel p-6 rounded-2xl border-white/20 text-white min-w-[160px]">
              <p className="font-display-lg text-4xl font-light mb-1">5k<span className="text-gold-accent">+</span></p>
              <p className="font-label-caps text-[10px] text-white/70 uppercase tracking-widest">Global Projects</p>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Scroll Indicator */}
      <ScrollReveal delay={0.6} className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-white/60">
        <span className="font-label-caps text-[10px] tracking-widest uppercase">Scroll</span>
        <div className="w-[1px] h-12 bg-gradient-to-b from-white/60 to-transparent"></div>
      </ScrollReveal>
    </header>
  );
}

// ── Interactive Stone Finder ──────────────────────────────────────────
function StoneFinder() {
  return (
    <section className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <ScrollReveal className="flex flex-col md:flex-row justify-between items-end mb-16">
        <div className="max-w-2xl">
          <p className="font-label-caps text-gold-accent tracking-[0.2em] mb-4 uppercase">Discover Your Material</p>
          <h2 className="font-headline-xl text-[56px] text-primary leading-tight mb-4 tracking-[-0.02em]">Interactive Stone Finder</h2>
          <p className="font-body-lg text-on-surface-variant">Filter our expansive inventory to find the perfect match for your architectural vision.</p>
        </div>
        <Link to="/collection" className="hidden md:inline-flex items-center gap-2 font-label-caps text-primary hover:text-gold-accent transition-colors border-b border-primary hover:border-gold-accent pb-1 uppercase tracking-widest mt-6">
          View All Materials <ArrowRight className="w-4 h-4" />
        </Link>
      </ScrollReveal>

      {/* Filter Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <ScrollReveal delay={0.1}>
          <div className="bg-surface-container-low p-6 rounded-[24px] border border-outline-variant/30 flex justify-between items-center cursor-pointer hover:bg-white hover:shadow-xl transition-all duration-400 group">
            <div>
              <p className="font-label-caps text-on-surface-variant mb-1">Filter by</p>
              <h3 className="text-headline-lg text-2xl text-primary font-medium" style={{fontFamily: 'Inter'}}>Material Type</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-white group-hover:bg-gold-accent flex items-center justify-center transition-colors soft-shadow">
              <Grid className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="bg-surface-container-low p-6 rounded-[24px] border border-outline-variant/30 flex justify-between items-center cursor-pointer hover:bg-white hover:shadow-xl transition-all duration-400 group">
            <div>
              <p className="font-label-caps text-on-surface-variant mb-1">Filter by</p>
              <h3 className="text-headline-lg text-2xl text-primary font-medium" style={{fontFamily: 'Inter'}}>Color Palette</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-white group-hover:bg-gold-accent flex items-center justify-center transition-colors soft-shadow">
              <Palette className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="bg-surface-container-low p-6 rounded-[24px] border border-outline-variant/30 flex justify-between items-center cursor-pointer hover:bg-white hover:shadow-xl transition-all duration-400 group">
            <div>
              <p className="font-label-caps text-on-surface-variant mb-1">Filter by</p>
              <h3 className="text-headline-lg text-2xl text-primary font-medium" style={{fontFamily: 'Inter'}}>Surface Finish</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-white group-hover:bg-gold-accent flex items-center justify-center transition-colors soft-shadow">
              <Layers className="w-6 h-6 text-primary group-hover:text-white transition-colors" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ── Featured Collections Bento Grid ───────────────────────────────────
function MasterpieceCollections() {
  return (
    <section className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop pb-section-gap">
      <ScrollReveal className="mb-16 text-center">
        <p className="font-label-caps text-gold-accent tracking-[0.2em] mb-4 uppercase">Curated Selection</p>
        <h2 className="font-headline-xl text-[56px] text-primary leading-tight mb-4 tracking-[-0.02em]">Masterpiece Collections</h2>
        <p className="font-body-md text-body-md text-on-surface-variant max-w-xl mx-auto">Sourced from the world's finest quarries, offering unparalleled aesthetic depth for high-end interiors.</p>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter auto-rows-[400px]">
        {/* Italian Marble (Large Spanning) */}
        <ScrollReveal className="md:col-span-2 md:row-span-2 relative hover-zoom overflow-hidden rounded-[24px] group block" delay={0.1}>
          <Link to="/collection/italian-marble" className="w-full h-full block">
            <img 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-out" 
              alt="Italian Marble" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCGn_m5W-ORAuoblicMxz9c9Aq4dWV897SGVAqVj_eK1gsCiaAVs559K0WZ83Cg9vNaTY-iJdVJxSeR7G3DxP38lEZuhc_qG7KaboS6sz0J9zovA_x4uFth4YV6P8-U-JiBmHFydehhtDbPXz3o2P5pxmmNZbaDpMfVka6QAxA58z0ZLk5bFOHwzLZcHW2HLFtW7x8gEZYg6j6aVA58DEIaPKvlqStYkZAgmi2ot3lDrT5MySSIhFgQ"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full p-10 glass-panel border-t-0 border-l-0 border-r-0 border-b-0 rounded-b-[24px] translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
              <h3 className="font-headline-xl text-4xl text-white mb-2">Italian Marble</h3>
              <p className="font-body-lg text-white/80 max-w-md">The pinnacle of classical elegance, sourced directly from historic Carrara quarries.</p>
              <button className="mt-6 text-white text-sm uppercase tracking-widest border-b border-gold-accent pb-1 group-hover:text-gold-accent transition-colors">Explore Category</button>
            </div>
          </Link>
        </ScrollReveal>

        {/* Granite */}
        <ScrollReveal className="md:col-span-1 md:row-span-1 relative hover-zoom overflow-hidden rounded-[24px] group" delay={0.2}>
          <Link to="/collection/granite" className="w-full h-full block">
            <img 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-out" 
              alt="Granite" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiP9gEBDNDBUC0s4bLA9jw_9NcLFsUzWy_KT7ImshXIjRJcJNt3NMm5e846lWy7Q1rlVOEeRjJDINsppkXzT5Md-dg5JGuljnOMGTLlW2ucwEvGJyhn2FItV-CU9D3yn-7tD5a63ANjs1D60KqQpAYtWO9_yBWTiYFivur2CysxudzHb5BZp1Gi81y6kuzXd7rC0QPadhYctFMHpYvwUOBswg-MM8AKZezA8x0rkIpX6b4CT0tYhOG"
            />
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-6 left-6 right-6 glass-panel p-6 rounded-[16px] backdrop-blur-md">
              <h3 className="text-headline-lg text-2xl text-white font-medium mb-1" style={{fontFamily:'Inter'}}>Granite</h3>
              <p className="text-white/70 text-sm">Industrial permanence.</p>
            </div>
          </Link>
        </ScrollReveal>

        {/* Quartz */}
        <ScrollReveal className="md:col-span-1 md:row-span-1 relative hover-zoom overflow-hidden rounded-[24px] group" delay={0.3}>
          <Link to="/collection/quartz" className="w-full h-full block">
            <img 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-out" 
              alt="Quartz" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBsC5kmkeTy4P1VVa7n_yURcGipHPosMts376dGn7vp-3v6P6rXMJvW-PUBD9sOENPD8OPDW9SJtaO4Y7oFnPEf-ukTfBtA3gwlVv4v-36CL0wqk-BpDx2i_FKUwMBncFq-WG-sLtnSE29SKyBh8HbL10mgyPaF6lu0D8lhWEEI2LE5oIoL1z1oP9eCnaFie4KZ-dnzoPX-R7o6gJFhyXWLOOdL9J9qgEd6vn5LXq6MgNZ3QKCmmhQ3"
            />
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute bottom-6 left-6 right-6 glass-panel p-6 rounded-[16px] backdrop-blur-md">
              <h3 className="text-headline-lg text-2xl text-primary font-medium mb-1" style={{fontFamily:'Inter'}}>Quartz</h3>
              <p className="text-primary/70 text-sm">Engineered perfection.</p>
            </div>
          </Link>
        </ScrollReveal>

        {/* Onyx */}
        <ScrollReveal className="md:col-span-2 md:row-span-1 relative hover-zoom overflow-hidden rounded-[24px] group" delay={0.2}>
          <Link to="/collection/onyx" className="w-full h-full block">
            <img 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-out" 
              alt="Onyx" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA0T0IANfSNoNEL6OGm9ajgrAQsc1HJqRL2evC2zpiqxYE3lf9AaLXPwkQWVC8XMIDQ9AfiaV6t9XQZWnp93KShlKkjFAFdcx03_2bXMP-h7yprKlIhj3vT1VTz-eBSI5461Vi70VeG0awDNQQq1IX6f5CbZi7R9xOPb8I6pPSIH9qd9lg5u2PGtSovABI1pXt--FxCvFe2fp3TidneF_i1wcf4P7NcVDWIwbRoTzrY0xl5vfKn0WUN"
            />
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-8 left-8 right-8 glass-panel p-8 rounded-[16px] flex justify-between items-center backdrop-blur-md">
              <div>
                <h3 className="text-headline-lg text-3xl text-white mb-2" style={{fontFamily:'Inter'}}>Onyx</h3>
                <p className="font-body-md text-white/80">Backlit brilliance for dramatic installations.</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white backdrop-blur-lg group-hover:bg-gold-accent transition-colors">
                <ArrowRight className="w-6 h-6" />
              </div>
            </div>
          </Link>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ── Manufacturing Excellence Timeline ────────────────────────────────
function ProcessTimeline() {
  const steps = [
    { icon: Compass, title: '1. Quarry Selection', desc: 'Expert sourcing from exclusive global reserves.' },
    { icon: Box, title: '2. Block Inspection', desc: 'Rigorous structural and aesthetic analysis.' },
    { icon: Factory, title: '3. CNC Fabrication', desc: 'Millimeter-precise cutting and edge profiling.' },
    { icon: BadgeCheck, title: '4. Final Polish', desc: 'Artisanal finishing for the perfect surface gloss.' }
  ];

  return (
    <section className="bg-primary text-white py-section-gap overflow-hidden relative">
      {/* Abstract background texture */}
      <div 
        className="absolute inset-0 opacity-10" 
        style={{
          backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #111 25%, #111 75%, #000 75%, #000)',
          backgroundPosition: '0 0, 10px 10px',
          backgroundSize: '20px 20px'
        }}
      />
      <div className="max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop relative z-10">
        <ScrollReveal className="text-center mb-20">
          <p className="font-label-caps text-gold-accent tracking-[0.2em] mb-4 uppercase">The Process</p>
          <h2 className="font-headline-xl text-[56px] leading-tight mb-4 tracking-[-0.02em]">Manufacturing Excellence</h2>
          <p className="font-body-lg text-white/70 max-w-2xl mx-auto">From pristine quarries to flawless installations, our meticulous process ensures uncompromising quality at every stage.</p>
        </ScrollReveal>

        <ScrollReveal delay={0.2} className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-white/20 -translate-y-1/2"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {steps.map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={idx} className="relative flex flex-col items-center text-center group">
                  <div className={`w-16 h-16 rounded-full bg-[#1a1a1a] border-2 flex items-center justify-center mb-6 z-10 transition-all duration-400
                    ${idx === 0 ? 'border-gold-accent shadow-[0_0_20px_rgba(201,162,39,0.3)] group-hover:scale-110' : 'border-white/30 group-hover:border-gold-accent'}
                  `}>
                    <Icon className={`w-6 h-6 ${idx === 0 ? 'text-gold-accent' : 'text-white/70 group-hover:text-gold-accent transition-colors'}`} />
                  </div>
                  <h4 className="text-headline-lg text-xl mb-2" style={{fontFamily:'Inter'}}>{step.title}</h4>
                  <p className="text-white/60 text-sm px-4">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ── Virtual Showroom ──────────────────────────────────────────────────
function VirtualShowroom() {
  return (
    <section className="py-section-gap max-w-[1440px] mx-auto px-margin-mobile md:px-margin-desktop">
      <ScrollReveal className="bg-surface-container-low rounded-[32px] p-8 md:p-16 flex flex-col md:flex-row items-center gap-16 relative overflow-hidden">
        {/* Decorative subtle circle */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gold-accent/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex-1 z-10">
          <p className="font-label-caps text-gold-accent tracking-[0.2em] mb-4 uppercase">Immersive Experience</p>
          <h2 className="font-headline-xl text-[48px] text-primary leading-tight mb-6 tracking-[-0.02em]">Virtual Showroom</h2>
          <p className="font-body-lg text-on-surface-variant mb-8 max-w-md">Explore our expansive inventory in a fully interactive 360° environment. View slab details, inspect veining, and visualize applications from anywhere in the world.</p>
          <button className="btn-primary px-8 py-4 font-label-caps text-label-caps rounded-full tracking-widest uppercase flex items-center gap-3">
            Enter Showroom
            <Rotate3d className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 w-full relative z-10">
          <div className="aspect-video bg-surface-variant rounded-[24px] overflow-hidden relative shadow-2xl group cursor-pointer border border-outline-variant/30">
            <img 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
              alt="Virtual showroom interface placeholder" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBMQ_oN66gXkiIkqeud5PAV5fxxH-bi0SbQE3TAOkRLFKSRss_pldJkO9tIY6q-VzzWCjO0WAq1BJhYNdodZ9Sfo1LfQXomF-P2vnJPLbxwF5OU-gsMvB7dGKKirHBiU6Yexb_pcISGvV6d2ssc6nA7HOYdOGmFH8J98rCLfUG9Z6wFnLt9-1S1jYwK02XHk275CpLo5OhFqNZkblcMyelX3wVbUGF70BtYJJI5cgzlARX9TJy-Zq3x"
            />
            {/* Play button overlay */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center group-hover:bg-black/40 transition-colors duration-400">
              <div className="w-20 h-20 rounded-full glass-panel flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform duration-400">
                <Play className="w-10 h-10 ml-1" />
              </div>
            </div>
            {/* UI Hotspot Overlays */}
            <div className="absolute top-[30%] left-[20%] w-6 h-6 rounded-full bg-white/80 animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.8)]"></div>
            <div className="absolute top-[60%] left-[70%] w-6 h-6 rounded-full bg-gold-accent/80 animate-pulse shadow-[0_0_15px_rgba(201,162,39,0.8)]"></div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

// ── FAQ Accordion ─────────────────────────────────────────────────────
function FAQSection() {
  const [openIdx, setOpenIdx] = useState(null);

  const faqs = [
    {
      q: 'What is the difference between marble and quartz?',
      a: 'Marble is a 100% natural stone renowned for its unique, non-repeating veining and classical beauty. It is porous and requires periodic sealing. Quartz is an engineered stone made from 90% crushed quartz mixed with resin, offering a non-porous, highly durable, and maintenance-free surface with consistent patterning.'
    },
    {
      q: 'Do you offer custom fabrication services?',
      a: 'Yes, we operate a state-of-the-art fabrication facility. We offer fully bespoke services including custom edge profiles, specialized cutting for integrated sinks, precise book-matching for large wall installations, and detailed architectural stonework.'
    },
    {
      q: 'How should I maintain natural stone surfaces?',
      a: 'Natural stone should be cleaned with mild, pH-neutral soap and water. Avoid acidic cleaners (like vinegar or lemon) which can etch the surface. We recommend professionally resealing marble and granite every 1-2 years depending on usage to protect against staining.'
    }
  ];

  return (
    <section className="max-w-[1000px] mx-auto px-margin-mobile md:px-margin-desktop py-section-gap">
      <ScrollReveal className="text-center mb-16">
        <h2 className="font-headline-xl text-[48px] text-primary mb-4">Expert Insights</h2>
        <p className="font-body-lg text-on-surface-variant">Frequently asked questions about material selection and installation.</p>
      </ScrollReveal>

      <ScrollReveal delay={0.2} className="space-y-4">
        {faqs.map((faq, idx) => (
          <div key={idx} className="bg-surface-container-low rounded-[16px] border border-outline-variant/30 overflow-hidden">
            <button 
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
              className="w-full px-8 py-6 flex justify-between items-center text-left focus:outline-none"
            >
              <span className="text-headline-lg text-xl text-primary font-medium" style={{fontFamily:'Inter'}}>{faq.q}</span>
              <ChevronDown 
                className={`w-6 h-6 text-on-surface-variant transition-transform duration-400 ${openIdx === idx ? 'rotate-180' : ''}`}
              />
            </button>
            <AnimatePresence>
              {openIdx === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="px-8"
                >
                  <p className="pb-6 text-on-surface-variant leading-relaxed">
                    {faq.a}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </ScrollReveal>
    </section>
  );
}

// ── CTA Section ───────────────────────────────────────────────────────
function CTASection() {
  return (
    <section className="relative py-32 overflow-hidden mt-20">
      {/* Marble Background */}
      <div className="absolute inset-0 z-0">
        <img 
          className="w-full h-full object-cover" 
          alt="Dark dramatic marble background" 
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuAiP9gEBDNDBUC0s4bLA9jw_9NcLFsUzWy_KT7ImshXIjRJcJNt3NMm5e846lWy7Q1rlVOEeRjJDINsppkXzT5Md-dg5JGuljnOMGTLlW2ucwEvGJyhn2FItV-CU9D3yn-7tD5a63ANjs1D60KqQpAYtWO9_yBWTiYFivur2CysxudzHb5BZp1Gi81y6kuzXd7rC0QPadhYctFMHpYvwUOBswg-MM8AKZezA8x0rkIpX6b4CT0tYhOG"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"></div>
      </div>

      <ScrollReveal className="relative z-10 max-w-4xl mx-auto px-margin-mobile text-center">
        <Diamond className="text-gold-accent w-12 h-12 mx-auto mb-6" fill="currentColor" />
        <h2 className="font-display-lg-mobile md:text-[64px] text-white leading-tight mb-8 font-semibold tracking-[-0.02em]">
          Ready to Elevate Your Space?
        </h2>
        <p className="font-body-lg text-white/80 mb-10 max-w-2xl mx-auto text-xl font-light">
          Schedule a private consultation with our stone specialists to discuss your architectural project and view exclusive reserves.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/quote" className="bg-gold-accent text-white px-10 py-5 font-label-caps text-sm rounded-full tracking-widest uppercase hover:bg-white hover:text-black transition-colors duration-400">
            Book Consultation
          </Link>
          <Link to="/contact" className="btn-accent px-10 py-5 font-label-caps text-sm rounded-full tracking-widest uppercase flex items-center justify-center">
            Request Brochure
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}

// ── Main Page Component ────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="relative w-full">
      <AnnouncementBar />
      <HeroSection />
      <StoneFinder />
      <MasterpieceCollections />
      <ProcessTimeline />
      <VirtualShowroom />
      <FAQSection />
      <CTASection />
    </div>
  );
}
