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

// Inline code carrying the type, which resolves to ProseCode. A double backtick
// span only when the type holds one of its own: comark leaks a `_` out of the
// span when the content has an odd number of them, which the reka-ui
// `_Number<_Optional<...>>` modifiers hit.
const markdown = computed(() => type.value.includes('`')
  ? `\`\` ${type.value} \`\`{lang="ts-type"}`
  : `\`${type.value}\`{lang="ts-type"}`)
</script>

<template>
  <DocsMarkdown :value="markdown" unwrap="p" />
</template>
