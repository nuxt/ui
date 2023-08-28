<template>
  <div>
    <FieldGroup>
      <Field v-for="prop in metaProps" :key="prop.name" v-bind="prop">
        <code v-if="prop.default">{{ prop.default }}</code>

        <Collapsible v-if="prop.schema?.kind === 'array' && prop.schema?.schema?.filter(schema => schema.kind === 'object').length">
          <FieldGroup v-for="schema in prop.schema.schema" :key="schema.name" class="!mt-0">
            <Field v-for="subProp in Object.values(schema.schema)" :key="(subProp as any).name" v-bind="subProp" />
          </FieldGroup>
        </Collapsible>
        <Collapsible v-else-if="prop.schema?.kind === 'object' && Object.values(prop.schema.schema)?.length">
          <FieldGroup class="!mt-0">
            <Field v-for="subProp in Object.values(prop.schema.schema)" :key="(subProp as any).name" v-bind="subProp" />
          </FieldGroup>
        </Collapsible>
      </Field>
    </FieldGroup>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  slug: {
    type: String,
    default: null
  }
})

const route = useRoute()
// eslint-disable-next-line vue/no-dupe-keys
const slug = props.slug || route.params.slug[route.params.slug.length - 1]
const camelName = useCamelCase(slug)
const name = `U${useUpperFirst(camelName)}`

const meta = await fetchComponentMeta(name)

const metaProps = computed(() => useSortBy(meta?.meta?.props || [], [
  prop => ['string', 'number', 'boolean', 'any'].indexOf(prop.type)
]))
</script>
