<script lang="ts" setup>
import type { FileUploadItem } from '@nuxt/ui'

const value = ref<FileUploadItem[]>([])
const requirements = [
  {
    test: (file: File) => /^image\//.test(file.type),
    text: 'File must be an image.'
  },
  {
    test: (file: File) => file.name.length <= 10,
    text: 'File name must be less than 10 characters.'
  },
  {
    test: (file: File) => !/\s/.test(file.name),
    text: 'File name must not contain spaces.'
  },
  {
    test: (file: File) => /\.(?:jpg|jpeg|png)$/i.test(file.name),
    text: 'File name must end with .jpg, .jpeg, or .png.'
  },
  {
    test: (file: File) => file.size < 1024 * 1024,
    text: 'File size must be less than 1MB.'
  }
]

const file = computed(() => value.value[0]?.file)
const checks = computed(() => file.value ? requirements.map(req => ({ met: req.test(file.value as File), text: req.text })) : requirements.map(req => ({ met: false, text: req.text })))
const score = computed(() => checks.value.filter(r => r.met).length)
const color = computed(() => {
  if (!file.value) return 'neutral'
  if (score.value === 0) return 'neutral'
  if (score.value <= 2) return 'error'
  if (score.value === 3 || score.value === 4) return 'warning'
  return 'success'
})
const text = computed(() => {
  if (!file.value) return 'Select a file'
  if (score.value <= 2) return 'File does not meet requirements'
  if (score.value === 3 || score.value === 4) return 'Almost valid file'
  return 'File is valid!'
})
</script>

<template>
  <div class="space-y-2">
    <UFormField label="Upload your profile picture" required>
      <UFileUpload
        v-model="value"
        accept="image/*"
        upload-icon="i-lucide-upload"
        file-icon="i-lucide-file"
        required
      />
    </UFormField>

    <UProgress
      :color="color"
      :indicator="text"
      :model-value="score"
      :max="requirements.length"
      size="sm"
    />

    <p class="text-sm font-medium">
      {{ text }}. Must satisfy:
    </p>
    <ul class="space-y-1" aria-label="File requirements">
      <li
        v-for="(req, index) in checks"
        :key="index"
        class="flex items-center gap-0.5"
        :class="req.met ? 'text-success' : 'text-muted'"
      >
        <UIcon :name="req.met ? 'i-lucide-circle-check' : 'i-lucide-circle-x'" class="size-4 shrink-0" />
        <span class="text-xs font-light">
          {{ req.text }}
          <span class="sr-only">
            {{ req.met ? ' - Requirement met' : ' - Requirement not met' }}
          </span>
        </span>
      </li>
    </ul>
  </div>
</template>
