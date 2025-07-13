<script lang="ts" setup>
import StackingModal from './StackingModal.vue'

const overlay = useOverlay()
function onClick() {
  overlay
    .create(StackingModal, {
      destroyOnClose: true
    })
    .open()
}
</script>

<template>
  <UModal
    title="A Modal"
    :ui="{ footer: 'justify-end' }"
  >
    <template #footer>
      <UButton label="Another Modal" variant="subtle" color="neutral" @click="onClick" />
    </template>
  </UModal>
</template>
