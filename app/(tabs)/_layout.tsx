import { Tabs } from 'expo-router'
import { useTheme } from 'tamagui'
import { Calendar, BookOpen, Settings } from '@tamagui/lucide-icons'

export default function TabLayout() {
  const theme = useTheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.brand?.val || '#10b981',
        tabBarInactiveTintColor: theme.gray6?.val || '#737373',
        tabBarStyle: {
          backgroundColor: theme.background?.val,
          borderTopWidth: 1,
          borderTopColor: theme.borderColor?.val,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerShown: false, // Hide the native header since ScreenLayout provides its own
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Meal Plan',
          tabBarIcon: ({ color }) => <Calendar color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          title: 'Recipes',
          tabBarIcon: ({ color }) => <BookOpen color={color as any} />,
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color }) => <Settings color={color as any} />,
        }}
      />
    </Tabs>
  )
}
