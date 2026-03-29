import { Tabs } from 'expo-router'
import { useTheme } from '@/theme/ThemeContext'

export default function TabLayout() {
  const { colors, typography } = useTheme()

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.surface,
          borderTopColor: colors.surface2,
        },
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textMuted,
        tabBarLabelStyle: {
          fontFamily: typography.family.semiBold,
          fontSize: typography.size.xs,
        },
      }}
    >
      <Tabs.Screen name="index" options={{ title: 'Home', tabBarLabel: 'Home' }} />
      <Tabs.Screen name="workouts" options={{ title: 'Workouts', tabBarLabel: 'Workouts' }} />
      <Tabs.Screen name="history" options={{ title: 'History', tabBarLabel: 'History' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile', tabBarLabel: 'Profile' }} />
    </Tabs>
  )
}
