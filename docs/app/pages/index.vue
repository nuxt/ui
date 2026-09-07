<script setup lang="ts">
import { joinURL } from 'ufo'
import { themeChipStyle } from '../utils/theme/studio'
import { DEFAULT_PRESET_ID } from '../utils/theme/engine/types'

const { data: page } = await useAsyncData('index', () => queryCollection('index').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { url } = useSiteConfig()

const { data: module } = await useFetch('/api/module.json', { key: 'index-stats' })
const { format } = Intl.NumberFormat('en', { notation: 'compact' })

const stats = computed(() => [{
  value: '125+',
  label: 'components',
  to: '/docs/components'
}, {
  value: `${format(module.value?.stats?.downloads ?? 0)}+`,
  label: 'monthly downloads',
  to: 'https://npm.chart.dev/@nuxt/ui'
}, {
  value: `${format(module.value?.stats?.stars ?? 0)}+`,
  label: 'GitHub stars',
  to: 'https://github.com/nuxt/ui'
}])

// A taste of the theme studio: the pills retheme the page in place, and the
// wall below shows what that does to every component.
const { presets, selectedPreset, applyPreset } = useThemeStudio()
// the applied preset is client-only, resolve after mount so hydration matches
const mounted = useMounted()

const SHORTLIST = [DEFAULT_PRESET_ID, 'cobalt', 'iris', 'sunset', 'mono']

const pills = computed(() => SHORTLIST
  .map(id => presets.find(preset => preset.id === id))
  .filter(preset => !!preset)
  .map(preset => ({
    id: preset.id,
    label: preset.name,
    chip: themeChipStyle(preset.doc),
    active: mounted.value && selectedPreset.value === preset.id,
    apply: () => applyPreset(preset)
  })))

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
</script>

<template>
  <main v-if="page">
    <PageHero v-bind="page.hero" :stats="stats" />

    <section class="max-w-[1180px] mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-14">
      <div class="flex flex-wrap items-center gap-x-3.5 gap-y-3 mb-5">
        <h2 class="text-xs font-medium uppercase tracking-widest text-muted whitespace-nowrap">
          Try every component live
        </h2>

        <span class="hidden sm:block flex-1 h-px bg-(--ui-border)" />

        <div class="flex flex-wrap gap-1.5">
          <UButton
            v-for="pill in pills"
            :key="pill.id"
            :label="pill.label"
            color="neutral"
            :variant="pill.active ? 'subtle' : 'outline'"
            size="sm"
            @click="pill.apply()"
          >
            <template #leading>
              <span class="size-3 rounded-full bg-(--chip-icon-light) dark:bg-(--chip-icon-dark)" :style="pill.chip" />
            </template>
          </UButton>
        </div>
      </div>

      <!-- The wall is a taste, not the catalogue: it fades out into the link
           below rather than running the page to its full height. -->
      <div class="relative isolate rounded-xl border border-default bg-elevated/30 overflow-hidden max-h-[38rem] sm:max-h-[44rem] mask-b-from-60%">
        <Playground static />
      </div>

      <div class="flex justify-center pt-6">
        <UButton
          label="Explore all components"
          to="/docs/components"
          color="neutral"
          variant="outline"
          size="lg"
          trailing-icon="i-lucide-arrow-right"
        />
      </div>
    </section>
  </main>
</template>
