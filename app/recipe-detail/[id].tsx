import { useState, useEffect } from 'react'
import { Alert, Linking } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { Stack } from 'expo-router'
import {
  YStack,
  XStack,
  Button,
  H3,
  H4,
  Paragraph,
  Image,
  ScrollView,
  Separator,
  Spinner,
  Card
} from 'tamagui'
import { ArrowLeft, Edit, ExternalLink, Tag as TagIcon } from '@tamagui/lucide-icons'
import { getRecipe } from '../../services/recipeService'

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams()
  const [recipe, setRecipe] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadRecipe()
  }, [id])

  const loadRecipe = async () => {
    try {
      setIsLoading(true)
      const recipeData = await getRecipe(Number(id))
      setRecipe(recipeData)
      console.log('Loaded recipe details:', recipeData)
    } catch (error) {
      console.error('Error loading recipe:', error)
      Alert.alert('Error', 'Failed to load recipe details. Please try again.')
      router.back()
    } finally {
      setIsLoading(false)
    }
  }

  const handleBack = () => {
    router.back()
  }

  const handleEdit = () => {
    router.push(`/edit-recipe/${id}`)
  }

  const handleOpenUrl = async () => {
    if (recipe?.url) {
      try {
        const supported = await Linking.canOpenURL(recipe.url)
        if (supported) {
          await Linking.openURL(recipe.url)
        } else {
          Alert.alert('Error', 'Cannot open this URL')
        }
      } catch (error) {
        console.error('Error opening URL:', error)
        Alert.alert('Error', 'Failed to open URL')
      }
    }
  }

  if (isLoading) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <YStack f={1} bg="$background" alignItems="center" justifyContent="center">
          <Spinner size="large" />
          <Paragraph mt="$2">Loading recipe...</Paragraph>
        </YStack>
      </>
    )
  }

  if (!recipe) {
    return (
      <>
        <Stack.Screen options={{ headerShown: false }} />
        <YStack f={1} bg="$background" alignItems="center" justifyContent="center">
          <Paragraph>Recipe not found</Paragraph>
          <Button mt="$3" onPress={handleBack}>
            Go Back
          </Button>
        </YStack>
      </>
    )
  }

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <YStack f={1} bg="$background">
        {/* Header */}
        <XStack p="$4" alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderBottomColor="$borderColor" bg="$background">
          <Button
            size="$3"
            variant="ghost"
            icon={ArrowLeft}
            onPress={handleBack}
          />
          <H3 flex={1} textAlign="center" numberOfLines={1}>
            {recipe.name}
          </H3>
          <Button
            size="$3"
            variant="ghost"
            icon={Edit}
            onPress={handleEdit}
          />
        </XStack>

        <ScrollView
          f={1}
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          <YStack p="$4" gap="$4">
            {/* Recipe Image */}
            {recipe.imageUrl && (
              <Card>
                <Image
                  source={{ uri: recipe.imageUrl }}
                  width="100%"
                  height={250}
                  borderRadius="$4"
                  resizeMode="cover"
                />
              </Card>
            )}

            {/* Recipe Title */}
            <YStack gap="$2">
              <H3>{recipe.name}</H3>

              {/* Tags */}
              {recipe.tags && recipe.tags.length > 0 && (
                <XStack gap="$2" flexWrap="wrap">
                  {recipe.tags.map((tag, index) => (
                    <XStack
                      key={index}
                      backgroundColor="$blue3"
                      paddingHorizontal="$3"
                      paddingVertical="$2"
                      borderRadius="$3"
                      alignItems="center"
                      gap="$2"
                    >
                      <TagIcon size={14} color="$blue10" />
                      <Paragraph fontSize="$3" color="$blue10">
                        {typeof tag === 'string' ? tag : tag.name}
                      </Paragraph>
                    </XStack>
                  ))}
                </XStack>
              )}
            </YStack>

            <Separator />

            {/* Recipe URL */}
            {recipe.url && (
              <YStack gap="$2">
                <H4>Recipe Link</H4>
                <Button
                  variant="outlined"
                  onPress={handleOpenUrl}
                  iconAfter={ExternalLink}
                  justifyContent="flex-start"
                >
                  <Paragraph flex={1} numberOfLines={1}>
                    {recipe.url}
                  </Paragraph>
                </Button>
              </YStack>
            )}

            {/* Description */}
            {recipe.description && (
              <YStack gap="$2">
                <H4>Description</H4>
                <Card p="$3" bg="$gray2">
                  <Paragraph lineHeight="$6">
                    {recipe.description}
                  </Paragraph>
                </Card>
              </YStack>
            )}

            {/* Recipe Details */}
            <YStack gap="$3">
              <H4>Recipe Details</H4>
              <Card p="$3" bg="$gray2">
                <YStack gap="$2">
                  <XStack justifyContent="space-between">
                    <Paragraph fontWeight="600">Created:</Paragraph>
                    <Paragraph>
                      {recipe.createdAt ? new Date(recipe.createdAt).toLocaleDateString() : 'Unknown'}
                    </Paragraph>
                  </XStack>
                  {recipe.updatedAt && recipe.updatedAt !== recipe.createdAt && (
                    <XStack justifyContent="space-between">
                      <Paragraph fontWeight="600">Last Updated:</Paragraph>
                      <Paragraph>
                        {new Date(recipe.updatedAt).toLocaleDateString()}
                      </Paragraph>
                    </XStack>
                  )}
                </YStack>
              </Card>
            </YStack>
          </YStack>
        </ScrollView>
      </YStack>
    </>
  )
}
