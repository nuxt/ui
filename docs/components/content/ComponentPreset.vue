<template>
  <pre><code>{{ preset }}</code></pre>
</template>

<script setup lang="ts">
import $ui from '#build/ui'

const route = useRoute()
const name = useCamelCase(route.params.slug[1])

const preset = $ui[name]
</script>
