<script setup lang="ts">
import { ref } from 'vue'

const items = [
  {
    slot: 'address',
    title: 'Address',
    description: 'Add your address here',
    icon: 'i-lucide-house'
  }, {
    slot: 'shipping',
    title: 'Shipping',
    description: 'Set your preferred shipping method',
    icon: 'i-lucide-truck'
  }, {
    slot: 'checkout',
    title: 'Checkout',
    description: 'Confirm your order'
  }
]

const stepper = ref()
</script>

<template>
  <UStepper
    ref="stepper"
    :items="items"
  >
    <template #content="{ item }">
      <Placeholder class="size-full min-h-60 min-w-60">
        {{ item.title }}
      </Placeholder>
      <div class="flex gap-2 justify-between mt-2">
        <UButton variant="outline" :disabled="!stepper?.hasPrevious" leading-icon="i-lucide-arrow-left" @click="stepper.previous()">
          Back
        </UButton>
        <UButton :disabled="!stepper?.hasNext" trailing-icon="i-lucide-arrow-right" @click="stepper.next()">
          Next
        </UButton>
      </div>
    </template>
  </UStepper>
</template>
