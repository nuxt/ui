<script setup lang="ts">
import json5 from 'json5'

const appConfig = useAppConfig()
const { $prettier } = useNuxtApp()

const { data: ast } = await useAsyncData(`icons-theme`, async () => {
  const md = `
\`\`\`ts [app.config.ts]
export default defineAppConfig({
  ui: {
    icons: ${json5.stringify(appConfig.ui.icons, null, 2)}
  }
})
\`\`\`\
`

  let formatted = ''
  try {
    formatted = await $prettier.format(md, {
      trailingComma: 'none',
      semi: false,
      singleQuote: true
    })
  } catch (e) {
    formatted = md
  }

  return parseMarkdown(formatted)
})
</script>

<template>
  <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" />
</template>
