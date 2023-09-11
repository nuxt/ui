<template>
  <UMain>
    <UContainer>
      <UPage>
        <template #left>
          <UAside :links="anchors">
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

const anchors = [{
  label: 'Documentation',
  icon: 'i-heroicons-book-open-solid',
  to: '/getting-started'
}, {
  label: 'Playground',
  icon: 'i-simple-icons-stackblitz',
  to: 'https://stackblitz.com/edit/nuxt-ui?file=app.config.ts,app.vue',
  target: '_blank'
}, {
  label: 'Releases',
  icon: 'i-heroicons-rocket-launch-solid',
  to: 'https://github.com/nuxt/ui/releases',
  target: '_blank'
}]
</script>
