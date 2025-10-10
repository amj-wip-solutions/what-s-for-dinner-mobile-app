import { useState, useEffect } from 'react'
import { YStack, XStack, Button, H4, Paragraph, Separator, Switch, Spinner, ScrollView, Select } from 'tamagui'
import { ChevronRight, Calendar, Tag, LogOut, User, Settings, Check, ChevronDown } from '@tamagui/lucide-icons'
import { useAuth } from '../../contexts/AuthContext'
import { Alert } from 'react-native'
import { Link } from 'expo-router'
import { settingsService, UserSettings } from '../../services/settingsService'

export default function SettingsScreen() {
  const { user, signOut } = useAuth()
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectOpen, setSelectOpen] = useState(false)

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const settings = await settingsService.getSettings()
      setUserSettings(settings)
    } catch (error) {
      console.error('Error loading settings:', error)
      Alert.alert('Error', 'Failed to load settings')
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = async (key: keyof Pick<UserSettings, 'plannerDuration' | 'autoCreatePlans'>, value: any) => {
    if (!userSettings) return

    try {
      setSaving(true)
      const updatedSettings = await settingsService.updateSettings({
        [key]: value
      })
      setUserSettings(updatedSettings)
      // Close the select after successful update
      if (key === 'plannerDuration') {
        setSelectOpen(false)
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      Alert.alert('Error', 'Failed to update settings')
    } finally {
      setSaving(false)
    }
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
    <ScrollView f={1} bg="$background">
      <YStack f={1} p="$4" pb="$8">
        {/* User Info */}
        {user && (
          <YStack mb="$4" p="$3" bg="$gray3" br="$4">
            <XStack ai="center" gap="$2">
              <User size="$1" />
              <YStack f={1}>
                <Paragraph size="$3" col="$gray11">{user.email}</Paragraph>
              </YStack>
            </XStack>
          </YStack>
        )}

        {/* User Settings Configuration */}
        <YStack mb="$4" p="$4" bg="$gray2" br="$4">
          <XStack ai="center" gap="$2" mb="$3">
            <Settings size="$1" color="$blue10" />
            <H4>Meal Plan Preferences</H4>
            {saving && <Spinner size="small" color="$blue10" />}
          </XStack>

          {loading ? (
            <YStack ai="center" jc="center" height="$6">
              <Spinner size="large" />
            </YStack>
          ) : userSettings ? (
            <YStack gap="$3">
              {/* Planner Duration */}
              <YStack gap="$2">
                <Paragraph fontWeight="600">Plan Duration</Paragraph>
                <Select
                  value={userSettings.plannerDuration.toString()}
                  onValueChange={(value) => updateSetting('plannerDuration', parseInt(value))}
                  disabled={saving}
                  open={selectOpen}
                  onOpenChange={setSelectOpen}
                >
                  <Select.Trigger w="100%" iconAfter={ChevronDown}>
                    <Select.Value />
                  </Select.Trigger>

                  <Select.Content zIndex={200000}>
                    <Select.Item index={0} value="7">
                      <Select.ItemText>1 Week (7 days)</Select.ItemText>
                      <Select.ItemIndicator ml="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                    <Select.Item index={1} value="14">
                      <Select.ItemText>2 Weeks (14 days)</Select.ItemText>
                      <Select.ItemIndicator ml="auto">
                        <Check size={16} />
                      </Select.ItemIndicator>
                    </Select.Item>
                  </Select.Content>
                </Select>
                <Paragraph size="$2" col="$gray11">
                  Choose how many days to plan at once
                </Paragraph>
              </YStack>

              {/* Auto Create Plans */}
                <YStack f={1} gap="$2" ai="center" jc="flex-start" mt="$3">
                    <Paragraph fontWeight="600">Auto-create New Plans</Paragraph>
                    <Switch
                        size="$4"
                        checked={userSettings.autoCreatePlans}
                        onCheckedChange={(checked) => updateSetting('autoCreatePlans', checked)}
                        disabled={saving}
                    >
                        <Switch.Thumb animation="bouncy" />
                    </Switch>
                </YStack>
            </YStack>
          ) : (
            <Paragraph col="$gray11">Failed to load settings</Paragraph>
          )}
        </YStack>

        <YStack gap="$2">
          {/* Day of the Week Rules */}
          <Link href="/day-rules" asChild>
            <Button
              size="$5"
              bg="$background"
              borderColor="$borderColor"
              borderWidth={1}
              jc="flex-start"
              iconAfter={<ChevronRight size="$1" />}
            >
              <XStack ai="center" gap="$3" f={1}>
                <Calendar size="$1" color="$blue10" />
                <YStack f={1} ai="flex-start">
                  <Paragraph fontWeight="600">Day of the Week Rules</Paragraph>
                  <Paragraph size="$2" col="$gray11">
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
              bg="$background"
              borderColor="$borderColor"
              borderWidth={1}
              jc="flex-start"
              iconAfter={<ChevronRight size="$1" />}
            >
              <XStack ai="center" gap="$3" f={1}>
                <Tag size="$1" color="$green10" />
                <YStack f={1} ai="flex-start">
                  <Paragraph fontWeight="600">Manage Tags</Paragraph>
                  <Paragraph size="$2" col="$gray11">
                    Create and edit your recipe tags
                  </Paragraph>
                </YStack>
              </XStack>
            </Button>
          </Link>

          <Separator mv="$3" />

          {/* Account Actions */}
          <Button
            size="$5"
            bg="$background"
            borderColor="$red8"
            borderWidth={1}
            jc="flex-start"
            onPress={handleLogout}
          >
            <XStack ai="center" gap="$3" f={1}>
              <LogOut size="$1" color="$red10" />
              <Paragraph fontWeight="600" col="$red11">Sign Out</Paragraph>
            </XStack>
          </Button>
        </YStack>
      </YStack>
    </ScrollView>
  )
}
