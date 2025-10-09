<script setup lang="ts">
import type { TreeItem } from '@nuxt/ui'
import type { TreeItemSelectEvent, TreeItemToggleEvent } from 'reka-ui'

const items: TreeItem[] = [
  {
    label: 'app/',
    defaultExpanded: true,
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

const value = ref<(typeof items)>([])

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
</script>

<template>
  <UTree
    v-model="value"
    :items="items"
    multiple
    propagate-select
    bubble-select
    @select="onSelect"
    @toggle="onToggle"
  >
    <template #item-leading="{ selected, indeterminate, handleSelect }">
      <UCheckbox
        :model-value="indeterminate ? 'indeterminate' : selected"
        @change="handleSelect"
        @click.stop
      />
    </template>
  </UTree>
</template>
