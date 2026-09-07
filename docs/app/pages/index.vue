<script setup lang="ts">
import { joinURL } from 'ufo'
import { themeChipStyle, PRESET_ICONS } from '../utils/theme/studio'

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
const studioIcons = useStudioIcons()
// the applied preset is client-only, resolve after mount so hydration matches
const mounted = useMounted()

// Each preset wears the chip the theme menu gives it: its glyph in its own
// primary, on that primary dimmed to a tint.
const pills = computed(() => presets.map(preset => ({
  id: preset.id,
  label: preset.name,
  avatar: {
    icon: PRESET_ICONS[preset.id] || studioIcons.palette,
    class: 'bg-(image:--chip-bg-light) dark:bg-(image:--chip-bg-dark)',
    style: themeChipStyle(preset.doc),
    ui: { icon: 'text-(--chip-icon-light) dark:text-(--chip-icon-dark)' }
  },
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

    <UContainer as="section" class="pt-12 sm:pt-14 pb-16">
      <div class="flex items-center gap-3.5 mb-4">
        <h2 class="text-xs font-medium uppercase tracking-widest text-muted whitespace-nowrap">
          Try every component live
        </h2>

        <span class="flex-1 h-px bg-border" />
      </div>

      <!-- every preset, on its own row: the wall below is what they change -->
      <div class="flex flex-wrap gap-1.5 mb-5">
        <UButton
          v-for="pill in pills"
          :key="pill.id"
          :label="pill.label"
          :avatar="pill.avatar"
          color="neutral"
          :variant="pill.active ? 'subtle' : 'outline'"
          size="sm"
          @click="pill.apply()"
        />
      </div>

      <div class="relative isolate rounded-xl border border-default bg-elevated/30 overflow-hidden">
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
    </UContainer>
  </main>
</template>
