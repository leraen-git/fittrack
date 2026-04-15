import * as Notifications from 'expo-notifications'
import { Platform, Linking } from 'react-native'

export type PermissionStatus = 'granted' | 'denied' | 'undetermined'

/**
 * Returns the current notification permission status without prompting.
 */
export async function getPermissionStatus(): Promise<PermissionStatus> {
  const { status } = await Notifications.getPermissionsAsync()
  if (status === 'granted') return 'granted'
  if (status === 'denied') return 'denied'
  return 'undetermined'
}

/**
 * Requests notification permission from the OS.
 * Returns 'granted' | 'denied'.
 */
export async function requestPermission(): Promise<'granted' | 'denied'> {
  const { status } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: false,
      allowSound: true,
    },
  })
  return status === 'granted' ? 'granted' : 'denied'
}

/**
 * Opens the app's notification settings in the OS settings app.
 */
export async function openNotificationSettings(): Promise<void> {
  if (Platform.OS === 'ios') {
    await Linking.openURL('app-settings:')
  } else {
    await Linking.openSettings()
  }
}

/**
 * Configures notification channels for Android.
 * Safe to call on iOS (no-op).
 */
export function setupNotificationChannels(): void {
  if (Platform.OS !== 'android') return
  Notifications.setNotificationChannelAsync('workout-reminders', {
    name: 'Workout Reminders',
    importance: Notifications.AndroidImportance.HIGH,
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#E8192C',
  })
  Notifications.setNotificationChannelAsync('meal-reminders', {
    name: 'Meal Reminders',
    importance: Notifications.AndroidImportance.DEFAULT,
  })
  Notifications.setNotificationChannelAsync('hydration-reminders', {
    name: 'Hydration Reminders',
    importance: Notifications.AndroidImportance.LOW,
  })
}
