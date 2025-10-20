import { Link, Tabs } from 'expo-router'
import { Button, useTheme } from 'tamagui'
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
        headerStyle: {
          backgroundColor: theme.background?.val,
          borderBottomWidth: 1,
          borderBottomColor: theme.borderColor?.val,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTintColor: theme.color?.val,
        headerTitleStyle: {
          fontWeight: '600',
        },
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
