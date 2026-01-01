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
 * Check if a string value looks like a component size prop value
 * (e.g., '2xs', '3xs', 'xs', 'sm', 'md', 'lg', 'xl', '2xl', etc.)
 */
function isSizeValue(value: string): boolean {
  // Size values: xs, sm, md, lg, xl, 2xs, 3xs, 2xl, 3xl
  return /^(?:[23]x[sl]|xs|sm|md|lg|xl)$/.test(value.trim())
}

/**
 * Recursively apply prefix to class strings in an object
 * Only prefixes actual CSS class strings, not variant/color values used for matching
 * @param obj - The object to apply prefix to
 * @param prefix - The prefix to add (e.g., 'tw')
 * @param context - Internal context tracking for recursion
 * @returns The object with prefixed class strings
 */
export function applyPrefixToObject(obj: any, prefix?: string, context: string[] = []): any {
  if (!obj || !prefix) {
    return obj
  }

  const currentKey = context[context.length - 1]

  // Don't prefix string values in these contexts:
  // 1. Inside compoundVariants array items, keys that are not 'class' (these are variant matchers)
  // 2. Inside defaultVariants (these are default variant values)
  // 3. Values that look like size prop values (e.g., '2xl', '3xs') for keys ending with 'Size'
  const compoundVariantsIndex = context.indexOf('compoundVariants')
  const isInCompoundVariant = compoundVariantsIndex !== -1 && !context.slice(compoundVariantsIndex).includes('class')
  const isInDefaultVariants = context.includes('defaultVariants')
  const isComponentSizeValue = typeof obj === 'string' && typeof currentKey === 'string' && currentKey.endsWith('Size') && isSizeValue(obj)

  if (typeof obj === 'string' && (isInCompoundVariant || isInDefaultVariants || isComponentSizeValue)) {
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

/**
 * Override default variants from module options
 * @param result - The theme result object
 * @param defaultVariants - The default variants from module options
 * @param defaultVariants.color - The default color variant
 * @param defaultVariants.size - The default size variant
 * @returns The theme result with overridden default variants
 */
export function applyDefaultVariants(result: any, defaultVariants?: { color?: string, size?: string }): any {
  if (!result || !defaultVariants) {
    return result
  }

  if (result.defaultVariants?.color && defaultVariants.color) {
    result.defaultVariants.color = defaultVariants.color
  }
  if (result.defaultVariants?.size && defaultVariants.size) {
    result.defaultVariants.size = defaultVariants.size
  }

  return result
}
