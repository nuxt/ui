<script lang="ts" setup>
import { LazyStackingModal } from '#components'

const overlay = useOverlay()

function onClick() {
  overlay
    .create(LazyStackingModal, {
      destroyOnClose: true
    })
    .open()
}
</script>

<template>
  <UButton label="Open" variant="subtle" color="neutral" @click="onClick" />
</template>
