<script lang="ts">
import { z } from 'zod'

export const stringInputSchema = z.literal('string').or(z.string().transform(t => t.split('|').find(s => s.trim() === 'string')).pipe(z.string()))

export type StringInputSchema = z.infer<typeof stringInputSchema>
</script>

<script setup lang="ts">
defineProps<{ schema: StringInputSchema }>()
</script>

<template>
  <UInput />
</template>
