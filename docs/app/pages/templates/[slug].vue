<script setup lang="ts">
import { kebabCase } from 'scule'

const route = useRoute()
const appConfig = useAppConfig()

const { data: page } = await useAsyncData(kebabCase(route.path), () => queryCollection('guides').path(route.path).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const title = page.value.seo?.title || page.value.title
const description = page.value.seo?.description || page.value.description

useSeoMeta({
  titleTemplate: '%s - Nuxt UI',
  title,
  ogTitle: `${title} - Nuxt UI`,
  description,
  ogDescription: description
})

useCanonical()

if (import.meta.server) {
  defineOgImage('Docs.takumi', {
    headline: 'Templates',
    title: page.value.title,
    description: page.value.description
  })

  useSchemaOrg([
    defineArticle({
      '@type': 'TechArticle',
      'headline': title,
      'description': description,
      'datePublished': page.value.date
    })
  ])
}

const tree = ref<Record<string, Node>>({})
const activePath = ref()

const scrolled = ref(false)

// The router scrolls to the top one frame after the page has loaded
useNuxtApp().hooks.hookOnce('page:loading:end', () => {
  requestAnimationFrame(() => {
    scrolled.value = true
  })
})

provide('tree', tree)
provide('activePath', activePath)
provide('scrolled', scrolled)

const items = computed(() => Object.entries(tree.value).map(([key, value]) => ({ label: key, component: value })))
</script>

<template>
  <UMain v-if="page">
    <UPage :ui="{ center: 'lg:col-span-5 px-4 sm:px-6 lg:pl-8 lg:pr-0', right: 'lg:col-span-5' }" class="lg:gap-8">
      <UPageHeader :title="page.title" :description="page.description" :ui="{ title: 'relative flex items-center' }">
        <template #headline>
          <UButton
            :icon="appConfig.ui.icons.arrowLeft"
            label="Back to templates"
            to="/templates"
            variant="link"
            class="p-0"
            :ui="{ leadingIcon: 'size-4' }"
          />
          <span class="text-muted">&middot;</span>
          <time class="text-muted font-normal">{{ new Date(page.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) }}</time>
        </template>
      </UPageHeader>

      <UPageBody>
        <ContentRenderer v-if="page.body" :value="page" />
      </UPageBody>

      <template #right>
        <div>
          <UContentToc
            :links="page.body.toc?.links"
            class="z-2 lg:hidden mx-0!"
          />

          <nav class="h-full sticky top-(--ui-header-height) max-h-[calc(100vh-var(--ui-header-height))] hidden lg:block">
            <ProseCodeTree
              v-if="activePath"
              :model-value="activePath"
              class="lg:h-full my-0 rounded-none border-y-0 border-r-0 border-default"
              :items="items"
              expand-all
              :ui="{ list: 'border-default', content: '[&>div>pre]:bg-tint/50 [&>div>pre]:border-default [&>div>pre]:rounded-none' }"
            />
            <div v-else class="size-full border-l border-default flex items-center justify-center">
              <UIcon :name="appConfig.ui.icons.arrowDown" class="size-12 text-faint animate-bounce" />
            </div>
          </nav>
        </div>
      </template>
    </UPage>
  </UMain>
</template>
