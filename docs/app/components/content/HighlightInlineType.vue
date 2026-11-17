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

// inline code carrying the type, which resolves to ProseCode
const markdown = computed(() => `\`\` ${type.value} \`\`{lang="ts-type"}`)
</script>

<template>
  <DocsMarkdown :value="markdown" unwrap="p" />
</template>
