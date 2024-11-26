<template>
  <UHeader
    :links="links"
    :class="{
      'border-primary-200/75 dark:border-primary-900/50': $route.path === '/',
      'border-gray-200 dark:border-gray-800': $route.path !== '/'
    }"
    :ui="{
      left: 'min-w-0'
    }"
  >
    <template #left>
      <NuxtLink to="/" class="flex items-end gap-2 font-bold text-xl text-gray-900 dark:text-white min-w-0" aria-label="Nuxt UI">
        <LogoPro v-if="$route.path.startsWith('/pro')" class="w-auto h-6 shrink-0" />
        <Logo v-else class="w-auto h-6 shrink-0" />

        <UBadge :label="$route.path.startsWith('/pro') ? `v${pkg.version.split('-')[0]}` : `v${config.version}`" variant="subtle" size="xs" class="-mb-[2px] rounded font-semibold truncate hidden sm:inline-flex" />
      </NuxtLink>
    </template>

    <template #right>
      <ColorPicker />

      <UTooltip text="Search" :shortcuts="[metaSymbol, 'K']" :popper="{ strategy: 'absolute' }">
        <UContentSearchButton :label="null" />
      </UTooltip>

      <UColorModeButton />

      <UButton
        to="https://github.com/nuxt/ui/tree/dev"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="GitHub"
        v-bind="($ui.button.secondary as any)"
      />
    </template>

    <template #panel>
      <UAsideLinks :links="links" />

      <UDivider type="dashed" class="my-4" />

      <UNavigationTree :links="mapContentNavigation(navigation)" :multiple="false" default-open />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content'
import pkg from '@nuxt/ui-pro/package.json'
import type { HeaderLink } from '#ui-pro/types'

defineProps<{
  links: HeaderLink[]
}>()

const route = useRoute()
const { $ui } = useNuxtApp()
const { metaSymbol } = useShortcuts()
const config = useRuntimeConfig().public

const nav = inject<Ref<NavItem[]>>('navigation')

const navigation = computed(() => {
  if (route.path.startsWith('/pro')) {
    return nav.value.find(item => item._path === '/pro')?.children
  }

  return nav.value.filter(item => !item._path.startsWith('/pro'))
})
</script>
