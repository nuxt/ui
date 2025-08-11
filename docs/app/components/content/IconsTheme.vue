<script setup lang="ts">
import json5 from 'json5'
import icons from '../../../../src/theme/icons'

const { framework } = useSharedData()

const { data: ast } = await useAsyncData(`icons-theme`, async () => {
  const md = `
::code-collapse{class="nuxt-only"}

\`\`\`ts [app.config.ts]
export default defineAppConfig(${json5.stringify({
  ui: {
    icons
  }
}, null, 2).replace(/,([ |\t\n]+[}|\])])/g, '$1')})
\`\`\`\

::

::code-collapse{class="vue-only"}

\`\`\`ts [vite.config.ts]
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import ui from '@nuxt/ui/vite'

export default defineConfig({
  plugins: [
    vue(),
    ui(${json5.stringify({
      ui: {
        icons
      }
    }, null, 2).replace(/,([ |\t\n]+[}|\])])/g, '$1')
      .split('\n')
      .map((line, i) => i === 0 ? line : `    ${line}`)
      .join('\n')})
  ]
})
\`\`\`

::
`

  return parseMarkdown(md)
}, { watch: [framework] })
</script>

<template>
  <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" />
</template>
