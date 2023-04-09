<template>
  <pre><code>{{ preset }}</code></pre>
</template>

<script setup lang="ts">
import $ui from '#build/ui'

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})

const preset = $ui[props.name]
</script>
