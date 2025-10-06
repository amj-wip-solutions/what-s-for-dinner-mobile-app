import { useState } from 'react'
import { Alert } from 'react-native'
import { router } from 'expo-router'
import {
  YStack,
  XStack,
  Input,
  Button,
  H3,
  Label,
  TextArea,
  ScrollView,
  Separator
} from 'tamagui'
import { Save, X } from '@tamagui/lucide-icons'
import { createRecipe } from '../services/recipeService'

export default function AddRecipeScreen() {
  const [recipe, setRecipe] = useState({
    name: '',
    url: '',
    imageUrl: '',
    description: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    if (!recipe.name.trim()) {
      Alert.alert('Error', 'Recipe name is required')
      return
    }

    setIsLoading(true)

    try {
      console.log('Saving recipe:', recipe)

      // Use the actual API service
      const savedRecipe = await createRecipe(recipe)
      console.log('Recipe saved successfully:', savedRecipe)

      Alert.alert('Success', 'Recipe saved successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ])

    } catch (error) {
      console.error('Error saving recipe:', error)
      Alert.alert('Error', 'Failed to save recipe. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    router.back()
  }

  return (
    <YStack f={1} bg="$background">
      {/* Header */}
      <XStack p="$4" alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderBottomColor="$borderColor">
        <Button
          size="$3"
          variant="ghost"
          icon={X}
          onPress={handleCancel}
        />
        <H3>Add Recipe</H3>
        <Button
          size="$3"
          variant="ghost"
          icon={Save}
          onPress={handleSave}
          disabled={isLoading}
        />
      </XStack>

      <ScrollView f={1} p="$4">
        <YStack gap="$4" pb="$20">
          {/* Recipe Name */}
          <YStack gap="$2">
            <Label htmlFor="name" size="$4" fontWeight="600">
              Recipe Name *
            </Label>
            <Input
              id="name"
              placeholder="Enter recipe name"
              value={recipe.name}
              onChangeText={(text) => setRecipe(prev => ({ ...prev, name: text }))}
              size="$4"
            />
          </YStack>

          <Separator />

          {/* Recipe URL */}
          <YStack gap="$2">
            <Label htmlFor="url" size="$4" fontWeight="600">
              Recipe URL
            </Label>
            <Input
              id="url"
              placeholder="https://example.com/recipe"
              value={recipe.url}
              onChangeText={(text) => setRecipe(prev => ({ ...prev, url: text }))}
              size="$4"
              keyboardType="url"
              autoCapitalize="none"
            />
          </YStack>

          <Separator />

          {/* Image URL */}
          <YStack gap="$2">
            <Label htmlFor="imageUrl" size="$4" fontWeight="600">
              Image URL
            </Label>
            <Input
              id="imageUrl"
              placeholder="https://example.com/image.jpg"
              value={recipe.imageUrl}
              onChangeText={(text) => setRecipe(prev => ({ ...prev, imageUrl: text }))}
              size="$4"
              keyboardType="url"
              autoCapitalize="none"
            />
          </YStack>

          <Separator />

          {/* Description */}
          <YStack gap="$2">
            <Label htmlFor="description" size="$4" fontWeight="600">
              Description
            </Label>
            <TextArea
              id="description"
              placeholder="Enter recipe description"
              value={recipe.description}
              onChangeText={(text) => setRecipe(prev => ({ ...prev, description: text }))}
              size="$4"
              minHeight={100}
            />
          </YStack>

          {/* Save Button */}
          <Button
            size="$5"
            theme="blue"
            onPress={handleSave}
            disabled={isLoading}
            mt="$4"
          >
            {isLoading ? 'Saving...' : 'Save Recipe'}
          </Button>
        </YStack>
      </ScrollView>
    </YStack>
  )
}
