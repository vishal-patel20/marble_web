import React, { useState, useEffect } from 'react';
import { Heart, ArrowRight } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance.js';
import useAuthStore from '../store/authStore.js';
import Card from '../components/ui/Card.jsx';
import Skeleton from '../components/ui/Skeleton.jsx';

export default function Wishlist() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, setWishlistCount } = useAuthStore();

  const fetchWishlist = async () => {
    setLoading(true);
    try {
      if (user) {
        // Authenticated customer wishlist API
        const res = await axiosInstance.get('/misc/wishlist');
        setProducts(res.data.data);
        setWishlistCount(res.data.data.length);
      } else {
        // Guest local storage wishlist filter
        const guestWishlist = JSON.parse(localStorage.getItem('guestWishlist') || '[]');
        if (guestWishlist.length === 0) {
          setProducts([]);
          setWishlistCount(0);
        } else {
          // Fetch products page 1 and filter locally for guest demo ease
          const res = await axiosInstance.get('/inventory/products?limit=100');
          const allProds = res.data.data.products;
          const filtered = allProds.filter(p => guestWishlist.includes(p.id));
          setProducts(filtered);
          setWishlistCount(filtered.length);
        }
      }
    } catch (err) {
      console.error('Failed to load wishlist items', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [user]);

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-16 sm:px-6 lg:px-8 min-h-[60vh]">
      
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold font-serif text-slate-800 dark:text-white">Your Saved Slabs</h1>
        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
          Bookmarked slabs and collections. Use this list to request quotes or template matching from our quarry teams.
        </p>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Skeleton count={3} />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-3xl max-w-2xl mx-auto">
          <Heart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-white mb-1">Your wishlist is empty</h3>
          <p className="text-sm text-slate-400 mb-6">Browse our stone catalog and click the heart icon on any slab.</p>
          <RouterLink to="/products">
            <span className="inline-flex items-center text-xs tracking-wider uppercase font-semibold text-gold-400 hover:underline">
              View Collection <ArrowRight className="h-4 w-4 ml-1" />
            </span>
          </RouterLink>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {products.map((product) => (
            <Card
              key={product.id}
              product={product}
              isFavorited={true}
              onWishlistUpdate={fetchWishlist}
            />
          ))}
        </div>
      )}

    </div>
  );
}
