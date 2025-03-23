<script setup lang="ts">
import { joinURL } from 'ufo'

const { data: page } = await useAsyncData('showcase-landing', () => {
  return queryCollection('showcase').first()
})

if (!page.value)
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })

const { url } = useSiteConfig()

useSeoMeta({
  titleTemplate: `%s - Nuxt UI`,
  title: page.value.title,
  description: page.value.description,
  ogTitle: `${page.value.title} - Nuxt UI`,
  ogDescription: page.value.description,
  ogImage: joinURL(url, '/og-image.png')
})
</script>

<template>
  <UMain v-if="page">
    <LazySkyBg />
    <UPageHero
      :title="page.hero.title"
      :description="page.hero.description"
      :ui="{
        container: 'sm:pb-0',
        description: 'text-balance'
      }"
    />
    <UContainer>
      <UPageGrid class="lg:grid-cols-3 z-10">
        <ShowcaseItem
          v-for="item in page.items"
          :key="item.name"
          :name="item.name"
          :url="item.url"
        />
      </UPageGrid>
    </UContainer>
  </UMain>
</template>
