<script setup lang="ts">
import { joinURL } from 'ufo'

const { url } = useSiteConfig()

const title = 'The Intuitive Vue UI Library'
const description = 'Create beautiful, responsive & accessible web apps quickly with Vue or Nuxt. Nuxt UI is an open-source UI library of 50+ customizable components built with Tailwind CSS and Reka UI.'

useSeoMeta({
  titleTemplate: `%s - Nuxt UI`,
  title,
  description,
  ogTitle: `${title} - Nuxt UI`,
  ogDescription: description,
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
        The Intuitive <br class="hidden md:block"><span class="text-(--ui-primary)">Vue UI Library</span>
      </template>
      <template #description>
        Create beautiful, responsive & accessible web apps quickly with Vue or Nuxt. Nuxt UI is an open-source UI library of {{ components?.length }} customizable components built with Tailwind CSS and Reka UI.
      </template>
      <template #links>
        <UButton to="/getting-started" size="xl">
          Get Started
        </UButton>
        <UButton to="/components" size="xl" color="neutral" variant="outline" trailing-icon="i-lucide-arrow-right">
          Explore Components
        </UButton>
        <div class="w-full my-6">
          <USeparator class="w-1/2" type="dashed" />
        </div>
        <div class="flex flex-col gap-4">
          <UPageFeature icon="i-logos-tailwindcss-icon" title="Styled with Tailwind CSS v4" description="Beautifully styled by default, overwrite any style you want." />
          <UPageFeature icon="i-custom-reka-ui" title="Accessible with Reka UI" description="Robust accessibility out of the box." />
          <UPageFeature icon="i-logos-typescript-icon" title="Type-safe with TypeScript" description="Auto-complete and type safety for all components." />
        </div>
      </template>
      <div class="h-[344px] lg:h-auto lg:relative w-full lg:min-h-[calc(100vh-var(--ui-header-height)-1px)] overflow-hidden">
        <UPageMarquee
          pause-on-hover
          :overlay="false"
          :ui="{
            root: '[--gap:--spacing(4)] [--duration:40s] border-(--ui-border) absolute w-full left-0 border-y lg:border-x lg:w-1/2 2xl:w-[320px] lg:flex-col',
            content: 'lg:w-auto lg:h-full lg:flex-col lg:animate-[marquee-vertical_var(--duration)_linear_infinite] lg:rtl:animate-[marquee-vertical-rtl_var(--duration)_linear_infinite] lg:h-[fit-content]'
          }"
        >
          <ULink
            v-for="component of components?.slice(0, 10)"
            :key="component.path"
            class="relative group aspect-video border-(--ui-border) w-[290px] xl:w-[330px] 2xl:w-[320px] 2xl:p-2 2xl:border-y"
            :to="component.path"
          >
            <UColorModeImage

              :light="`${component.path.replace('/components/', '/components/light/')}.png`"
              :dark="`${component.path.replace('/components/', '/components/dark/')}.png`"
              class="hover:scale-105 lg:hover:scale-110 transition-transform aspect-video w-full border-x lg:border-x-0 lg:border-y border-(--ui-border) 2xl:border-y-0"
            />
            <UBadge color="neutral" variant="outline" size="md" :label="component.title" class="hidden lg:block absolute mx-auto top-4 left-6 xl:left-4 group-hover:opacity-100 opacity-0 transition-opacity duration-300 pointer-events-none" />
          </ULink>
        </UPageMarquee>
        <UPageMarquee
          pause-on-hover
          reverse
          :overlay="false"
          :ui="{
            root: '[--gap:--spacing(4)] [--duration:40s] border-(--ui-border) absolute w-full mt-[180px] left-0 border-y lg:mt-auto lg:left-auto lg:border-r lg:border-y-0 2xl:border-x lg:w-1/2 2xl:w-[320px] lg:right-0 lg:flex-col',
            content: 'lg:w-auto lg:h-full lg:flex-col lg:animate-[marquee-vertical_var(--duration)_linear_infinite] lg:rtl:animate-[marquee-vertical-rtl_var(--duration)_linear_infinite] lg:h-[fit-content] lg:[animation-direction:reverse]'
          }"
        >
          <ULink
            v-for="component of components?.slice(10, 20)"
            :key="component.path"
            class="relative group aspect-video border-(--ui-border) w-[290px] xl:w-[330px] 2xl:w-[320px] 2xl:p-2 2xl:border-y"
            :to="component.path"
          >
            <UColorModeImage

              :light="`${component.path.replace('/components/', '/components/light/')}.png`"
              :dark="`${component.path.replace('/components/', '/components/dark/')}.png`"
              class="hover:scale-105 lg:hover:scale-110 transition-transform aspect-video w-full border-x lg:border-x-0 lg:border-y border-(--ui-border) 2xl:border-y-0"
            />
            <UBadge color="neutral" variant="outline" size="md" :label="component.title" class="hidden lg:block absolute mx-auto top-4 left-6 xl:left-4 group-hover:opacity-100 opacity-0 transition-opacity duration-300 pointer-events-none" />
          </ULink>
        </UPageMarquee>
      </div>
    </UPageHero>
  </UMain>
</template>
