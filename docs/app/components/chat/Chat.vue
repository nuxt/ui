<script setup lang="ts">
import type { ToolUIPart, DynamicToolUIPart } from 'ai'
import { DefaultChatTransport, isToolUIPart, isReasoningUIPart, isTextUIPart, getToolName } from 'ai'
import { useChat as useAIChat } from '@ai-sdk/vue'
import { getTextFromMessage, isPartStreaming, isToolStreaming } from '@nuxt/ui/utils/ai'
import type { DocsChatMessage, DocsChatTools } from '~~/server/api/ai.post'

const input = ref('')

const toast = useToast()
const { track } = useAnalytics()
const { open, messages, pending, currentPage } = useChat()
const { framework } = useFrameworks()
const { resetTheme, applyThemeSettings, hasChanges: hasThemeChanges } = useTheme()
// A preset is a whole ThemeDoc, so it rides applyDoc (reset, style axis, class
// bundle) rather than the settings channel applyTheme uses.
const { presets, applyPreset } = useThemeStudio()
// The theme actions the chat exposes are the studio's own, so they take the
// studio's glyphs and skin to the applied icon pack with it.
const studioIcons = useStudioIcons()
const appConfig = useAppConfig()

// app.vue mounts this panel on its first open, so `open` is already true here
// and the sidebar renders expanded, with no width change for its transition to
// pick up. Hold it closed for a paint (two frames, the way Vue's own
// Transition does it) so the first open slides in like every later one.
const painted = ref(false)
onMounted(() => requestAnimationFrame(() => requestAnimationFrame(() => (painted.value = true))))

const panelOpen = computed({
  get: () => painted.value && open.value,
  set: (value: boolean) => (open.value = value)
})

let _skipSync = false
const _themeApplied = new Set<string>()

// The conversation is restored from a past session with its tool calls in
// it. Those were applied back then and the theme they produced persists on
// its own, so they count as seen from the start: otherwise the next answer's
// stream would replay every one of them over whatever theme is on screen
// now, a shared link's for one.
for (const message of messages.value) {
  for (const part of message.parts || []) {
    if (isToolUIPart(part)) _themeApplied.add(part.toolCallId)
  }
}

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
    body: () => ({ framework: framework.value })
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
      icon: appConfig.ui.icons.error,
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

// Messages sent while a response streams wait here, the AI SDK would
// otherwise start a second request next to the current one. The page is
// captured on submit so a queued question keeps the page it was asked on.
const queue = ref<{ text: string, currentPage: string }[]>([])

function sendNext() {
  const next = queue.value.shift()
  if (!next) {
    return
  }

  track('AI Chat Message Sent')

  sendMessage({ text: next.text, metadata: { currentPage: next.currentPage } })
}

function onSubmit() {
  const text = input.value.trim()
  if (!text) {
    return
  }

  input.value = ''
  queue.value.push({ text, currentPage: currentPage.value })

  if (status.value !== 'submitted' && status.value !== 'streaming') {
    sendNext()
  }
}

// Wait a frame: the finished answer's Markdown renders again once it stops
// streaming, sending in the same tick would scroll to the new message before
// that layout lands and stop short of it.
watch(status, (value) => {
  if (value === 'ready') {
    requestAnimationFrame(() => {
      if (status.value === 'ready') {
        sendNext()
      }
    })
  }
})

// Moves a queued message to the front and stops the current response, the
// status watcher then sends it as soon as the chat is `ready`.
function sendNow(index: number) {
  queue.value.unshift(...queue.value.splice(index, 1))

  if (status.value === 'submitted' || status.value === 'streaming') {
    stop()
  } else {
    sendNext()
  }
}

// Puts a queued message back in the prompt, ahead of any draft.
function editQueued(index: number) {
  const [item] = queue.value.splice(index, 1)
  if (!item) {
    return
  }

  input.value = input.value ? `${item.text}\n${input.value}` : item.text
  promptRef.value?.textareaRef?.focus()
}

// Sync external messages (e.g. from search→chat flow) into the chat instance.
// When the last synced message is from the user, auto-regenerate the assistant response.
// _skipSync prevents loops when onFinish writes back to the shared messages ref.
watch(messages, (newMessages) => {
  if (_skipSync) return

  // A question asked from the search palette or "Explain this page" while a
  // response streams waits in the queue, syncing would restart the chat mid-answer
  const last = newMessages.at(-1)
  if (last?.role === 'user' && (status.value === 'submitted' || status.value === 'streaming')) {
    pending.value = false
    queue.value.push({ text: getTextFromMessage(last), currentPage: last.metadata?.currentPage ?? currentPage.value })
    return
  }

  chatMessages.value = newMessages
  if (chatMessages.value.at(-1)?.role === 'user') {
    pending.value = false
    regenerate()
  }
})

