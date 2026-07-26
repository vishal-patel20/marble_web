import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import BreadCrumb from '../components/ui/BreadCrumb.jsx';
import ProductCard from '../components/ui/ProductCard.jsx';
import { italianMarbleProducts } from '../data/collections.js';

// Sidebar filter config
const CATEGORIES = ['Marble', 'Granite', 'Quartzite', 'Onyx'];
const COLORS     = ['White', 'Grey', 'Black', 'Gold'];
const FINISHES   = ['Polished', 'Honed', 'Leathered'];

export default function ProductListing() {
  const { category } = useParams();
  const [checkedCats,    setCheckedCats]    = useState(['Marble']);
  const [checkedFinishes, setCheckedFinishes] = useState(['Polished']);
  const [activeColor,    setActiveColor]    = useState('Grey');
  const [sortBy,         setSortBy]         = useState('featured');

  const toggleCheck = (list, setList, val) => {
    setList((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  // Format category name for display
  const categoryDisplay = category
    ? category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
    : 'Italian Marble';

  return (
    <>
      <title>{categoryDisplay} — MarbleCraft</title>

      <main className="min-h-screen flex flex-col pt-20">

        {/* ── Header Section with gradient ── */}
        <section className="relative w-full h-[40vh] min-h-[300px] flex items-end pb-12 overflow-hidden bg-surface-container-low">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="relative max-w-[1440px] mx-auto px-[80px] w-full z-10">
            <nav
              aria-label="Breadcrumb"
              className="flex text-on-surface-variant font-label-caps text-label-caps mb-6 items-center uppercase gap-2"
            >
              <a href="/" className="hover:text-primary transition-colors duration-[400ms]">Home</a>
              <ChevronRight size={16} />
              <a href="/collection" className="hover:text-primary transition-colors duration-[400ms]">Collections</a>
              <ChevronRight size={16} />
              <span className="text-primary font-semibold">{categoryDisplay}</span>
            </nav>
            <h1
              className="text-[72px] font-[600] leading-[1.1] tracking-[-0.04em] text-primary max-w-3xl"
              style={{ fontFamily: 'Inter' }}
            >
              {categoryDisplay}
            </h1>
            <p className="mt-4 font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Discover our curated selection of premium Italian stone, celebrated for its dramatic veining, luminous depth, and heritage of architectural excellence.
            </p>
          </div>
        </section>

        {/* ── Main Listing Area ── */}
        <section className="max-w-[1440px] mx-auto px-[80px] py-[160px] flex flex-col lg:flex-row gap-[32px] w-full">

          {/* ── Sidebar Filters ── */}
          <aside className="w-full lg:w-1/4 flex-shrink-0 pr-8">
            <div className="sticky top-32 space-y-8">

              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-outline-variant">
                <h2
                  className="text-primary text-[24px] font-[500]"
                  style={{ fontFamily: 'Inter' }}
                >
                  Filters
                </h2>
                <button
                  className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors"
                  onClick={() => { setCheckedCats([]); setCheckedFinishes([]); setActiveColor(''); }}
                >
                  Clear All
                </button>
              </div>

              {/* Category */}
              <div className="space-y-4">
                <h3 className="font-body-md text-body-md font-semibold text-primary">Category</h3>
                <div className="space-y-3 font-body-md text-body-md text-on-surface-variant">
                  {CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="stone-checkbox"
                        checked={checkedCats.includes(cat)}
                        onChange={() => toggleCheck(checkedCats, setCheckedCats, cat)}
                      />
                      <span className="group-hover:text-primary transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="space-y-4">
                <h3 className="font-body-md text-body-md font-semibold text-primary">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setActiveColor(color)}
                      className={`px-4 py-2 rounded-full font-body-md text-body-md transition-all duration-[400ms] ${
                        activeColor === color
                          ? 'bg-primary text-on-primary'
                          : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Finish */}
              <div className="space-y-4">
                <h3 className="font-body-md text-body-md font-semibold text-primary">Finish</h3>
                <div className="space-y-3 font-body-md text-body-md text-on-surface-variant">
                  {FINISHES.map((fin) => (
                    <label key={fin} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="stone-checkbox"
                        checked={checkedFinishes.includes(fin)}
                        onChange={() => toggleCheck(checkedFinishes, setCheckedFinishes, fin)}
                      />
                      <span className="group-hover:text-primary transition-colors">{fin}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* ── Product Grid ── */}
          <div className="w-full lg:w-3/4 flex flex-col">

            {/* Toolbar */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-outline-variant">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Showing <span className="font-semibold text-primary">{italianMarbleProducts.length}</span> exceptional slabs
              </p>
              <div className="flex items-center gap-4">
                <span className="font-body-md text-body-md text-on-surface-variant">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-none bg-transparent font-body-md text-body-md text-primary font-semibold focus:ring-0 cursor-pointer outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_asc">Price (Low-High)</option>
                  <option value="price_desc">Price (High-Low)</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {italianMarbleProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  to={`/collection/${category || 'italian-marble'}/${product.slug}`}
                />
              ))}
            </div>

            {/* Load More */}
            <div className="mt-16 flex justify-center">
              <button className="px-8 py-4 border border-primary text-primary font-body-md text-body-md font-semibold hover:bg-primary hover:text-on-primary transition-colors duration-[400ms]">
                Load More Collections
              </button>
            </div>

          </div>
        </section>
      </main>
    </>
  );
}
