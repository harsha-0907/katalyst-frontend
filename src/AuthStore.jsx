import { create } from 'zustand';

const LogInStore = create((set) => ({
  isLoggedIn: false,
  setIsLoggedIn: () => set({ isLoggedIn: true }),
  setIsLoggedOut: () => set({ isLoggedIn: false }),
}));

export default LogInStore;