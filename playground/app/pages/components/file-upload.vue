<script lang="ts" setup>
import type { FileAcceptDetails } from '#ui/types/file-upload'

const model = ref<FileAcceptDetails>([])
</script>

<template>
  <UFileUpload v-model="model" :accept="['image/*']" />
</template>
