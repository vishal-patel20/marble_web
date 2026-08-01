import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Lock, Eye, FileText, CheckCircle2 } from 'lucide-react';
import BreadCrumb from '../components/ui/BreadCrumb.jsx';
import ScrollReveal from '../components/ui/ScrollReveal.jsx';

export default function Privacy() {
  return (
    <>
      <title>Privacy Policy — MarbleCraft</title>
      <meta
        name="description"
        content="MarbleCraft Privacy Policy & Data Protection Standards for client inquiries and architectural project management."
      />

      <main className="max-w-[1440px] mx-auto px-[20px] md:px-[80px] py-12 md:py-24 pt-32 min-h-screen">
        
        {/* Header */}
        <header className="mb-16">
          <BreadCrumb
            items={[
              { label: 'Home',           to: '/'         },
              { label: 'Privacy Policy', to: '/privacy'  },
            ]}
          />

          <div className="max-w-3xl">
            <div className="flex items-center gap-2 text-gold-accent font-label-caps text-label-caps uppercase tracking-widest mb-3">
              <ShieldCheck size={20} />
              Data Protection &amp; Confidentiality
            </div>
            <h1
              className="text-[40px] md:text-[64px] font-[600] leading-[1.1] tracking-[-0.03em] text-primary mb-6"
              style={{ fontFamily: 'Inter' }}
            >
              Privacy Policy
            </h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
              At MarbleCraft, we hold your personal information and architectural project details to the highest standards of discretion and security.
            </p>
          </div>
        </header>

        {/* Content grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-20">
          
          <div className="md:col-span-8 space-y-12">
            
            <ScrollReveal>
              <section className="bg-surface-container-low p-8 md:p-10 rounded-2xl border border-outline-variant/30 space-y-4">
                <h2 className="text-2xl font-[500] text-primary flex items-center gap-3" style={{ fontFamily: 'Inter' }}>
                  <Eye className="text-gold-accent" size={24} />
                  1. Information We Collect
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                  We collect information necessary to fulfill inquiry requests, process custom fabrication orders, and deliver tailored architectural consultations. This includes contact details, project specifications, location parameters, and communications.
                </p>
              </section>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <section className="bg-surface-container-low p-8 md:p-10 rounded-2xl border border-outline-variant/30 space-y-4">
                <h2 className="text-2xl font-[500] text-primary flex items-center gap-3" style={{ fontFamily: 'Inter' }}>
                  <Lock className="text-gold-accent" size={24} />
                  2. Project &amp; Architectural Confidentiality
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                  All blueprints, CAD drawings, elevation specs, and site photographs shared for quote requests remain strictly confidential. MarbleCraft never dispatches private residential floorplans or unreleased commercial designs to third parties without prior written consent.
                </p>
              </section>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <section className="bg-surface-container-low p-8 md:p-10 rounded-2xl border border-outline-variant/30 space-y-4">
                <h2 className="text-2xl font-[500] text-primary flex items-center gap-3" style={{ fontFamily: 'Inter' }}>
                  <FileText className="text-gold-accent" size={24} />
                  3. Cookies &amp; Digital Analytics
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                  Our digital platform uses cookies strictly to save session preferences, retain user wishlists, and optimize page rendering times. We do not sell user data to advertising networks.
                </p>
              </section>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <section className="bg-surface-container-low p-8 md:p-10 rounded-2xl border border-outline-variant/30 space-y-4">
                <h2 className="text-2xl font-[500] text-primary flex items-center gap-3" style={{ fontFamily: 'Inter' }}>
                  <CheckCircle2 className="text-gold-accent" size={24} />
                  4. Your Rights &amp; Data Control
                </h2>
                <p className="text-on-surface-variant leading-relaxed">
                  You retain complete authority over your stored data. You may request account deletion, data extraction, or updates to your records at any time by contacting privacy@marblecraft.com.
                </p>
              </section>
            </ScrollReveal>

          </div>

          {/* Sidebar */}
          <aside className="md:col-span-4">
            <div className="sticky top-32 glass-panel p-8 rounded-2xl soft-shadow space-y-6">
              <h3 className="text-xl font-semibold text-primary" style={{ fontFamily: 'Inter' }}>
                Need Privacy Support?
              </h3>
              <p className="text-sm text-on-surface-variant">
                Our Data Compliance team is available to assist with non-disclosure agreements (NDAs) and custom data privacy agreements for corporate projects.
              </p>
              <Link
                to="/contact"
                className="w-full block py-3 bg-primary text-on-primary text-center font-label-caps text-xs tracking-widest uppercase rounded hover:bg-gold-accent transition-colors"
              >
                Contact Privacy Officer
              </Link>
            </div>
          </aside>

        </div>

      </main>
    </>
  );
}
