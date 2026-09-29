import { prefixClasses } from '../utils/prefix'
import { injectThemeContext } from './useComponentProps'

/**
 * Prefixes Tailwind utility class strings with the configured `theme.prefix`,
 * so static utility classes inside Nuxt UI components match the consumer's
 * Tailwind `prefix(...)` configuration.
 */
export function usePrefix() {
  const { config } = injectThemeContext()

  return (classString: string): string => prefixClasses(classString, config.value.prefix)
}
