import { useState, useEffect } from 'react'
import { YStack, XStack, Button, H3, Paragraph, Input, Sheet, Separator, Spinner } from 'tamagui'
import { Plus, Edit3, Trash2, ArrowLeft, Save, X } from '@tamagui/lucide-icons'
import { useRouter } from 'expo-router'
import { Alert } from 'react-native'
import { tagService, Tag } from '../services/tagService'

export default function ManageTagsScreen() {
  const router = useRouter()
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
        snapPoints={[50]}
        dismissOnSnapToBottom
      >
        <Sheet.Overlay />
        <Sheet.Frame p="$4">
          <Sheet.Handle />
          <YStack gap="$4">
            <XStack ai="center" jc="space-between">
              <H3>{title}</H3>
              <Button size="$3" chromeless icon={X} onPress={closeModals} />
            </XStack>

            <YStack gap="$3">
              <YStack gap="$2">
                <Paragraph fontWeight="600">Name *</Paragraph>
                <Input
                  placeholder="e.g., vegetarian, quick, pasta"
                  value={newTagName}
                  onChangeText={setNewTagName}
                  autoFocus
                />
              </YStack>

              <YStack gap="$2">
                <Paragraph fontWeight="600">Description (optional)</Paragraph>
                <Input
                  placeholder="Brief description of this tag"
                  value={newTagDescription}
                  onChangeText={setNewTagDescription}
                />
              </YStack>
            </YStack>

            <XStack gap="$3" jc="flex-end">
              <Button
                size="$4"
                variant="outlined"
                onPress={closeModals}
              >
                Cancel
              </Button>
              <Button
                size="$4"
                theme="blue"
                color="white"
                icon={Save}
                onPress={isEditing ? handleEditTag : handleCreateTag}
                disabled={saving || !newTagName.trim()}
              >
                {saving ? <Spinner color="white" /> : (isEditing ? 'Update' : 'Create')}
              </Button>
            </XStack>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    )
  }

  if (loading) {
    return (
      <YStack f={1} ai="center" jc="center">
        <Spinner size="large" />
      </YStack>
    )
  }

  return (
    <YStack f={1} bg="$background" p="$4">
      {/* Header */}
      <XStack ai="center" mb="$4">
        <Button
          size="$3"
          chromeless
          icon={ArrowLeft}
          onPress={() => router.back()}
        />
        <H3 f={1} ta="center" mr="$8">Manage Tags</H3>
      </XStack>

      <Paragraph mb="$4" col="$gray11">
        Create and manage tags to organize your recipes and set day-of-week rules.
      </Paragraph>

      {/* Create Tag Button */}
      <Button
        size="$4"
        theme="green"
        color="white"
        icon={Plus}
        onPress={openCreateModal}
        mb="$4"
      >
        Add New Tag
      </Button>

      {/* Tags List */}
      {tags.length === 0 ? (
        <YStack f={1} ai="center" jc="center" gap="$3">
          <Paragraph size="$6" col="$gray11">No tags yet</Paragraph>
          <Paragraph col="$gray11" ta="center">
            Create your first tag to start organizing your recipes
          </Paragraph>
        </YStack>
      ) : (
        <YStack f={1} gap="$2">
          {tags.map((tag, index) => (
            <YStack key={tag.id}>
              <XStack
                ai="center"
                jc="space-between"
                p="$3"
                bg="$gray3"
                br="$4"
              >
                <YStack f={1}>
                  <Paragraph fontWeight="600">{tag.name}</Paragraph>
                  {tag.description && (
                    <Paragraph size="$3" col="$gray11">{tag.description}</Paragraph>
                  )}
                </YStack>

                <XStack gap="$2">
                  <Button
                    size="$3"
                    variant="outlined"
                    icon={Edit3}
                    onPress={() => openEditModal(tag)}
                  />
                  <Button
                    size="$3"
                    variant="outlined"
                    borderColor="$red8"
                    icon={Trash2}
                    onPress={() => handleDeleteTag(tag)}
                  />
                </XStack>
              </XStack>
              {index < tags.length - 1 && <Separator />}
            </YStack>
          ))}
        </YStack>
      )}

      {renderTagModal()}
    </YStack>
  )
}
