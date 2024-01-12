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
        v-bind="($ui.button.secondary as any)"
      />
    </template>

    <template #panel>
      <UAsideLinks :links="links" />

      <UDivider type="dashed" class="mt-4 mb-3" />

      <BranchSelect v-if="!route.path.startsWith('/pro')" />

      <UNavigationTree :links="mapContentNavigation(navigation)" :multiple="false" default-open />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'
import type { HeaderLink } from '#ui-pro/types'

defineProps<{
  links: HeaderLink[]
}>()

const route = useRoute()
const { metaSymbol } = useShortcuts()

const nav = inject<Ref<NavItem[]>>('navigation')

const navigation = computed(() => {
  if (route.path.startsWith('/pro')) {
    return nav.value.find(item => item._path === '/pro')?.children
  }

  return nav.value.filter(item => !item._path.startsWith('/pro'))
})
</script>
