import * as FileSystem from 'expo-file-system/legacy'
import * as Crypto from 'expo-crypto'
import { storage } from './storage'
import type { ProgressPhoto, PhotoAngle } from '../types/progressPhoto'

const STORAGE_KEY = 'progress-photos-v1'
const PHOTO_DIR = `${FileSystem.documentDirectory}progress/`

async function ensureDir() {
  const info = await FileSystem.getInfoAsync(PHOTO_DIR)
  if (!info.exists) {
    await FileSystem.makeDirectoryAsync(PHOTO_DIR, { intermediates: true })
  }
}

export const progressPhotos = {
  async list(): Promise<ProgressPhoto[]> {
    const raw = storage.getString(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  },

  async add(input: {
    sourceUri: string
    angle: PhotoAngle
    weightKgSnapshot: number | null
    takenAt?: string
    notes?: string
  }): Promise<ProgressPhoto> {
    await ensureDir()

    const id = Crypto.randomUUID()
    const destUri = `${PHOTO_DIR}${id}.jpg`

    await FileSystem.copyAsync({ from: input.sourceUri, to: destUri })

    const photo: ProgressPhoto = {
      id,
      uri: destUri,
      takenAt: input.takenAt ?? new Date().toISOString(),
      angle: input.angle,
      weightKgSnapshot: input.weightKgSnapshot,
      notes: input.notes ?? null,
    }

    const all = await this.list()
    all.push(photo)
    storage.set(STORAGE_KEY, JSON.stringify(all))

    return photo
  },

  async remove(id: string): Promise<void> {
    const all = await this.list()
    const photo = all.find(p => p.id === id)
    if (!photo) return

    try {
      await FileSystem.deleteAsync(photo.uri, { idempotent: true })
    } catch {}

    const next = all.filter(p => p.id !== id)
    storage.set(STORAGE_KEY, JSON.stringify(next))
  },

  async updateNotes(id: string, notes: string | null): Promise<void> {
    const all = await this.list()
    const idx = all.findIndex(p => p.id === id)
    if (idx === -1) return
    all[idx]!.notes = notes
    storage.set(STORAGE_KEY, JSON.stringify(all))
  },

  async cleanupOrphans(): Promise<number> {
    const info = await FileSystem.getInfoAsync(PHOTO_DIR)
    if (!info.exists) return 0

    const files = await FileSystem.readDirectoryAsync(PHOTO_DIR)
    const all = await this.list()
    const referencedFilenames = new Set(all.map(p => p.uri.split('/').pop()))

    let removed = 0
    for (const f of files) {
      if (!referencedFilenames.has(f)) {
        await FileSystem.deleteAsync(`${PHOTO_DIR}${f}`, { idempotent: true })
        removed++
      }
    }
    return removed
  },

  async clear(): Promise<void> {
    const all = await this.list()
    for (const p of all) {
      try { await FileSystem.deleteAsync(p.uri, { idempotent: true }) } catch {}
    }
    storage.remove(STORAGE_KEY)
  },
}
