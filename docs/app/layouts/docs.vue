<template>
  <UMain>
    <UContainer>
      <UPage>
        <template #left>
          <UPageAside>
            <!-- <BranchSelect /> -->

            <UContentNavigation :navigation="navigation" />
          </UPageAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>

<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

const nav = inject<Ref<NavItem[]>>('navigation')

const navigation = computed(() => nav.value.filter(item => !item._path.startsWith('/pro')))
</script>
