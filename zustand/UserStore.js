import { getAuth, onAuthStateChanged, signOut } from "@react-native-firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "@react-native-firebase/firestore";
import { useEffect } from "react";
import { create } from "zustand";
import useCartStore from "./CartStore";

const auth = getAuth();
const db = getFirestore();

const UserStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,

  setUser: (userData) => set({ user: userData, isAuthenticated: !!userData }),

  logout: async () => {
    await signOut(auth);
    set({ user: null, isAuthenticated: false });
  },

  updateAddress: async (newAddress) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const userRef = doc(db, "users", currentUser.uid);
    try {
      await updateDoc(userRef, { address: newAddress });

      const updatedUser = { ...get().user, address: newAddress };
      set({ user: updatedUser });

      return true;
    } catch (error) {
      console.error("Failed to update address:", error);
      return false;
    }
  },
}));


export const useAuthListener = () => {
  const setUser = UserStore((state) => state.setUser);
  const loadCart = useCartStore((state) => state.loadCart);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userRef = doc(db, "users", user.uid);
          const userSnap = await getDoc(userRef);

          if (userSnap.exists) {
            const userDataFromFirestore = userSnap.data();
            setUser({
              uid: user.uid,
              phoneNumber: user.phoneNumber,
              ...userDataFromFirestore,
            });
            loadCart();
          } else {
            setUser({
              uid: user.uid,
              phoneNumber: user.phoneNumber,
            });
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, [setUser]);
};

export default UserStore;
