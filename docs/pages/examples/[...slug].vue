<template>
  <component :is="name" />
</template>

<script setup lang="ts">
const route = useRoute()

const name = route.params.slug[0]
</script>
