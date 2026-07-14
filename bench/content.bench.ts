import { bench, describe } from 'vitest'
import type { ContentNavigationItem } from '@nuxt/content'
import { mapContentNavigation } from '../src/runtime/utils/content'

function buildNavigation(breadth: number, depth: number): ContentNavigationItem[] {
  return Array.from({ length: breadth }, (_, i) => {
    const item: ContentNavigationItem = {
      title: `Section ${depth}-${i}`,
      path: `/section-${depth}-${i}`
    }
    if (depth > 0) {
      item.children = buildNavigation(breadth, depth - 1)
    }
    return item
  })
}

const flatNavigation = buildNavigation(50, 0)
const deepNavigation = buildNavigation(4, 4)

describe('mapContentNavigation', () => {
  bench('flat navigation', () => {
    mapContentNavigation(flatNavigation)
  })

  bench('deeply nested navigation', () => {
    mapContentNavigation(deepNavigation)
  })

  bench('deeply nested navigation with depth limit', () => {
    mapContentNavigation(deepNavigation, { deep: 2 })
  })
})
