<script setup lang="ts">
const toast = useToast()

function upload() {
  return new Promise<string>(resolve => setTimeout(() => resolve('report.pdf'), 2000))
}

function showToast() {
  toast.promise(upload(), {
    loading: { title: 'Uploading file...', description: 'Your file is being uploaded.' },
    success: name => ({
      title: 'File uploaded!',
      description: `${name} has been successfully uploaded.`,
      icon: 'i-lucide-check',
      color: 'success'
    }),
    error: {
      title: 'Upload failed',
      description: 'Something went wrong, please try again.',
      icon: 'i-lucide-circle-x',
      color: 'error'
    }
  })
}
</script>

<template>
  <UButton label="Show toast" color="neutral" variant="outline" @click="showToast" />
</template>
