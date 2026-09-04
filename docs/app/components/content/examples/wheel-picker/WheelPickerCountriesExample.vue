<script setup lang="ts">
import type { WheelPickerItem } from '@nuxt/ui'

const items = ref([
  { label: 'France', value: 'fr', icon: 'i-circle-flags-fr' },
  { label: 'Germany', value: 'de', icon: 'i-circle-flags-de' },
  { label: 'Italy', value: 'it', icon: 'i-circle-flags-it' },
  { label: 'Japan', value: 'jp', icon: 'i-circle-flags-jp' },
  { label: 'Spain', value: 'es', icon: 'i-circle-flags-es' },
  { label: 'United Kingdom', value: 'gb', icon: 'i-circle-flags-gb' },
  { label: 'United States', value: 'us', icon: 'i-circle-flags-us' }
] satisfies WheelPickerItem[])

const value = ref('jp')
</script>

<template>
  <UWheelPicker v-model="value" :items="items" class="w-56" aria-label="Country" />
</template>
