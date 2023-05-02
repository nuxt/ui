<script setup>
const toast = useToast()

function onClick () {
  alert('Clicked!')
}
</script>

<template>
  <UButton label="Show toast" @click="toast.add({ title: 'Click me', click: onClick })" />
</template>
