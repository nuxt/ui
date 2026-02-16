<script setup lang="ts">
import { joinURL } from 'ufo'
import { kebabCase } from 'scule'
import type { ContentNavigationItem } from '@nuxt/content'

const route = useRoute()
const { framework } = useFrameworks()

definePageMeta({
  layout: 'docs'
})

const { data: page } = await useAsyncData(kebabCase(route.path), () => queryCollection('docs').path(route.path).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

// Update the framework if the page has different one
watch(page, () => {
  if (page.value?.framework && page.value?.framework !== framework.value) {
    framework.value = page.value?.framework as string
  }
}, { immediate: true })

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { findSurround, findBreadcrumb } = useNavigation(navigation!)

const breadcrumb = computed(() => findBreadcrumb(page.value?.path as string))
const surround = computed(() => findSurround(page.value?.path as string))

if (!import.meta.prerender) {
  // Redirect to the correct framework version if the page is not the current framework
  watch(framework, () => {
    const route = useRoute()

    if (page.value?.path === route.path && page.value?.framework && page.value?.framework !== framework.value) {
      if (route.path.endsWith(`/${page.value?.framework}`)) {
        navigateTo(`${route.path.split('/').slice(0, -1).join('/')}/${framework.value}`)
      } else {
        navigateTo(`/docs/getting-started`)
      }
    }
  })
}

const title = page.value?.seo?.title ? page.value.seo.title : page.value?.navigation?.title ? page.value.navigation.title : page.value?.title
const prefix = page.value?.path.includes('components/') || page.value?.path.includes('composables/') ? 'Vue ' : ''
const suffix = page.value?.path.includes('components/') ? 'Component ' : page.value?.path.includes('composables/') ? 'Composable ' : ''
const description = page.value?.seo?.description ? page.value.seo.description : page.value?.description

useSeoMeta({
  titleTemplate: `${prefix}%s ${suffix}- Nuxt UI ${page.value?.framework === 'vue' ? ' for Vue' : ''}`,
  title,
  ogTitle: `${prefix}${title} ${suffix}- Nuxt UI ${page.value?.framework === 'vue' ? ' for Vue' : ''}`,
  description,
  ogDescription: description
})

if (route.path.startsWith('/docs/components/')) {
  defineOgImageComponent('OgImageComponent', {
    title: page.value.title,
    description: page.value.description,
    component: (route.params.slug as string[]).pop() as string
  })
} else {
  defineOgImageComponent('Docs', {
    title: page.value.title,
    description: page.value.description,
    headline: breadcrumb.value?.[breadcrumb.value.length - 1]?.label || 'Nuxt UI',
    framework: page.value?.framework
  })
}

// Pre-render the markdown path + add it to alternate links
const site = useSiteConfig()
const path = computed(() => route.path.replace(/\/$/, ''))
prerenderRoutes([joinURL('/raw', `${path.value}.md`)])
useHead({
  link: [
    {
      rel: 'alternate',
      href: joinURL(site.url, 'raw', `${path.value}.md`),
      type: 'text/markdown'
    }
  ]
})

const communityLinks = computed(() => [{
  icon: 'i-lucide-file-pen',
  label: 'Edit this page',
  to: `https://github.com/nuxt/ui/edit/v4/docs/content/${page?.value?.stem}.md`,
  target: '_blank'
}, {
  icon: 'i-lucide-star',
  label: 'Star on GitHub',
  to: `https://github.com/nuxt/ui`,
  target: '_blank'
}])
</script>

<template>
  <UPage v-if="page">
    <UPageHeader>
      <template #headline>
        <UBreadcrumb :items="breadcrumb" />
      </template>

      <template #title>
        {{ page.title }}

        <UBadge
          v-if="page.navigation?.badge"
          :label="page.navigation?.badge"
          variant="subtle"
          size="lg"
          class="rounded-full align-middle"
        />
      </template>

      <template #description>
        <MDC v-if="page.description" :value="page.description" unwrap="p" :cache-key="`${kebabCase(route.path)}-description`" />
      </template>

      <template #links>
        <UButton
          v-for="link in page.links"
          :key="link.label"
          color="neutral"
          variant="outline"
          :target="link.to?.startsWith('http') ? '_blank' : undefined"
          v-bind="link"
        >
          <template v-if="link.avatar" #leading>
            <UAvatar v-bind="link.avatar" size="2xs" :alt="`${link.label} avatar`" />
          </template>
        </UButton>
        <PageHeaderLinks />
      </template>
    </UPageHeader>

    <UPageBody>
      <ContentRenderer v-if="page.body" :value="page" />

      <USeparator v-if="surround?.filter(Boolean).length" />

      <UContentSurround :surround="(surround as any)" />
    </UPageBody>

    <template v-if="page?.body?.toc?.links?.length" #right>
      <UContentToc :links="page.body.toc.links" class="z-[2]">
        <template #bottom>
          <USeparator v-if="page.body?.toc?.links?.length" type="dashed" />

          <UPageLinks title="Community" :links="communityLinks" />

          <USeparator type="dashed" />

          <AdsCarbon />
        </template>
      </UContentToc>
    </template>
  </UPage>
</template>
