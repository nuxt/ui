<template>
  <div>
    <FieldGroup>
      <Field v-for="slot in meta?.meta.slots" :key="slot.name" v-bind="slot" />
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
