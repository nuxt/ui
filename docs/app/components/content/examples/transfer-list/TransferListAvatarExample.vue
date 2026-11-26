<script setup lang="ts">
import type { TransferListItem } from '@nuxt/ui'

const members = [
  { label: 'Benjamin Canac', description: 'benjamincanac', value: 'benjamincanac', avatar: { src: 'https://github.com/benjamincanac.png', alt: 'Benjamin Canac' } },
  { label: 'Sébastien Chopin', description: 'atinux', value: 'atinux', avatar: { src: 'https://github.com/atinux.png', alt: 'Sébastien Chopin' } },
  { label: 'Romain Hamel', description: 'romhml', value: 'romhml', avatar: { src: 'https://github.com/romhml.png', alt: 'Romain Hamel' } },
  { label: 'Hugo Richard', description: 'HugoRCD', value: 'HugoRCD', avatar: { src: 'https://github.com/HugoRCD.png', alt: 'Hugo Richard' } },
  { label: 'Sandro Circi', description: 'sandros94', value: 'sandros94', avatar: { src: 'https://github.com/sandros94.png', alt: 'Sandro Circi' } },
  { label: 'Daniel Roe', description: 'danielroe', value: 'danielroe', avatar: { src: 'https://github.com/danielroe.png', alt: 'Daniel Roe' } }
] satisfies TransferListItem[]

const team = ref(['atinux', 'romhml'])
</script>

<template>
  <UTransferList
    v-model="team"
    :items="members"
    value-key="value"
    source-label="Members"
    target-label="Team"
    filter
    class="w-full"
  />
</template>
