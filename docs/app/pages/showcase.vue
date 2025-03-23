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
      :links="page.hero.links"
      :ui="{
        container: 'sm:pb-4 md:pb-8 lg:pb-12',
        description: 'text-balance'
      }"
    />
    <USeparator class="transform translate-y-[1px]" />
    <UPageSection
      :ui="{
        container: 'relative !py-0'
      }"
    >
      <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start justify-center border border-(--ui-border) mx-4 sm:mx-6 lg:mx-8">
        <li
          v-for="(item, index) in page.items"
          :key="item.name"
          class="relative flex flex-col gap-y-4 justify-start group h-full p-4 hover:bg-(--ui-bg-elevated)"
          :class="[
            index % 4 !== 3 ? 'border-r' : '',
            index < page.items.length - (page.items.length % 4 || 4) ? 'border-b' : '',
            'border-(--ui-border)'
          ]"
        >
          <NuxtLink class="inset-0 absolute" :to="item.url" aria-hidden="true" />
          <NuxtImg
            v-if="item.name"
            :src="`/assets/showcase/${item.name.toLowerCase().replace(/\s/g, '-')}.png`"
            :alt="item.name"
            lazy
          />
          <div class="flex items-center gap-1">
            <span class="font-medium">
              {{ item.name }}
            </span>
            <UIcon name="i-lucide-move-right" class="size-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0" />
          </div>
        </li>
      </ul>
    </UPageSection>
    <USeparator class="hidden sm:block transform -translate-y-[1px]" />
    <!--    <UPageGrid class="lg:grid-cols-3 z-10">
      <ShowcaseItem
        v-for="item in page.items"
        :key="item.name"
        :name="item.name"
        :url="item.url"
      />
    </UPageGrid> -->
  </UMain>
</template>
