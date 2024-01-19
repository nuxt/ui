<script setup lang="ts">
const isOpen = ref(false)

const people = [
  { id: 1, label: 'Wade Cooper' },
  { id: 2, label: 'Arlene Mccoy' },
  { id: 3, label: 'Devon Webb' },
  { id: 4, label: 'Tom Cook' },
  { id: 5, label: 'Tanya Fox' },
  { id: 6, label: 'Hellen Schmidt' },
  { id: 7, label: 'Caroline Schultz' },
  { id: 8, label: 'Mason Heaney' },
  { id: 9, label: 'Claudie Smitham' },
  { id: 10, label: 'Emil Schaefer' }
]

const selected = ref([])
</script>

<template>
  <div>
    <UButton label="Open" @click="isOpen = true" />

    <UModal v-model="isOpen">
      <UCommandPalette
        v-model="selected"
        multiple
        nullable
        :groups="[{ key: 'people', commands: people }]"
      />
    </UModal>
  </div>
</template>
