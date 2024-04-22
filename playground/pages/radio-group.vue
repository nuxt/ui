<script setup lang="ts">
import theme from '#build/ui/radio-group'

const sizes = Object.keys(theme.variants.size)

const literalOptions = [
  'Option 1',
  'Option 2',
  'Option 3'
]
const options = [
  { value: '1', label: 'Option 1' },
  { value: '2', label: 'Option 2' },
  { value: '3', label: 'Option 3' }
]

const optionsWithDescription = [
  { value: '1', label: 'Option 1', description: 'Description 1' },
  { value: '2', label: 'Option 2', description: 'Description 2' },
  { value: '3', label: 'Option 3', description: 'Description 3' }
]
</script>

<template>
  <div class="flex flex-col items-center gap-4">
    <div class="flex flex-col gap-4">
      <URadioGroup :options="options" default-value="1" />
      <URadioGroup :options="literalOptions" />
      <URadioGroup :options="options" label="Disabled" disabled />
      <URadioGroup :options="options" color="red" default-value="1" />
      <URadioGroup :options="options" orientation="horizontal" />
    </div>

    <div class="flex items-center gap-4 ml-[34px]">
      <URadioGroup v-for="size in sizes" :key="size" :size="(size as any)" :options="options" />
    </div>

    <div class="flex items-center gap-4 ml-[74px]">
      <URadioGroup v-for="size in sizes" :key="size" :size="(size as any)" :options="optionsWithDescription" />
    </div>

    <div class="flex gap-4">
      <URadioGroup :options="options" legend="Legend" />
      <URadioGroup :options="options" legend="Legend" required />
      <URadioGroup :options="options">
        <template #legend>
          <span class="italic font-bold">
            With slots
          </span>
        </template>
        <template #label="{ option }">
          <span class="italic">
            {{ option.label }}
          </span>
        </template>
      </URadioGroup>
    </div>
    <URadioGroup :options="options" legend="Legend" orientation="horizontal" required />
  </div>
</template>
