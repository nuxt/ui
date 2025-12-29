<script setup lang="ts">
const open = ref(false)
const step = ref(0)

const steps = [
  {
    target: '#tour-target-4',
    title: 'First Step',
    description: 'Custom button labels',
    nextLabel: 'Continue'
  },
  {
    target: '#tour-target-5',
    title: 'Middle Step',
    description: 'Custom previous label',
    prevLabel: 'Go Back',
    nextLabel: 'Next Step'
  },
  {
    target: '#tour-target-6',
    title: 'Last Step',
    description: 'Custom finish label',
    prevLabel: 'Previous',
    finishLabel: 'Complete Tour'
  }
]
</script>

<template>
  <div class="space-y-4">
    <div id="tour-target-4" class="p-4 border border-default rounded-lg bg-default">
      <p class="font-semibold">
        Step 1
      </p>
      <p class="text-sm text-muted">
        Has custom "Continue" button
      </p>
    </div>
    <div id="tour-target-5" class="p-4 border border-default rounded-lg bg-default">
      <p class="font-semibold">
        Step 2
      </p>
      <p class="text-sm text-muted">
        Has custom "Go Back" and "Next Step" buttons
      </p>
    </div>
    <div id="tour-target-6" class="p-4 border border-default rounded-lg bg-default">
      <p class="font-semibold">
        Step 3
      </p>
      <p class="text-sm text-muted">
        Has custom "Complete Tour" finish button
      </p>
    </div>
    <UButton @click="open = true">
      Start Tour
    </UButton>
  </div>

  <UTour v-model:open="open" v-model:step="step" :steps="steps" />
</template>
