import { useState, useEffect } from 'react'
import { YStack, XStack, Button, H3, H4, Paragraph, Select, Adapt, Sheet, Spinner, ScrollView } from 'tamagui'
import { ChevronDown, Check, Save, ArrowLeft } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { Alert } from 'react-native'

// Mock services for demonstration purposes
const tagService = {
    getAll: async () => ([
        { id: 1, name: 'Vegetarian' },
        { id: 2, name: 'Quick Meal' },
        { id: 3, name: 'High Protein' },
    ])
};

const dayRuleService = {
    getAll: async () => ([
        { dayOfWeek: 1, tagId: 1 },
        { dayOfWeek: 5, tagId: 2 },
    ]),
    deleteBydayOfWeek: async (day) => console.log(`Deleted rule for day ${day}`),
    upsertSingleDay: async (day, tagId) => console.log(`Upserted rule for day ${day} with tag ${tagId}`),
};
// End of Mock services

const DAYS = [
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
    { value: 7, label: 'Sunday' }
]

interface Tag {
    id: number;
    name: string;
}

interface DayRuleState {
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

            const initialRules: DayRuleState[] = []
            for (let day = 1; day <= 7; day++) {
                const existingRule = rulesData.find(r => r.dayOfWeek === day)
                initialRules.push({
                    dayOfWeek: day,
                    tagId: existingRule?.tagId || null
                })
            }

            setRules(initialRules)
        } catch (error) {
            console.error('Error loading data:', error)
            Alert.alert('Error', 'Failed to load day rules and tags')
        } finally {
            setLoading(false)
        }
    }

    const updateRule = (dayOfWeek: number, tagId: number | null) => {
        setRules(prev => prev.map(rule =>
            rule.dayOfWeek === dayOfWeek
                ? { ...rule, tagId }
                : rule
        ))
    }

    const handleSave = async () => {
        try {
            setSaving(true)
            console.log('Saving day rules...')

            const existingRules = await dayRuleService.getAll()

            for (const rule of rules) {
                const existingRule = existingRules.find(r => r.dayOfWeek === rule.dayOfWeek)

                if (rule.tagId === null) {
                    if (existingRule) {
                        try {
                            await dayRuleService.deleteBydayOfWeek(rule.dayOfWeek)
                            console.log(`Cleared rule for day ${rule.dayOfWeek}`)
                        } catch (error) {
                            console.error(`Failed to clear rule for day ${rule.dayOfWeek}:`, error)
                        }
                    }
                } else {
                    try {
                        await dayRuleService.upsertSingleDay(rule.dayOfWeek, rule.tagId)
                        console.log(`Set rule for day ${rule.dayOfWeek} to tag ${rule.tagId}`)
                    } catch (error) {
                        console.error(`Failed to set rule for day ${rule.dayOfWeek}:`, error)
                        continue
                    }
                }
            }

            Alert.alert('Success', 'Day rules have been saved successfully!')
            // In a real app, router.back() would be used.
            // For this example, we'll just log it.
            console.log('Navigating back');
            // router.back()
        } catch (error) {
            console.error('Error saving rules:', error);
            // This is a simplified error handling. The original more detailed one is also great.
            Alert.alert('Error', `Failed to save day rules: ${error?.message || 'Unknown error'}`);
        } finally {
            setSaving(false)
        }
    }

    const renderDayRule = (day: typeof DAYS[0]) => {
        const rule = rules.find(r => r.dayOfWeek === day.value)

        return (
            <XStack key={day.value} ai="center" jc="space-between" py="$2">
                <Paragraph width={80}>{day.label}</Paragraph>
                <Select
                    value={rule?.tagId?.toString() || ''}
                    onValueChange={(value) => updateRule(day.value, value ? parseInt(value) : null)}
                >
                    <Select.Trigger
                        width={200}
                        iconAfter={ChevronDown}
                        pressStyle={{ bg: '$gray5' }}
                        focusStyle={{ borderColor: '$blue8' }}
                    >
                        <Select.Value placeholder="No rule" />
                    </Select.Trigger>

                    {/* FIX: Removed platform="touch" to make the sheet appear on all small screens */}
                    <Adapt when="sm">
                        <Sheet
                            modal
                            dismissOnSnapToBottom
                            snapPointsMode="fit"
                        >
                            <Sheet.Frame padding="$4" gap="$4">
                                <Sheet.ScrollView showsVerticalScrollIndicator={false}>
                                    <Adapt.Contents />
                                </Sheet.ScrollView>
                            </Sheet.Frame>
                            <Sheet.Overlay
                                animation="lazy"
                                enterStyle={{ opacity: 0 }}
                                exitStyle={{ opacity: 0 }}
                            />
                        </Sheet>
                    </Adapt>

                    <Select.Content zIndex={200000}>
                        <Select.Viewport minHeight={200}>
                            <Select.Group>
                                <Select.Item
                                    index={0}
                                    value="" // Represents the 'null' or 'no rule' state
                                >
                                    <Select.ItemText>No rule</Select.ItemText>
                                    <Select.ItemIndicator marginLeft="auto">
                                        <Check size={16} />
                                    </Select.ItemIndicator>
                                </Select.Item>

                                {tags.map((tag, i) => (
                                    <Select.Item
                                        index={i + 1}
                                        key={tag.id}
                                        value={tag.id.toString()}
                                    >
                                        <Select.ItemText>{tag.name}</Select.ItemText>
                                        <Select.ItemIndicator marginLeft="auto">
                                            <Check size={16} />
                                        </Select.ItemIndicator>
                                    </Select.Item>
                                ))}
                            </Select.Group>
                        </Select.Viewport>
                    </Select.Content>
                </Select>
            </XStack>
        )
    }

    if (loading) {
        return (
            <YStack f={1} ai="center" jc="center">
                <Spinner size="large" />
            </YStack>
        )
    }

    return (
        // FIX: Added position="relative" to contain the absolutely positioned button
        <YStack f={1} bg="$background" position="relative">

            {/* Scrollable Content Area */}
            <ScrollView f={1} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
                <YStack p="$4" pt="$0" gap="$4">

                    {tags.length === 0 && (
                        <YStack p="$4" bg="$yellow3" br="$4">
                            <Paragraph color="$yellow11">
                                You need to create some tags first before setting day rules.
                                Go to "Manage Tags" to create tags like "vegetarian", "quick", etc.
                            </Paragraph>
                        </YStack>
                    )}

                    <YStack>
                        <H4 mb="$3">Weekly Rules</H4>
                        <YStack bg="$gray3" p="$3" br="$4" gap="$1">
                            {DAYS.map(day => renderDayRule(day))}
                        </YStack>
                    </YStack>
                </YStack>
            </ScrollView>

            {/* Save button container */}
            <YStack
                p="$4"
                pb="$6"
                bg="$background"
                borderTopWidth={1}
                borderTopColor="$gray5"
                position="absolute"
                bottom={0}
                left={0}
                right={0}
            >
                <Button
                    size="$5"
                    bg="$blue10"
                    color="white"
                    icon={Save}
                    onPress={handleSave}
                    disabled={saving || tags.length === 0}
                >
                    {saving ? <Spinner color="white" /> : 'Save Rules'}
                </Button>
            </YStack>
        </YStack>
    )
}

