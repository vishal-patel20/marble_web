import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Globe, Layers, ArrowRight } from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../../store/authStore.js';
import { useWishlistStore } from '../../store/wishlistStore.js';
import axiosInstance from '../../api/axiosInstance.js';

export default function Card({ product, isFavorited, onWishlistUpdate }) {
  const { user, incrementWishlist, decrementWishlist } = useAuthStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  // Determine favorited status from either prop or wishlist store
  const wishlisted = isFavorited ?? isInWishlist(product.id);

  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Use Zustand wishlist store for guests
      toggleItem(product);
      if (onWishlistUpdate) onWishlistUpdate();
      return;
    }

    // Authenticated user wishlist API
    try {
      if (wishlisted) {
        await axiosInstance.delete(`/misc/wishlist/${product.id}`);
        toast.info(`${product.name} removed from wishlist`, { position: 'bottom-right', autoClose: 2000 });
        decrementWishlist();
      } else {
        await axiosInstance.post('/misc/wishlist', { productId: product.id });
        toast.success(`${product.name} added to wishlist`, { position: 'bottom-right', autoClose: 2000 });
        incrementWishlist();
      }
      if (onWishlistUpdate) onWishlistUpdate();
    } catch (err) {
      toast.error('Could not update wishlist. Please try again.');
    }
  };

  const productSlug = product.slug || product.id;
  const price = product.pricePerSqft || product.price;

  return (
    <Link
      to={`/products/${productSlug}`}
      className="group relative bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:border-gold-400/30 transition-all duration-300 flex flex-col h-full"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&q=80'}
          alt={product.name}
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />

        {/* Wishlist Button Overlay */}
        <button
          id={`wishlist-btn-${product.id}`}
          onClick={handleWishlistToggle}
          className={`absolute top-4 right-4 p-2.5 rounded-full backdrop-blur-md border shadow-sm transition-all duration-300 ${
            wishlisted
              ? 'bg-red-500/20 border-red-500/30 text-red-500'
              : 'bg-white/70 dark:bg-slate-950/70 border-white/20 text-slate-600 dark:text-slate-300 hover:text-red-500 hover:bg-white/90'
          }`}
          aria-label="Toggle Wishlist"
        >
          <Heart className={`h-4 w-4 transition-all ${wishlisted ? 'fill-current scale-110' : ''}`} />
        </button>

        {/* Featured Tag */}
        {product.featured && (
          <span className="absolute top-4 left-4 bg-gold-400 text-slate-950 text-[10px] tracking-wider uppercase font-extrabold px-3 py-1 rounded-full shadow-sm">
            Featured
          </span>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product Content */}
      <div className="p-6 flex-grow flex flex-col">
        {/* Origin and Thickness Tags */}
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-2 text-xs text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase">
          {(product.origin || product.origins) && (
            <span className="flex items-center">
              <Globe className="h-3.5 w-3.5 mr-1 text-gold-400" />
              {product.origin || product.origins}
            </span>
          )}
          {product.thickness && (
            <span className="flex items-center">
              <Layers className="h-3.5 w-3.5 mr-1 text-gold-400" />
              {product.thickness} mm
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="text-lg font-bold text-slate-800 dark:text-white font-serif mb-2 leading-snug group-hover:text-gold-400 transition-colors">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">
          {product.description || 'Premium natural stone slab with unique natural veining.'}
        </p>

        <div className="mt-auto pt-4 border-t border-slate-50 dark:border-slate-800/60 flex items-center justify-between">
          <div>
            {price ? (
              <>
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider block">
                  Per sq ft
                </span>
                <span className="text-lg font-extrabold text-slate-950 dark:text-white">
                  ${parseFloat(price).toFixed(2)}
                </span>
              </>
            ) : (
              <span className="text-sm text-slate-400 italic">Price on request</span>
            )}
          </div>

          <span className="text-xs font-semibold text-gold-400 group-hover:underline flex items-center gap-1">
            View Details
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </Link>
  );
}
