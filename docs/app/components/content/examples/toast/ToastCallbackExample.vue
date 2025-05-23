<script setup lang="ts">
const toast = useToast()

function toastCallback() {
  alert('Toast expired!')
}

function showToast() {
  toast.add({
    title: 'Callback Example',
    description: 'This toast will call a function once the timer expires or you click the close button.',
    callback: toastCallback
  })
}
</script>

<template>
  <UButton label="Show toast" color="neutral" variant="outline" @click="showToast" />
</template>
