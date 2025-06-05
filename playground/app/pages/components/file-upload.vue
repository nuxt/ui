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
    <UFileUpload v-model="testFile" size="sm" layout="grid" />
    <UFileUpload size="md" preview-placement="outside" />
    <UFileUpload size="lg" disabled />
    <UFileUpload size="xl" :multiple="true" layout="grid" preview-placement="outside" />
  </div>
</template>
