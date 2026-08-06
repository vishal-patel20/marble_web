import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * ProductCard — aspect-[4/5] card for the Masterwork Listing page.
 * On hover: image scale, gradient overlay, "View Details" button reveals.
 * Matches Stitch `the_masterwork_listing/code.html` article elements exactly.
 */
export default function ProductCard({ product, to }) {
  const catSlug = (product?.category || 'italian-marble').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const itemSlug = (product?.slug || product?.id || product?.name || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const targetUrl = to || `/collection/${catSlug}/${itemSlug}`;

  return (
    <article className="group relative aspect-[4/5] bg-surface-container-lowest overflow-hidden flex flex-col justify-end glass-card-hover rounded-2xl cursor-pointer">
      <Link to={targetUrl} className="absolute inset-0 z-0">
        {/* Background image */}
        <img
          src={product?.image || '/images/showroom_3d_marble.png'}
          alt={product?.name || 'Marble Product'}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = '/images/showroom_3d_marble.png'; }}
          className="w-full h-full object-cover transition-transform duration-[1000ms] group-hover:scale-105"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent transition-opacity duration-[400ms]" />
      </Link>

      {/* Info panel */}
      <div className="relative z-10 m-4 p-5 bg-black/60 backdrop-blur-md rounded-xl border border-white/20 flex flex-col gap-2 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-[400ms]">
        <div>
          <p className="font-label-caps text-[10px] text-amber-400 uppercase tracking-widest font-bold mb-1">
            {product?.origin || 'Italy'}
          </p>
          <h3 className="text-2xl font-serif text-white font-medium leading-tight">
            {product?.name}
          </h3>
        </div>

        <div className="mt-2">
          <Link
            to={targetUrl}
            className="w-full bg-gold-accent hover:bg-amber-400 text-slate-950 py-2.5 px-4 font-body-md text-xs font-bold transition-all duration-[300ms] flex justify-between items-center rounded-lg shadow-md"
          >
            <span>View Details</span>
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </article>
  );
}
