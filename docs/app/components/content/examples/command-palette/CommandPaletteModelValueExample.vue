<script setup lang="ts">
const users = [
  { id: 1, label: 'Durward Reynolds' },
  { id: 2, label: 'Kenton Towne' },
  { id: 3, label: 'Therese Wunsch' },
  { id: 4, label: 'Benedict Kessler' },
  { id: 5, label: 'Katelyn Rohan' }
]

const selected = ref(users[0])

function onSelect(item: any) {
  console.log(item)
}
</script>

<template>
  <UCommandPalette
    v-model="selected"
    :groups="[{ id: 'users', items: users }]"
    class="flex-1"
    @update:model-value="onSelect"
  />
</template>
