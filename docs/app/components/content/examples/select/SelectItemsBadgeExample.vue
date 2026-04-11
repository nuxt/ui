<script setup lang="ts">
import type { SelectItem, BadgeProps } from '@nuxt/ui'

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
] satisfies SelectItem[])

const value = ref(items.value[0]?.value)

function getBadge(value: string) {
  return items.value.find(item => item.value === value)?.badge
}
</script>

<template>
  <USelect v-model="value" :items="items" value-key="value" class="w-48">
    <template #leading="{ modelValue, ui }">
      <UBadge
        v-if="modelValue"
        variant="soft"
        v-bind="getBadge(modelValue)"
        :size="(ui.itemBadgeSize() as BadgeProps['size'])"
        :class="ui.itemBadge()"
      />
    </template>
  </USelect>
</template>
