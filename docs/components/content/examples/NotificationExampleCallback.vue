<script setup lang="ts">
const toast = useToast()

function onCallback() {
  alert('Notification expired!')
}
</script>

<template>
  <UButton label="Show toast" @click="toast.add({ title: 'Expires soon...', timeout: 1000, callback: onCallback })" />
</template>
