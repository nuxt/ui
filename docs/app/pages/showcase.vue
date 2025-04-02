<script setup lang="ts">
import { joinURL } from 'ufo'

const { data: page } = await useAsyncData('showcase', () => queryCollection('showcase').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

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
    <UPageHero
      :title="page.hero.title"
      :description="page.hero.description"
      :links="page.hero.links"
      :ui="{
        wrapper: 'lg:px-12',
        container: 'relative'
      }"
    >
      <template #top>
        <div class="absolute z-[-1] rounded-full bg-(--ui-primary) blur-[300px] size-60 sm:size-80 transform -translate-x-1/2 left-1/2 -translate-y-80" />
      </template>

      <LazyStarsBg />

      <div aria-hidden="true" class="hidden lg:block absolute z-[-1] border-x border-(--ui-border) inset-0 mx-4 sm:mx-6 lg:mx-8" />

      <div class="border border-(--ui-border) bg-(--ui-bg)">
        <ul class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start justify-center">
          <li
            v-for="item in page.items"
            :key="item.name"
            class="relative flex flex-col gap-y-4 justify-start group h-full p-4 hover:bg-(--ui-bg-elevated)/50 border-(--ui-border) border-b max-sm:last:border-b-0 border-r max-sm:border-r-0 sm:even:border-r-0 lg:even:border-r lg:border-r lg:[&:nth-child(4n)]:border-r-0 lg:[&:nth-child(5n)]:border-b-0 lg:[&:nth-child(6n)]:border-b-0"
          >
            <NuxtLink class="inset-0 absolute" :to="item.url" target="_blank">
              <span class="sr-only">Go to {{ item.name }}</span>
            </NuxtLink>

            <NuxtImg
              :src="`/assets/showcase/${item.name.toLowerCase().replace(/\s/g, '-')}.png`"
              :alt="`Screenshot of ${item.name}`"
              width="311"
              height="194"
              class="rounded-[calc(var(--ui-radius)*1.5)] group-hover:scale-103 duration-200 transition-transform pointer-events-none"
            />

            <div class="flex items-center gap-1 px-1">
              <span class="font-medium text-(--ui-text-highlighted)">
                {{ item.name }}
              </span>
              <UIcon name="i-lucide-arrow-right" class="size-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0 text-(--ui-text-muted)" />
            </div>
          </li>
        </ul>
      </div>
    </UPageHero>
  </UMain>
</template>
