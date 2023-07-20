<script setup>
const toast = useToast()
</script>

<template>
  <UButton label="Show toast" @click="toast.add({ title: 'Notification <i>italic</i>', description: 'This is an <u>underlined</u> and <b>bold</b> notification.' })" />
</template>
