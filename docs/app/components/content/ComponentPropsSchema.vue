<script setup lang="ts">
import type { PropertyMeta } from 'vue-component-meta'

const props = defineProps<{
  prop: PropertyMeta
  ignore?: string[]
}>()

function getSchemaProps(schema: PropertyMeta['schema']) {
  if (!schema || typeof schema === 'string' || !schema.schema) {
    return []
  }

  if (schema.kind === 'object') {
    return Object.values(schema.schema).filter(prop => !props.ignore?.includes(prop.name))
  }

  return (Array.isArray(schema.schema) ? schema.schema : Object.values(schema.schema)).flatMap(getSchemaProps)
}

const schemaProps = computed(() => getSchemaProps(props.prop.schema))
</script>

<template>
  <Collapsible v-if="schemaProps?.length" class="mt-1">
    <ProseUl>
      <ProseLi v-for="schemaProp in schemaProps" :key="schemaProp.name">
        <HighlightInlineType :type="`${schemaProp.name}${schemaProp.required === false ? '?' : ''}: ${schemaProp.type}`" />

        <MDC v-if="schemaProp.description" :value="schemaProp.description" class="text-gray-500 dark:text-gray-400 my-1" />
      </ProseLi>
    </ProseUl>
  </Collapsible>
</template>
