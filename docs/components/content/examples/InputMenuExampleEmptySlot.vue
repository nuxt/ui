<script setup lang="ts">
const people = []

const selected = ref()
</script>

<template>
  <UInputMenu v-model="selected" :options="people">
    <template #empty>
      No people
    </template>
  </UInputMenu>
</template>
