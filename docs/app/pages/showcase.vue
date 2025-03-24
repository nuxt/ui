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
  <UMain v-if="page" class="relative max-sm:-mb-[1px] overflow-hidden">
    <LazySkyBg />
    <UContainer>
      <UPageHero
        :title="page.hero.title"
        :description="page.hero.description"
        :links="page.hero.links"
        :ui="{
          container: 'sm:pb-4 md:pb-8 lg:pb-12 border-x border-(--ui-border) mx-4 sm:mx-6 lg:mx-8',
          description: 'text-balance'
        }"
      />
    </UContainer>
    <USeparator />
    <UPageSection :ui="{ container: 'relative !py-0' }" class="transform -translate-y-[1px]">
      <div class="relative">
        <div aria-hidden="true" class="absolute inset-0 border-x border-(--ui-border) mx-4 sm:mx-6 lg:mx-8" />
        <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start justify-center border-t border-(--ui-border) mx-4 sm:mx-6 lg:mx-8">
          <li
            v-for="item in page.items"
            :key="item.name"
            class="relative flex flex-col gap-y-4 justify-start group h-full p-4 hover:bg-(--ui-bg-elevated) border-(--ui-border) border-b max-sm:last:border-b-0 border-r max-sm:border-r-0 sm:even:border-r-0 lg:even:border-r lg:border-r lg:[&:nth-child(4n)]:border-r-0"
          >
            <NuxtLink class="inset-0 absolute" :to="item.url" target="_blank">
              <span class="sr-only">Go to {{ item.name }}</span>
            </NuxtLink>
            <NuxtImg
              :src="`/assets/showcase/${item.name.toLowerCase().replace(/\s/g, '-')}.png`"
              :alt="`Screenshot of ${item.name}`"
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
        <USeparator class="hidden sm:block transform -translate-y-[1px] px-4 sm:px-6 lg:px-8" />
        <div class="hidden sm:block h-full border-x border-(--ui-border) mx-4 sm:mx-6 lg:mx-8" />
      </div>
    </UPageSection>
  </UMain>
</template>
