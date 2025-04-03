import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useEffect } from "react";
import { create } from "zustand";

const auth = getAuth();

const UserStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  setUser: (userData) => set({ user: userData, isAuthenticated: !!userData }),

  logout: async () => {
    await signOut(auth);
    set({ user: null, isAuthenticated: false });
  },
}));

export const useAuthListener = () => {
  const setUser = UserStore((state) => state.setUser);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          phoneNumber: user.phoneNumber,
        });
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe(); 
  }, [setUser]);
};

export default UserStore;
