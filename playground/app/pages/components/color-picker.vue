<script setup lang="ts">
const colorHex = ref('3b82f6')
</script>

<template>
  <div class="flex flex-col items-center gap-56">
    <UColorPicker v-model="colorHex" />
    <UColorPicker v-model="colorHex" inline />
  </div>
</template>
