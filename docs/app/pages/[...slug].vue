<script setup lang="ts">
import { kebabCase } from 'scule'
import type { ContentNavigationItem } from '@nuxt/content'
import type { PageLink } from '@nuxt/ui-pro'
import { findPageBreadcrumb, mapContentNavigation } from '@nuxt/ui-pro/utils/content'

const route = useRoute()
const { framework, module } = useSharedData()

definePageMeta({
  layout: 'docs'
})

const { data: page } = await useAsyncData(kebabCase(route.path), () => queryCollection('content').path(route.path).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
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

const { data: surround } = await useAsyncData(`${kebabCase(route.path)}-surround`, () => {
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

const type = page.value?.path.includes('components') ? 'Vue Component ' : page.value?.path.includes('composables') ? 'Vue Composable ' : ''
useSeoMeta({
  titleTemplate: `%s ${type}- Nuxt UI ${page.value.module === 'ui-pro' ? 'Pro' : ''} v3${page.value.framework === 'vue' ? ' for Vue' : ''}`,
  title: page.value.navigation?.title ? page.value.navigation.title : page.value.title,
  ogTitle: `${page.value.navigation?.title ? page.value.navigation.title : page.value.title} ${type}- Nuxt UI ${page.value.module === 'ui-pro' ? 'Pro' : ''} v3${page.value.framework === 'vue' ? ' for Vue' : ''}`,
  description: page.value.description,
  ogDescription: page.value.description
})

if (route.path.startsWith('/components')) {
  defineOgImageComponent('OgImageComponent', {
    title: page.value.title,
    description: page.value.description,
    component: (route.params.slug as string[]).pop() as string,
    module: page.value.module
  })
} else {
  defineOgImageComponent('Docs', {
    title: page.value.title,
    description: page.value.description,
    headline: breadcrumb.value?.[breadcrumb.value.length - 1]?.label || 'Nuxt UI',
    framework: page.value?.framework,
    module: page.value.module
  })
}

const communityLinks = computed(() => [{
  icon: 'i-lucide-file-pen',
  label: 'Edit this page',
  to: `https://github.com/nuxt/${page.value?.module === 'ui-pro' ? 'ui-pro' : 'ui'}/edit/v3/docs/content/${page?.value?.stem}.md`,
  target: '_blank'
}, {
  icon: 'i-lucide-star',
  label: 'Star on GitHub',
  to: `https://github.com/nuxt/${page.value?.module === 'ui-pro' ? 'ui-pro' : 'ui'}`,
  target: '_blank'
}, module.value === 'ui-pro' && {
  icon: 'i-lucide-credit-card',
  label: 'Purchase a license',
  to: 'https://nuxt.lemonsqueezy.com/checkout/buy/057dacb2-87ba-4dc1-9256-59ee5b3bd394',
  target: '_blank'
}, module.value === 'ui-pro' && {
  icon: 'i-lucide-ticket-percent',
  label: 'Become an affiliate',
  to: 'https://nuxt.lemonsqueezy.com/affiliates',
  target: '_blank'
}, {
  icon: 'i-lucide-life-buoy',
  label: 'Contribution',
  to: '/getting-started/contribution'
}, {
  label: 'Roadmap',
  icon: 'i-lucide-map',
  to: '/roadmap'
}].filter(Boolean) as PageLink[])
</script>

<template>
  <UPage v-if="page">
    <UPageHeader>
      <template #headline>
        <UBreadcrumb :items="breadcrumb" />
      </template>

      <template #title>
        {{ page.title }}<sup v-if="page.module === 'ui-pro'" class="ml-1 text-xs align-super font-medium text-(--ui-primary)">PRO</sup>
      </template>

      <template #description>
        <MDC v-if="page.description" :value="page.description" unwrap="p" :cache-key="`${kebabCase(route.path)}-description`" />
      </template>

      <template v-if="page.links?.length" #links>
        <UButton
          v-for="link in page.links"
          :key="link.label"
          color="neutral"
          variant="outline"
          :target="link.to.startsWith('http') ? '_blank' : undefined"
          v-bind="link"
        >
          <template v-if="link.avatar" #leading>
            <UAvatar v-bind="link.avatar" size="2xs" :alt="`${link.label} avatar`" />
          </template>
        </UButton>
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
