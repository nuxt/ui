<template>
  <UHeader
    :links="links"
    :class="{
      'border-primary-200/75 dark:border-primary-900/50': $route.path === '/',
      'border-gray-200 dark:border-gray-800': $route.path !== '/'
    }"
  >
    <template #left>
      <NuxtLink to="/" class="flex items-end gap-1.5 font-bold text-xl text-gray-900 dark:text-white" aria-label="Nuxt UI">
        <Logo class="w-auto h-6" />
      </NuxtLink>
    </template>

    <template #right>
      <ColorPicker />

      <UTooltip text="Search" :shortcuts="[metaSymbol, 'K']">
        <UDocsSearchButton icon-only />
      </UTooltip>

      <UColorModeButton v-if="!$colorMode.forced" />

      <USocialButton to="https://github.com/nuxt/ui" target="_blank" icon="i-simple-icons-github" aria-label="GitHub" class="hidden lg:inline-flex" />
    </template>

    <template #panel>
      <BranchSelect />

      <UNavigationTree :links="mapContentNavigation(navigation)" />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

const { metaSymbol } = useShortcuts()
const { mapContentNavigation } = useElementsHelpers()

const navigation = inject<Ref<NavItem[]>>('navigation')

const links = computed(() => {
  return [{
    label: 'Documentation',
    icon: 'i-heroicons-book-open-solid',
    to: '/getting-started'
  }, {
    label: 'Examples',
    icon: 'i-heroicons-square-3-stack-3d',
    to: '/getting-started/examples'
  }, {
    label: 'Playground',
    icon: 'i-simple-icons-stackblitz',
    to: '/playground'
  }, {
    label: 'Releases',
    icon: 'i-heroicons-rocket-launch-solid',
    to: 'https://github.com/nuxt/ui/releases',
    target: '_blank'
  }]
})
</script>
