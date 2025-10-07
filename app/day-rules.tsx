import { useState, useEffect } from 'react'
import { YStack, XStack, Button, H3, H4, Paragraph, Select, Adapt, Sheet, Spinner } from 'tamagui'
import { ChevronDown, Check, Save, ArrowLeft } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { Alert } from 'react-native'
import { tagService, Tag } from '../services/tagService'
import { dayRuleService, CreateDayRuleRequest } from '../services/dayRuleService'

const DAYS = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
  { value: 7, label: 'Sunday' }
]

interface DayRuleState {
  week: 1 | 2
  dayOfWeek: number
  tagId: number | null
}

export default function DayRulesScreen() {
  const router = useRouter()
  const [tags, setTags] = useState<Tag[]>([])
  const [rules, setRules] = useState<DayRuleState[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      const [tagsData, rulesData] = await Promise.all([
        tagService.getAll(),
        dayRuleService.getAll()
      ])

      setTags(tagsData)

      // Initialize rules array with all 14 days (2 weeks × 7 days)
      const initialRules: DayRuleState[] = []
      for (let week = 1; week <= 2; week++) {
        for (let day = 1; day <= 7; day++) {
          const existingRule = rulesData.find(r => r.week === week && r.dayOfWeek === day)
          initialRules.push({
            week: week as 1 | 2,
            dayOfWeek: day,
            tagId: existingRule?.tagId || null
          })
        }
      }

      setRules(initialRules)
    } catch (error) {
      console.error('Error loading data:', error)
      Alert.alert('Error', 'Failed to load day rules and tags')
    } finally {
      setLoading(false)
    }
  }

  const updateRule = (week: 1 | 2, dayOfWeek: number, tagId: number | null) => {
    setRules(prev => prev.map(rule =>
      rule.week === week && rule.dayOfWeek === dayOfWeek
        ? { ...rule, tagId }
        : rule
    ))
  }

  const handleSave = async () => {
    try {
      setSaving(true)

      // Filter out rules with no tag selected
      const rulesToSave = rules
        .filter(rule => rule.tagId !== null)
        .map(rule => ({
          week: rule.week,
          dayOfWeek: rule.dayOfWeek,
          tagId: rule.tagId!
        }))

      await dayRuleService.upsert(rulesToSave)

      Alert.alert('Success', 'Day rules have been saved successfully!')
      router.back()
    } catch (error) {
      console.error('Error saving rules:', error)
      Alert.alert('Error', 'Failed to save day rules')
    } finally {
      setSaving(false)
    }
  }

  const renderDayRule = (week: 1 | 2, day: typeof DAYS[0]) => {
    const rule = rules.find(r => r.week === week && r.dayOfWeek === day.value)

    return (
      <XStack key={`${week}-${day.value}`} alignItems="center" justifyContent="space-between" paddingVertical="$2">
        <Paragraph width={80}>{day.label}</Paragraph>
        <Select
          value={rule?.tagId?.toString() || ''}
          onValueChange={(value) => updateRule(week, day.value, value ? parseInt(value) : null)}
        >
          <Select.Trigger width={200} iconAfter={ChevronDown}>
            <Select.Value placeholder="No rule" />
          </Select.Trigger>

          <Adapt when="sm" platform="touch">
            <Sheet modal dismissOnSnapToBottom>
              <Sheet.Frame>
                <Sheet.ScrollView>
                  <Adapt.Contents />
                </Sheet.ScrollView>
              </Sheet.Frame>
              <Sheet.Overlay />
            </Sheet>
          </Adapt>

          <Select.Content zIndex={200000}>
            <Select.ScrollUpButton
              alignItems="center"
              justifyContent="center"
              position="relative"
              width="100%"
              height="$3"
            >
              <YStack zIndex={10}>
                <ChevronDown size={20} />
              </YStack>
            </Select.ScrollUpButton>

            <Select.Viewport height={200}>
              <Select.Group>
                <Select.Item index={0} value="">
                  <Select.ItemText>No rule</Select.ItemText>
                  <Select.ItemIndicator marginLeft="auto">
                    <Check size={16} />
                  </Select.ItemIndicator>
                </Select.Item>

                {tags.map((tag, i) => (
                  <Select.Item index={i + 1} key={tag.id} value={tag.id.toString()}>
                    <Select.ItemText>{tag.name}</Select.ItemText>
                    <Select.ItemIndicator marginLeft="auto">
                      <Check size={16} />
                    </Select.ItemIndicator>
                  </Select.Item>
                ))}
              </Select.Group>
            </Select.Viewport>

            <Select.ScrollDownButton
              alignItems="center"
              justifyContent="center"
              position="relative"
              width="100%"
              height="$3"
            >
              <YStack zIndex={10}>
                <ChevronDown size={20} />
              </YStack>
            </Select.ScrollDownButton>
          </Select.Content>
        </Select>
      </XStack>
    )
  }

  if (loading) {
    return (
      <YStack flex={1} alignItems="center" justifyContent="center">
        <Spinner size="large" />
      </YStack>
    )
  }

  return (
    <YStack flex={1} backgroundColor="$background" padding="$4">
      {/* Header */}
      <XStack alignItems="center" marginBottom="$4">
        <Button
          size="$3"
          chromeless
          icon={ArrowLeft}
          onPress={() => router.back()}
        />
        <H3 flex={1} textAlign="center" marginRight="$8">Fortnightly Day Rules</H3>
      </XStack>

      <Paragraph marginBottom="$4" color="$gray11">
        Set rules that apply to specific days across your 2-week meal plans.
        For example, make Mondays always vegetarian or Fridays always quick meals.
      </Paragraph>

      {tags.length === 0 && (
        <YStack padding="$4" backgroundColor="$yellow3" borderRadius="$4" marginBottom="$4">
          <Paragraph color="$yellow11">
            You need to create some tags first before setting day rules.
            Go to "Manage Tags" to create tags like "vegetarian", "quick", etc.
          </Paragraph>
        </YStack>
      )}

      <YStack flex={1} gap="$4">
        {/* Week 1 */}
        <YStack>
          <H4 marginBottom="$3">Week 1</H4>
          <YStack backgroundColor="$gray3" padding="$3" borderRadius="$4" gap="$1">
            {DAYS.map(day => renderDayRule(1, day))}
          </YStack>
        </YStack>

        {/* Week 2 */}
        <YStack>
          <H4 marginBottom="$3">Week 2</H4>
          <YStack backgroundColor="$gray3" padding="$3" borderRadius="$4" gap="$1">
            {DAYS.map(day => renderDayRule(2, day))}
          </YStack>
        </YStack>
      </YStack>

      {/* Save Button */}
      <Button
        size="$5"
        backgroundColor="$blue10"
        color="white"
        icon={Save}
        onPress={handleSave}
        disabled={saving || tags.length === 0}
        marginTop="$4"
      >
        {saving ? <Spinner color="white" /> : 'Save Rules'}
      </Button>
    </YStack>
  )
}
