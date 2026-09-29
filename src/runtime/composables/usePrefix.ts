import { useAppConfig } from '#imports'
import { prefixClasses } from '../utils/prefix'

/**
 * Prefixes Tailwind utility class strings with the configured `theme.prefix`,
 * so static utility classes inside Nuxt UI components match the consumer's
 * Tailwind `prefix(...)` configuration.
 */
export function usePrefix() {
  const appConfig = useAppConfig() as { ui?: { prefix?: string } }
  const prefix = appConfig.ui?.prefix

  return (classString: string): string => prefixClasses(classString, prefix)
}
