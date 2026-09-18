<script setup lang="ts">
import { createHighlighter } from 'shiki'
import type { Highlighter } from 'shiki'

const value = ref('.button {\n  @apply rounded-md px-3 py-2;\n  color: var(--ui-primary);\n}\n')

// The Oniguruma engine loads a WebAssembly binary, so the highlighter is only created on the client.
const highlighter = shallowRef<Highlighter>()

onMounted(async () => {
  highlighter.value = await createHighlighter({
    langs: ['css'],
    themes: ['github-light', 'github-dark']
  })
})
</script>

<template>
  <UCodeEditor
    v-model="value"
    lang="css"
    :theme="{ light: 'github-light', dark: 'github-dark' }"
    :highlighter="highlighter"
    class="w-full max-w-md"
  />
</template>
