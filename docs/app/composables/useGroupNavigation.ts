import type { ContentNavigationItem } from '@nuxt/content'
import { findPageChildren } from '@nuxt/content/utils'

const categories = {
  components: [{
    id: 'layout',
    title: 'Layout'
  }, {
    id: 'element',
    title: 'Element'
  }, {
    id: 'form',
    title: 'Form'
  }, {
    id: 'data',
    title: 'Data'
  }, {
    id: 'navigation',
    title: 'Navigation'
  }, {
    id: 'overlay',
    title: 'Overlay'
  }, {
    id: 'page',
    title: 'Page'
  }, {
    id: 'content',
    title: 'Content',
    framework: 'nuxt'
  }, {
    id: 'dashboard',
    title: 'Dashboard'
  }, {
    id: 'chat',
    title: 'AI Chat'
  }, {
    id: 'color-mode',
    title: 'Color Mode'
  }, {
    id: 'i18n',
    title: 'i18n'
  }],
  typography: [{
    id: 'components',
    title: 'Components'
  }]
}

function groupChildrenByCategory(items: ContentNavigationItem[], slug: string): ContentNavigationItem[] {
  if (!items.length) {
    return []
  }

  const groups: ContentNavigationItem[] = []

  const categorized: Record<string, ContentNavigationItem[]> = {}
  const uncategorized: ContentNavigationItem[] = []

  // Remove icons while grouping
  for (const item of items) {
    if (item.category) {
      categorized[item.category as string] = categorized[item.category as string] || []
      categorized[item.category as string]?.push(item)
    } else {
      uncategorized.push(item)
    }
  }

  if (uncategorized.length) {
    const withChildren = uncategorized.filter(item => item.children?.length)
      ?.map(item => ({ ...item, children: item.children?.map(child => ({ ...child, icon: undefined })) }))
    const withoutChildren = uncategorized.filter(item => !item.children?.length)

    if (withoutChildren.length) {
      groups.push({
        title: 'Overview',
        path: `/docs/${slug}`,
        children: withoutChildren?.map(item => ({ ...item, icon: undefined }))
      })
    }

    groups.push(...withChildren)
  }

  for (const category of categories[slug as keyof typeof categories] || []) {
    if (categorized[category.id]?.length) {
      groups.push({
        title: category.title,
        path: `/docs/${slug}`,
        class: 'framework' in category ? [`${category.framework}-only`] : undefined,
        children: categorized[category.id]
      })
    }
  }

  return groups
}

export const useGroupNavigation = (navigation: Ref<ContentNavigationItem[] | undefined>) => {
  const groupedNavigation = computed(() => {
    const route = useRoute()

    const slug = route.params.slug?.[0] as string
    const children = findPageChildren(navigation?.value, `/docs/${slug}`, { indexAsChild: true })

    return groupChildrenByCategory(children, slug)
  })

  return {
    groupedNavigation
  }
}
