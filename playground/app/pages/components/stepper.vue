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
</script>

<template>
  <div>
    <UStepper :items="items" :default-value="2">
      <template #address>
        <Placeholder class="w-full aspect-video">
          Address
        </Placeholder>
      </template>

      <template #shipping>
        <Placeholder class="w-full aspect-video">
          Shipping
        </Placeholder>
      </template>

      <template #checkout>
        <Placeholder class="w-full aspect-video">
          Checkout
        </Placeholder>
      </template>
    </UStepper>
  </div>
</template>
