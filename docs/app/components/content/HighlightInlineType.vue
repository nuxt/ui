<script setup lang="ts">
import { parseMarkdown } from '@nuxtjs/mdc/runtime'

const props = defineProps<{
  type: string
}>()

const { data: ast } = await useAsyncData<any>(`hightlight-inline-code-` + props.type, async () => {
  const ast = await parseMarkdown(`\`type _ = ${props.type}\`{lang="ts"}`)

  const p = ast.body.children[0]
  const code = p.children[0]

  // Remove the `type _ = ` part
  code.children = code.children.slice(3)
  ast.body.children = [code]

  return ast
})
</script>

<template>
  <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" />
</template>
