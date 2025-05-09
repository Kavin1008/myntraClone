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

  setUser: (userData) => set({ 
    user: userData, 
    isAuthenticated: !!userData,
    // Set currentAddress if addresses exist
    currentAddress: userData?.addresses?.[0] || null
  }),

  logout: async () => {
    await signOut(auth);
    set({ user: null, isAuthenticated: false, currentAddress: null });
  },

  updateAddress: async (newAddress, setAsCurrent = false) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;
  
    const userRef = doc(db, "users", currentUser.uid);
    
    try {
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data();
      
      const currentAddresses = userData.addresses || [];
      const updatedAddresses = [...currentAddresses, newAddress];
      
      // Update Firestore
      await updateDoc(userRef, { 
        addresses: updatedAddresses,
        // Set currentAddress in Firestore if it's the first address or explicitly requested
        currentAddress: (currentAddresses.length === 0 || setAsCurrent) ? newAddress : userData.currentAddress
      });
  
      // Update local state
      const updatedUser = { 
        ...get().user, 
        addresses: updatedAddresses,
        currentAddress: (currentAddresses.length === 0 || setAsCurrent) ? newAddress : get().user?.currentAddress
      };
      
      set({ 
        user: updatedUser,
        currentAddress: updatedUser.currentAddress
      });
  
      return true;
    } catch (error) {
      console.error("Failed to update address:", error);
      return false;
    }
  },

  setCurrentAddress: (address) => {
    const currentUser = auth.currentUser;
    if (!currentUser) return false;

    const userRef = doc(db, "users", currentUser.uid);
    
    try {
      // Update Firestore
      updateDoc(userRef, { currentAddress: address });
      
      // Update local state
      set(state => ({
        user: {
          ...state.user,
          currentAddress: address
        },
        currentAddress: address
      }));
      
      return true;
    } catch (error) {
      console.error("Failed to set current address:", error);
      return false;
    }
  }
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
              // Ensure currentAddress is set from Firestore or first address
              currentAddress: userDataFromFirestore.currentAddress || userDataFromFirestore.addresses?.[0] || null
            });
            loadCart();
          } else {
            setUser({
              uid: user.uid,
              phoneNumber: user.phoneNumber,
              currentAddress: null
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