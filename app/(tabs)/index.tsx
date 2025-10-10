import { useState, useEffect, useCallback } from 'react'
import { Alert, FlatList } from 'react-native'
import {
  YStack,
  XStack,
  H3,
  Paragraph,
  Button,
  Card,
  Image,
  Text
} from 'tamagui'
import { RefreshCw, Plus, Tag as TagIcon } from '@tamagui/lucide-icons'
import { settingsService, UserSettings } from '../../services/settingsService'
import { tagService, Tag } from '../../services/tagService'

const DayItem = ({ item, onSwap }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    })
  }

  const renderTags = () => {
    if (!item.tags || item.tags.length === 0) return null

    return (
      <XStack gap="$2" mt="$2" flexWrap="wrap">
        {item.tags.map((tag) => (
          <XStack
            key={tag.id}
            backgroundColor="$blue3"
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$2"
            alignItems="center"
            gap="$1"
          >
            <TagIcon size={12} color="$blue10" />
            <Text fontSize="$2" color="$blue10">
              {tag.name}
            </Text>
          </XStack>
        ))}
      </XStack>
    )
  }

  return (
    <Card
      elevate
      size="$4"
      bordered
      mb="$2"
      mx="$2"
    >
      <Card.Header padded>
        <XStack alignItems="center" justifyContent="space-between">
          <YStack f={1}>
            <XStack alignItems="center" gap="$3">
              {item.recipe?.imageUrl ? (
                <Image
                  source={{ uri: item.recipe.imageUrl }}
                  width={50}
                  height={50}
                  borderRadius="$2"
                />
              ) : (
                <YStack
                  width={50}
                  height={50}
                  backgroundColor="$gray5"
                  borderRadius="$2"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Text fontSize="$2" color="$gray10" textAlign="center">
                    No Recipe
                  </Text>
                </YStack>
              )}
              <YStack f={1}>
                <Paragraph fontWeight="600" size="$4">
                  {formatDate(item.date)}
                </Paragraph>
                <Paragraph theme="alt2" size="$3">
                  {item.recipe?.name || 'No recipe assigned'}
                </Paragraph>
                {renderTags()}
              </YStack>
            </XStack>
          </YStack>

          <Button
            size="$3"
            variant="outlined"
            icon={RefreshCw}
            onPress={() => onSwap(item)}
            circular
          />
        </XStack>
      </Card.Header>
    </Card>
  )
}

