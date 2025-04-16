import 'use-sync-external-store/shim'; 
import { create } from "zustand";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
} from "@react-native-firebase/firestore";
import { getAuth } from "@react-native-firebase/auth";

const db = getFirestore();
const auth = getAuth(); 

const useCartStore = create((set, get) => ({
  cartItems: [],

  addToCart: async (product) => {
    const user = auth.currentUser;
    if (!user) return;
    const cartItemRef = doc(db, "users", user.uid, "cart", product.id.toString());
    console.log(cartItemRef)
    const cartItem = {
      ...product,
      quantity: 1,
      addedAt: new Date().toISOString(),    
    };

    try {
      const itemSnap = await getDoc(cartItemRef);

      if (itemSnap.exists) {        
        const existing = itemSnap.data();
        await updateDoc(cartItemRef, {
          quantity: existing.quantity + 1,
        });
        cartItem.quantity = existing.quantity + 1;
      } else {
        await setDoc(cartItemRef, cartItem);
      }
      set((state) => {
        const existingIndex = state.cartItems.findIndex((i) => i.id === product.id);
        let updatedItems = [...state.cartItems];

        if (existingIndex !== -1) {
          updatedItems[existingIndex].quantity += 1;
        } else {
          updatedItems.push(cartItem);
        }

        return { cartItems: updatedItems };
      });
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  },

  loadCart: async () => {
    const user = auth.currentUser;
    if (!user) return;

    const cartCollectionRef = collection(db, "users", user.uid, "cart");

    try {
      const querySnap = await getDocs(cartCollectionRef);
      const items = querySnap.docs.map((doc) => doc.data());
      set({ cartItems: items });
    } catch (error) {
      console.error("Error loading cart:", error);
    }
  },
}));

export default useCartStore;
