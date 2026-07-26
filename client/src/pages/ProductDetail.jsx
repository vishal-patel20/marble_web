import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, MessageSquare } from 'lucide-react';
import ScrollReveal from '../components/ui/ScrollReveal.jsx';
import { calacattaBorghiniDetail } from '../data/collections.js';

export default function ProductDetail() {
  const { slug } = useParams();
  // In a real app, look up product by slug. We use the Stitch design mock.
  const product = calacattaBorghiniDetail;

  const [selectedFinish, setSelectedFinish] = useState(product.finishes[0]);
  const [projectName, setProjectName] = useState('');
  const [email,       setEmail]       = useState('');

  return (
    <>
      <title>{product.name} — MarbleCraft</title>

      <main className="flex-grow pt-[80px]">

        {/* ── Hero Gallery Section ── */}
        <section className="max-w-[1440px] mx-auto px-[20px] md:px-[80px] pt-12 pb-[160px]">

          {/* Breadcrumb + Title */}
          <div className="mb-8">
            <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-4">
              {product.categoryLabel}
            </p>
            <h1
              className="text-[40px] md:text-[72px] font-[600] leading-[1.2] md:leading-[1.1] tracking-[-0.02em] md:tracking-[-0.04em] text-primary mb-6"
              style={{ fontFamily: 'Inter' }}
            >
              {product.name}
            </h1>
          </div>

          {/* Bento Gallery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-[32px] h-auto md:h-[70vh]">

            {/* Main Image */}
            <div className="md:col-span-8 rounded-lg overflow-hidden relative group soft-shadow h-[400px] md:h-full">
              <img
                src={product.images.main}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-[400ms] group-hover:scale-105"
                loading="eager"
              />
            </div>

            {/* Thumbnails Stack */}
            <div className="md:col-span-4 flex flex-col gap-[32px] h-[400px] md:h-full">
              <div className="flex-1 rounded-lg overflow-hidden relative group soft-shadow">
                <img
                  src={product.images.thumb1}
                  alt={`${product.name} detail`}
                  className="w-full h-full object-cover transition-transform duration-[400ms] group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="flex-1 rounded-lg overflow-hidden relative group soft-shadow">
                <img
                  src={product.images.thumb2}
                  alt={`${product.name} application`}
                  className="w-full h-full object-cover transition-transform duration-[400ms] group-hover:scale-105"
                  loading="lazy"
                />
              </div>
            </div>

          </div>
        </section>

        {/* ── Details & Specs Section ── */}
        <section className="max-w-[1440px] mx-auto px-[20px] md:px-[80px] pb-[160px]">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-[32px]">

            {/* Left: Origin, Description, Finishes */}
            <div className="md:col-span-6 space-y-12">

              {/* Origin & Characteristics */}
              <ScrollReveal>
                <h2
                  className="text-[32px] font-[500] leading-[1.3] text-primary mb-6"
                  style={{ fontFamily: 'Inter' }}
                >
                  Origin &amp; Characteristics
                </h2>
                <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">
                  {product.description}
                </p>
                <div className="mt-8 grid grid-cols-2 gap-6">
                  <div className="border-l-2 border-outline-variant pl-4">
                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">Origin</p>
                    <p className="font-body-lg text-body-lg text-primary font-medium">{product.origin}</p>
                  </div>
                  <div className="border-l-2 border-outline-variant pl-4">
                    <p className="font-label-caps text-label-caps text-on-surface-variant mb-1">Primary Color</p>
                    <p className="font-body-lg text-body-lg text-primary font-medium">{product.primaryColor}</p>
                  </div>
                </div>
              </ScrollReveal>

              {/* Finish Options */}
              <ScrollReveal delay={0.1}>
                <h3
                  className="text-[32px] font-[500] leading-[1.3] text-primary mb-6"
                  style={{ fontFamily: 'Inter' }}
                >
                  Available Finishes
                </h3>
                <div className="flex flex-wrap gap-4">
                  {product.finishes.map((finish) => (
                    <button
                      key={finish}
                      onClick={() => setSelectedFinish(finish)}
                      className={`px-6 py-2 rounded-full font-body-md text-body-md transition-all duration-[400ms] ${
                        selectedFinish === finish
                          ? 'bg-[#111111] text-white hover:bg-[#C9A227]'
                          : 'bg-[#E8E8E8] text-primary hover:bg-[#111111] hover:text-white'
                      }`}
                    >
                      {finish}
                    </button>
                  ))}
                </div>
              </ScrollReveal>

            </div>

            {/* Right: Inquiry Form + Specs */}
            <div className="md:col-span-5 md:col-start-8 space-y-12">

              {/* Inquiry Glass Card */}
              <ScrollReveal delay={0.15}>
                <div className="glass-panel p-8 rounded-xl soft-shadow">
                  <h3
                    className="text-[32px] font-[500] leading-[1.3] text-primary mb-6"
                    style={{ fontFamily: 'Inter' }}
                  >
                    Inquire
                  </h3>
                  <form className="space-y-6 mb-8" onSubmit={(e) => e.preventDefault()}>
                    <div>
                      <input
                        type="text"
                        placeholder="Project Name"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="input-glass font-body-md text-primary placeholder-on-surface-variant"
                        style={{ fontFamily: 'Inter' }}
                      />
                    </div>
                    <div>
                      <input
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="input-glass font-body-md text-primary placeholder-on-surface-variant"
                        style={{ fontFamily: 'Inter' }}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-4 bg-[#111111] text-white font-body-lg text-center rounded transition-all duration-[400ms] hover:bg-[#C9A227]"
                    >
                      Request Quote
                    </button>
                  </form>

                  <div className="flex flex-col gap-4">
                    <button className="w-full py-3 border border-[#111111] text-primary font-body-md rounded transition-all duration-[400ms] hover:bg-surface-variant flex items-center justify-center gap-2">
                      <FileText size={20} />
                      Download Technical Sheet
                    </button>
                    <button className="w-full py-3 border border-[#111111] text-primary font-body-md rounded transition-all duration-[400ms] hover:bg-surface-variant flex items-center justify-center gap-2">
                      <MessageSquare size={20} />
                      WhatsApp Inquiry
                    </button>
                  </div>
                </div>
              </ScrollReveal>

              {/* Tech Specs Table */}
              <ScrollReveal delay={0.2}>
                <h3
                  className="text-[32px] font-[500] leading-[1.3] text-primary mb-6"
                  style={{ fontFamily: 'Inter' }}
                >
                  Technical Specifications
                </h3>
                <div className="border-t border-outline-variant">
                  {product.specs.map((spec) => (
                    <div key={spec.label} className="flex justify-between py-4 border-b border-outline-variant">
                      <span className="font-body-md text-on-surface-variant">{spec.label}</span>
                      <span className="font-body-md text-primary font-medium">{spec.value}</span>
                    </div>
                  ))}
                </div>
              </ScrollReveal>

            </div>

          </div>
        </section>

        {/* ── Application Showcase (Full Bleed) ── */}
        <section className="mb-[160px]">
          <div className="w-full h-[60vh] md:h-[80vh] relative">
            <img
              src={product.images.application}
              alt="Calacatta Borghini living room application"
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute bottom-[20px] md:bottom-[80px] left-[20px] md:left-[80px] glass-panel p-6 rounded-lg max-w-sm">
              <p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-2">Application</p>
              <p className="text-[32px] font-[500] leading-[1.3] text-primary" style={{ fontFamily: 'Inter' }}>
                Living Room Flooring
              </p>
            </div>
          </div>
        </section>

      </main>
    </>
  );
}
