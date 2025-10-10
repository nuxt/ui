<script setup lang="ts">
import type { TreeItemSelectEvent } from 'reka-ui'
import type { TreeItem } from '@nuxt/ui'

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

function onSelect(e: TreeItemSelectEvent<TreeItem>) {
  if (e.detail.originalEvent.type === 'click') {
    e.preventDefault()
  }
}
</script>

<template>
  <UTree
    v-model="value"
    :as="{ link: 'div' }"
    :items="items"
    multiple
    propagate-select
    bubble-select
    @select="onSelect"
  >
    <template #item-leading="{ selected, indeterminate, handleSelect }">
      <UCheckbox
        :model-value="indeterminate ? 'indeterminate' : selected"
        tabindex="-1"
        @change="handleSelect"
        @click.stop
      />
    </template>
  </UTree>
</template>
