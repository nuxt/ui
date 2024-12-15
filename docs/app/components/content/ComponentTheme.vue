<script setup lang="ts">
import json5 from 'json5'
import { camelCase } from 'scule'
import * as theme from '#build/ui'
import * as themePro from '#build/ui-pro'

const props = defineProps<{
  pro?: boolean
}>()

const route = useRoute()
const { framework } = useSharedData()

const name = camelCase(route.params.slug?.[route.params.slug.length - 1] ?? '')

const strippedCompoundVariants = ref(false)

const strippedTheme = computed(() => {
  const strippedTheme = {
    ...((props.pro ? themePro : theme) as any)[name]
  }

  if (strippedTheme?.compoundVariants) {
    strippedTheme.compoundVariants = strippedTheme.compoundVariants.filter((compoundVariant: any) => {
      if (compoundVariant.color) {
        if (!['primary', 'neutral'].includes(compoundVariant.color)) {
          strippedCompoundVariants.value = true

          return false
        }
      }

      if (compoundVariant.highlightColor) {
        if (!['primary', 'neutral'].includes(compoundVariant.highlightColor)) {
          strippedCompoundVariants.value = true

          return false
        }
      }

      if (compoundVariant.loadingColor) {
        if (!['primary', 'neutral'].includes(compoundVariant.loadingColor)) {
          strippedCompoundVariants.value = true

          return false
        }
      }

      return true
    })
  }

  return strippedTheme
})

const component = computed(() => {
  return {
    [props.pro ? 'uiPro' : 'ui']: {
      [name]: strippedTheme.value
    }
  }
})

const { data: ast } = await useAsyncData(`component-theme-${name}`, async () => {
  const md = `
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

${strippedCompoundVariants.value
  ? `
::callout{icon="i-simple-icons-github" to="https://github.com/nuxt/ui/blob/v3/src/theme/${name}.ts"}
Some colors in \`compoundVariants\` are omitted for readability. Check out the source code on GitHub.
::`
  : ''}
`

  return parseMarkdown(md)
}, { watch: [framework] })
</script>

<template>
  <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" />
</template>
