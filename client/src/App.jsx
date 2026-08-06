import React, { useEffect, lazy, Suspense } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from './store/authStore.js';

// Layout
import Navbar from './components/layout/Navbar.jsx';
import Footer from './components/layout/Footer.jsx';
import ScrollToTop from './components/layout/ScrollToTop.jsx';

// Lazy load pages for code splitting
const Home           = lazy(() => import('./pages/Home.jsx'));
const Collection     = lazy(() => import('./pages/Collection.jsx'));
const Colours        = lazy(() => import('./pages/Colours.jsx'));
const ProductListing = lazy(() => import('./pages/ProductListing.jsx'));
const ProductDetail  = lazy(() => import('./pages/ProductDetail.jsx'));
const About          = lazy(() => import('./pages/About.jsx'));
const Gallery        = lazy(() => import('./pages/Gallery.jsx'));
const Projects       = lazy(() => import('./pages/Projects.jsx'));
const Blogs          = lazy(() => import('./pages/Blogs.jsx'));
const Contact        = lazy(() => import('./pages/Contact.jsx'));
const Quote          = lazy(() => import('./pages/Quote.jsx'));
const Login          = lazy(() => import('./pages/Login.jsx'));
const Register       = lazy(() => import('./pages/Register.jsx'));
const Wishlist       = lazy(() => import('./pages/Wishlist.jsx'));
const Privacy          = lazy(() => import('./pages/Privacy.jsx'));
const Maintenance      = lazy(() => import('./pages/Maintenance.jsx'));
const Showroom         = lazy(() => import('./pages/Showroom.jsx'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard.jsx'));

// Loading fallback — matches Stitch soft-shadow aesthetic
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-surface">
    <div className="flex flex-col items-center gap-4">
      <div
        className="w-10 h-10 rounded-full border-2 border-outline-variant border-t-primary"
        style={{ animation: 'spin 1s linear infinite' }}
      />
      <p className="font-label-caps text-label-caps text-on-surface-variant tracking-widest">
        Loading
      </p>
    </div>
  </div>
);

// Protected Route Guard
const ProtectedRoute = ({ children, roles = [] }) => {
  const { user, accessToken } = useAuthStore();
  if (!accessToken || !user) return <Navigate to="/login" replace />;
  if (roles.length > 0 && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

// Guest-only Route Guard
const GuestRoute = ({ children }) => {
  const { user, accessToken, clearAuth } = useAuthStore();
  if (accessToken && user) {
    if (user.role === 'Admin' || user.role === 'MASTER_ADMIN') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/" replace />;
  }
  if (accessToken && !user) {
    clearAuth();
  }
  return children;
};

// Pages that should NOT show navbar/footer
const QUOTE_ROUTES       = ['/quote', '/customs'];
const FULL_SCREEN_ROUTES = ['/admin', '/showroom', '/virtual-showroom'];

export default function App() {
  const { initializeTheme } = useAuthStore();
  const location = useLocation();

  useEffect(() => {
    initializeTheme();
  }, [initializeTheme]);

  const isFullScreen = FULL_SCREEN_ROUTES.some((r) => location.pathname.startsWith(r));
  const isQuotePage  = QUOTE_ROUTES.some((r) => location.pathname.startsWith(r));

  // Quote page has its own minimal navbar embedded — hide global navbar/footer
  const hideLayout = isFullScreen || isQuotePage;

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface transition-colors duration-300">
      <ScrollToTop />
      {!hideLayout && <Navbar />}

      <main className="flex-grow">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            {/* ── Public routes ───────────────────────── */}
            <Route path="/"                                  element={<Home />}           />
            <Route path="/collection"                        element={<Collection />}     />
            <Route path="/colours"                           element={<Colours />}        />
            <Route path="/colors"                            element={<Colours />}        />
            <Route path="/collection/:category/:slug"        element={<ProductDetail />}  />
            <Route path="/collection/:slug"                  element={<ProductDetail />}  />
            <Route path="/about"                             element={<About />}          />
            <Route path="/gallery"                           element={<Gallery />}        />
            <Route path="/projects"                          element={<Projects />}       />
            <Route path="/blogs"                             element={<Blogs />}          />
            <Route path="/contact"                           element={<Contact />}        />
            <Route path="/quote"                             element={<Quote />}          />
            <Route path="/customs"                           element={<Quote />}          />
            <Route path="/showroom"                          element={<Showroom />}       />
            <Route path="/virtual-showroom"                  element={<Showroom />}       />
            <Route path="/privacy"                           element={<Privacy />}        />
            <Route path="/maintenance"                       element={<Maintenance />}    />

            {/* Legacy routes for backwards compat */}
            <Route path="/products"                          element={<Collection />}     />
            <Route path="/products/:slug"                    element={<ProductDetail />}  />

            {/* ── Auth routes — guest only ─────────────── */}
            <Route path="/login"    element={<GuestRoute><Login /></GuestRoute>}    />
            <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />

            {/* ── Protected customer routes ─────────────── */}
            <Route path="/wishlist" element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />

            {/* ── Admin routes ─────────────────────────── */}
            <Route
              path="/admin/*"
              element={<ProtectedRoute roles={['Admin', 'MASTER_ADMIN']}><AdminDashboard /></ProtectedRoute>}
            />

            {/* ── Catch-all ──────────────────────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </main>

      {!hideLayout && <Footer />}
    </div>
  );
}
