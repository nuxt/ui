<script setup lang="ts">
import type { ProgressGroupItem } from '@nuxt/ui'

const max = 256

const items: ProgressGroupItem[] = [
  { label: 'System prompt', value: 1.2, color: 'var(--color-neutral-400)' },
  { label: 'Tool definitions', value: 14.1, color: 'var(--color-violet-400)' },
  { label: 'Rules', value: 12.8, color: 'var(--color-green-400)' },
  { label: 'Skills', value: 7.1, color: 'var(--color-amber-400)' },
  { label: 'MCP & dynamic tools', value: 17.1, color: 'var(--color-pink-300)' },
  { label: 'Subagent definitions', value: 1.5, color: 'var(--color-sky-400)' },
  { label: 'Conversation', value: 11.1, color: 'var(--color-rose-400)' }
]

const used = items.reduce((total, item) => total + (item.value ?? 0), 0)
</script>

<template>
  <UProgressGroup :items="items" :max="max" status class="w-96" :ui="{ status: 'w-full justify-between' }">
    <template #status="{ percent }">
      <p>{{ percent }}% Full</p>
      <p class="text-muted">
        ~{{ used.toFixed(1) }}K / {{ max }}K Tokens
      </p>
    </template>

    <template #item-trailing="{ item }">
      {{ item.value }}K
    </template>
  </UProgressGroup>
</template>
