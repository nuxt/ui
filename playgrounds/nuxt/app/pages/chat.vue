<script setup lang="ts">
import { isReasoningUIPart, isTextUIPart, isToolUIPart, getToolName } from 'ai'
import type { UIMessage } from 'ai'
import { Chat } from '@ai-sdk/vue'
import ChatReasoning from '../../../../docs/app/components/chat/ChatReasoning.vue'
import ChatTool from '../../../../docs/app/components/chat/ChatTool.vue'

const toast = useToast()

const messages: UIMessage[] = []
const input = ref('')

const chat = new Chat({
  messages,
  onError(error) {
    let message = error.message
    try {
      if (typeof message === 'string' && message[0] === '{') {
        message = JSON.parse(message).message || message
      }
    } catch { /* keep original */ }

    toast.add({
      description: message,
      icon: 'i-lucide-alert-circle',
      color: 'error',
      duration: 0
    })
  }
})

function onSubmit() {
  if (!input.value.trim()) return

  chat.sendMessage({ text: input.value })

  input.value = ''
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

function getFaviconUrl(url: string): string {
  return `https://www.google.com/s2/favicons?sz=32&domain=${getDomain(url)}`
}

function isStreamingReasoning(message: UIMessage, index: number): boolean {
  if (chat.status !== 'streaming') return false
  if (message.id !== chat.messages.at(-1)?.id) return false

  for (let i = index + 1; i < message.parts.length; i++) {
    if (message.parts[i]!.type !== 'reasoning') return false
  }
  return true
}
</script>

<template>
  <UDashboardNavbar class="absolute top-0 inset-x-0 z-5 border-b-0 lg:pointer-events-none" />

  <div class="flex-1 flex flex-col gap-4 sm:gap-6 max-w-xl w-full mx-auto min-h-0">
    <UChatMessages
      :messages="chat.messages"
      :status="chat.status"
      :spacing-offset="48"
      :assistant="{ ui: { content: 'flex flex-col gap-2.5' } }"
    >
      <template #content="{ message }">
        <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}`">
          <ChatReasoning
            v-if="isReasoningUIPart(part)"
            :text="part.text"
            :streaming="isStreamingReasoning(message, index)"
            chevron="leading"
          >
            <template #default="{ reasoningText }">
              <MDC
                :value="reasoningText"
                :cache-key="`${message.id}-${index}`"
                class="*:first:mt-0 *:last:mb-0"
              />
            </template>
          </ChatReasoning>
          <MDC
            v-else-if="isTextUIPart(part)"
            :value="part.text"
            :cache-key="`${message.id}-${index}`"
            class="*:first:mt-0 *:last:mb-0"
          />
          <ChatTool
            v-else-if="isToolUIPart(part) && getToolName(part) === 'web_search'"
            :text="part.state !== 'output-available' ? 'Searching the web...' : 'Searched the web'"
            :suffix="(part.input as { query?: string })?.query"
            :streaming="part.state !== 'output-available'"
            chevron="leading"
          >
            <div v-if="part.output && (part.output as any[]).length" class="p-1 border border-default rounded-md max-h-40 overflow-y-auto">
              <a
                v-for="source in (part.output as any[])"
                :key="source.url"
                :href="source.url"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center gap-2 px-2 py-1 text-sm text-muted hover:text-default hover:bg-elevated/50 transition-colors min-w-0 rounded-md"
              >
                <img
                  :src="getFaviconUrl(source.url)"
                  :alt="getDomain(source.url)"
                  class="size-4 shrink-0 rounded-sm"
                  loading="lazy"
                  @error="($event.target as HTMLImageElement).style.display = 'none'"
                >
                <span class="truncate">{{ source.title || source.url }}</span>
                <span class="text-xs text-dimmed ms-auto shrink-0">{{ getDomain(source.url) }}</span>
              </a>
            </div>
          </ChatTool>
        </template>
      </template>
    </UChatMessages>

    <UChatPrompt
      v-model="input"
      :error="chat.error"
      variant="subtle"
      class="sticky bottom-0"
      @submit="onSubmit"
    >
      <UChatPromptSubmit :status="chat.status" @stop="chat.stop()" @reload="chat.regenerate()" />
    </UChatPrompt>
  </div>
</template>
