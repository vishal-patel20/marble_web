import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

/**
 * BreadCrumb — label-caps uppercase breadcrumb with chevron separators.
 * Matches Stitch breadcrumb design across Collection, Listing, and Detail pages.
 *
 * @param {Array} items — [{ label, to? }] — last item is current page (no link)
 */
export default function BreadCrumb({ items = [] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex items-center gap-2 text-on-surface-variant font-label-caps text-label-caps uppercase flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={index} className="flex items-center gap-2">
              {isLast ? (
                <span className="text-primary font-semibold">{item.label}</span>
              ) : (
                <>
                  <Link
                    to={item.to || '/'}
                    className="hover:text-primary transition-colors duration-[400ms]"
                  >
                    {item.label}
                  </Link>
                  <ChevronRight size={14} className="opacity-60" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
