import { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, MessageSquare, ChevronRight, Maximize2, Rotate3d, X } from 'lucide-react';
import { jsPDF } from 'jspdf';
import ScrollReveal from '../components/ui/ScrollReveal.jsx';
import { getCollectionDetail } from '../data/collections.js';
import axiosInstance from '../api/axiosInstance.js';
import { toast } from 'react-toastify';

export default function ProductDetail() {
  const { category, slug } = useParams();
  const navigate = useNavigate();
  const activeSlug = slug || category;
  const activeCat  = slug ? category : undefined;
  
  const [apiProduct, setApiProduct] = useState(null);

  useEffect(() => {
    if (activeSlug) {
      axiosInstance.get('/inventory/products')
        .then((res) => {
          const prods = Array.isArray(res.data?.data?.products) 
            ? res.data.data.products 
            : Array.isArray(res.data?.data) 
              ? res.data.data 
              : Array.isArray(res.data) 
                ? res.data 
                : [];
          const found = prods.find(
            (p) =>
              String(p.id).toLowerCase() === String(activeSlug).toLowerCase() ||
              (p.slug && String(p.slug).toLowerCase() === String(activeSlug).toLowerCase()) ||
              (p.name && p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === String(activeSlug).toLowerCase())
          );
          if (found) {
            setApiProduct(found);
          }
        })
        .catch(() => {});
    }
  }, [activeSlug]);

  const baseProduct = getCollectionDetail(activeSlug, activeCat);

  const product = useMemo(() => {
    if (!apiProduct) return baseProduct;
    const catName = apiProduct.category?.name || apiProduct.categoryName || apiProduct.category || activeCat || 'Marble';
    const mainImg = apiProduct.imageUrl || apiProduct.image || baseProduct.images?.main || baseProduct.image;
    return {
      ...baseProduct,
      id: apiProduct.id,
      name: apiProduct.name,
      categoryLabel: `Collections / ${catName}`,
      breadcrumb: ['Collections', catName, apiProduct.name],
      origin: apiProduct.origins || apiProduct.origin || baseProduct.origin || 'International Reserve',
      primaryColor: apiProduct.colorFamily || apiProduct.color || baseProduct.primaryColor || 'Natural Stone',
      description: apiProduct.description || baseProduct.description,
      image: mainImg,
      images: {
        main: mainImg,
        thumb1: mainImg,
        thumb2: mainImg,
        application: mainImg,
      }
    };
  }, [apiProduct, baseProduct, activeCat]);

  const [selectedFinish, setSelectedFinish] = useState('Polished');
  const [fullName, setFullName]             = useState('');
  const [email, setEmail]                   = useState('');
  const [loading, setLoading]               = useState(false);
  const [lightboxOpen, setLightboxOpen]     = useState(false);

  const [activeImage, setActiveImage] = useState('');

  useEffect(() => {
    if (product) {
      setActiveImage(product.images?.main || product.image || '/images/showroom_3d_marble.png');
      if (product.finishes && product.finishes.length > 0) {
        setSelectedFinish(product.finishes[0]);
      }
    }
  }, [product]);

  const galleryImages = useMemo(() => {
    const main = product.images?.main || product.image || '/images/showroom_3d_marble.png';
    const t1   = product.images?.thumb1;
    const t2   = product.images?.thumb2;
    const set  = new Set([main]);
    if (t1) set.add(t1);
    if (t2) set.add(t2);

    const arr = Array.from(set);
    if (arr.length < 3) {
      arr.push('/images/stone_image_1.jpg', '/images/stone_image_23.jpg');
    }
    return arr.slice(0, 4);
  }, [product]);

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Dark Header Banner
      doc.setFillColor(17, 17, 17);
      doc.rect(0, 0, 210, 45, 'F');

      // Title & Branding
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(22);
      doc.text('MARBLECRAFT STUDIO', 15, 20);

      doc.setTextColor(201, 162, 39);
      doc.setFontSize(10);
      doc.text('TECHNICAL DATA SHEET & SPECIFICATION', 15, 28);

      doc.setTextColor(180, 180, 180);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.text(`Date: ${new Date().toLocaleDateString()}`, 145, 20);
      doc.text(`WhatsApp: +91 9057283248`, 145, 28);

      // Product Title Block
      let y = 58;
      doc.setTextColor(17, 17, 17);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(20);
      doc.text((product.name || 'NATURAL MARBLE').toUpperCase(), 15, y);

      y += 7;
      doc.setFontSize(10);
      doc.setTextColor(201, 162, 39);
      doc.text(`CATEGORY: ${(product.categoryLabel || 'COLLECTION').toUpperCase()}`, 15, y);

      // Divider Line
      y += 6;
      doc.setDrawColor(220, 220, 220);
      doc.setLineWidth(0.5);
      doc.line(15, y, 195, y);

      // Description Section
      y += 10;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(17, 17, 17);
      doc.text('Product Description', 15, y);

      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      doc.setTextColor(60, 60, 60);
      const splitDesc = doc.splitTextToSize(product.description || 'High quality natural stone slab.', 180);
      doc.text(splitDesc, 15, y);

      y += (splitDesc.length * 5) + 6;

      // Specification Table Header
      doc.setFillColor(245, 245, 245);
      doc.rect(15, y, 180, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10);
      doc.setTextColor(17, 17, 17);
      doc.text('Specification Parameter', 20, y + 5.5);
      doc.text('Detail / Value', 110, y + 5.5);

      y += 8;

      const specsData = [
        { label: 'Stone Material', value: product.name },
        { label: 'Country of Origin', value: product.origin || 'Italy' },
        { label: 'Primary Color', value: product.primaryColor || 'Natural' },
        { label: 'Active Finish', value: selectedFinish },
        { label: 'Available Finishes', value: (product.finishes || []).join(', ') },
        ...(product.specs || []).map(s => ({ label: s.label, value: s.value }))
      ];

      specsData.forEach((item, idx) => {
        if (idx % 2 === 1) {
          doc.setFillColor(250, 250, 250);
          doc.rect(15, y, 180, 8, 'F');
        }
        doc.setDrawColor(235, 235, 235);
        doc.line(15, y + 8, 195, y + 8);

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(50, 50, 50);
        doc.text(String(item.label), 20, y + 5.5);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        doc.text(String(item.value), 110, y + 5.5);

        y += 8;
      });

      // Care & Maintenance Notes
      y += 12;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(17, 17, 17);
      doc.text('Care & Fabrication Guidelines', 15, y);

      y += 6;
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(90, 90, 90);
      const careText = 'Natural marble slabs require professional sealing prior to installation. Clean only with neutral pH marble cleaners. Avoid acidic chemicals and abrasive scrubbers to preserve polished finish clarity.';
      const splitCare = doc.splitTextToSize(careText, 180);
      doc.text(splitCare, 15, y);

      // Footer Banner
      doc.setFillColor(17, 17, 17);
      doc.rect(0, 277, 210, 20, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8.5);
      doc.text('MarbleCraft Studio — Architectural Natural Stone Specialists', 15, 287);
      doc.text('WhatsApp: +91 9057283248', 145, 287);

      const fileName = `${product.name.toLowerCase().replace(/\s+/g, '_')}_technical_sheet.pdf`;
      doc.save(fileName);
      toast.success(`Downloaded ${product.name} Technical Sheet PDF`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      toast.error('Failed to generate technical PDF sheet.');
    }
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim()) {
      toast.error('Please fill in all required fields');
      return;
    }
    setLoading(true);
    try {
      axiosInstance.post('/leads/inquiry', {
        name: fullName.trim(),
        email: email.trim(),
        subject: `Product Inquiry: ${product.name}`,
        message: `Name: ${fullName.trim()} | Finish: ${selectedFinish} | Product: ${product.name}`,
        image: product.images?.main || product.image || ''
      }).catch(() => {});
    } catch (err) {
      console.error('Product inquiry log error:', err);
    } finally {
      setLoading(false);
      navigate(`/quote?name=${encodeURIComponent(fullName.trim())}&email=${encodeURIComponent(email.trim())}&stone=${encodeURIComponent(product.name)}`, {
        state: {
          name: fullName.trim(),
          email: email.trim(),
          stone: product.name,
          finish: selectedFinish
        }
      });
    }
  };

  return (
    <>
      <title>{product.name} — MarbleCraft Studio</title>

      <main className="flex-grow pt-20 bg-stone-50/50 dark:bg-stone-950/40">

        {/* ── Top Navigation Bar ── */}
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[80px] pt-8 pb-4 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer bg-stone-200/70 dark:bg-stone-800/70 hover:bg-stone-300 dark:hover:bg-stone-700 px-3.5 py-1.5 rounded-full shadow-sm"
          >
            <ArrowLeft size={14} />
            <span>Back</span>
          </button>
          <div className="text-[11px] font-bold text-stone-400 dark:text-stone-500 uppercase tracking-widest flex items-center gap-2">
            <Link to="/collection" className="hover:text-stone-700 dark:hover:text-stone-300">Collections</Link>
          </div>
        </div>

        {/* ── Top Title & Category Header ── */}
        <section className="max-w-[1440px] mx-auto px-[20px] md:px-[80px] pt-4 pb-6">
          <p className="font-label-caps text-xs text-amber-500 uppercase tracking-widest font-bold mb-2">
            {product.categoryLabel}
          </p>
          <h1
            className="text-[38px] md:text-[64px] font-[600] leading-[1.1] tracking-[-0.03em] text-stone-900 dark:text-white font-serif mb-3"
          >
            {product.name}
          </h1>
          <p className="text-sm md:text-base text-stone-600 dark:text-stone-400 max-w-3xl leading-relaxed">
            {product.description}
          </p>
        </section>

        {/* ── Hero Single Image Section ── */}
        <section className="max-w-[1440px] mx-auto px-[20px] md:px-[80px] pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Full Width Single Product Hero Image */}
            <div className="lg:col-span-12">
              <div className="relative aspect-[16/9] max-h-[650px] rounded-3xl overflow-hidden shadow-2xl bg-stone-900 border border-stone-200/80 dark:border-stone-800 group">
                <img
                  src={activeImage}
                  alt={product.name}
                  onError={(e) => { e.currentTarget.src = '/images/showroom_3d_marble.png'; }}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2 z-10">
                  <span className="bg-black/60 backdrop-blur-md border border-white/20 text-amber-400 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-sm">
                    {product.origin || 'Italy'}
                  </span>
                  <span className="bg-amber-400/90 text-stone-950 text-[10px] uppercase font-bold tracking-wider px-3 py-1 rounded-full shadow-sm">
                    Available in Stock
                  </span>
                </div>

                {/* Bottom Action Controls Overlay */}
                <div className="absolute bottom-4 right-4 flex items-center gap-2 z-10">
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="p-3 rounded-full bg-black/70 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all hover:scale-105 shadow-lg"
                    title="Fullscreen Preview"
                  >
                    <Maximize2 size={16} />
                  </button>
                  <Link
                    to="/showroom"
                    className="px-4 py-2 rounded-full bg-gold-accent hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-lg transition-all hover:scale-105"
                  >
                    <Rotate3d size={16} />
                    <span>3D Studio</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* Fullscreen Lightbox Modal */}
        {lightboxOpen && (
          <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <button
              onClick={() => setLightboxOpen(false)}
              className="absolute top-6 right-6 p-3 rounded-full bg-stone-800 text-white hover:bg-stone-700 transition-colors z-20"
            >
              <X size={20} />
            </button>
            <div className="max-w-5xl w-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-stone-800 bg-stone-950 flex flex-col items-center justify-center p-2">
              <img src={activeImage} alt={product.name} className="w-full max-h-[80vh] object-contain rounded-2xl" />
            </div>
          </div>
        )}

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
                  <form className="space-y-6 mb-8" onSubmit={handleInquirySubmit}>
                    <div>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
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
                        className="input-glass font-body-md text-primary placeholder-on-surface-variant font-sans"
                        style={{ fontFamily: 'Inter' }}
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-[#111111] text-white font-body-lg text-center rounded transition-all duration-[400ms] hover:bg-[#C9A227] disabled:opacity-50"
                    >
                      {loading ? 'Submitting...' : 'Request Quote'}
                    </button>
                  </form>

                  <div className="flex flex-col gap-4">
                    <button
                      type="button"
                      onClick={handleDownloadPDF}
                      className="w-full py-3 border border-[#111111] text-primary font-body-md rounded transition-all duration-[400ms] hover:bg-surface-variant flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                    >
                      <FileText size={20} />
                      Download Technical Sheet
                    </button>
                    <a
                      href={`https://wa.me/919057283248?text=Hello,%20I%20am%20interested%20in%20obtaining%20information%20for%20${encodeURIComponent(product.name)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 border border-[#111111] text-primary font-body-md rounded transition-all duration-[400ms] hover:bg-surface-variant flex items-center justify-center gap-2"
                    >
                      <MessageSquare size={20} />
                      WhatsApp Inquiry
                    </a>
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

      </main>
    </>
  );
}

