import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Diamond, Moon, Sun, Search, Menu, X, User, LogOut, Shield, Rotate3d, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../../store/authStore.js';
import { getAllCollectionItems } from '../../data/collections.js';

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
  const [searchQuery,  setSearchQuery]  = useState('');
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { theme, toggleTheme, user, accessToken, clearAuth } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Filter collections for live search autocomplete
  const collectionItems = getAllCollectionItems();
  const searchSuggestions = searchQuery.trim().length >= 1
    ? collectionItems.filter((item) => {
        const q = searchQuery.toLowerCase();
        return (
          item.name.toLowerCase().includes(q) ||
          (item.category && item.category.toLowerCase().includes(q)) ||
          (item.origin && item.origin.toLowerCase().includes(q)) ||
          (item.color && item.color.toLowerCase().includes(q)) ||
          (item.description && item.description.toLowerCase().includes(q))
        );
      }).slice(0, 6)
    : [];

  const handleSelectSuggestion = (item) => {
    setSearchOpen(false);
    setSearchQuery('');
    const cat = (item.category || 'marble').toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const slug = (item.id || item.name).toLowerCase().replace(/[^a-z0-9]+/g, '-');
    navigate(`/collection/${cat}/${slug}`);
  };

  const handleSearchSubmit = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      if (searchSuggestions.length > 0) {
        handleSelectSuggestion(searchSuggestions[0]);
      } else {
        setSearchOpen(false);
        navigate(`/collection?search=${encodeURIComponent(searchQuery)}`);
        setSearchQuery('');
      }
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setSearchQuery('');
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

        {/* ── Interactive Search bar & Live Autocomplete ── */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="border-t border-outline-variant/30 bg-surface/95 backdrop-blur-2xl shadow-2xl"
            >
              <div className="max-w-[1440px] mx-auto px-[20px] md:px-[80px] py-4 relative">
                <div className="relative flex items-center">
                  <Search size={20} className="absolute left-0 text-primary/60" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearchSubmit}
                    placeholder="Search collections, Italian Statuario, Calacatta, Onyx..."
                    autoFocus
                    className="w-full bg-transparent border-b border-surface-tint focus:border-gold-accent outline-none py-2.5 pl-8 pr-10 font-body-lg text-primary placeholder-on-surface-variant transition-colors duration-[400ms]"
                    style={{ fontFamily: 'Inter' }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-0 p-1 text-primary/50 hover:text-primary transition-colors"
                    >
                      <X size={18} />
                    </button>
                  )}
                </div>

                {/* ── Live Autocomplete Suggestions Dropdown Card ── */}
                <AnimatePresence>
                  {searchQuery.trim().length >= 1 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="mt-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-[380px] overflow-y-auto"
                    >
                      {searchSuggestions.length > 0 ? (
                        <div className="p-2 space-y-1">
                          <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                            <span>Matching Marble Slabs ({searchSuggestions.length})</span>
                            <span className="text-gold-accent">Click to View Product</span>
                          </div>
                          {searchSuggestions.map((item, index) => (
                            <div
                              key={index}
                              onClick={() => handleSelectSuggestion(item)}
                              className="flex items-center gap-4 p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 cursor-pointer transition-all duration-200 group"
                            >
                              <img
                                src={item.image}
                                alt={item.name}
                                onError={(e) => { e.currentTarget.src = '/images/showroom_3d_marble.png'; }}
                                className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700 group-hover:scale-105 transition-transform shrink-0"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-gold-accent transition-colors truncate">
                                  {item.name}
                                </h4>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                                  {item.category} • <span className="text-slate-400">{item.origin || 'Italy'}</span>
                                </p>
                              </div>
                              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-gold-accent/15 text-gold-accent border border-gold-accent/30 flex items-center gap-1">
                                  View Product <ArrowRight className="w-3 h-3" />
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="p-6 text-center text-xs text-slate-400 space-y-2">
                          <p>No matching marble products found for "<span className="text-slate-700 dark:text-slate-200 font-semibold">{searchQuery}</span>"</p>
                          <button
                            onClick={() => {
                              setSearchOpen(false);
                              navigate('/collection');
                              setSearchQuery('');
                            }}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-gold-accent hover:text-white font-bold transition-all text-[11px]"
                          >
                            Explore All Collections <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
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
