<script setup lang="ts">
const people = []

const selected = ref()
</script>

<template>
  <USelectMenu v-model="selected" :options="people">
    <template #empty>
      No people
    </template>
  </USelectMenu>
</template>
