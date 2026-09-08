<script setup lang="ts">
import { joinURL } from 'ufo'
import { themeChipStyle, PRESET_ICONS } from '../utils/theme/studio'

const { data: page } = await useAsyncData('index', () => queryCollection('index').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { url } = useSiteConfig()
const { version } = useRuntimeConfig().public

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
  <UMain v-if="page">
    <PageHero
      v-bind="page.hero"
      :badge="{
        label: `What's new in v${version}`,
        trailingIcon: 'i-lucide-arrow-right',
        to: `/docs/releases/v${version}`
      }"
    >
      <HomeThemeCode />
    </PageHero>

    <UContainer>
      <UPage>
        <UPageBody class="space-y-0">
          <PageSectionHeading title="Try components live">
            <div class="flex gap-px w-full sm:w-auto min-w-0 overflow-x-auto">
              <UTooltip v-for="pill in pills" :key="pill.id" :text="pill.label" :delay-duration="0">
                <UButton
                  :avatar="pill.avatar"
                  color="neutral"
                  variant="ghost"
                  active-variant="soft"
                  size="xl"
                  :active="pill.active"
                  :aria-label="`${pill.label} theme`"
                  class="p-1.5"
                  @click="pill.apply()"
                />
              </UTooltip>
            </div>
          </PageSectionHeading>

          <div class="relative isolate">
            <div aria-hidden="true" class="absolute inset-0 -z-10 rounded-xl border border-default bg-elevated/50 mask-b-from-25%" />

            <Playground static />
          </div>
        </UPageBody>
      </UPage>
    </UContainer>
  </UMain>
</template>
