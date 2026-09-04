<script setup lang="ts">
import type { WheelPickerItem } from '@nuxt/ui'

const items = ref([
  { label: 'Free', value: 'free', price: '$0', icon: 'i-lucide-sprout' },
  { label: 'Starter', value: 'starter', price: '$9', icon: 'i-lucide-rocket' },
  { label: 'Pro', value: 'pro', price: '$29', icon: 'i-lucide-crown' },
  { label: 'Enterprise', value: 'enterprise', price: '$99', icon: 'i-lucide-building-2' }
] satisfies WheelPickerItem[])

const value = ref('pro')

const prices = computed(() => Object.fromEntries(items.value.map(item => [item.value, item.price])))
</script>

<template>
  <UWheelPicker v-model="value" :items="items" :item-height="44" class="w-64" aria-label="Plan">
    <template #item="{ item, active }">
      <UIcon v-if="item.icon" :name="item.icon" class="size-5 shrink-0" />
      <span class="flex-1 text-start truncate">{{ item.label }}</span>
      <span class="text-sm" :class="active ? 'text-primary' : 'text-dimmed'">{{ prices[String(item.value)] }}</span>
    </template>
  </UWheelPicker>
</template>
