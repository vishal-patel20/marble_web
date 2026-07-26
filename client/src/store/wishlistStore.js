import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { toast } from 'react-toastify';

const useWishlistStore = create(
  persist(
    (set, get) => ({
      items: [], // Array of product objects

      addItem: (product) => {
        const exists = get().items.find((item) => item.id === product.id);
        if (!exists) {
          set({ items: [...get().items, product] });
          toast.success(`${product.name} added to wishlist`, { position: 'bottom-right', autoClose: 2000 });
        } else {
          toast.info('Already in your wishlist', { position: 'bottom-right', autoClose: 1500 });
        }
      },

      removeItem: (productId) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
        toast.success('Removed from wishlist', { position: 'bottom-right', autoClose: 1500 });
      },

      toggleItem: (product) => {
        const exists = get().items.find((item) => item.id === product.id);
        if (exists) {
          get().removeItem(product.id);
        } else {
          get().addItem(product);
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      clearWishlist: () => {
        set({ items: [] });
      },

      count: () => get().items.length,
    }),
    {
      name: 'marble-wishlist-storage',
    }
  )
);

export { useWishlistStore };
export default useWishlistStore;
