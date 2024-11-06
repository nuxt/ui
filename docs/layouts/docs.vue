<template>
  <UMain>
    <UContainer>
      <UPage>
        <template #left>
          <UAside>
            <UNavigationTree :links="mapContentNavigation(navigation)" />
          </UAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

const nav = inject<Ref<NavItem[]>>('navigation')

const navigation = computed(() => nav.value.filter(item => !item._path.startsWith('/pro')))
</script>
