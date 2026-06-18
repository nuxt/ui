<script setup lang="ts">
import type { DropdownMenuItem } from '@nuxt/ui'

const toast = useToast()

const items: DropdownMenuItem[][] = [
  [
    { label: 'View report', icon: 'i-lucide-eye', onSelect: () => toast.add({ title: 'View report' }) },
    { label: 'Export as CSV', icon: 'i-lucide-download', onSelect: () => toast.add({ title: 'Exporting…' }) },
    { label: 'Refresh', icon: 'i-lucide-refresh-cw', onSelect: () => toast.add({ title: 'Refreshed' }) }
  ],
  [
    { label: 'Delete', icon: 'i-lucide-trash', color: 'error', onSelect: () => toast.add({ title: 'Deleted', color: 'error' }) }
  ]
]

const progress = ref(75)
</script>

<template>
  <div class="flex flex-col gap-4 p-4">
    <div class="flex items-start justify-between">
      <div>
        <p class="text-sm text-muted">
          Total revenue
        </p>
        <p class="text-2xl font-semibold text-highlighted">
          $48,200
        </p>
      </div>

      <div class="flex items-center gap-2">
        <UBadge color="success" variant="subtle" size="sm" icon="i-lucide-trending-up">
          +12.5%
        </UBadge>

        <UDropdownMenu :items="items" :ui="{ content: 'w-44' }">
          <UButton
            icon="i-lucide-ellipsis-vertical"
            color="neutral"
            variant="ghost"
            size="sm"
            square
            aria-label="Actions"
          />
        </UDropdownMenu>
      </div>
    </div>

    <div class="space-y-1.5">
      <div class="flex items-center justify-between text-sm">
        <span class="text-muted">Monthly goal</span>
        <span class="font-medium text-highlighted">{{ progress }}%</span>
      </div>
      <UProgress v-model="progress" size="sm" />
    </div>

    <USeparator />

    <div class="flex items-center justify-between">
      <UAvatarGroup size="xs">
        <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" loading="lazy" />
        <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" loading="lazy" />
        <UAvatar src="https://github.com/noook.png" alt="Neil Richter" loading="lazy" />
      </UAvatarGroup>
      <span class="text-xs text-muted">+8 active now</span>
    </div>
  </div>
</template>
