<script lang="ts" setup>
import type { FileUploadItem } from '@nuxt/ui'

type UploadWithStatus = FileUploadItem<{ status: 'pending' | 'uploading' | 'done', progress?: number }>

const value = ref<UploadWithStatus[]>([{
  file: new File([''], 'test.txt'),
  status: 'pending'
}])
</script>

<template>
  <UFileUpload v-model="value" />
</template>
