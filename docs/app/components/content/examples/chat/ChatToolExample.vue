<script setup lang="ts">
const streaming = ref(true)
const result = ref(`$ cd /Users/benjamincanac/GitHub/nuxt/ui && pnpm run lint 2>&1

> @nuxt/ui@4.5.1 lint /Users/benjamincanac/GitHub/nuxt/ui
> eslint .


/Users/benjamincanac/GitHub/nuxt/ui/src/runtime/components/ChatTool.vue
  151:22  error  This branch can never execute. Its condition is a duplicate or covered by previous conditions in the \`v-if\` / \`v-else-if\` chain  vue/no-dupe-v-else-if

✖ 1 problem (1 error, 0 warnings)

ELIFECYCLE Command failed with exit code 1.
`)

onMounted(() => {
  setTimeout(() => {
    streaming.value = false
  }, 5000)
})
</script>

<template>
  <UChatTool
    :text="streaming ? 'Running lint checks' : 'Lint checks completed'"
    suffix="cd, pnpm run"
    :streaming="streaming"
    icon="i-lucide-terminal"
    variant="card"
    chevron="leading"
    class="w-80"
  >
    <pre language="bash" v-text="result" />
  </UChatTool>
</template>
