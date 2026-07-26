import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, Palette, Check } from 'lucide-react';
import BreadCrumb from '../components/ui/BreadCrumb.jsx';
import StoneCard from '../components/ui/StoneCard.jsx';
import ScrollReveal from '../components/ui/ScrollReveal.jsx';
import { collectionItems, colorOptions } from '../data/collections.js';

export default function Colours() {
  const [activeColor, setActiveColor] = useState('all');

  const filtered = activeColor === 'all'
    ? collectionItems
    : collectionItems.filter((item) => item.color === activeColor);

  const activeColorObj = colorOptions.find((c) => c.id === activeColor);

  return (
    <>
      {/* SEO */}
      <title>Natural Stone Colours | MarbleCraft Palette</title>
      <meta
        name="description"
        content="Choose natural stone by colour — Black, Green, Yellow, White, Red, Grey, and Pink marble, granite, quartz, and onyx."
      />

      <main className="max-w-[1440px] mx-auto px-[20px] md:px-[80px] py-12 md:py-24 pt-32">

        {/* ── Header & Breadcrumbs ── */}
        <header className="mb-16">
          <BreadCrumb
            items={[
              { label: 'Home',    to: '/'        },
              { label: 'Colours', to: '/colours' },
            ]}
          />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            {/* Title + description */}
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-gold-accent font-label-caps text-label-caps uppercase tracking-widest mb-3">
                <Palette size={18} />
                Earth's Color Palette
              </div>
              <h1
                className="text-[40px] md:text-[72px] font-[600] leading-[1.2] md:leading-[1.1] tracking-[-0.02em] md:tracking-[-0.04em] text-primary mb-4"
                style={{ fontFamily: 'Inter' }}
              >
                Curated by Colour
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Select your desired color spectrum to discover rare marbles, quartzites, granites, and onyx slabs that match your aesthetic vision.
              </p>
            </div>

            {/* Color Filter Swatches */}
            <div className="w-full md:w-auto overflow-x-auto hide-scrollbar pb-2">
              <div className="flex flex-nowrap md:flex-wrap items-center gap-3">
                {colorOptions.map((color) => {
                  const isActive = activeColor === color.id;
                  return (
                    <button
                      key={color.id}
                      onClick={() => setActiveColor(color.id)}
                      className={`flex items-center gap-2.5 px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-300 ${
                        isActive
                          ? 'bg-primary text-on-primary border-primary shadow-lg scale-105'
                          : 'bg-surface/80 hover:bg-surface-tint/20 text-on-surface border-outline-variant/60 hover:border-primary/40'
                      }`}
                    >
                      {/* Swatch circle */}
                      <span
                        className="w-4 h-4 rounded-full flex items-center justify-center shadow-inner border border-black/20"
                        style={{
                          background: color.hex,
                        }}
                      >
                        {isActive && color.id !== 'white' && (
                          <Check size={10} className="text-white" strokeWidth={3} />
                        )}
                        {isActive && color.id === 'white' && (
                          <Check size={10} className="text-black" strokeWidth={3} />
                        )}
                      </span>
                      <span>{color.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </header>

        {/* ── Active Filter Banner ── */}
        <div className="mb-10 flex justify-between items-center border-b border-outline-variant/30 pb-4">
          <p className="text-sm font-label-caps uppercase tracking-wider text-on-surface-variant">
            Showing <span className="font-bold text-primary">{filtered.length}</span> {activeColor === 'all' ? 'total slabs' : `${activeColorObj?.label} stone slabs`}
          </p>
          {activeColor !== 'all' && (
            <button
              onClick={() => setActiveColor('all')}
              className="text-xs font-semibold text-gold-accent hover:underline uppercase tracking-wider"
            >
              Reset Filter
            </button>
          )}
        </div>

        {/* ── Masonry Gallery ── */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-[32px]">
          {filtered.map((item, i) => (
            <ScrollReveal key={item.id} delay={i * 0.08}>
              <StoneCard
                item={item}
                to={`/collection/italian-marble/${item.id}`}
              />
            </ScrollReveal>
          ))}
        </div>

        {/* ── Load More / CTA ── */}
        <div className="mt-20 flex justify-center">
          <Link
            to="/quote"
            className="px-8 py-4 bg-primary text-on-primary hover:bg-secondary-container hover:text-on-secondary-container transition-all duration-[400ms] rounded-full font-label-caps text-label-caps uppercase tracking-widest flex items-center gap-2"
          >
            Request Custom Colour Sample
            <ArrowDown size={16} />
          </Link>
        </div>

      </main>
    </>
  );
}
