/**
 * musicService — bridges the phone's system media player (Spotify, Apple Music, etc.)
 * into the app via react-native-music-control.
 *
 * Gracefully no-ops in Expo Go where the native module is unavailable.
 * Full functionality requires a dev build (npx expo run:ios).
 */

import { Audio } from 'expo-av'

export interface NowPlayingInfo {
  title: string
  artist: string
  artwork: string | null
  isPlaying: boolean
}

type NowPlayingListener = (info: NowPlayingInfo | null) => void

let _listener: NowPlayingListener | null = null
let _current: NowPlayingInfo | null = null
let _initialized = false

// Lazily loaded — avoids crashing Expo Go at import time
let MusicControl: any = null

function loadNativeModule(): boolean {
  if (MusicControl !== null) return true
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('react-native-music-control')
    MusicControl = mod?.default ?? mod
    // If the native bridge isn't linked, the module may be a null/stub
    if (!MusicControl || typeof MusicControl.enableBackgroundMode !== 'function') {
      MusicControl = null
      return false
    }
    return true
  } catch {
    return false
  }
}

/**
 * Call once on app start. No-ops gracefully if the native module is absent.
 */
export async function initMusicService(): Promise<void> {
  if (_initialized) return
  _initialized = true

  if (!loadNativeModule()) return // Expo Go — skip silently

  try {
    // Configure audio session so notification sounds mix with music
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: false,
      staysActiveInBackground: false,
      interruptionModeIOS: 1,
      shouldDuckAndroid: true,
      interruptionModeAndroid: 1,
      playThroughEarpieceAndroid: false,
    })

    MusicControl.enableBackgroundMode(false)
    MusicControl.handleAudioInterruptions(true)

    const { Command } = require('react-native-music-control')
    MusicControl.enableControl(Command.play, true)
    MusicControl.enableControl(Command.pause, true)
    MusicControl.enableControl(Command.nextTrack, true)
    MusicControl.enableControl(Command.previousTrack, true)
    MusicControl.enableControl(Command.changePlaybackPosition, false)

    MusicControl.on(Command.play, () =>
      MusicControl.updatePlayback({ state: MusicControl.STATE_PLAYING }),
    )
    MusicControl.on(Command.pause, () =>
      MusicControl.updatePlayback({ state: MusicControl.STATE_PAUSED }),
    )
    MusicControl.on(Command.nextTrack, () => {})
    MusicControl.on(Command.previousTrack, () => {})

    MusicControl.on('remoteEvent', (event: any) => {
      if (event?.nowPlayingInfo) {
        const info: NowPlayingInfo = {
          title: event.nowPlayingInfo.title ?? '',
          artist: event.nowPlayingInfo.artist ?? '',
          artwork: event.nowPlayingInfo.artwork ?? null,
          isPlaying: event.nowPlayingInfo.isPlaying ?? false,
        }
        _current = info
        _listener?.(info)
      }
    })
  } catch {
    // Native module present but failed — degrade gracefully
    MusicControl = null
  }
}

export function subscribeNowPlaying(listener: NowPlayingListener): () => void {
  _listener = listener
  if (_current !== null) listener(_current)
  return () => {
    if (_listener === listener) _listener = null
  }
}

export function getCurrentTrack(): NowPlayingInfo | null {
  return _current
}

export function playPause(): void {
  if (!_current || !MusicControl) return
  MusicControl.updatePlayback({
    state: _current.isPlaying ? MusicControl.STATE_PAUSED : MusicControl.STATE_PLAYING,
  })
}

export function nextTrack(): void {
  MusicControl?.handleCommand('nextTrack', {})
}

export function prevTrack(): void {
  MusicControl?.handleCommand('previousTrack', {})
}

export function teardownMusicService(): void {
  if (!_initialized) return
  MusicControl?.stopControl()
  _initialized = false
  _current = null
  _listener = null
}
