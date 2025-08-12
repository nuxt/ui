import type { ContentNavigationItem } from '@nuxt/content'

function processNavigationItem(item: ContentNavigationItem, parent?: ContentNavigationItem): any {
  if (item.shadow) {
    return item.children?.flatMap(child => processNavigationItem(child, item))
  }

  return {
    ...item,
    title: parent?.title ? parent.title : item.title,
    badge: parent?.badge || item.badge,
    class: [item.framework && `${item.framework}-only`].filter(Boolean),
    children: item.children?.length ? item.children?.flatMap(child => processNavigationItem(child)) : undefined
  }
}

function processNavigationItemIcon(item: ContentNavigationItem) {
  let icon = item.icon
  if (item.path.startsWith('/docs/components')) {
    icon = 'i-lucide-square-code'
  }
  if (item.path.startsWith('/docs/composables')) {
    icon = 'i-lucide-square-function'
  }
  return {
    ...item,
    icon
  }
}

export const useContentNavigation = (navigation: Ref<ContentNavigationItem[] | undefined>) => {
  const { framework } = useSharedData()

  const mappedNavigation = computed(() => navigation.value?.[0]?.children?.map(item => processNavigationItem(item)))

  const filteredNavigation = computed(() => mappedNavigation.value?.map((item) => {
    return {
      ...item,
      children: item.children?.filter((child: any) => {
        if (child.path.startsWith('/docs/components')) {
          return true
        }

        if (child.framework && child.framework !== framework.value) {
          return false
        }
        return true
      })?.map(processNavigationItemIcon)
    }
  }))

  return {
    mappedNavigation,
    filteredNavigation
  }
}
