<script setup lang="ts">
import type { ListboxItem } from '@nuxt/ui'

const items: ListboxItem[] = [
  { label: 'Benjamin Canac', description: 'benjamincanac', avatar: { src: 'https://github.com/benjamincanac.png' }, id: 1 },
  { label: 'Romain Hamel', description: 'romhml', avatar: { src: 'https://github.com/romhml.png' }, id: 2 },
  { label: 'Sébastien Chopin', description: 'atinux', avatar: { src: 'https://github.com/atinux.png' }, id: 3 },
  { label: 'Hugo Richard', description: 'HugoRCD', avatar: { src: 'https://github.com/HugoRCD.png' }, id: 4 },
  { label: 'Sandro Circi', description: 'sandros94', avatar: { src: 'https://github.com/sandros94.png' }, id: 5 },
  { label: 'Daniel Roe', description: 'danielroe', avatar: { src: 'https://github.com/danielroe.png' }, id: 6 },
  { label: 'Jakub Michálek', description: 'J-Michalek', avatar: { src: 'https://github.com/J-Michalek.png' }, id: 7 }
]

const value = ref<ListboxItem[]>([])
</script>

<template>
  <UListbox
    v-model="value"
    :items="items"
    multiple
    by="id"
    class="w-full"
  />
</template>
