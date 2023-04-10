<template>
  <pre><code>{{ preset }}</code></pre>
</template>

<script setup lang="ts">
import $ui from '#build/ui'

const props = defineProps({
  slug: {
    type: String,
    default: null
  }
})

const route = useRoute()
const slug = props.slug || route.params.slug[1]
const camelName = useCamelCase(slug)

const preset = $ui[camelName]
</script>
