import { Link, Tabs } from 'expo-router'
import { Button, useTheme } from 'tamagui'
import { Calendar, BookOpen, Settings } from '@tamagui/lucide-icons'

export default function TabLayout() {
  const theme = useTheme()

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.red10.val,
        tabBarStyle: {
          backgroundColor: theme.background.val,
          borderTopColor: theme.borderColor.val,
        },
        headerStyle: {
          backgroundColor: theme.background.val,
          borderBottomColor: theme.borderColor.val,
        },
        headerTintColor: theme.color.val,
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
