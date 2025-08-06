<script setup lang="ts">
import theme from '#build/ui/radio-group'

const sizes = Object.keys(theme.variants.size) as Array<keyof typeof theme.variants.size>
const variants = Object.keys(theme.variants.variant)
const variant = ref('list' as const)

const literalOptions = [
  'Option 1',
  'Option 2',
  'Option 3'
]
const items = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' }
]

const itemsWithDescription = [
  { value: '1', label: 'Option 1', description: 'Description 1' },
  { value: '2', label: 'Option 2', description: 'Description 2' },
  { value: '3', label: 'Option 3', description: 'Description 3' }
]
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <USelect v-model="variant" :items="variants" />

    <div class="flex flex-wrap gap-4 ms-[100px]">
      <URadioGroup :variant="variant" :items="items" default-value="1" />
      <URadioGroup :variant="variant" :items="items" color="neutral" default-value="1" />
      <URadioGroup :variant="variant" :items="items" color="error" default-value="2" />
      <URadioGroup :variant="variant" :items="literalOptions" />
      <URadioGroup :variant="variant" :items="items" disabled />
    </div>

    <div class="flex flex-wrap gap-4 ms-[100px]">
      <URadioGroup :variant="variant" :items="items" default-value="3" indicator="start" />
      <URadioGroup :variant="variant" :items="items" default-value="3" indicator="end" />
      <URadioGroup :variant="variant" :items="items" default-value="3" indicator="hidden" />
    </div>

    <URadioGroup :variant="variant" :items="items" orientation="horizontal" class="ms-[95px]" />

    <div class="flex items-center gap-4 ms-[34px]">
      <URadioGroup v-for="size in sizes" :key="size" :size="size" :variant="variant" :items="items" />
    </div>

    <div class="flex items-center gap-4 ms-[74px]">
      <URadioGroup v-for="size in sizes" :key="size" :size="size" :variant="variant" :items="itemsWithDescription" />
    </div>

    <div class="flex gap-4">
      <URadioGroup :variant="variant" :items="items" legend="Legend" />
      <URadioGroup :variant="variant" :items="items" legend="Legend" required />
      <URadioGroup :variant="variant" :items="items">
        <template #legend>
          <span class="italic font-bold">
            With slots
          </span>
        </template>
        <template #label="{ item }">
          <span class="italic">
            {{ item.label }}
          </span>
        </template>
      </URadioGroup>
    </div>
    <URadioGroup :variant="variant" :items="items" legend="Legend" orientation="horizontal" required />
  </div>
</template>
