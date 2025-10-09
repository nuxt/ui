<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui'
import type { TreeItemSelectEvent, TreeItemToggleEvent } from 'reka-ui'

function onSelect(event: TreeItemSelectEvent<TreeItem>) {
  if (event.detail.originalEvent.type === 'click') {
    event.preventDefault()
  }
}

function onToggle(event: TreeItemToggleEvent<TreeItem>) {
  if (event.detail.originalEvent.type === 'keydown') {
    event.preventDefault()
  }
}

const selectedItems = ref<(typeof items)>([])
const items: TreeItem[] = [
  {
    label: 'app/',
    children: [
      {
        label: 'composables/',
        children: [
          { label: 'useAuth.ts' },
          { label: 'useUser.ts' }
        ]
      },
      {
        label: 'components/',
        defaultExpanded: true,
        children: [
          { label: 'Card.vue' },
          { label: 'Button.vue' }
        ]
      }
    ]
  },
  { label: 'app.vue' },
  { label: 'nuxt.config.ts' }
]
</script>

<template>
  <UTree
    v-model="selectedItems"
    :items="items"
    multiple
    propagate-select
    bubble-select
    @item-select="onSelect"
    @item-toggle="onToggle"
  >
    <template #item-leading="{ selected, indeterminate, handleSelect }">
      <UCheckbox
        :model-value="indeterminate ? 'indeterminate' : selected"
        data-tree-select-checkbox="true"
        @change="handleSelect"
        @click.stop
      />
    </template>
  </UTree>
</template>
