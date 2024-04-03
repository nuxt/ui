<script setup lang="ts">
const task = ref(1)

const steps = [
  'Cloning...',
  'Migrating...',
  'Deploying...'
]
</script>

<template>
  <UProgress :value="task" :max="steps" indicator>
    <template #step-0="{ step }">
      <span class="text-lime-500">
        <UIcon name="i-heroicons-arrow-down-circle" /> {{ step }}
      </span>
    </template>

    <template #step-1="{ step }">
      <span class="text-amber-500">
        <UIcon name="i-heroicons-circle-stack" /> {{ step }}
      </span>
    </template>

    <template #step-2="{ step }">
      <span class="text-blue-500">
        <UIcon name="i-heroicons-hand-thumb-up" /> {{ step }}
      </span>
    </template>
  </UProgress>
</template>
