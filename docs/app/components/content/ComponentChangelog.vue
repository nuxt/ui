<script setup lang="ts">
import type { CommitInfo } from '#build/changelog'
import { camelCase } from 'scule'
import { changelog } from '#build/changelog'

const route = useRoute()
const camelName = camelCase(route.path.split('/').pop() ?? '')

const commits = computed(() => {
  const related = changelog.filter(c => c.version || c.components?.some(i => i.includes(camelName)))
  return related.filter((i, idx) => !(i.version && (!related[idx + 1] || related[idx + 1]?.version)))
})

function normalizeCommitMessage(commit: CommitInfo) {
  const prefix = `[\`${commit.hash.slice(0, 5)}\`](https://github.com/nuxt/ui/commit/${commit.hash})`
  const content = commit.message.replace(/\(.*?\)/, '')
    .replace(/#(\d+)/g, '<a href=\'https://github.com/nuxt/ui/issues/$1\'>#$1</a>')
    .replace(/`(.*?)`/g, '<code class="text-xs">$1</code>')

  return `${prefix} — ${content}`
}
</script>

<template>
  <div v-if="!commits.length">
    No recent changes
  </div>

  <div v-else class="flex flex-col gap-1.5">
    <template v-for="(commit, idx) of commits" :key="commit.hash">
      <div v-if="idx === 0 && !commit.version" class="flex gap-1.5 items-center">
        <UAvatar icon="lucide:git-pull-request-draft" size="sm" class="shrink-0" />
        <div class="text-muted text-sm/5">
          Pending for release...
        </div>
      </div>

      <div v-if="commit.version" class="flex gap-1.5 items-center">
        <UAvatar icon="lucide:rocket" size="sm" class="shrink-0" />
        <div class="text-sm">
          <ProseA :href="`https://github.com/nuxt/ui/releases/tag/${commit.version}`" target="_blank">
            {{ commit.version }}
          </ProseA>
          <span class="text-dimmed text-xs/5"> on <NuxtTime :datetime="commit.date" /></span>
        </div>
      </div>
      <div v-else class="flex gap-1.5 items-center">
        <Icon name="lucide:git-commit-vertical" class="text-dimmed shrink-0 w-7" />
        <MDC :value="normalizeCommitMessage(commit)" class="leading-7 text-sm [&>*]:py-0 [&>*]:my-0" tag="div" />
      </div>
    </template>
  </div>
</template>
