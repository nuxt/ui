<script setup lang="ts">
import { LazySlideoverExample } from '#components'

const count = ref(0)

const toast = useToast()
const overlay = useOverlay()

const slideover = overlay.create(LazySlideoverExample, {
  props: {
    count: count.value
  }
})

async function open() {
  const shouldIncrement = await slideover.open()

  if (shouldIncrement) {
    count.value++

    toast.add({
      title: `Success: ${shouldIncrement}`,
      color: 'success',
      id: 'slideover-success'
    })

    // Update the count
    slideover.patch({
      count: count.value
    })
    return
  }

  toast.add({
    title: `Dismissed: ${shouldIncrement}`,
    color: 'error',
    id: 'slideover-dismiss'
  })
}
</script>

<template>
  <UButton label="Open" color="neutral" variant="subtle" @click="open" />
</template>
