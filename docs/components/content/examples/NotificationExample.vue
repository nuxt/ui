<script setup>
const toast = useToast()

function showToast () {
  toast.add({ title: 'Hello world!' })
}
</script>

<template>
  <UButton label="Show toast" @click="showToast" />
</template>
