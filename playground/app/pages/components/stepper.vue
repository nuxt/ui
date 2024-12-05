<script setup lang="ts">
import theme from '#build/ui/stepper'

const sizes = Object.keys(theme.variants.size)
const colors = Object.keys(theme.variants.color)
const orientations = Object.keys(theme.variants.orientation)

const orientation = ref('horizontal' as const)
const color = ref('primary' as const)
const size = ref('md' as const)

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
    slot: 'payment',
    title: 'Payment',
    description: 'Select your payment method',
    icon: 'i-lucide-credit-card'
  }, {
    slot: 'checkout',
    title: 'Checkout',
    description: 'Confirm your order'
  }
]

const stepper = useTemplateRef('stepper')
</script>

<template>
  <div class="flex flex-col gap-10">
    <div class="flex items-center justify-center gap-2 ">
      <USelect v-model="color" :items="colors" placeholder="Color" />
      <USelect v-model="orientation" :items="orientations" placeholder="Orientation" />
      <USelect v-model="size" :items="sizes" placeholder="Size" />
    </div>

    <UStepper
      ref="stepper"
      :items="items"
      :color="color"
      :orientation="orientation"
      :size="size"
    >
      <template #address>
        <Placeholder class="size-full min-h-60 min-w-60">
          Address
        </Placeholder>
      </template>

      <template #shipping>
        <Placeholder class="size-full min-h-60 min-w-60">
          Shipping
        </Placeholder>
      </template>

      <template #payment>
        <Placeholder class="size-full min-h-60 min-w-60">
          Payment
        </Placeholder>
      </template>

      <template #checkout>
        <Placeholder class="size-full min-h-60 min-w-60">
          Checkout
        </Placeholder>
      </template>
    </UStepper>

    <div class="flex gap-2 justify-between">
      <UButton
        leading-icon="i-lucide-arrow-left"
        :disabled="!stepper?.hasPrev"
        @click="stepper?.prev()"
      >
        Prev
      </UButton>

      <UButton
        trailing-icon="i-lucide-arrow-right"
        :disabled="!stepper?.hasNext"
        @click="stepper?.next()"
      >
        Next
      </UButton>
    </div>
  </div>
</template>
