<script setup lang="ts">
import { LazyModalExample } from '#components'

const count = ref(0)

const modal = useModal()

function open() {
  count.value++

  modal.open(LazyModalExample, {
    description: 'And you can even provide a description!',
    count: count.value
  })
}
</script>

<template>
  <UButton label="Open" color="neutral" variant="subtle" @click="open" />
</template>
