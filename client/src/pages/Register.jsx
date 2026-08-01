import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import { Eye, EyeOff, User, Mail, Lock, Phone } from 'lucide-react';
import { toast } from 'react-toastify';

import axiosInstance from '../api/axiosInstance.js';
import { useAuthStore } from '../store/authStore.js';
import Button from '../components/ui/Button.jsx';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(80),
    email: z.string().email('Invalid email address'),
    phone: z.string().optional(),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
      .regex(/[0-9]/, 'Must contain at least one digit'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export default function Register() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data) => {
    try {
      const res = await axiosInstance.post('/auth/register', {
        name: data.name,
        email: data.email,
        phone: data.phone,
        password: data.password,
      });

      const { user, accessToken } = res.data.data;
      setAuth(user, accessToken);
      toast.success(`Welcome, ${user.name}! Account created successfully.`);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      toast.error(msg);
    }
  };

  return (
    <>
      <Helmet>
        <title>Create Account | Premium Stone Showroom</title>
        <meta name="description" content="Join our exclusive marble showroom clientele. Create your account to save favorites, track orders, and get personalized stone recommendations." />
      </Helmet>

      <div className="min-h-screen bg-slate-50 dark:bg-luxury-950 flex">
        {/* Left Panel - Form */}
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-md w-full mx-auto"
          >
            {/* Logo */}
            <div className="mb-8">
              <Link to="/" className="inline-flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center">
                  <span className="text-white font-black text-xs">M</span>
                </div>
                <span className="font-serif font-bold text-xl text-slate-800 dark:text-white">MarbleElite</span>
              </Link>
            </div>

            <h1 className="text-3xl font-extrabold font-serif text-slate-800 dark:text-white mb-2">
              Create Account
            </h1>
            <p className="text-slate-500 text-sm mb-8">
              Join our exclusive stone collection community.{' '}
              <Link to="/login" className="text-gold-400 hover:underline font-semibold">
                Sign in instead
              </Link>
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="register-name"
                    type="text"
                    autoComplete="name"
                    {...register('name')}
                    className="w-full pl-10 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-gold-400 transition-colors"
                    placeholder="e.g. John Architect"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 mt-1.5">{errors.name.message}</p>}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="register-email"
                    type="email"
                    autoComplete="email"
                    {...register('email')}
                    className="w-full pl-10 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-gold-400 transition-colors"
                    placeholder="e.g. architect@studio.com"
                  />
                </div>
                {errors.email && <p className="text-xs text-red-500 mt-1.5">{errors.email.message}</p>}
              </div>

              {/* Phone (optional) */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Phone <span className="text-slate-500 normal-case font-normal">(optional)</span>
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="register-phone"
                    type="tel"
                    autoComplete="tel"
                    {...register('phone')}
                    className="w-full pl-10 pr-4 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-gold-400 transition-colors"
                    placeholder="+1 555 000 0000"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('password')}
                    className="w-full pl-10 pr-12 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-gold-400 transition-colors"
                    placeholder="Min. 8 chars, 1 uppercase, 1 digit"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-gold-400 transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs text-red-500 mt-1.5">{errors.password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    id="register-confirm-password"
                    type={showConfirm ? 'text' : 'password'}
                    autoComplete="new-password"
                    {...register('confirmPassword')}
                    className="w-full pl-10 pr-12 py-3.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-gold-400 transition-colors"
                    placeholder="Repeat your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-gold-400 transition-colors"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-xs text-red-500 mt-1.5">{errors.confirmPassword.message}</p>}
              </div>

              {/* Terms */}
              <p className="text-xs text-slate-400 leading-relaxed">
                By creating an account, you agree to our{' '}
                <span className="text-gold-400 cursor-pointer hover:underline">Terms of Service</span>{' '}
                and{' '}
                <span className="text-gold-400 cursor-pointer hover:underline">Privacy Policy</span>.
              </p>

              <Button
                id="register-submit"
                type="submit"
                variant="primary"
                size="lg"
                loading={isSubmitting}
                className="w-full"
              >
                Create Account
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Right Panel - Decorative */}
        <div className="hidden lg:block w-1/2 relative overflow-hidden">
          <img
            src="/images/stone_image_33.jpg"
            alt="Premium marble interior"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-slate-950/60 via-slate-950/20 to-transparent" />

          <div className="absolute bottom-12 left-10 right-10">
            <blockquote className="text-white">
              <p className="text-2xl font-serif font-bold italic leading-snug mb-4">
                "Nature crafted them over millennia.<br />We bring them to your space."
              </p>
              <cite className="text-gold-400 text-sm font-semibold not-italic tracking-wider">
                — MarbleElite Curation Team
              </cite>
            </blockquote>
          </div>
        </div>
      </div>
    </>
  );
}
