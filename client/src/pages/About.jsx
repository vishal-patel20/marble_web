import { Droplets, TreePine } from 'lucide-react';
import ScrollReveal from '../components/ui/ScrollReveal.jsx';
import TeamCard from '../components/ui/TeamCard.jsx';
import { teamMembers } from '../data/collections.js';

// ── Heritage Hero ─────────────────────────────────────────────────────
function HeritageHero() {
  return (
    <header className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-[20px] md:px-[80px] max-w-[1440px] mx-auto">
      <div className="max-w-3xl">
        <h1
          className="text-[40px] md:text-[72px] font-[600] leading-[1.2] md:leading-[1.1] tracking-[-0.02em] md:tracking-[-0.04em] text-primary mb-6 text-balance"
          style={{ fontFamily: 'Inter' }}
        >
          Forged by time.<br />Crafted for eternity.
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
          MarbleCraft represents the pinnacle of stone heritage, blending centuries-old quarrying traditions with cutting-edge architectural precision. We curate the earth's finest materials for the world's most discerning spaces.
        </p>
      </div>
    </header>
  );
}

// ── Company Story Split Layout ────────────────────────────────────────
function CompanyStory() {
  return (
    <section className="max-w-[1440px] mx-auto px-[20px] md:px-[80px] my-[160px]">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-[32px] items-center">

        {/* Text */}
        <ScrollReveal className="md:col-span-5 flex flex-col gap-12">
          <div>
            <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-4 uppercase">
              Our History
            </h2>
            <h3
              className="text-[48px] font-[500] leading-[1.2] tracking-[-0.02em] text-primary mb-6"
              style={{ fontFamily: 'Inter' }}
            >
              A legacy etched in stone.
            </h3>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Founded over four decades ago, MarbleCraft began as a modest family endeavor in the heart of Carrara. Today, it stands as a globally recognized atelier of luxury natural stone. Our enduring commitment to quality ensures that every slab we select tells a story of geological majesty and human refinement.
            </p>
          </div>

          <div>
            <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-4 uppercase">
              Our Vision
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              We envision spaces that transcend fleeting trends. By treating raw stone as a canvas for architectural innovation, we empower designers and homeowners to create environments of quiet, uncompromising luxury.
            </p>
          </div>

          <div>
            <button className="bg-primary text-on-primary hover:bg-secondary-container hover:text-on-secondary-container transition-colors duration-[400ms] px-8 py-4 font-label-caps text-label-caps tracking-widest uppercase">
              Explore Our Quarries
            </button>
          </div>
        </ScrollReveal>

        {/* Image with floating glass card */}
        <ScrollReveal delay={0.2} className="md:col-span-6 md:col-start-7 relative mt-12 md:mt-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCoGQMAZXR9xZXAmayTfaxAbOURbF4lmRj1dsnLVQuAW-vBv5aXj5Do-KBIou8gjmBzsYBuN26EjgTV4L6dbhm-ndB57pqrfUj6TKnRpIOBt9duSmr3dKbN27XhDjtJleo45MI6nJmkKazaNvCXYns7Vkfk9wS2ueS0LxVHfUNRVOGYRLgYFo-hrMat-FtVblutb4Y76It9Bu38MavLCIQq2pFwzlB7Cw9auw0pzxZ9VDDn2zfQrNc4"
            alt="Carrara marble quarry"
            loading="lazy"
            className="w-full h-auto object-cover rounded-sm shadow-2xl"
          />
          {/* Floating purity index glass card */}
          <div className="absolute -bottom-10 -left-10 md:-left-20 w-64 glass-panel p-6 rounded-lg soft-shadow">
            <p className="font-label-caps text-label-caps text-primary mb-2">Purity Index</p>
            <p className="text-[32px] font-[500] leading-[1.3] text-primary" style={{ fontFamily: 'Inter' }}>99.8%</p>
            <p className="font-body-md text-body-md text-on-surface-variant text-sm mt-2">
              Unmatched structural integrity across our flagship quartz line.
            </p>
          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}

// ── Sustainability Section ────────────────────────────────────────────
function Sustainability() {
  return (
    <section className="relative my-[160px]" style={{ minHeight: '500px' }}>
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center w-full h-full"
        style={{
          backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuBsP2RFct8JN40Pf8W5wuUbiwQxiFROX7kexim8eBleu3ScAdrQLGj1AdANgflCjqo6EsUtfQ6Kx9iJEoFSDlDR92kDqdf0WyvX042Pc_XQbla7VVecuVlh0H6nTR4krfiVSfwTUb0vYoBhbmR2Bj-99zAzsK4Nmq8MF2JqkQp3OcVzc-k_6cQhEYLClmIXqpVJS_YBS_PtgGtf28OqkQA_JzUSUScs9x37RLWS4vfaBXBdjpog7wp7')`,
        }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/20" />

      <div className="relative max-w-[1440px] mx-auto px-[20px] md:px-[80px] py-32 flex justify-end">
        <ScrollReveal className="w-full md:w-1/2 lg:w-5/12 glass-panel p-12 rounded-xl text-primary">
          <h2
            className="text-[48px] font-[500] leading-[1.2] tracking-[-0.02em] mb-6"
            style={{ fontFamily: 'Inter' }}
          >
            Sustainable Mastery.
          </h2>
          <p className="font-body-lg text-body-lg mb-8 opacity-90">
            True luxury respects its origins. Our extraction processes are engineered to minimize environmental impact, utilizing closed-loop water systems and zero-waste cutting technologies. We restore quarry landscapes to ensure the earth remains as beautiful as the stone it provides.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start gap-4">
              <Droplets size={24} className="mt-1 shrink-0" />
              <div>
                <strong className="block font-label-caps text-label-caps tracking-widest uppercase">
                  100% Water Recycling
                </strong>
                <span className="font-body-md text-body-md opacity-80">
                  Advanced filtration systems in all facilities.
                </span>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <TreePine size={24} className="mt-1 shrink-0" />
              <div>
                <strong className="block font-label-caps text-label-caps tracking-widest uppercase">
                  Habitat Restoration
                </strong>
                <span className="font-body-md text-body-md opacity-80">
                  Dedicated funding for regional reforestation.
                </span>
              </div>
            </li>
          </ul>
        </ScrollReveal>
      </div>
    </section>
  );
}

// ── Leadership Section ────────────────────────────────────────────────
function Leadership() {
  return (
    <section className="max-w-[1440px] mx-auto px-[20px] md:px-[80px] my-[160px]">
      <ScrollReveal className="mb-16 text-center md:text-left">
        <h2 className="font-label-caps text-label-caps text-on-surface-variant mb-4 uppercase">
          Our Leadership
        </h2>
        <h3
          className="text-[48px] font-[500] leading-[1.2] tracking-[-0.02em] text-primary"
          style={{ fontFamily: 'Inter' }}
        >
          Architects of permanence.
        </h3>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-[32px]">
        {teamMembers.map((member, i) => (
          <ScrollReveal key={member.id} delay={i * 0.1}>
            <TeamCard member={member} />
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}

// ── About Page ────────────────────────────────────────────────────────
export default function About() {
  return (
    <>
      <title>MarbleCraft | Our Heritage &amp; Vision</title>
      <HeritageHero />
      <main>
        <CompanyStory />
        <Sustainability />
        <Leadership />
      </main>
    </>
  );
}
