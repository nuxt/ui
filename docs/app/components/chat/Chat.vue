<script setup lang="ts">
import type { DefineComponent } from 'vue'
import { Chat } from '@ai-sdk/vue'
import type { ToolUIPart, DynamicToolUIPart } from 'ai'
import { DefaultChatTransport, isToolUIPart, getToolName } from 'ai'
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

const _themeApplied = new Set<string>()
function processThemeToolCalls() {
  for (const message of chat.messages) {
    if (message.role !== 'assistant') continue

    for (const part of message.parts || []) {
      const p = part as any
      if (!p.toolCallId || _themeApplied.has(p.toolCallId)) continue
      if (p.state !== 'output-available' && p.state !== 'input-available') continue

      if (p.type === 'tool-applyTheme' && p.input) {
        _themeApplied.add(p.toolCallId)
        applyThemeSettings(p.input)
      } else if (p.type === 'tool-resetTheme') {
        _themeApplied.add(p.toolCallId)
        resetTheme()
      }
    }
  }
}

const chat = new Chat({
  messages: messages.value,
  transport: new DefaultChatTransport({
    api: '/api/search',
    body: { theme }
  }),
  onError: (error) => {
    const { message } = typeof error.message === 'string' && error.message[0] === '{' ? JSON.parse(error.message) : error

    toast.add({
      description: message,
      icon: 'i-lucide-alert-circle',
      color: 'error',
      duration: 0
    })
  },
  onFinish: () => {
    processThemeToolCalls()
    messages.value = chat.messages
  }
})

watchEffect(() => {
  if (chat.status === 'streaming' && chat.messages.length) {
    processThemeToolCalls()
  }
})

const canClear = computed(() => messages.value.length > 0 || hasCSSChanges.value || hasAppConfigChanges.value)

function onSubmit() {
  if (!input.value.trim()) {
    return
  }

  track('AI Chat Message Sent')

  chat.sendMessage({ text: input.value })

  input.value = ''
}

watch(messages, (newMessages) => {
  if (newMessages === chat.messages) return

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
    list_components: `${searchVerb} components`,
    list_composables: `${searchVerb} composables`,
    get_component: `${readVerb} ${upperName(input.componentName || '')} component`,
    get_component_metadata: `${readVerb} metadata for component ${upperName(input.componentName || '')}`,
    list_templates: `${searchVerb} templates${input.category ? ` in ${input.category} category` : ''}`,
    get_template: `${readVerb} template ${upperName(input.templateName || '')}`,
    get_documentation_page: `${readVerb} ${input.path || ''} page`,
    list_documentation_pages: `${searchVerb} documentation pages`,
    list_getting_started_guides: `${searchVerb} documentation guides`,
    get_migration_guide: `${readVerb} migration guide${input.version ? ` for ${input.version}` : ''}`,
    list_examples: `${searchVerb} examples`,
    get_example: `${readVerb} ${upperName(input.exampleName || '')} example`,
    search_components_by_category: `${searchVerb} components${input.category ? ` in ${input.category} category` : ''}${input.search ? ` for "${input.search}"` : ''}`,
    getComponentTheme: `${readVerb} ${upperName(input.componentName || '')} theme`,
    applyTheme: `${applyVerb} theme changes`,
    resetTheme: `${state === 'output-available' ? 'Reset' : 'Resetting'} theme to defaults`
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
    get_component: 'i-lucide-file-text',
    get_component_metadata: 'i-lucide-file-text',
    get_template: 'i-lucide-file-text',
    get_documentation_page: 'i-lucide-file-text',
    get_migration_guide: 'i-lucide-file-text',
    get_example: 'i-lucide-file-text',
    getComponentTheme: 'i-lucide-file-text',
    applyTheme: 'i-lucide-palette',
    resetTheme: 'i-lucide-palette'
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
      'How to create a form with validation?',
      'How to build a table with pagination?',
      'How to build a dashboard layout?'
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
      'Design a sakura-inspired theme with a custom color palette',
      'Create a monochrome black & white theme with rounded corners',
      'Change all colors, the font, the radius and customize a few components'
    ]
  }
]

function clearMessages() {
  messages.value = []
  chat.messages = []
  _themeApplied.clear()

  resetTheme()
}

defineShortcuts({
  meta_i: () => open.value = !open.value
})
</script>

<template>
  <USidebar
    v-model:open="open"
    side="right"
    collapsible="offcanvas"
    title="AI Assistant"
    :close="{ size: 'sm' }"
    close-icon="i-lucide-square-chevron-right"
    :style="{ '--sidebar-width': '24rem' }"
    :ui="{ footer: 'p-0', actions: 'gap-0' }"
  >
    <template #actions>
      <UTooltip text="Clear history & reset theme">
        <UButton
          icon="i-lucide-square-x"
          color="neutral"
          variant="ghost"
          size="sm"
          :disabled="!canClear"
          @click="clearMessages"
        />
      </UTooltip>
    </template>

    <template #body>
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
          :user="{ ui: { container: 'pb-0' } }"
          :assistant="{ ui: { content: 'flex flex-col gap-2' } }"
        >
          <template #content="{ message }">
            <ChatReasoning
              v-if="message.role === 'assistant'"
              :message="message"
              :streaming="chat.status === 'streaming' && message.id === chat.messages.at(-1)?.id"
              icon="i-lucide-brain"
              chevron="leading"
            />

            <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}${'state' in part ? `-${(part as any).state}` : ''}`">
              <MDCCached
                v-if="part.type === 'text'"
                :value="part.text"
                :cache-key="`${message.id}-${index}`"
                :components="components"
                :parser-options="{ highlight: false }"
                class="*:first:mt-0! *:last:mb-0!"
              />
              <ChatTool
                v-else-if="isToolUIPart(part)"
                :part="part"
                :text="getToolText(part)"
                :icon="getToolIcon(part)"
              />
            </template>
          </template>
        </UChatMessages>

        <div v-else class="flex flex-col gap-2.5">
          <div v-for="category in suggestions" :key="category.category" class="flex flex-col gap-1.5">
            <p class="text-xs font-semibold uppercase tracking-wide text-dimmed">
              {{ category.category }}
            </p>

            <div class="flex flex-col -mx-2.5">
              <UButton
                v-for="question in category.items"
                :key="question"
                :label="question"
                color="neutral"
                variant="link"
                class="font-normal"
                @click="askQuestion(question)"
              />
            </div>
          </div>
        </div>
      </UTheme>
    </template>

    <template #footer>
      <UChatPrompt
        v-model="input"
        :error="chat.error"
        placeholder="Ask me anything..."
        :autoresize="open"
        variant="naked"
        :ui="{ base: 'px-0' }"
        class="px-4"
        @submit="onSubmit"
      >
        <template #footer>
          <p class="text-xs text-muted flex items-center gap-1">
            Press <UKbd value="meta" size="sm" /> <UKbd value="i" size="sm" /> to toggle the chat
          </p>

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
