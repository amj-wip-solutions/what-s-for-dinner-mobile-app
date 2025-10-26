import { SafeAreaView } from 'react-native-safe-area-context'
import { YStack, XStack, H3, Button, Paragraph, useTheme } from 'tamagui'
import { ArrowLeft } from '@tamagui/lucide-icons'
import { router } from 'expo-router'

interface ScreenLayoutProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  showBack?: boolean
  headerAction?: React.ReactNode
}

export function ScreenLayout({
  title,
  subtitle,
  children,
  showBack = false,
  headerAction
}: ScreenLayoutProps) {
  const theme = useTheme()

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: theme.background.val }}
      edges={['top', 'left', 'right']}
    >
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
                <YStack flex={1}>
                  <H3>{title}</H3>
                  {subtitle && (
                    <Paragraph size="$2" color="$gray6" mt="$1">
                      {subtitle}
                    </Paragraph>
                  )}
                </YStack>
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
