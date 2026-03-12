<script setup lang="ts">
import type { DefineComponent } from 'vue'
import type { ToolUIPart, DynamicToolUIPart } from 'ai'
import { DefaultChatTransport, isToolUIPart, isReasoningUIPart, isTextUIPart, getToolName } from 'ai'
import { Chat } from '@ai-sdk/vue'
import { isReasoningStreaming, isToolStreaming } from '@nuxt/ui/utils/ai'
import * as theme from '#build/ui'
import ProseStreamPre from '../prose/PreStream.vue'

const components = {
  pre: ProseStreamPre as unknown as DefineComponent
}

const input = ref('')

const toast = useToast()
const { track } = useAnalytics()
const { open, messages } = useChat()
const { resetTheme, applyThemeSettings, hasCSSChanges, hasAppConfigChanges } = useTheme()

const hasThemeChanges = computed(() => hasCSSChanges.value || hasAppConfigChanges.value)

let _skipSync = false
const _themeApplied = new Set<string>()
function processThemeToolCalls() {
  for (const message of chat.messages) {
    if (message.role !== 'assistant') continue

    for (const part of message.parts || []) {
      if (!isToolUIPart(part)) continue
      if (_themeApplied.has(part.toolCallId)) continue
      if (part.state !== 'output-available' && part.state !== 'input-available') continue

      const name = getToolName(part)
      if (name === 'applyTheme' && part.input) {
        _themeApplied.add(part.toolCallId)
        applyThemeSettings(part.input)
      } else if (name === 'resetTheme') {
        _themeApplied.add(part.toolCallId)
        resetTheme()
      }
    }
  }
}

const chat = new Chat({
  messages: messages.value,
  transport: new DefaultChatTransport({
    api: '/api/ai',
    body: { theme }
  }),
  onError: (error) => {
    let message = error.message
    if (typeof message === 'string' && message[0] === '{') {
      try {
        message = JSON.parse(message).message || message
      } catch {
        // keep original message on malformed JSON
      }
    }

    toast.add({
      description: message,
      icon: 'i-lucide-alert-circle',
      color: 'error',
      duration: 0
    })
  },
  onFinish: () => {
    processThemeToolCalls()
    _skipSync = true
    messages.value = chat.messages
    nextTick(() => {
      _skipSync = false
    })
  }
})

watchEffect(() => {
  if (chat.status === 'streaming' && chat.messages.length) {
    processThemeToolCalls()
  }
})

const canClear = computed(() => messages.value.length > 0)

function onSubmit() {
  if (!input.value.trim()) {
    return
  }

  track('AI Chat Message Sent')

  chat.sendMessage({ text: input.value })

  input.value = ''
}

// Sync external messages (e.g. from search→chat flow) into the chat instance.
// When the last synced message is from the user, auto-regenerate the assistant response.
// _skipSync prevents loops when onFinish writes back to the shared messages ref.
watch(messages, (newMessages) => {
  if (_skipSync) return

  chat.messages = newMessages
  if (chat.lastMessage?.role === 'user') {
    chat.regenerate()
  }
})

type ToolPart = ToolUIPart | DynamicToolUIPart
type ToolState = ToolPart['state']

function getToolMessage(state: ToolState, toolName: string, input: Record<string, string | undefined>) {
  const searchVerb = state === 'output-available' ? 'Searched' : 'Searching'
  const readVerb = state === 'output-available' ? 'Read' : 'Reading'
  const applyVerb = state === 'output-available' ? 'Applied' : 'Applying'

  return {
    'list-components': `${searchVerb} components`,
    'list-composables': `${searchVerb} composables`,
    'get-component': `${readVerb} ${upperName(input.componentName || '')} component`,
    'get-component-metadata': `${readVerb} metadata for component ${upperName(input.componentName || '')}`,
    'list-templates': `${searchVerb} templates${input.category ? ` in ${input.category} category` : ''}`,
    'get-template': `${readVerb} template ${upperName(input.templateName || '')}`,
    'get-documentation-page': `${readVerb} ${input.path || ''} page`,
    'list-documentation-pages': `${searchVerb} documentation pages`,
    'list-getting-started-guides': `${searchVerb} documentation guides`,
    'get-migration-guide': `${readVerb} migration guide${input.version ? ` for ${input.version}` : ''}`,
    'list-examples': `${searchVerb} examples`,
    'get-example': `${readVerb} ${upperName(input.exampleName || '')} example`,
    'search-components-by-category': `${searchVerb} components${input.category ? ` in ${input.category} category` : ''}${input.search ? ` for "${input.search}"` : ''}`,
    'getComponentTheme': `${readVerb} ${upperName(input.componentName || '')} theme`,
    'applyTheme': `${applyVerb} theme changes`,
    'resetTheme': `${state === 'output-available' ? 'Reset' : 'Resetting'} theme to defaults`
  }[toolName] || `${searchVerb} ${toolName}`
}

const getCachedToolMessage = useMemoize((state: ToolState, toolName: string, input: string) =>
  getToolMessage(state, toolName, JSON.parse(input))
)

function getToolText(part: ToolPart) {
  return getCachedToolMessage(part.state, getToolName(part), JSON.stringify(part.input || {}))
}

