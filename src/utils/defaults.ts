import icons from '../theme/icons'
import { pick } from '../runtime/utils'
import type { ModuleOptions } from '../module'

export function resolveColors(colors?: string[]) {
  return colors?.length
    ? [...new Set(['primary', ...colors])]
    : ['primary', 'secondary', 'success', 'info', 'warning', 'error']
}

export function getDefaultConfig(theme?: ModuleOptions['theme']) {
  return {
    colors: pick({
      primary: 'green',
      secondary: 'blue',
      success: 'green',
      info: 'blue',
      warning: 'yellow',
      error: 'red',
      neutral: 'slate'
    }, [...(theme?.colors || []), 'neutral' as any]),
    icons,
    prefix: theme?.prefix,
    tv: {
      twMergeConfig: {
        prefix: theme?.prefix
      }
    }
  }
}

export const defaultOptions = {
  prefix: 'U',
  fonts: true,
  colorMode: true,
  theme: {
    colors: undefined,
    transitions: true,
    defaultVariants: {
      color: undefined,
      size: undefined
    },
    prefix: undefined
  },
  mdc: false,
  content: false
}
