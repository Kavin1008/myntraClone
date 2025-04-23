import 'use-sync-external-store/shim';
import {create} from 'zustand';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  collection,
  deleteDoc,
} from '@react-native-firebase/firestore';
import {getAuth} from '@react-native-firebase/auth';

const db = getFirestore();
const auth = getAuth();

const useCartStore = create((set, get) => ({
  cartItems: [],

  addToCart: async product => {
    const user = auth.currentUser;
    if (!user) return;
  
    const cartItemRef = doc(db, 'users', user.uid, 'cart', product.id.toString());
  
    try {
      const itemSnap = await getDoc(cartItemRef);
      let updatedQuantity = 1;
  
      if (itemSnap.exists) {
        const existing = itemSnap.data();
        updatedQuantity = existing.quantity + 1;
        await updateDoc(cartItemRef, { quantity: updatedQuantity });
      } else {
        await setDoc(cartItemRef, {
          ...product,
          quantity: updatedQuantity,
          addedAt: new Date().toISOString(),
        });
      }
  
      set(state => {
        const existingIndex = state.cartItems.findIndex(i => i.id === product.id);
        let updatedItems = [...state.cartItems];
  
        if (existingIndex !== -1) {
          updatedItems[existingIndex] = {
            ...updatedItems[existingIndex],
            quantity: updatedQuantity,
          };
        } else {
          updatedItems.push({
            ...product,
            quantity: updatedQuantity,
            addedAt: new Date().toISOString(),
          });
        }
  
        return { cartItems: updatedItems };
      });
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  },  

  loadCart: async () => {
    const user = auth.currentUser;
    if (!user) return;

    const cartCollectionRef = collection(db, 'users', user.uid, 'cart');

    try {
      const querySnap = await getDocs(cartCollectionRef);
      const items = querySnap.docs.map(doc => doc.data());
      set({cartItems: items});
    } catch (error) {
      console.error('Error loading cart:', error);
    }
  },

  updateItemQuantity: async (itemId, quantity) => {
    const user = auth.currentUser;
    if (!user) return;

    const cartItemRef = doc(db, 'users', user.uid, 'cart', itemId.toString());

    try {
      await updateDoc(cartItemRef, {quantity});

      set(state => {
        const updatedItems = state.cartItems.map(item =>
          item.id === itemId ? {...item, quantity} : item,
        );
        return {cartItems: updatedItems};
      });
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  },
  removeFromCart: async itemId => {
    const user = auth.currentUser;
    if (!user) return;
  
    const cartItemRef = doc(db, 'users', user.uid, 'cart', itemId.toString());
  
    try {      
      await deleteDoc(cartItemRef);
  
      set(state => {
        const updatedItems = state.cartItems.filter(item => item.id !== itemId);
        return { cartItems: updatedItems };
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  },  
  clearCart: () => set({cartItems: []}),
}));

export default useCartStore;
