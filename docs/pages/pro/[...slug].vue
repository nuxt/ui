<template>
  <UPage>
    <UPageHeader :title="page.title" :description="page.description" :links="page.links" :headline="headline" />

    <UPageBody prose>
      <ContentRenderer v-if="page.body" :value="page" />

      <UDivider v-if="surround?.length" />

      <UDocsSurround :surround="(surround as ParsedContent[])" />
    </UPageBody>

    <template v-if="page.body?.toc?.links?.length" #right>
      <UDocsToc :links="page.body.toc.links" />
    </template>
  </UPage>
</template>

<script setup lang="ts">
import { withoutTrailingSlash } from 'ufo'
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'

const route = useRoute()

definePageMeta({
  layout: 'pro'
})

const { data: page } = await useAsyncData(route.path, () => queryContent(route.path).findOne())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryContent('/pro')
    .where({
      _extension: 'md',
      navigation: {
        $ne: false
      }
    })
    .only(['title', 'description', '_path'])
    .findSurround(withoutTrailingSlash(route.path))
})

useSeoMeta({
  titleTemplate: '%s - Nuxt UI',
  title: page.value.title,
  ogTitle: `${page.value.title} - Nuxt UI`,
  description: page.value.description,
  ogDescription: page.value.description
})

defineOgImage({
  component: 'Docs',
  title: page.value.title,
  description: page.value.description
})

const headline = computed(() => findPageHeadline(page.value))
</script>
