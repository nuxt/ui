import icons from '../runtime/theme/icons'

export function getDefaultConfig(tailwindPrefix?: string) {
  return {
    icons,
    prefix: tailwindPrefix,
    tv: {
      prefix: tailwindPrefix
    }
  }
}

export const defaultOptions = {
  prefix: 'U',
  fonts: true,
  colorMode: true,
  tailwindPrefix: undefined,
  componentDetection: true,
  prose: undefined,
  content: false,
  eslint: undefined
}
