import { Toast, useToastController, useToastState } from '@tamagui/toast'
import { Button, H4, XStack, YStack } from 'tamagui'

export function CurrentToast() {
  const currentToast = useToastState()

  if (!currentToast || currentToast.isHandledNatively) return null

  return (
    <Toast
      key={currentToast.id}
      duration={currentToast.duration}
      viewportName={currentToast.viewportName}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={0}
      opacity={1}
      scale={1}
      animation="quick"
      backgroundColor="$background"
      borderWidth={1}
      borderColor="$borderColor"
      shadowColor="$shadowColor"
      shadowRadius={20}
      shadowOffset={{ width: 0, height: 4 }}
      elevationAndroid={8}
      paddingHorizontal="$4"
      paddingVertical="$3"
      borderRadius="$4"
      minHeight={80}
    >
      <YStack alignItems="flex-start" justifyContent="center" gap="$1" flex={1}>
        <Toast.Title
          fontWeight="bold"
          fontSize="$5"
          color="$color"
          numberOfLines={1}
        >
          {currentToast.title}
        </Toast.Title>
        {!!currentToast.message && (
          <Toast.Description
            fontSize="$3"
            color="$gray6"
            numberOfLines={3}
            lineHeight="$1"
          >
            {currentToast.message}
          </Toast.Description>
        )}
      </YStack>
    </Toast>
  )
}

export function ToastControl() {
  const toast = useToastController()

  return (
    <YStack gap="$2" alignItems="center">
      <H4>Toast demo</H4>
      <XStack gap="$2" justifyContent="center">
        <Button
          onPress={() => {
            toast.show('Successfully saved!', {
              message: "Don't worry, we've got your data.",
            })
          }}
        >
          Show
        </Button>
        <Button
          onPress={() => {
            toast.hide()
          }}
        >
          Hide
        </Button>
      </XStack>
    </YStack>
  )
}
