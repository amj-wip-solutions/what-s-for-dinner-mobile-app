import { useState, useEffect } from 'react'
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
  Separator,
  Sheet,
  H4,
  Paragraph,
  Spinner
} from 'tamagui'
import { Save, X, Tag as TagIcon, Plus, Check } from '@tamagui/lucide-icons'
import { createRecipe } from '../services/recipeService'
import { tagService, Tag } from '../services/tagService'

export default function AddRecipeScreen() {
  const [recipe, setRecipe] = useState({
    name: '',
    url: '',
    imageUrl: '',
    description: ''
  })
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingTags, setLoadingTags] = useState(true)
  const [showTagSelector, setShowTagSelector] = useState(false)

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    try {
      setLoadingTags(true)
      const tagsData = await tagService.getAll()
      setAllTags(tagsData)
      console.log('Available tags:', tagsData)
    } catch (error) {
      console.error('Error loading tags:', error)
      // Don't show error alert for tags, just continue without them
    } finally {
      setLoadingTags(false)
    }
  }

  const handleSave = async () => {
    if (!recipe.name.trim()) {
      Alert.alert('Error', 'Recipe name is required')
      return
    }

    setIsLoading(true)

    try {
      const recipeData = {
        ...recipe,
        tagIds: selectedTags.map(tag => tag.id)
      }

      console.log('Saving recipe:', recipeData)

      // Use the actual API service
      const savedRecipe = await createRecipe(recipeData)
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

  const toggleTag = (tag: Tag) => {
    setSelectedTags(prev => {
      const isSelected = prev.some(t => t.id === tag.id)
      if (isSelected) {
        return prev.filter(t => t.id !== tag.id)
      } else {
        return [...prev, tag]
      }
    })
  }

  const removeTag = (tagToRemove: Tag) => {
    setSelectedTags(prev => prev.filter(tag => tag.id !== tagToRemove.id))
  }

  return (
    <YStack f={1} bg="$background">
      {/* Header */}
      <XStack p="$4" alignItems="center" justifyContent="space-between" borderBottomWidth={1} borderBottomColor="$borderColor">
        <Button
          size="$3"
          chromeless
          icon={X}
          onPress={handleCancel}
        />
        <H3>Add Recipe</H3>
        <Button
          size="$3"
          chromeless
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
              placeholder="Enter recipe description..."
              value={recipe.description}
              onChangeText={(text) => setRecipe(prev => ({ ...prev, description: text }))}
              size="$4"
              minHeight={100}
            />
          </YStack>

          <Separator />

          {/* Tags Section */}
          <YStack gap="$3">
            <XStack alignItems="center" justifyContent="space-between">
              <Label size="$4" fontWeight="600">
                Tags
              </Label>
              {!loadingTags && (
                <Button
                  size="$3"
                  variant="outlined"
                  icon={Plus}
                  onPress={() => setShowTagSelector(true)}
                  disabled={isLoading}
                >
                  Add Tags
                </Button>
              )}
            </XStack>

            {loadingTags ? (
              <XStack alignItems="center" gap="$2">
                <Spinner size="small" />
                <Paragraph color="$gray10" fontSize="$3">
                  Loading tags...
                </Paragraph>
              </XStack>
            ) : selectedTags.length > 0 ? (
              <XStack gap="$2" flexWrap="wrap">
                {selectedTags.map((tag) => (
                  <XStack
                    key={tag.id}
                    backgroundColor="$blue3"
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    borderRadius="$3"
                    alignItems="center"
                    gap="$2"
                  >
                    <TagIcon size={14} color="$blue10" />
                    <Paragraph fontSize="$3" color="$blue10">
                      {tag.name}
                    </Paragraph>
                    <Button
                      size="$1"
                      circular
                      icon={X}
                      onPress={() => removeTag(tag)}
                      backgroundColor="$blue5"
                      color="$blue10"
                      disabled={isLoading}
                    />
                  </XStack>
                ))}
              </XStack>
            ) : (
              <Paragraph color="$gray10" fontSize="$3">
                No tags selected. Tap "Add Tags" to categorize this recipe.
              </Paragraph>
            )}
          </YStack>
        </YStack>
      </ScrollView>

      {/* Tag Selection Sheet */}
      <Sheet
        modal
        open={showTagSelector}
        onOpenChange={setShowTagSelector}
        dismissOnSnapToBottom
        snapPointsMode="percent"
        snapPoints={[90]}
      >
        <Sheet.Frame p="$4" gap="$4" backgroundColor="$background">
          <Sheet.Handle backgroundColor="$borderColor" />
          <YStack gap="$3">
            <H4>Select Tags</H4>
            <Paragraph color="$gray11" fontSize="$3">
              Choose tags to categorize this recipe
            </Paragraph>

            <ScrollView maxHeight="100%">
              <YStack gap="$2">
                {allTags.length > 0 ? (
                  allTags.map((tag) => {
                    const isSelected = selectedTags.some(t => t.id === tag.id)
                    return (
                      <Button
                        key={tag.id}
                        size="$5"
                        variant="outlined"
                        backgroundColor={isSelected ? "$blue2" : "$background"}
                        borderColor={isSelected ? "$blue8" : "$borderColor"}
                        onPress={() => toggleTag(tag)}
                        justifyContent="space-between"
                        iconAfter={isSelected ? <Check size={20} color="$blue10" /> : undefined}
                      >
                        <XStack alignItems="center" gap="$3" flex={1}>
                          <TagIcon size={20} color={isSelected ? "$blue10" : "$color"} />
                          <Paragraph fontSize="$5" color={isSelected ? "$blue11" : "$color"}>
                            {tag.name}
                          </Paragraph>
                        </XStack>
                      </Button>
                    )
                  })
                ) : (
                  <Paragraph color="$gray10" textAlign="center" py="$4">
                    No tags available. Create some tags first in the Settings screen.
                  </Paragraph>
                )}
              </YStack>
            </ScrollView>

            <Button
              size="$5"
              onPress={() => setShowTagSelector(false)}
              backgroundColor="$blue10"
              color="white"
            >
              Done
            </Button>
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
