<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageChildren } from '@nuxt/content/utils'

const route = useRoute()

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const categories = [{
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
  id: 'dashboard',
  title: 'Dashboard'
}, {
  id: 'ai',
  title: 'AI'
}, {
  id: 'color-mode',
  title: 'Color Mode'
}, {
  id: 'i18n',
  title: 'Internationalization (i18n)'
}]

function groupChildrenByCategory(items: ContentNavigationItem[]): ContentNavigationItem[] {
  const childrenGroupedByCategory = items.reduce((acc, child) => {
    if (child.category) {
      acc[child.category as string] = [...(acc[child.category as string] || []), child]
    }
    return acc
  }, {} as Record<string, ContentNavigationItem[]>)

  return categories.map(category => ({
    ...category,
    path: `/docs/components`,
    children: childrenGroupedByCategory[category.id]
  }))
}

const children = computed(() => {
  const children = findPageChildren(navigation?.value, `/docs/${route.params.slug?.[0]}`, { indexAsChild: true })

  return route.params.slug?.[0] === 'components' ? groupChildrenByCategory(children) : children
})
</script>

<template>
  <UMain>
    <UContainer>
      <UPage>
        <template #left>
          <UPageAside>
            <UContentNavigation :navigation="children" :ui="{ linkTrailingBadge: 'font-semibold uppercase' }" />
          </UPageAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>
