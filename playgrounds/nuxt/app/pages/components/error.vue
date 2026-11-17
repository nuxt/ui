<script setup lang="ts">
const error = {
  status: 404,
  statusText: 'Page not found',
  message: 'The page you are looking for does not exist.'
}
</script>

<template>
  <Navbar />

  <UError :error="error" />
</template>
