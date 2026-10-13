<script setup lang="ts">
const items = ref([
  { label: 'France', icon: 'i-lucide-map-pin', value: 'FR' },
  { label: 'Germany', icon: 'i-lucide-map-pin', value: 'DE' },
  { label: 'Italy', icon: 'i-lucide-map-pin', value: 'IT' },
  { label: 'Spain', icon: 'i-lucide-map-pin', value: 'ES' }
])
const value = ref('FR')
</script>

<template>
  <UListbox v-model="value" selected-icon="i-lucide-flame" value-key="value" :items="items" class="w-full" />
</template>
