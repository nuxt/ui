<script setup lang="ts">
const route = useRoute()

const name = route.params.slug?.[0]
</script>

<template>
  <div class="example flex flex-col justify-center items-center h-screen">
    <component :is="name" v-bind="route.query" />
  </div>
</template>

<style scoped>
.example {
  --ui-container: 54rem;
}
</style>
