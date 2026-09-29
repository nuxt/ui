import icons from '../runtime/theme/icons'

export function getDefaultConfig(tailwindPrefix?: string) {
  return {
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
