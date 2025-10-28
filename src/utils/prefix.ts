/**
 * Prefix Tailwind CSS utility classes with the specified prefix
 * @param classString - The class string to prefix
 * @param prefix - The prefix to add (e.g., 'tw')
 * @returns The prefixed class string
 * @example prefixClasses('flex bg-red-500', 'tw') // 'tw:flex tw:bg-red-500'
 * @example prefixClasses('hover:bg-red-500', 'tw') // 'tw:hover:bg-red-500'
 */
function prefixClasses(classString: string, prefix: string): string {
  if (!prefix || !classString) {
    return classString
  }

  return classString
    .split(' ')
    .filter(Boolean)
    .map(cls => `${prefix}:${cls}`)
    .join(' ')
}

/**
 * Recursively apply prefix to class strings in an object
 * Only prefixes actual CSS class strings, not variant/color values used for matching
 */
export function applyPrefixToObject(obj: any, prefix: string, context: string[] = []): any {
  if (!obj || !prefix) {
    return obj
  }

  // Don't prefix string values in these contexts:
  // 1. Inside compoundVariants array items, keys that are not 'class' (these are variant matchers)
  // 2. Inside defaultVariants (these are default variant values)
  const compoundVariantsIndex = context.indexOf('compoundVariants')
  const isInCompoundVariant = compoundVariantsIndex !== -1 && !context.slice(compoundVariantsIndex).includes('class')
  const isInDefaultVariants = context.includes('defaultVariants')

  if (typeof obj === 'string' && (isInCompoundVariant || isInDefaultVariants)) {
    return obj
  }

  if (typeof obj === 'string') {
    return prefixClasses(obj, prefix)
  }

  if (Array.isArray(obj)) {
    return obj.map((item, index) => applyPrefixToObject(item, prefix, [...context, String(index)]))
  }

  if (typeof obj === 'object') {
    const result: any = {}
    for (const [key, value] of Object.entries(obj)) {
      result[key] = applyPrefixToObject(value, prefix, [...context, key])
    }
    return result
  }

  return obj
}
