import { Link } from 'react-router-dom';

/**
 * StoneCard — masonry gallery card from the Collection page.
 * Glassmorphic label slides up on hover.
 */
export default function StoneCard({ item, to }) {
  const catSlug = (item?.category || 'marble').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const itemSlug = (item?.slug || item?.name || item?.id || '').toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const targetUrl = `/collection/${catSlug}/${itemSlug}`;

  return (
    <article className="break-inside-avoid relative group rounded-lg overflow-hidden cursor-pointer mb-8">
      <Link to={targetUrl} className="block w-full h-full">
        <img
          src={item?.image || '/images/showroom_3d_marble.png'}
          alt={item?.name || 'Marble Slab'}
          loading="lazy"
          onError={(e) => { e.currentTarget.src = '/images/showroom_3d_marble.png'; }}
          className="w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
        />
        {/* Glassmorphic label */}
        <div className="absolute bottom-0 inset-x-0 p-6 bg-white/20 glass-panel border-t border-outline-variant/30 flex flex-col justify-end translate-y-2 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-[400ms]">
          <h3 className="text-headline-lg text-primary mb-1" style={{ fontFamily: 'Inter' }}>
            {item?.name}
          </h3>
          <p className="text-body-md text-primary/80">
            {item?.origin || 'Italy'} · {item?.finish || 'Polished'}
          </p>
        </div>
      </Link>
    </article>
  );
}
