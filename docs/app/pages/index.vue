<script setup lang="ts">
import { joinURL } from 'ufo'
// @ts-expect-error yaml is not typed
import page from '.index.yml'

const { url } = useSiteConfig()

useSeoMeta({
  titleTemplate: `%s - Nuxt UI`,
  title: page.title,
  description: page.description,
  ogTitle: `${page.title} - Nuxt UI`,
  ogDescription: page.description,
  ogImage: joinURL(url, '/og-image.png')
})

const { data: components } = await useAsyncData('ui-components', () => {
  return queryCollection('content')
    .where('path', 'LIKE', '/components/%')
    .where('extension', '=', 'md')
    .where('module', 'IS NULL')
    .select('path', 'title', 'description', 'category', 'module')
    .all()
})
</script>

<template>
  <UMain>
    <UPageHero
      orientation="horizontal"
      class="border-b border-(--ui-border)"
      :ui="{ container: 'lg:py-0', description: 'text-balance' }"
    >
      <template #title>
        <MDC :value="page.hero.title" unwrap="p" />
      </template>
      <template #description>
        {{ page.hero.description }}
      </template>
      <template #links>
        <UButton v-for="link of page.hero.links" :key="link.label" v-bind="link" size="xl" />
        <div class="w-full my-6">
          <USeparator class="w-1/2" type="dashed" />
        </div>
        <div class="flex flex-col gap-4">
          <UPageFeature v-for="feature of page.hero.features" :key="feature.title" v-bind="feature" />
        </div>
      </template>
      <div class="h-[344px] lg:h-auto lg:relative w-full lg:min-h-[calc(100vh-var(--ui-header-height)-1px)] overflow-hidden">
        <UPageMarquee
          pause-on-hover
          :overlay="false"
          :ui="{
            root: '[--gap:--spacing(4)] [--duration:40s] border-(--ui-border-muted) absolute w-full left-0 border-y lg:border-x lg:w-[calc(50%-6px)] 2xl:w-[320px] lg:flex-col',
            content: 'lg:w-auto lg:h-full lg:flex-col lg:animate-[marquee-vertical_var(--duration)_linear_infinite] lg:rtl:animate-[marquee-vertical-rtl_var(--duration)_linear_infinite] lg:h-[fit-content]'
          }"
        >
          <ULink
            v-for="component of components?.slice(0, 10)"
            :key="component.path"
            class="relative group aspect-video border-(--ui-border-muted) w-[290px] xl:w-[330px] 2xl:w-[320px] 2xl:p-2 2xl:border-y"
            :to="component.path"
          >
            <UColorModeImage

              :light="`${component.path.replace('/components/', '/components/light/')}.png`"
              :dark="`${component.path.replace('/components/', '/components/dark/')}.png`"
              class="hover:scale-105 lg:hover:scale-110 transition-transform aspect-video w-full border-x lg:border-x-0 lg:border-y border-(--ui-border-muted) 2xl:border-y-0"
            />
            <UBadge color="neutral" variant="outline" size="md" :label="component.title" class="hidden lg:block absolute mx-auto top-4 left-6 xl:left-4 group-hover:opacity-100 opacity-0 transition-opacity duration-300 pointer-events-none" />
          </ULink>
        </UPageMarquee>
        <UPageMarquee
          pause-on-hover
          reverse
          :overlay="false"
          :ui="{
            root: '[--gap:--spacing(4)] [--duration:40s] border-(--ui-border-muted) absolute w-full mt-[180px] left-0 border-y lg:mt-auto lg:left-auto lg:border-y-0 lg:border-x lg:w-[calc(50%-6px)] 2xl:w-[320px] lg:right-0 lg:flex-col',
            content: 'lg:w-auto lg:h-full lg:flex-col lg:animate-[marquee-vertical_var(--duration)_linear_infinite] lg:rtl:animate-[marquee-vertical-rtl_var(--duration)_linear_infinite] lg:h-[fit-content] lg:[animation-direction:reverse]'
          }"
        >
          <ULink
            v-for="component of components?.slice(10, 20)"
            :key="component.path"
            class="relative group aspect-video border-(--ui-border-muted) w-[290px] xl:w-[330px] 2xl:w-[320px] 2xl:p-2 2xl:border-y"
            :to="component.path"
          >
            <UColorModeImage

              :light="`${component.path.replace('/components/', '/components/light/')}.png`"
              :dark="`${component.path.replace('/components/', '/components/dark/')}.png`"
              class="hover:scale-105 lg:hover:scale-110 transition-transform aspect-video w-full border-x lg:border-x-0 lg:border-y border-(--ui-border-muted) 2xl:border-y-0"
            />
            <UBadge color="neutral" variant="outline" size="md" :label="component.title" class="hidden lg:block absolute mx-auto top-4 left-6 xl:left-4 group-hover:opacity-100 opacity-0 transition-opacity duration-300 pointer-events-none" />
          </ULink>
        </UPageMarquee>
      </div>
    </UPageHero>
    <UPageSection :ui="{ container: 'py-6 sm:py-12 lg:py-12' }">
      <ul class="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 lg:gap-x-8 lg:gap-y-8 xl:gap-y-10">
        <li
          v-for="feature in page?.features"
          :key="feature.title"
          class="flex items-start gap-x-3 relative group"
          :class="{ 'opacity-75': feature.soon }"
        >
          <NuxtLink v-if="feature.to" :to="feature.to" class="absolute inset-0 z-10" />
          <div class="relative p-3">
            <svg class="absolute inset-0" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg">
              <line x1="6.5" x2="6.5" y2="44" stroke="var(--ui-border)" />
              <line x1="38.5" x2="38.5" y2="44" stroke="var(--ui-border)" />
              <line y1="5.5" x2="44" y2="5.5" stroke="var(--ui-border)" />
              <line y1="37.5" x2="44" y2="37.5" stroke="var(--ui-border)" />
              <circle cx="6.53613" cy="5.45508" r="1.5" fill="var(--ui-border-accented)" />
              <circle cx="38.5957" cy="5.45508" r="1.5" fill="var(--ui-border-accented)" />
              <circle cx="6.53711" cy="37.4551" r="1.5" fill="var(--ui-border-accented)" />
              <circle cx="38.5957" cy="37.4551" r="1.5" fill="var(--ui-border-accented)" />
            </svg>
            <UIcon :name="feature.icon" class="size-5 flex-shrink-0" />
          </div>
          <div class="flex flex-col">
            <h2 class="font-medium text-(--ui-text-highlighted) inline-flex items-center gap-x-1">
              {{ feature.title }} <UBadge v-if="feature.soon" color="neutral" variant="subtle" size="sm" class="rounded-full">
                Soon
              </UBadge>
              <UIcon v-if="feature.to" name="i-lucide-arrow-right" class="size-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0" />
            </h2>
            <p class="text-sm text-(--ui-text-muted)">
              {{ feature.description }}
            </p>
          </div>
        </li>
      </ul>
    </UPageSection>
  </UMain>
</template>
