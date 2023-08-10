<template>
  <UPage>
    <UPageHeader :title="page.title" :description="page.description" :links="page.links" :headline="headline" />

    <UPageBody prose>
      <ContentRenderer v-if="page.body" :value="page" />

      <div class="mt-12 not-prose">
        <UButton :to="githubLink" variant="link" icon="i-heroicons-pencil-square" label="Edit this page on GitHub" :padded="false" />
      </div>

      <hr v-if="surround?.length" class="my-8">

      <UDocsSurround :surround="surround" />

      <Footer class="not-prose" />
    </UPageBody>

    <template v-if="page.body?.toc?.links?.length" #right>
      <UDocsToc :links="page.body.toc.links" />
    </template>
  </UPage>
</template>

<script setup lang="ts">
const route = useRoute()
const { findPageHeadline } = useElementsHelpers()

const { data: page } = await useAsyncData(`docs-${route.path}`, () => queryContent(route.path).findOne())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const { data: surround } = await useAsyncData(`docs-${route.path}-surround`, () => queryContent()
  .where({ _extension: 'md', navigation: { $ne: false } })
  .findSurround(route.path.endsWith('/') ? route.path.slice(0, -1) : route.path)
)

useContentHead(page)

const githubLink = computed(() => `https://github.com/nuxtlabs/ui/edit/dev/docs/content/${page?.value?._file}`)
const headline = computed(() => findPageHeadline(page.value))
</script>
