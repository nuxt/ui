<template>
  <UMain>
    <UContainer>
      <UPage>
        <template #left>
          <UAside>
            <UNavigationTree :links="mapContentNavigation(navigation)" :multiple="false" default-open />
          </UAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

const nav = inject<Ref<NavItem[]>>('navigation')

const navigation = computed(() => nav.value.find(item => item._path.startsWith('/pro'))?.children)
</script>
