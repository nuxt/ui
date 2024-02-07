<template>
  <UModal>
    <div class="p-4">
      <p>This is the next modal</p>
      <button @click="$emit('update:modelValue', false)">
        Close
      </button>
    </div>
  </UModal>
</template>

<script lang="ts" setup>
defineEmits(['update:modelValue'])
</script>