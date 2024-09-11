<script setup lang="ts">
import json5 from 'json5'

const appConfig = useAppConfig()

const icons = computed(() => {
  return {
    ui: {
      icons: appConfig.ui.icons
    }
  }
})

const { data: ast } = await useAsyncData(`icons-theme`, async () => {
  const md = `
\`\`\`ts [app.config.ts]
export default defineAppConfig(${json5.stringify(icons.value, null, 2).replace(/,([ |\t\n]+[}|\])])/g, '$1')})
\`\`\`\
`

  return parseMarkdown(md)
})
</script>

<template>
  <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" />
</template>
