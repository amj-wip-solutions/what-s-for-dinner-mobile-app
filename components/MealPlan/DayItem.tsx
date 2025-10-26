/**
 * DayItem Component
 * Displays a single day in the meal plan
 */

import { XStack, YStack, Card, Image, Text, Paragraph, Button } from 'tamagui'
import { RefreshCw, Tag as TagIcon } from '@tamagui/lucide-icons'

interface DayItemProps {
  item: {
    id: number
    date: string
    dayOfWeek: string
    recipe: any | null
    tags?: any[]
  }
  onSwap: (item: any) => void
}

const DayItemTags = ({ tags }: { tags?: any[] }) => {
  if (!tags || tags.length === 0) return null

  return (
    <XStack gap="$2" mt="$2" flexWrap="wrap">
      {tags.map((tag) => (
        <XStack
          key={tag.id}
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
      ))}
    </XStack>
  )
}

export const DayItem = ({ item, onSwap }: DayItemProps) => {
  return (
    <Card
      elevate
      size="$4"
      bordered
      mb="$2"
      mx="$2"
    >
      <Card.Header padded>
        <XStack alignItems="center" justifyContent="space-between">
          <YStack f={1}>
            <XStack alignItems="center" gap="$3">
              {item.recipe?.imageUrl ? (
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
                  <Text fontSize="$2" color="$gray10" textAlign="center">
                    No Recipe
                  </Text>
                </YStack>
              )}
              <YStack f={1}>
                <Paragraph fontWeight="600" size="$4">
                  {item.dayOfWeek}
                </Paragraph>
                <Paragraph theme="alt2" size="$3">
                  {item.recipe?.name || 'No recipe assigned'}
                </Paragraph>
                <DayItemTags tags={item.tags} />
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

