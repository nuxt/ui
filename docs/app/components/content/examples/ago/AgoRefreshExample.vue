<script setup>
const now = Date.now()

const refresh = ref(false)
</script>

<template>
  <UAgo :datetime="now" :refresh="refresh" />
</template>
