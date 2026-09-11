<script setup lang="ts">
import { isReasoningUIPart, isTextUIPart, isToolUIPart, getToolName, lastAssistantMessageIsCompleteWithApprovalResponses } from 'ai'
import { useChat } from '@ai-sdk/vue'
import { isPartStreaming, isToolStreaming, isToolApprovalPending } from '@nuxt/ui/utils/ai'
import { Markdown } from '@comark/vue'
import shiki from '@comark/vue/plugins/shiki'

const pg = usePg()

const toast = useToast()

const input = ref('')

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

function onSubmit() {
  if (!input.value.trim()) return

  sendMessage({ text: input.value })

  input.value = ''
}

function clearMessages() {
  if (status.value === 'streaming' || status.value === 'submitted') {
    stop()
  }
  messages.value = []
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
  <UDashboardNavbar :class="pg.absolute_top_0_inset_x_0_z_5_border_b_0_lg_pointer_events_none">
    <template #right>
      <UButton
        v-if="!messages.length"
        icon="i-lucide-messages-square"
        label="Generate messages"
        color="neutral"
        variant="ghost"
        :class="pg.pointer_events_auto"
        @click="generateMessages"
      />
      <UButton
        v-if="messages.length"
        icon="i-lucide-list-x"
        color="neutral"
        variant="ghost"
        :class="pg.pointer_events_auto"
        @click="clearMessages"
      />
    </template>
  </UDashboardNavbar>

  <div :class="pg.flex_1_flex_flex_col_gap_4_sm_gap_6_max_w_xl_w_full_mx_auto_min_h_0">
    <UChatMessages
      should-auto-scroll
      :messages="messages"
      :status="status"
      :spacing-offset="72"
      :assistant="{ actions: [{ label: 'Edit', icon: 'i-lucide-pencil', onClick: () => console.log('edit') }] }"
      :user="{ actions: [{ label: 'Edit', icon: 'i-lucide-pencil', onClick: () => console.log('edit') }], icon: 'i-lucide-user' }"
    >
      <template #content="{ message }">
        <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}`">
          <UChatReasoning
            v-if="isReasoningUIPart(part)"
            :text="part.text"
            :streaming="isPartStreaming(part)"
            chevron="leading"
          >
            <Markdown
              :value="part.text"
              :streaming="isPartStreaming(part)"
              :plugins="[shiki()]"
              :class="pg.first_mt_0_last_mb_0"
            />
          </UChatReasoning>

          <template v-else-if="isTextUIPart(part)">
            <Markdown
              v-if="message.role === 'assistant'"
              :value="part.text"
              :streaming="isPartStreaming(part)"
              :plugins="[shiki()]"
              :class="pg.first_mt_0_last_mb_0"
            />
            <p v-else-if="message.role === 'user'" :class="pg.whitespace_pre_wrap">
              {{ part.text }}
            </p>
          </template>

          <UChatTool
            v-else-if="isToolUIPart(part) && getToolName(part) === 'web_search'"
            :text="isToolStreaming(part) ? 'Searching the web...' : 'Searched the web'"
            :suffix="(part.input as { query?: string })?.query"
            :streaming="isToolStreaming(part)"
            chevron="leading"
          >
            <div v-if="part.output && (part.output as any[]).length" :class="pg.p_1_border_border_default_rounded_md_max_h_40_overflow_y_auto">
              <a
                v-for="source in (part.output as any[])"
                :key="source.url"
                :href="source.url"
                target="_blank"
                rel="noopener noreferrer"
                :class="pg.flex_items_center_gap_2_px_2_py_1_text_sm_text_muted_hover_text_default_hover_bg_elevated_"
              >
                <img
                  :src="getFaviconUrl(source.url)"
                  :alt="getDomain(source.url)"
                  :class="pg.size_4_shrink_0_rounded_sm"
                  loading="lazy"
                  @error="($event.target as HTMLImageElement).style.display = 'none'"
                >
                <span :class="pg.truncate">{{ source.title || source.url }}</span>
                <span :class="pg.text_xs_text_dimmed_ms_auto_shrink_0">{{ getDomain(source.url) }}</span>
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
            :streaming="isToolStreaming(part)"
            :actions="part.state === 'approval-requested' ? [
              { label: 'Approve', color: 'neutral', onClick: () => addToolApprovalResponse({ id: part.approval!.id, approved: true }) },
              { label: 'Deny', color: 'neutral', variant: 'soft', onClick: () => addToolApprovalResponse({ id: part.approval!.id, approved: false }) }
            ] : undefined"
          >
            <pre :class="pg.text_xs_whitespace_pre_wrap">{{ JSON.stringify(part.input, null, 2) }}</pre>
          </UChatTool>
        </template>
      </template>
    </UChatMessages>

    <UChatPrompt
      v-model="input"
      :error="error"
      variant="subtle"
      :class="pg.sticky_bottom_0"
      @submit="onSubmit"
    >
      <UChatPromptSubmit :status="status" @stop="stop()" @reload="regenerate()" />
    </UChatPrompt>
  </div>
</template>
