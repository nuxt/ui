<script setup lang="ts">
import json5 from 'json5'
import { parseMarkdown } from '@nuxtjs/mdc/runtime'
import * as theme from '#build/ui'

const props = defineProps<{ slug?: string }>()

const route = useRoute()

const name = props.slug || route.params.slug[route.params.slug.length - 1]

const { data: ast } = await useAsyncData(`${name}-theme`, () => parseMarkdown(`
## Theme

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
