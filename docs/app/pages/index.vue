<script setup lang="ts">
import { joinURL } from 'ufo'

const { data: page } = await useAsyncData('index', () => queryCollection('index').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { url } = useSiteConfig()
const appConfig = useAppConfig()

useSeoMeta({
  titleTemplate: '%s - Nuxt UI',
  title: page.value.title,
  description: page.value.description,
  ogTitle: `${page.value.title} - Nuxt UI`,
  ogDescription: page.value.description,
  ogImage: joinURL(url, '/og-image.png')
})

const { data: components } = await useAsyncData('index-components', () => {
  return queryCollection('docs')
    .where('path', 'LIKE', '/docs/components/%')
    .where('extension', '=', 'md')
    .select('path', 'title', 'description', 'category')
    .all()
})

const { data: templates } = await useAsyncData('index-templates', () => queryCollection('templates').first(), {
  transform: data => data?.items?.filter(template => template.framework === 'nuxt') || []
})

const { data: module } = await useFetch('/api/module.json')

const { format } = Intl.NumberFormat('en', { notation: 'compact' })

const contributorsRef = ref(null)
const isContributorsInView = ref(false)
const isContributorsHovered = useElementHover(contributorsRef)

useIntersectionObserver(contributorsRef, ([entry]) => {
  isContributorsInView.value = entry?.isIntersecting || false
})
</script>

<template>
  <main v-if="page">
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
        The Intuitive <br> <span class="text-primary">Vue UI Library</span>
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

      <LazySkyBg is-index />

      <div class="h-[344px] lg:h-full lg:relative w-full lg:min-h-[calc(100vh-var(--ui-header-height)-1px)] overflow-hidden">
        <UMarquee
          pause-on-hover
          :overlay="false"
          :ui="{
            root: '[--gap:--spacing(4)] [--duration:40s] border-default absolute w-full left-0 border-y lg:border-x lg:border-y-0 lg:w-[calc(50%-6px)] 2xl:w-[320px] lg:flex-col',
            content: 'lg:w-auto lg:flex-col lg:animate-[marquee-vertical_var(--duration)_linear_infinite] lg:rtl:animate-[marquee-vertical-rtl_var(--duration)_linear_infinite] lg:h-[fit-content]'
          }"
        >
          <ULink
            v-for="component of components?.slice(0, 10)"
            :key="component.path"
            class="relative group/link aspect-video border-default w-[290px] xl:w-[330px] 2xl:w-[320px] 2xl:p-2 2xl:border-y"
            :to="component.path"
            tabindex="-1"
          >
            <UColorModeImage
              :light="`${component.path.replace('/docs/components/', '/components/light/')}.png`"
              :dark="`${component.path.replace('/docs/components/', '/components/dark/')}.png`"
              :alt="`${component.title} preview`"
              width="290"
              height="163"
              format="webp"
              class="hover:scale-105 lg:hover:scale-110 transition-transform aspect-video w-full border-x lg:border-x-0 lg:border-y border-default 2xl:border-y-0"
              loading="lazy"
            />
            <UBadge color="neutral" variant="outline" size="md" :label="component.title" class="hidden lg:block absolute mx-auto top-4 left-6 xl:left-4 group-hover/link:opacity-100 opacity-0 transition-all duration-300 pointer-events-none -translate-y-2 group-hover/link:translate-y-0" />
          </ULink>
        </UMarquee>

        <UMarquee
          pause-on-hover
          reverse
          :overlay="false"
          :ui="{
            root: '[--gap:--spacing(4)] [--duration:40s] border-default absolute w-full mt-[180px] left-0 border-y lg:mt-auto lg:left-auto lg:border-y-0 lg:border-x lg:w-[calc(50%-6px)] 2xl:w-[320px] lg:right-0 lg:flex-col',
            content: 'lg:w-auto lg:flex-col lg:animate-[marquee-vertical_var(--duration)_linear_infinite] lg:rtl:animate-[marquee-vertical-rtl_var(--duration)_linear_infinite] lg:h-[fit-content] lg:[animation-direction:reverse]'
          }"
        >
          <ULink
            v-for="component of components?.slice(10, 20)"
            :key="component.path"
            class="relative group/link aspect-video border-default w-[290px] xl:w-[330px] 2xl:w-[320px] 2xl:p-2 2xl:border-y"
            :to="component.path"
            tabindex="-1"
          >
            <UColorModeImage
              :light="`${component.path.replace('/docs/components/', '/components/light/')}.png`"
              :dark="`${component.path.replace('/docs/components/', '/components/dark/')}.png`"
              :alt="`${component.title} preview`"
              width="290"
              height="163"
              format="webp"
              class="hover:scale-105 lg:hover:scale-110 transition-transform aspect-video w-full border-x lg:border-x-0 lg:border-y border-default 2xl:border-y-0"
              loading="lazy"
            />
            <UBadge color="neutral" variant="outline" size="md" :label="component.title" class="hidden lg:block absolute mx-auto top-4 left-6 xl:left-4 group-hover/link:opacity-100 opacity-0 transition-all duration-300 pointer-events-none -translate-y-2 group-hover/link:translate-y-0" />
          </ULink>
        </UMarquee>
      </div>
    </UPageHero>

    <USeparator />

    <UPageSection :ui="{ container: 'lg:py-16', root: 'bg-muted/25' }">
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
          <NuxtLink v-if="feature.to" :to="feature.to" class="absolute inset-0 z-10 focus-visible:outline-primary">
            <span class="sr-only">Go to {{ feature.title }}</span>
          </NuxtLink>

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
            <UIcon :name="feature.icon" class="size-5 shrink-0" />
          </div>
          <div class="flex flex-col">
            <h2 class="font-medium text-highlighted inline-flex items-center gap-x-1">
              {{ feature.title }}
              <UIcon v-if="feature.to" :name="appConfig.ui.icons.arrowRight" class="size-4 shrink-0 opacity-0 group-hover:opacity-100 transition-all duration-200 -translate-x-1 group-hover:translate-x-0" />
            </h2>
            <p class="text-sm text-muted">
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
      :title="page.css_variables.title"
      :description="page.css_variables.description"
      :features="page.css_variables.features"
      :links="page.css_variables.links"
      orientation="horizontal"
      :ui="{ root: 'bg-muted/25' }"
    >
      <MDC :value="page.css_variables.code" cache-key="index-css-variables-code" />
    </UPageSection>

    <USeparator />

    <UPageSection
      :title="page.components.title"
      :features="page.components.features"
      :links="page.components.links"
      orientation="horizontal"
    >
      <template #description>
        <MDC :value="page.components.description" cache-key="index-components-description" />
      </template>

      <MDC :value="page.components.code" cache-key="index-components-code" />
    </UPageSection>

    <USeparator />

    <UPageSection
      :title="page.templates.title"
      :description="page.templates.description"
      :links="page.templates.links"
      :features="page.templates.features"
      orientation="horizontal"
      :ui="{ root: 'bg-muted/25' }"
    >
      <UCarousel
        v-slot="{ item }"
        loop
        dots
        fade
        wheel-gestures
        :contain-scroll="false"
        :autoplay="{ delay: 3000 }"
        :items="templates"
        :ui="{
          container: 'py-px',
          viewport: 'px-px'
        }"
      >
        <UPageCard
          :to="item.links?.[0]?.to"
          :icon="item.icon"
          :title="item.title"
          target="_blank"
          variant="subtle"
          class="group rounded-md"
          tabindex="-1"
          :ui="{
            container: 'p-4 sm:p-4',
            wrapper: 'flex-row items-center gap-1.5',
            leading: 'mb-0',
            leadingIcon: 'text-highlighted'
          }"
        >
          <UColorModeImage
            :light="`/assets/templates/${item.framework}/${item.title.toLowerCase()}-light.png`"
            :dark="`/assets/templates/${item.framework}/${item.title.toLowerCase()}-dark.png`"
            :alt="`Template ${item.title} screenshot`"
            width="620"
            height="348"
            loading="lazy"
            class="rounded-lg w-full border border-default aspect-video"
          />
        </UPageCard>
      </UCarousel>
    </UPageSection>

    <USeparator />

    <UPageSection
      :title="page.community.title"
      :description="page.community.description"
      :links="page.community.links"
      orientation="horizontal"
      :ui="{ features: 'flex items-center gap-4 lg:gap-8' }"
    >
      <template #features>
        <li>
          <NuxtLink to="https://npm.chart.dev/@nuxt/ui" target="_blank" class="min-w-0 group focus-visible:outline-primary">
            <p class="text-4xl font-semibold truncate text-highlighted group-hover:text-primary transition-colors">
              {{ format(module?.stats?.downloads ?? 0) }}+
            </p>
            <p class="text-muted text-sm truncate">monthly downloads</p>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink to="https://github.com/nuxt/ui" target="_blank" class="min-w-0 group focus-visible:outline-primary">
            <p class="text-4xl font-semibold text-highlighted truncate group-hover:text-primary transition-colors">
              {{ format(module?.stats?.stars ?? 0) }}+
            </p>
            <p class="text-muted text-sm truncate">GitHub stars</p>
          </NuxtLink>
        </li>

        <li>
          <NuxtLink to="https://github.com/nuxt/ui/graphs/contributors" target="_blank" class="min-w-0 group focus-visible:outline-primary">
            <p class="text-4xl font-semibold text-highlighted truncate group-hover:text-primary transition-colors">
              300+
            </p>
            <p class="text-muted text-sm truncate">Contributors</p>
          </NuxtLink>
        </li>
      </template>

      <div ref="contributorsRef" class="p-4 sm:px-6 md:px-8 lg:px-12 xl:px-14 overflow-hidden flex relative">
        <LazyHomeContributors :contributors="module?.contributors" :paused="!isContributorsInView || isContributorsHovered" />
      </div>
    </UPageSection>
  </main>
</template>
