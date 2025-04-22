<script setup lang="ts">
import type { StepperItem } from '@nuxt/ui'

const items = [
  {
    slot: 'address' as const,
    title: 'Address',
    description: 'Add your address here',
    icon: 'i-lucide-house'
  }, {
    slot: 'shipping' as const,
    title: 'Shipping',
    description: 'Set your preferred shipping method',
    icon: 'i-lucide-truck'
  }, {
    slot: 'checkout' as const,
    title: 'Checkout',
    description: 'Confirm your order'
  }
] satisfies StepperItem[]
</script>

<template>
  <UStepper :items="items" class="w-full">
    <template #address>
      <Placeholder class="aspect-video">
        Address
      </Placeholder>
    </template>

    <template #shipping>
      <Placeholder class="aspect-video">
        Shipping
      </Placeholder>
    </template>

    <template #checkout>
      <Placeholder class="aspect-video">
        Checkout
      </Placeholder>
    </template>
  </UStepper>
</template>
