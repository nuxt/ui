import { get } from './index'

function hasDescription(item: any, descriptionKey: string): boolean {
  if (typeof item !== 'object' || item === null) {
    return false
  }
  const value = get(item, descriptionKey)
  return value !== undefined && value !== null && value !== ''
}

function getSize(size: 'xs' | 'sm' | 'md' | 'lg' | 'xl', hasDescription: boolean): number {
  if (hasDescription) {
    return ({
      xs: 44,
      sm: 48,
      md: 52,
      lg: 56,
      xl: 60
    })[size]
  }

  return ({
    xs: 24,
    sm: 28,
    md: 32,
    lg: 36,
    xl: 40
  })[size]
}

/**
 * Get estimate size for virtualizers that checks each item individually
 * NOTE: This requires Reka UI to support functions for estimateSize (https://github.com/unovue/reka-ui/pull/2288)
 * Until then, we check if ANY item has a description and use that for all items
 */
export function getEstimateSize(items: any[], size: 'xs' | 'sm' | 'md' | 'lg' | 'xl', descriptionKey?: string): number {
  // TODO: Once Reka UI supports functions, uncomment and change return type to: number | ((index: number) => number)
  // return (index: number) => {
  //   const item = items[index]
  //   const hasDescription = descriptionKey ? hasDescription(item, descriptionKey) : false
  //   return getSize(size, hasDescription)
  // }

  // For now, check if ANY item has a description and use a static size
  const anyHasDescription = descriptionKey ? items.some(item => hasDescription(item, descriptionKey)) : false
  return getSize(size, anyHasDescription)
}
