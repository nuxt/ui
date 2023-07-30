<template>
  <UPage v-if="page">
    <UPageHeader v-bind="page" :headline="headline" />

    <UPageBody prose>
      <ContentRenderer v-if="page && page.body" :value="page" />

      <UButton
        :to="githubLink"
        variant="link"
        icon="i-heroicons-pencil-square"
        label="Edit this page on GitHub"
        :padded="false"
        class="mt-12"
      />

      <hr v-if="surround?.length" class="border-gray-200 dark:border-gray-800 my-8">

      <UDocsSurround :surround="surround" />

      <Footer />
    </UPageBody>

    <template v-if="page.body?.toc?.links?.length" #right>
      <UDocsToc :links="page.body.toc.links" />
    </template>
  </UPage>
  <UPageError v-else />
</template>

<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(`docs-${route.path}`, () => queryContent(route.path).findOne())
const { data: surround } = await useAsyncData(`docs-${route.path}-surround`, () => queryContent()
  .where({ _extension: 'md', navigation: { $ne: false } })
  .findSurround(route.path.endsWith('/') ? route.path.slice(0, -1) : route.path)
)

if (process.server && !page.value) {
  const event = useRequestEvent()
  setResponseStatus(event, 404)
}

useContentHead(page)

const githubLink = computed(() => `https://github.com/nuxtlabs/ui/edit/dev/docs/content/${page?.value?._file}`)
const headline = computed(() => page.value._dir?.title ? page.value._dir.title : useLowerCase(page.value._dir))
</script>
