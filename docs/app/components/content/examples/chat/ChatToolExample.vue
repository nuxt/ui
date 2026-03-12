<script setup lang="ts">
const streaming = ref(true)
const result = ref(`$ pnpm run lint

> eslint .

✔ No lint errors found.
`)

let timer: ReturnType<typeof setTimeout> | undefined

onMounted(() => {
  timer = setTimeout(() => {
    streaming.value = false
  }, 5000)
})

onUnmounted(() => {
  clearTimeout(timer)
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
