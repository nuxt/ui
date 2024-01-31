<script setup lang="ts">
const toast = useToast()
</script>

<template>
  <UButton label="Show toast" @click="toast.add({ title: 'This is an <u>underlined</u> and <b>bold</b> notification.' })" />
</template>
