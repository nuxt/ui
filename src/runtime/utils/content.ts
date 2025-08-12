import type { ContentNavigationItem } from '@nuxt/content'

type MapContentNavigationItemOptions = { labelAttribute?: string, deep?: number }

export function mapContentNavigationItem(item: ContentNavigationItem, options?: MapContentNavigationItemOptions, currentDepth: number = 0) {
  const navMap = {
    [options?.labelAttribute || 'title']: 'label',
    path: 'to'
  }

  const link = Object.keys(item).reduce((link, key) => {
    if (item[key]) {
      const mappedKey: string = navMap[key as keyof typeof navMap] || key
      link[mappedKey] = item[key]
    }
    return link
  }, {} as Omit<ContentNavigationItem, 'title' | 'path'> & { label?: string, to?: string })

  const shouldRecurse = typeof options?.deep === 'undefined' || currentDepth < options.deep
  if (shouldRecurse && Array.isArray(item.children)) {
    link.children = item.children.map(child =>
      mapContentNavigationItem(child, options, currentDepth + 1)
    )
  } else {
    link.children = []
  }

  return link
}

export function mapContentNavigation(navigation: ContentNavigationItem[], options?: MapContentNavigationItemOptions) {
  return navigation.map(item => mapContentNavigationItem(item, options))
}
