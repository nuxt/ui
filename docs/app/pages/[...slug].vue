<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageBreadcrumb, mapContentNavigation } from '#ui-pro/utils/content'

const route = useRoute()
const { framework, module } = useSharedData()

definePageMeta({
  layout: 'docs'
})

const { data: page } = await useAsyncData(route.path, () => queryCollection('content').path(route.path).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('content', route.path, {
    fields: ['description']
  }).orWhere(group => group.where('framework', '=', framework.value).where('framework', 'IS NULL'))
    .orWhere(group => group.where('module', '=', module.value).where('module', 'IS NULL'))
}, {
  watch: [framework, module]
})

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const breadcrumb = computed(() => mapContentNavigation(findPageBreadcrumb(navigation?.value, page.value)).map(({ icon, ...link }) => link))

if (!import.meta.prerender) {
  // Redirect to the correct framework version if the page is not the current framework
  watch(framework, () => {
    if (page.value?.framework && page.value?.framework !== framework.value) {
      if (route.path.endsWith(`/${page.value?.framework}`)) {
        navigateTo(`${route.path.split('/').slice(0, -1).join('/')}/${framework.value}`)
      } else {
        navigateTo(`/getting-started`)
      }
    }
  })

  // Redirect to the correct module version if the page is not the current module
  watch(module, () => {
    if (page.value?.module && page.value?.module !== module.value) {
      if (page.value?.module === 'ui-pro' && route.path.includes('/pro')) {
        navigateTo(`${route.path.replace('/pro', '')}`)
      } else if (page.value?.module === 'ui' && !route.path.includes('/pro')) {
        navigateTo(`${route.path.replace(`/${framework.value}`, '')}/pro/${framework.value}`)
      } else {
        navigateTo(`/getting-started`)
      }
    }
  })
}

// Update the framework/module if the page has different ones
watch(page, () => {
  if (page.value?.framework && page.value?.framework !== framework.value) {
    framework.value = page.value?.framework as string
  }
  if (page.value?.module && page.value?.module !== module.value) {
    module.value = page.value?.module as string
  }
}, { immediate: true })

useSeoMeta({
  titleTemplate: `%s - Nuxt UI ${page.value.module === 'ui-pro' ? 'Pro' : ''} v3${page.value.framework === 'vue' ? ' for Vue' : ''}`,
  title: page.value.navigation?.title ? page.value.navigation.title : page.value.title,
  ogTitle: `${page.value.navigation?.title ? page.value.navigation.title : page.value.title} - Nuxt UI ${page.value.module === 'ui-pro' ? 'Pro' : ''} v3${page.value.framework === 'vue' ? ' for Vue' : ''}`,
  description: page.value.description,
  ogDescription: page.value.description
})

defineOgImageComponent('Docs', {
  headline: breadcrumb.value.map(item => item.label).join(' > ')
})

const communityLinks = computed(() => [{
  icon: 'i-lucide-file-pen',
  label: 'Edit this page',
  to: `https://github.com/nuxt/ui/edit/v3/docs/content/${page?.value?.stem}.md`,
  target: '_blank'
}, {
  icon: 'i-lucide-star',
  label: 'Star on GitHub',
  to: 'https://github.com/nuxt/ui',
  target: '_blank'
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
    <UPageHeader :title="page.title">
      <template #headline>
        <UBreadcrumb :items="breadcrumb" />
      </template>

      <template #description>
        <MDC v-if="page.description" :value="page.description" unwrap="p" />
      </template>

      <template v-if="page.links?.length" #links>
        <UButton
          v-for="link in page.links"
          :key="link.label"
          color="neutral"
          variant="outline"
          target="_blank"
          v-bind="link"
        >
          <template v-if="link.avatar" #leading>
            <UAvatar v-bind="link.avatar" size="2xs" />
          </template>
        </UButton>
      </template>
    </UPageHeader>

    <UPageBody>
      <ContentRenderer v-if="page.body" :value="page" />

      <USeparator />

      <UContentSurround :surround="(surround as any)" />
    </UPageBody>

    <template v-if="page?.body?.toc?.links?.length" #right>
      <UContentToc :links="page.body.toc.links" class="z-[2]">
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
