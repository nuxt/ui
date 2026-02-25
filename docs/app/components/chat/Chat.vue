<script setup lang="ts">
import type { DefineComponent } from 'vue'
import { Chat } from '@ai-sdk/vue'
import type { UIToolInvocation } from 'ai'
import { DefaultChatTransport } from 'ai'
import { splitByCase, upperFirst } from 'scule'
import * as theme from '#build/ui'
import ProseStreamPre from '../prose/PreStream.vue'

const components = {
  pre: ProseStreamPre as unknown as DefineComponent
}

const { open, messages } = useChat()

const input = ref('')

const toast = useToast()
const { track } = useAnalytics()
const {
  primary,
  neutral,
  radius,
  font,
  setBlackAsPrimary,
  resetTheme
} = useTheme()

const _themeApplied = new Set<string>()
function processThemeToolCalls() {
  for (const message of chat.messages) {
    if (message.role !== 'assistant') continue

    for (const part of message.parts || []) {
      const p = part as any
      if (p.toolCallId && !_themeApplied.has(p.toolCallId)) {
        if (p.type === 'tool-applyTheme' && p.input) {
          _themeApplied.add(p.toolCallId)
          applyThemeSettings(p.input)
        } else if (p.type === 'tool-resetTheme') {
          _themeApplied.add(p.toolCallId)
          resetTheme()
          localStorage.removeItem('nuxt-ui-custom-colors')
          document.getElementById('chat-custom-colors')?.remove()
        }
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

function injectCustomColors(customColors: Record<string, Record<string, string>>) {
  const existing: Record<string, Record<string, string>> = JSON.parse(localStorage.getItem('nuxt-ui-custom-colors') || '{}')
  const merged = { ...existing, ...customColors }
  localStorage.setItem('nuxt-ui-custom-colors', JSON.stringify(merged))

  let styleEl = document.getElementById('chat-custom-colors') as HTMLStyleElement | null
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'chat-custom-colors'
    document.head.appendChild(styleEl)
  }

  const vars = Object.entries(merged).flatMap(([name, shades]) =>
    Object.entries(shades).map(([shade, hex]) => `--color-${name}-${shade}: ${hex};`)
  )

  styleEl.textContent = `:root { ${vars.join(' ')} }`
}

function applyThemeSettings(settings: Record<string, any>) {
  if (settings.customColors && typeof settings.customColors === 'object') {
    injectCustomColors(settings.customColors)
  }

  if (settings.primary) primary.value = settings.primary
  if (settings.neutral) neutral.value = settings.neutral
  if (settings.radius !== undefined) radius.value = settings.radius
  if (settings.font) font.value = settings.font
  if (settings.blackAsPrimary !== undefined) setBlackAsPrimary(settings.blackAsPrimary)

  const appConfig = useAppConfig()
  const colorKeys = ['secondary', 'success', 'info', 'warning', 'error'] as const
  for (const color of colorKeys) {
    if (settings[color]) {
      (appConfig.ui.colors as any)[color] = settings[color]
    }
  }

  if (settings.ui) {
    for (const [key, value] of Object.entries(settings.ui)) {
      if (key === 'colors' || key === 'icons') continue
      ;(appConfig.ui as any)[key] = value
    }
  }

  track('AI Theme Applied')
}

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

function upperName(name: string) {
  return splitByCase(name).map(p => upperFirst(p)).join('')
}

type State = UIToolInvocation<any>['state']

function getToolMessage(state: State, toolName: string, input: any) {
  const searchVerb = state === 'output-available' ? 'Searched' : 'Searching'
  const readVerb = state === 'output-available' ? 'Read' : 'Reading'
  const applyVerb = state === 'output-available' ? 'Applied' : 'Applying'

  return {
    list_components: `${searchVerb} components`,
    list_composables: `${searchVerb} composables`,
    get_component: `${readVerb} ${upperName(input.componentName)} component`,
    get_component_metadata: `${readVerb} metadata for component ${upperName(input.componentName)}`,
    list_templates: `${searchVerb} templates${input.category ? ` in ${input.category} category` : ''}`,
    get_template: `${readVerb} template ${upperName(input.templateName)}`,
    get_documentation_page: `${readVerb} ${input.path || ''} page`,
    list_documentation_pages: `${searchVerb} documentation pages`,
    list_getting_started_guides: `${searchVerb} documentation guides`,
    get_migration_guide: `${readVerb} migration guide${input.version ? ` for ${input.version}` : ''}`,
    list_examples: `${searchVerb} examples`,
    get_example: `${readVerb} ${upperName(input.exampleName)} example`,
    search_components_by_category: `${searchVerb} components${input.category ? ` in ${input.category} category` : ''}${input.search ? ` for "${input.search}"` : ''}`,
    getComponentTheme: `${readVerb} ${upperName(input.componentName || '')} theme`,
    applyTheme: `${applyVerb} theme changes`,
    resetTheme: `${state === 'output-available' ? 'Reset' : 'Resetting'} theme to defaults`
  }[toolName] || `${searchVerb} ${toolName}`
}

const getCachedToolMessage = useMemoize((state: State, toolName: string, input: string) =>
  getToolMessage(state, toolName, JSON.parse(input))
)

function getToolDisplayText(part: any) {
  const toolName = part.type === 'dynamic-tool' ? part.toolName : part.type.replace('tool-', '')
  return getCachedToolMessage(part.state, toolName, JSON.stringify(part.input || {}))
}

function getReasoningText(message: any): string {
  return (message.parts || [])
    .filter((p: any) => p.type === 'reasoning')
    .map((p: any) => p.text)
    .join('\n\n')
}

function isReasoningStreaming(message: any): boolean {
  if (message.id !== chat.messages.at(-1)?.id || chat.status !== 'streaming') return false
  const lastPart = message.parts?.at(-1)
  return lastPart?.type === 'reasoning'
}

function hasReasoning(message: any): boolean {
  return (message.parts || []).some((p: any) => p.type === 'reasoning')
}

function askQuestion(question: string) {
  input.value = question
  onSubmit()
}

const suggestions = [
  {
    category: 'Components',
    items: [
      'How do I use the Modal component?',
      'Show me Button variants and sizes',
      'How to create a form with validation?'
    ]
  },
  {
    category: 'Theme',
    items: [
      'Change the primary color to indigo',
      'Make the theme more rounded with Inter font',
      'Create a monochrome black & white theme'
    ]
  }
]

function clearMessages() {
  messages.value = []
  chat.messages = []
  _themeApplied.clear()

  localStorage.removeItem('nuxt-ui-custom-colors')
  document.getElementById('chat-custom-colors')?.remove()
}
</script>

<template>
  <USidebar
    v-model:open="open"
    side="right"
    collapsible="offcanvas"
    title="AI Assistant"
    close
    close-icon="i-lucide-square-chevron-right"
    :ui="{ footer: 'sm:px-4' }"
    :style="{ '--sidebar-width': '24rem' }"
  >
    <template #actions>
      <UButton icon="i-lucide-trash" color="neutral" variant="ghost" @click="clearMessages" />
    </template>

    <template #body>
      <UTheme
        :ui="{
          prose: {
            p: { base: 'my-2.5 text-sm/6' },
            li: { base: 'my-0.5 text-sm/6' },
            ul: { base: 'my-2.5' },
            ol: { base: 'my-2.5' },
            h1: { base: 'text-xl mb-4' },
            h2: { base: 'text-lg mt-6 mb-3' },
            h3: { base: 'text-base mt-4 mb-2' },
            h4: { base: 'text-sm mt-3 mb-1.5' },
            code: { base: 'text-xs' },
            pre: { root: 'my-2.5', base: 'text-xs/5' },
            table: { root: 'my-2.5' },
            hr: { base: 'my-5' }
          }
        }"
      >
        <UChatMessages
          v-if="chat.messages.length"
          should-auto-scroll
          :messages="chat.messages"
          :status="chat.status"
          compact
          class="px-0"
          :user="{ ui: { content: 'text-sm/6', container: 'pb-2.5' } }"
        >
          <template #content="{ message }">
            <ChatReasoning
              v-if="message.role === 'assistant' && hasReasoning(message)"
              :text="getReasoningText(message)"
              :is-streaming="isReasoningStreaming(message)"
            />

            <ChatMessageParts :message="message">
              <template #text="{ part, index, message: msg }">
                <MDCCached
                  v-if="msg.role === 'assistant'"
                  :value="part.text"
                  :cache-key="`${msg.id}-${index}`"
                  :components="components"
                  :parser-options="{ highlight: false }"
                  class="*:first:mt-0! *:last:mb-0!"
                />
                <p v-else class="whitespace-pre-wrap">
                  {{ part.text }}
                </p>
              </template>
              <!-- <template #tool="{ part, loading }">
                <p class="text-muted text-sm leading-6 my-1.5">
                  <span v-if="!loading">{{ getToolDisplayText(part) }}</span>
                  <ChatShimmer v-else :text="getToolDisplayText(part)" />
                </p>
              </template> -->
            </ChatMessageParts>
          </template>
        </UChatMessages>

        <div v-else class="flex flex-col gap-5">
          <div v-for="category in suggestions" :key="category.category" data-slot="suggestion-group" class="flex flex-col gap-1.5">
            <p class="text-xs font-medium uppercase tracking-wide text-dimmed">
              {{ category.category }}
            </p>

            <div class="flex flex-col -mx-2.5">
              <UButton
                v-for="question in category.items"
                :key="question"
                :label="question"
                color="neutral"
                variant="ghost"
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
        size="sm"
        :autoresize="open"
        :ui="{ base: 'px-0' }"
        @submit="onSubmit"
      >
        <UChatPromptSubmit
          color="neutral"
          size="sm"
          :status="chat.status"
          @stop="chat.stop()"
          @reload="chat.regenerate()"
        />
      </UChatPrompt>
    </template>
  </USidebar>
</template>
