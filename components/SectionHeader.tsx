import { Text } from 'tamagui'

interface SectionHeaderProps {
  children: string
}

export function SectionHeader({ children }: SectionHeaderProps) {
  return (
    <Text
      fontSize="$2"
      fontWeight="600"
      color="$gray6"
      textTransform="uppercase"
      letterSpacing={1}
      marginBottom="$2"
    >
      {children}
    </Text>
  )
}
