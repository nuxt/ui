<script setup lang="ts">
import json5 from 'json5'

const appConfig = useAppConfig()

const { data: ast } = await useAsyncData<any>(`icons-theme`, () => parseMarkdown(`
\`\`\`yml
${json5.stringify(appConfig.ui.icons, null, 2).replace(/,([ |\t\n]+[}|\])])/g, '$1')}
\`\`\`\

::callout{icon="i-heroicons-light-bulb"}
You can customize this component in your \`app.config.ts\` under \`ui.icons\` key.
::
`))
</script>

<template>
  <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" />
</template>
