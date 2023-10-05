<template>
  <ContentRenderer :value="ast" />
</template>

<script setup lang="ts">
// @ts-expect-error
import { transformContent } from '@nuxt/content/transformers'
import { upperFirst, camelCase } from 'scule'
import * as config from '#ui/ui.config'

const props = defineProps({
  slug: {
    type: String,
    default: null
  }
})

const route = useRoute()
// eslint-disable-next-line vue/no-dupe-keys
const slug = props.slug || route.params.slug[route.params.slug.length - 1]
const camelName = camelCase(slug)
const name = `U${upperFirst(camelName)}`

const preset = config[camelName]

const { data: ast } = await useAsyncData(`${name}-preset`, () => transformContent('content:_markdown.md', `
\`\`\`json
${JSON.stringify(preset, null, 2)}
\`\`\`\
`, {
  highlight: {
    theme: {
      light: 'material-theme-lighter',
      default: 'material-theme',
      dark: 'material-theme-palenight'
    }
  }
}))
</script>
