<template>
  <div>
    <ContentRenderer :value="ast" />
  </div>
  <!-- <pre><code>{{ preset }}</code></pre> -->
</template>

<script setup lang="ts">
import { transformContent } from '@nuxt/content/transformers'

const props = defineProps({
  slug: {
    type: String,
    default: null
  }
})

const appConfig = useAppConfig()
const route = useRoute()
const slug = props.slug || route.params.slug[1]
const camelName = useCamelCase(slug)
const name = `U${useUpperFirst(camelName)}`

const preset = appConfig.ui[camelName]

const { data: ast } = await useAsyncData(`${name}-preset`, () => transformContent('content:_markdown.md', `
\`\`\`json
${JSON.stringify(preset, null, 2)}
\`\`\`\
`, {
  highlight: {
    theme: {
      default: 'material-default',
      light: 'material-lighter',
      dark: 'material-darker'
    }
  }
}))
</script>
