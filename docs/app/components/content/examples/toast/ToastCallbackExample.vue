<script setup lang="ts">
const toast = useToast()

function showToast() {
  toast.add({
    'title': 'Uploading file...',
    'description': 'Your file is being uploaded.',
    'icon': 'i-lucide-cloud-upload',
    'duration': 3000,
    'onUpdate:open': (open) => {
      if (!open) {
        toast.add({
          title: 'File uploaded!',
          description: 'Your file has been successfully uploaded.',
          icon: 'i-lucide-check',
          color: 'success'
        })
      }
    }
  })
}
</script>

<template>
  <UButton label="Show toast" color="neutral" variant="outline" @click="showToast" />
</template>
