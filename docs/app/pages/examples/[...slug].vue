<script setup lang="ts">
const route = useRoute()

const name = route.params.slug?.[0]
</script>

<template>
  <div class="p-4 flex flex-col justify-center h-screen overflow-auto">
    <component :is="name" />
  </div>
</template>
