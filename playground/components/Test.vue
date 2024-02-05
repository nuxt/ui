<template>
  <UModal v-model="model">
    <div class="p-4">
      <p>This modal was dynamically opened from the script :) </p>
    </div>
  </UModal>
</template>

<script lang="ts" setup>
const model = defineModel<boolean>()
</script>