// A question asked before the panel existed (its first open, from the search
// palette or "Explain this page") is already in the seeded messages, the
// watcher above never saw it arrive. Only that one: a dangling user turn
// restored from a past session must not re-send itself on every load.
onMounted(() => {
  if (pending.value) {
    pending.value = false
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
    'get-migration-guide': `${readVerb} migration guide`,
    'list-examples': `${searchVerb} examples`,
    'get-example': `${readVerb} ${upperName(input.exampleName || '')} example`,
    'getComponentTheme': `${readVerb} ${upperName(input.componentName || '')} theme`,
    'getThemeGuide': `${readVerb} theme guide`,
    'searchFonts': `${searchVerb} fonts${input.category ? ` (${input.category})` : ''}${input.query ? ` for "${input.query}"` : ''}`,
    'applyTheme': `${applyVerb} theme changes`,
    // a preset carries its own display name; upperName is for camelCase
    // component ids and would mangle a hyphenated one
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
    'get-component': appConfig.ui.icons.file,
    'get-component-metadata': appConfig.ui.icons.file,
    'get-template': appConfig.ui.icons.file,
    'get-documentation-page': appConfig.ui.icons.file,
    'get-migration-guide': appConfig.ui.icons.file,
    'get-example': appConfig.ui.icons.file,
    'getComponentTheme': appConfig.ui.icons.file,
    'getThemeGuide': studioIcons.palette,
    'searchFonts': studioIcons.text,
    'applyTheme': studioIcons.palette,
    'applyPreset': studioIcons.palette,
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

// The queue floats over the end of the messages, they get its height as room
// at the bottom so the last one never hides behind it.
const queueRef = useTemplateRef('queueRef')
const queueHeight = ref(0)

function measureQueue() {
  queueHeight.value = queueRef.value?.offsetHeight ?? 0
}

useResizeObserver(queueRef, measureQueue)
// A resize observer reports a frame late. Sending a queued message removes a
// row in the same render that `UChatMessages` measures the room for it, so the
// height has to be up to date by then or the scroll lands short.
watch(() => queue.value.length, measureQueue, { flush: 'post' })

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
  queue.value = []
  _themeApplied.clear()
}
</script>

<template>
  <USidebar
    v-model:open="panelOpen"
    side="right"
    title="Ask"
    rail
    breakpoint="xl"
    :style="{ '--sidebar-width': '24rem', '--queue-height': `${queueHeight}px` }"
    :ui="{ body: 'pb-[calc(--spacing(4)+var(--queue-height))]', footer: 'relative p-0 overflow-visible', actions: 'gap-0.5' }"
    class="bg-default"
  >
    <template #actions>
      <!-- a plain full reset, not the studio's two-stage baseline reset: the
           chat's changes (component overrides included) may not map to any
           section, and "back to stock" is what this button always meant -->
      <UTooltip v-if="hasThemeChanges" text="Reset theme">
        <UButton
          :icon="studioIcons.reset"
          color="neutral"
          variant="ghost"
          aria-label="Reset theme"
          @click="resetTheme()"
        />
      </UTooltip>

      <UTooltip v-if="canClear" text="Clear messages">
        <UButton
          :icon="studioIcons.clear"
          color="neutral"
          variant="ghost"
          @click="clearMessages"
        />
      </UTooltip>
    </template>

    <template #close>
      <UTooltip text="Close" :kbds="['meta', 'i']">
        <UButton
          :icon="studioIcons.panelRightClose"
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
        :user="{ ui: { container: 'max-w-full', text: 'text-sm/6' } }"
        :ui="{ viewport: 'sticky top-auto bottom-[calc(--spacing(4)+var(--queue-height))] h-0' }"
      >
        <template #indicator>
          <UChatTool :icon="studioIcons.brain" text="Thinking..." streaming />
        </template>

        <template #part="{ part, message, streaming }">
          <UChatReasoning
            v-if="isReasoningUIPart(part)"
            :text="part.text"
            :streaming="isPartStreaming(part, streaming)"
            :icon="studioIcons.brain"
          >
            <ChatMarkdown
              :value="part.text"
              :streaming="isPartStreaming(part, streaming)"
            />
          </UChatReasoning>

          <ChatMarkdown
            v-else-if="isTextUIPart(part) && part.text.length > 0 && message.role === 'assistant'"
            :value="part.text"
            :streaming="isPartStreaming(part, streaming)"
          />

          <UChatTool
            v-else-if="isToolUIPart(part)"
            :text="getToolText(part)"
            :icon="getToolIcon(part)"
            :streaming="isToolStreaming(part, streaming)"
            :error="part.state === 'output-error'"
          />
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
      <div
        v-if="queue.length"
        ref="queueRef"
        class="absolute bottom-full inset-x-3 z-10 rounded-t-lg border border-b-0 border-default bg-default overflow-hidden"
      >
        <UCollapsible default-open class="bg-elevated/50 px-1 pb-1 flex flex-col">
          <UButton
            :label="`${queue.length} queued ${queue.length === 1 ? 'message' : 'messages'}`"
            :leading-icon="appConfig.ui.icons.chevronDown"
            color="neutral"
            variant="link"
            size="sm"
            square
            class="text-muted hover:text-default group w-full"
            :ui="{ leadingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200' }"
          />

          <template #content>
            <ul class="max-h-60 overflow-y-auto">
              <li v-for="(item, index) in queue" :key="index" class="group flex items-center gap-2 h-7 ps-2 pe-0.5 rounded-sm text-sm text-default hover:bg-elevated">
                <span class="size-3 shrink-0 rounded-full ring ring-accented" />
                <span class="truncate flex-1">{{ item.text }}</span>

                <div class="flex items-center opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 pointer-coarse:opacity-100">
                  <UTooltip text="Send now">
                    <UButton
                      :icon="appConfig.ui.icons.arrowUp"
                      color="neutral"
                      variant="link"
                      size="xs"
                      :aria-label="`Send ${item.text} now`"
                      @click="sendNow(index)"
                    />
                  </UTooltip>
                  <UTooltip text="Edit">
                    <UButton
                      :icon="studioIcons.pencil"
                      color="neutral"
                      variant="link"
                      size="xs"
                      :aria-label="`Edit ${item.text}`"
                      @click="editQueued(index)"
                    />
                  </UTooltip>
                  <UTooltip text="Remove">
                    <UButton
                      :icon="studioIcons.trash"
                      color="neutral"
                      variant="link"
                      size="xs"
                      :aria-label="`Remove ${item.text} from queue`"
                      @click="queue.splice(index, 1)"
                    />
                  </UTooltip>
                </div>
              </li>
            </ul>
          </template>
        </UCollapsible>
      </div>

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
