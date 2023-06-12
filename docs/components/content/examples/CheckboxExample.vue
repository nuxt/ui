<script setup>
const selected = ref(false)
</script>

<template>
  <UCheckbox v-model="selected" name="notifications" label="Notifications" />
</template>
