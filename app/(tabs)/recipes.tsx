import { useState, useEffect, useMemo } from 'react'
import { FlatList, Dimensions } from 'react-native'
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
  Text,
  H6
} from 'tamagui'
import { Search, Filter, Plus, Edit, Tag as TagIcon, Grid3x3, List, LayoutGrid } from '@tamagui/lucide-icons'
import { getRecipes } from '../../services/recipeService'
import { tagService } from '../../services/tagService'

const { width: screenWidth } = Dimensions.get('window')

// Optimized Image component with lazy loading
const OptimizedImage = ({ source, width, height, borderRadius, ...props }) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  if (imageError || !source?.uri) {
    return (
      <YStack
        width={width}
        height={height}
        backgroundColor="$gray4"
        borderRadius={borderRadius}
        alignItems="center"
        justifyContent="center"
        {...props}
      >
        <Text fontSize="$2" color="$gray10" textAlign="center">
          No Image
        </Text>
      </YStack>
    )
  }

  return (
    <YStack width={width} height={height} {...props}>
      <Image
        source={source}
        width={width}
        height={height}
        borderRadius={borderRadius}
        onLoad={() => setImageLoaded(true)}
        onError={() => setImageError(true)}
        opacity={imageLoaded ? 1 : 0.5}
        backgroundColor="$gray4"
      />
    </YStack>
  )
}

// Grid Recipe Card
const GridRecipeCard = ({ recipe, onPress, onEdit, tags }) => (
  <Card
    width={(screenWidth - 48) / 2} // 2 columns with padding
    elevate
    size="$4"
    bordered
    animation="bouncy"
    hoverStyle={{ scale: 0.98 }}
    pressStyle={{ scale: 0.95 }}
    onPress={() => onPress(recipe)}
    mb="$3"
  >
    <Card.Header padded p="$3">
      <OptimizedImage
        source={recipe.imageUrl ? { uri: recipe.imageUrl } : null}
        width="100%"
        height={100}
        borderRadius="$2"
        mb="$2"
      />

      <XStack alignItems="flex-start" justifyContent="space-between" mb="$2">
        <H6 flex={1} numberOfLines={2} fontSize="$3">
          {recipe.name}
        </H6>
        <Button
          size="$2"
          variant="outlined"
          icon={Edit}
          onPress={(e) => {
            e.stopPropagation()
            onEdit(recipe)
          }}
          circular
          backgroundColor="$gray2"
          borderColor="$gray6"
          color="$gray11"
          ml="$1"
        />
      </XStack>

      {recipe.description && (
        <Paragraph theme="alt2" size="$2" numberOfLines={2} mb="$2">
          {recipe.description}
        </Paragraph>
      )}

      {/* Display Tags */}
      {recipe.tagIds && recipe.tagIds.length > 0 && (
        <XStack gap="$1" mt="$2" flexWrap="wrap">
          {recipe.tagIds.slice(0, 2).map((tagId) => {
            const tag = tags.find(t => t.id === tagId)
            if (!tag) return null
            return (
              <XStack
                key={tagId}
                backgroundColor="$blue3"
                paddingHorizontal="$1.5"
                paddingVertical="$0.5"
                borderRadius="$1"
                alignItems="center"
                gap="$0.5"
              >
                <TagIcon size={10} color="$blue10" />
                <Text fontSize="$1" color="$blue10">
                  {tag.name}
                </Text>
              </XStack>
            )
          })}
          {recipe.tagIds.length > 2 && (
            <Text fontSize="$1" color="$gray10">
              +{recipe.tagIds.length - 2}
            </Text>
          )}
        </XStack>
      )}
    </Card.Header>
  </Card>
)

