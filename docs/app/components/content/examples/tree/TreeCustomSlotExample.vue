<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui'

const items: TreeItem[] = [
  {
    label: 'app/',
    slot: 'app',
    defaultExpanded: true,
    children: [{
      label: 'composables/',
      children: [
        { label: 'useAuth.ts', icon: 'i-vscode-icons-file-type-typescript' },
        { label: 'useUser.ts', icon: 'i-vscode-icons-file-type-typescript' }
      ]
    },
    {
      label: 'components/',
      defaultExpanded: true,
      children: [
        { label: 'Card.vue', icon: 'i-vscode-icons-file-type-vue' },
        { label: 'Button.vue', icon: 'i-vscode-icons-file-type-vue' }
      ]
    }]
  },
  { label: 'app.vue', icon: 'i-vscode-icons-file-type-vue' },
  { label: 'nuxt.config.ts', icon: 'i-vscode-icons-file-type-nuxt' }
]
</script>

<template>
  <UTree :items="items">
    <template #app="{ item }">
      <p class="italic font-bold">
        {{ item.label }}
      </p>
    </template>
  </UTree>
</template>
