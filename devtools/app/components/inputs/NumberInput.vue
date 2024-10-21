<script lang="ts">
import { z } from 'zod'

export const numberInputSchema = z.literal('number')
export type NumberInputSchema = z.infer<typeof numberInputSchema>
</script>

<script setup lang="ts">
defineProps<{ schema: NumberInputSchema }>()
const modelValue = defineModel<number>()
</script>

<template>
  <UInput v-model.number="modelValue" type="number" />
</template>
