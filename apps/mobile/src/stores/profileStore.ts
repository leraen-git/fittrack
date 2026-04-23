import { create } from 'zustand'

type ProfileModal =
  | null
  | 'editFirstName'
  | 'editHeight'
  | 'editLevel'
  | 'editGoal'
  | 'editSessions'
  | 'logoutConfirm'

interface ProfileState {
  activeModal: ProfileModal
  openModal: (modal: ProfileModal) => void
  closeModal: () => void
}

export const useProfileStore = create<ProfileState>((set) => ({
  activeModal: null,
  openModal: (activeModal) => set({ activeModal }),
  closeModal: () => set({ activeModal: null }),
}))
