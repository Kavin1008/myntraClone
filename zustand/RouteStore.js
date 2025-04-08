import { create } from 'zustand';

const useRouteStore = create((set) => ({
  currentRoute: null,
  requestedRoute: null,

  setCurrentRoute: (routeName, params) => set({ currentRoute: { routeName, params } }),
  setRequestedRoute: (routeName, params) => set({ requestedRoute: { routeName, params } }),

  clearRequestedRoute: () => set({ requestedRoute: null }),
}));

export default useRouteStore;
