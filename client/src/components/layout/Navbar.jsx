import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Diamond, Moon, Sun, Search, Menu, X, User, LogOut, Shield } from 'lucide-react';
import { useAuthStore } from '../../store/authStore.js';

const NAV_LINKS = [
  { label: 'Home',        to: '/'           },
  { label: '3D Showroom', to: '/showroom'   },
  { label: 'Collections', to: '/collection' },
  { label: 'Colours',     to: '/colours'    },
  { label: 'Portfolio',   to: '/projects'   },
  { label: 'Blogs',       to: '/blogs'      },
  { label: 'Inquiry',     to: '/quote'      },
];

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, toggleTheme, user, accessToken, clearAuth } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  // Solid bg after scroll
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const navbarBg = scrolled
    ? 'bg-surface/95 border-outline-variant/50'
    : 'bg-white/15 border-white/30';

  const handleLogout = () => {
    clearAuth();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 backdrop-blur-xl border-b shadow-2xl shadow-black/5 ease-in-out duration-[400ms] ${navbarBg}`}
      >
        <div className="max-w-[1440px] mx-auto px-[20px] md:px-[80px] flex justify-between items-center h-20">

          {/* ── Brand ── */}
          <Link
            to="/"
            className="font-[500] text-[32px] leading-[1.3] tracking-tight text-primary flex items-center gap-2 hover:opacity-75 transition-opacity duration-[400ms]"
            style={{ fontFamily: 'Inter' }}
          >
            <Diamond size={28} strokeWidth={1.5} />
            MarbleCraft
          </Link>

          {/* ── Desktop Nav ── */}
          <div className="hidden md:flex items-center gap-8 font-body-md text-body-md">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? 'text-primary font-bold border-b-2 border-primary pb-1'
                    : 'text-on-surface-variant hover:text-primary transition-colors duration-[400ms]'
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* ── Trailing Actions ── */}
          <div className="flex items-center gap-3 text-primary relative">
            {/* Theme toggle */}
            <button
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="p-2 hover:bg-white/10 rounded-full transition-all duration-[400ms]"
            >
              {theme === 'dark' ? <Sun size={22} /> : <Moon size={22} />}
            </button>

            {/* Search */}
            <button
              aria-label="Search"
              onClick={() => setSearchOpen((p) => !p)}
              className="p-2 hover:bg-white/10 rounded-full transition-all duration-[400ms]"
            >
              <Search size={22} />
            </button>

            {/* User Auth / Profile */}
            {accessToken && user ? (
              <div className="relative">
                <button
                  aria-label="User Account"
                  onClick={() => setUserMenuOpen((p) => !p)}
                  className="flex items-center gap-2 p-2 hover:bg-white/10 rounded-full transition-all duration-[400ms] text-primary"
                  title={user.name || 'Account'}
                >
                  <User size={22} />
                </button>

                {/* Account Dropdown */}
                <AnimatePresence>
                  {userMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 text-slate-800 dark:text-slate-100"
                    >
                      <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                        <p className="font-semibold text-sm truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      </div>

                      {(user.role === 'Admin' || user.role === 'MASTER_ADMIN') && (
                        <Link
                          to="/admin"
                          onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                        >
                          <Shield size={16} /> Admin Dashboard
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left flex items-center gap-2 px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 px-4 py-1.5 text-sm font-medium border border-primary/30 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
              >
                <User size={18} />
                <span>Sign In</span>
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              aria-label="Open menu"
              onClick={() => setMobileOpen((p) => !p)}
              className="md:hidden p-2 hover:bg-white/10 rounded-full transition-all duration-[400ms]"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── Search bar ── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="overflow-hidden border-t border-outline-variant/30"
            >
              <div className="max-w-[1440px] mx-auto px-[20px] md:px-[80px] py-4">
                <input
                  type="text"
                  placeholder="Search collections, stone types…"
                  autoFocus
                  className="w-full bg-transparent border-b border-surface-tint focus:border-gold-accent outline-none py-2 font-body-lg text-primary placeholder-on-surface-variant transition-colors duration-[400ms]"
                  style={{ fontFamily: 'Inter' }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-4/5 max-w-sm bg-surface glass-panel flex flex-col pt-24 px-8 pb-8 md:hidden"
            >
              {/* Close */}
              <button
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
                className="absolute top-6 right-6 p-2 text-primary"
              >
                <X size={24} />
              </button>

              {/* Links */}
              <nav className="flex flex-col gap-6">
                {NAV_LINKS.map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 * i, duration: 0.3 }}
                  >
                    <Link
                      to={link.to}
                      className="text-[32px] font-[500] leading-[1.3] text-primary hover:text-on-surface-variant transition-colors duration-[400ms] block"
                      style={{ fontFamily: 'Inter' }}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* CTA & User Auth */}
              <div className="mt-auto flex flex-col gap-3">
                {accessToken && user ? (
                  <div className="flex flex-col gap-2 p-3 bg-surface-tint/10 rounded-xl">
                    <span className="text-sm font-medium text-primary">{user.name} ({user.role})</span>
                    {(user.role === 'Admin' || user.role === 'MASTER_ADMIN') && (
                      <Link to="/admin" className="text-xs text-gold-accent font-semibold hover:underline">
                        Admin Dashboard →
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="text-xs text-red-500 font-semibold text-left hover:underline"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="w-full py-3 text-center border border-primary text-primary font-medium text-sm rounded-full block hover:bg-primary hover:text-white transition-all"
                  >
                    Sign In
                  </Link>
                )}

                <Link
                  to="/quote"
                  className="btn-primary w-full py-4 text-center font-label-caps text-label-caps tracking-widest uppercase rounded-full block"
                >
                  Request a Quote
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
