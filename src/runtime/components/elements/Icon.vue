<template>
  <span :class="name" />
</template>

<script setup lang="ts">
defineProps({
  name: {
    type: String,
    required: true
  }
})
</script>

<script lang="ts">
export default { name: 'UIcon' }
</script>
