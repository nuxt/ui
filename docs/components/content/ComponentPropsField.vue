<template>
  <Field v-bind="prop">
    <code v-if="prop.default">{{ prop.default }}</code>

    <Collapsible v-if="prop.schema?.kind === 'array' && prop.schema?.schema?.filter(schema => schema.kind === 'object').length">
      <FieldGroup v-for="schema in prop.schema.schema" :key="schema.name" class="!mt-0">
        <ComponentPropsField v-for="subProp in Object.values(schema.schema)" :key="(subProp as any).name" :prop="subProp" />
      </FieldGroup>
    </Collapsible>
    <Collapsible v-else-if="prop.schema?.kind === 'array' && prop.schema?.schema?.filter(schema => schema.kind === 'array').length">
      <FieldGroup v-for="schema in prop.schema.schema" :key="schema.name" class="!mt-0">
        <template v-for="subSchema in schema.schema" :key="subSchema.name">
          <ComponentPropsField v-for="subProp in Object.values(subSchema.schema)" :key="(subProp as any).name" :prop="subProp" />
        </template>
      </FieldGroup>
    </Collapsible>
    <Collapsible v-else-if="prop.schema?.kind === 'object' && prop.schema.type !== 'Function' && Object.values(prop.schema.schema)?.length">
      <FieldGroup class="!mt-0">
        <ComponentPropsField v-for="subProp in Object.values(prop.schema.schema)" :key="(subProp as any).name" :prop="subProp" />
      </FieldGroup>
    </Collapsible>
    <div v-else-if="prop.schema?.kind === 'enum' && prop.schema.type !== 'boolean' && startsWithCapital(prop.schema.type)" class="space-x-1 leading-7 -my-1">
      <code v-for="value in prop.schema.schema" :key="value">{{ value }}</code>
    </div>
  </Field>
</template>

<script setup lang="ts">
defineProps({
  prop: {
    type: Object as PropType<any>,
    default: () => ({})
  }
})

function startsWithCapital (word) {
  if (word.charAt(0).startsWith('"')) {
    return false
  }

  return word.charAt(0) === word.charAt(0).toUpperCase()
}
</script>
