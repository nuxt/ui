<script setup lang="ts">
import type { DefineComponent } from 'vue'
import { Chat } from '@ai-sdk/vue'
import type { UIMessage, UIToolInvocation } from 'ai'
import { DefaultChatTransport } from 'ai'
import { splitByCase, upperFirst } from 'scule'
import ProseStreamPre from '../prose/PreStream.vue'

const components = {
  pre: ProseStreamPre as unknown as DefineComponent
}

const messages = defineModel<UIMessage[]>('messages')
const fullscreen = defineModel<boolean>('fullscreen')

const emits = defineEmits<{
  close: []
}>()

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

function onClose(e: Event) {
  e.preventDefault()

  emits('close')
}

onMounted(() => {
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
</script>

<template>
  <UChatPalette>
    <UChatMessages
      should-auto-scroll
      :messages="chat.messages"
      :status="chat.status"
      :user="{ side: 'left', variant: 'naked', icon: 'i-lucide-user' }"
      :assistant="{ icon: 'i-lucide-bot' }"
    >
      <template #content="{ message }">
        <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}${'state' in part ? `-${part.state}` : ''}`">
          <MDCCached
            v-if="part.type === 'text' && message.role === 'assistant'"
            :value="part.text"
            :cache-key="`${message.id}-${index}`"
            :components="components"
            :parser-options="{ highlight: false }"
            class="[&_.my-5]:my-2.5 *:first:!mt-0 *:last:!mb-0 [&_.leading-7]:!leading-6"
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

    <template #prompt>
      <UChatPrompt
        v-model="input"
        icon="i-lucide-message-circle"
        variant="naked"
        :error="chat.error"
        :ui="{ trailing: 'items-center' }"
        @submit="onSubmit"
        @close="onClose"
      >
        <template #trailing>
          <UButton
            :icon="fullscreen ? 'i-lucide-maximize' : 'i-lucide-minimize'"
            color="neutral"
            variant="ghost"
            class="group"
            :ui="{ leadingIcon: 'text-dimmed group-hover:text-muted transition' }"
            @click="fullscreen = !fullscreen"
          />
        </template>
      </UChatPrompt>
    </template>
  </UChatPalette>
</template>
