<script setup lang="ts">
import type { UIDataTypes, UIMessage } from 'ai'
import { isReasoningUIPart, isTextUIPart } from 'ai'
import { Markdown } from '@comark/vue'

type ChatMessage = UIMessage<unknown, UIDataTypes, {
  runCommand: {
    input: { command: string }
    output: { stdout: string }
  }
}>

const messages: ChatMessage[] = [{
  id: '1',
  role: 'user',
  parts: [{ type: 'text', text: 'Why does pnpm install fail in CI?' }]
}, {
  id: '2',
  role: 'assistant',
  parts: [{
    type: 'reasoning',
    text: 'The error mentions the lockfile, so I should compare package.json with pnpm-lock.yaml in the last commit.',
    state: 'done'
  }, {
    type: 'tool-runCommand',
    toolCallId: 'call-1',
    state: 'output-available',
    input: { command: 'pnpm --version' },
    output: { stdout: '10.18.0' }
  }, {
    type: 'tool-runCommand',
    toolCallId: 'call-2',
    state: 'output-available',
    input: { command: 'git diff --stat HEAD~1 -- package.json pnpm-lock.yaml' },
    output: { stdout: 'package.json | 2 +-\n1 file changed, 1 insertion(+), 1 deletion(-)' }
  }, {
    type: 'tool-runCommand',
    toolCallId: 'call-3',
    state: 'output-error',
    input: { command: 'pnpm install --frozen-lockfile' },
    errorText: 'ERR_PNPM_OUTDATED_LOCKFILE  Cannot install with "frozen-lockfile" because pnpm-lock.yaml is not up to date with package.json'
  }, {
    type: 'source-url',
    sourceId: 'source-1',
    url: 'https://pnpm.io/cli/install#--frozen-lockfile',
    title: 'pnpm install'
  }, {
    type: 'source-url',
    sourceId: 'source-2',
    url: 'https://pnpm.io/git#lockfiles',
    title: 'Working with Git'
  }, {
    type: 'text',
    text: 'The last commit bumped a version in `package.json` without updating `pnpm-lock.yaml`, so the frozen install fails. Run `pnpm install` locally and commit the lockfile.',
    state: 'done'
  }]
}]

function getSources(message: ChatMessage) {
  return message.parts.filter(part => part.type === 'source-url')
}
</script>

<template>
  <UChatMessages :messages="messages" :should-scroll-to-bottom="false" :auto-scroll="false">
    <template #part="{ part, message }">
      <UChatReasoning
        v-if="isReasoningUIPart(part)"
        :text="part.text"
        :duration="5"
        icon="i-lucide-circle-check"
      />

      <UChatTool
        v-else-if="part.type === 'tool-runCommand'"
        :text="`${part.state === 'output-error' ? 'Failed to run' : 'Ran'} ${part.input?.command}`"
        :error="part.state === 'output-error'"
        icon="i-lucide-circle-check"
      >
        <ProsePre
          :code="part.state === 'output-error' ? part.errorText : part.output?.stdout"
          :copy="false"
          :ui="{ root: 'my-0', base: 'text-xs/5' }"
        >
          {{ part.state === 'output-error' ? part.errorText : part.output?.stdout }}
        </ProsePre>
      </UChatTool>

      <UChatTool
        v-else-if="part.type === 'source-url' && getSources(message)[0] === part"
        :text="`Used ${getSources(message).length} sources`"
        icon="i-lucide-globe"
      >
        <ul class="flex flex-col gap-1">
          <li v-for="source in getSources(message)" :key="source.sourceId">
            <ULink :to="source.url" target="_blank" class="text-sm">
              {{ source.title }}
            </ULink>
          </li>
        </ul>
      </UChatTool>

      <Markdown
        v-else-if="isTextUIPart(part) && message.role === 'assistant'"
        :value="part.text"
        class="*:first:mt-0 *:last:mb-0"
      />
    </template>
  </UChatMessages>
</template>
