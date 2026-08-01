import { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import BreadCrumb from '../components/ui/BreadCrumb.jsx';
import ProductCard from '../components/ui/ProductCard.jsx';
import { getAllCollectionItems } from '../data/collections.js';

// Sidebar filter config
const CATEGORIES = [
  'Premium Italian Marbles',
  'Black Marbles',
  'Beige & Cream Marbles',
  'Green Marbles',
  'White Marbles',
  'Brown Marbles',
  'Red & Pink Marbles',
  'Grey Marbles',
  'Indian Marbles'
];

const COLORS   = ['White', 'Grey', 'Black', 'Green', 'Red', 'Pink', 'Brown', 'Yellow'];
const FINISHES = ['Polished', 'Honed', 'Leathered'];

export default function ProductListing() {
  const { category } = useParams();
  const navigate = useNavigate();

  // Match URL param category if provided
  const matchedCategory = useMemo(() => {
    if (!category) return '';
    const slugNorm = category.toLowerCase().replace(/-/g, '');
    return CATEGORIES.find((cat) => cat.toLowerCase().replace(/[^a-z0-9]/g, '') === slugNorm) || '';
  }, [category]);

  const [checkedCats, setCheckedCats]         = useState(matchedCategory ? [matchedCategory] : []);
  const [checkedFinishes, setCheckedFinishes] = useState([]);
  const [activeColor, setActiveColor]         = useState('');
  const [sortBy, setSortBy]                   = useState('featured');

  const toggleCheck = (list, setList, val) => {
    setList((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const allItems = useMemo(() => getAllCollectionItems(), []);

  // Dynamic filtered products
  const filteredProducts = useMemo(() => {
    return allItems.filter((item) => {
      // Category filter
      if (checkedCats.length > 0 && !checkedCats.includes(item.category)) {
        return false;
      }
      // Color filter
      if (activeColor && item.color.toLowerCase() !== activeColor.toLowerCase()) {
        return false;
      }
      // Finish filter
      if (checkedFinishes.length > 0 && !checkedFinishes.includes(item.finish)) {
        return false;
      }
      return true;
    });
  }, [checkedCats, activeColor, checkedFinishes]);

  // Format category name for header
  const categoryDisplay = matchedCategory || (checkedCats.length === 1 ? checkedCats[0] : 'All Marble Collections');

  return (
    <>
      <title>{categoryDisplay} — MarbleCraft</title>

      <main className="min-h-screen flex flex-col pt-20">

        {/* ── Header Section with gradient ── */}
        <section className="relative w-full h-[40vh] min-h-[300px] flex items-end pb-12 overflow-hidden bg-surface-container-low">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="relative max-w-[1440px] mx-auto px-[80px] w-full z-10">
            <div className="flex items-center gap-4 mb-4">
              <button
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 text-sm font-medium text-on-surface-variant hover:text-primary transition-colors group cursor-pointer bg-surface-tint/10 hover:bg-surface-tint/20 px-4 py-1.5 rounded-full"
              >
                <ArrowLeft size={16} className="transition-transform group-hover:-translate-x-1" />
                <span>Back</span>
              </button>
            </div>
            <nav
              aria-label="Breadcrumb"
              className="flex text-on-surface-variant font-label-caps text-label-caps mb-6 items-center uppercase gap-2"
            >
              <Link to="/" className="hover:text-primary transition-colors duration-[400ms]">Home</Link>
              <ChevronRight size={16} />
              <Link to="/collection" className="hover:text-primary transition-colors duration-[400ms]">Collections</Link>
              <ChevronRight size={16} />
              <span className="text-primary font-semibold">{categoryDisplay}</span>
            </nav>
            <h1
              className="text-[48px] md:text-[64px] font-[600] leading-[1.1] tracking-[-0.04em] text-primary max-w-3xl"
              style={{ fontFamily: 'Inter' }}
            >
              {categoryDisplay}
            </h1>
            <p className="mt-4 font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Discover our curated selection of fine natural marble slabs, celebrated for dramatic veining, luminous depth, and architectural heritage.
            </p>
          </div>
        </section>

        {/* ── Main Listing Area ── */}
        <section className="max-w-[1440px] mx-auto px-[20px] md:px-[80px] py-16 flex flex-col lg:flex-row gap-[32px] w-full">

          {/* ── Sidebar Filters ── */}
          <aside className="w-full lg:w-1/4 flex-shrink-0 pr-4">
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
                <div className="space-y-2 font-body-md text-body-md text-on-surface-variant">
                  {CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="stone-checkbox"
                        checked={checkedCats.includes(cat)}
                        onChange={() => toggleCheck(checkedCats, setCheckedCats, cat)}
                      />
                      <span className="group-hover:text-primary transition-colors text-sm">{cat}</span>
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
                      onClick={() => setActiveColor(activeColor === color ? '' : color)}
                      className={`px-3 py-1.5 rounded-full font-body-md text-xs transition-all duration-[300ms] ${
                        activeColor === color
                          ? 'bg-primary text-on-primary font-semibold'
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
                      <span className="group-hover:text-primary transition-colors text-sm">{fin}</span>
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
                Showing <span className="font-semibold text-primary">{filteredProducts.length}</span> exceptional slabs
              </p>
              <div className="flex items-center gap-4">
                <span className="font-body-md text-body-md text-on-surface-variant">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-none bg-transparent font-body-md text-body-md text-primary font-semibold focus:ring-0 cursor-pointer outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-20 text-center text-on-surface-variant">
                <p className="text-lg font-semibold mb-2">No matching slabs found</p>
                <p className="text-sm">Try clearing some filters or selecting a different category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    to={`/collection/${product.slug}`}
                  />
                ))}
              </div>
            )}

          </div>
        </section>
      </main>
    </>
  );
}
