<script setup lang="ts">
import { joinURL } from 'ufo'

const { data: page } = await useAsyncData('terms', () => queryCollection('content').path('/pro/terms').first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { url } = useSiteConfig()

const title = page.value.title
const description = page.value.description
useSeoMeta({
  title,
  description,
  ogTitle: `${title} - Nuxt UI Pro`,
  ogDescription: description,
  ogImage: joinURL(url, '/pro/og-image.png')
})
</script>

<template>
  <UContainer>
    <UPage v-if="page">
      <UPageHeader :title="page.title" :description="page.description" />

      <UPageBody prose>
        <ContentRenderer v-if="page.body" :value="page" />
      </UPageBody>
    </UPage>
  </UContainer>
</template>
