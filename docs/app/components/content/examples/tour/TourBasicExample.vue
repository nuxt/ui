<script setup lang="ts">
const open = ref(false)
const step = ref(0)

const steps = [
  {
    target: '#tour-target-1',
    title: 'Welcome',
    description: 'This is the first step of the tour',
    body: 'Click next to continue to the next step.'
  },
  {
    target: '#tour-target-2',
    title: 'Second Step',
    description: 'This is the second step',
    body: 'You can customize each step with title, description, and body.'
  },
  {
    target: '#tour-target-3',
    title: 'Final Step',
    description: 'This is the last step',
    body: 'Click finish to close the tour.'
  }
]
</script>

<template>
  <div class="space-y-4">
    <div id="tour-target-1" class="p-4 border border-default rounded-lg bg-default">
      <p class="font-semibold">
        Target Element 1
      </p>
      <p class="text-sm text-muted">
        This element will be highlighted in the first step
      </p>
    </div>
    <div id="tour-target-2" class="p-4 border border-default rounded-lg bg-default">
      <p class="font-semibold">
        Target Element 2
      </p>
      <p class="text-sm text-muted">
        This element will be highlighted in the second step
      </p>
    </div>
    <div id="tour-target-3" class="p-4 border border-default rounded-lg bg-default">
      <p class="font-semibold">
        Target Element 3
      </p>
      <p class="text-sm text-muted">
        This element will be highlighted in the final step
      </p>
    </div>
    <UButton @click="open = true">
      Start Tour
    </UButton>
  </div>

  <UTour v-model:open="open" v-model:step="step" :steps="steps" />
</template>
