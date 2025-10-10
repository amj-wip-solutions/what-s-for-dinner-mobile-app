import { useState, useEffect } from 'react'
import { Alert } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
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
  Spinner,
  Sheet,
  H4,
  Paragraph
} from 'tamagui'
import { Save, X, Tag as TagIcon, Trash2, Plus, Check } from '@tamagui/lucide-icons'
import { getRecipe, updateRecipe, deleteRecipe } from '../../services/recipeService'
import { tagService, Tag } from '../../services/tagService'

export default function EditRecipeScreen() {
  const { id } = useLocalSearchParams()
  const [recipe, setRecipe] = useState({
    name: '',
    url: '',
    imageUrl: '',
    description: '',
    tagIds: []
  })
  const [allTags, setAllTags] = useState<Tag[]>([])
  const [selectedTags, setSelectedTags] = useState<Tag[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showTagSelector, setShowTagSelector] = useState(false)

  useEffect(() => {
    loadRecipeAndTags()
  }, [id])

  const loadRecipeAndTags = async () => {
    try {
      setIsLoading(true)
      const [recipeData, tagsData] = await Promise.all([
        getRecipe(Number(id)),
        tagService.getAll()
      ])

      setRecipe(recipeData)
      setAllTags(tagsData)

      // Set selected tags based on recipe's existing tags
      // Handle both tagIds array and tags array formats
      let recipeTags = []

      if (recipeData.tagIds && recipeData.tagIds.length > 0) {
        // If recipe has tagIds array
        recipeTags = tagsData.filter(tag =>
          recipeData.tagIds.includes(tag.id)
        )
      } else if (recipeData.tags && recipeData.tags.length > 0) {
        // If recipe has tags array with full tag objects
        recipeTags = recipeData.tags.map(tag => {
          // If it's already a full tag object, use it
          if (typeof tag === 'object' && tag.id && tag.name) {
            return tag
          }
          // If it's just an ID or name, find the full tag object
          return tagsData.find(t => t.id === tag || t.name === tag)
        }).filter(Boolean) // Remove any undefined values
      }

      setSelectedTags(recipeTags)

      console.log('Loaded recipe:', recipeData)
      console.log('Recipe tags:', recipeData.tags)
      console.log('Recipe tagIds:', recipeData.tagIds)
      console.log('Selected tags:', recipeTags)
      console.log('Available tags:', tagsData)
    } catch (error) {
      console.error('Error loading recipe and tags:', error)
      Alert.alert('Error', 'Failed to load recipe. Please try again.')
      router.back()
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    if (!recipe.name.trim()) {
      Alert.alert('Error', 'Recipe name is required')
      return
    }

    setIsSaving(true)

    try {
      const updatedRecipeData = {
        ...recipe,
        tagIds: selectedTags.map(tag => tag.id)
      }

      console.log('Updating recipe:', updatedRecipeData)
      const savedRecipe = await updateRecipe(Number(id), updatedRecipeData)
      console.log('Recipe updated successfully:', savedRecipe)

      Alert.alert('Success', 'Recipe updated successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ])

    } catch (error) {
      console.error('Error updating recipe:', error)
      Alert.alert('Error', 'Failed to update recipe. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = () => {
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsSaving(true)
              await deleteRecipe(Number(id))
              Alert.alert('Success', 'Recipe deleted successfully!', [
                { text: 'OK', onPress: () => router.back() }
              ])
            } catch (error) {
              console.error('Error deleting recipe:', error)
              Alert.alert('Error', 'Failed to delete recipe. Please try again.')
              setIsSaving(false)
            }
          }
        }
      ]
    )
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

  if (isLoading) {
    return (
      <YStack f={1} bg="$background" alignItems="center" justifyContent="center">
        <Spinner size="large" />
        <Paragraph mt="$2">Loading recipe...</Paragraph>
      </YStack>
    )
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
          disabled={isSaving}
        />
        <H3>Edit Recipe</H3>
        <XStack gap="$2">
          <Button
            size="$3"
            variant="ghost"
            icon={Trash2}
            onPress={handleDelete}
            disabled={isSaving}
            color="$red10"
          />
          <Button
            size="$3"
            variant="ghost"
            icon={Save}
            onPress={handleSave}
            disabled={isSaving}
          />
        </XStack>
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
              disabled={isSaving}
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
              disabled={isSaving}
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
              disabled={isSaving}
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
              disabled={isSaving}
            />
          </YStack>

          <Separator />

          {/* Tags Section */}
          <YStack gap="$3">
            <XStack alignItems="center" justifyContent="space-between">
              <Label size="$4" fontWeight="600">
                Tags
              </Label>
              <Button
                size="$3"
                variant="outlined"
                icon={Plus}
                onPress={() => setShowTagSelector(true)}
                disabled={isSaving}
              >
                Add Tags
              </Button>
            </XStack>

            {/* Selected Tags */}
            {selectedTags.length > 0 ? (
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
                      disabled={isSaving}
                    />
                  </XStack>
                ))}
              </XStack>
            ) : (
              <Paragraph color="$gray10" fontSize="$3">
                No tags selected. Tap "Add Tags" to assign tags to this recipe.
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
        snapPointsMode="fit"
      >
        <Sheet.Frame p="$4" gap="$4">
          <YStack gap="$3">
            <H4>Select Tags</H4>
            <Paragraph color="$gray11" fontSize="$3">
              Choose tags to categorize this recipe
            </Paragraph>

            <ScrollView maxHeight={300}>
              <YStack gap="$2">
                {allTags.length > 0 ? (
                  allTags.map((tag) => {
                    const isSelected = selectedTags.some(t => t.id === tag.id)
                    return (
                      <Button
                        key={tag.id}
                        variant={isSelected ? "outlined" : "ghost"}
                        onPress={() => toggleTag(tag)}
                        justifyContent="space-between"
                        iconAfter={isSelected ? <Check size={16} /> : undefined}
                      >
                        <XStack alignItems="center" gap="$2" flex={1}>
                          <TagIcon size={16} color={isSelected ? "$blue10" : "$gray10"} />
                          <Paragraph color={isSelected ? "$blue11" : "$gray11"}>
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
        />
      </Sheet>
    </YStack>
  )
}
