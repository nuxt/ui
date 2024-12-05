<script setup lang="ts">
const { module, modules } = useSharedData()
</script>

<template>
  <UTabs
    v-model="module"
    :items="modules"
    :content="false"
    color="neutral"
    @update:model-value="console.log($event)"
  />
</template>
