<script setup lang="ts">
import type { RadioGroupItem } from '@nuxt/ui'

const items = [
  {
    value: 'free',
    label: 'Free',
    description: 'For trying out the basics.',
    slot: 'free' as const
  },
  {
    value: 'pro',
    label: 'Pro',
    description: 'For growing teams.'
  }
] satisfies RadioGroupItem[]
</script>

<template>
  <URadioGroup :items="items" variant="card" default-value="free" class="w-full">
    <template #free="{ item }">
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="font-medium">
            {{ item.label }}
          </p>
          <p class="text-muted">
            {{ item.description }}
          </p>
        </div>
        <UBadge label="Popular" color="primary" variant="subtle" />
      </div>
    </template>
  </URadioGroup>
</template>
