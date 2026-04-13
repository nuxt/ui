# Docs Layout

Build documentation sites with sidebar navigation, table of contents, and surround links.

## When to use

- Technical documentation sites
- Knowledge bases, help centers
- Any content-heavy site with hierarchical navigation

> Requires `@nuxt/content` module for navigation, search, and TOC.

## Component tree

```
UApp
├── UHeader
├── UMain
│   └── NuxtLayout (docs)
│       └── UPage
│           ├── #left → UPageAside → UContentNavigation
│           └── NuxtPage
│               ├── UPageHeader
│               ├── UPageBody → ContentRenderer + UContentSurround
│               └── #right → UContentToc
└── UFooter
```

## App shell

```vue [app.vue]
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const { data: navigation } = await useAsyncData('navigation', () => queryCollectionNavigation('docs'))

provide('navigation', navigation)

const items = computed<NavigationMenuItem[]>(() => [{
  label: 'Docs',
  to: '/docs/getting-started',
  active: route.path.startsWith('/docs')
}])
</script>

<template>
  <UApp>
    <UHeader>
      <template #title>
        <Logo class="h-6 w-auto" />
      </template>

      <UNavigationMenu :items="items" />

      <template #right>
        <UContentSearchButton />
        <UColorModeButton />
      </template>
    </UHeader>

    <UMain>
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </UMain>

    <UFooter />

    <UContentSearch :navigation="navigation" />
  </UApp>
</template>
```

## Layout

```vue [layouts/docs.vue]
<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')
</script>

<template>
  <UPage>
    <template #left>
      <UPageAside>
        <UContentNavigation :navigation="navigation" />
      </UPageAside>
    </template>

    <slot />
  </UPage>
</template>
```

## Page

```vue [pages/docs/[...slug].vue]
<script setup lang="ts">
const route = useRoute()

definePageMeta({ layout: 'docs' })

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('docs').path(route.path).first()
})

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('docs', route.path)
})
</script>

<template>
  <UPage>
    <UPageHeader :title="page.title" :description="page.description" />

    <UPageBody>
      <ContentRenderer :value="page" />

      <USeparator />

      <UContentSurround :surround="surround" />
    </UPageBody>

    <template #right>
      <UContentToc :links="page.body.toc.links" />
    </template>
  </UPage>
</template>
```

### How nesting works

The outer `UPage` in the layout handles the **left sidebar**. The inner `UPage` in the page handles the **right sidebar**. They nest correctly — this is intentional.

### Common mistakes

- Not providing navigation via `provide`/`inject` — the layout needs it from the app shell.
- Forgetting `UContentSearch` in app.vue — search won't work without it.
- Using `UContentSearchButton` without `UContentSearch` — the button opens search, but the search component must exist.

## Key components

- `UPage` — multi-column grid with `#left`, `#default`, `#right` slots
- `UPageAside` — sticky sidebar wrapper (visible from `lg` breakpoint)
- `UContentNavigation` — sidebar navigation tree from Nuxt Content
- `UContentToc` — table of contents from page headings
- `UContentSurround` — prev/next links
- `UContentSearch` / `UContentSearchButton` — search command palette
- `UPageAnchors` — simpler alternative to full TOC
