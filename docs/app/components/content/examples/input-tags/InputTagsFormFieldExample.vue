<script setup lang="ts">
const tags = ref(['Apple'])
</script>

<template>
  <UFormField label="Tags" help="Tags of products" required>
    <UInputTags v-model="tags" placeholder="Enter tags" />
  </UFormField>
</template>
