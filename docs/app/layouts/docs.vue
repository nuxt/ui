<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { findPageChildren } from '@nuxt/content/utils'

const route = useRoute()

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const children = computed(() => findPageChildren(navigation?.value, `/docs/${route.params.slug?.[0]}`, { indexAsChild: true }))
</script>

<template>
  <UMain>
    <UContainer>
      <UPage>
        <template #left>
          <UPageAside>
            <UContentNavigation :navigation="children" highlight :ui="{ linkTrailingBadge: 'font-semibold uppercase' }" />
          </UPageAside>
        </template>

        <slot />
      </UPage>
    </UContainer>
  </UMain>
</template>
