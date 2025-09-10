<script setup>
const now = Date.now()

const refresh = ref(false)
</script>

<template>
  <UDateTime :datetime="now" ago :refresh="refresh" />
</template>
