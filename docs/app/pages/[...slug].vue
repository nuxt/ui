<script setup lang="ts">
import { findPageHeadline } from '#ui-pro/utils/content'

const route = useRoute()

definePageMeta({
  layout: 'docs'
})

const { data: page } = await useAsyncData(route.path, () => queryCollection('content').path(route.path).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => queryCollectionItemSurroundings('content', route.path, {
  fields: ['description']
}))

const headline = computed(() => findPageHeadline(page.value))

useSeoMeta({
  titleTemplate: '%s - Nuxt UI v3',
  title: (page.value.navigation as any)?.title || page.value.title,
  ogTitle: `${(page.value.navigation as any)?.title || page.value.title} - Nuxt UI v3`,
  description: page.value.description,
  ogDescription: page.value.description
})

defineOgImageComponent('Docs', {
  headline: headline.value
})

const communityLinks = computed(() => [{
  icon: 'i-heroicons-pencil-square',
  label: 'Edit this page',
  to: `https://github.com/nuxt/ui/edit/v3/docs/content/${page?.value?.stem}.md`,
  target: '_blank'
}, {
  icon: 'i-heroicons-star',
  label: 'Star on GitHub',
  to: 'https://github.com/nuxt/ui',
  target: '_blank'
}, {
  label: 'Roadmap',
  icon: 'i-heroicons-map',
  to: '/roadmap'
}])

// const resourcesLinks = [{
//   icon: 'i-simple-icons-figma',
//   label: 'Figma Kit',
//   to: 'https://www.figma.com/community/file/1288455405058138934',
//   target: '_blank'
// }, {
//   label: 'Playground',
//   icon: 'i-simple-icons-stackblitz',
//   to: 'https://stackblitz.com/edit/nuxt-ui',
//   target: '_blank'
// }, {
//   icon: 'i-simple-icons-nuxtdotjs',
//   label: 'Nuxt docs',
//   to: 'https://nuxt.com',
//   target: '_blank'
// }]
</script>

<template>
  <UPage v-if="page">
    <UPageHeader :title="page.title" :links="page.links" :headline="headline">
      <template #description>
        <MDC v-if="page.description" :value="page.description" unwrap="p" />
      </template>
    </UPageHeader>

    <UPageBody>
      <ContentRenderer v-if="page.body" :value="page" />

      <USeparator />

      <UContentSurround :surround="(surround as any)" />
    </UPageBody>

    <template v-if="page?.body?.toc?.links?.length" #right>
      <UContentToc :links="page.body.toc.links">
        <template #bottom>
          <USeparator v-if="page.body?.toc?.links?.length" type="dashed" />

          <UPageLinks title="Community" :links="communityLinks" />

          <!-- <USeparator type="dashed" />

          <UPageLinks title="Resources" :links="resourcesLinks" />

          <USeparator type="dashed" />

          <AdsPro />
          <AdsCarbon /> -->
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
