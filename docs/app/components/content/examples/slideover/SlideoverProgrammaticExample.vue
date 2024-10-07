<script setup lang="ts">
import { LazySlideoverExample } from '#components'

const count = ref(0)

const slideover = useSlideover()

function open() {
  count.value++

  slideover.open(LazySlideoverExample, {
    title: 'Slideover',
    count: count.value
  })
}
</script>

<template>
  <UButton label="Open" color="neutral" variant="subtle" @click="open" />
</template>
