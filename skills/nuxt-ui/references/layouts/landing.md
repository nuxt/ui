# Landing Page Layout

Build public-facing pages — landing, blog, changelog, pricing — using the Header + Main + Footer shell with Page components.

## When to use

- Marketing sites, product pages, company sites
- Blog and content pages
- Pricing, changelog, portfolio pages
- Any public-facing page that isn't a dashboard or documentation

## App shell

```vue [app.vue]
<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const items = computed<NavigationMenuItem[]>(() => [{
  label: 'Features',
  to: '#features'
}, {
  label: 'Pricing',
  to: '/pricing'
}, {
  label: 'Blog',
  to: '/blog'
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
        <UColorModeButton />
        <UButton label="Sign in" color="neutral" variant="ghost" />
        <UButton label="Get started" />
      </template>

      <template #body>
        <UNavigationMenu :items="items" orientation="vertical" class="-mx-2.5" />
      </template>
    </UHeader>

    <UMain>
      <NuxtPage />
    </UMain>

    <UFooter>
      <template #left>
        <p class="text-muted text-sm">Copyright © {{ new Date().getFullYear() }}</p>
      </template>
      <template #right>
        <UButton icon="i-simple-icons-github" color="neutral" variant="ghost" to="https://github.com" target="_blank" />
      </template>
    </UFooter>
  </UApp>
</template>
```

### Common mistakes

- Forgetting the `#body` slot on `UHeader` — this is the mobile menu content. Without it, mobile users have no navigation.
- Using `variant="solid"` for both header and hero buttons — the header button should be lower weight than the hero CTA.

## Landing page

```vue [pages/index.vue]
<template>
  <UPageHero
    title="Build faster with Nuxt UI"
    description="A comprehensive Vue UI component library."
    :links="[
      { label: 'Get started', to: '/docs', icon: 'i-lucide-square-play' },
      { label: 'Learn more', color: 'neutral', variant: 'subtle', trailingIcon: 'i-lucide-arrow-right' }
    ]"
    orientation="horizontal"
  >
    <img src="/hero-image.png" alt="App screenshot" class="rounded-lg shadow-2xl ring ring-default" />
  </UPageHero>

  <UPageSection
    id="features"
    headline="Features"
    title="Everything you need"
    description="A comprehensive suite of components and utilities."
    :features="[
      { title: 'Accessible', description: 'Built on Reka UI with full ARIA support.', icon: 'i-lucide-accessibility' },
      { title: 'Customizable', description: 'Tailwind Variants theming with full control.', icon: 'i-lucide-palette' },
      { title: 'Responsive', description: 'Mobile-first components.', icon: 'i-lucide-monitor-smartphone' }
    ]"
  />

  <UPageCTA
    title="Trusted by thousands of developers"
    description="Join the community and start building today."
    :links="[
      { label: 'Get started', color: 'neutral' },
      { label: 'Star on GitHub', color: 'neutral', variant: 'subtle', trailingIcon: 'i-lucide-arrow-right' }
    ]"
  />

  <UPageSection id="pricing" headline="Pricing" title="Simple, transparent pricing">
    <UPricingPlans
      :plans="[
        { title: 'Free', price: '$0', description: 'For personal projects', features: ['10 components', 'Community support'] },
        { title: 'Pro', price: '$99', description: 'For teams', features: ['All components', 'Priority support'], highlight: true },
        { title: 'Enterprise', price: 'Custom', description: 'For large teams', features: ['Custom components', 'Dedicated support'] }
      ]"
    />
  </UPageSection>
</template>
```

## Key components

- `UPageHero` — hero with title, description, links, and optional media. Use `orientation="horizontal"` for side-by-side layout.
- `UPageSection` — content section with headline, title, description, and `features` grid. Use `id` for anchor links.
- `UPageCTA` — call to action block.
- `UPageGrid` / `UPageCard` — card grid for features, testimonials, etc.
- `UPageFeature` — individual feature item.
- `UPageLogos` — logo wall for social proof.
- `UPricingPlans` / `UPricingTable` — pricing cards and comparison tables.
- `UFooterColumns` — multi-column footer with link groups (used inside `UFooter`).

## Variations

### Alternating feature sections

```vue
<UPageSection title="Feature A" orientation="horizontal">
  <img src="/feature-a.png" />
</UPageSection>

<UPageSection title="Feature B" orientation="horizontal" reverse>
  <img src="/feature-b.png" />
</UPageSection>
```

### Blog listing

```vue [pages/blog/index.vue]
<script setup lang="ts">
const { data: posts } = await useAsyncData('posts', () => queryCollection('posts').all())
</script>

<template>
  <UPage>
    <UPageHero title="Blog" description="The latest news and updates." />
    <UPageBody>
      <UContainer>
        <UBlogPosts>
          <UBlogPost v-for="post in posts" :key="post.path" v-bind="post" :to="post.path" />
        </UBlogPosts>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
```

### Changelog

```vue [pages/changelog.vue]
<script setup lang="ts">
const { data: versions } = await useAsyncData('versions', () => queryCollection('changelog').all())
</script>

<template>
  <UPage>
    <UPageHero title="Changelog" />
    <UPageBody>
      <UContainer>
        <UChangelogVersions>
          <UChangelogVersion v-for="version in versions" :key="version.path" v-bind="version" />
        </UChangelogVersions>
      </UContainer>
    </UPageBody>
  </UPage>
</template>
```
