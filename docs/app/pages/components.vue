<script setup lang="ts">
definePageMeta({
  layout: 'docs'
})

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
    .select('path', 'title', 'description', 'category')
    .all()
})
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader title="Vue Components" description="Discover all the UI components available in both Nuxt UI and Nuxt UI Pro." />
      <UPageBody>
        <UPageGrid>
          <UPageCard
            v-for="component in components"
            :key="component.path"
            variant="naked"
            :title="component.title"
            :description="component.description"
            :to="component.path"
            reverse
          >
            <div class="group rounded-(--ui-radius) border border-(--ui-border) overflow-hidden aspect-[16/9]">
              <NuxtImg :src="`${component.path}.png`" width="384" height="216" class="inline-block group-hover:scale-105 transition-transform" />
            </div>
          </UPageCard>
        </UPageGrid>
      </UPageBody>
    </UPage>
  </UContainer>
</template>
