<template>
  <div :class="name" />
</template>

<script setup>
defineProps({
  name: {
    type: [String, Object],
    required: true
  }
})
</script>
