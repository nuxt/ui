<script setup lang="ts">
const open = ref(false)
const step = ref(0)
const loop = ref(true)

const steps = [
  {
    target: '#tour-target-7',
    title: 'Step 1',
    description: 'First step of the tour'
  },
  {
    target: '#tour-target-8',
    title: 'Step 2',
    description: 'Second step of the tour'
  },
  {
    target: '#tour-target-9',
    title: 'Step 3',
    description: 'Third step of the tour'
  }
]
</script>

<template>
  <div class="space-y-4">
    <div id="tour-target-7" class="p-4 border border-default rounded-lg bg-default">
      <p class="font-semibold">
        Target 1
      </p>
    </div>
    <div id="tour-target-8" class="p-4 border border-default rounded-lg bg-default">
      <p class="font-semibold">
        Target 2
      </p>
    </div>
    <div id="tour-target-9" class="p-4 border border-default rounded-lg bg-default">
      <p class="font-semibold">
        Target 3
      </p>
    </div>
    <div class="flex items-center gap-4">
      <UButton @click="open = true">
        Start Tour
      </UButton>
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted">Loop</span>
        <USwitch v-model="loop" size="sm" />
      </div>
    </div>
  </div>

  <UTour v-model:open="open" v-model:step="step" :steps="steps" :loop="loop" />
</template>
