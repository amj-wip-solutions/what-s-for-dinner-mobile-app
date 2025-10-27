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
    <XStack gap="$2" flexWrap="wrap" mt="$1">
      {tags.map((tag) => (
        <XStack
          key={tag.id}
          backgroundColor="white"
          paddingHorizontal="$1.5"
          borderRadius="$1"
          alignItems="center"
          gap="$1"
        >
          <Paragraph fontSize="$2" color="black">
            {tag.name}
          </Paragraph>
        </XStack>
      ))}
    </XStack>
  )
}

export const DayItem = ({ item, onSwap }: DayItemProps) => {
  return (
    <YStack mb="$3" mx="$2">
      {/* Day Header with Name and Tags */}
      <XStack
        p="$3"
        backgroundColor="$gray9"
        borderTopLeftRadius="$4"
        borderTopRightRadius="$4"
        borderWidth={1}
        borderBottomWidth={0}
        borderColor="$borderColor"
      >
        <Paragraph fontWeight="700" size="$5" color="$color" mr="auto">
          {item.dayOfWeek}
        </Paragraph>
        <DayItemTags tags={item.tags} />
      </XStack>

      {/* Recipe Card */}
      <Card
        elevate
        bordered
        borderTopLeftRadius={0}
        borderTopRightRadius={0}
        borderTopWidth={0}
        minHeight={90}
      >
        <Card.Header padded>
          <XStack alignItems="center" gap="$3">
            {/* Recipe Image */}
            {item.recipe?.imageUrl ? (
              <Image
                source={{ uri: item.recipe.imageUrl }}
                width={60}
                height={60}
                borderRadius="$3"
              />
            ) : (
              <YStack
                width={60}
                height={60}
                backgroundColor="$gray4"
                borderRadius="$3"
                alignItems="center"
                justifyContent="center"
              >
                <Text fontSize="$2" color="$gray10" textAlign="center">
                  No{'\n'}Recipe
                </Text>
              </YStack>
            )}

            {/* Recipe Info */}
            <YStack f={1}>
              <Paragraph
                fontWeight="600"
                size="$4"
                color="$color"
                numberOfLines={2}
              >
                {item.recipe?.name || 'No recipe assigned'}
              </Paragraph>
              {item.recipe && (
                <Paragraph size="$2" color="$gray11" mt="$1">
                  Tap refresh to change
                </Paragraph>
              )}
            </YStack>

            {/* Swap Button */}
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
    </YStack>
  )
}