function getToolIcon(part: ToolPart): string {
  const toolName = getToolName(part)

  const iconMap: Record<string, string> = {
    'get-component': 'i-lucide-file-text',
    'get-component-metadata': 'i-lucide-file-text',
    'get-template': 'i-lucide-file-text',
    'get-documentation-page': 'i-lucide-file-text',
    'get-migration-guide': 'i-lucide-file-text',
    'get-example': 'i-lucide-file-text',
    'getComponentTheme': 'i-lucide-file-text',
    'applyTheme': 'i-lucide-palette',
    'resetTheme': 'i-lucide-palette'
  }

  return iconMap[toolName] || 'i-lucide-search'
}

function askQuestion(question: string) {
  input.value = question
  onSubmit()
}

const suggestions = [
  {
    category: 'Components',
    items: [
      'How to build a dashboard layout?',
      'How to build a table with pagination?',
      'How to create a form with validation?'
    ]
  },
  {
    category: 'Composables',
    items: [
      'How to show toast notifications?',
      'How to define keyboard shortcuts?',
      'How do I open a modal programmatically?'
    ]
  },
  {
    category: 'Theme',
    items: [
      'Create a black & white theme',
      'Design a beautiful sakura-inspired theme',
      'Surprise me with a creative and unique theme'
    ]
  }
]

function clearMessages() {
  if (chat.status === 'streaming') {
    chat.stop()
  }
  messages.value = []
  chat.messages = []
  _themeApplied.clear()
}

defineShortcuts({
  meta_i: {
    handler: () => {
      open.value = !open.value
    },
    usingInput: true
  }
})
</script>

<template>
  <USidebar
    v-model:open="open"
    side="right"
    title="Ask AI"
    rail
    :style="{ '--sidebar-width': '24rem' }"
    :ui="{ footer: 'p-0', actions: 'gap-0.5' }"
  >
    <template #actions>
      <UTooltip v-if="hasThemeChanges" text="Reset theme">
        <UButton
          icon="i-lucide-rotate-ccw"
          color="neutral"
          variant="ghost"
          @click="resetTheme"
        />
      </UTooltip>

      <UTooltip v-if="canClear" text="Clear messages">
        <UButton
          icon="i-lucide-list-x"
          color="neutral"
          variant="ghost"
          @click="clearMessages"
        />
      </UTooltip>
    </template>

    <template #close>
      <UTooltip text="Close" :kbds="['meta', 'i']">
        <UButton
          icon="i-lucide-panel-right-close"
          color="neutral"
          variant="ghost"
          aria-label="Close"
          @click="open = false"
        />
      </UTooltip>
    </template>

    <UTheme
      :ui="{
        prose: {
          p: { base: 'my-2 text-sm/6' },
          li: { base: 'my-0.5 text-sm/6' },
          ul: { base: 'my-2' },
          ol: { base: 'my-2' },
          h1: { base: 'text-xl mb-4' },
          h2: { base: 'text-lg mt-6 mb-3' },
          h3: { base: 'text-base mt-4 mb-2' },
          h4: { base: 'text-sm mt-3 mb-1.5' },
          code: { base: 'text-xs' },
          pre: { root: 'my-2', base: 'text-xs/5' },
          table: { root: 'my-2' },
          hr: { base: 'my-4' }
        }
      }"
    >
      <UChatMessages
        v-if="chat.messages.length"
        should-auto-scroll
        :messages="chat.messages"
        :status="chat.status"
        compact
        class="px-0 gap-2"
        :user="{ ui: { container: 'max-w-full' } }"
      >
        <template #content="{ message }">
          <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}`">
            <UChatReasoning
              v-if="isReasoningUIPart(part)"
              :text="part.text"
              :streaming="isReasoningStreaming(message, index, chat)"
              icon="i-lucide-brain"
            >
              <MDCCached
                :value="part.text"
                :cache-key="`reasoning-${message.id}-${index}`"
                :parser-options="{ highlight: false }"
                class="*:first:mt-0 *:last:mb-0"
              />
            </UChatReasoning>
            <MDCCached
              v-else-if="isTextUIPart(part) && part.text.length > 0"
              :value="part.text"
              :cache-key="`${message.id}-${index}`"
              :components="components"
              :parser-options="{ highlight: false }"
              class="*:first:mt-0 *:last:mb-0"
            />
            <UChatTool
              v-else-if="isToolUIPart(part)"
              :text="getToolText(part)"
              :icon="getToolIcon(part)"
              :streaming="isToolStreaming(part)"
            />
          </template>
        </template>
      </UChatMessages>

      <div v-else class="flex flex-col gap-6">
        <UPageLinks
          v-for="category in suggestions"
          :key="category.category"
          :title="category.category"
          :links="category.items.map(item => ({ label: item, onClick: () => askQuestion(item) }))"
        />
      </div>
    </UTheme>

    <template #footer>
      <UChatPrompt
        v-model="input"
        :error="chat.error"
        placeholder="Ask me anything..."
        variant="naked"
        size="sm"
        autofocus
        :ui="{ base: 'px-0' }"
        class="px-4"
        @submit="onSubmit"
      >
        <template #footer>
          <div class="flex items-center gap-1.5 text-xs text-dimmed">
            <NuxtLink to="https://vercel.com/ai-gateway" target="_blank" class="inline-flex items-center gap-1 hover:text-muted transition-colors">
              Powered by <UIcon name="i-simple-icons-vercel" class="size-3" /> AI Gateway
            </NuxtLink>
          </div>

          <UChatPromptSubmit
            size="sm"
            :status="chat.status"
            :disabled="!input.trim()"
            @stop="chat.stop()"
            @reload="chat.regenerate()"
          />
        </template>
      </UChatPrompt>
    </template>
  </USidebar>
</template>
