<script setup lang="ts">
import type { ContextMenuItem } from '@nuxt/ui'

const loading = ref(true)

const items = [
  {
    label: 'Refresh the Page',
    slot: 'refresh' as const
  },
  {
    label: 'Clear Cookies and Refresh'
  },
  {
    label: 'Clear Cache and Refresh'
  }
] satisfies ContextMenuItem[]
</script>

<template>
  <UContextMenu :items="items" :ui="{ content: 'w-48' }">
    <div class="flex items-center justify-center rounded-md border border-dashed border-(--ui-border-accented) text-sm aspect-video w-72">
      Right click here
    </div>

    <template #refresh-label>
      {{ loading ? 'Refreshing...' : 'Refresh the Page' }}
    </template>

    <template #refresh-trailing>
      <UIcon v-if="loading" name="i-lucide-refresh-cw" class="shrink-0 size-5 text-(--ui-primary) animate-spin" />
    </template>
  </UContextMenu>
</template>
