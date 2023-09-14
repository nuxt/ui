<template>
  <UHeader>
    <template #left>
      <NuxtLink to="/getting-started" class="flex items-end gap-1.5 font-bold text-xl text-gray-900 dark:text-white">
        <Logo class="w-auto h-6" />
      </NuxtLink>
    </template>

    <template #center>
      <UDocsSearchButton class="ml-1.5 flg:w-64 xl:w-96" />
    </template>

    <template #right>
      <ColorPicker />

      <UColorModeButton />

      <USocialButton to="https://twitter.com/nuxtlabs" target="_blank" icon="i-simple-icons-twitter" class="hidden lg:inline-flex" />
      <USocialButton to="https://github.com/nuxtlabs/ui" target="_blank" icon="i-simple-icons-github" class="hidden lg:inline-flex" />
    </template>

    <template #panel>
      <BranchSelect />
      <UNavigationTree :links="mapContentNavigation(navigation)" />
    </template>
  </UHeader>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

const { mapContentNavigation } = useElementsHelpers()

const navigation = inject<Ref<NavItem[]>>('navigation')
</script>
