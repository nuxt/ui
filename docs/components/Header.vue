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
      <NuxtLink to="/" class="flex items-end gap-2 text-xl text-gray-900 dark:text-white min-w-0 shrink-0" aria-label="Nuxt UI">
        <LogoPro v-if="$route.path.startsWith('/pro')" class="w-auto h-6 shrink-0" />
        <Logo v-else class="w-auto h-6 shrink-0" />
      </NuxtLink>

      <UDropdown
        :items="[[{ label: $route.path.startsWith('/pro') ? `v${pkg.version.split('-')[0]}` : `v${config.version}`, class: 'text-primary-500 dark:text-primary-400' }, { label: 'v3.0.0-alpha.x', to: 'https://ui3.nuxt.dev' }]]"
        :popper="{ strategy: 'absolute', offsetDistance: 11, placement: 'bottom-start' }"
        :ui="{
          background: 'dark:bg-gray-900',
          ring: 'dark:ring-gray-800',
          width: 'w-auto',
          item: {
            padding: 'p-1',
            size: 'text-xs',
            active: 'dark:bg-gray-800/50'
          }
        }"
      >
        <UButton
          :label="$route.path.startsWith('/pro') ? `v${pkg.version.split('-')[0]}` : `v${config.version}`"
          trailing-icon="i-lucide-chevron-down"
          variant="outline"
          size="2xs"
          truncate
          class="-mb-[6px] font-semibold rounded-full truncate ring-primary-500/25 dark:ring-primary-400/25 bg-primary-500/10 dark:bg-primary-400/10 hover:bg-primary-500/15 dark:hover:bg-primary-400/15 transition-colors"
        />
      </UDropdown>
    </template>

    <template #right>
      <ColorPicker />

      <UTooltip text="Search" :shortcuts="[metaSymbol, 'K']" :popper="{ strategy: 'absolute' }">
        <UContentSearchButton :label="null" />
      </UTooltip>

      <UColorModeButton class="hidden lg:inline-flex" />

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
