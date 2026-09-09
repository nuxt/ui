<script setup lang="ts">
import { joinURL } from 'ufo'

const { data: page } = await useAsyncData('index', () => queryCollection('index').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { url } = useSiteConfig()
const { version } = useRuntimeConfig().public
const appConfig = useAppConfig()

// The wall switches with the studio's own switcher, off the light view
// composable so the landing never pulls the studio engine to render it.
const { view } = useThemeStudioView()

// The quiet link beside the CTA wears the arrow, from the icon pack rather
// than spelled out in the content.
const links = computed(() => page.value?.hero?.links?.map(link => (
  link.variant === 'ghost' ? { ...link, trailingIcon: appConfig.ui.icons.arrowRight } : link
)))

useSeoMeta({
  titleTemplate: '%s - Nuxt UI',
  title: page.value.title,
  description: page.value.description,
  ogTitle: `${page.value.title} - Nuxt UI`,
  ogDescription: page.value.description,
  ogImage: joinURL(url, '/og-image.png')
})

useCanonical('/raw/index.md')

if (import.meta.server) {
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
      :links="links"
      :badge="{
        label: `What's new in v${version}`,
        trailingIcon: appConfig.ui.icons.arrowRight,
        to: '/docs/releases'
      }"
    >
      <HomeThemeCode />
    </PageHero>

    <UContainer>
      <UPage>
        <UPageBody class="space-y-0">
          <PageSectionHeading>
            <template #leading>
              <ThemeStudioViewSwitcher :content="{ align: 'start' }" />
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

              <LazyPlayground static hydrate-on-visible />
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
