import { useState, useEffect } from 'react'
import { FlatList } from 'react-native'
import { Link } from 'expo-router'
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
  Separator
} from 'tamagui'
import { Search, Filter, Plus } from '@tamagui/lucide-icons'
import { getRecipes } from '../../services/recipeService'

const RecipeCard = ({ recipe, onPress }) => (
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
      <H4>{recipe.name}</H4>
      {recipe.description && (
        <Paragraph theme="alt2" size="$3">
          {recipe.description}
        </Paragraph>
      )}
      <XStack gap="$2" mt="$2" flexWrap="wrap">
        {recipe.tags?.map((tag, index) => (
          <Button
            key={index}
            size="$2"
            variant="outlined"
            chromeless
            disabled
          >
            {tag}
          </Button>
        ))}
      </XStack>
    </Card.Header>
  </Card>
)

export default function RecipesScreen() {
  const [recipes, setRecipes] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Load recipes on component mount
  useEffect(() => {
    loadRecipes()
  }, [])

  const loadRecipes = async () => {
    setIsLoading(true)
    try {
      console.log('Loading recipes from API...')
      const recipesData = await getRecipes()
      setRecipes(recipesData)
      console.log('Loaded recipes:', recipesData)
    } catch (error) {
      console.error('Error loading recipes:', error)
      // Fall back to empty array on error
      setRecipes([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleRecipePress = (recipe) => {
    // Navigate to recipe detail view
    console.log('Recipe pressed:', recipe.name)
  }

  const handleAddRecipe = () => {
    // Navigate to add recipe screen
    console.log('Add recipe pressed')
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
