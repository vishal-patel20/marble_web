import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, ShieldAlert, Sparkles, Droplets, Sun, Check } from 'lucide-react';
import BreadCrumb from '../components/ui/BreadCrumb.jsx';
import ScrollReveal from '../components/ui/ScrollReveal.jsx';

export default function Maintenance() {
  const CARE_GUIDES = [
    {
      title: 'Marble Care & Sealing',
      badge: 'Natural Calcite Stone',
      icon: Sparkles,
      desc: 'Marble is a porous natural calcite stone. Clean daily using warm water and a neutral pH cleaner. Reseal every 12-18 months to prevent acid etching from citrus or wine.',
      tips: [
        'Use pH neutral liquid soap or dedicated marble cleaner',
        'Clean spills immediately to avoid deep absorption',
        'Avoid acidic products like vinegar, lemon, or bleach',
        'Apply penetrating marble sealer annually'
      ]
    },
    {
      title: 'Granite & Quartzite Durability',
      badge: 'High Density Igneous',
      icon: Droplets,
      desc: 'Granite and quartzite possess extreme surface hardness and scratch resistance. Clean with soft micro-fiber cloths. Re-seal polished surfaces every 2 years.',
      tips: [
        'Resistant to thermal shock and direct heat',
        'Use non-abrasive pads for daily wiping',
        'Periodically check seal efficiency with water drop test',
        'Ideal for heavy culinary and commercial prep areas'
      ]
    },
    {
      title: 'Onyx & Backlit Surface Care',
      badge: 'Translucent Crystalline',
      icon: Sun,
      desc: 'Onyx is a soft, delicate translucent gemstone. Clean only with extra-soft micro-fiber cloths and warm water. Ensure LED backlighting strips stay dust-free.',
      tips: [
        'Dust gently with dry lint-free cloth',
        'Never use abrasive scrubbing pads or chemicals',
        'Keep ambient lighting drivers properly ventilated',
        'Apply specialist onyx protective coat annually'
      ]
    }
  ];

  return (
    <>
      <title>Stone Care &amp; Maintenance — MarbleCraft</title>
      <meta
        name="description"
        content="Expert maintenance guidelines, sealing routines, and cleaning recommendations for luxury natural stone surfaces."
      />

      <main className="max-w-[1440px] mx-auto px-[20px] md:px-[80px] py-12 md:py-24 pt-32 min-h-screen">
        
        {/* Header */}
        <header className="mb-16">
          <BreadCrumb
            items={[
              { label: 'Home',        to: '/'            },
              { label: 'Maintenance', to: '/maintenance' },
            ]}
          />

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-gold-accent font-label-caps text-label-caps uppercase tracking-widest mb-3">
              <Wrench size={20} />
              Preserving Architectural Perfection
            </div>
            <h1
              className="text-[40px] md:text-[64px] font-[600] leading-[1.1] tracking-[-0.03em] text-primary mb-6"
              style={{ fontFamily: 'Inter' }}
            >
              Stone Care &amp; Maintenance
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              Proper care ensures your investment retains its original luster, depth, and structural integrity for generations to come.
            </p>
          </div>
        </header>

        {/* Care Guides Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {CARE_GUIDES.map((guide, idx) => {
            const Icon = guide.icon;
            return (
              <ScrollReveal key={guide.title} delay={idx * 0.1}>
                <div className="bg-surface-container-low p-8 rounded-2xl border border-outline-variant/30 flex flex-col h-full hover:shadow-xl transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-gold-accent/10 border border-gold-accent/30 flex items-center justify-center text-gold-accent mb-6">
                    <Icon size={24} />
                  </div>
                  <span className="font-label-caps text-[11px] text-gold-accent tracking-widest uppercase mb-2">
                    {guide.badge}
                  </span>
                  <h2 className="text-2xl font-[500] text-primary mb-4" style={{ fontFamily: 'Inter' }}>
                    {guide.title}
                  </h2>
                  <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">
                    {guide.desc}
                  </p>
                  
                  <div className="mt-auto pt-6 border-t border-outline-variant/30 space-y-3">
                    <h3 className="font-label-caps text-xs text-primary uppercase tracking-wider font-semibold">
                      Best Practices:
                    </h3>
                    {guide.tips.map((tip) => (
                      <div key={tip} className="flex items-start gap-2.5 text-xs text-on-surface-variant">
                        <Check size={14} className="text-gold-accent shrink-0 mt-0.5" />
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* CTA Card */}
        <ScrollReveal>
          <div className="glass-panel p-10 md:p-14 rounded-3xl border border-outline-variant flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="max-w-xl">
              <h2 className="text-3xl font-[500] text-primary mb-3" style={{ fontFamily: 'Inter' }}>
                Need Specialist Restoration or Sealing Kits?
              </h2>
              <p className="text-on-surface-variant">
                Our stone care specialists provide professional sealing products and on-site restoration services for private residences and commercial spaces.
              </p>
            </div>
            <Link
              to="/quote"
              className="px-8 py-4 bg-primary text-on-primary font-label-caps text-xs tracking-widest uppercase rounded-full hover:bg-gold-accent hover:text-white transition-all shrink-0"
            >
              Request Maintenance Support
            </Link>
          </div>
        </ScrollReveal>

      </main>
    </>
  );
}
