<script setup lang="ts">
import type { TransferListItem } from '@nuxt/ui'
import theme from '#build/ui/transfer-list'

const sizes = Object.keys(theme.variants.size)

const attrs = reactive({
  size: [theme.defaultVariants.size]
})

const filter = ref(true)
const header = ref(true)
const moveAll = ref(true)
const disabled = ref(false)

const items = [
  { label: 'Backlog', value: 'backlog', icon: 'i-lucide-circle-dashed', description: 'Ideas not yet planned' },
  { label: 'Todo', value: 'todo', icon: 'i-lucide-circle', description: 'Ready to be picked up' },
  { label: 'In Progress', value: 'in-progress', icon: 'i-lucide-timer', description: 'Currently being worked on' },
  { label: 'In Review', value: 'in-review', icon: 'i-lucide-eye', description: 'Waiting for a reviewer' },
  { label: 'Done', value: 'done', icon: 'i-lucide-circle-check', description: 'Shipped to production' },
  { label: 'Cancelled', value: 'cancelled', icon: 'i-lucide-circle-x', description: 'Won\'t be done', disabled: true },
  { label: 'Duplicate', value: 'duplicate', icon: 'i-lucide-copy', description: 'Tracked elsewhere' },
  { label: 'Blocked', value: 'blocked', icon: 'i-lucide-octagon-x', description: 'Waiting on a dependency' }
] satisfies TransferListItem[]

const value = ref(['todo', 'in-progress'])
</script>

<template>
  <Navbar>
    <USwitch v-model="filter" label="Filter" />
    <USwitch v-model="header" label="Header" />
    <USwitch v-model="moveAll" label="Move all" />
    <USwitch v-model="disabled" label="Disabled" />
    <USelect v-model="attrs.size" :items="sizes" placeholder="Size" multiple />
  </Navbar>

  <Matrix v-slot="props" :attrs="attrs" container-class="w-2xl max-w-full">
    <UTransferList
      v-model="value"
      :items="items"
      value-key="value"
      source-label="Statuses"
      target-label="Board columns"
      :filter="filter"
      :header="header"
      :move-all="moveAll"
      :disabled="disabled"
      v-bind="props"
      class="w-full"
    />
  </Matrix>

  <p class="text-sm text-muted text-center mt-4">
    Value: <code>{{ value }}</code>
  </p>
</template>
