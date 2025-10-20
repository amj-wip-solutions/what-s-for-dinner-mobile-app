import { useState, useEffect } from 'react'
import { YStack, XStack, Button, H4, Paragraph, Sheet, Spinner, ScrollView, Text } from 'tamagui'
import { ChevronDown, Save } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { Alert } from 'react-native'
import { tagService, Tag } from '../services/tagService'
import { dayRuleService } from '../services/dayRuleService'
import { ScreenLayout } from '../components/ScreenLayout'

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

            Alert.alert('Success', 'Day rules saved successfully!')
            router.back()
        } catch (error) {
            console.error('Error saving rules:', error)
            Alert.alert('Error', `Failed to save day rules: ${error?.message || 'Unknown error'}`)
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
            <YStack key={day.value} borderBottomWidth={1} borderBottomColor="$borderColor" py="$3">
                <XStack ai="center" jc="space-between">
                    <Paragraph fontWeight="600" color="$color" width={100}>{day.label}</Paragraph>

                    <Button
                        flex={1}
                        backgroundColor="transparent"
                        borderWidth={1}
                        borderColor="$borderColor"
                        iconAfter={<ChevronDown size={16} color="$gray6" />}
                        onPress={() => toggleSheet(day.value, true)}
                        justifyContent="space-between"
                        color="$color"
                        borderRadius="$2"
                        pressStyle={{
                            backgroundColor: '$backgroundHover',
                        }}
                    >
                        <Text color={selectedTag ? '$color' : '$gray6'}>
                            {displayValue}
                        </Text>
                    </Button>
                </XStack>

                <Sheet
                    modal
                    open={openSheets[day.value]}
                    onOpenChange={(open) => toggleSheet(day.value, open)}
                    dismissOnSnapToBottom
                    snapPointsMode="fit"
                >
                    <Sheet.Frame p="$4" gap="$3" backgroundColor="$background">
                        <YStack gap="$2">
                            <H4 mb="$2" color="$color">Select tag for {day.label}</H4>

                            <Button
                                backgroundColor={rule?.tagId === null ? '$gray2' : 'transparent'}
                                borderWidth={1}
                                borderColor={rule?.tagId === null ? '$borderColor' : 'transparent'}
                                onPress={() => {
                                    updateRule(day.value, null)
                                    toggleSheet(day.value, false)
                                }}
                                justifyContent="flex-start"
                                color="$color"
                                borderRadius="$2"
                                pressStyle={{
                                    backgroundColor: '$backgroundHover',
                                }}
                            >
                                No rule
                            </Button>

                            {tags.map((tag) => (
                                <Button
                                    key={tag.id}
                                    backgroundColor={rule?.tagId === tag.id ? '$gray2' : 'transparent'}
                                    borderWidth={1}
                                    borderColor={rule?.tagId === tag.id ? '$borderColor' : 'transparent'}
                                    onPress={() => {
                                        updateRule(day.value, tag.id)
                                        toggleSheet(day.value, false)
                                    }}
                                    justifyContent="flex-start"
                                    color="$color"
                                    borderRadius="$2"
                                    pressStyle={{
                                        backgroundColor: '$backgroundHover',
                                    }}
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
                        backgroundColor="rgba(0,0,0,0.5)"
                    />
                </Sheet>
            </YStack>
        )
    }

    if (loading) {
        return (
            <ScreenLayout title="Day Rules" showBack>
                <YStack f={1} ai="center" jc="center">
                    <Spinner size="large" color="$brand" />
                </YStack>
            </ScreenLayout>
        )
    }

    return (
        <ScreenLayout title="Day Rules" showBack>
            <ScrollView flex={1} showsVerticalScrollIndicator={false}>
                <YStack p="$4" gap="$4">
                    <Paragraph color="$gray6" size="$3">
                        Set tag-based rules for each day of the week to automatically filter recipes in your meal plans.
                    </Paragraph>

                    <YStack
                        borderWidth={1}
                        borderColor="$borderColor"
                        borderRadius="$4"
                        overflow="hidden"
                        backgroundColor="$background"
                    >
                        {DAYS.map((day, index) => (
                            <YStack key={day.value}>
                                {renderDayRule(day)}
                            </YStack>
                        ))}
                    </YStack>

                    {/* Bottom spacer */}
                    <YStack height={100} />
                </YStack>
            </ScrollView>

            {/* Save Button */}
            <XStack
                position="absolute"
                bottom={0}
                left={0}
                right={0}
                borderTopWidth={1}
                borderTopColor="$borderColor"
                backgroundColor="$background"
                p="$3"
                shadowColor="$black"
                shadowOffset={{ width: 0, height: -2 }}
                shadowOpacity={0.05}
                shadowRadius={8}
            >
                <Button
                    flex={1}
                    size="$4"
                    backgroundColor="$brand"
                    color="$white"
                    icon={<Save size={18} />}
                    onPress={handleSave}
                    disabled={saving}
                    borderRadius="$2"
                    fontWeight="600"
                    pressStyle={{
                        backgroundColor: '$brandPress',
                    }}
                >
                    {saving ? 'Saving...' : 'Save Changes'}
                </Button>
            </XStack>
        </ScreenLayout>
    )
}
