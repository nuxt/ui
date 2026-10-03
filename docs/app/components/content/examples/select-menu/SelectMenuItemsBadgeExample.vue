<script setup lang="ts">
import type { SelectMenuItem, BadgeProps } from '@nuxt/ui'

const items = ref([
  {
    label: 'bug',
    value: 'bug',
    badge: {
      label: '4',
      color: 'error'
    }
  },
  {
    label: 'feature',
    value: 'feature',
    badge: {
      label: '2',
      color: 'success'
    }
  },
  {
    label: 'enhancement',
    value: 'enhancement',
    badge: {
      label: '1',
      color: 'info'
    }
  }
] satisfies SelectMenuItem[])

const value = ref(items.value[0])
</script>

<template>
  <USelectMenu v-model="value" :items="items" class="w-48">
    <template #leading="{ modelValue, ui }">
      <UBadge
        v-if="modelValue"
        variant="soft"
        v-bind="modelValue.badge"
        :size="(ui.itemBadgeSize() as BadgeProps['size'])"
        :class="ui.itemBadge()"
      />
    </template>
  </USelectMenu>
</template>
