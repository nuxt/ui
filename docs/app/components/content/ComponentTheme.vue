<script setup lang="ts">
import json5 from 'json5'
import { camelCase } from 'scule'
import * as theme from '#build/ui'

const route = useRoute()

const name = camelCase(route.params.slug?.[route.params.slug.length - 1] ?? '')

const strippedCompoundVariants = ref(false)

function stripCompoundVariants(component?: any) {
  if (component?.compoundVariants) {
    component.compoundVariants = component.compoundVariants.filter((compoundVariant: any) => {
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

      return true
    })
  }

  return component
}

const component = computed(() => {
  return {
    ui: {
      [name]: stripCompoundVariants((theme as any)[name])
    }
  }
})

const { data: ast } = await useAsyncData(`component-theme-${name}`, async () => {
  const md = `
::code-collapse
\`\`\`ts [app.config.ts]
export default defineAppConfig(${json5.stringify(component.value, null, 2).replace(/,([ |\t\n]+[}|\])])/g, '$1')})
\`\`\`\

::

${strippedCompoundVariants.value
  ? `
::callout{icon="i-simple-icons-github" to="https://github.com/nuxt/ui/blob/v3/src/theme/${name}.ts"}
Some colors in \`compoundVariants\` are omitted for readability. Check out the source code on GitHub.
::`
  : ''}
`

  return parseMarkdown(md)
})
</script>

<template>
  <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" />
</template>
