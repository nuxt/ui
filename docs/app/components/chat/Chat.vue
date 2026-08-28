<script setup lang="ts">
import type { ToolUIPart, DynamicToolUIPart } from 'ai'
import { DefaultChatTransport, isToolUIPart, isReasoningUIPart, isTextUIPart, getToolName } from 'ai'
import { useChat as useAIChat } from '@ai-sdk/vue'
import { isPartStreaming, isToolStreaming } from '@nuxt/ui/utils/ai'
import type { DocsChatMessage, DocsChatTools } from '~~/server/api/ai.post'

const input = ref('')

const toast = useToast()
const { track } = useAnalytics()
const route = useRoute()
const { open, messages } = useChat()
const { open: searchOpen } = useContentSearch()
const { framework } = useFrameworks()
const { resetTheme, applyThemeSettings, hasChanges: hasThemeChanges } = useTheme()
// A preset is a whole ThemeDoc, so it rides applyDoc (reset, style axis, class
// bundle) rather than the settings channel applyTheme uses.
const { presets, applyPreset } = useThemeStudio()
// The theme actions the chat exposes are the studio's own, so they take the
// studio's glyphs and skin to the applied icon pack with it.
const studioIcons = useStudioIcons()
const appConfig = useAppConfig()

let _skipSync = false
const _themeApplied = new Set<string>()
function processThemeToolCalls() {
  for (const message of chatMessages.value) {
    if (message.role !== 'assistant') continue

    for (const part of message.parts || []) {
      if (!isToolUIPart(part)) continue
      if (_themeApplied.has(part.toolCallId)) continue
      if (part.state !== 'output-available' && part.state !== 'input-available') continue

      const name = getToolName(part)
      if (name === 'applyTheme' && part.input) {
        _themeApplied.add(part.toolCallId)
        applyThemeSettings(part.input as DocsChatTools['applyTheme']['input'])
      } else if (name === 'applyPreset' && part.input) {
        _themeApplied.add(part.toolCallId)
        const { preset: id } = part.input as DocsChatTools['applyPreset']['input']
        // The model picks from an enum, but a renamed preset in a stale
        // conversation would still resolve to nothing.
        const preset = presets.find(entry => entry.id === id)
        if (preset) applyPreset(preset)
      } else if (name === 'resetTheme') {
        _themeApplied.add(part.toolCallId)
        resetTheme()
      }
    }
  }
}

