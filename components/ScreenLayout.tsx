import { SafeAreaView } from 'react-native-safe-area-context'
import { YStack, XStack, H3, Button } from 'tamagui'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { router } from 'expo-router'

interface ScreenLayoutProps {
  title?: string
  children: React.ReactNode
  showBack?: boolean
  headerAction?: React.ReactNode
}

export function ScreenLayout({
  title,
  children,
  showBack = false,
  headerAction
}: ScreenLayoutProps) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
      <YStack flex={1} backgroundColor="$background">
        {title && (
          <YStack
            paddingHorizontal="$4"
            paddingVertical="$3"
            borderBottomWidth={1}
            borderBottomColor="$borderColor"
            backgroundColor="$background"
          >
            <XStack justifyContent="space-between" alignItems="center">
              <XStack gap="$2" alignItems="center" flex={1}>
                {showBack && (
                  <Button
                    size="$3"
                    chromeless
                    icon={ArrowLeft}
                    onPress={() => router.back()}
                    color="$color"
                  />
                )}
                <H3 flex={1}>{title}</H3>
              </XStack>
              {headerAction}
            </XStack>
          </YStack>
        )}
        {children}
      </YStack>
    </SafeAreaView>
  )
}
