<script setup lang="ts">
import { joinURL } from 'ufo'
// @ts-expect-error yaml is not typed
import page from '.showcase.yml'

const { url } = useSiteConfig()

useSeoMeta({
  titleTemplate: `%s - Nuxt UI`,
  title: page.title,
  description: page.description,
  ogTitle: `${page.title} - Nuxt UI`,
  ogDescription: page.description,
  ogImage: joinURL(url, '/og-image.png')
})
</script>

<template>
  <UMain>
    <LazySkyBg />
    <UPageHero
      :title="page.hero.title"
      :description="page.hero.description"
      :ui="{
        container: 'pb-0 sm:pb-0',
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
