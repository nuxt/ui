<template>
  <UHeader
    :links="links"
    :class="{
      'border-primary-200/75 dark:border-primary-900/50': $route.path === '/',
      'border-gray-200 dark:border-gray-800': $route.path !== '/'
    }"
  >
    <template #left>
      <NuxtLink to="/" class="flex items-end gap-1.5 font-bold text-xl text-gray-900 dark:text-white">
        <Logo class="w-auto h-6" />
      </NuxtLink>
    </template>

    <template v-if="$route.path !== '/'" #center>
      <UDocsSearchButton class="ml-1.5 flg:w-64 xl:w-96" />
    </template>

    <template #right>
      <ColorPicker />

      <UDocsSearchButton v-if="$route.path === '/'" icon-only />

      <UColorModeButton v-if="!$colorMode.forced" />

      <USocialButton to="https://github.com/nuxt/ui" target="_blank" icon="i-simple-icons-github" class="hidden lg:inline-flex" />
    </template>

    <template #panel>
      <BranchSelect />

      <UNavigationTree :links="mapContentNavigation(navigation)" />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

const route = useRoute()
const { mapContentNavigation } = useElementsHelpers()

const navigation = inject<Ref<NavItem[]>>('navigation')

const links = computed(() => {
  if (route.path !== '/') {
    return []
  }

  return [{
    label: 'Documentation',
    icon: 'i-heroicons-book-open-solid',
    to: '/getting-started'
  }, {
    label: 'Playground',
    icon: 'i-simple-icons-stackblitz',
    to: 'https://stackblitz.com/edit/nuxt-ui?file=app.config.ts,app.vue',
    target: '_blank'
  }, {
    label: 'Releases',
    icon: 'i-heroicons-rocket-launch-solid',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank'
  }]
})
</script>
