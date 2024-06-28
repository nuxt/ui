<script setup lang="ts">
import { parseMarkdown } from '@nuxtjs/mdc/runtime'

const props = defineProps<{
  type: string
}>()

const { data: ast } = await useAsyncData<any>(`hightlight-inline-code-` + props.type, () => parseMarkdown(`\`${props.type}\`{lang="ts-type"}`))
</script>

<template>
  <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" />
</template>
