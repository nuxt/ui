<script setup lang="ts">
import type { TransferListItem, TransferListSide } from '@nuxt/ui'

const toast = useToast()

const items = [
  { label: 'Read', value: 'read', icon: 'i-lucide-book-open' },
  { label: 'Write', value: 'write', icon: 'i-lucide-pencil' },
  { label: 'Delete', value: 'delete', icon: 'i-lucide-trash' },
  { label: 'Admin', value: 'admin', icon: 'i-lucide-shield' }
] satisfies TransferListItem[]

const permissions = ref(['read'])

function onMove({ items, to }: { items: TransferListItem[], to: TransferListSide }) {
  toast.add({
    title: to === 'target' ? 'Permissions granted' : 'Permissions revoked',
    description: items.map(item => item.label).join(', ')
  })
}
</script>

<template>
  <UTransferList
    v-model="permissions"
    :items="items"
    value-key="value"
    source-label="Available"
    target-label="Granted"
    class="w-full"
    @move="onMove"
  />
</template>
