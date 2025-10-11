<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'
import { mapContentNavigation } from '@nuxt/ui/utils/content'

const route = useRoute()

const navigation = inject<Ref<ContentNavigationItem[]>>('navigation')

const items = computed(() => mapContentNavigation(navigation?.value.map(item => ({ ...item, children: undefined })) ?? [])?.map(item => ({
  ...item,
  active: route.path.startsWith(item.to as string)
})))

const blocksNavigation = computed(() => [{
  label: 'Headers',
  to: '/blocks/headers',
  active: route.path.startsWith('/blocks/headers')
}, {
  label: 'Hero',
  to: '/blocks/hero',
  active: route.path.startsWith('/blocks/hero')
}, {
  label: 'Footer',
  to: '/blocks/footer',
  active: route.path.startsWith('/blocks/footer')
}])
</script>

<template>
  <USeparator class="hidden lg:flex" />

  <UContainer class="hidden lg:flex items-center justify-between">
    <UNavigationMenu
      v-if="route.path.startsWith('/docs/')"
      :items="items"
      variant="pill"
      highlight
      class="-mx-2.5 -mb-px"
    />
    <UNavigationMenu
      v-else-if="route.path.startsWith('/blocks/')"
      :items="blocksNavigation"
      variant="pill"
      highlight
      class="-mx-2.5 -mb-px"
    />

    <FrameworkTabs class="w-40" />
  </UContainer>
</template>
