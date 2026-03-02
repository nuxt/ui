<script setup lang="ts">
const toast = useToast()

function showToast() {
  const t = toast.add({
    'title': 'Uploading file...',
    'description': 'Your file is being uploaded.',
    'icon': 'i-lucide-cloud-upload',
    'duration': 3000,
    'onUpdate:open': (open: boolean) => {
      if (open) {
        return
      }

      toast.update(t.id, {
        'title': 'File uploaded!',
        'description': 'Your file has been successfully uploaded.',
        'icon': 'i-lucide-check',
        'color': 'success',
        'onUpdate:open': undefined
      })
    }
  })
}
</script>

<template>
  <UButton label="Show toast" color="neutral" variant="outline" @click="showToast" />
</template>
