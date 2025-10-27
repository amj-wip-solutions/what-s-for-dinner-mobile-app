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
    <YStack gap="$2" alignItems="flex-end">
      {tags.map((tag) => (
        <XStack
          key={tag.id}
          backgroundColor="white"
          paddingHorizontal="$2"
          paddingVertical="$0.5"
          borderRadius="$1"
          alignItems="center"
          gap="$2"
        >
          <Paragraph fontSize="$3" color="black">
            {tag.name}
          </Paragraph>
        </XStack>
      ))}
    </YStack>
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
        <XStack alignItems="center" justifyContent="space-between" gap="$3">
          <XStack alignItems="center" gap="$3" f={1}>
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
              <Paragraph color="$color" size="$3">
                {item.recipe?.name || 'No recipe assigned'}
              </Paragraph>
                <DayItemTags tags={item.tags} />

            </YStack>
          </XStack>


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

