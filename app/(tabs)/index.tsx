import { useState, useEffect, useCallback } from 'react'
import { Alert, FlatList } from 'react-native'
import { YStack, XStack, Paragraph, Button } from 'tamagui'
import { RotateCcw } from '@tamagui/lucide-icons'
import { settingsService, UserSettings } from '../../services/settingsService'
import { getRecipes } from '../../services/recipeService'
import { getMealPlans, getMealPlanItems, autoSetupMealPlan, MealPlan } from '../../services/mealPlanService'
import { transformMealPlanItems, transformAutoSetupItems, TransformedMealPlanItem } from '../../services/mealPlanTransformers'
import { filterRecipesByDayTags, formatMealPlanDateRange } from '../../utils/mealPlanUtils'
import { ScreenLayout } from '../../components/ScreenLayout'
import { DayItem } from '../../components/MealPlan'

export default function MealPlanScreen() {
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  const [activeMealPlan, setActiveMealPlan] = useState<MealPlan | null>(null)
  const [mealPlanItems, setMealPlanItems] = useState<TransformedMealPlanItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [swappingItemId, setSwappingItemId] = useState<number | null>(null)
  const [dateRangeText, setDateRangeText] = useState<string>('')

  // Load user settings and meal plan data on component mount
  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    setIsLoading(true)
    try {
      console.log('🔄 Loading user data on app startup...')

      // Fetch user settings first
      const settings = await settingsService.getSettings()
      setUserSettings(settings)
      console.log('Settings loaded:', settings)

      // Check if there's an active meal plan in the database
      const mealPlans = await getMealPlans()
      const activePlan = mealPlans.find(plan => plan.isActive)

      if (activePlan) {
        console.log('Found active meal plan:', activePlan)

        // Use the saved meal plan's date range
        setDateRangeText(formatMealPlanDateRange(activePlan.startDate, activePlan.endDate))

        // Fetch the meal plan items from the database
        const items = await getMealPlanItems(activePlan.id)
        console.log('Loaded meal plan items from database:', items)

        // Transform the items to match our UI format
        const transformedItems = await transformMealPlanItems(items)

        setActiveMealPlan(activePlan)
        setMealPlanItems(transformedItems)
        console.log(`✅ Loaded existing ${items.length}-day meal plan from database`)
      } else {
        console.log('No active meal plan found, creating new one...')

        // No active plan, create a new one using auto-setup
        const autoSetup = await autoSetupMealPlan()
        console.log('Auto-setup response:', autoSetup)

        setDateRangeText(formatMealPlanDateRange(autoSetup.mealPlan.startDate, autoSetup.mealPlan.endDate))

        // Transform auto-setup items to UI format
        const transformedItems = await transformAutoSetupItems(autoSetup.items)

        setActiveMealPlan(autoSetup.mealPlan)
        setMealPlanItems(transformedItems)
        console.log(`✅ Created new ${autoSetup.items.length}-day meal plan via auto-setup`)
      }
    } catch (error) {
      console.error('❌ Error loading user data:', error)
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

  const handleGenerateNewPlan = async () => {
    if (!userSettings) return

    const planType = userSettings.plannerDuration === 7 ? '7-day' : '14-day'
    Alert.alert(
      'Refresh Meal Plan',
      `This will refresh your ${planType} meal plan with automatic recipe assignments based on your current settings and day rules. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Refresh',
          onPress: async () => {
            try {
              setIsLoading(true)
              console.log('\n🚀 Starting meal plan refresh...')

              // Use the backend's auto-setup to create the meal plan
              const autoSetup = await autoSetupMealPlan()
              console.log('Auto-setup response:', autoSetup)

              setDateRangeText(formatMealPlanDateRange(autoSetup.mealPlan.startDate, autoSetup.mealPlan.endDate))

              // Transform auto-setup items to UI format
              const transformedItems = await transformAutoSetupItems(autoSetup.items)

              setActiveMealPlan(autoSetup.mealPlan)
              setMealPlanItems(transformedItems)

              const assignedCount = transformedItems.filter(item => item.recipe !== null).length
              Alert.alert('Success', `Meal plan refreshed with smart recipe assignments! (${assignedCount}/${transformedItems.length} days assigned)`)

              console.log(`✅ Refreshed ${transformedItems.length}-day meal plan`)
            } catch (error) {
              console.error('Error refreshing meal plan:', error)
              Alert.alert('Error', 'Failed to refresh meal plan')
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
    <ScreenLayout title="Meal Plan" subtitle={dateRangeText}>
      {/* Meal Plan List */}
      {isLoading ? (
        <YStack p="$4">
          <Paragraph>Loading meal plan...</Paragraph>
        </YStack>
      ) : (
        <YStack flex={1}>
          <FlatList
            data={mealPlanItems}
            renderItem={renderDayItem}
            keyExtractor={item => item.id.toString()}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
            removeClippedSubviews={true}
            maxToRenderPerBatch={5}
            windowSize={10}
            initialNumToRender={7}
          />

          {/* Refresh Button at Bottom */}
          <XStack p="$4" pb="$6" backgroundColor="$background">
            <Button
              flex={1}
              size="$2"
              icon={RotateCcw}
              backgroundColor="$blue10"
              color="white"
              onPress={handleGenerateNewPlan}
              disabled={isLoading}
              fontWeight="600"
            >
              Refresh Meal Plan
            </Button>
          </XStack>
        </YStack>
      )}
    </ScreenLayout>
  )
}
