import { create } from 'zustand';

const useLoadingStore = create(set => ({
  loadingCount: 0,
  isLoading: false,
  incrementLoading: () => set(state => {
    const newCount = state.loadingCount + 1;
    return { loadingCount: newCount, isLoading: newCount > 0 };
  }),
  decrementLoading: () => set(state => {
    const newCount = Math.max(0, state.loadingCount - 1);
    return { loadingCount: newCount, isLoading: newCount > 0 };
  }),
}));

export default useLoadingStore;
