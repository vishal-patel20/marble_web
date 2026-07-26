/**
 * FilterChip — pill-shaped filter button.
 * Active state: bg-primary (black) text-white.
 * Inactive: bg-surface-variant with hover to primary.
 * Matches Stitch Collection page filter chips exactly.
 */
export default function FilterChip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`
        px-4 py-2 rounded-full font-label-caps text-label-caps uppercase tracking-wider
        transition-colors duration-[400ms] whitespace-nowrap
        ${active
          ? 'bg-primary text-on-primary'
          : 'bg-surface-variant text-on-surface hover:bg-primary hover:text-on-primary'
        }
      `}
    >
      {label}
    </button>
  );
}
