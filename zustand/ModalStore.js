import { create } from 'zustand'

const useModalStore = create((set) => ({
  isVisible: false,
  openModal: () => set({ isVisible: true }),
  closeModal: () => set({ isVisible: false }),
}))

export default useModalStore
