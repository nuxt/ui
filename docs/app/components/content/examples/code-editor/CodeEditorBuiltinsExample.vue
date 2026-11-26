<script setup lang="ts">
import type { Extension } from '@codemirror/state'
import { highlightActiveLine, highlightWhitespace } from '@codemirror/view'

const value = ref('{\n  "name": "nuxt-ui",\n  "private": true\n}\n')

// Every built-in extension except the active line highlight, then the whitespace markers.
function extensions(builtins: Extension[]) {
  return [...builtins.filter(extension => extension !== highlightActiveLine()), highlightWhitespace()]
}
</script>

<template>
  <UCodeEditor v-model="value" lang="json" :extensions="extensions" class="w-full max-w-md" />
</template>
