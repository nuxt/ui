<script setup lang="ts">
import type { PropertyMeta } from 'vue-component-meta'

const props = defineProps<{
  prop: PropertyMeta
  ignore?: string[]
}>()

function getSchemaProps(schema: PropertyMeta['schema']): any {
  if (!schema || typeof schema === 'string' || !schema.schema) {
    return []
  }

  if (schema.kind === 'object') {
    return Object.values(schema.schema).filter(prop => !props.ignore?.includes(prop.name))
  }

  return (Array.isArray(schema.schema) ? schema.schema : Object.values(schema.schema)).flatMap(getSchemaProps as any)
}

const schemaProps = computed(() => {
  return getSchemaProps(props.prop.schema).map((prop: any) => {
    const defaultValue = prop.default ?? prop.tags?.find((tag: any) => tag.name === 'defaultValue')?.text
    let description = prop.description
    if (defaultValue) {
      description = description ? `${description} Defaults to \`${defaultValue}\`{lang="ts-type"}.` : `Defaults to \`${defaultValue}\`{lang="ts-type"}.`
    }

    return {
      ...prop,
      description
    }
  })
})
</script>

<template>
  <ProseCollapsible v-if="schemaProps?.length" class="mt-1">
    <ProseUl>
      <ProseLi v-for="schemaProp in schemaProps" :key="schemaProp.name">
        <HighlightInlineType :type="`${schemaProp.name}${schemaProp.required === false ? '?' : ''}: ${schemaProp.type}`" />

        <MDC v-if="schemaProp.description" :value="schemaProp.description" class="text-[var(--ui-text-muted)] my-1" />
      </ProseLi>
    </ProseUl>
  </ProseCollapsible>
</template>
