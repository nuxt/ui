<template>
  <UMain>
    <UContainer>
      <UPage>
        <template #left>
          <UAside>
            <BranchSelect />

            <UNavigationTree :links="mapContentNavigation(docsNavigation)" />
          </UAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

const navigation = inject<NavItem[]>('navigation')

const docsNavigation = computed(() => navigation.value.filter(item => !item._path.startsWith('/pro')))
</script>
