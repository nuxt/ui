<script lang="ts" setup>
const files = ref()
</script>

<template>
  <div class="w-full max-w-96">
    <UFileUpload v-model="files" />
  </div>
</template>