export default function MealPlanScreen() {
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  const [activeMealPlan, setActiveMealPlan] = useState(null)
  const [mealPlanItems, setMealPlanItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  // Helper function to get the start of the current week (Monday)
  const getCurrentWeekStart = () => {
    const today = new Date()
    const currentDay = today.getDay() // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay // If Sunday, go back 6 days to Monday
    const monday = new Date(today)
    monday.setDate(today.getDate() + mondayOffset)
    monday.setHours(0, 0, 0, 0)
    return monday
  }

  // Helper function to generate meal plan dates based on settings
  const generateMealPlanDates = (settings: UserSettings) => {
    const startDate = getCurrentWeekStart()
    const dates = []
    const daysToGenerate = settings.plannerDuration

    for (let i = 0; i < daysToGenerate; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      dates.push({
        date: date.toISOString().split('T')[0],
        dayOfWeek: date.toLocaleDateString('en-US', { weekday: 'long' })
      })
    }

    return dates
  }

  // Helper function to format date range for meal plan name
  const formatDateRange = (settings: UserSettings) => {
    const startDate = getCurrentWeekStart()
    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + settings.plannerDuration - 1)

    const formatOptions: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' }
    const startFormatted = startDate.toLocaleDateString('en-US', formatOptions)
    const endFormatted = endDate.toLocaleDateString('en-US', formatOptions)

    return `${startFormatted} - ${endFormatted}`
  }

  // Load user settings and meal plan data on component mount
  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    setIsLoading(true)
    try {
      // Fetch user settings first
      const settings = await settingsService.getSettings()
      setUserSettings(settings)

      // Generate meal plan data based on settings
      const planDates = generateMealPlanDates(settings)
      const planName = formatDateRange(settings)

      // Create meal plan with proper dates
      const updatedMealPlan = {
        id: 1,
        name: planName,
        startDate: planDates[0].date,
        endDate: planDates[planDates.length - 1].date,
        isActive: true
      }

      // Generate empty meal plan items with proper dates
      const updatedMealPlanItems = planDates.map((dateInfo, index) => ({
        id: index + 1,
        date: dateInfo.date,
        dayOfWeek: dateInfo.dayOfWeek,
        recipe: null, // No recipe assigned initially
        tags: [] // Empty tags array, can be populated from API later
      }))

      setActiveMealPlan(updatedMealPlan)
      setMealPlanItems(updatedMealPlanItems)

      console.log(`Loaded ${settings.plannerDuration}-day meal plan:`, planName)
    } catch (error) {
      console.error('Error loading user data:', error)
      Alert.alert('Error', 'Failed to load meal plan data')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwapRecipe = (item) => {
    // Logic to swap recipe for the day
    console.log('Swap recipe for:', item)
  }

  const handleGenerateNewPlan = async () => {
    // Logic to generate a new meal plan
    if (!userSettings) return

    const planType = userSettings.plannerDuration === 7 ? '7-day' : '14-day'
    Alert.alert(
      'Generate New Meal Plan',
      `This will create a new ${planType} meal plan. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: async () => {
            try {
              setIsLoading(true)
              // Generate new meal plan data
              const settings = await settingsService.getSettings()
              setUserSettings(settings)

              const planDates = generateMealPlanDates(settings)
              const planName = formatDateRange(settings)

              const updatedMealPlan = {
                id: 1,
                name: planName,
                startDate: planDates[0].date,
                endDate: planDates[planDates.length - 1].date,
                isActive: true
              }

              // Generate empty meal plan items with proper dates
              const updatedMealPlanItems = planDates.map((dateInfo, index) => ({
                id: index + 1,
                date: dateInfo.date,
                dayOfWeek: dateInfo.dayOfWeek,
                recipe: null, // No recipe assigned initially
                tags: [] // Empty tags array, can be populated from API later
              }))

              setActiveMealPlan(updatedMealPlan)
              setMealPlanItems(updatedMealPlanItems)

              Alert.alert('Success', `New ${planType} meal plan generated!`)
            } catch (error) {
              console.error('Error generating new meal plan:', error)
              Alert.alert('Error', 'Failed to generate new meal plan')
            } finally {
              setIsLoading(false)
            }
          }
        }
      ]
    )
  }

  // Memoized render function for better performance
  const renderDayItem = useCallback(({ item }) => (
    <DayItem
      item={item}
      onSwap={handleSwapRecipe}
    />
  ), [])

  return (
    <YStack f={1} backgroundColor="$background">
      <YStack p="$4" pb="$2">
        <H3>Meal Plan</H3>
      </YStack>

      {/* Meal Plan List */}
      {isLoading ? (
        <YStack p="$4">
          <Paragraph>Loading meal plan...</Paragraph>
        </YStack>
      ) : (
        <FlatList
          data={mealPlanItems}
          renderItem={renderDayItem}
          keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          removeClippedSubviews={true}
          maxToRenderPerBatch={5}
          windowSize={10}
          initialNumToRender={7}
        />
      )}

      {/* Floating Action Button */}
      <YStack position="absolute" bottom="$4" right="$4">
        <Button
          size="$5"
          circular
          icon={Plus}
          backgroundColor="$green10"
          color="white"
          elevate
          onPress={handleGenerateNewPlan}
          disabled={isLoading}
        />
      </YStack>
    </YStack>
  )
}
