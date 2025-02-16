<script setup lang="ts">
const route = useRoute()

const name = route.params.slug?.[0]

const width = computed(() => route.query.width && Number.parseInt(route.query.width as string) > 0 ? `${Number.parseInt(route.query.width as string) - 2}px` : '864px')
</script>

<template>
  <div class="example flex flex-col items-center h-screen">
    <component :is="name" v-bind="route.query" />
  </div>
</template>

<style scoped>
@media (min-width: 1024px) {
  .example {
    --ui-container: v-bind(width);
  }
}
</style>
