<script setup lang="ts">
import { SlideoverExampleComponent } from '#components'
const modal = useModal()
const count = ref(0)
function openSlideover () {
  count.value += 1
  modal.open(SlideoverExampleComponent, {
    count: count.value
  })
}
</script>

<template>
  <UButton label="Reveal modal" @click="openSlideover" />
</template>