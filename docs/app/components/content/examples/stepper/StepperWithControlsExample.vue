<script setup lang="ts">
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

const stepper = useTemplateRef('stepper')
</script>

<template>
  <div class="w-full">
    <UStepper
      ref="stepper"
      :items="items"
    >
      <template #content="{ item }">
        <Placeholder class="aspect-video">
          {{ item.title }}
        </Placeholder>
      </template>
    </UStepper>

    <div class="flex gap-2 justify-between mt-4">
      <UButton variant="outline" :disabled="!stepper?.hasPrevious" leading-icon="i-lucide-arrow-left" @click="stepper?.previous()">
        Back
      </UButton>
      <UButton :disabled="!stepper?.hasNext" trailing-icon="i-lucide-arrow-right" @click="stepper?.next()">
        Next
      </UButton>
    </div>
  </div>
</template>
