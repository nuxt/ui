<script setup lang="ts">
const { font } = useTheme()

const { data: ast } = await useAsyncData(`font-theme`, async () => {
  const md = `
\`\`\`css [app/assets/css/main.css]
@import "tailwindcss";
@import "@nuxt/ui";

@theme {
  --font-sans: '${font.value}', sans-serif;
}
\`\`\`
`

  return parseMarkdown(md, { })
}, { watch: [font] })
</script>

<template>
  <MDCRenderer v-if="ast" :body="ast.body" :data="ast.data" />
</template>
