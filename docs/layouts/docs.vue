<template>
  <UMain>
    <UContainer>
      <UPage>
        <template #left>
          <UAside>
            <BranchSelect />

            <UNavigationTree :links="mapContentNavigation(navigation)" />
          </UAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

const { mapContentNavigation } = useElementsHelpers()

const navigation = inject<NavItem[]>('navigation')
</script>
