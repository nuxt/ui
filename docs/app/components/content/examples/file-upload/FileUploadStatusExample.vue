<script setup lang="ts">
import type { FileUploadItem } from '@nuxt/ui'

interface UploadFileItem extends FileUploadItem {
  status: 'uploading' | 'complete'
  progress: number
}

const files = ref<UploadFileItem[]>([{
  name: 'nuxt.png',
  size: 1000,
  type: 'image/png',
  status: 'uploading',
  progress: 0,
  avatar: {
    icon: 'i-lucide-loader-circle',
    ui: {
      icon: 'animate-spin'
    }
  }
}])

let completedTicks = 0

useIntervalFn(() => {
  const file = files.value[0]

  if (!file || typeof file.progress !== 'number' || !file.status) {
    return
  }

  if (file.status === 'complete') {
    completedTicks += 1

    if (completedTicks < 20) {
      return
    }

    completedTicks = 0
    file.status = 'uploading'
    file.progress = 0
    file.avatar = {
      icon: 'i-lucide-loader-circle',
      ui: { icon: 'animate-spin' }
    }
    return
  }

  file.progress += 2

  if (file.progress >= 100) {
    file.status = 'complete'
    file.avatar = {
      src: 'https://github.com/nuxt.png',
      alt: 'Nuxt'
    }
  }
}, 100)
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
  >
    <template #file-trailing="{ file, index, removeFile }">
      <div class="ms-auto flex items-center gap-2">
        <UProgress
          v-if="file.status === 'uploading'"
          :model-value="file.progress"
          size="xs"
          class="w-20"
        />
        <UIcon
          v-else-if="file.status === 'complete'"
          name="i-lucide-circle-check"
          class="size-5 text-success"
        />
        <UButton
          color="neutral"
          variant="link"
          icon="i-lucide-x"
          :aria-label="`Remove ${file.name}`"
          @click.stop.prevent="removeFile(index)"
        />
      </div>
    </template>
  </UFileUpload>
</template>
