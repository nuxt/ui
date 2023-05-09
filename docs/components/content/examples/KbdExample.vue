<script setup>
const { metaSymbol } = useShortcuts()
</script>

<template>
  <div class="flex items-center gap-0.5">
    <UKbd>{{ metaSymbol }}</UKbd>
    <UKbd>U</UKbd>
  </div>
</template>
