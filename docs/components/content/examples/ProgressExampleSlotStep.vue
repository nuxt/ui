<script setup>
const task = ref(1)

const steps = [
  'Cloning...',
  'Migrating...',
  'Deploying...'
]
</script>

<template>
  <UProgress :value="task" :max="steps" indicator>
    <template #0-step="{ step }">
      <span class="text-lime-500">
        <UIcon name="i-heroicons-circle-arrow-down-on-square-stack" /> {{ step }}
      </span>
    </template>

    <template #1-step="{ step }">
      <span class="text-amber-500">
        <UIcon name="i-heroicons-circle-stack" /> {{ step }}
      </span>
    </template>

    <template #2-step="{ step }">
      <span class="text-blue-500">
        <UIcon name="i-heroicons-circle-hand-thumb-up" /> {{ step }}
      </span>
    </template>
  </UProgress>
</template>
