
<script setup>
import { SlideoverA } from '#components'

const slideover = useSlideover()


const openSlideoverA = () => {
  const instance = slideover.open(SlideoverA, {
    onClose: () => {
      instance.close()
    }
  })
}
</script>

<template>
  <div>
    <USlideovers />

    <UContainer class="min-h-screen flex items-center">
      <UButton @click="openSlideoverA">
        Open Slideover A
      </UButton>
    </UContainer>
  </div>
</template>



<style>
body {
  @apply antialiased font-sans text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-900;
}
</style>
