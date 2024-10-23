<script lang="ts">
import { z } from 'zod'

export const objectInputSchema = z.object({
  kind: z.literal('object'),
  schema: z.record(z.string(), z.any())
})

export type ObjectInputSchema = z.infer<typeof objectInputSchema>
</script>

<script setup lang="ts">
const props = defineProps<{
  schema: ObjectInputSchema
}>()

const modelValue = defineModel<Record<string, any>>({})

const attributesSchemas = computed(() => {
  return Object.values(props.schema.schema)
})
</script>

<template>
  <CollapseContainer>
    <ComponentPropInput
      v-for="attributeSchema in attributesSchemas"
      :key="attributeSchema.name"
      class="border-b last:border-b-0 border-[var(--ui-border)] p-4"
      :model-value="modelValue?.[attributeSchema.name]"
      :meta="attributeSchema"
      @update:model-value="(value: any) => {
        if (!modelValue) modelValue ||= {}
        else modelValue[attributeSchema.name] = value
      }"
    />
  </CollapseContainer>
</template>
