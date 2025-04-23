import 'use-sync-external-store/shim';
import {create} from 'zustand';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  deleteDoc,
  collection,
} from '@react-native-firebase/firestore';
import {getAuth} from '@react-native-firebase/auth';

const db = getFirestore();
const auth = getAuth();

const useWishlistStore = create((set, get) => ({
  wishlistItems: [],

  addToWishlist: async product => {
    const user = auth.currentUser;
    if (!user) return;

    const wishlistRef = doc(db, 'users', user.uid, 'wishlist', product.id.toString());

    try {
      const existing = await getDoc(wishlistRef);

      if (!existing.exists) {
        await setDoc(wishlistRef, {
          ...product,
          addedAt: new Date().toISOString(),
        });

        set(state => ({
          wishlistItems: [...state.wishlistItems, {
            ...product,
            addedAt: new Date().toISOString(),
          }],
        }));
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  },

  removeFromWishlist: async productId => {
    const user = auth.currentUser;
    if (!user) return;

    const wishlistRef = doc(db, 'users', user.uid, 'wishlist', productId.toString());

    try {
      await deleteDoc(wishlistRef);

      set(state => ({
        wishlistItems: state.wishlistItems.filter(item => item.id !== productId),
      }));
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  },

  loadWishlist: async () => {
    const user = auth.currentUser;
    if (!user) return;

    const wishlistCollection = collection(db, 'users', user.uid, 'wishlist');

    try {
      const snapshot = await getDocs(wishlistCollection);
      const items = snapshot.docs.map(doc => doc.data());

      set({wishlistItems: items});
    } catch (error) {
      console.error('Error loading wishlist:', error);
    }
  },

  clearWishlist: () => set({wishlistItems: []}),
}));

export default useWishlistStore;
