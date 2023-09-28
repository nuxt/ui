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
        <UDocsSearchButton :label="null" />
      </UTooltip>

      <UColorModeButton />

      <UButton
        to="https://github.com/nuxt/ui"
        target="_blank"
        icon="i-simple-icons-github"
        aria-label="GitHub"
        class="hidden lg:inline-flex"
        v-bind="($ui.button.secondary as any)"
      />
    </template>

    <template #panel>
      <UAsideLinks :links="links" />

      <BranchSelect />

      <UNavigationTree :links="mapContentNavigation(navigation)" />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'
import type { Link } from '#ui-pro/types'

defineProps<{
  links: Link[]
}>()

const { metaSymbol } = useShortcuts()

const nav = inject<Ref<NavItem[]>>('navigation')

const navigation = computed(() => nav.value.filter(item => !item._path.startsWith('/pro')))
</script>
