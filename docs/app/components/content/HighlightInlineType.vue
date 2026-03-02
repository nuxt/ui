<script setup lang="ts">
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

const ast = ref<any>(null)

onMounted(async () => {
  ast.value = await parseMarkdown(`\`\` ${type.value} \`\`{lang="ts-type"}`)
})
</script>

<template>
  <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" />
  <ProseCode v-else>
    {{ type }}
  </ProseCode>
</template>
