<script setup lang="ts">
import { joinURL } from 'ufo'

const { url } = useSiteConfig()

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

const title = 'The Intuitive Vue UI Library'
const description = 'A Vue UI library with 125+ accessible components styled with Tailwind CSS. Works out of the box with Nuxt and any Vue app, try every component live and make the theme yours.'

useSeoMeta({
  titleTemplate: '%s - Nuxt UI',
  title,
  description,
  ogTitle: `${title} - Nuxt UI`,
  ogDescription: description,
  ogImage: joinURL(url, '/og-image.png')
})
</script>

<template>
  <main>
    <UPageHero
      orientation="vertical"
      :description="description"
      :links="[
        {
          label: 'Get started',
          to: '/docs/getting-started/installation/nuxt',
          class: 'nuxt-only'
        },
        {
          label: 'Get started',
          to: '/docs/getting-started/installation/vue',
          class: 'vue-only'
        },
        {
          label: 'Explore components',
          to: '/docs/components',
          variant: 'outline',
          color: 'neutral',
          trailingIcon: 'i-lucide-arrow-right'
        }
      ]"
      :ui="{
        container: '',
        title: 'font-semibold sm:text-6xl',
        description: 'text-base sm:text-lg'
      }"
    >
      <template #title>
        The Intuitive <span class="text-primary">Vue UI Library</span>
      </template>

      <div class="relative isolate">
        <div aria-hidden="true" class="absolute inset-0 -z-10 rounded-xl border border-default bg-elevated/50 mask-b-from-50%" />

        <Playground />
      </div>
    </UPageHero>
  </main>
</template>
