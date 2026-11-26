<script setup lang="ts">
import type { TransferListItem } from '@nuxt/ui'

const items = [
  { label: 'Name', value: 'name', icon: 'i-lucide-text' },
  { label: 'Email', value: 'email', icon: 'i-lucide-mail' },
  { label: 'Role', value: 'role', icon: 'i-lucide-shield' },
  { label: 'Status', value: 'status', icon: 'i-lucide-activity' },
  { label: 'Created at', value: 'createdAt', icon: 'i-lucide-calendar' }
] satisfies TransferListItem[]

const columns = ref(['name', 'email'])
</script>

<template>
  <UTransferList
    v-model="columns"
    :items="items"
    value-key="value"
    source-label="Hidden columns"
    target-label="Visible columns"
    class="w-full"
  >
    <template #controls="{ moveToTarget, moveToSource, canMoveToTarget, canMoveToSource }">
      <UButton
        label="Show"
        trailing-icon="i-lucide-eye"
        size="sm"
        :disabled="!canMoveToTarget"
        block
        @click="moveToTarget"
      />
      <UButton
        label="Hide"
        leading-icon="i-lucide-eye-off"
        size="sm"
        color="neutral"
        variant="subtle"
        :disabled="!canMoveToSource"
        block
        @click="moveToSource"
      />
    </template>
  </UTransferList>
</template>
