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

const { data: module } = await useFetch<{
  stats: {
    downloads: number
    stars: number
  }
  contributors: {
    username: string
  }[]
}>('https://api.nuxt.com/modules/ui', {
  key: 'stats',
  transform: ({ stats, contributors }) => ({ stats, contributors })
})

const { format } = Intl.NumberFormat('en', { notation: 'compact' })

const contributorsRef = ref(null)
const isContributorsInView = ref(false)
const isContributorsHovered = useElementHover(contributorsRef)

useIntersectionObserver(contributorsRef, ([entry]) => {
  isContributorsInView.value = entry?.isIntersecting || false
})
</script>

<template>
  <UMain>
    <UPageHero
      orientation="horizontal"
      :ui="{
        container: 'pb-0 sm:pb-0 lg:py-0',
        title: 'lg:mt-16',
        links: 'lg:mb-16',
        description: 'text-balance'
      }"
    >
      <template #title>
        The Intuitive <br> <span class="text-(--ui-primary)">Vue UI Library</span>
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
          <Motion
            v-for="(feature, index) in page.hero.features"
            :key="feature.title"
            as-child
            :initial="{ opacity: 0, transform: 'translateX(-10px)' }"
            :while-in-view="{ opacity: 1, transform: 'translateX(0)' }"
            :transition="{ delay: 0.2 + 0.4 * index }"
            :in-view-options="{ once: true }"
          >
            <UPageFeature v-bind="feature" class="opacity-0" />
          </Motion>
        </div>
      </template>

      <SkyBg />

      <div class="h-[344px] lg:h-full lg:relative w-full lg:min-h-[calc(100vh-var(--ui-header-height)-1px)] overflow-hidden">
        <UPageMarquee
          pause-on-hover
          :overlay="false"
          :ui="{
            root: '[--gap:--spacing(4)] [--duration:40s] border-(--ui-border) absolute w-full left-0 border-y lg:border-x lg:border-y-0 lg:w-[calc(50%-6px)] 2xl:w-[320px] lg:flex-col',
            content: 'lg:w-auto lg:h-full lg:flex-col lg:animate-[marquee-vertical_var(--duration)_linear_infinite] lg:rtl:animate-[marquee-vertical-rtl_var(--duration)_linear_infinite] lg:h-[fit-content]'
          }"
        >
          <ULink
            v-for="component of components?.slice(0, 10)"
            :key="component.path"
            class="relative group/link aspect-video border-(--ui-border) w-[290px] xl:w-[330px] 2xl:w-[320px] 2xl:p-2 2xl:border-y"
            :to="component.path"
          >
            <UColorModeImage

              :light="`${component.path.replace('/components/', '/components/light/')}.png`"
              :dark="`${component.path.replace('/components/', '/components/dark/')}.png`"
              class="hover:scale-105 lg:hover:scale-110 transition-transform aspect-video w-full border-x lg:border-x-0 lg:border-y border-(--ui-border) 2xl:border-y-0"
            />
            <UBadge color="neutral" variant="outline" size="md" :label="component.title" class="hidden lg:block absolute mx-auto top-4 left-6 xl:left-4 group-hover/link:opacity-100 opacity-0 transition-all duration-300 pointer-events-none -translate-y-2 group-hover/link:translate-y-0" />
          </ULink>
        </UPageMarquee>

        <UPageMarquee
          pause-on-hover
          reverse
          :overlay="false"
          :ui="{
            root: '[--gap:--spacing(4)] [--duration:40s] border-(--ui-border) absolute w-full mt-[180px] left-0 border-y lg:mt-auto lg:left-auto lg:border-y-0 lg:border-x lg:w-[calc(50%-6px)] 2xl:w-[320px] lg:right-0 lg:flex-col',
            content: 'lg:w-auto lg:h-full lg:flex-col lg:animate-[marquee-vertical_var(--duration)_linear_infinite] lg:rtl:animate-[marquee-vertical-rtl_var(--duration)_linear_infinite] lg:h-[fit-content] lg:[animation-direction:reverse]'
          }"
        >
          <ULink
            v-for="component of components?.slice(10, 20)"
            :key="component.path"
            class="relative group/link aspect-video border-(--ui-border) w-[290px] xl:w-[330px] 2xl:w-[320px] 2xl:p-2 2xl:border-y"
            :to="component.path"
          >
            <UColorModeImage
              :light="`${component.path.replace('/components/', '/components/light/')}.png`"
              :dark="`${component.path.replace('/components/', '/components/dark/')}.png`"
              class="hover:scale-105 lg:hover:scale-110 transition-transform aspect-video w-full border-x lg:border-x-0 lg:border-y border-(--ui-border) 2xl:border-y-0"
            />
            <UBadge color="neutral" variant="outline" size="md" :label="component.title" class="hidden lg:block absolute mx-auto top-4 left-6 xl:left-4 group-hover/link:opacity-100 opacity-0 transition-all duration-300 pointer-events-none -translate-y-2 group-hover/link:translate-y-0" />
          </ULink>
        </UPageMarquee>
      </div>
    </UPageHero>

    <USeparator />

    <UPageSection :ui="{ container: 'lg:py-16' }">
      <ul class="grid grid-cols-1 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 gap-y-6 lg:gap-x-8 lg:gap-y-8 xl:gap-y-10">
        <Motion
          v-for="(feature, index) in page?.features"
          :key="feature.title"
          as="li"
          :initial="{ opacity: 0, transform: 'translateY(10px)' }"
          :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
          :transition="{ delay: 0.1 * index }"
          :in-view-options="{ once: true }"
          class="flex items-start gap-x-3 relative group"
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
              {{ feature.title }}
              <UIcon v-if="feature.to" name="i-lucide-arrow-right" class="size-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0" />
            </h2>
            <p class="text-sm text-(--ui-text-muted)">
              {{ feature.description }}
            </p>
          </div>
        </Motion>
      </ul>
    </UPageSection>

    <USeparator />

    <UPageSection
      :title="page.design_system.title"
      :description="page.design_system.description"
      :features="page.design_system.features"
      :links="page.design_system.links"
      orientation="horizontal"
    >
      <MDC :value="page.design_system.code" cache-key="index-design-system-code" />
    </UPageSection>

    <USeparator />

    <UPageSection
      :title="page.component_customization.title"
      :features="page.component_customization.features"
      :links="page.component_customization.links"
      orientation="horizontal"
    >
      <template #description>
        <MDC :value="page.component_customization.description" cache-key="index-component-customization-description" />
      </template>

      <MDC :value="page.component_customization.code" cache-key="index-component-customization-code" />
    </UPageSection>

    <USeparator />

    <UPageSection
      :title="page.community.title"
      :description="page.community.description"
      :links="page.community.links"
      orientation="horizontal"
      :ui="{ features: 'flex items-center gap-4 lg:gap-8' }"
      class="border-b border-(--ui-border)"
    >
      <template #features>
        <NuxtLink to="https://npm.chart.dev/@nuxt/ui" target="_blank" class="min-w-0">
          <p class="text-4xl font-semibold text-(--ui-text-highlighted) truncate">
            {{ format(module?.stats?.downloads ?? 0) }}+
          </p>
          <p class="text-(--ui-text-muted) text-sm truncate">monthly downloads</p>
        </NuxtLink>

        <NuxtLink to="https://github.com/nuxt/ui" target="_blank" class="min-w-0">
          <p class="text-4xl font-semibold text-(--ui-text-highlighted) truncate">
            {{ format(module?.stats?.stars ?? 0) }}+
          </p>
          <p class="text-(--ui-text-muted) text-sm truncate">GitHub stars</p>
        </NuxtLink>

        <NuxtLink to="https://github.com/nuxt/ui/graphs/contributors" target="_blank" class="min-w-0">
          <p class="text-4xl font-semibold text-(--ui-text-highlighted) truncate">
            175+
          </p>
          <p class="text-(--ui-text-muted) text-sm truncate">Contributors</p>
        </NuxtLink>
      </template>

      <div ref="contributorsRef" class="p-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 overflow-hidden flex relative">
        <LazyHomeContributors :contributors="module?.contributors" :paused="!isContributorsInView || isContributorsHovered" />
      </div>
    </UPageSection>

    <UPageSection :ui="{ container: 'relative !pb-0 overflow-hidden' }">
      <template #title>
        Build faster with Nuxt UI <span class="text-(--ui-primary)">Pro</span>.
      </template>
      <template #description>
        A collection of premium Vue components, composables and utils built on top of Nuxt UI. <br> Focused on structure and layout, these <span class="text-(--ui-text)">responsive components</span> are designed to be the perfect <span class="text-(--ui-text)">building blocks for your next idea</span>.
      </template>
      <template #links>
        <UButton to="/pro" size="lg">
          Discover Nuxt UI Pro
        </UButton>
        <UButton to="/pro/templates" size="lg" variant="outline" trailing-icon="i-lucide-arrow-right" color="neutral">
          Explore templates
        </UButton>
      </template>

      <StarsBg />

      <div aria-hidden="true" class="hidden lg:block absolute z-[-1] border-x border-(--ui-border) inset-0 mx-4 sm:mx-6 lg:mx-8" />
      <div class="relative h-[400px] border border-(--ui-border) bg-(--ui-bg-muted) overflow-hidden border-x-0 -mx-4 sm:-mx-6 lg:mx-0 lg:border-x w-screen lg:w-full">
        <UPageMarquee reverse orientation="vertical" :overlay="false" :ui="{ root: '[--duration:40s] absolute w-[460px] -left-[100px] -top-[300px] h-[940px] transform-3d rotate-x-55 rotate-y-0 rotate-z-30' }">
          <img
            v-for="i in 4"
            :key="i"
            :src="`/pro/blocks/image${i}.png`"
            width="460"
            height="258"
            loading="lazy"
            :alt="`Nuxt UI Pro Screenshot ${i}`"
            class="aspect-video border border-(--ui-border) rounded-[calc(var(--ui-radius)*2)] bg-white"
          >
        </UPageMarquee>
        <UPageMarquee orientation="vertical" :overlay="false" :ui="{ root: '[--duration:40s] absolute w-[460px] -top-[400px] left-[480px] h-[1160px] transform-3d rotate-x-55 rotate-y-0 rotate-z-30' }">
          <img
            v-for="i in [5, 6, 7, 8]"
            :key="i"
            :src="`/pro/blocks/image${i}.png`"
            width="460"
            height="258"
            loading="lazy"
            :alt="`Nuxt UI Pro Screenshot ${i}`"
            class="aspect-video border border-(--ui-border) rounded-[calc(var(--ui-radius)*2)] bg-white"
          >
        </UPageMarquee>
        <UPageMarquee reverse orientation="vertical" :overlay="false" :ui="{ root: 'hidden md:flex [--duration:40s] absolute w-[460px] -top-[300px] left-[1020px] h-[1060px] transform-3d rotate-x-55 rotate-y-0 rotate-z-30' }">
          <img
            v-for="i in [9, 10, 11, 12]"
            :key="i"
            :src="`/pro/blocks/image${i}.png`"
            width="460"
            height="258"
            :alt="`Nuxt UI Pro Screenshot ${i}`"
            loading="lazy"
            class="aspect-video border border-(--ui-border) rounded-[calc(var(--ui-radius)*2)] bg-white"
          >
        </UPageMarquee>
      </div>
    </UPageSection>
  </UMain>
</template>
