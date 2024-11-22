<script setup lang="ts">
const { framework } = useSharedData()
</script>

<template>
  <MDCSlot :name="framework" />
</template>
