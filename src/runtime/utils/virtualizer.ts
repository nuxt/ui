import { get } from './index'

function itemHasDescription(item: any, descriptionKey: string): boolean {
  if (typeof item !== 'object' || item === null) {
    return false
  }
  const value = get(item, descriptionKey)
  return value !== undefined && value !== null && value !== ''
}

function getSize(size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | (string & {}), hasDescription: boolean): number {
  const sizes = hasDescription
    ? {
        xs: 44,
        sm: 48,
        md: 52,
        lg: 56,
        xl: 60
      }
    : {
        xs: 24,
        sm: 28,
        md: 32,
        lg: 36,
        xl: 40
      }

  return sizes[size as keyof typeof sizes] ?? sizes.md
}

/**
 * Get estimate size for virtualizers that checks each item individually
 */
export function getEstimateSize(items: any[], size: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | (string & {}), descriptionKey?: string, hasDescriptionSlot?: boolean): (index: number) => number {
  const sizeWithDescription = getSize(size, true)
  const sizeWithoutDescription = getSize(size, false)

  // If description slot is used, all items get the larger size
  if (hasDescriptionSlot) {
    return () => sizeWithDescription
  }

  // If no descriptionKey, all items get the smaller size
  if (!descriptionKey) {
    return () => sizeWithoutDescription
  }

  return (index: number) => {
    return itemHasDescription(items[index], descriptionKey) ? sizeWithDescription : sizeWithoutDescription
  }
}
