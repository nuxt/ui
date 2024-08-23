<script setup lang="ts">
import { LazyExampleModalComponent } from '#components'

const count = ref(0)

const modal = useModal()

function openModal() {
  count.value++

  modal.open(LazyExampleModalComponent, {
    description: 'And you can even provide a description !',
    count: count.value
  })
}
</script>

<template>
  <UButton label="Open" color="gray" variant="subtle" @click="openModal" />
</template>
