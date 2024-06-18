<script setup lang="ts">
import type { NavItem } from '@nuxt/content/dist/runtime/types'

const nav = inject<Ref<NavItem[]>>('navigation')

const navigation = computed(() => nav.value.filter(item => !item._path.startsWith('/pro')))

const { module, modules } = useModule()
</script>

<template>
  <UMain>
    <UContainer>
      <UPage>
        <template #left>
          <UPageAside>
            <USelect v-model="module" :items="modules" icon="i-heroicons-cube" class="w-full mb-3 lg:mb-6" />

            <UContentNavigation :navigation="navigation" />
          </UPageAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>
