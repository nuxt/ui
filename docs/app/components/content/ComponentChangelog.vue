<script setup lang="ts">
import { camelCase, kebabCase, upperFirst } from 'scule'

const props = defineProps<{
  prefix?: string
}>()

const route = useRoute()
const name = route.path.split('/').pop() ?? ''
const camelName = upperFirst(camelCase(name))
const kebabName = kebabCase(name)

const { data: commits } = await useLazyFetch('/api/github/commits', {
  key: `component-changelog-${name}`,
  query: {
    path: [
      `src/runtime/components/${props.prefix ? `${props.prefix}/` : ''}${camelName}.vue`,
      `src/theme/${props.prefix ? `${props.prefix}/` : ''}${kebabName}.ts`
    ]
  }
})

function normalizeCommitMessage(commit: { sha: string, message: string }) {
  const prefix = `[\`${commit.sha.slice(0, 5)}\`](https://github.com/nuxt/ui/commit/${commit.sha})`
  const content = commit.message.replace(/\(.*?\)/, '')
    .replace(/#(\d+)/g, '<a href=\'https://github.com/nuxt/ui/issues/$1\'>#$1</a>')
    .replace(/`(.*?)`/g, '<code class="text-xs">$1</code>')

  return `${prefix} — ${content}`
}
</script>

<template>
  <div v-if="!commits?.length">
    No recent changes
  </div>

  <div class="flex flex-col gap-1.5 relative">
    <div class="bg-accented w-px h-full absolute left-[11px] z-[-1]" />

    <template v-for="commit of commits" :key="commit.sha">
      <div class="flex gap-1.5 items-center">
        <div class="bg-accented ring-2 ring-bg size-1.5 mx-[8.5px] rounded-full" />
        <MDC :value="normalizeCommitMessage(commit)" class="text-sm [&>*]:py-0 [&>*]:my-0 [&_code]:text-xs" tag="div" />
      </div>
    </template>
  </div>
</template>
