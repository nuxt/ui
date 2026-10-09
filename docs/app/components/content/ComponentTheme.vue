<script setup lang="ts">
import json5 from 'json5'
import { camelCase } from 'scule'
import * as theme from '#build/ui'

const props = defineProps<{
  prose?: boolean
  slug?: string
  extra?: string[]
}>()

const route = useRoute()

const name = props.slug ?? route.path.split('/').pop() ?? ''
const camelName = camelCase(name)

const computedTheme = computed(() => props.prose ? theme.prose : theme)

const component = computed(() => {
  const content = props.prose
    ? { prose: { [camelName]: (computedTheme.value as any)[camelName] } }
    : { [camelName]: (computedTheme.value as any)[camelName] }

  if (props.extra?.length) {
    props.extra.forEach((extra) => {
      const target = props.prose ? content.prose! : content
      target[extra as keyof typeof target] = computedTheme.value[extra as keyof typeof computedTheme.value]
    })
  }

  return {
    ui: content
  }
})

const markdown = computed(() => `
::code-collapse{class="nuxt-only"}

\`\`\`ts [app.config.ts]
export default defineAppConfig(${json5.stringify(component.value, null, 2).replace(/,([ |\t\n]+[}|\])])/g, '$1')})
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
    ui(${json5.stringify(component.value, null, 2).replace(/,([ |\t\n]+[}|\])])/g, '$1')
      .split('\n')
      .map((line, i) => i === 0 ? line : `    ${line}`)
      .join('\n')})
  ]
})
\`\`\`

::
`)
</script>

<template>
  <DocsMarkdown :value="markdown" />
</template>
