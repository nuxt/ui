<template>
  <UPage>
    <UPageHeader :title="page.title" :description="page.description" :links="page.links" :headline="headline" />

    <UPageBody prose>
      <ContentRenderer v-if="page.body" :value="page" />

      <div class="mt-12 not-prose">
        <UButton :to="githubLink" variant="link" icon="i-heroicons-pencil-square" label="Edit this page on GitHub" :padded="false" />
      </div>

      <hr v-if="surround?.length" class="my-8">

      <UDocsSurround :surround="removePrefixFromFiles(surround)" />

      <Footer class="not-prose" />
    </UPageBody>

    <template v-if="page.body?.toc?.links?.length" #right>
      <UDocsToc :links="page.body.toc.links" />
    </template>
  </UPage>
</template>

<script setup lang="ts">
const route = useRoute()
const { prefix, removePrefixFromFiles } = useContentSource()
const { findPageHeadline } = useElementsHelpers()

const path = computed(() => route.path.startsWith(prefix.value) ? route.path : `${prefix.value}${route.path}`)

const { data: page } = await useAsyncData(path.value, () => queryContent(path.value).findOne())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' })
}

const { data: surround } = await useAsyncData(`${path.value}-surround`, () => {
  return queryContent(prefix.value)
    .where({ _extension: 'md', navigation: { $ne: false } })
    .findSurround((path.value.endsWith('/') ? path.value.slice(0, -1) : path.value))
})

useContentHead(page)

const githubLink = computed(() => `https://github.com/nuxtlabs/ui/edit/dev/docs/content/${page?.value?._file}`)
const headline = computed(() => findPageHeadline(page.value))
</script>
