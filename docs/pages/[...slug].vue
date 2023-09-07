<template>
  <UPage>
    <UPageHeader :title="page.title" :description="page.description" :links="page.links" :headline="headline" />

    <UPageBody prose>
      <ContentRenderer v-if="page.body" :value="page" />

      <UDivider v-if="surround?.length" />

      <UDocsSurround :surround="removePrefixFromFiles(surround)" />
    </UPageBody>

    <template v-if="page.body?.toc?.links?.length" #right>
      <UDocsToc :links="page.body.toc.links">
        <template #bottom>
          <div class="hidden lg:block space-y-6 !mt-6">
            <UDivider v-if="page.body?.toc?.links?.length" dashed />

            <UPageLinks title="Community" :links="links" />
          </div>
        </template>
      </UDocsToc>
    </template>
  </UPage>
</template>

<script setup lang="ts">
const route = useRoute()
const { prefix, removePrefixFromFiles } = useContentSource()
const { findPageHeadline } = useElementsHelpers()

definePageMeta({
  layout: 'docs'
})

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

const links = computed(() => [{
  icon: 'i-heroicons-pencil-square',
  label: 'Edit this page',
  to: `https://github.com/nuxt/ui/edit/dev/docs/content/${page?.value?._file.split('/').slice(1).join('/')}`,
  target: '_blank'
}, {
  icon: 'i-heroicons-star',
  label: 'Star on GitHub',
  to: 'https://github.com/nuxt/ui',
  target: '_blank'
}, {
  icon: 'i-heroicons-book-open',
  label: 'Nuxt documentation',
  to: 'https://nuxt.com',
  target: '_blank'
}])
</script>
