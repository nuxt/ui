<script lang="ts" setup>
// eslint-disable-next-line import/no-self-import
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
    :ui="{ footer: 'justify-end', content: 'data-[state=open]:animate-[light-slide-in-from-bottom_200ms_ease-out] data-[state=closed]:animate-[light-slide-out-to-bottom_200ms_ease-in]' }"
  >
    <template #footer>
      <UButton label="Another Modal" variant="subtle" color="neutral" @click="onClick" />
    </template>
  </UModal>
</template>
