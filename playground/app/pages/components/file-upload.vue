<script lang="ts" setup>
const files = ref<File[]>([])
</script>

<template>
  <div class="flex flex-col gap-4 items-center">
    <UFileUpload v-model="files" size="xs" />
    <UFileUpload v-model="files" size="sm" />
    <UFileUpload v-model="files" size="md" />
    <UFileUpload v-model="files" size="lg" />
    <UFileUpload v-model="files" size="xl" :multiple="true" />
  </div>
</template>
