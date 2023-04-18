<template>
  <pre><code>{{ preset }}</code></pre>
</template>

<script setup lang="ts">
const props = defineProps({
  slug: {
    type: String,
    default: null
  }
})

const appConfig = useAppConfig()
const route = useRoute()
const slug = props.slug || route.params.slug[1]
const camelName = useCamelCase(slug)

const preset = appConfig.ui[camelName]
</script>
