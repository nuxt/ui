<template>
  <ContentRenderer :value="ast" />
</template>

<script setup lang="ts">
import { upperFirst, camelCase } from 'scule'
import json5 from 'json5'
import * as config from '#ui/ui.config'
import { useShikiHighlighter } from '~/composables/useShikiHighlighter'

const props = defineProps({
  slug: {
    type: String,
    default: null
  }
})

const route = useRoute()
const highlighter = useShikiHighlighter()

const slug = props.slug || route.params.slug[route.params.slug.length - 1]
const camelName = camelCase(slug)
const name = `U${upperFirst(camelName)}`

const preset = config[camelName]

const { data: ast } = await useAsyncData(`${name}-preset`, () => parseMarkdown(`
\`\`\`yml
${json5.stringify(preset, null, 2).replace(/,([ |\t\n]+[}|\])])/g, '$1')}
\`\`\`\
`, {
  highlight: {
    highlighter,
    theme: {
      light: 'material-theme-lighter',
      default: 'material-theme',
      dark: 'material-theme-palenight'
    }
  }
}))
</script>
