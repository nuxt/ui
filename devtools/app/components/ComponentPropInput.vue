<script setup lang="ts">
import type { PropertyMeta } from 'vue-component-meta'

defineProps<Partial<PropertyMeta>>()
const modelValue = defineModel<any>()

function parseEnumValues(propMeta: PropertyMeta['schema'] | PropertyMeta['schema'][]) {
  const meta = Array.isArray(propMeta) ? propMeta[0] : propMeta
  if (!meta) return
  return Object.values(propMeta).map((value: string) => typeof value === 'string' ? value.replaceAll('"', '') : value).filter(value => value !== 'undefined')
}
</script>

<template>
  <div v-if="schema">
    <UInput v-if="type?.includes('string')" v-model="modelValue" />
    <UInput v-else-if="type?.includes('number')" v-model="modelValue" type="number" />
    <UCheckbox v-else-if="type?.includes('boolean')" v-model="modelValue" />
    <span v-else-if="typeof schema === 'string' || !schema.schema " />
    <USelectMenu v-else-if="schema?.kind === 'enum'" v-model="modelValue" :items="parseEnumValues(schema.schema)" class="w-48" />
  </div>
</template>
