<script setup lang="ts">
const title = 'Vue Components'
const description = 'Explore 99+ customizable UI components for Vue and Nuxt built with Tailwind CSS and Reka UI.'

useSeoMeta({
  titleTemplate: `%s - Nuxt UI`,
  title,
  description,
  ogTitle: `${title} - Nuxt UI`,
  ogDescription: description
})

defineOgImageComponent('Docs', {
  headline: 'Documentation'
})

const { data: components } = await useAsyncData('components', () => {
  return queryCollection('content')
    .where('path', 'LIKE', '/components/%')
    .where('extension', '=', 'md')
    .select('path', 'title', 'description', 'category', 'module')
    .all()
})

const componentsPerCategory = computed(() => {
  return components.value!.reduce((acc, component) => {
    acc[component.category!] = [...(acc[component.category!] || []), component]
    return acc
  }, {} as Record<string, any[]>)
})

const categories = [{
  category: 'layout',
  title: 'Layout',
  description: 'Structural components for organizing content, including containers, grids, dividers, and responsive layout systems.'
}, {
  category: 'form',
  title: 'Form',
  description: 'Interactive form elements including inputs, selects, checkboxes, radio buttons, and advanced form validation components.'
}, {
  category: 'element',
  title: 'Element',
  description: 'Core UI building blocks like buttons, badges, icons, avatars, and other fundamental interface elements.'
}, {
  category: 'data',
  title: 'Data',
  description: 'Components for displaying and managing data, including tables, lists, cards, data grids, and visualization elements.'
}, {
  category: 'navigation',
  title: 'Navigation',
  description: 'Components for user navigation and wayfinding, including menus, breadcrumbs, pagination, and navigation bars.'
}, {
  category: 'overlay',
  title: 'Overlay',
  description: 'Floating UI elements like modals, dialogs, tooltips, popovers, and other components that overlay the main content.'
}]
</script>

<template>
  <UMain>
    <UPageHero
      description="Build your Vue or Nuxt application faster with Nuxt UI and Nuxt UI Pro components. Powered by Tailwind CSS and Reka UI, delivering responsive and customizable components."
      class="relative"
      orientation="vertical"
      :ui="{ title: 'text-balance' }"
    >
      <template #headline>
        <UButton
          to="https://tailwindcss.com"
          label="Made with Tailwind CSS v4"
          size="md"
          variant="subtle"
          color="neutral"
          icon="i-logos-tailwindcss-icon"
          class="rounded-full"
        />
      </template>
      <template #title>
        Build beautiful UI with <span class="text-(--ui-primary)">{{ components!.length }}+</span> powerful components
      </template>
      <template #links>
        <UButton
          to="/getting-started/installation/vue"
          label="Start with Vue"
          icon="i-logos-vue"
          color="neutral"
          variant="outline"
          size="xl"
        />
        <UButton
          to="/getting-started/installation/nuxt"
          label="Start with Nuxt"
          icon="i-logos-nuxt-icon"
          color="neutral"
          variant="outline"
          size="xl"
        />
      </template>
      <template #top>
        <div class="absolute z-[-1] rounded-full bg-(--ui-primary) blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80" />
        <StarsBg />
      </template>
    </UPageHero>

    <UContainer>
      <template v-for="category in categories" :key="category.category">
        <UPageHeader :title="category.title" :description="category.description" class="mb-8" />
        <UPageGrid class="xl:grid-cols-4 pb-24">
          <UPageCard
            v-for="(component, index) in componentsPerCategory[category.category]"
            :key="component.path"
            variant="naked"
            :title="component.title"
            :description="component.description"
            :to="component.path"
            :ui="{ wrapper: 'order-last', container: 'lg:flex' }"
          >
            <template #title>
              <div class="flex items-center gap-1.5">
                <span>{{ component.title }}</span>
                <UBadge v-if="component.module === 'ui-pro'" label="PRO" size="sm" variant="subtle" />
              </div>
            </template>

            <div class="group rounded-[calc(var(--ui-radius)*1.5)] border border-(--ui-border-muted) overflow-hidden aspect-[16/9]">
              <UColorModeImage
                :light="`${component.path.replace('/components/', '/components/light/')}.png`"
                :dark="`${component.path.replace('/components/', '/components/dark/')}.png`"
                class="group-hover:scale-105 transition-transform size-full"
                :loading="index >= 4 ? 'lazy' : 'eager'"
                width="640"
                height="360"
              />
            </div>
          </UPageCard>
        </UPageGrid>
      </template>
    </UContainer>
  </UMain>
</template>
