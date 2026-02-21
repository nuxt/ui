<script setup lang="ts">
import type { DefineComponent } from 'vue'
import { Chat } from '@ai-sdk/vue'
import type { UIToolInvocation } from 'ai'
import { DefaultChatTransport } from 'ai'
import { splitByCase, upperFirst } from 'scule'
import ProseStreamPre from '../prose/PreStream.vue'

const components = {
  pre: ProseStreamPre as unknown as DefineComponent
}

const { open, messages } = useChat()

const input = ref('')

const toast = useToast()
const { track } = useAnalytics()

const chat = new Chat({
  messages: messages.value,
  transport: new DefaultChatTransport({
    api: '/api/search'
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
    messages.value = chat.messages
  }
})

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
    search_components_by_category: `${searchVerb} components${input.category ? ` in ${input.category} category` : ''}${input.search ? ` for "${input.search}"` : ''}`
  }[toolName] || `${searchVerb} ${toolName}`
}

const getCachedToolMessage = useMemoize((state: State, toolName: string, input: string) =>
  getToolMessage(state, toolName, JSON.parse(input))
)

function clearMessages() {
  messages.value = []
  chat.messages = []
}
</script>

<template>
  <USidebar
    v-model:open="open"
    side="right"
    collapsible="offcanvas"
    title="AI Assistant"
    description="Ask me anything about Nuxt UI"
    close
    close-icon="i-lucide-square-chevron-right"
    :ui="{ footer: 'sm:px-4', container: 'sticky' }"
    :style="{ '--sidebar-width': '20rem' }"
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
          should-auto-scroll
          :messages="chat.messages"
          :status="chat.status"
          compact
          class="px-0"
          :user="{ ui: { content: 'text-sm/6', container: 'pb-2.5' } }"
        >
          <template #content="{ message }">
            <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}${'state' in part ? `-${part.state}` : ''}`">
              <MDCCached
                v-if="part.type === 'text' && message.role === 'assistant'"
                :value="part.text"
                :cache-key="`${message.id}-${index}`"
                :components="components"
                :parser-options="{ highlight: false }"
                class="*:first:mt-0! *:last:mb-0!"
              />
              <p v-else-if="part.type === 'text' && message.role === 'user'" class="whitespace-pre-wrap">
                {{ part.text }}
              </p>

              <p v-else-if="part.type === 'dynamic-tool'" class="text-muted text-sm leading-6 my-1.5">
                {{ getCachedToolMessage(part.state, part.toolName, JSON.stringify(part.input || {})) }}
              </p>
            </template>
          </template>
        </UChatMessages>
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
