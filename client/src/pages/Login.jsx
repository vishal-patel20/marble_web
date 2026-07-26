import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff, Lock, Mail, User } from 'lucide-react';
import { toast } from 'react-toastify';
import useAuthStore from '../store/authStore.js';
import axiosInstance from '../api/axiosInstance.js';
import Button from '../components/ui/Button.jsx';

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    const endpoint = isLogin ? '/auth/login' : '/auth/register';
    try {
      const res = await axiosInstance.post(endpoint, data);
      const { user, accessToken } = res.data.data;
      
      setAuth(user, accessToken);
      toast.success(isLogin ? `Welcome back, ${user.name}!` : 'Account registered successfully!');
      
      // Redirect
      if (user.role === 'Admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleState = () => {
    setIsLogin(!isLogin);
    reset();
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-slate-50 dark:bg-luxury-950 transition-colors duration-300">
      <div className="w-full max-w-md">
        
        {/* Logo and Greeting */}
        <div className="text-center mb-8">
          <span className="text-xl font-serif font-black tracking-wider text-slate-800 dark:text-white uppercase">
            Aurelia <span className="text-gold-400">Marbles</span>
          </span>
          <h2 className="text-2xl font-bold font-serif text-slate-800 dark:text-white mt-4">
            {isLogin ? 'Sign In to Showroom' : 'Create Customer Account'}
          </h2>
          <p className="text-xs text-slate-400 mt-2">Access wishlist tracking, project templates, and bespoke quotes.</p>
        </div>

        {/* Card Form */}
        <div className="glass-panel p-8 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* Name field (Register only) */}
            {!isLogin && (
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                  <input
                    type="text"
                    {...register('name', { required: 'Name is required' })}
                    className="w-full bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm pl-10 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-400 text-slate-800 dark:text-white"
                    placeholder="e.g. John Architect"
                  />
                </div>
                {errors.name && <span className="text-xs text-red-500 mt-1 block">{errors.name.message}</span>}
              </div>
            )}

            {/* Email field */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' }
                  })}
                  className="w-full bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm pl-10 pr-4 py-3.5 rounded-xl focus:outline-none focus:border-gold-400 text-slate-800 dark:text-white"
                  placeholder="e.g. john@builder.com"
                />
              </div>
              {errors.email && <span className="text-xs text-red-500 mt-1 block">{errors.email.message}</span>}
            </div>

            {/* Password field */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-slate-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  {...register('password', {
                    required: 'Password is required',
                    minLength: { value: 6, message: 'Password must be at least 6 characters' }
                  })}
                  className="w-full bg-slate-50 border border-slate-100 dark:bg-slate-800 dark:border-slate-800 text-sm pl-10 pr-12 py-3.5 rounded-xl focus:outline-none focus:border-gold-400 text-slate-800 dark:text-white"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-gold-400 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4.5 w-4.5" /> : <Eye className="h-4.5 w-4.5" />}
                </button>
              </div>
              {errors.password && <span className="text-xs text-red-500 mt-1 block">{errors.password.message}</span>}
            </div>

            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="w-full mt-2"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>

          </form>

          {/* Toggle link */}
          <div className="text-center mt-6 pt-6 border-t border-slate-50 dark:border-slate-800/60">
            <button
              onClick={handleToggleState}
              className="text-xs font-semibold text-gold-400 hover:underline tracking-wide uppercase"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
            </button>
          </div>

        </div>

      </div>
    </div>
  );
}
