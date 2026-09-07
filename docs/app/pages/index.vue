<script setup lang="ts">
import { joinURL } from 'ufo'
import { themeChipStyle, PRESET_ICONS } from '../utils/theme/studio'

const { data: page } = await useAsyncData('index', () => queryCollection('index').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { url } = useSiteConfig()
const { version } = useRuntimeConfig().public

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
    <PageHero v-bind="page.hero" :eyebrow="`Nuxt UI v${version} is out`" :stats="stats" />

    <UContainer as="section" class="pt-12 sm:pt-14 pb-16">
      <div class="flex items-center gap-3.5 mb-4">
        <h2 class="text-xs font-medium uppercase tracking-widest text-muted whitespace-nowrap">
          Try every component live
        </h2>

        <span class="hidden sm:block flex-1 h-px bg-border" />

        <!-- every preset on one line: the chip carries it, the name rides the
             tooltip so twelve of them stay beside the heading -->
        <div class="flex gap-0.5 min-w-0 overflow-x-auto">
          <UTooltip v-for="pill in pills" :key="pill.id" :text="pill.label" :delay-duration="0">
            <UButton
              :avatar="pill.avatar"
              color="neutral"
              :variant="pill.active ? 'subtle' : 'ghost'"
              size="sm"
              square
              :aria-label="`${pill.label} theme`"
              @click="pill.apply()"
            />
          </UTooltip>
        </div>
      </div>

      <!-- the wall keeps every tile, its last rows fading into the link below -->
      <div class="relative isolate rounded-xl border border-default bg-elevated/30 overflow-hidden mask-b-from-90%">
        <Playground static />
      </div>
    </UContainer>
  </main>
</template>
