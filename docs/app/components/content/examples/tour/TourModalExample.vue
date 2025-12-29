<script setup lang="ts">
const open = ref(false)
const step = ref(0)
const modal = ref(true)

const steps = [
  {
    target: '#tour-target-modal-1',
    title: 'Modal Tour',
    description: 'When modal is enabled, interaction with outside elements is disabled',
    body: 'Try clicking on the buttons below - they will be disabled while the tour is open.'
  },
  {
    target: '#tour-target-modal-2',
    title: 'Second Step',
    description: 'Only the tour content is visible to screen readers',
    body: 'This helps ensure accessibility and focus management.'
  }
]
</script>

<template>
  <div class="space-y-4">
    <div id="tour-target-modal-1" class="p-4 border border-default rounded-lg bg-default">
      <p class="font-semibold">
        Target Element 1
      </p>
      <p class="text-sm text-muted">
        This element will be highlighted in the first step
      </p>
    </div>
    <div id="tour-target-modal-2" class="p-4 border border-default rounded-lg bg-default">
      <p class="font-semibold">
        Target Element 2
      </p>
      <p class="text-sm text-muted">
        This element will be highlighted in the second step
      </p>
    </div>
    <div class="flex items-center gap-4">
      <UButton @click="open = true">
        Start Tour
      </UButton>
      <div class="flex items-center gap-2">
        <span class="text-sm text-muted">Modal</span>
        <USwitch v-model="modal" size="sm" />
      </div>
      <UButton color="neutral" variant="outline" :disabled="open">
        Disabled Button
      </UButton>
      <UButton color="primary" variant="soft" :disabled="open">
        Another Button
      </UButton>
    </div>
  </div>

  <UTour v-model:open="open" v-model:step="step" :steps="steps" :modal="modal" />
</template>
