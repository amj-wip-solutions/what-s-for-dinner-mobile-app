import { YStack, XStack, Button, H3, Paragraph, Separator } from 'tamagui'
import { ChevronRight, Calendar, Tag, LogOut, User } from '@tamagui/lucide-icons'
import { useAuth } from '../../contexts/AuthContext'
import { Alert } from 'react-native'
import { Link } from 'expo-router'

export default function SettingsScreen() {
  const { user, signOut } = useAuth()

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
    <YStack flex={1} backgroundColor="$background" padding="$4">
      <H3 marginBottom="$4">Settings & Rules</H3>

      {/* User Info */}
      {user && (
        <YStack marginBottom="$4" padding="$3" backgroundColor="$gray3" borderRadius="$4">
          <XStack alignItems="center" gap="$2">
            <User size="$1" />
            <YStack flex={1}>
              <Paragraph fontWeight="600">Signed in as:</Paragraph>
              <Paragraph size="$3" color="$gray11">{user.email}</Paragraph>
            </YStack>
          </XStack>
        </YStack>
      )}

      <YStack gap="$2">
        {/* Day of the Week Rules */}
        <Link href="/day-rules" asChild>
          <Button
            size="$5"
            backgroundColor="$background"
            borderColor="$borderColor"
            borderWidth={1}
            justifyContent="flex-start"
            iconAfter={<ChevronRight size="$1" />}
          >
            <XStack alignItems="center" gap="$3" flex={1}>
              <Calendar size="$1" color="$blue10" />
              <YStack flex={1} alignItems="flex-start">
                <Paragraph fontWeight="600">Day of the Week Rules</Paragraph>
                <Paragraph size="$2" color="$gray11">
                  Set fortnightly rules for each day
                </Paragraph>
              </YStack>
            </XStack>
          </Button>
        </Link>

        {/* Manage Tags */}
        <Link href="/manage-tags" asChild>
          <Button
            size="$5"
            backgroundColor="$background"
            borderColor="$borderColor"
            borderWidth={1}
            justifyContent="flex-start"
            iconAfter={<ChevronRight size="$1" />}
          >
            <XStack alignItems="center" gap="$3" flex={1}>
              <Tag size="$1" color="$green10" />
              <YStack flex={1} alignItems="flex-start">
                <Paragraph fontWeight="600">Manage Tags</Paragraph>
                <Paragraph size="$2" color="$gray11">
                  Create and edit your recipe tags
                </Paragraph>
              </YStack>
            </XStack>
          </Button>
        </Link>

        <Separator marginVertical="$3" />

        {/* Account Actions */}
        <Button
          size="$5"
          backgroundColor="$background"
          borderColor="$red8"
          borderWidth={1}
          justifyContent="flex-start"
          onPress={handleLogout}
        >
          <XStack alignItems="center" gap="$3" flex={1}>
            <LogOut size="$1" color="$red10" />
            <Paragraph fontWeight="600" color="$red11">Sign Out</Paragraph>
          </XStack>
        </Button>
      </YStack>
    </YStack>
  )
}
