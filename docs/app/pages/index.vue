<script setup lang="ts">
import { joinURL } from 'ufo'

const { data: page } = await useAsyncData('index', () => queryCollection('index').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { url } = useSiteConfig()
const appConfig = useAppConfig()

if (import.meta.server) {
  prerenderRoutes(['/raw/index.md'])

  useSchemaOrg([
    defineSoftwareApp({
      name: 'Nuxt UI',
      operatingSystem: 'Web',
      applicationCategory: 'DeveloperApplication',
      offers: { price: 0, priceCurrency: 'USD' }
    })
  ])
}

useCanonical('/raw/index.md')

useSeoMeta({
  titleTemplate: '%s - Nuxt UI',
  title: page.value.title,
  description: page.value.description,
  ogTitle: `${page.value.title} - Nuxt UI`,
  ogDescription: page.value.description,
  ogImage: joinURL(url, '/og-image.png')
})

const { data: templates } = await useAsyncData('index-templates', () => queryCollection('templates').first(), {
  transform: data => data?.items?.filter(template => template.framework === 'nuxt') || []
})

const { data: module } = await useFetch('/api/module.json')

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
      :ui="{
        description: 'max-w-2xl mx-auto',
        container: 'relative py-10 sm:py-16 lg:py-24 sm:gap-y-16'
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
      </template>

      <LazySkyBg is-index />
      <Playground />
    </UPageHero>

    <USeparator />

    <UPageSection :ui="{ container: 'lg:py-16' }" class="bg-elevated/25">
      <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8 xl:gap-y-10">
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
      class="bg-elevated/25"
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
      class="bg-elevated/25"
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
          target="_blank"
          variant="subtle"
          class="group rounded-md"
          tabindex="-1"
          :ui="{
            container: 'p-0!',
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
            class="rounded-md w-full aspect-video"
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

      <LazyStarsBg />
    </UPageSection>
  </main>
</template>
