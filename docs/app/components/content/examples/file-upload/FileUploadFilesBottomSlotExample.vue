<script setup lang="ts">
const value = ref<File[]>([])
</script>

<template>
  <UFileUpload
    v-model="value"
    icon="i-lucide-image"
    label="Drop your images here"
    description="SVG, PNG, JPG or GIF (max. 2MB)"
    layout="list"
    multiple
    :interactive="false"
    class="w-96 min-h-48"
  >
    <template #actions="{ open }">
      <UButton
        label="Select images"
        icon="i-lucide-upload"
        color="neutral"
        variant="outline"
        @click="open()"
      />
    </template>

    <template #files-bottom="{ removeFile, files }">
      <UButton
        v-if="files?.length"
        label="Remove all files"
        color="neutral"
        @click="removeFile()"
      />
    </template>
  </UFileUpload>
</template>
