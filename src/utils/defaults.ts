import icons from '../runtime/theme/icons'

export function getDefaultConfig(tailwindPrefix?: string) {
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
    prefix: tailwindPrefix,
    tv: {
      mergeConfig: {
        prefix: tailwindPrefix
      }
    }
  }
}

export const defaultOptions = {
  prefix: 'U',
  fonts: true,
  colorMode: true,
  tailwindPrefix: undefined,
  prose: false,
  mdc: false,
  content: false
}
