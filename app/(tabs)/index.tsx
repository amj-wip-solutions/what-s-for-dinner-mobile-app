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
  Text,
  Spinner
} from 'tamagui'
import { RefreshCw, Plus, Tag as TagIcon, RotateCcw } from '@tamagui/lucide-icons'
import { settingsService, UserSettings } from '../../services/settingsService'
import { tagService, Tag } from '../../services/tagService'
import { getRecipes } from '../../services/recipeService'
import { dayRuleService } from '../../services/dayRuleService'

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
  const [swappingItemId, setSwappingItemId] = useState<number | null>(null)

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
      let updatedMealPlanItems = planDates.map((dateInfo, index) => ({
        id: index + 1,
        date: dateInfo.date,
        dayOfWeek: dateInfo.dayOfWeek,
        recipe: null, // No recipe assigned initially
        tags: [] // Empty tags array, will be populated with day rules
      }))

      // Load day rules and associate tags with meal plan items
      updatedMealPlanItems = await loadDayRulesAndTags(updatedMealPlanItems)

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

  const handleSwapRecipe = async (item) => {
    setSwappingItemId(item.id)

    try {
      // Fetch all available recipes
      const allRecipes = await getRecipes()

      if (allRecipes.length === 0) {
        Alert.alert('No Recipes', 'Please add some recipes first to use this feature.')
        setSwappingItemId(null)
        return
      }

      // Filter recipes based on day rules and recipe tags
      const compatibleRecipes = filterRecipesByDayTags(allRecipes, item)

      if (compatibleRecipes.length === 0) {
        const dayTagNames = item.tags?.map(tag => tag.name).join(', ') || 'no tags'
        Alert.alert(
          'No Compatible Recipes',
          `No recipes found that match this day's requirements (${dayTagNames}). Try adding more recipes or adjusting your day rules.`
        )
        setSwappingItemId(null)
        return
      }

      // Filter out the current recipe to avoid assigning the same one
      const availableRecipes = compatibleRecipes.filter(recipe =>
        recipe.id !== item.recipe?.id
      )

      // If all compatible recipes are the same or only one recipe exists, use all compatible recipes
      const recipesToChooseFrom = availableRecipes.length > 0 ? availableRecipes : compatibleRecipes

      // Select a random recipe from compatible ones
      const randomRecipe = recipesToChooseFrom[Math.floor(Math.random() * recipesToChooseFrom.length)]

      // Update the meal plan item with the new recipe
      setMealPlanItems((prevItems) =>
        prevItems.map((mealItem) => {
          if (mealItem.id === item.id) {
            return {
              ...mealItem,
              recipe: randomRecipe
            }
          }
          return mealItem
        })
      )

      console.log(`Swapped recipe for ${item.dayOfWeek} to: ${randomRecipe.name}`)
      console.log(`Day tags: ${item.tags?.map(t => t.name).join(', ') || 'none'}`)
      console.log(`Recipe tags: ${randomRecipe.tagIds?.length || 0} tags`)

    } catch (error) {
      console.error('Error swapping recipe:', error)
      Alert.alert('Error', 'Failed to load recipes. Please try again.')
    } finally {
      // Reset swapping state after a short delay
      setTimeout(() => {
        setSwappingItemId(null)
      }, 300)
    }
  }

  // Helper function to filter recipes based on day rules and recipe tags
  const filterRecipesByDayTags = (allRecipes, dayItem) => {
    const dayTags = dayItem.tags || []
    const dayTagIds = dayTags.map(tag => tag.id)

    return allRecipes.filter(recipe => {
      const recipeTagIds = recipe.tagIds || []

      // Rule 1: If day has tag rules, only recipes with matching tags
      if (dayTagIds.length > 0) {
        // Recipe must have at least one matching tag
        const hasMatchingTag = recipeTagIds.some(recipeTagId =>
          dayTagIds.includes(recipeTagId)
        )
        return hasMatchingTag
      }

      // Rule 2: If day has no tag rules, accept any recipe
      if (dayTagIds.length === 0) {
        return true
      }

      return false
    })
  }

  const handleGenerateNewPlan = async () => {
    // Logic to generate a new meal plan
    if (!userSettings) return

    const planType = userSettings.plannerDuration === 7 ? '7-day' : '14-day'
    Alert.alert(
      'Generate New Meal Plan',
      `This will create a new ${planType} meal plan with automatic recipe assignments based on your day rules. Continue?`,
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

              // Generate meal plan items with proper dates and day rules
              let updatedMealPlanItems = planDates.map((dateInfo, index) => ({
                id: index + 1,
                date: dateInfo.date,
                dayOfWeek: dateInfo.dayOfWeek,
                recipe: null, // No recipe assigned initially
                tags: [] // Empty tags array, will be populated with day rules
              }))

              // Load day rules and associate tags with meal plan items
              updatedMealPlanItems = await loadDayRulesAndTags(updatedMealPlanItems)

              // Auto-assign compatible recipes to each day
              updatedMealPlanItems = await autoAssignRecipes(updatedMealPlanItems)

              setActiveMealPlan(updatedMealPlan)
              setMealPlanItems(updatedMealPlanItems)

              Alert.alert('Success', `New ${planType} meal plan generated with smart recipe assignments!`)
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

  // Helper function to automatically assign compatible recipes to meal plan days
  const autoAssignRecipes = async (mealPlanItems: any[]) => {
    try {
      // Fetch all available recipes
      const allRecipes = await getRecipes()

      if (allRecipes.length === 0) {
        console.log('No recipes available for auto-assignment')
        return mealPlanItems
      }

      const itemsWithRecipes = mealPlanItems.map(item => {
        // Find compatible recipes for this day
        const compatibleRecipes = filterRecipesByDayTags(allRecipes, item)

        if (compatibleRecipes.length > 0) {
          // Randomly select a compatible recipe
          const randomRecipe = compatibleRecipes[Math.floor(Math.random() * compatibleRecipes.length)]

          console.log(`Auto-assigned "${randomRecipe.name}" to ${item.dayOfWeek}`)
          console.log(`Day tags: ${item.tags?.map(t => t.name).join(', ') || 'none'}`)

          return {
            ...item,
            recipe: randomRecipe
          }
        } else {
          const dayTagNames = item.tags?.map(tag => tag.name).join(', ') || 'no tags'
          console.log(`No compatible recipes found for ${item.dayOfWeek} (requires: ${dayTagNames})`)

          return item // Keep without recipe assignment
        }
      })

      return itemsWithRecipes
    } catch (error) {
      console.error('Error auto-assigning recipes:', error)
      return mealPlanItems // Return original items if there's an error
    }
  }

  const handleRecreateMealPlan = async () => {
    Alert.alert(
      'Recreate Meal Planner',
      'This will recreate your meal planner with the latest settings and day rules, and automatically assign compatible recipes. Any existing recipes will be cleared. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Recreate',
          onPress: async () => {
            try {
              setIsLoading(true)

              // Fetch the latest user settings to ensure we have the most recent configuration
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
              let updatedMealPlanItems = planDates.map((dateInfo, index) => ({
                id: index + 1,
                date: dateInfo.date,
                dayOfWeek: dateInfo.dayOfWeek,
                recipe: null, // No recipe assigned initially
                tags: [] // Empty tags array, will be populated with day rules
              }))

              // Load day rules and associate tags with meal plan items
              updatedMealPlanItems = await loadDayRulesAndTags(updatedMealPlanItems)

              // Auto-assign compatible recipes to each day
              updatedMealPlanItems = await autoAssignRecipes(updatedMealPlanItems)

              setActiveMealPlan(updatedMealPlan)
              setMealPlanItems(updatedMealPlanItems)

              const planType = settings.plannerDuration === 7 ? '7-day' : '14-day'
              Alert.alert('Success', `Meal planner recreated with latest ${planType} settings, day rules, and smart recipe assignments!`)

              console.log(`Recreated ${settings.plannerDuration}-day meal plan with latest settings:`, planName)
            } catch (error) {
              console.error('Error recreating meal plan:', error)
              Alert.alert('Error', 'Failed to recreate meal planner. Please try again.')
            } finally {
              setIsLoading(false)
            }
          }
        }
      ]
    )
  }

  // Helper function to get day of week number from date string
  const getDayOfWeekNumber = (dateString: string) => {
    const date = new Date(dateString)
    const dayOfWeek = date.getDay() // 0 = Sunday, 1 = Monday, etc.
    return dayOfWeek === 0 ? 7 : dayOfWeek // Convert Sunday from 0 to 7
  }

  // Load day rules and associate tags with meal plan items
  const loadDayRulesAndTags = async (mealPlanItems: any[]) => {
    try {
      const [dayRules, allTags] = await Promise.all([
        dayRuleService.getAll(),
        tagService.getAll()
      ])

      // Map meal plan items to include their associated tags based on day rules
      const itemsWithTags = mealPlanItems.map(item => {
        const dayOfWeekNumber = getDayOfWeekNumber(item.date)

        // Find if there's a day rule for this day of the week
        const dayRule = dayRules.find(rule => rule.dayOfWeek === dayOfWeekNumber)

        // If there's a rule, find the associated tag
        const associatedTags = []
        if (dayRule) {
          const tag = allTags.find(tag => tag.id === dayRule.tagId)
          if (tag) {
            associatedTags.push(tag)
          }
        }

        return {
          ...item,
          tags: associatedTags
        }
      })

      return itemsWithTags
    } catch (error) {
      console.error('Error loading day rules and tags:', error)
      return mealPlanItems // Return original items if there's an error
    }
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

      {/* Floating Action Buttons */}
      <YStack position="absolute" bottom="$4" right="$4" gap="$3">
        {/* Recreate Meal Planner Button */}
        <Button
          size="$4"
          circular
          icon={RotateCcw}
          backgroundColor="$blue10"
          color="white"
          elevate
          onPress={handleRecreateMealPlan}
          disabled={isLoading}
        />

        {/* Generate New Plan Button */}
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
