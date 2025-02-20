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
</script>

<template>
  <UMain>
    <UPageHero
      :title="`Craft your UI with ${components!.length} components.`"
      description="Build your Vue or Nuxt application faster with Nuxt UI and Nuxt UI Pro components. Powered by Tailwind CSS and  Reka UI, all the components are responsive & customizable."
      class="relative"
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
      <UPageGrid class="xl:grid-cols-4 pb-24">
        <UPageCard
          v-for="component in components"
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
          <div class="group rounded-(--ui-radius) border border-(--ui-border) overflow-hidden aspect-[16/9] bg-slate-100 dark:bg-slate-950">
            <UColorModeImage :light="`${component.path.replace('/components/', '/components/light/')}.png`" :dark="`${component.path.replace('/components/', '/components/dark/')}.png`" class="inline-block group-hover:scale-105 transition-transform" />
          </div>
        </UPageCard>
      </UPageGrid>
    </UContainer>
  </UMain>
</template>
