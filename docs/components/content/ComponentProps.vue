<template>
  <div>
    <FieldGroup>
      <ComponentPropsField v-for="prop in meta?.meta?.props" :key="prop.name" :prop="prop" />
    </FieldGroup>
  </div>
</template>

<script setup lang="ts">
import { upperFirst, camelCase } from 'scule'

const props = defineProps({
  slug: {
    type: String,
    default: null
  }
})

const route = useRoute()

const name = props.slug || `U${upperFirst(camelCase(route.params.slug[route.params.slug.length - 1]))}`

const meta = await fetchComponentMeta(name)
</script>
