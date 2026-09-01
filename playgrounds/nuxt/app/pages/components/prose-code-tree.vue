<script setup lang="ts">
import { Markdown } from '@comark/vue'

const markdown = ref(`
## Not expanded

::code-tree{default-value="app/app.vue"}

\`\`\`ts [app/app.vue]
console.log('hello')
\`\`\`

\`\`\`ts [app/pages/index.vue]
console.log('index')
\`\`\`
::

## Expanded all

::code-tree{default-value="app/app.vue" expand-all}

\`\`\`ts [app/app.vue]
console.log('hello, expanded')
\`\`\`

\`\`\`ts [app/pages/index.vue]
console.log('index, expanded')
\`\`\`
::
`)
</script>

<template>
  <div class="p-8 max-w-lg mx-auto space-y-4">
    <Markdown :value="markdown" />
  </div>
</template>
