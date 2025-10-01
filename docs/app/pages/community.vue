<script setup lang="ts">
const { data: page } = await useAsyncData('community', () => queryCollection('community').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  titleTemplate: '%s - Nuxt UI',
  title: page.value.title,
  description: page.value.description,
  ogTitle: `${page.value.title} - Nuxt UI`,
  ogDescription: page.value.description
})

defineOgImageComponent('Docs')
</script>

<template>
  <UMain v-if="page">
    <UPageHero
      :title="page.hero.title"
      :description="page.hero.description"
      class="md:border-b border-default"
      :ui="{
        container: 'relative lg:py-32'
      }"
    >
      <template #top>
        <div class="absolute z-[-1] rounded-full bg-primary blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80" />
      </template>

      <LazyStarsBg />

      <div aria-hidden="true" class="hidden md:block absolute z-[-1] border-x border-default inset-0 mx-4 sm:mx-6 lg:mx-8" />
    </UPageHero>

    <UPageSection>
      <UPageGrid>
        <UPageCard
          v-for="item in page.items"
          :key="item.label"
          :title="item.label"
          :description="item.description"
          :icon="item.icon"
          :to="item.to"
          :target="item.target"
          spotlight
        />
      </UPageGrid>
    </UPageSection>
  </UMain>
</template>
