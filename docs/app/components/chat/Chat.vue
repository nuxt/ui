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
  resetTheme,
  hasCSSChanges,
  hasAppConfigChanges
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
  const savedExtras: Record<string, any> = JSON.parse(localStorage.getItem('nuxt-ui-ai-theme') || '{}')

  for (const color of colorKeys) {
    if (settings[color]) {
      (appConfig.ui.colors as any)[color] = settings[color]
      savedExtras.colors = savedExtras.colors || {}
      savedExtras.colors[color] = settings[color]
    }
  }

  if (settings.ui) {
    savedExtras.ui = savedExtras.ui || {}
    for (const [key, value] of Object.entries(settings.ui)) {
      if (key === 'colors' || key === 'icons') continue
      ;(appConfig.ui as any)[key] = value
      savedExtras.ui[key] = value
    }
  }

  localStorage.setItem('nuxt-ui-ai-theme', JSON.stringify(savedExtras))

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

function getToolText(part: any) {
  const toolName = part.type === 'dynamic-tool' ? part.toolName : part.type.replace('tool-', '')
  return getCachedToolMessage(part.state, toolName, JSON.stringify(part.input || {}))
}

function isToolPart(part: any): boolean {
  return part.type.startsWith('tool-') || part.type === 'dynamic-tool'
}

function isToolLoading(part: any): boolean {
  return !('state' in part && part.state === 'output-available')
}

function getToolIcon(part: any): string {
  const toolName = part.type === 'dynamic-tool' ? part.toolName : part.type.replace('tool-', '')

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

  const appConfig = useAppConfig()
  const aiTheme = localStorage.getItem('nuxt-ui-ai-theme')
  if (aiTheme) {
    try {
      const extras = JSON.parse(aiTheme)
      if (extras.colors) {
        const defaultColors: Record<string, string> = { secondary: 'blue', success: 'green', info: 'blue', warning: 'yellow', error: 'red' }
        for (const key of Object.keys(extras.colors)) {
          (appConfig.ui.colors as any)[key] = defaultColors[key] || (appConfig.ui.colors as any)[key]
        }
      }
      if (extras.ui) {
        for (const key of Object.keys(extras.ui)) {
          ;(appConfig.ui as any)[key] = undefined
        }
      }
    } catch {
      // ignore malformed localStorage
    }
  }

  localStorage.removeItem('nuxt-ui-custom-colors')
  localStorage.removeItem('nuxt-ui-ai-theme')
  document.getElementById('chat-custom-colors')?.remove()
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
  >
    <template #actions>
      <UTooltip text="Clear history & reset theme">
        <UButton
          icon="i-lucide-square-x"
          color="neutral"
          variant="ghost"
          size="sm"
          :disabled="!chat.messages.length && !hasCSSChanges && !hasAppConfigChanges"
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
              v-if="message.role === 'assistant' && hasReasoning(message)"
              icon="i-lucide-brain"
              chevron="leading"
              :text="getReasoningText(message)"
              :is-streaming="isReasoningStreaming(message)"
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
                v-else-if="isToolPart(part)"
                :text="getToolText(part)"
                :icon="getToolIcon(part)"
                :loading="isToolLoading(part)"
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
        size="sm"
        :autoresize="open"
        :ui="{ base: 'px-0' }"
        @submit="onSubmit"
      >
        <UChatPromptSubmit
          size="sm"
          :status="chat.status"
          :disabled="!input.trim()"
          @stop="chat.stop()"
          @reload="chat.regenerate()"
        />
      </UChatPrompt>
    </template>
  </USidebar>
</template>
