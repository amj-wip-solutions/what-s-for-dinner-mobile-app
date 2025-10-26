import { useState, useEffect } from 'react'
import { YStack, XStack, Button, H3, Paragraph, Input, Sheet, Spinner, ScrollView } from 'tamagui'
import { Plus, Edit3, Trash2, Save, X } from '@tamagui/lucide-icons'
import { Alert } from 'react-native'
import { tagService, Tag } from '../services/tagService'
import { ScreenLayout } from '../components/ScreenLayout'

export default function ManageTagsScreen() {
  const [tags, setTags] = useState<Tag[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingTag, setEditingTag] = useState<Tag | null>(null)
  const [newTagName, setNewTagName] = useState('')
  const [newTagDescription, setNewTagDescription] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadTags()
  }, [])

  const loadTags = async () => {
    try {
      const data = await tagService.getAll()
      setTags(data)
    } catch (error) {
      console.error('Error loading tags:', error)
      Alert.alert('Error', 'Failed to load tags')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateTag = async () => {
    if (!newTagName.trim()) {
      Alert.alert('Error', 'Tag name is required')
      return
    }

    try {
      setSaving(true)
      const newTag = await tagService.create({
        name: newTagName.trim(),
        description: newTagDescription.trim() || undefined
      })

      setTags(prev => [...prev, newTag])
      setShowCreateModal(false)
      setNewTagName('')
      setNewTagDescription('')
    } catch (error) {
      console.error('Error creating tag:', error)
      Alert.alert('Error', 'Failed to create tag')
    } finally {
      setSaving(false)
    }
  }

  const handleEditTag = async () => {
    if (!editingTag || !newTagName.trim()) {
      Alert.alert('Error', 'Tag name is required')
      return
    }

    try {
      setSaving(true)
      const updatedTag = await tagService.update(editingTag.id, {
        name: newTagName.trim(),
        description: newTagDescription.trim() || undefined
      })

      setTags(prev => prev.map(tag =>
        tag.id === editingTag.id ? updatedTag : tag
      ))
      setEditingTag(null)
      setNewTagName('')
      setNewTagDescription('')
    } catch (error) {
      console.error('Error updating tag:', error)
      Alert.alert('Error', 'Failed to update tag')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteTag = (tag: Tag) => {
    Alert.alert(
      'Delete Tag',
      `Are you sure you want to delete "${tag.name}"? This will also remove it from any recipes and day rules that use it.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await tagService.delete(tag.id)
              setTags(prev => prev.filter(t => t.id !== tag.id))
            } catch (error) {
              console.error('Error deleting tag:', error)
              Alert.alert('Error', 'Failed to delete tag')
            }
          }
        }
      ]
    )
  }

  const openCreateModal = () => {
    setNewTagName('')
    setNewTagDescription('')
    setShowCreateModal(true)
  }

  const openEditModal = (tag: Tag) => {
    setNewTagName(tag.name)
    setNewTagDescription(tag.description || '')
    setEditingTag(tag)
  }

  const closeModals = () => {
    setShowCreateModal(false)
    setEditingTag(null)
    setNewTagName('')
    setNewTagDescription('')
  }

  const renderTagModal = () => {
    const isEditing = !!editingTag
    const title = isEditing ? 'Edit Tag' : 'Create New Tag'

    return (
      <Sheet
        modal
        open={showCreateModal || !!editingTag}
        onOpenChange={(open) => {
          if (!open) closeModals()
        }}
        snapPointsMode="percent"
        snapPoints={[50]}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay
          animation="lazy"
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          backgroundColor="rgba(0,0,0,0.5)"
        />
        <Sheet.Frame padding="$4" backgroundColor="$background">
          <Sheet.Handle backgroundColor="$borderColor" />
          <YStack gap="$4">
            <XStack alignItems="center" justifyContent="space-between">
              <H3 color="$color">{title}</H3>
              <Button
                size="$3"
                chromeless
                icon={X}
                onPress={closeModals}
                color="$color"
              />
            </XStack>

            <YStack gap="$3">
              <YStack gap="$2">
                <Paragraph fontWeight="600" color="$color">Name *</Paragraph>
                <Input
                  size="$4"
                  placeholder="e.g., vegetarian, quick, pasta"
                  value={newTagName}
                  onChangeText={setNewTagName}
                  borderColor="$borderColor"
                  backgroundColor="$background"
                />
              </YStack>
            </YStack>

            <XStack gap="$3" justifyContent="flex-end">
              <Button
                size="$4"
                backgroundColor="transparent"
                borderWidth={1}
                borderColor="$borderColor"
                color="$color"
                onPress={closeModals}
                borderRadius="$2"
              >
                Cancel
              </Button>
              <Button
                size="$4"
                backgroundColor="$brand"
                color="$white"
                icon={Save}
                onPress={isEditing ? handleEditTag : handleCreateTag}
                disabled={saving || !newTagName.trim()}
                borderRadius="$2"
                fontWeight="600"
              >
                {saving ? <Spinner color="$white" /> : (isEditing ? 'Update' : 'Create')}
              </Button>
            </XStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    )
  }

  if (loading) {
    return (
      <ScreenLayout title="Manage Tags" showBack>
        <YStack flex={1} alignItems="center" justifyContent="center">
          <Spinner size="large" color="$brand" />
        </YStack>
      </ScreenLayout>
    )
  }

  return (
    <ScreenLayout
      title="Manage Tags"
      showBack
      headerAction={
        <Button
          size="$3"
          chromeless
          icon={Plus}
          onPress={openCreateModal}
          color="$color"
        />
      }
    >
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack padding="$4" gap="$4">
          <Paragraph color="$gray6" size="$3">
            Create and manage tags to organize your recipes and set day-of-week rules.
          </Paragraph>

          {/* Tags List */}
          {tags.length === 0 ? (
            <YStack flex={1} alignItems="center" justifyContent="center" gap="$3" paddingVertical="$8">
              <Paragraph fontSize="$6" color="$gray6">No tags yet</Paragraph>
              <Paragraph color="$gray6" textAlign="center">
                Create your first tag to start organizing your recipes
              </Paragraph>
            </YStack>
          ) : (
            <YStack
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius="$4"
              overflow="hidden"
              backgroundColor="$background"
            >
              {tags.map((tag, index) => (
                <YStack key={tag.id}>
                  <XStack
                    alignItems="center"
                    justifyContent="space-between"
                    padding="$3"
                    backgroundColor="$background"
                    borderBottomWidth={index < tags.length - 1 ? 1 : 0}
                    borderBottomColor="$borderColor"
                  >
                    <YStack flex={1}>
                      <Paragraph fontWeight="600" color="$color">{tag.name}</Paragraph>
                    </YStack>

                    <XStack gap="$2">
                      <Button
                        size="$3"
                        circular
                        chromeless
                        icon={Edit3}
                        color="$gray7"
                        onPress={() => openEditModal(tag)}
                        hoverStyle={{
                          backgroundColor: '$gray2',
                        }}
                      />
                      <Button
                        size="$3"
                        circular
                        chromeless
                        icon={Trash2}
                        color="$error"
                        onPress={() => handleDeleteTag(tag)}
                        hoverStyle={{
                          backgroundColor: '$gray2',
                        }}
                      />
                    </XStack>
                  </XStack>
                </YStack>
              ))}
            </YStack>
          )}

          {/* Bottom spacer */}
          <YStack height={100} />
        </YStack>
      </ScrollView>

      {renderTagModal()}
    </ScreenLayout>
  )
}
