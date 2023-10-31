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

let name = props.slug || `U${upperFirst(camelCase(route.params.slug[route.params.slug.length - 1]))}`

// TODO: Remove once merged on `main` branch
if (['AvatarGroup', 'ButtonGroup', 'MeterGroup'].includes(name)) {
  name = `U${name}`
}
if (['avatar-group', 'button-group', 'radio'].includes(name)) {
  name = `U${upperFirst(camelCase(name))}`
}

const meta = await fetchComponentMeta(name)
</script>
