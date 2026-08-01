import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown } from 'lucide-react';
import BreadCrumb from '../components/ui/BreadCrumb.jsx';
import FilterChip from '../components/ui/FilterChip.jsx';
import StoneCard from '../components/ui/StoneCard.jsx';
import ScrollReveal from '../components/ui/ScrollReveal.jsx';
import { getAllCollectionItems, categories } from '../data/collections.js';

export default function Collection() {
  const [activeCategory, setActiveCategory] = useState('all');

  const allItems = useMemo(() => getAllCollectionItems(), []);

  const filtered = useMemo(() => {
    if (activeCategory === 'all') return allItems;
    return allItems.filter((item) => item.category === activeCategory);
  }, [activeCategory, allItems]);

  return (
    <>
      {/* SEO */}
      <title>MarbleCraft | Masterworks in Stone</title>

      <main className="max-w-[1440px] mx-auto px-[20px] md:px-[80px] py-12 md:py-24 pt-32">

        {/* ── Header & Breadcrumbs ── */}
        <header className="mb-16">
          <BreadCrumb
            items={[
              { label: 'Home',        to: '/'           },
              { label: 'Collections', to: '/collection' },
            ]}
          />

          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
            {/* Title + description */}
            <div className="max-w-2xl">
              <h1
                className="text-[40px] md:text-[72px] font-[600] leading-[1.2] md:leading-[1.1] tracking-[-0.02em] md:tracking-[-0.04em] text-primary mb-4"
                style={{ fontFamily: 'Inter' }}
              >
                Masterworks in Stone
              </h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">
                Explore our curated catalog of nature's most exquisite canvases. Each slab is selected for its unique geological narrative, unparalleled veining, and architectural potential.
              </p>
            </div>

            {/* Filter chips */}
            <div className="w-full md:w-auto overflow-x-auto hide-scrollbar pb-2">
              <div className="flex flex-nowrap md:flex-wrap gap-2">
                {categories.map((cat) => (
                  <FilterChip
                    key={cat.id}
                    label={cat.label}
                    active={activeCategory === cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                  />
                ))}
              </div>
            </div>
          </div>
        </header>

        {/* ── Masonry Gallery ── */}
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-on-surface-variant max-w-md mx-auto bg-surface-container-low rounded-3xl p-8 border border-outline-variant/30">
            <h3 className="text-xl font-bold font-serif text-primary mb-2">No Marble Slabs in Collection</h3>
            <p className="text-sm text-on-surface-variant">
              There are currently no marble slabs in this category. Log in as Admin to add marble slabs to the collection!
            </p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-[32px]">
            {filtered.map((item, i) => (
              <ScrollReveal key={item.id} delay={i * 0.08}>
                <StoneCard
                  item={item}
                  to={`/collection/${item.category || 'marble'}/${item.id}`}
                />
              </ScrollReveal>
            ))}
          </div>
        )}

        {/* ── Load More ── */}
        <div className="mt-20 flex justify-center">
          <button className="px-8 py-4 border border-primary text-primary hover:bg-primary hover:text-on-primary transition-all duration-[400ms] rounded-full font-label-caps text-label-caps uppercase tracking-widest flex items-center gap-2">
            Explore Full Archive
            <ArrowDown size={16} />
          </button>
        </div>

      </main>
    </>
  );
}
