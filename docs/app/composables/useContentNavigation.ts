import type { ContentNavigationItem } from '@nuxt/content'

function processNavigationItem(item: ContentNavigationItem, parent?: ContentNavigationItem): any {
  if (item.shadow) {
    return item.children?.map(child => processNavigationItem(child, item))
  }

  return {
    ...item,
    title: parent?.title || item.title,
    class: item.framework ? `${item.framework}-only` : undefined,
    children: item.children?.length ? item.children?.flatMap(child => processNavigationItem(child)) : undefined
  }
}

export const useContentNavigation = (navigation: Ref<ContentNavigationItem[] | undefined>) => {
  const { framework } = useSharedData()

  const mappedNavigation = computed(() => navigation.value?.map(item => processNavigationItem(item)))
  const filteredNavigation = computed(() => mappedNavigation.value?.map((item) => {
    return {
      ...item,
      children: item.children?.filter((child: any) => !child.framework || child.framework === framework.value)
    }
  }))

  return {
    mappedNavigation,
    filteredNavigation
  }
}
