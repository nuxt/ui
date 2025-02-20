<script setup lang="ts">
useSeoMeta({
  titleTemplate: `%s - Nuxt UI`,
  title: 'Vue Components',
  ogTitle: 'Vue Components - Nuxt UI',
  description: 'Discover all the UI components available in both Nuxt UI and Nuxt UI Pro.'
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

const categories = [
  {
    category: 'layout',
    title: 'Layout',
    description: 'Headers, footers, and other layout components.'
  },
  {
    category: 'form',
    title: 'Form',
    description: 'Input fields, checkboxes, and other form components.'
  },
  {
    category: 'element',
    title: 'Element',
    description: 'Buttons, icons, and other visual elements.'
  },
  {
    category: 'data',
    title: 'Data',
    description: 'Tables, lists, and other content related components.'
  },
  {
    category: 'navigation',
    title: 'Navigation',
    description: 'Menus, breadcrumbs, and other navigation components.'
  },
  {
    category: 'overlay',
    title: 'Overlay',
    description: 'Modals, tooltips, and other overlay components.'
  }
]
</script>

<template>
  <UMain>
    <UPageHero
      description="Build your Vue or Nuxt application faster with Nuxt UI and Nuxt UI Pro components. Powered by Tailwind CSS and  Reka UI, all the components are responsive & customizable."
      class="relative"
      orientation="vertical"
    >
      <template #headline>
        <UButton
          to="https://tailwindcss.com"
          label="Made with Tailwind CSS v4"
          size="md"
          variant="subtle"
          color="neutral"
          icon="i-logos-tailwindcss-icon"
        />
      </template>
      <template #title>
        Craft your UI with <span class="text-(--ui-primary)">{{ components!.length }} components</span>.
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
      <div v-for="category in categories" :key="category.category">
        <UPageHeader :title="category.title" :description="category.description" class="mb-8" />
        <UPageGrid class="xl:grid-cols-4 pb-24">
          <UPageCard
            v-for="component in componentsPerCategory[category.category]"
            :key="component.path"
            variant="naked"
            :title="component.title"
            :description="component.description"
            :to="component.path"
            :ui="{ wrapper: 'order-last' }"
          >
            <template #title>
              <div class="flex items-center justify-between">
                <span>{{ component.title }}</span>
                <UBadge v-if="component.module === 'ui-pro'" label="PRO" size="sm" variant="subtle" />
              </div>
            </template>
            <div class="group rounded-(--ui-radius) border border-(--ui-border) overflow-hidden aspect-[16/9]">
              <UColorModeImage :light="`${component.path.replace('/components/', '/components/light/')}.png`" :dark="`${component.path.replace('/components/', '/components/dark/')}.png`" class="inline-block group-hover:scale-105 transition-transform" />
            </div>
          </UPageCard>
        </UPageGrid>
      </div>
    </UContainer>
  </UMain>
</template>
