/**
 * Normalizes component names by removing Nuxt UI prefixes
 *
 * @param componentName - The component name to normalize
 * @returns The normalized component name without U/u- prefixes
 *
 * @example
 * normalizeComponentName('UButton') // 'Button'
 * normalizeComponentName('UUser') // 'User'
 * normalizeComponentName('u-button') // 'button'
 * normalizeComponentName('u-user') // 'user'
 * normalizeComponentName('Button') // 'Button'
 * normalizeComponentName('User') // 'User'
 */
export function normalizeComponentName(componentName: string): string {
  let normalizedName = componentName

  // Check if starts with 'U' followed by an uppercase letter (indicating PascalCase)
  if (normalizedName.startsWith('U') && normalizedName.length > 1 && normalizedName[1] === normalizedName[1]?.toUpperCase()) {
    normalizedName = normalizedName.slice(1)

    // Handle u-button -> button, u-user -> user (kebab-case with u- prefix)
  } else if (normalizedName.toLowerCase().startsWith('u-')) {
    normalizedName = normalizedName.slice(2)
  }

  return normalizedName
}
