<script setup lang="ts">
const { metaSymbol } = useShortcuts()
</script>

<template>
  <div class="flex items-center gap-0.5">
    <UKbd>{{ metaSymbol }}</UKbd>
    <UKbd>K</UKbd>
  </div>
</template>
