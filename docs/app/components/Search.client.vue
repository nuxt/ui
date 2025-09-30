<script setup lang="ts">
import type { DefineComponent } from 'vue'
import { Chat } from '@ai-sdk/vue'
import type { UIMessage } from 'ai'
import { DefaultChatTransport } from 'ai'
import { getTextFromMessage } from '@nuxt/ui/utils/ai'
import type { ContentNavigationItem } from '@nuxt/content'

import ProseStreamPre from './prose/PreStream.vue'

const components = {
  pre: ProseStreamPre as unknown as DefineComponent
}

interface ContentSearchFile {
  id: string
  title: string
  titles: string[]
  level: number
  content: string
}

defineProps<{
  files?: ContentSearchFile[]
  navigation?: ContentNavigationItem[]
}>()

const searchTerm = ref('')

const ai = ref(false)
const input = ref('')
const messages: UIMessage[] = []

const chat = new Chat({
  messages,
  transport: new DefaultChatTransport({
    api: '/api/search'
  }),
  onError: (error) => {
    console.error('onError', error)
  }
})

const { frameworks } = useFrameworks()
const { links } = useSearch()

const groups = computed(() => [{
  id: 'framework',
  label: 'Framework',
  items: frameworks.value
}, {
  id: 'ia',
  ignoreFilter: true,
  items: [{
    label: searchTerm.value ? `Ask AI for “${searchTerm.value}”` : 'Ask AI',
    icon: 'i-lucide-bot',
    onSelect: (e: any) => {
      e.preventDefault()

      ai.value = true

      if (searchTerm.value) {
        messages.push({
          id: '1',
          role: 'user',
          parts: [{ type: 'text', text: searchTerm.value }]
        })

        chat.regenerate()
      }
    }
  }]
}])

function handleSubmit(event: Event) {
  event.preventDefault()

  if (!input.value.trim()) {
    return
  }

  chat.sendMessage({
    text: input.value
  })
  input.value = ''
}

function handleClose(event: Event) {
  event.preventDefault()

  ai.value = false
}
</script>

<template>
  <ClientOnly>
    <LazyUContentSearch
      v-model:search-term="searchTerm"
      :links="links"
      :files="files"
      :groups="groups"
      :navigation="navigation"
      :fuse="{ resultLimit: 100 }"
    >
      <template v-if="ai" #content>
        <UChatPalette>
          <UChatMessages
            should-auto-scroll
            :messages="chat.messages"
            :status="chat.status"
            :user="{ icon: 'i-lucide-user' }"
            :assistant="{ icon: 'i-lucide-bot' }"
          >
            <template #content="{ message }">
              <div class="space-y-2">
                <MDCCached
                  :value="getTextFromMessage(message)"
                  :cache-key="message.id"
                  unwrap="p"
                  :components="components"
                  :parser-options="{ highlight: false }"
                />
                <template v-for="(part, index) in message.parts" :key="`${part.type}-${index}-${message.id}`">
                  <div
                    v-if="part.type === 'dynamic-tool'"
                    :key="`${part.type}-${part.state}`"
                    class="text-sm text-muted flex items-center gap-1 bg-muted/50 rounded-md p-2 border border-muted/20"
                  >
                    <UIcon
                      v-if="part.state === 'output-available'"
                      name="i-lucide-circle-check"
                      class="text-success"
                    />
                    <UIcon
                      v-else
                      name="i-lucide-loader-circle"
                      class="text-muted animate-spin"
                    />
                    Tool call{{ part.state === 'output-available' ? ' successful' : ' in progress' }}
                    <ProseCode class="text-xs">
                      {{ part.toolName }}
                    </ProseCode>
                  </div>
                </template>
              </div>
            </template>
          </UChatMessages>

          <template #prompt>
            <UChatPrompt
              v-model="input"
              icon="i-lucide-search"
              variant="naked"
              :error="chat.error"
              @submit="handleSubmit"
              @close="handleClose"
            />
          </template>
        </UChatPalette>
      </template>
    </LazyUContentSearch>
  </ClientOnly>
</template>
