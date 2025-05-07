<script lang="ts" setup>
</script>

<template>
  <div class="flex flex-col gap-4 items-center">
    <UFileUpload size="xs" />
    <UFileUpload size="sm" />
    <UFileUpload size="md" />
    <UFileUpload size="lg" />
    <UFileUpload size="xl" :multiple="true" />
  </div>
</template>
