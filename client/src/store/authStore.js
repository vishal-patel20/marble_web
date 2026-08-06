import { create } from 'zustand';

const getInitialUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem('user');
    return item ? JSON.parse(item) : null;
  } catch (e) {
    return null;
  }
};

export const useAuthStore = create((set, get) => ({
  user: getInitialUser(),
  accessToken: typeof window !== 'undefined' ? localStorage.getItem('accessToken') || null : null,
  refreshToken: typeof window !== 'undefined' ? localStorage.getItem('refreshToken') || null : null,
  theme: typeof window !== 'undefined' ? localStorage.getItem('theme') || 'light' : 'light',
  wishlistCount: 0,

  // Auth Operations
  setAuth: (user, accessToken, refreshToken) => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
    set({ user, accessToken, refreshToken: refreshToken || get().refreshToken });
  },

  clearAuth: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    set({ user: null, accessToken: null, refreshToken: null, wishlistCount: 0 });
  },

  // Theme Operations
  toggleTheme: () => {
    const nextTheme = get().theme === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', nextTheme);
    
    if (nextTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    set({ theme: nextTheme });
  },

  initializeTheme: () => {
    const savedTheme = get().theme;
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  },

  // Wishlist Counters
  setWishlistCount: (count) => set({ wishlistCount: count }),
  incrementWishlist: () => set((state) => ({ wishlistCount: state.wishlistCount + 1 })),
  decrementWishlist: () => set((state) => ({ wishlistCount: Math.max(0, state.wishlistCount - 1) })),
}));

export default useAuthStore;
