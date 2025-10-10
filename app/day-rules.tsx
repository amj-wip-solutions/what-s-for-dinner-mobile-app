import { useState, useEffect } from 'react'

import { YStack, XStack, Button, H4, Paragraph, Sheet, Spinner, ScrollView } from 'tamagui'
import { ChevronDown, Save } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { Alert } from 'react-native'
import { tagService, Tag } from '../services/tagService'
import { dayRuleService } from '../services/dayRuleService'

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
    dayOfWeek: number
    tagId: number | null
}

export default function DayRulesScreen() {
    const router = useRouter()
    const [tags, setTags] = useState<Tag[]>([])
    const [rules, setRules] = useState<DayRuleState[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [openSheets, setOpenSheets] = useState<Record<number, boolean>>({})

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

    const toggleSheet = (dayValue: number, isOpen: boolean) => {
        setOpenSheets(prev => ({
            ...prev,
            [dayValue]: isOpen
        }))
    }

    const renderDayRule = (day: typeof DAYS[0]) => {
        const rule = rules.find(r => r.dayOfWeek === day.value)

        const selectedTag = rule?.tagId ? tags.find(t => t.id === rule.tagId) : null
        const displayValue = selectedTag ? selectedTag.name : "No rule"

        return (
            <XStack key={day.value} ai="center" jc="space-between" py="$2">
                <Paragraph width={80}>{day.label}</Paragraph>

                <Button
                    width={200}
                    variant="outlined"
                    iconAfter={ChevronDown}
                    onPress={() => toggleSheet(day.value, true)}
                    jc="space-between"
                >
                    {displayValue}
                </Button>

                <Sheet
                    modal
                    open={openSheets[day.value]}
                    onOpenChange={(open) => toggleSheet(day.value, open)}
                    dismissOnSnapToBottom
                    snapPointsMode="fit"
                >
                    <Sheet.Frame p="$4" gap="$4">
                        <YStack gap="$2">
                            <H4 mb="$2">Select rule for {day.label}</H4>
                            <Button
                                variant={rule?.tagId === null ? "outlined" : "ghost"}
                                onPress={() => {
                                    updateRule(day.value, null)
                                    toggleSheet(day.value, false)
                                }}
                                jc="flex-start"
                            >
                                No rule
                            </Button>
                            {tags.map((tag) => (
                                <Button
                                    key={tag.id}
                                    variant={rule?.tagId === tag.id ? "outlined" : "ghost"}
                                    onPress={() => {
                                        updateRule(day.value, tag.id)
                                        toggleSheet(day.value, false)
                                    }}
                                    jc="flex-start"
                                >
                                    {tag.name}
                                </Button>
                            ))}
                        </YStack>
                    </Sheet.Frame>
                    <Sheet.Overlay
                        animation="lazy"
                        enterStyle={{ opacity: 0 }}
                        exitStyle={{ opacity: 0 }}
                    />
                </Sheet>
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
