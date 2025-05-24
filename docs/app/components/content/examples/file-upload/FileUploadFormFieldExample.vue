<script lang="ts" setup>
const value = ref([])
</script>

<template>
  <UFormField
    label="Upload your profile picture"
    help="We won't share your profile picture."
    required
  >
    <UFileUpload
      v-model="value"
      accept="image/png"
      upload-icon="i-lucide-upload"
      file-icon="i-lucide-file"
      required
    />
  </UFormField>
</template>
