import { create } from 'zustand'
import { progressPhotos } from '../lib/progressPhotos'
import type { ProgressPhoto, PhotoAngle } from '../types/progressPhoto'

interface ProgressPhotosState {
  photos: ProgressPhoto[]
  isLoaded: boolean

  load: () => Promise<void>
  add: (input: Parameters<typeof progressPhotos.add>[0]) => Promise<ProgressPhoto>
  remove: (id: string) => Promise<void>
  updateNotes: (id: string, notes: string | null) => Promise<void>

  getByAngle: (angle: PhotoAngle | 'all') => ProgressPhoto[]
  getOldest: () => ProgressPhoto | null
  getNewest: () => ProgressPhoto | null
  getDeltaSinceFirst: () => { kg: number | null; days: number | null }
}

export const useProgressPhotosStore = create<ProgressPhotosState>((set, get) => ({
  photos: [],
  isLoaded: false,

  async load() {
    const photos = await progressPhotos.list()
    set({ photos, isLoaded: true })
  },

  async add(input) {
    const photo = await progressPhotos.add(input)
    set(state => ({ photos: [...state.photos, photo] }))
    return photo
  },

  async remove(id) {
    await progressPhotos.remove(id)
    set(state => ({ photos: state.photos.filter(p => p.id !== id) }))
  },

  async updateNotes(id, notes) {
    await progressPhotos.updateNotes(id, notes)
    set(state => ({
      photos: state.photos.map(p => p.id === id ? { ...p, notes } : p),
    }))
  },

  getByAngle(angle) {
    const all = get().photos
    if (angle === 'all') return all
    return all.filter(p => p.angle === angle)
  },

  getOldest() {
    const all = [...get().photos]
    if (all.length === 0) return null
    all.sort((a, b) => a.takenAt.localeCompare(b.takenAt))
    return all[0] ?? null
  },

  getNewest() {
    const all = [...get().photos]
    if (all.length === 0) return null
    all.sort((a, b) => b.takenAt.localeCompare(a.takenAt))
    return all[0] ?? null
  },

  getDeltaSinceFirst() {
    const oldest = get().getOldest()
    const newest = get().getNewest()
    if (!oldest || !newest || oldest.id === newest.id) {
      return { kg: null, days: null }
    }

    const kg = (oldest.weightKgSnapshot != null && newest.weightKgSnapshot != null)
      ? Number((newest.weightKgSnapshot - oldest.weightKgSnapshot).toFixed(1))
      : null

    const days = Math.floor(
      (new Date(newest.takenAt).getTime() - new Date(oldest.takenAt).getTime()) / 86400000
    )

    return { kg, days }
  },
}))
