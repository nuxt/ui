<script setup lang="ts">
import type { PropertyMeta } from 'vue-component-meta'

const props = defineProps<{ meta: Partial<PropertyMeta>, ignore?: boolean }>()
const modelValue = defineModel<any>()

const matchedInput = shallowRef()
const parsedSchema = shallowRef()

const { resolveInputSchema } = usePropSchema()

watchEffect(() => {
  if (!props.meta?.schema) return
  const result = resolveInputSchema(props.meta.schema)
  parsedSchema.value = result?.schema
  matchedInput.value = result?.input
})

const description = computed(() => {
  return props.meta.description?.replace(/`([^`]+)`/g, '<code class="font-medium bg-[var(--ui-bg-elevated)] px-1 py-0.5 rounded-[var(--ui-radius)]">$1</code>')
})
</script>

<template>
  <UFormField :name="meta?.name" class="" :ui="{ wrapper: 'mb-2' }" :class="{ 'opacity-70 cursor-not-allowed': !matchedInput || ignore }">
    <template #label>
      <p v-if="meta?.name" class="font-mono font-bold px-1.5 py-0.5 border border-[var(--ui-border-accented)] border-dashed rounded-[var(--ui-radius)] bg-[var(--ui-bg-elevated)]">
        {{ meta?.name }}
      </p>
    </template>

    <template #description>
      <!-- eslint-disable vue/no-v-html -->
      <p v-if="meta.description" class="text-neutral-600 dark:text-neutral-400 mt-1" v-html="description" />
    </template>

    <component :is="matchedInput.component" v-if="!ignore && matchedInput" v-model="modelValue" :schema="parsedSchema" />
  </UFormField>
</template>
