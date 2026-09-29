import icons from '../runtime/theme/icons'
import type { ModuleOptions } from '../module'

export function getDefaultConfig(theme?: ModuleOptions['theme']) {
  return {
    colors: {
      primary: 'green',
      secondary: 'blue',
      success: 'green',
      info: 'blue',
      warning: 'yellow',
      error: 'red',
      neutral: 'slate'
    },
    icons,
    prefix: theme?.prefix,
    tv: {
      mergeConfig: {
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
    prefix: undefined
  },
  prose: false,
  mdc: false,
  content: false
}