const { messages: chatMessages, status, error, sendMessage, regenerate, stop } = useAIChat<DocsChatMessage>({
  messages: messages.value,
  transport: new DefaultChatTransport<DocsChatMessage>({
    api: '/api/ai',
    body: () => ({ framework: framework.value, currentPage: route.path.startsWith('/docs/') ? route.path : null })
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
    messages.value = chatMessages.value
    nextTick(() => {
      _skipSync = false
    })
  }
})

watchEffect(() => {
  if (status.value === 'streaming' && chatMessages.value.length) {
    processThemeToolCalls()
  }
})

const canClear = computed(() => messages.value.length > 0)

function onSubmit() {
  if (!input.value.trim()) {
    return
  }

  track('AI Chat Message Sent')

  sendMessage({ text: input.value })

  input.value = ''
}

// Sync external messages (e.g. from search→chat flow) into the chat instance.
// When the last synced message is from the user, auto-regenerate the assistant response.
// _skipSync prevents loops when onFinish writes back to the shared messages ref.
watch(messages, (newMessages) => {
  if (_skipSync) return

  chatMessages.value = newMessages
  if (chatMessages.value.at(-1)?.role === 'user') {
    regenerate()
  }
})

type ToolPart = ToolUIPart | DynamicToolUIPart
type ToolState = ToolPart['state']

function getToolMessage(state: ToolState, toolName: string, input: Record<string, string | undefined>) {
  const searchVerb = state === 'output-available' ? 'Searched' : 'Searching'
  const readVerb = state === 'output-available' ? 'Read' : 'Reading'
  const applyVerb = state === 'output-available' ? 'Applied' : 'Applying'

  return {
    'search-components': `${searchVerb} components${input.category ? ` in ${input.category} category` : ''}${input.search ? ` for "${input.search}"` : ''}`,
    'search-composables': `${searchVerb} composables${input.search ? ` for "${input.search}"` : ''}`,
    'search-documentation': `${searchVerb} documentation${input.section ? ` in ${input.section}` : ''}${input.search ? ` for "${input.search}"` : ''}`,
    'search-icons': `${searchVerb} icons${input.query ? ` for "${input.query}"` : ''}`,
    'get-component': `${readVerb} ${upperName(input.componentName || '')} component`,
    'get-component-metadata': `${readVerb} metadata for component ${upperName(input.componentName || '')}`,
    'list-templates': `${searchVerb} templates${input.category ? ` in ${input.category} category` : ''}`,
    'get-template': `${readVerb} template ${upperName(input.templateName || '')}`,
    'get-documentation-page': `${readVerb} ${input.path || ''} page`,
    'get-migration-guide': `${readVerb} migration guide${input.version ? ` for ${input.version}` : ''}`,
    'list-examples': `${searchVerb} examples`,
    'get-example': `${readVerb} ${upperName(input.exampleName || '')} example`,
    'getComponentTheme': `${readVerb} ${upperName(input.componentName || '')} theme`,
    'getThemeGuide': `${readVerb} theme guide`,
    'applyTheme': `${applyVerb} theme changes`,
    // the preset's own name, upperName is for camelCase component ids and
    // would render 'nuxt-ui' as 'NuxtUi'
    'applyPreset': `${applyVerb} ${presets.find(preset => preset.id === input.preset)?.name ?? input.preset} preset`,
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
    'getThemeGuide': studioIcons.themes,
    'applyTheme': studioIcons.themes,
    'applyPreset': studioIcons.themes,
    'resetTheme': studioIcons.reset
  }

  return iconMap[toolName] || appConfig.ui.icons.search
}

function askQuestion(question: string) {
  input.value = question
  onSubmit()
}

// The sidebar keeps its content mounted when closed (offcanvas), so the prompt's
// `autofocus` only fires once. Refocus it each time the sidebar reopens.
const promptRef = useTemplateRef('promptRef')
watch(open, (value) => {
  if (value) {
    nextTick(() => {
      promptRef.value?.textareaRef?.focus()
    })
  }
})

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
  if (status.value === 'streaming' || status.value === 'submitted') {
    stop()
  }
  messages.value = []
  chatMessages.value = []
  _themeApplied.clear()
}

defineShortcuts({
  meta_i: {
    handler: () => {
      if (searchOpen.value) {
        searchOpen.value = false
        open.value = true
      } else {
        open.value = !open.value
      }
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
      <ThemeStudioResetButton v-if="hasThemeChanges" />

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
      :props="{
        prose: {
          h1: { anchor: false },
          h2: { anchor: false },
          h3: { anchor: false },
          h4: { anchor: false }
        }
      }"
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
        v-if="chatMessages.length"
        should-auto-scroll
        :messages="chatMessages"
        :status="status"
        compact
        class="px-0 gap-2"
        :user="{ ui: { container: 'max-w-full' } }"
      >
        <template #indicator>
          <UChatTool icon="i-lucide-brain" text="Thinking..." streaming />
        </template>

        <template #content="{ message }">
          <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}`">
            <UChatReasoning
              v-if="isReasoningUIPart(part)"
              :text="part.text"
              :streaming="isPartStreaming(part)"
              icon="i-lucide-brain"
            >
              <ChatMarkdown
                :value="part.text"
                :streaming="isPartStreaming(part)"
              />
            </UChatReasoning>

            <template v-else-if="isTextUIPart(part) && part.text.length > 0">
              <ChatMarkdown
                v-if="message.role === 'assistant'"
                :value="part.text"
                :streaming="isPartStreaming(part)"
              />
              <p v-else-if="message.role === 'user'" class="whitespace-pre-wrap text-sm/6">
                {{ part.text }}
              </p>
            </template>

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
        ref="promptRef"
        v-model="input"
        :error="error"
        placeholder="Ask me anything..."
        variant="naked"
        size="sm"
        autofocus
        class="px-4"
        @submit="onSubmit"
      >
        <template #footer>
          <ULink to="https://vercel.com/ai-gateway" target="_blank" class="inline-flex items-center gap-1 text-xs text-dimmed hover:text-muted">
            Powered by <UIcon name="i-simple-icons-vercel" class="size-3" /> AI Gateway
          </ULink>

          <UChatPromptSubmit
            size="sm"
            :status="status"
            :disabled="!input.trim()"
            @stop="stop()"
            @reload="regenerate()"
          />
        </template>
      </UChatPrompt>
    </template>
  </USidebar>
</template>