// List Recipe Card (inline with small image)
const ListRecipeCard = ({ recipe, onPress, onEdit, tags }) => (
  <Card
    elevate
    size="$4"
    bordered
    animation="bouncy"
    hoverStyle={{ scale: 0.98 }}
    pressStyle={{ scale: 0.95 }}
    onPress={() => onPress(recipe)}
    mb="$2"
    mx="$2"
  >
    <Card.Header padded p="$3">
      <XStack alignItems="center" gap="$3">
        <OptimizedImage
          source={recipe.imageUrl ? { uri: recipe.imageUrl } : null}
          width={60}
          height={60}
          borderRadius="$2"
        />

        <YStack f={1} gap="$1">
          <XStack alignItems="flex-start" justifyContent="space-between">
            <H4 flex={1} fontSize="$4" numberOfLines={1}>
              {recipe.name}
            </H4>
            <Button
              size="$2"
              variant="outlined"
              icon={Edit}
              onPress={(e) => {
                e.stopPropagation()
                onEdit(recipe)
              }}
              circular
              backgroundColor="$gray2"
              borderColor="$gray6"
              color="$gray11"
            />
          </XStack>

          {recipe.description && (
            <Paragraph theme="alt2" size="$3" numberOfLines={1} mb="$1">
              {recipe.description}
            </Paragraph>
          )}

          {/* Display Tags */}
          {recipe.tagIds && recipe.tagIds.length > 0 && (
            <XStack gap="$2" flexWrap="wrap">
              {recipe.tagIds.slice(0, 3).map((tagId) => {
                const tag = tags.find(t => t.id === tagId)
                if (!tag) return null
                return (
                  <XStack
                    key={tagId}
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
                )
              })}
              {recipe.tagIds.length > 3 && (
                <Text fontSize="$2" color="$gray10">
                  +{recipe.tagIds.length - 3}
                </Text>
              )}
            </XStack>
          )}
        </YStack>
      </XStack>
    </Card.Header>
  </Card>
)

export default function RecipesScreen() {
  const [recipes, setRecipes] = useState([])
  const [tags, setTags] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState([])
  const [showFilterModal, setShowFilterModal] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'

  // Load recipes and tags on component mount and when screen comes into focus
  useEffect(() => {
    console.log('RecipesScreen: useEffect triggered')
    loadData()
  }, [])

  // Also refresh when screen comes into focus (e.g., after adding a recipe)
  useFocusEffect(
    useCallback(() => {
      console.log('RecipesScreen: Focus effect triggered')
      loadData()
    }, [])
  )

  const loadData = async () => {
    console.log('RecipesScreen: Starting loadData...')
    setIsLoading(true)
    try {
      // Load recipes and tags in parallel
      const [recipesData, tagsData] = await Promise.all([
        getRecipes(),
        tagService.getAll()
      ])

      console.log('API response received:', recipesData?.length || 0, 'recipes', tagsData?.length || 0, 'tags')
      setRecipes(recipesData || [])
      setTags(tagsData || [])
    } catch (error) {
      console.error('Error loading data:', error)
      console.error('Error details:', error.message, error.response?.data)
      // Fall back to empty arrays on error
      setRecipes([])
      setTags([])
    } finally {
      setIsLoading(false)
      console.log('RecipesScreen: loadData completed')
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

  const toggleViewMode = () => {
    setViewMode(prev => prev === 'grid' ? 'list' : 'grid')
  }

  // Memoized filtered recipes for performance
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe =>
      recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  }, [recipes, searchQuery])

  // Render item for FlatList (more performant than ScrollView)
  const renderRecipeItem = useCallback(({ item }) => {
    if (viewMode === 'grid') {
      return (
        <GridRecipeCard
          recipe={item}
          onPress={handleRecipePress}
          onEdit={handleEditRecipe}
          tags={tags}
        />
      )
    } else {
      return (
        <ListRecipeCard
          recipe={item}
          onPress={handleRecipePress}
          onEdit={handleEditRecipe}
          tags={tags}
        />
      )
    }
  }, [viewMode, tags])

  const keyExtractor = useCallback((item) => item.id.toString(), [])

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
            icon={viewMode === 'grid' ? List : LayoutGrid}
            onPress={toggleViewMode}
          />
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
      {isLoading ? (
        <YStack f={1} alignItems="center" justifyContent="center">
          <Paragraph>Loading recipes...</Paragraph>
        </YStack>
      ) : filteredRecipes.length > 0 ? (
        <FlatList
          data={filteredRecipes}
          renderItem={renderRecipeItem}
          keyExtractor={keyExtractor}
          numColumns={viewMode === 'grid' ? 2 : 1}
          key={viewMode} // Force re-render when view mode changes
          contentContainerStyle={{
            padding: viewMode === 'grid' ? 16 : 8,
            paddingBottom: 100
          }}
          columnWrapperStyle={viewMode === 'grid' ? { justifyContent: 'space-between' } : undefined}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          windowSize={10}
          initialNumToRender={8}
          getItemLayout={viewMode === 'list' ? (data, index) => ({
            length: 120, // Approximate height of list item
            offset: 120 * index,
            index,
          }) : undefined}
        />
      ) : (
        <YStack f={1} alignItems="center" justifyContent="center" p="$4">
          <Paragraph theme="alt2" textAlign="center">
            {searchQuery ? 'No recipes found' : 'No recipes yet. Add your first recipe!'}
          </Paragraph>
        </YStack>
      )}

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
