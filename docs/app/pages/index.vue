<script setup lang="ts">
const { data: page } = await useAsyncData('index', () => queryCollection('index').first())
if (!page.value) {
  throw createError({ status: 404, statusText: 'Page not found', fatal: true })
}

const { version } = useRuntimeConfig().public
const appConfig = useAppConfig()

// The wall switches with the studio's own switcher, off the light view
// composable so the landing never pulls the studio engine to render it.
const { view } = useThemeStudioView()

// same key as the header's stars, so the payload only rides once
const { data: module } = await useFetch('/api/module.json', { key: 'module', pick: ['stats'] })
const { format } = Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 })
const downloads = computed(() => module.value?.stats?.downloads ? format(module.value.stats.downloads) : undefined)

// Vue is in the title, Laravel and AdonisJS stand for the Inertia setups
const frameworks = [
  { label: 'Nuxt', icon: 'i-logos-nuxt-icon', to: '/docs/getting-started/installation/nuxt' },
  { label: 'Vite', icon: 'i-logos-vitejs', to: '/docs/getting-started/installation/vue' },
  { label: 'Laravel', icon: 'i-logos-laravel', to: '/docs/getting-started/installation/vue' },
  { label: 'AdonisJS', icon: 'i-logos-adonisjs-icon', to: '/docs/getting-started/installation/vue' }
]

useSeoMeta({
  titleTemplate: '%s - Nuxt UI',
  title: page.value.title,
  description: page.value.description,
  ogTitle: `${page.value.title} - Nuxt UI`,
  ogDescription: page.value.description
})

useCanonical('/raw/index.md')

if (import.meta.server) {
  defineOgImage('Home.takumi', {
    lead: page.value.hero?.lead,
    accent: page.value.hero?.accent,
    // the card has room for the first sentence, the rest is the hero's
    description: page.value.hero?.description?.split('. ')[0]?.concat('.'),
    downloads: downloads.value
  })

  useSchemaOrg([
    defineSoftwareApp({
      name: 'Nuxt UI',
      operatingSystem: 'Web',
      applicationCategory: 'DeveloperApplication',
      offers: { price: 0, priceCurrency: 'USD' }
    })
  ])
}
</script>

<template>
  <UMain v-if="page">
    <PageHero
      v-bind="page.hero"
      :badge="{
        label: `What's new in v${version}`,
        trailingIcon: appConfig.ui.icons.arrowRight,
        to: '/docs/releases'
      }"
    >
      <HomeThemeCode />

      <template #caption>
        <div class="flex flex-wrap items-center gap-x-3 gap-y-2">
          <div class="flex items-center gap-2">
            Works with

            <UTooltip v-for="framework in frameworks" :key="framework.label" :text="framework.label">
              <ULink :to="framework.to" :aria-label="framework.label" class="flex grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition">
                <UIcon :name="framework.icon" class="size-3.5" />
              </ULink>
            </UTooltip>
          </div>

          <template v-if="downloads">
            <USeparator orientation="vertical" class="h-3" />

            <ULink to="https://npmx.dev/package-stats/@nuxt/ui/v/latest?granularity=monthly#trends" target="_blank" class="group inline-flex items-center gap-1.5 text-muted hover:text-default transition-colors">
              <UIcon name="i-logos-npm-icon" class="size-3.5 shrink-0 grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition" />
              {{ downloads }} monthly downloads
            </ULink>
          </template>
        </div>
      </template>
    </PageHero>

    <UContainer>
      <UPage>
        <UPageBody class="space-y-0">
          <!-- the wall and the views are the section, and the switcher names
               them: a heading for the outline, not for the eye -->
          <h2 class="sr-only">
            Components and templates
          </h2>

          <!-- on a phone the switcher is the whole row -->
          <PageSectionHeading :ui="{ rule: 'max-sm:hidden', meta: 'max-sm:hidden' }">
            <template #leading>
              <ThemeStudioViewSwitcher :content="{ align: 'start' }" class="w-full sm:w-68" />
            </template>

            <template #meta>
              Same theme, every layout
            </template>
          </PageSectionHeading>

          <div class="relative isolate">
            <!-- The wall runs off the bottom of the section under a fade; a
                 template is a page of its own, so it gets a framed window. -->
            <template v-if="view === 'grid'">
              <div aria-hidden="true" class="absolute inset-0 -z-10 rounded-xl border border-default bg-elevated/50 mask-b-from-25%" />

              <PlaygroundWall />
            </template>

            <!-- [contain:paint]: Chromium won't clip nested composited layers
                 by an ancestor's overflow alone -->
            <div v-else class="h-[80vh] rounded-xl ring ring-default bg-default overflow-hidden *:contain-[paint]">
              <LazyThemeStudioViewDashboard v-if="view === 'dashboard'" />
              <LazyThemeStudioViewChat v-else-if="view === 'chat'" />
              <LazyThemeStudioViewSaas v-else-if="view === 'saas'" />
              <LazyThemeStudioViewLanding v-else-if="view === 'landing'" />
              <LazyThemeStudioViewDocs v-else-if="view === 'docs'" />
              <LazyThemeStudioViewPortfolio v-else-if="view === 'portfolio'" />
              <LazyThemeStudioViewChangelog v-else-if="view === 'changelog'" />
              <LazyThemeStudioViewEditor v-else-if="view === 'editor'" />
            </div>
          </div>
        </UPageBody>
      </UPage>
    </UContainer>
  </UMain>
</template>
