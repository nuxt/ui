<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    filename: string;
    code: string;
    lang?: string;
    lines?: boolean;
  }>(),
  {
    lines: true,
    lang: 'vue'
  }
)
const { copy, copied } = useClipboard({ source: props.code })

const mdcCode = computed(() => {
  let code = '```' + props.lang + '\n'
  code += props.code.replace(/^\n/g, '').replace(/\n$/g, '') + '\n'
  code += '```'
  return code
})
</script>

<template>
  <div class="group bg-navy border border-gray-700 overflow-hidden rounded-md z-10">
    <div class="h-11 flex items-center gap-4 px-4 border-b border-gray-700">
      <div class="flex space-x-1.5">
        <div class="w-3 h-3 rounded-full transition-all bg-white/25 group-hover:bg-red-500/80" />
        <div class="w-3 h-3 rounded-full transition-all bg-white/25 group-hover:bg-amber-400/80" />
        <div class="w-3 h-3 rounded-full transition-all bg-white/25 group-hover:bg-green-400/80" />
      </div>
      <span class="text-gray-400 text-sm">{{ filename }}</span>
      <span class="flex-1" />
      <span
        v-if="copied"
        class="i-ph-check w-4 h-4 text-green-500"
        title="Copied!"
      />
      <span
        v-else
        title="Copy code"
        class="cursor-copy i-ph-copy w-4 h-4 text-white opacity-50 group-hover:opacity-70 hover:!opacity-100"
        @click="copy()"
      />
    </div>
    <MDC
      class="n-code-block"
      :class="lines ? 'n-code-block-lines' : ''"
      :value="mdcCode"
      :parser-options="{
        highlight: {
          theme: {
            light: 'material-theme-lighter',
            default: 'material-theme',
            dark: 'material-theme-palenight'
          }
        }
      }"
    />
  </div>
</template>

<style lang="postcss">
.n-code-block .shiki {
  @apply overflow-auto bg-white/5 text-gray-200 w-full text-sm;
}
.n-code-block-lines .shiki code {
  counter-reset: step;
  counter-increment: step calc(var(--start, 1) - 1);
}
.n-code-block-lines .shiki code .line::before {
  content: counter(step);
  counter-increment: step;
  width: 2.2rem;
  padding-right: 0.5rem;
  margin-right: 0.5rem;
  display: inline-block;
  text-align: right;
  @apply bg-black/20 text-white/30;
}
</style>
