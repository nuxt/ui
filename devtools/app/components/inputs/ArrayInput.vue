<script lang="ts">
import { z } from 'zod'

export const arrayInputSchema = z.object({
  kind: z.literal('array'),
  schema: z.array(z.any({}))
    .or(z.record(z.number(), z.any({})).transform(t => Object.values(t)))
    .transform((t) => {
      return t.filter(s => s !== 'undefined')
    }).pipe(z.array(z.any()).max(1))
})

export type ArrayInputSchema = z.infer<typeof arrayInputSchema>
</script>

<script setup lang="ts">
const props = defineProps<{
  schema: ArrayInputSchema
}>()

const modelValue = defineModel<Array<any>>({})

const itemSchema = computed(() => {
  return props.schema?.schema[0]
})

function removeArrayItem(index: number) {
  if (!modelValue.value) return
  modelValue.value.splice(index, 1)
}

function addArrayItem() {
  if (!modelValue.value) {
    modelValue.value = [{}]
  } else {
    modelValue.value.push({})
  }
}
</script>

<template>
  <div>
    <div v-for="value, index in modelValue" :key="index" class="relative">
      <ComponentPropInput
        :model-value="value"
        :meta="{ schema: itemSchema }"
      />

      <UPopover>
        <UButton variant="ghost" color="neutral" icon="i-lucide-ellipsis-vertical" class="absolute top-4 right-1" />
        <template #content>
          <UButton
            variant="ghost"
            color="error"
            icon="i-lucide-trash"
            block
            @click="removeArrayItem(index)"
          >
            Remove
          </UButton>
        </template>
      </UPopover>
    </div>

    <UButton
      icon="i-lucide-plus"
      color="neutral"
      variant="ghost"
      block
      class="justify-center mt-4"
      @click="addArrayItem()"
    >
      Add value
    </UButton>
  </div>
</template>
