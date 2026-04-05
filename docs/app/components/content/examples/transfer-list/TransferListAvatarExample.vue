<script setup lang="ts">
import type { TransferListItem } from '@nuxt/ui'

const items: TransferListItem[] = [
  { label: 'Benjamin Canac', description: 'benjamincanac', avatar: { src: 'https://github.com/benjamincanac.png' }, id: 1 },
  { label: 'Romain Hamel', description: 'romhml', avatar: { src: 'https://github.com/romhml.png' }, id: 2 },
  { label: 'Sébastien Chopin', description: 'atinux', avatar: { src: 'https://github.com/atinux.png' }, id: 3 },
  { label: 'Hugo Richard', description: 'HugoRCD', avatar: { src: 'https://github.com/HugoRCD.png' }, id: 4 },
  { label: 'Sandro Circi', description: 'sandros94', avatar: { src: 'https://github.com/sandros94.png' }, id: 5 },
  { label: 'Daniel Roe', description: 'danielroe', avatar: { src: 'https://github.com/danielroe.png' }, id: 6 },
  { label: 'Jakub Michálek', description: 'J-Michalek', avatar: { src: 'https://github.com/J-Michalek.png' }, id: 7 },
  { label: 'Eugen Istoc', description: 'genu', avatar: { src: 'https://github.com/genu.png' }, id: 8 }
]

const value = ref<TransferListItem[]>([])
</script>

<template>
  <UTransferList
    v-model="value"
    class="w-full"
    :items="items"
    source-title="All Users"
    target-title="Team Members"
    by="id"
  />
</template>
