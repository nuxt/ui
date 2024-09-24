<script setup lang="ts">
import { murmurHash } from 'ohash'

const props = defineProps<{
  type: string
}>()

const type = computed(() => {
  let type = props.type
  if (type.includes(', "as" | "asChild" | "forceMount">')) {
    type = type.replace(`, "as" | "asChild" | "forceMount">`, ``).replace('Omit<', '')
  }
  if (type.includes(', "as" | "asChild">')) {
    type = type.replace(', "as" | "asChild">', '').replace('Omit<', '')
  }
  if (type.startsWith('undefined |')) {
    type = type.replace('undefined |', '')
  }
  if (type.endsWith('| undefined')) {
    type = type.replace('| undefined', '')
  }

  return type
})

const { data: ast } = await useAsyncData(`hightlight-inline-code-${murmurHash(type.value)}`, () => parseMarkdown(`\`${type.value}\`{lang="ts-type"}`))
</script>

<template>
  <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" />
</template>
