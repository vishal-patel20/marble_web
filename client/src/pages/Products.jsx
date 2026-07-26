import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, Globe, Layers, Maximize, X } from 'lucide-react';
import axiosInstance from '../api/axiosInstance.js';
import Card from '../components/ui/Card.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';
import Button from '../components/ui/Button.jsx';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search & Filter state
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'createdAt_desc');
  const [page, setPage] = useState(parseInt(searchParams.get('page') || '1'));
  const [totalPages, setTotalPages] = useState(1);
  const [wishlistIds, setWishlistIds] = useState([]);

  // Detail Modal State
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Load categories
    const loadCategories = async () => {
      try {
        const res = await axiosInstance.get('/inventory/categories');
        setCategories(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    // Load products based on query state
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          search,
          category: selectedCat,
          sort,
          page,
          limit: 9
        };
        const res = await axiosInstance.get('/inventory/products', { params });
        setProducts(res.data.data || []);
        setTotalPages(res.data.meta?.pagination?.totalPages || 1);

        // Sync wishlist state
        const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
        setWishlistIds(guestWishlist);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();

    // Sync URL queries
    const newParams = {};
    if (search) newParams.search = search;
    if (selectedCat) newParams.category = selectedCat;
    if (sort !== 'createdAt_desc') newParams.sort = sort;
    if (page > 1) newParams.page = page;
    setSearchParams(newParams);

  }, [search, selectedCat, sort, page]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCat('');
    setSort('createdAt_desc');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      
      {/* Page Header */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold font-serif text-slate-800 dark:text-white">Our Stone Consignments</h1>
        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
          Premium slabs inspected and bookmatched. Refined solutions for flooring, islands, facades and countertops.
        </p>
      </div>

      {/* Query Filters Bar */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-100 dark:border-slate-800 mb-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-grow max-w-md">
          <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search Calacatta, Onyx, Italy..."
            className="w-full bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm pl-10 pr-4 py-3 rounded-xl focus:outline-none focus:border-gold-400 text-slate-800 dark:text-white"
          />
        </div>

        {/* Filters Selectors */}
        <div className="flex flex-wrap items-center gap-4">
          
          {/* Category Dropdown */}
          <select
            value={selectedCat}
            onChange={(e) => { setSelectedCat(e.target.value); setPage(1); }}
            className="bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-gold-400"
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          {/* Sort Dropdown */}
          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm px-4 py-3 rounded-xl focus:outline-none focus:border-gold-400"
          >
            <option value="createdAt_desc">Latest Imports</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
          </select>

          {/* Reset Filters */}
          {(search || selectedCat || sort !== 'createdAt_desc') && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-semibold text-red-500 hover:underline uppercase tracking-wider px-2 py-1.5"
            >
              Reset Filters
            </button>
          )}

        </div>

      </div>

      {/* Grid items */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton count={6} />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl">
          <SlidersHorizontal className="h-10 w-10 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-white mb-1">No products match criteria</h3>
          <p className="text-sm text-slate-400">Try adjusting your filters or search keywords.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div key={product.id} onClick={() => setSelectedProduct(product)} className="cursor-pointer">
                <Card
                  product={product}
                  isFavorited={wishlistIds.includes(product.id)}
                  onWishlistUpdate={() => {
                    const updatedList = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
                    setWishlistIds(updatedList);
                  }}
                />
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-16 flex justify-center items-center space-x-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-sm font-semibold text-slate-500">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-600 dark:text-slate-300 disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* Slabs Detail Overlays Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl max-w-4xl w-full p-8 shadow-2xl relative flex flex-col md:flex-row gap-8">
            
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-full text-slate-600 dark:text-slate-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Visual Column */}
            <div className="w-full md:w-1/2 aspect-[4/3] md:aspect-auto md:h-[400px] bg-slate-100 dark:bg-slate-800 rounded-2xl overflow-hidden shadow-inner">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Specification Columns */}
            <div className="w-full md:w-1/2 flex flex-col justify-between">
              
              <div>
                <span className="text-gold-400 font-semibold text-xs tracking-wider uppercase">{selectedProduct.category?.name}</span>
                <h3 className="text-2xl font-black font-serif text-slate-800 dark:text-white mt-1 mb-4">{selectedProduct.name}</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">{selectedProduct.description}</p>
                
                {/* Details list */}
                <div className="grid grid-cols-2 gap-4 border-t border-slate-50 dark:border-slate-800 pt-4 mb-6">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Origin Country</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center mt-1">
                      <Globe className="h-4 w-4 mr-1.5 text-gold-400" />
                      {selectedProduct.origins || 'Italy'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Dimensions</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center mt-1">
                      <Maximize className="h-4 w-4 mr-1.5 text-gold-400" />
                      {selectedProduct.dimensions || 'N/A'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Thickness</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center mt-1">
                      <Layers className="h-4 w-4 mr-1.5 text-gold-400" />
                      {selectedProduct.thickness || '18mm'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Finishes</span>
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200 flex flex-wrap gap-1 mt-1">
                      {selectedProduct.finishes && selectedProduct.finishes.length > 0
                        ? selectedProduct.finishes.join(', ')
                        : 'Polished'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between border-t border-slate-50 dark:border-slate-800 pt-4 mt-auto">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block">Price Per Sqm</span>
                  <span className="text-2xl font-black text-slate-900 dark:text-white">${parseFloat(selectedProduct.price).toFixed(2)}</span>
                </div>
                
                <a
                  href={`https://wa.me/15558904422?text=Hello,%20I'm%20interested%20in%20obtaining%20a%20price%20quote%20for%20slab:%20${selectedProduct.name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-gold-400 hover:bg-gold-500 text-slate-950 text-xs tracking-wider uppercase font-semibold px-6 py-3.5 rounded-full transition-colors flex items-center"
                >
                  Request Quote
                </a>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
