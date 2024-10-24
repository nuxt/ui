<script setup lang="ts">
import { SlideoverExampleComponent } from '#components'

const slideover = useSlideover()
const count = ref(0)
function openSlideover() {
  count.value += 1
  slideover.open(SlideoverExampleComponent, {
    count: count.value,
    onClose: slideover.close
  })
}
</script>

<template>
  <UButton label="Reveal slideover" @click="openSlideover" />
</template>
