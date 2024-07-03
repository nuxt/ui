<script setup lang="ts">
import type { PropertyMeta } from 'vue-component-meta'

const props = defineProps<{
  prop: PropertyMeta
}>()

function getSchemaProps(schema: PropertyMeta['schema']) {
  if (!schema || typeof schema === 'string' || !schema.schema) {
    return []
  }

  if (schema.kind === 'object') {
    return Object.values(schema.schema)
  }

  return (Array.isArray(schema.schema) ? schema.schema : Object.values(schema.schema)).flatMap(getSchemaProps)
}

const schemaProps = computed(() => getSchemaProps(props.prop.schema))
</script>

<template>
  <Collapsible v-if="schemaProps?.length" class="mt-1" :ui="{ trigger: 'ml-1.5' }">
    <ProseUl>
      <ProseLi v-for="schemaProp in schemaProps" :key="schemaProp.name">
        <HighlightInlineType :type="`${schemaProp.name}: ${schemaProp.type}`" />
      </ProseLi>
    </ProseUl>
  </Collapsible>
</template>
