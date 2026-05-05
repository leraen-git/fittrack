export type PhotoAngle = 'front' | 'side' | 'back'

export type ProgressPhoto = {
  id: string
  uri: string
  takenAt: string
  angle: PhotoAngle
  weightKgSnapshot: number | null
  notes: string | null
}

export const ANGLE_LABELS: Record<PhotoAngle, string> = {
  front: 'Face',
  side: 'Profil',
  back: 'Dos',
}
