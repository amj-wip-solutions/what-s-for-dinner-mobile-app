import { useState, useEffect } from 'react'
import { Alert } from 'react-native'
import {
  YStack,
  XStack,
  H3,
  Paragraph,
  Button,
  Card,
  Image,
  ScrollView,
  Separator,
  Select,
  Adapt,
  Sheet
} from 'tamagui'
import { Calendar, RefreshCw, Plus, ChevronDown, Check } from '@tamagui/lucide-icons'

// Mock data for testing - replace with API calls later
const mockMealPlan = {
  id: 1,
  name: "October 6 - October 19",
  startDate: "2024-10-06",
  endDate: "2024-10-19",
  isActive: true
}

const mockMealPlanItems = [
  {
    id: 1,
    date: "2024-10-06",
    dayOfWeek: "Sunday",
    recipe: {
      id: 1,
      name: "Spaghetti Carbonara",
      imageUrl: null
    }
  },
  {
    id: 2,
    date: "2024-10-07",
    dayOfWeek: "Monday",
    recipe: {
      id: 2,
      name: "Chicken Stir Fry",
      imageUrl: null
    }
  },
  {
    id: 3,
    date: "2024-10-08",
    dayOfWeek: "Tuesday",
    recipe: {
      id: 3,
      name: "Beef Tacos",
      imageUrl: null
    }
  },
  // Add more days...
  ...Array.from({ length: 11 }, (_, i) => ({
    id: i + 4,
    date: new Date(2024, 9, 9 + i).toISOString().split('T')[0],
    dayOfWeek: ['Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][i],
    recipe: {
      id: (i % 3) + 1,
      name: ['Spaghetti Carbonara', 'Chicken Stir Fry', 'Beef Tacos'][i % 3],
      imageUrl: null
    }
  }))
]

const mockAvailablePlans = [
  { id: 1, name: "October 6 - October 19", isActive: true },
  { id: 2, name: "September 22 - October 5", isActive: false },
]

const DayItem = ({ item, onSwap }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <Card
      elevate
      size="$4"
      bordered
      animation="bouncy"
      hoverStyle={{ scale: 0.98 }}
      pressStyle={{ scale: 0.95 }}
      mb="$2"
      mx="$2"
    >
      <Card.Header padded>
        <XStack alignItems="center" justifyContent="space-between">
          <YStack f={1}>
            <XStack alignItems="center" gap="$3">
              {item.recipe.imageUrl ? (
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
                  <Calendar size={20} color="$gray10" />
                </YStack>
              )}
              <YStack f={1}>
                <Paragraph fontWeight="600" size="$4">
                  {formatDate(item.date)}
                </Paragraph>
                <Paragraph theme="alt2" size="$3">
                  {item.recipe.name}
                </Paragraph>
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
  const [activeMealPlan, setActiveMealPlan] = useState(mockMealPlan)
  const [mealPlanItems, setMealPlanItems] = useState(mockMealPlanItems)
  const [availablePlans, setAvailablePlans] = useState(mockAvailablePlans)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlanId, setSelectedPlanId] = useState(mockMealPlan.id)

  // Load meal plan data on component mount
  useEffect(() => {
    loadMealPlan()
  }, [])

  const loadMealPlan = async () => {
    setIsLoading(true)
    try {
      // TODO: Replace with actual API calls
      console.log('Loading active meal plan...')

      // Simulate API calls:
      // const mealPlanResponse = await fetch('/api/meal-plans?isActive=true')
      // const mealPlan = await mealPlanResponse.json()
      //
      // const itemsResponse = await fetch(`/api/meal-plan-items?mealPlanId=${mealPlan.id}`)
      // const items = await itemsResponse.json()

      // For now, using mock data
      await new Promise(resolve => setTimeout(resolve, 500))

    } catch (error) {
      console.error('Error loading meal plan:', error)
      Alert.alert('Error', 'Failed to load meal plan')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSwapRecipe = (dayItem) => {
    // TODO: Open "Select a Recipe" modal
    Alert.alert(
      'Swap Recipe',
      `Would you like to change the recipe for ${dayItem.dayOfWeek}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Select Recipe',
          onPress: () => {
            console.log('Opening recipe selection modal for:', dayItem)
            // This would open a modal with recipe selection
          }
        }
      ]
    )
  }

  const handleGenerateNewPlan = () => {
    Alert.alert(
      'Generate New Plan',
      'This will create a new 14-day meal plan. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Generate',
          onPress: async () => {
            setIsLoading(true)
            try {
              // TODO: API call to generate new plan
              console.log('Generating new meal plan...')
              // const response = await fetch('/api/meal-plans', { method: 'POST' })

              await new Promise(resolve => setTimeout(resolve, 2000))
              Alert.alert('Success', 'New meal plan generated!')
              loadMealPlan() // Refresh the view
            } catch (error) {
              console.error('Error generating plan:', error)
              Alert.alert('Error', 'Failed to generate new plan')
            } finally {
              setIsLoading(false)
            }
          }
        }
      ]
    )
  }

  const handlePlanChange = (planId) => {
    setSelectedPlanId(planId)
    const selectedPlan = availablePlans.find(p => p.id === planId)
    if (selectedPlan) {
      setActiveMealPlan(selectedPlan)
      // TODO: Load meal plan items for selected plan
      console.log('Switching to plan:', selectedPlan.name)
    }
  }

  return (
    <YStack f={1} bg="$background">
      {/* Header with Meal Plan Name and Plan Selector */}
      <YStack p="$4" gap="$3">
        <XStack alignItems="center" justifyContent="space-between">
          <H3 f={1}>Meal Plan</H3>
        </XStack>

        <Select
          value={selectedPlanId.toString()}
          onValueChange={(value) => handlePlanChange(parseInt(value))}
          disablePreventBodyScroll
        >
          <Select.Trigger width="100%" iconAfter={ChevronDown}>
            <Select.Value placeholder="Select meal plan" />
          </Select.Trigger>

          <Adapt when="sm" platform="touch">
            <Sheet
              modal
              dismissOnSnapToBottom
              snapPointsMode="fit"
            >
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

            <Select.Viewport minHeight={200}>
              <Select.Group>
                <Select.Label>Available Plans</Select.Label>
                {availablePlans.map((plan, i) => (
                  <Select.Item
                    index={i}
                    key={plan.id}
                    value={plan.id.toString()}
                  >
                    <Select.ItemText>{plan.name}</Select.ItemText>
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
      </YStack>

      <Separator />

      {/* 14-Day List */}
      <ScrollView f={1} p="$2">
        <YStack gap="$2">
          {isLoading ? (
            <YStack p="$4" alignItems="center">
              <Paragraph>Loading meal plan...</Paragraph>
            </YStack>
          ) : (
            mealPlanItems.map(item => (
              <DayItem
                key={item.id}
                item={item}
                onSwap={handleSwapRecipe}
              />
            ))
          )}
        </YStack>
      </ScrollView>

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
