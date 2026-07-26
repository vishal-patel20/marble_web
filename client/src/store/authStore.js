import { create } from 'zustand';

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: localStorage.getItem('accessToken') || null,
  theme: localStorage.getItem('theme') || 'light',
  wishlistCount: 0,

  // Auth Operations
  setAuth: (user, accessToken) => {
    if (accessToken) {
      localStorage.setItem('accessToken', accessToken);
    }
    set({ user, accessToken });
  },

  clearAuth: () => {
    localStorage.removeItem('accessToken');
    set({ user: null, accessToken: null, wishlistCount: 0 });
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
