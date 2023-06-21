<script setup>
const selected = ref(true)
</script>

<template>
  <UCheckbox v-model="selected" name="notifications" label="Notifications" />
</template>
