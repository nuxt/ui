<script setup lang="ts">
import { ref } from 'vue'
import FileUpload from '../../../src/runtime/components/FileUpload.vue'
import type { FileUploadItem } from '../../../src/runtime/components/FileUpload.vue'

interface CustomFileUploadItem extends FileUploadItem {
  id: string
}

const file = ref<File | null>()
const files = ref<File[] | null>()
const createObjectURL = URL.createObjectURL
const customFiles = ref<(File | CustomFileUploadItem)[]>([{ name: 'existing.png', id: 'file-1' }])

function onUpdateFile(value: File | null | undefined) {
  file.value = value
}

function onUpdateFiles(value: File[] | null | undefined) {
  files.value = value
}
</script>

<template>
  <FileUpload v-model="file" @update:model-value="onUpdateFile">
    <template #file="{ file: selectedFile }">
      <img :src="createObjectURL(selectedFile)" :alt="selectedFile.name">
    </template>
  </FileUpload>
  <FileUpload v-model="files" multiple @update:model-value="onUpdateFiles">
    <template #file="{ file: selectedFile }">
      <img :src="createObjectURL(selectedFile)" :alt="selectedFile.name">
    </template>
  </FileUpload>
  <FileUpload v-model="customFiles" multiple>
    <template #file="{ file: selectedFile }">
      <span v-if="'id' in selectedFile">{{ selectedFile.id.toUpperCase() }}</span>
      <img v-else :src="createObjectURL(selectedFile)" :alt="selectedFile.name">
    </template>
  </FileUpload>
</template>
