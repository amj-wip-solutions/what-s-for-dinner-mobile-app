import { useState, useEffect } from 'react'
import { YStack, XStack, Text, Button } from 'tamagui'
import { X, Info, CheckCircle2, AlertTriangle } from '@tamagui/lucide-icons'
import { AnimatePresence } from 'tamagui'

export type BannerVariant = 'info' | 'success' | 'warning' | 'error'

export interface MealPlanBannerProps {
  message: string
  variant?: BannerVariant
  visible?: boolean
  onDismiss?: () => void
  actionLabel?: string
  onAction?: () => void
  autoDismiss?: boolean
  autoDismissDelay?: number
}

const getVariantStyles = (variant: BannerVariant) => {
  switch (variant) {
    case 'success':
      return {
        backgroundColor: '$background',
        borderColor: '$success',
        borderLeftWidth: 3,
        textColor: '$color',
        iconColor: '$success',
        Icon: CheckCircle2,
      }
    case 'warning':
      return {
        backgroundColor: '$background',
        borderColor: '$warning',
        borderLeftWidth: 3,
        textColor: '$color',
        iconColor: '$warning',
        Icon: AlertTriangle,
      }
    case 'error':
      return {
        backgroundColor: '$background',
        borderColor: '$error',
        borderLeftWidth: 3,
        textColor: '$color',
        iconColor: '$error',
        Icon: AlertTriangle,
      }
    case 'info':
    default:
      return {
        backgroundColor: '$background',
        borderColor: '$info',
        borderLeftWidth: 3,
        textColor: '$color',
        iconColor: '$info',
        Icon: Info,
      }
  }
}

export function MealPlanBanner({
  message,
  variant = 'info',
  visible = true,
  onDismiss,
  actionLabel,
  onAction,
  autoDismiss = false,
  autoDismissDelay = 5000,
}: MealPlanBannerProps) {
  const [isVisible, setIsVisible] = useState(visible)
  const styles = getVariantStyles(variant)
  const { Icon } = styles

  useEffect(() => {
    setIsVisible(visible)
  }, [visible])

  useEffect(() => {
    if (autoDismiss && isVisible && onDismiss) {
      const timer = setTimeout(() => {
        handleDismiss()
      }, autoDismissDelay)

      return () => clearTimeout(timer)
    }
  }, [autoDismiss, isVisible, autoDismissDelay, onDismiss])

  const handleDismiss = () => {
    setIsVisible(false)
    setTimeout(() => {
      onDismiss?.()
    }, 300)
  }

  if (!isVisible) return null

  return (
    <AnimatePresence>
      <YStack
        animation="quick"
        enterStyle={{ opacity: 0, y: -20 }}
        exitStyle={{ opacity: 0, y: -20 }}
        backgroundColor={styles.backgroundColor}
        borderWidth={1}
        borderColor="$borderColor"
        borderLeftWidth={styles.borderLeftWidth}
        borderLeftColor={styles.borderColor}
        borderRadius="$2"
        padding="$3"
        marginHorizontal="$4"
        marginTop="$3"
        marginBottom="$2"
        shadowColor="$black"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.05}
        shadowRadius={8}
      >
        <XStack alignItems="flex-start" gap="$3">
          <Icon size={20} color={styles.iconColor} style={{ marginTop: 2 }} />

          <YStack flex={1} gap="$2">
            <Text
              fontSize="$3"
              color={styles.textColor}
              flexWrap="wrap"
              flex={1}
            >
              {message}
            </Text>

            {actionLabel && onAction && (
              <XStack>
                <Button
                  size="$2"
                  backgroundColor="$brand"
                  color="$white"
                  onPress={onAction}
                  marginTop="$1"
                  borderRadius="$2"
                >
                  {actionLabel}
                </Button>
              </XStack>
            )}
          </YStack>

          {onDismiss && (
            <Button
              size="$2"
              circular
              chromeless
              icon={X}
              onPress={handleDismiss}
              color="$gray7"
            />
          )}
        </XStack>
      </YStack>
    </AnimatePresence>
  )
}
