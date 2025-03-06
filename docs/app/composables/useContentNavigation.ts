import type { ContentNavigationItem } from '@nuxt/content'

function processNavigationItem(item: ContentNavigationItem, parent?: ContentNavigationItem): any {
  if (item.shadow) {
    return item.children?.flatMap(child => processNavigationItem(child, item))
  }

  return {
    ...item,
    title: parent?.title && parent.title !== 'Pro' ? parent.title : item.title,
    badge: parent?.badge || item.badge,
    class: [item.framework && `${item.framework}-only`, item.module && `${item.module}-only`].filter(Boolean),
    children: item.children?.length ? item.children?.flatMap(child => processNavigationItem(child)) : undefined
  }
}

function processNavigationItemIcon(item: ContentNavigationItem) {
  let icon = item.icon
  if (item.path.startsWith('/components')) {
    icon = item.module === 'ui-pro' ? 'i-lucide-panels-top-left' : 'i-lucide-box'
  }
  if (item.path.startsWith('/composables')) {
    icon = 'i-lucide-square-function'
  }
  return {
    ...item,
    icon
  }
}

export const useContentNavigation = (navigation: Ref<ContentNavigationItem[] | undefined>) => {
  const { framework, module } = useSharedData()

  const mappedNavigation = computed(() => navigation.value?.map(item => processNavigationItem(item)))

  const filteredNavigation = computed(() => mappedNavigation.value?.map((item) => {
    return {
      ...item,
      children: item.children?.filter((child: any) => {
        if (child.framework && child.framework !== framework.value) {
          return false
        }
        if (child.module && child.module !== module.value && !child.path.startsWith('/components')) {
          return false
        }
        return true
      })?.map(processNavigationItemIcon)
    }
  }))

  return {
    mappedNavigation: computed(() => mappedNavigation.value?.map(item => ({
      ...item,
      children: item.children?.map((child: any) => ({ ...child, icon: undefined }))
    }))),
    filteredNavigation
  }
}
