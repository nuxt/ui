<script setup lang="ts">
import type { ChatPromptQueueItem } from '@nuxt/ui'
import { isReasoningUIPart, isTextUIPart, isToolUIPart, getToolName, lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai'
import { useChat } from '@ai-sdk/vue'
import { isPartStreaming, isToolStreaming, isToolApprovalPending, toFileUIParts } from '@nuxt/ui/utils/ai'
import { Markdown } from '@comark/vue'
import shiki from '@comark/vue/plugins/shiki'

const toast = useToast()

const input = ref('')
const files = ref<File[]>([])
const queue = ref<ChatPromptQueueItem[]>([])

const { messages, status, error, sendMessage, regenerate, stop, addToolApprovalResponse } = useChat({
  sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
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

async function onSubmit() {
  const text = input.value
  const submitted = files.value

  // Cleared before the files are read, so a second submit meanwhile has nothing to send
  input.value = ''
  files.value = []

  // A queued message whose files are still being read goes first
  if (sending) {
    queue.value.push({ text, files: submitted })
    return
  }

  await dispatch({ text, files: submitted })
}

// Reading files is async and the chat only turns busy once `sendMessage` runs,
// so one message is dispatched at a time and clearing the chat drops it
let sending = false
let generation = 0

async function dispatch(item: ChatPromptQueueItem) {
  const current = generation
  sending = true

  try {
    const parts = await toFileUIParts(item.files ?? [])
    if (current !== generation) return

    // An empty text part is rejected by some providers, send the files alone
    sendMessage(item.text.trim() ? { text: item.text, files: parts } : { files: parts })
  } catch (error) {
    if (current === generation) {
      queue.value.unshift(item)
    }
    toast.add({ description: (error as Error).message, icon: 'i-lucide-alert-circle', color: 'error' })
  } finally {
    sending = false

    // A cleared chat stays `ready`, a message queued during the read would wait forever
    if (current !== generation && status.value === 'ready') {
      sendNext()
    }
  }
}

// A response waiting for a tool approval is `ready` too, a new message would leave the approval unanswered
const awaitingApproval = computed(() => messages.value.at(-1)?.parts.some(part => isToolUIPart(part) && isToolApprovalPending(part)) ?? false)

function sendNext() {
  if (sending || awaitingApproval.value) return

  const item = queue.value.shift()
  if (item) {
    dispatch(item)
  }
}

watch(status, (value) => {
  if (value === 'ready') {
    sendNext()
  }
})

function onSend() {
  if (status.value === 'submitted' || status.value === 'streaming') {
    stop()
  } else {
    sendNext()
  }
}

function clearMessages() {
  if (status.value === 'streaming' || status.value === 'submitted') {
    stop()
  }
  generation++
  messages.value = []
  queue.value = []
}

function getEmailToolText(state: string): string {
  if (isToolApprovalPending({ state })) return 'Send this email?'
  if (state === 'output-available') return 'Email sent'
  if (state === 'output-denied') return 'Email cancelled'
  if (state === 'output-error') return 'Email failed'
  return 'Preparing email'
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

function generateMessages() {
  messages.value = [
    ...messages.value,
    {
      id: '1',
      parts: [{ type: 'text', text: 'Hello, how are you?' }],
      role: 'user'
    },
    {
      id: '2',
      parts: [{ type: 'text', text: 'Fine, and you ?' }],
      role: 'assistant'
    }
  ]
}
</script>

<template>
  <UDashboardNavbar class="absolute top-0 inset-x-0 z-5 border-b-0 lg:pointer-events-none">
    <template #right>
      <UButton
        v-if="!messages.length"
        icon="i-lucide-messages-square"
        label="Generate messages"
        color="neutral"
        variant="ghost"
        class="pointer-events-auto"
        @click="generateMessages"
      />
      <UButton
        v-if="messages.length"
        icon="i-lucide-list-x"
        color="neutral"
        variant="ghost"
        class="pointer-events-auto"
        @click="clearMessages"
      />
    </template>
  </UDashboardNavbar>

  <div class="flex-1 flex flex-col gap-4 sm:gap-6 max-w-xl w-full mx-auto min-h-0">
    <UChatMessages
      should-auto-scroll
      :messages="messages"
      :status="status"
      :assistant="{ actions: [{ label: 'Edit', icon: 'i-lucide-pencil', onClick: () => console.log('edit') }] }"
      :ui="{ footer: 'pt-4' }"
      :user="{ actions: [{ label: 'Edit', icon: 'i-lucide-pencil', onClick: () => console.log('edit') }], icon: 'i-lucide-user' }"
    >
      <template #files="{ parts }">
        <UChatAttachment
          v-for="(part, index) in parts"
          :key="index"
          :name="part.filename"
          :type="part.mediaType"
          :url="part.url"
        />
      </template>

      <template #part="{ part, message, streaming }">
        <UChatReasoning
          v-if="isReasoningUIPart(part)"
          :text="part.text"
          :streaming="isPartStreaming(part, streaming)"
          chevron="leading"
        >
          <Markdown
            :value="part.text"
            :streaming="isPartStreaming(part, streaming)"
            :plugins="[shiki()]"
            class="*:first:mt-0 *:last:mb-0"
          />
        </UChatReasoning>

        <Markdown
          v-else-if="isTextUIPart(part) && message.role === 'assistant'"
          :value="part.text"
          :streaming="isPartStreaming(part, streaming)"
          :plugins="[shiki()]"
          class="*:first:mt-0 *:last:mb-0"
        />

        <UChatTool
          v-else-if="isToolUIPart(part) && getToolName(part) === 'web_search'"
          :text="isToolStreaming(part, streaming) ? 'Searching the web...' : part.state === 'output-available' ? 'Searched the web' : part.state === 'output-error' ? 'Failed to search the web' : 'Stopped searching the web'"
          :suffix="(part.input as { query?: string })?.query"
          :streaming="isToolStreaming(part, streaming)"
          :error="part.state === 'output-error'"
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
        </UChatTool>

        <UChatTool
          v-else-if="isToolUIPart(part) && getToolName(part) === 'send_email'"
          :text="getEmailToolText(part.state)"
          :suffix="(part.input as { to?: string })?.to"
          icon="i-lucide-mail"
          chevron="leading"
          variant="card"
          :streaming="isToolStreaming(part, streaming)"
          :error="part.state === 'output-error'"
          :actions="part.state === 'approval-requested' ? [
            { label: 'Approve', color: 'neutral', onClick: () => addToolApprovalResponse({ id: part.approval!.id, approved: true }) },
            { label: 'Deny', color: 'neutral', variant: 'soft', onClick: () => addToolApprovalResponse({ id: part.approval!.id, approved: false }) }
          ] : undefined"
        >
          <pre class="text-xs whitespace-pre-wrap">{{ JSON.stringify(part.input, null, 2) }}</pre>
        </UChatTool>
      </template>

      <template #footer>
        <UChatPrompt
          v-model="input"
          v-model:files="files"
          v-model:queue="queue"
          accept="image/*,application/pdf"
          :status="status"
          :error="error"
          variant="subtle"
          @submit="onSubmit"
          @send="onSend"
        >
          <template #footer="{ open }">
            <UButton
              icon="i-lucide-paperclip"
              color="neutral"
              variant="ghost"
              size="sm"
              aria-label="Attach files"
              @click="open"
            />

            <UChatPromptSubmit :status="status" @stop="stop()" @reload="regenerate()" />
          </template>
        </UChatPrompt>
      </template>
    </UChatMessages>
  </div>
</template>
