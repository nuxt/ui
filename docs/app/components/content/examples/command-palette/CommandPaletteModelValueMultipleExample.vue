<script setup lang="ts">
const users = [
  { id: 1, label: 'Durward Reynolds' },
  { id: 2, label: 'Kenton Towne' },
  { id: 3, label: 'Therese Wunsch' },
  { id: 4, label: 'Benedict Kessler' },
  { id: 5, label: 'Katelyn Rohan' }
]

const selected = ref([users[0], users[1]])

function onSelect(items: any) {
  console.log(items)
}
</script>

<template>
  <UCommandPalette
    v-model="selected"
    multiple
    :groups="[{ id: 'users', items: users }]"
    class="flex-1"
    @update:model-value="onSelect"
  />
</template>
