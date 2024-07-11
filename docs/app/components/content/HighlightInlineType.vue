<script setup lang="ts">
const props = defineProps<{
  type: string
}>()

const type = computed(() => {
  if (props.type.includes(', "as" | "asChild" | "forceMount">')) {
    return props.type.replace(`, "as" | "asChild" | "forceMount">`, ``).replace('Omit<', '')
  }
  if (props.type.includes(', "as" | "asChild">')) {
    return props.type.replace(', "as" | "asChild">', '').replace('Omit<', '')
  }

  return props.type
})

const { data: ast } = await useAsyncData(`hightlight-inline-code-${props.type}`, () => parseMarkdown(`\`${type.value}\`{lang="ts-type"}`))
</script>

<template>
  <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" />
</template>
