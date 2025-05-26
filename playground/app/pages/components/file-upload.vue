<script lang="ts" setup>
import type { FileUploadItem } from '@nuxt/ui'

type UploadWithStatus = FileUploadItem<{ status: 'pending' | 'uploading' | 'done', progress?: number }>

const files = ref<UploadWithStatus[]>()
const testFile = ref<UploadWithStatus[]>([{
  file: new File([''], 'test.txt'),
  status: 'pending'
}])
</script>

<template>
  <div class="flex flex-col gap-4 items-center">
    <UFileUpload v-model="files" size="xs" />
    <UFileUpload v-model="testFile" size="sm" />
    <UFileUpload size="md" />
    <UFileUpload size="lg" disabled />
    <UFileUpload size="xl" :multiple="true" />
  </div>
</template>
