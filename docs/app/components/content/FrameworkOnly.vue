<script setup lang="ts">
const { framework } = useSharedData()
</script>

<template>
  <slot :name="framework" />
</template>
