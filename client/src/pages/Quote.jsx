import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Check, X, Home, Building2, Briefcase, UploadCloud } from 'lucide-react';

const STEPS = [
  { id: 1, label: 'Personal Info' },
  { id: 2, label: 'Project'       },
  { id: 3, label: 'Design'        },
  { id: 4, label: 'Summary'       },
];

const STONE_OPTIONS = [
  { value: 'calacatta', label: 'Calacatta Gold Marble' },
  { value: 'statuario', label: 'Statuario Marble'       },
  { value: 'nero',      label: 'Nero Marquina'          },
  { value: 'quartzite', label: 'Taj Mahal Quartzite'    },
];

const PROJECT_TYPES = [
  { value: 'villa',    label: 'Luxury Villa',    Icon: Home       },
  { value: 'hotel',   label: 'Boutique Hotel',  Icon: Building2  },
  { value: 'office',  label: 'Corporate Office', Icon: Briefcase  },
];

const CATEGORIES = ['Architect', 'Interior Designer', 'Homeowner', 'Contractor'];

// ── Step components ───────────────────────────────────────────────────
function Step1({ data, onChange, onNext }) {
  return (
    <div>
      <h2
        className="text-[48px] font-[300] leading-[1.2] tracking-[-0.02em] mb-8 text-primary"
        style={{ fontFamily: 'Inter' }}
      >
        Let's start with the basics.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col gap-2">
          <label className="font-label-caps text-label-caps text-on-surface-variant">Full Name</label>
          <input
            type="text"
            placeholder="Jane Doe"
            value={data.name}
            onChange={(e) => onChange('name', e.target.value)}
            className="input-glass font-body-lg text-primary placeholder-on-surface-variant"
            style={{ fontFamily: 'Inter' }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-label-caps text-label-caps text-on-surface-variant">Email Address</label>
          <input
            type="email"
            placeholder="jane@studio.com"
            value={data.email}
            onChange={(e) => onChange('email', e.target.value)}
            className="input-glass font-body-lg text-primary placeholder-on-surface-variant"
            style={{ fontFamily: 'Inter' }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-12">
        <label className="font-label-caps text-label-caps text-on-surface-variant">Professional Category</label>
        <div className="flex flex-wrap gap-4">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => onChange('category', cat)}
              className={`px-6 py-3 rounded-full border transition-all duration-[400ms] font-body-md text-body-md ${
                data.category === cat
                  ? 'bg-[#111111] text-white border-[#111111]'
                  : 'border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={onNext}
          className="btn-primary px-8 py-4 rounded-full font-label-caps text-label-caps flex items-center gap-2"
        >
          Next Step
          <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function Step2({ data, onChange, onNext, onPrev }) {
  return (
    <div>
      <h2
        className="text-[48px] font-[300] leading-[1.2] tracking-[-0.02em] mb-8 text-primary"
        style={{ fontFamily: 'Inter' }}
      >
        Define your vision.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="flex flex-col gap-2">
          <label className="font-label-caps text-label-caps text-on-surface-variant">Type of Stone</label>
          <select
            value={data.stone}
            onChange={(e) => onChange('stone', e.target.value)}
            className="input-glass font-body-lg text-primary appearance-none cursor-pointer"
            style={{ fontFamily: 'Inter' }}
          >
            <option value="" disabled>Select Material</option>
            {STONE_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-2">
          <label className="font-label-caps text-label-caps text-on-surface-variant">Estimated Sq. Ft.</label>
          <input
            type="number"
            placeholder="e.g. 1500"
            value={data.sqft}
            onChange={(e) => onChange('sqft', e.target.value)}
            className="input-glass font-body-lg text-primary placeholder-on-surface-variant"
            style={{ fontFamily: 'Inter' }}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 mb-12">
        <label className="font-label-caps text-label-caps text-on-surface-variant">Project Type</label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PROJECT_TYPES.map(({ value, label, Icon }) => (
            <label key={value} className="cursor-pointer">
              <input
                type="radio"
                name="project_type"
                className="sr-only peer"
                checked={data.projectType === value}
                onChange={() => onChange('projectType', value)}
              />
              <div className="border border-outline-variant rounded-lg p-6 text-center peer-checked:border-[#111111] peer-checked:bg-[#111111] peer-checked:text-white transition-all duration-[400ms] hover:border-primary text-primary">
                <Icon size={30} className="mx-auto mb-2" />
                <div className="font-body-md text-body-md">{label}</div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button type="button" onClick={onPrev} className="px-6 py-3 font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
          <ArrowLeft size={18} /> Back
        </button>
        <button type="button" onClick={onNext} className="btn-primary px-8 py-4 rounded-full font-label-caps text-label-caps flex items-center gap-2">
          Next Step <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function Step3({ data, onChange, onNext, onPrev }) {
  return (
    <div>
      <h2
        className="text-[48px] font-[300] leading-[1.2] tracking-[-0.02em] mb-8 text-primary"
        style={{ fontFamily: 'Inter' }}
      >
        Share your blueprints.
      </h2>
      <p className="font-body-md text-body-md text-on-surface-variant mb-8 max-w-[500px]">
        Upload CAD files, architectural drawings, or rough sketches to help our artisans understand the precise requirements of your space.
      </p>

      {/* Drag & Drop Zone */}
      <div className="border-2 border-dashed border-outline-variant rounded-xl p-12 flex flex-col items-center justify-center text-center mb-12 hover:border-primary hover:bg-black/5 transition-all duration-[400ms] cursor-pointer">
        <UploadCloud size={40} className="text-outline-variant mb-4" />
        <div className="font-body-lg text-primary mb-2">Drag &amp; drop files here</div>
        <div className="font-body-md text-on-surface-variant mb-6 text-sm">
          Supported formats: PDF, DWG, DXF, JPG (Max 50MB)
        </div>
        <label className="px-6 py-2 border border-[#111111] rounded-full font-label-caps text-label-caps text-[#111111] hover:bg-[#111111] hover:text-white transition-all duration-[400ms] cursor-pointer">
          Browse Files
          <input type="file" className="sr-only" onChange={(e) => onChange('file', e.target.files[0])} />
        </label>
      </div>

      {data.file && (
        <p className="font-body-md text-on-surface-variant mb-8">
          ✓ {data.file.name} ({(data.file.size / 1024 / 1024).toFixed(1)} MB)
        </p>
      )}

      <div className="flex justify-between items-center">
        <button type="button" onClick={onPrev} className="px-6 py-3 font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
          <ArrowLeft size={18} /> Back
        </button>
        <button type="button" onClick={onNext} className="btn-primary px-8 py-4 rounded-full font-label-caps text-label-caps flex items-center gap-2">
          Review Summary <ArrowRight size={18} />
        </button>
      </div>
    </div>
  );
}

function Step4({ data, goTo, onSubmit }) {
  return (
    <div>
      <h2
        className="text-[48px] font-[300] leading-[1.2] tracking-[-0.02em] mb-8 text-primary"
        style={{ fontFamily: 'Inter' }}
      >
        Inquiry Summary.
      </h2>

      <div className="bg-surface-container-low rounded-lg p-8 mb-12 flex flex-col gap-6">
        {/* Contact */}
        <div className="flex justify-between items-start border-b border-outline-variant/30 pb-6">
          <div>
            <div className="font-label-caps text-label-caps text-on-surface-variant mb-1">Contact</div>
            <div className="font-body-lg text-body-lg text-primary">{data.name || 'Jane Doe'} ({data.category || 'Architect'})</div>
            <div className="font-body-md text-body-md text-on-surface-variant">{data.email || 'jane@studio.com'}</div>
          </div>
          <button onClick={() => goTo(1)} className="text-primary hover:text-[#C9A227] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
        </div>

        {/* Project */}
        <div className="flex justify-between items-start border-b border-outline-variant/30 pb-6">
          <div>
            <div className="font-label-caps text-label-caps text-on-surface-variant mb-1">Project Scope</div>
            <div className="font-body-lg text-body-lg text-primary">
              {STONE_OPTIONS.find((s) => s.value === data.stone)?.label || 'Calacatta Gold Marble'} • {PROJECT_TYPES.find((p) => p.value === data.projectType)?.label || 'Luxury Villa'}
            </div>
            <div className="font-body-md text-body-md text-on-surface-variant">Approx. {data.sqft || '1,500'} sq ft.</div>
          </div>
          <button onClick={() => goTo(2)} className="text-primary hover:text-[#C9A227] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
        </div>

        {/* File */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            <div>
              <div className="font-body-md text-body-md text-primary">{data.file?.name || 'villa_floorplan_v2.dwg'}</div>
              <div className="text-sm text-on-surface-variant">{data.file ? `${(data.file.size / 1024 / 1024).toFixed(1)} MB` : '2.4 MB'}</div>
            </div>
          </div>
          <button onClick={() => goTo(3)} className="text-primary hover:text-[#C9A227] transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
          </button>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button type="button" onClick={() => goTo(3)} className="px-6 py-3 font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2">
          <ArrowLeft size={18} /> Back
        </button>
        <button type="button" onClick={onSubmit} className="btn-primary px-8 py-4 rounded-full font-label-caps text-label-caps flex items-center gap-2">
          Submit Request <Check size={18} />
        </button>
      </div>
    </div>
  );
}

// ── Quote Page ────────────────────────────────────────────────────────
export default function Quote() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '', email: '', category: '', stone: '', sqft: '', projectType: '', file: null,
  });

  const updateField = (field, value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => setSubmitted(true);

  const progressWidth = `${(step / 4) * 100}%`;

  const stepVariants = {
    enter:  { opacity: 0, x: 20  },
    center: { opacity: 1, x: 0   },
    exit:   { opacity: 0, x: -20 },
  };

  return (
    <>
      <title>Bespoke Quote Request — MarbleCraft</title>

      {/* Background marble image */}
      <div className="fixed inset-0 z-[-1]">
        <div
          className="w-full h-full bg-cover bg-center opacity-40"
          style={{
            backgroundImage: `url('/images/stone_image_32.jpg')`,
          }}
        />
      </div>

      {/* Minimal Quote Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-white/15 backdrop-blur-xl border-b border-white/30 shadow-2xl shadow-black/5">
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[80px] flex justify-between items-center h-20">
          <div className="font-[500] text-[32px] leading-[1.3] tracking-tight text-primary" style={{ fontFamily: 'Inter' }}>
            MarbleCraft
          </div>
          <Link
            to="/"
            className="text-on-surface-variant hover:text-primary transition-colors duration-[400ms] font-label-caps text-label-caps flex items-center gap-2"
          >
            <X size={18} />
            Exit Quote
          </Link>
        </div>
      </nav>

      {/* Main content */}
      <main className="flex-grow flex items-center justify-center pt-32 pb-20 px-[20px] md:px-[80px] min-h-screen">

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-[800px] glass-panel rounded-xl p-8 md:p-12 text-center"
          >
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-6">
              <Check size={32} className="text-white" />
            </div>
            <h2 className="text-[48px] font-[500] leading-[1.2] tracking-[-0.02em] text-primary mb-4" style={{ fontFamily: 'Inter' }}>
              Request Submitted.
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
              Our team will contact you within 24 hours with a personalized quote for your project.
            </p>
            <Link to="/" className="btn-primary px-8 py-4 rounded-full font-label-caps text-label-caps inline-block">
              Return Home
            </Link>
          </motion.div>
        ) : (
          <div className="w-full max-w-[800px] glass-panel rounded-xl p-8 md:p-12 relative overflow-hidden">

            {/* Progress Indicator */}
            <div className="mb-12 relative">
              <div className="flex justify-between items-center mb-4">
                {STEPS.map((s) => (
                  <div
                    key={s.id}
                    className={`font-label-caps text-label-caps transition-colors duration-[400ms] ${
                      s.id <= step ? 'text-primary' : 'text-outline-variant'
                    }`}
                  >
                    {s.label}
                  </div>
                ))}
              </div>
              <div className="h-[2px] bg-outline-variant/30 w-full rounded-full relative">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-primary rounded-full"
                  initial={{ width: '25%' }}
                  animate={{ width: progressWidth }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                />
              </div>
            </div>

            {/* Form Steps */}
            <div className="relative min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                >
                  {step === 1 && <Step1 data={formData} onChange={updateField} onNext={() => setStep(2)} />}
                  {step === 2 && <Step2 data={formData} onChange={updateField} onNext={() => setStep(3)} onPrev={() => setStep(1)} />}
                  {step === 3 && <Step3 data={formData} onChange={updateField} onNext={() => setStep(4)} onPrev={() => setStep(2)} />}
                  {step === 4 && <Step4 data={formData} goTo={setStep} onSubmit={handleSubmit} />}
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        )}
      </main>
    </>
  );
}
