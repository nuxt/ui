<!-- Overrides the `@nuxt/ui-pro` v1 `.docs` layer layout to add the aside tabs. -->
<template>
  <UMain>
    <UContainer>
      <UPage>
        <template #left>
          <UAside>
            <template #top>
              <AsideTabs />
            </template>

            <UNavigationTree :links="mapContentNavigation(navigation)" :default-open="1" />
          </UAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content'

const nav = inject<Ref<NavItem[]>>('navigation', ref([]))

const navigation = computed(() => nav.value.find(item => item._path.startsWith('/pro'))?.children || [])
</script>
