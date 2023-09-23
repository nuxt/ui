<template>
  <UMain>
    <UContainer>
      <UPage>
        <template #left>
          <UAside :links="links">
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

const nav = inject<Ref<NavItem[]>>('navigation')

const navigation = computed(() => nav.value.filter(item => !item._path.startsWith('/pro')))

const links = [{
  label: 'Figma Kit',
  icon: 'i-simple-icons-figma',
  to: 'https://www.figma.com/community/file/1009606299846269139/Nuxt-UI',
  target: '_blank'
}, {
  label: 'Releases',
  icon: 'i-heroicons-rocket-launch',
  to: 'https://github.com/nuxt/ui/releases',
  target: '_blank'
}]
</script>
