<script setup lang="ts">
const tags = ref(['Vue'])
</script>

<template>
  <UFormField label="Tags" required>
    <UInputTags v-model="tags" placeholder="Enter tags..." />
  </UFormField>
</template>
