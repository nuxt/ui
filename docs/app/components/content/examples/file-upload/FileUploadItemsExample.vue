<script setup lang="ts">
import type { FileUploadItem } from '@nuxt/ui'

const files = ref<FileUploadItem[]>([{
  name: 'nuxt.png',
  size: 1000,
  type: 'image/png',
  avatar: {
    src: 'https://github.com/nuxt.png',
    alt: 'Nuxt'
  }
}])
</script>

<template>
  <UFileUpload
    v-model="files"
    layout="list"
    label="Drop your images here"
    description="SVG, PNG, JPG or GIF"
    accept="image/*"
    multiple
    class="w-96 min-h-48"
  />
</template>
