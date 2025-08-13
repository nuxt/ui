<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageChildren } from '@nuxt/content/utils'

const route = useRoute()

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const categories = {
  'getting-started': [{
    id: 'integrations',
    title: 'Integrations'
  }],
  'components': [{
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
    title: 'Content'
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
  }]
}

function groupChildrenByCategory(items: ContentNavigationItem[], slug: string): ContentNavigationItem[] {
  const childrenGroupedByCategory = items.reduce((acc, child) => {
    if (child.category) {
      acc[child.category as string] = [...(acc[child.category as string] || []), child]
    } else {
      acc.__overview = [...(acc.__overview || []), child]
    }
    return acc
  }, {} as Record<string, ContentNavigationItem[]>)

  const grouped = categories[slug as keyof typeof categories]?.map(category => ({
    ...category,
    path: `/docs/${slug}`,
    children: childrenGroupedByCategory[category.id]
  }))?.filter(category => category.children?.length) || []

  if (childrenGroupedByCategory.__overview && childrenGroupedByCategory.__overview.length > 0) {
    grouped.unshift({
      id: 'overview',
      title: 'Overview',
      path: `/docs/${slug}`,
      children: childrenGroupedByCategory.__overview
    })
  }

  return grouped
}

const children = computed(() => {
  const slug = route.params.slug?.[0] as string
  const children = findPageChildren(navigation?.value, `/docs/${slug}`, { indexAsChild: true })?.map(child => ({ ...child, icon: undefined }))

  return groupChildrenByCategory(children, slug)
})
</script>

<template>
  <UMain>
    <UContainer>
      <UPage>
        <template #left>
          <UPageAside>
            <UContentNavigation :navigation="children" variant="link" highlight :ui="{ linkTrailingBadge: 'font-semibold uppercase' }" />
          </UPageAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>
