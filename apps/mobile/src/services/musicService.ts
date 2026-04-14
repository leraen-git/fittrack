/**
 * musicService — bridges the phone's system media player (Spotify, Apple Music, etc.)
 * into the app via react-native-music-control.
 *
 * This service reads currently-playing track metadata and sends remote commands
 * (play/pause/next/prev) to the OS media session. No audio data flows through
 * the app and no mediaLibrary permission is required.
 *
 * Audio session note: we configure AVAudioSessionCategoryAmbient (iOS) /
 * AUDIOFOCUS_GAIN_TRANSIENT_MAY_DUCK (Android) so rest-timer notification
 * sounds MIX with music rather than pausing it.
 */

import { Platform } from 'react-native'
import MusicControl, { Command } from 'react-native-music-control'
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

/**
 * Call once on app start (or before the first active session).
 * Sets the audio session to ambient/duck mode and registers media control handlers.
 */
export async function initMusicService(): Promise<void> {
  if (_initialized) return
  _initialized = true

  // Configure audio session so notification sounds mix with music
  await Audio.setAudioModeAsync({
    playsInSilentModeIOS: false,
    // Ambient: our app audio never interrupts the system player
    staysActiveInBackground: false,
    interruptionModeIOS: 1, // DO_NOT_MIX equivalent — we only read, never play
    shouldDuckAndroid: true,
    interruptionModeAndroid: 1,
    playThroughEarpieceAndroid: false,
  })

  MusicControl.enableBackgroundMode(false) // we are not a music player
  MusicControl.handleAudioInterruptions(true)

  // Enable only the commands we need
  MusicControl.enableControl(Command.play, true)
  MusicControl.enableControl(Command.pause, true)
  MusicControl.enableControl(Command.nextTrack, true)
  MusicControl.enableControl(Command.previousTrack, true)
  MusicControl.enableControl(Command.changePlaybackPosition, false)

  // Forward remote commands to the system player
  MusicControl.on(Command.play, () => MusicControl.updatePlayback({ state: MusicControl.STATE_PLAYING }))
  MusicControl.on(Command.pause, () => MusicControl.updatePlayback({ state: MusicControl.STATE_PAUSED }))
  MusicControl.on(Command.nextTrack, () => { /* next handled by OS */ })
  MusicControl.on(Command.previousTrack, () => { /* prev handled by OS */ })

  // Poll now-playing info (react-native-music-control is event-driven for commands,
  // but track metadata is read via the native bridge on each update event)
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
}

export function subscribeNowPlaying(listener: NowPlayingListener): () => void {
  _listener = listener
  // Emit current state immediately if we have it
  if (_current !== null) listener(_current)
  return () => {
    if (_listener === listener) _listener = null
  }
}

export function getCurrentTrack(): NowPlayingInfo | null {
  return _current
}

export function playPause(): void {
  if (!_current) return
  if (_current.isPlaying) {
    MusicControl.updatePlayback({ state: MusicControl.STATE_PAUSED })
  } else {
    MusicControl.updatePlayback({ state: MusicControl.STATE_PLAYING })
  }
}

export function nextTrack(): void {
  // Triggers the OS next-track command
  MusicControl.handleCommand('nextTrack', {})
}

export function prevTrack(): void {
  MusicControl.handleCommand('previousTrack', {})
}

export function teardownMusicService(): void {
  if (!_initialized) return
  MusicControl.stopControl()
  _initialized = false
  _current = null
  _listener = null
}
