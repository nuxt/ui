<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui'

const items: TreeItem[] = [
  {
    label: 'app/',
    value: 'app',
    children: [{
      label: 'composables/',
      value: 'composables',
      children: [
        { label: 'useAuth.ts', icon: 'i-vscode-icons-file-type-typescript' },
        { label: 'useUser.ts', icon: 'i-vscode-icons-file-type-typescript' }
      ]
    },
    {
      label: 'components/',
      value: 'components',
      children: [
        { label: 'Card.vue', icon: 'i-vscode-icons-file-type-vue' },
        { label: 'Button.vue', icon: 'i-vscode-icons-file-type-vue' }
      ]
    }]
  },
  { label: 'app.vue', icon: 'i-vscode-icons-file-type-vue' },
  { label: 'nuxt.config.ts', icon: 'i-vscode-icons-file-type-nuxt' }
]

const expanded = ref(['app', 'composables'])
</script>

<template>
  <UTree v-model:expanded="expanded" :items="items" />
</template>
