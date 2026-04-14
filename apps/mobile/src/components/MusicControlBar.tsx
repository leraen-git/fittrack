/**
 * MusicControlBar — compact mini-player docked above the tab bar.
 *
 * Renders ONLY during an active workout session when music is playing.
 * Shows track title + artist, and play/pause/skip buttons.
 * Tapping the bar expands to show artwork (TBD).
 *
 * States:
 *   no music playing      → null (renders nothing, zero height)
 *   music + no session    → null (not relevant outside workout)
 *   music + active session → compact bar above tab bar
 */

import React, { useEffect, useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Animated,
  StyleSheet,
} from 'react-native'
import { useTheme } from '@/theme/ThemeContext'
import { useActiveSessionStore } from '@/stores/activeSessionStore'
import {
  subscribeNowPlaying,
  playPause,
  nextTrack,
  prevTrack,
  type NowPlayingInfo,
} from '@/services/musicService'

export function MusicControlBar() {
  const { colors, typography, spacing } = useTheme()
  const currentWorkout = useActiveSessionStore((s) => s.currentWorkout)
  const [track, setTrack] = useState<NowPlayingInfo | null>(null)
  const fadeAnim = React.useRef(new Animated.Value(0)).current

  // Only subscribe when there is an active session
  useEffect(() => {
    if (!currentWorkout) {
      setTrack(null)
      return
    }
    const unsub = subscribeNowPlaying(setTrack)
    return unsub
  }, [currentWorkout])

  // Animate in/out when track appears or disappears
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: track ? 1 : 0,
      duration: 220,
      useNativeDriver: true,
    }).start()
  }, [track, fadeAnim])

  if (!currentWorkout || !track) return null

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.surface2,
          opacity: fadeAnim,
          transform: [{ translateY: fadeAnim.interpolate({ inputRange: [0, 1], outputRange: [40, 0] }) }],
        },
      ]}
      accessibilityLabel="Music controls"
      accessibilityRole="toolbar"
    >
      {/* Artwork */}
      {track.artwork ? (
        <Image
          source={{ uri: track.artwork }}
          style={[styles.artwork, { borderRadius: 6 }]}
          accessibilityLabel="Album artwork"
        />
      ) : (
        <View style={[styles.artwork, { backgroundColor: colors.surface2, borderRadius: 6, alignItems: 'center', justifyContent: 'center' }]}>
          <Text style={{ fontSize: 18 }}>♪</Text>
        </View>
      )}

      {/* Track info */}
      <View style={styles.trackInfo}>
        <Text
          style={{ fontFamily: typography.family.semiBold, fontSize: typography.size.base, color: colors.textPrimary }}
          numberOfLines={1}
        >
          {track.title}
        </Text>
        <Text
          style={{ fontFamily: typography.family.regular, fontSize: typography.size.xs, color: colors.textMuted }}
          numberOfLines={1}
        >
          {track.artist}
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity
          onPress={prevTrack}
          style={styles.controlBtn}
          accessibilityLabel="Previous track"
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={{ fontSize: 18, color: colors.textPrimary }}>⏮</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={playPause}
          style={[styles.controlBtn, styles.playBtn, { backgroundColor: colors.primary }]}
          accessibilityLabel={track.isPlaying ? 'Pause' : 'Play'}
          accessibilityRole="button"
        >
          <Text style={{ fontSize: 16, color: '#fff' }}>
            {track.isPlaying ? '⏸' : '▶'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={nextTrack}
          style={styles.controlBtn}
          accessibilityLabel="Next track"
          accessibilityRole="button"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={{ fontSize: 18, color: colors.textPrimary }}>⏭</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
    gap: 10,
  },
  artwork: {
    width: 40,
    height: 40,
  },
  trackInfo: {
    flex: 1,
    gap: 2,
    overflow: 'hidden',
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  controlBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  playBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
})
