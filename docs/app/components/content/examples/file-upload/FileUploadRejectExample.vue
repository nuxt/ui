<script setup lang="ts">
const value = ref<File[]>([])

const toast = useToast()

function onReject(files: File[]) {
  toast.add({
    title: 'Only images are allowed',
    description: files.map(file => file.name).join(', '),
    color: 'error'
  })
}
</script>

<template>
  <UFileUpload
    v-model="value"
    accept="image/*"
    icon="i-lucide-image"
    label="Drop your images here"
    description="SVG, PNG, JPG or GIF (max. 2MB)"
    multiple
    class="w-96 min-h-48"
    @reject="onReject"
  />
</template>
