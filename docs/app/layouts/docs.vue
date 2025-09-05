<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

const route = useRoute()

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const { groupedNavigation } = useGroupNavigation(navigation!)
</script>

<template>
  <UMain>
    <UContainer>
      <UPage>
        <template #left>
          <UPageAside>
            <UContentNavigation
              :key="route.path"
              :navigation="groupedNavigation"
              highlight
              :ui="{
                linkTrailingBadge: 'font-semibold uppercase'
              }"
            />
          </UPageAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>
