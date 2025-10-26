import { useState, useEffect } from 'react'
import { YStack, XStack, Button, Paragraph, Switch, Spinner, ScrollView, Select, Sheet } from 'tamagui'
import { ChevronRight, Calendar, Tag, LogOut, User, ChevronDown, Check } from '@tamagui/lucide-icons'
import { useAuth } from '../../contexts/AuthContext'
import { Alert } from 'react-native'
import { Link } from 'expo-router'
import { settingsService, UserSettings } from '../../services/settingsService'
import { ScreenLayout } from '../../components/ScreenLayout'
import { SectionHeader } from '../../components/SectionHeader'
import { useToastController } from '@tamagui/toast'

export default function SettingsScreen() {
  const { user, signOut } = useAuth()
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const toast = useToastController()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      const settings = await settingsService.getSettings()
      setUserSettings(settings)
    } catch (error) {
      console.error('Error loading settings:', error)
      toast.show('Error', {
        message: 'Failed to load settings',
      })
    } finally {
      setLoading(false)
    }
  }

  const updateSetting = async (key: keyof Pick<UserSettings, 'plannerDuration' | 'autoCreatePlans' | 'weekStartDay'>, value: any) => {
    if (!userSettings) return

    try {
      setSaving(true)
      const updatedSettings = await settingsService.updateSettings({
        [key]: value
      })
      setUserSettings(updatedSettings)

      if (key === 'plannerDuration') {
        toast.show('Settings Updated', {
          message: 'Your plan duration has been updated. To apply the new settings, please recreate your meal planner from the main screen.',
        })
      } else if (key === 'weekStartDay') {
        toast.show('Settings Updated', {
          message: 'Your week start day has been updated. To apply the new settings, please recreate your meal planner from the main screen.',
        })
      } else if (key === 'autoCreatePlans') {
        toast.show('Settings Updated', {
          message: 'Your auto-create plans setting has been updated successfully.',
        })
      }
    } catch (error) {
      console.error('Error updating settings:', error)
      toast.show('Error', {
        message: 'Failed to update settings',
      })
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
    <ScreenLayout title="Settings">
      <ScrollView flex={1} contentContainerStyle={{ flexGrow: 1 }} showsVerticalScrollIndicator={false}>
        <YStack padding="$4" gap="$6">

          {/* Account Section */}
          <YStack gap="$3">
            <SectionHeader>Account</SectionHeader>
            {user && (
              <XStack
                padding="$4"
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$4"
                alignItems="center"
                gap="$3"
                backgroundColor="$background"
              >
                <YStack
                  width={40}
                  height={40}
                  borderRadius={20}
                  backgroundColor="$gray2"
                  alignItems="center"
                  justifyContent="center"
                >
                  <User size={20} color="$gray7" />
                </YStack>
                <Paragraph flex={1} color="$color">{user.email}</Paragraph>
              </XStack>
            )}
          </YStack>

          {/* Preferences Section */}
          <YStack gap="$3">
            <SectionHeader>Preferences</SectionHeader>

            {loading ? (
              <YStack alignItems="center" justifyContent="center" height="$10">
                <Spinner size="large" color="$brand" />
              </YStack>
            ) : userSettings ? (
              <YStack
                borderWidth={1}
                borderColor="$borderColor"
                borderRadius="$4"
                overflow="hidden"
                backgroundColor="$background"
              >
                {/* Plan Duration */}
                <YStack padding="$4" borderBottomWidth={1} borderBottomColor="$borderColor">
                  <YStack gap="$2" marginBottom="$3">
                    <Paragraph fontWeight="600" color="$color">Plan Duration</Paragraph>
                    <Paragraph size="$2" color="$gray6">
                      How many days to plan at once
                    </Paragraph>
                  </YStack>
                  <Select
                    value={userSettings.plannerDuration.toString()}
                    onValueChange={(value) => updateSetting('plannerDuration', parseInt(value))}
                  >
                    <Select.Trigger
                      width="100%"
                      borderColor="$borderColor"
                      iconAfter={ChevronDown}
                    >
                      <Select.Value placeholder="Select duration" />
                    </Select.Trigger>

                    <Select.Adapt when="sm" platform="touch">
                      <Sheet
                        modal
                        dismissOnSnapToBottom
                        snapPointsMode="percent"
                        snapPoints={[90]}
                      >
                        <Sheet.Frame p="$4" gap="$4" backgroundColor="$background">
                          <Sheet.Handle backgroundColor="$borderColor" />
                          <Select.Adapt.Contents />
                        </Sheet.Frame>
                        <Sheet.Overlay
                          animation="lazy"
                          enterStyle={{ opacity: 0 }}
                          exitStyle={{ opacity: 0 }}
                          backgroundColor="rgba(0,0,0,0.5)"
                        />
                      </Sheet>
                    </Select.Adapt>

                    <Select.Content zIndex={200000}>
                      <Select.Viewport>
                        <Select.Item index={0} value="7">
                          <Select.ItemText fontSize="$6" paddingVertical="$3">1 Week (7 days)</Select.ItemText>
                          <Select.ItemIndicator marginLeft="auto">
                            <Check size={20} color="$brand" />
                          </Select.ItemIndicator>
                        </Select.Item>
                        <Select.Item index={1} value="14">
                          <Select.ItemText fontSize="$6" paddingVertical="$3">2 Weeks (14 days)</Select.ItemText>
                          <Select.ItemIndicator marginLeft="auto">
                            <Check size={20} color="$brand" />
                          </Select.ItemIndicator>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select>
                </YStack>

                {/* Week Start Day */}
                <YStack padding="$4" borderBottomWidth={1} borderBottomColor="$borderColor">
                  <YStack gap="$2" marginBottom="$3">
                    <Paragraph fontWeight="600" color="$color">Week Start Day</Paragraph>
                    <Paragraph size="$2" color="$gray6">
                      First day of your meal planning week
                    </Paragraph>
                  </YStack>
                  <Select
                    value={(userSettings.weekStartDay || 1).toString()}
                    onValueChange={(value) => updateSetting('weekStartDay', parseInt(value))}
                  >
                    <Select.Trigger
                      width="100%"
                      borderColor="$borderColor"
                      iconAfter={ChevronDown}
                    >
                      <Select.Value placeholder="Select week start day" />
                    </Select.Trigger>

                    <Select.Adapt when="sm" platform="touch">
                      <Sheet
                        modal
                        dismissOnSnapToBottom
                        snapPointsMode="percent"
                        snapPoints={[90]}
                      >
                        <Sheet.Frame p="$4" gap="$4" backgroundColor="$background">
                          <Sheet.Handle backgroundColor="$borderColor" />
                          <Select.Adapt.Contents />
                        </Sheet.Frame>
                        <Sheet.Overlay
                          animation="lazy"
                          enterStyle={{ opacity: 0 }}
                          exitStyle={{ opacity: 0 }}
                          backgroundColor="rgba(0,0,0,0.5)"
                        />
                      </Sheet>
                    </Select.Adapt>

                    <Select.Content zIndex={200000}>
                      <Select.Viewport>
                        <Select.Item index={0} value="1">
                          <Select.ItemText fontSize="$6" paddingVertical="$3">Monday</Select.ItemText>
                          <Select.ItemIndicator marginLeft="auto">
                            <Check size={20} color="$brand" />
                          </Select.ItemIndicator>
                        </Select.Item>
                        <Select.Item index={1} value="2">
                          <Select.ItemText fontSize="$6" paddingVertical="$3">Tuesday</Select.ItemText>
                          <Select.ItemIndicator marginLeft="auto">
                            <Check size={20} color="$brand" />
                          </Select.ItemIndicator>
                        </Select.Item>
                        <Select.Item index={2} value="3">
                          <Select.ItemText fontSize="$6" paddingVertical="$3">Wednesday</Select.ItemText>
                          <Select.ItemIndicator marginLeft="auto">
                            <Check size={20} color="$brand" />
                          </Select.ItemIndicator>
                        </Select.Item>
                        <Select.Item index={3} value="4">
                          <Select.ItemText fontSize="$6" paddingVertical="$3">Thursday</Select.ItemText>
                          <Select.ItemIndicator marginLeft="auto">
                            <Check size={20} color="$brand" />
                          </Select.ItemIndicator>
                        </Select.Item>
                        <Select.Item index={4} value="5">
                          <Select.ItemText fontSize="$6" paddingVertical="$3">Friday</Select.ItemText>
                          <Select.ItemIndicator marginLeft="auto">
                            <Check size={20} color="$brand" />
                          </Select.ItemIndicator>
                        </Select.Item>
                        <Select.Item index={5} value="6">
                          <Select.ItemText fontSize="$6" paddingVertical="$3">Saturday</Select.ItemText>
                          <Select.ItemIndicator marginLeft="auto">
                            <Check size={20} color="$brand" />
                          </Select.ItemIndicator>
                        </Select.Item>
                        <Select.Item index={6} value="7">
                          <Select.ItemText fontSize="$6" paddingVertical="$3">Sunday</Select.ItemText>
                          <Select.ItemIndicator marginLeft="auto">
                            <Check size={20} color="$brand" />
                          </Select.ItemIndicator>
                        </Select.Item>
                      </Select.Viewport>
                    </Select.Content>
                  </Select>
                </YStack>

                {/* Auto Create Plans */}
                <YStack padding="$4">
                  <XStack justifyContent="space-between" alignItems="center" gap="$3">
                    <YStack flex={1}>
                      <Paragraph fontWeight="600" color="$color">Auto-create Plans</Paragraph>
                      <Paragraph size="$2" color="$gray6">
                        Automatically create new plans when current expires
                      </Paragraph>
                    </YStack>
                    <Switch
                      checked={userSettings.autoCreatePlans}
                      onCheckedChange={(checked) => updateSetting('autoCreatePlans', checked)}
                      disabled={saving}
                    >
                      <Switch.Thumb animation="bouncy" />
                    </Switch>
                  </XStack>
                </YStack>
              </YStack>
            ) : (
              <Paragraph color="$gray6">Failed to load settings</Paragraph>
            )}
          </YStack>

          {/* Management Section */}
          <YStack gap="$3">
            <SectionHeader>Management</SectionHeader>

            <YStack
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius="$4"
              overflow="hidden"
              backgroundColor="$background"
            >
              <Link href="/day-rules" asChild>
                <Button
                  size="$4"
                  backgroundColor="transparent"
                  borderBottomWidth={1}
                  borderBottomColor="$borderColor"
                  borderRadius={0}
                  justifyContent="space-between"
                  iconAfter={<ChevronRight size={20} color="$gray6" />}
                  pressStyle={{ backgroundColor: '$backgroundHover' }}
                  paddingVertical="$4"
                  height="auto"
                >
                  <XStack gap="$3" alignItems="center" flex={1}>
                    <Calendar size={20} color="$gray7" />
                    <YStack alignItems="flex-start" flex={1} gap="$1">
                      <Paragraph fontWeight="600" color="$color">Day Rules</Paragraph>
                      <Paragraph size="$2" color="$gray6">
                        Set tag rules for each day
                      </Paragraph>
                    </YStack>
                  </XStack>
                </Button>
              </Link>

              <Link href="/manage-tags" asChild>
                <Button
                  size="$4"
                  backgroundColor="transparent"
                  borderRadius={0}
                  justifyContent="space-between"
                  iconAfter={<ChevronRight size={20} color="$gray6" />}
                  pressStyle={{ backgroundColor: '$backgroundHover' }}
                  paddingVertical="$4"
                  height="auto"
                >
                  <XStack gap="$3" alignItems="center" flex={1}>
                    <Tag size={20} color="$gray7" />
                    <YStack alignItems="flex-start" flex={1} gap="$1">
                      <Paragraph fontWeight="600" color="$color">Manage Tags</Paragraph>
                      <Paragraph size="$2" color="$gray6">
                        Create and edit recipe tags
                      </Paragraph>
                    </YStack>
                  </XStack>
                </Button>
              </Link>
            </YStack>
          </YStack>

          {/* Danger Zone */}
          <YStack gap="$3">
            <SectionHeader>Danger Zone</SectionHeader>

            <Button
              size="$4"
              borderWidth={1}
              borderColor="$error"
              backgroundColor="transparent"
              icon={<LogOut size={20} />}
              onPress={handleLogout}
              borderRadius="$4"
              fontWeight="600"
              pressStyle={{
                backgroundColor: '$error',
              }}
            >
              <Paragraph color="$error">Sign Out</Paragraph>
            </Button>
          </YStack>

          {/* Bottom spacer for tab bar */}
          <YStack height={80} />
        </YStack>
      </ScrollView>
    </ScreenLayout>
  )
}
