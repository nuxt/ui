<script setup lang="ts">
const open = ref(false)
const step = ref(0)
const overlay = ref(true)

const steps = [
  {
    target: '#tour-target-overlay-1',
    title: 'Spotlight Effect',
    description: 'The overlay darkens the rest of the page',
    body: 'This creates a spotlight effect on the highlighted element.'
  },
  {
    target: '#tour-target-overlay-2',
    title: 'Focus Attention',
    description: 'Users can focus on the highlighted element',
    body: 'The overlay helps draw attention to the current step.'
  },
  {
    title: 'No Target',
    description: 'When there is no target, a fullscreen overlay is shown',
    body: 'This is useful for introductory or summary steps.',
    target: null
  }
]
</script>

<template>
  <div class="space-y-4">
    <div id="tour-target-overlay-1" class="p-4 border border-default rounded-lg bg-default">
      <p class="font-semibold">
        Target Element 1
      </p>
      <p class="text-sm text-muted">
        This element will be highlighted with a spotlight effect
      </p>
    </div>
    <div id="tour-target-overlay-2" class="p-4 border border-default rounded-lg bg-default">
      <p class="font-semibold">
        Target Element 2
      </p>
      <p class="text-sm text-muted">
        This element will also be highlighted with the overlay
      </p>
    </div>
    <div class="flex items-center gap-4">
      <UButton @click="open = true">
        Start Tour
      </UButton>
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted">Overlay</span>
        <USwitch v-model="overlay" size="sm" />
      </div>
    </div>
  </div>

  <UTour v-model:open="open" v-model:step="step" :steps="steps" :overlay="overlay" />
</template>
