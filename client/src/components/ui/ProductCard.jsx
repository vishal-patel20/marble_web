import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/**
 * ProductCard — aspect-[4/5] card for the Masterwork Listing page.
 * On hover: image scale, gradient overlay, "View Details" button reveals.
 * Matches Stitch `the_masterwork_listing/code.html` article elements exactly.
 */
export default function ProductCard({ product, to }) {
  return (
    <article className="group relative aspect-[4/5] bg-surface-container-lowest overflow-hidden flex flex-col justify-end glass-card-hover rounded-sm">
      {/* Background image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-[1000ms] group-hover:scale-105"
        />
      </div>

      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[400ms]" />

      {/* Info panel */}
      <div className="relative z-10 m-4 p-6 glass-panel flex flex-col gap-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-[400ms]">
        <div className="flex justify-between items-start">
          <div>
            <p className="font-label-caps text-label-caps text-on-surface uppercase mb-1 tracking-widest opacity-80">
              {product.origin}
            </p>
            <h3 className="text-[28px] font-[500] leading-tight text-primary" style={{ fontFamily: 'Inter' }}>
              {product.name}
            </h3>
          </div>
        </div>

        {/* Reveal on hover */}
        <div className="mt-4 opacity-0 h-0 group-hover:opacity-100 group-hover:h-auto transition-all duration-[400ms] delay-100 overflow-hidden">
          <Link
            to={to || `/collection/${product.category || 'italian-marble'}/${product.slug || product.id}`}
            className="w-full bg-primary text-on-primary py-3 px-6 font-body-md text-body-md font-semibold hover:bg-secondary-container hover:text-on-secondary-container transition-colors duration-[400ms] flex justify-between items-center"
          >
            <span>View Details</span>
            <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    </article>
  );
}
