import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft } from 'lucide-react';
import StoneCard from '../components/ui/StoneCard.jsx';
import { getAllCollectionItems } from '../data/collections.js';
import axiosInstance from '../api/axiosInstance.js';

// Sidebar filter config matching reference UI
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

export default function Collection() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const paramCat    = searchParams.get('category');
  const paramSearch = searchParams.get('search');

  // Match URL param category if provided
  const matchedCategory = useMemo(() => {
    if (!paramCat) return '';
    const slugNorm = paramCat.toLowerCase().replace(/[^a-z0-9]/g, '');
    return CATEGORIES.find((cat) => cat.toLowerCase().replace(/[^a-z0-9]/g, '') === slugNorm) || paramCat;
  }, [paramCat]);

  const [checkedCats, setCheckedCats]         = useState(matchedCategory ? [matchedCategory] : []);
  const [checkedFinishes, setCheckedFinishes] = useState([]);
  const [activeColor, setActiveColor]         = useState('');
  const [sortBy, setSortBy]                   = useState('featured');
  const [apiProducts, setApiProducts]         = useState([]);

  useEffect(() => {
    if (matchedCategory) {
      setCheckedCats([matchedCategory]);
    }
  }, [matchedCategory]);

  useEffect(() => {
    axiosInstance.get('/inventory/products')
      .then((res) => {
        const prods = Array.isArray(res.data?.data?.products) 
          ? res.data.data.products 
          : Array.isArray(res.data?.data) 
            ? res.data.data 
            : Array.isArray(res.data) 
              ? res.data 
              : [];
        setApiProducts(prods);
      })
      .catch(() => {});
  }, []);

  const toggleCheck = (list, setList, val) => {
    setList((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const allItems = useMemo(() => {
    const base = getAllCollectionItems();
    const formattedApi = apiProducts.map((p) => {
      const slug = (p.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const catName = p.category?.name || p.categoryName || p.category || 'Brown Marbles';
      const colorVal = p.color || (catName.toLowerCase().includes('brown') ? 'Brown' : catName.toLowerCase().includes('green') ? 'Green' : 'White');
      return {
        id: p.id || slug,
        slug,
        name: p.name,
        category: catName,
        origin: p.origins || p.origin || 'International Reserve',
        color: colorVal,
        finish: p.finish || 'Polished',
        finishes: ['Polished', 'Honed'],
        description: p.description || `${p.name} is a luxury natural marble slab curated for high-end interior spaces.`,
        density: p.density || '2710 kg/m³',
        waterAbsorption: p.waterAbsorption || '0.12 %',
        compressiveStrength: p.compressiveStrength || '135 MPa',
        image: p.imageUrl || p.image || '/images/stone_image_1.jpg',
      };
    });
    const baseSlugs = new Set(base.map((i) => i.slug));
    const newFromApi = formattedApi.filter((i) => !baseSlugs.has(i.slug));
    return [...newFromApi, ...base];
  }, [apiProducts]);

  // Filtered and sorted products
  const filteredProducts = useMemo(() => {
    let result = allItems.filter((item) => {
      // Category filter
      if (checkedCats.length > 0) {
        const itemCatNorm = (item.category || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const match = checkedCats.some((c) => {
          const cNorm = c.toLowerCase().replace(/[^a-z0-9]/g, '');
          return itemCatNorm.includes(cNorm) || cNorm.includes(itemCatNorm);
        });
        if (!match) return false;
      }

      // Color filter
      if (activeColor && (item.color || '').toLowerCase() !== activeColor.toLowerCase()) {
        return false;
      }

      // Finish filter
      if (checkedFinishes.length > 0) {
        const itemFinish = (item.finish || 'Polished').toLowerCase();
        const matchFin = checkedFinishes.some((f) => itemFinish.includes(f.toLowerCase()));
        if (!matchFin) return false;
      }

      // Search query filter
      if (paramSearch && paramSearch.trim()) {
        const q = paramSearch.toLowerCase();
        const nameMatch = item.name.toLowerCase().includes(q);
        const catMatch  = (item.category || '').toLowerCase().includes(q);
        const origMatch = (item.origin || '').toLowerCase().includes(q);
        if (!nameMatch && !catMatch && !origMatch) return false;
      }

      return true;
    });

    // Sorting logic
    if (sortBy === 'name') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [checkedCats, activeColor, checkedFinishes, paramSearch, sortBy, allItems]);

  const categoryDisplay = checkedCats.length === 1 ? checkedCats[0] : 'All Marble Collections';

  return (
    <>
      <title>All Marble Collections — MarbleCraft</title>

      <main className="min-h-screen flex flex-col pt-24 bg-stone-50/50 dark:bg-stone-950/40">

        {/* ── Header Section ── */}
        <section className="max-w-[1440px] mx-auto px-[20px] md:px-[80px] w-full pt-8 pb-10">
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer bg-stone-200/70 dark:bg-stone-800/70 hover:bg-stone-300 dark:hover:bg-stone-700 px-3.5 py-1.5 rounded-full shadow-sm"
            >
              <ArrowLeft size={14} />
              <span>Back</span>
            </button>
          </div>

          <nav
            aria-label="Breadcrumb"
            className="flex text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest mb-4 items-center gap-2"
          >
            <Link to="/" className="hover:text-stone-700 dark:hover:text-stone-300 transition-colors">Home</Link>
            <ChevronRight size={12} />
            <Link to="/collection" className="hover:text-stone-700 dark:hover:text-stone-300 transition-colors">Collections</Link>
            <ChevronRight size={12} />
            <span className="text-stone-800 dark:text-stone-200 font-extrabold">{categoryDisplay}</span>
          </nav>

          <h1
            className="text-[38px] md:text-[56px] font-[600] leading-[1.1] tracking-[-0.03em] text-stone-900 dark:text-stone-100 font-serif max-w-4xl"
          >
            {categoryDisplay}
          </h1>

          <p className="mt-3 text-sm md:text-base text-stone-600 dark:text-stone-400 max-w-3xl leading-relaxed">
            Discover our curated selection of fine natural marble slabs, celebrated for dramatic veining, luminous depth, and architectural heritage.
          </p>
        </section>

        {/* ── Main Listing & Sidebar Section ── */}
        <section className="max-w-[1440px] mx-auto px-[20px] md:px-[80px] pb-24 flex flex-col lg:flex-row gap-10 w-full">

          {/* ── Sidebar Filters ── */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-28 space-y-8 bg-white dark:bg-stone-900/80 p-6 rounded-2xl border border-stone-200/80 dark:border-stone-800 shadow-sm">

              {/* Sidebar Header */}
              <div className="flex items-center justify-between pb-4 border-b border-stone-200 dark:border-stone-800">
                <h2 className="text-stone-900 dark:text-white text-xl font-serif font-bold">
                  Filters
                </h2>
                <button
                  className="text-xs font-bold text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
                  onClick={() => { setCheckedCats([]); setCheckedFinishes([]); setActiveColor(''); }}
                >
                  Clear All
                </button>
              </div>

              {/* Category Filter */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Category</h3>
                <div className="space-y-2.5">
                  {CATEGORIES.map((cat) => (
                    <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-400 cursor-pointer"
                        checked={checkedCats.includes(cat)}
                        onChange={() => toggleCheck(checkedCats, setCheckedCats, cat)}
                      />
                      <span className="text-xs font-medium text-stone-700 dark:text-stone-300 group-hover:text-stone-950 dark:group-hover:text-white transition-colors">{cat}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Color Filter */}
              <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Color</h3>
                <div className="flex flex-wrap gap-2">
                  {COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setActiveColor(activeColor === color ? '' : color)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                        activeColor === color
                          ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-950 font-bold shadow-sm'
                          : 'border border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400 hover:border-stone-400 hover:text-stone-900'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Finish Filter */}
              <div className="space-y-3 pt-2 border-t border-stone-100 dark:border-stone-800">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">Finish</h3>
                <div className="space-y-2.5">
                  {FINISHES.map((fin) => (
                    <label key={fin} className="flex items-center gap-3 cursor-pointer group">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded border-stone-300 text-stone-900 focus:ring-stone-400 cursor-pointer"
                        checked={checkedFinishes.includes(fin)}
                        onChange={() => toggleCheck(checkedFinishes, setCheckedFinishes, fin)}
                      />
                      <span className="text-xs font-medium text-stone-700 dark:text-stone-300 group-hover:text-stone-950 dark:group-hover:text-white transition-colors">{fin}</span>
                    </label>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* ── Product Cards Grid ── */}
          <div className="flex-1 flex flex-col">

            {/* Toolbar Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-stone-200/80 dark:border-stone-800">
              <p className="text-sm font-medium text-stone-600 dark:text-stone-400">
                Showing <span className="font-bold text-stone-900 dark:text-stone-100">{filteredProducts.length}</span> exceptional slabs
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-stone-500 dark:text-stone-400">Sort by:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 rounded-lg px-3 py-1.5 text-xs font-bold text-stone-800 dark:text-stone-200 focus:ring-1 focus:ring-stone-400 cursor-pointer outline-none shadow-sm"
                >
                  <option value="featured">Featured</option>
                  <option value="name">Name (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Product Cards Grid */}
            {filteredProducts.length === 0 ? (
              <div className="py-24 text-center bg-white dark:bg-stone-900/50 rounded-2xl border border-stone-200/80 dark:border-stone-800 p-8 shadow-sm">
                <p className="text-lg font-bold text-stone-800 dark:text-stone-200 mb-2">No matching slabs found</p>
                <p className="text-sm text-stone-500 dark:text-stone-400">Try clearing some filters or selecting a different category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((item) => (
                  <StoneCard
                    key={item.id}
                    item={item}
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
