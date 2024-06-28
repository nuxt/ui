<script setup lang="ts">
import json5 from 'json5'
import { camelCase } from 'scule'
import { parseMarkdown } from '@nuxtjs/mdc/runtime'
import * as theme from '#build/ui'

const route = useRoute()

const name = camelCase(route.params.slug[route.params.slug.length - 1])

const { data: ast } = await useAsyncData<any>(`${name}-theme`, () => parseMarkdown(`
\`\`\`yml
${json5.stringify(theme[name], null, 2).replace(/,([ |\t\n]+[}|\])])/g, '$1')}
\`\`\`\

::callout{icon="i-heroicons-light-bulb"}
You can customize this component in your \`app.config.ts\` under \`ui.card\` key.
::
`))
</script>

<template>
  <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" />
</template>
