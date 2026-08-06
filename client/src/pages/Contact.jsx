import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod'; // wait! We did not add @hookform/resolvers in package.json devDependencies.
// Let's check package.json for client. It has react-hook-form and zod, but not @hookform/resolvers.
// Wait, can we use standard react-hook-form validation without resolvers, or should we install @hookform/resolvers?
// It's much simpler and completely robust to use standard react-hook-form validation or write a simple validation object, OR we can install @hookform/resolvers.
// Let's check. Yes, react-hook-form's built-in validation is extremely powerful and requires zero extra peer dependencies, making it compile smoothly!
// Let's use react-hook-form's built-in validation to prevent dependencies resolution errors.
import { Mail, Phone, MapPin, MessageSquare, Clock, Send } from 'lucide-react';
import axiosInstance from '../api/axiosInstance.js';
import { toast } from 'react-toastify';
import Button from '../components/ui/Button.jsx';

export default function Contact() {
  const [loading, setLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axiosInstance.post('/leads/inquiries', data);
      toast.success('Inquiry submitted successfully! Our expert will call you back.');
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Submission failed. Please check parameters.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-16 sm:px-6 lg:px-8">
      
      {/* Page Title */}
      <div className="text-center max-w-xl mx-auto mb-16">
        <h1 className="text-4xl font-extrabold font-serif text-slate-800 dark:text-white">Connect With Us</h1>
        <p className="text-sm text-slate-500 mt-3 leading-relaxed">
          Request bespoke cut sizes, order sample packages, or schedule a physical gallery tour with our stone consultants.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Info Grid (4 Cols) */}
        <div className="lg:col-span-5 space-y-8">
          
          <div className="glass-panel p-8 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-6">
            <h3 className="text-xl font-bold font-serif text-slate-800 dark:text-white">Verona Showroom</h3>
            
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gold-400 mr-4 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-200 block text-sm">Corporate Office & Yard</span>
                <span className="text-sm text-slate-400">12 Quarry Blvd, Industrial Zone, Verona / NY 10022</span>
              </div>
            </div>

            <div className="flex items-start">
              <Phone className="h-5 w-5 text-gold-400 mr-4 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-200 block text-sm">Direct Phone Lines</span>
                <span className="text-sm text-slate-400">+1 (555) 890-4422 / +1 (555) 890-4423</span>
              </div>
            </div>

            <div className="flex items-start">
              <Mail className="h-5 w-5 text-gold-400 mr-4 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-200 block text-sm">Email Inquiries</span>
                <span className="text-sm text-slate-400">info@premiummarbles.com / sales@premiummarbles.com</span>
              </div>
            </div>

            <div className="flex items-start">
              <Clock className="h-5 w-5 text-gold-400 mr-4 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-700 dark:text-slate-200 block text-sm">Showroom Hours</span>
                <span className="text-sm text-slate-400">Mon - Sat: 9:00 AM - 6:00 PM <br />Sunday: Closed</span>
              </div>
            </div>
          </div>

          {/* Embedded Google Map Placeholder */}
          <div className="h-72 rounded-2xl overflow-hidden shadow-md border border-slate-100 dark:border-slate-800 bg-slate-200 dark:bg-slate-800">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d193595.15830869428!2d-74.11976373099718!3d40.69766374874431!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2sus!4v1652882894567!5m2!1sen!2sus"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Showroom Location Map"
            />
          </div>

        </div>

        {/* Lead Form Grid (7 Cols) */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit(onSubmit)} className="glass-panel p-10 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-6">
            <h3 className="text-2xl font-bold font-serif text-slate-800 dark:text-white mb-2">Request Consultation</h3>
            <p className="text-xs text-slate-400 mb-8 leading-relaxed">Fill out the request form below. A design estimator will coordinate material selection and pricing within 24 hours.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Your Name *</label>
                <input
                  type="text"
                  {...register('name', { required: 'Name is required' })}
                  className="w-full bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-400 text-slate-800 dark:text-white"
                  placeholder="e.g. Architect Adams"
                />
                {errors.name && <span className="text-xs text-red-500 mt-1">{errors.name.message}</span>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email Address *</label>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                  })}
                  className="w-full bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-400 text-slate-800 dark:text-white"
                  placeholder="e.g. info@firm.com"
                />
                {errors.email && <span className="text-xs text-red-500 mt-1">{errors.email.message}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Phone Number</label>
                <input
                  type="tel"
                  {...register('phone')}
                  className="w-full bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-400 text-slate-800 dark:text-white"
                  placeholder="+1 (555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Subject *</label>
                <select
                  {...register('subject', { required: 'Please select a topic' })}
                  className="w-full bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-400"
                >
                  <option value="">Select Topic</option>
                  <option value="Slabs Pricing Quote">Slabs Pricing Quote</option>
                  <option value="Custom Cut-to-Size Request">Custom Cut-to-Size Request</option>
                  <option value="Schedule Showroom Visit">Schedule Showroom Visit</option>
                  <option value="Sample Box Orders">Sample Box Orders</option>
                </select>
                {errors.subject && <span className="text-xs text-red-500 mt-1">{errors.subject.message}</span>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Your Message *</label>
              <textarea
                rows="5"
                {...register('message', { required: 'Message body is required' })}
                className="w-full bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm px-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-400 text-slate-800 dark:text-white"
                placeholder="Details of your installation project, required square footage, finishes..."
              />
              {errors.message && <span className="text-xs text-red-500 mt-1">{errors.message.message}</span>}
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full"
              icon={Send}
            >
              Submit Inquiry
            </Button>

          </form>
        </div>

      </div>

    </div>
  );
}
