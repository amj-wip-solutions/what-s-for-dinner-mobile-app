import { useState, useEffect } from 'react'
import { FlatList } from 'react-native'
import { Link, useFocusEffect, router } from 'expo-router'
import { useCallback } from 'react'
import {
  YStack,
  XStack,
  Input,
  Button,
  Card,
  H4,
  Paragraph,
  Image,
  ScrollView,
  Separator,
  Text
} from 'tamagui'
import { Search, Filter, Plus, Edit, Tag as TagIcon } from '@tamagui/lucide-icons'
import { getRecipes } from '../../services/recipeService'

const RecipeCard = ({ recipe, onPress, onEdit }) => (
  <Card
    elevate
    size="$4"
    bordered
    animation="bouncy"
    hoverStyle={{ scale: 0.98 }}
    pressStyle={{ scale: 0.95 }}
    onPress={() => onPress(recipe)}
    mb="$3"
    mx="$2"
  >
    <Card.Header padded>
      {recipe.imageUrl && (
        <Image
          source={{ uri: recipe.imageUrl }}
          width="100%"
          height={120}
          borderRadius="$2"
          mb="$2"
        />
      )}

      <XStack alignItems="center" justifyContent="space-between" mb="$2">
        <H4 flex={1}>{recipe.name}</H4>
        <Button
          size="$2"
          variant="ghost"
          icon={Edit}
          onPress={(e) => {
            e.stopPropagation()
            onEdit(recipe)
          }}
          circular
        />
      </XStack>

      {recipe.description && (
        <Paragraph theme="alt2" size="$3" mb="$2">
          {recipe.description}
        </Paragraph>
      )}

      {/* Display Tags */}
      {recipe.tags && recipe.tags.length > 0 && (
        <XStack gap="$2" mt="$2" flexWrap="wrap">
          {recipe.tags.map((tag, index) => (
            <XStack
              key={index}
              backgroundColor="$blue3"
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
              alignItems="center"
              gap="$1"
            >
              <TagIcon size={12} color="$blue10" />
              <Text fontSize="$2" color="$blue10">
                {typeof tag === 'string' ? tag : tag.name}
              </Text>
            </XStack>
          ))}
        </XStack>
      )}
    </Card.Header>
  </Card>
)

export default function RecipesScreen() {
  const [recipes, setRecipes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load recipes on component mount and when screen comes into focus
  useEffect(() => {
    console.log('RecipesScreen: useEffect triggered')
    loadRecipes()
  }, [])

  // Also refresh when screen comes into focus (e.g., after adding a recipe)
  useFocusEffect(
    useCallback(() => {
      console.log('RecipesScreen: Focus effect triggered')
      loadRecipes()
    }, [])
  )

  const loadRecipes = async () => {
    console.log('RecipesScreen: Starting loadRecipes...')
    setIsLoading(true)
    try {
      console.log('Loading recipes from API...')
      const recipesData = await getRecipes()
      console.log('API response received:', recipesData)
      setRecipes(recipesData || [])
      console.log('Recipes state updated:', recipesData?.length || 0, 'recipes')
    } catch (error) {
      console.error('Error loading recipes:', error)
      console.error('Error details:', error.message, error.response?.data)
      // Fall back to empty array on error
      setRecipes([])
    } finally {
      setIsLoading(false)
      console.log('RecipesScreen: loadRecipes completed')
    }
  }

  const handleRecipePress = (recipe) => {
    // Navigate to recipe detail view
    console.log('Recipe pressed:', recipe.name)
    router.push(`/recipe-detail/${recipe.id}`)
  }

  const handleAddRecipe = () => {
    // Navigate to add recipe screen
    console.log('Add recipe pressed')
  }

  const handleEditRecipe = (recipe) => {
    // Navigate to edit recipe screen
    console.log('Edit recipe pressed:', recipe.name)
    router.push(`/edit-recipe/${recipe.id}`)
  }

  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <YStack f={1} bg="$background">
      {/* Search and Filter Header */}
      <YStack p="$4" gap="$3">
        <XStack gap="$3" alignItems="center">
          <YStack f={1}>
            <Input
              placeholder="Search recipes..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              size="$4"
            />
          </YStack>
          <Button
            size="$4"
            variant="outlined"
            icon={Filter}
            onPress={() => setShowFilterModal(true)}
          >
            Filter
          </Button>
        </XStack>
      </YStack>

      <Separator />

      {/* Recipe List */}
      <ScrollView f={1} p="$2">
        <YStack gap="$2">
          {isLoading ? (
            <YStack p="$4" alignItems="center">
              <Paragraph>Loading recipes...</Paragraph>
            </YStack>
          ) : filteredRecipes.length > 0 ? (
            filteredRecipes.map(recipe => (
              <RecipeCard
                key={recipe.id}
                recipe={recipe}
                onPress={handleRecipePress}
                onEdit={handleEditRecipe}
              />
            ))
          ) : (
            <YStack p="$4" alignItems="center">
              <Paragraph theme="alt2">
                {searchQuery ? 'No recipes found' : 'No recipes yet. Add your first recipe!'}
              </Paragraph>
            </YStack>
          )}
        </YStack>
      </ScrollView>

      {/* Floating Action Button */}
      <YStack position="absolute" bottom="$12" right="$4">
        <Link href="/add-recipe" asChild>
          <Button
            size="$5"
            circular
            icon={Plus}
            backgroundColor="$blue10"
            color="white"
            elevate
            onPress={handleAddRecipe}
          />
        </Link>
      </YStack>
    </YStack>
  )
}
