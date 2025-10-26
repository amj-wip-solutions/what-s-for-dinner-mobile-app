import { createTamagui, createTokens } from 'tamagui'
import { config as defaultConfig } from '@tamagui/config/v3'

// Custom monochrome tokens
const tokens = createTokens({
  ...defaultConfig.tokens,
  color: {
    // Grays (light mode)
    gray1: '#fafafa',
    gray2: '#f5f5f5',
    gray3: '#e5e5e5',
    gray4: '#d4d4d4',
    gray5: '#a3a3a3',
    gray6: '#737373',
    gray7: '#525252',
    gray8: '#404040',
    gray9: '#262626',
    gray10: '#171717',
    gray11: '#0a0a0a',
    gray12: '#000000',

    // Brand accent (Emerald - fresh, healthy)
    brand1: '#ecfdf5',
    brand2: '#d1fae5',
    brand3: '#a7f3d0',
    brand4: '#6ee7b7',
    brand5: '#34d399',
    brand6: '#10b981', // Primary brand color
    brand7: '#059669',
    brand8: '#047857',
    brand9: '#065f46',
    brand10: '#064e3b',

    // Status colors (muted)
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',

    // Base colors
    white: '#ffffff',
    black: '#000000',
  },
})

// Define light theme
const lightTheme = {
  background: tokens.color.white,
  backgroundHover: tokens.color.gray1,
  backgroundPress: tokens.color.gray2,
  backgroundFocus: tokens.color.gray1,
  backgroundTransparent: 'rgba(0,0,0,0)',

  color: tokens.color.gray12,
  colorHover: tokens.color.gray11,
  colorPress: tokens.color.gray11,
  colorFocus: tokens.color.gray11,
  colorTransparent: 'rgba(0,0,0,0)',

  borderColor: tokens.color.gray3,
  borderColorHover: tokens.color.gray4,
  borderColorFocus: tokens.color.brand6,
  borderColorPress: tokens.color.gray4,

  placeholderColor: tokens.color.gray5,

  // Brand colors
  brand: tokens.color.brand6,
  brandHover: tokens.color.brand7,
  brandPress: tokens.color.brand8,

  // Status
  success: tokens.color.success,
  warning: tokens.color.warning,
  error: tokens.color.error,
  info: tokens.color.info,
}

// Define dark theme
const darkTheme = {
  background: tokens.color.black,
  backgroundHover: tokens.color.gray11,
  backgroundPress: tokens.color.gray10,
  backgroundFocus: tokens.color.gray11,
  backgroundTransparent: 'rgba(255,255,255,0)',

  color: tokens.color.white,
  colorHover: tokens.color.gray1,
  colorPress: tokens.color.gray1,
  colorFocus: tokens.color.gray1,
  colorTransparent: 'rgba(255,255,255,0)',

  borderColor: tokens.color.gray9,
  borderColorHover: tokens.color.gray8,
  borderColorFocus: tokens.color.brand6,
  borderColorPress: tokens.color.gray8,

  placeholderColor: tokens.color.gray6,

  // Brand colors (same)
  brand: tokens.color.brand6,
  brandHover: tokens.color.brand5,
  brandPress: tokens.color.brand4,

  // Status
  success: tokens.color.success,
  warning: tokens.color.warning,
  error: tokens.color.error,
  info: tokens.color.info,
}

export const config = createTamagui({
  ...defaultConfig,
  tokens,
  themes: {
    light: lightTheme,
    dark: darkTheme,
  },
})

export default config

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf {}
}
