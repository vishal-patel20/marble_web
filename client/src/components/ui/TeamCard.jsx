/**
 * TeamCard — 3/4 aspect portrait card for the Heritage page leadership section.
 * Image scale on hover, name and title below.
 * Matches Stitch `our_heritage_vision/code.html` team member cards.
 */
export default function TeamCard({ member }) {
  return (
    <div className="group cursor-pointer">
      <div className="overflow-hidden mb-6 bg-surface-container-high aspect-[3/4]">
        <img
          src={member.image}
          alt={member.name}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[800ms] ease-out"
        />
      </div>
      <h4 className="font-body-lg text-body-lg text-primary font-medium">{member.name}</h4>
      <p className="font-body-md text-body-md text-on-surface-variant">{member.title}</p>
    </div>
  );
}
