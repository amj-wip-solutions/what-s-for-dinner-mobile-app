import { YStack, XStack, Button, H3, Paragraph, Separator } from 'tamagui'
import { ChevronRight, Calendar, Tag, LogOut, User } from '@tamagui/lucide-icons'
import { useAuth } from '../../contexts/AuthContext'
import { Alert } from 'react-native'

export default function SettingsScreen() {
  const { user, signOut } = useAuth()

  const handleDayRules = () => {
    // Navigate to day rules screen
    console.log('Day rules pressed')
  }

  const handleManageTags = () => {
    // Navigate to manage tags screen
    console.log('Manage tags pressed')
  }

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut()
          }
        }
      ]
    )
  }

  return (
    <YStack f={1} bg="$background" p="$4">
      <H3 mb="$4">Settings & Rules</H3>

      {/* User Info */}
      {user && (
        <YStack mb="$4" p="$3" bg="$gray2" borderRadius="$4">
          <Paragraph fontWeight="600">Signed in as:</Paragraph>
          <Paragraph size="$3" theme="alt2">{user.email}</Paragraph>
        </YStack>
      )}

      <YStack gap="$2">
        {/* Day of the Week Rules */}
        <Button
          size="$5"
          variant="outlined"
          justifyContent="flex-start"
          icon={Calendar}
          iconAfter={ChevronRight}
          onPress={handleDayRules}
        >
          <YStack f={1} alignItems="flex-start">
            <Paragraph fontWeight="600">Day of the Week Rules</Paragraph>
            <Paragraph size="$2" theme="alt2">Set rules for specific days</Paragraph>
          </YStack>
        </Button>

        <Separator my="$2" />

        {/* Manage Tags */}
        <Button
          size="$5"
          variant="outlined"
          justifyContent="flex-start"
          icon={Tag}
          iconAfter={ChevronRight}
          onPress={handleManageTags}
        >
          <YStack f={1} alignItems="flex-start">
            <Paragraph fontWeight="600">Manage Tags</Paragraph>
            <Paragraph size="$2" theme="alt2">Add, edit, or delete recipe tags</Paragraph>
          </YStack>
        </Button>

        <Separator my="$4" />

        {/* Logout Button */}
        <Button
          size="$5"
          variant="outlined"
          theme="red"
          justifyContent="flex-start"
          icon={LogOut}
          onPress={handleLogout}
        >
          <YStack f={1} alignItems="flex-start">
            <Paragraph fontWeight="600">Sign Out</Paragraph>
            <Paragraph size="$2" theme="alt2">Sign out of your account</Paragraph>
          </YStack>
        </Button>
      </YStack>
    </YStack>
  )
}
