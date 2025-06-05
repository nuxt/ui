<script lang="ts" setup>
import { UButton } from '#components'
import type { FileUploadItem } from '@nuxt/ui'

type UploadWithStatus = FileUploadItem<{ status: 'pending' | 'uploading' | 'done', progress?: number }>

const files = ref<UploadWithStatus[]>()
const testFile = ref<UploadWithStatus[]>([{
  file: new File([''], 'test.txt'),
  status: 'pending'
}])
</script>

<template>
  <div class="grid grid-cols-12 *:px-1 *:py-8 *:not-first:-ms-px *:not-first:-mt-px sm:*:px-8 xl:*:px-12">
    <UFileUpload v-model="files" size="xs" upload-icon="i-lucide-image" class="col-span-12 sm:col-span-6 lg:col-span-6">
      <UButton variant="outline" color="neutral" icon="i-lucide-upload" size="xs" label="Select image" />
    </UFileUpload>
    <UFileUpload v-model="testFile" size="sm" layout="grid" class="col-span-12 sm:col-span-6 lg:col-span-6" />
    <UFileUpload size="md" preview-placement="outside" class="col-span-12 sm:col-span-6 lg:col-span-6" />
    <UFileUpload size="lg" disabled class="col-span-12 sm:col-span-6 lg:col-span-6" />
    <UFileUpload size="xl" :multiple="true" layout="grid" preview-placement="outside" class="col-span-12 sm:col-span-6 lg:col-span-6" />
  </div>
</template>
