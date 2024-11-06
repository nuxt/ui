<script lang="ts" setup>
defineProps({
  count: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['success'])

function onSuccess() {
  emit('success')
}
</script>

<template>
  <UModal>
    <UCard>
      <div class="space-y-2">
        <p>This modal was opened programmatically !</p>
        <p>Count: {{ count }}</p>
        <UButton @click="onSuccess">
          Click to emit a success event
        </UButton>
      </div>
    </UCard>
  </UModal>
</template>
