<script setup lang="ts">
import { useRoute, useRouter } from '#imports'
import { upperName } from '../utils'

const route = useRoute()
const router = useRouter()

defineProps<{
  to?: string
}>()

const name = computed(() => route.path.split('/').pop() as string)
const title = computed(() => upperName(name.value))

const components = inject<{ to: string, label: string }[]>('components')

const index = computed(() => components?.findIndex(component => component.to === route.path) ?? -1)

function navigate(index: number) {
  router.push(components?.[index]?.to as string)
}

defineShortcuts({
  j: () => navigate(index.value + 1),
  k: () => navigate(index.value - 1)
})
</script>

<template>
  <UDashboardNavbar
    :title="title"
    :ui="{
      left: 'shrink-0',
      right: 'shrink overflow-x-auto py-2'
    }"
    class="absolute top-0 inset-x-0 z-5 bg-default"
  >
    <template #toggle>
      <UDashboardSidebarToggle size="sm" variant="outline" class="ring-default" />
      <UDashboardSidebarCollapse size="sm" variant="outline" class="ring-default" />
    </template>

    <template #leading>
      <UFieldGroup size="sm">
        <UButton
          icon="i-lucide-chevron-left"
          color="neutral"
          variant="outline"
          :disabled="index === 0"
          class="ring-default"
          aria-label="Previous component"
          @click="navigate(index - 1)"
        />
        <UButton
          icon="i-lucide-chevron-right"
          color="neutral"
          variant="outline"
          :disabled="index === (components?.length ?? 0) - 1"
          class="ring-default"
          aria-label="Next component"
          @click="navigate(index + 1)"
        />
      </UFieldGroup>
    </template>

    <template #trailing>
      <slot name="trailing">
        <UButton
          icon="i-lucide-external-link"
          :to="to || `https://ui.nuxt.com/docs/components/${name}`"
          color="neutral"
          variant="ghost"
          size="xs"
          aria-label="Open component in docs"
        />
      </slot>
    </template>

    <template #right>
      <slot />
    </template>
  </UDashboardNavbar>
</template>
