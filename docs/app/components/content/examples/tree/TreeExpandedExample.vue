<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui'

const items = [
  {
    label: 'app/',
    id: 'app',
    children: [
      {
        label: 'composables/',
        id: 'app/composables',
        children: [
          { label: 'useAuth.ts', icon: 'i-vscode-icons-file-type-typescript' },
          { label: 'useUser.ts', icon: 'i-vscode-icons-file-type-typescript' }
        ]
      },
      {
        label: 'components/',
        id: 'app/components',
        children: [
          { label: 'Card.vue', icon: 'i-vscode-icons-file-type-vue' },
          { label: 'Button.vue', icon: 'i-vscode-icons-file-type-vue' }
        ]
      }
    ]
  },
  { label: 'app.vue', id: 'app.vue', icon: 'i-vscode-icons-file-type-vue' },
  { label: 'nuxt.config.ts', id: 'nuxt.config.ts', icon: 'i-vscode-icons-file-type-nuxt' }
] satisfies TreeItem[]

const expanded = ref(['app', 'app/composables'])
</script>

<template>
  <UTree v-model:expanded="expanded" :items="items" :get-key="i => i.id" />
</template>
