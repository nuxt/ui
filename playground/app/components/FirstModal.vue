<script lang="ts" setup>
import SecondModal from './SecondModal.vue'

const emit = defineEmits(['close'])

const overlay = useOverlay()
function openSecondModal() {
  overlay.create(SecondModal, {
    destroyOnClose: true
  }).open()
}
</script>

<template>
  <UModal title="First modal" description="This is the first modal opened from the button.">
    <template #footer>
      <UButton label="Open second modal" color="neutral" variant="outline" @click="openSecondModal" />
      <UButton color="neutral" label="Close" @click="emit('close')" />
    </template>
  </UModal>
</template>
