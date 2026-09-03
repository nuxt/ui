<script setup lang="ts">
import { isTextUIPart } from 'ai'
import type { UIMessage } from 'ai'
import { useChat } from '@ai-sdk/vue'
import { isPartStreaming } from '@nuxt/ui/utils/ai'
import { Markdown } from '@comark/vue'
import shiki from '@comark/vue/plugins/shiki'
import type { NavigationMenuItem } from '@nuxt/ui'

const appConfig = useAppConfig()
const studioIcons = useStudioIcons()

const input = ref('')

const initialMessages: UIMessage[] = [{
  id: '1',
  role: 'user',
  parts: [{ type: 'text', text: 'I want to build a dashboard with Nuxt UI. Where should I start?' }]
}, {
  id: '2',
  role: 'assistant',
  parts: [{ type: 'text', text: 'Great choice! Start with UDashboardGroup as the root layout, then add a UDashboardSidebar for navigation and a UDashboardPanel for each page. The sidebar is collapsible and resizable out of the box, so you get a polished shell before writing any custom code.' }]
}, {
  id: '3',
  role: 'user',
  parts: [{ type: 'text', text: 'Nice. And how do I make it match my brand colors?' }]
}, {
  id: '4',
  role: 'assistant',
  parts: [{ type: 'text', text: 'Define your palette once in @theme and map it to the primary and neutral aliases in app.config.ts. Every component reads from those semantic tokens, so buttons, badges, inputs and even this chat pick up your brand automatically, exactly what this preview is showing you right now.' }]
}]

const { messages, status, error, sendMessage, regenerate, stop, clearError } = useChat({
  messages: initialMessages
})

function onSubmit() {
  if (!input.value.trim()) {
    return
  }

  sendMessage({ text: input.value })

  input.value = ''
}

function newChat() {
  stop()
  clearError()
  messages.value = []
  input.value = ''
}

const menuItems: NavigationMenuItem[] = [
  { label: 'New chat', icon: appConfig.ui.icons.plus, onSelect: () => newChat() },
  { label: 'Search', icon: appConfig.ui.icons.search }
]

const historyItems: NavigationMenuItem[] = [
  { label: 'Today', type: 'label' },
  { label: 'Building a dashboard with Nuxt UI', active: true },
  { label: 'Theming buttons and badges' },
  { label: 'Yesterday', type: 'label' },
  { label: 'Form validation with UForm' },
  { label: 'Sidebar layout questions' },
  { label: 'Previous 7 days', type: 'label' },
  { label: 'Migrating an app to v4' },
  { label: 'Dark mode color tokens' },
  { label: 'Table sorting and pagination' }
]

const ui = {
  prose: {
    p: { base: 'my-2 leading-6' },
    li: { base: 'my-0.5 leading-6' },
    ul: { base: 'my-2' },
    ol: { base: 'my-2' },
    h1: { base: 'text-xl my-2' },
    h2: { base: 'text-lg my-2' },
    h3: { base: 'text-base my-2' },
    h4: { base: 'text-sm my-2' },
    pre: { root: 'my-2' },
    table: { root: 'my-2' },
    hr: { base: 'my-2' }
  }
}
</script>

<template>
  <div class="h-full flex bg-default overflow-hidden">
    <aside class="hidden md:flex w-56 shrink-0 flex-col gap-2 border-e border-default bg-elevated/25 p-3 min-h-0">
      <div class="flex items-center gap-1.5 px-1.5 py-1">
        <UIcon :name="studioIcons.messageCircle" class="size-5 text-primary shrink-0" />
        <span class="text-lg font-bold text-highlighted">Chat</span>
      </div>

      <UNavigationMenu :items="menuItems" orientation="vertical" />

      <div class="flex-1 min-h-0 overflow-y-auto">
        <UNavigationMenu :items="historyItems" orientation="vertical" :ui="{ link: 'overflow-hidden' }" />
      </div>

      <UButton
        label="Anna Cooper"
        :avatar="{ alt: 'Anna Cooper' }"
        :trailing-icon="studioIcons.sort"
        color="neutral"
        variant="ghost"
        class="w-full"
        :ui="{ trailingIcon: 'ms-auto text-dimmed' }"
      />
    </aside>

    <div class="flex-1 flex flex-col min-w-0 min-h-0">
      <div class="h-12 shrink-0 flex items-center justify-between gap-2 border-b border-default px-4">
        <p class="text-sm font-medium text-highlighted truncate">
          Building a dashboard with Nuxt UI
        </p>

        <div class="flex items-center gap-1">
          <UButton
            label="Private"
            :icon="studioIcons.lock"
            :trailing-icon="appConfig.ui.icons.chevronDown"
            color="neutral"
            variant="ghost"
            size="sm"
          />
          <UButton
            :icon="studioIcons.share"
            color="neutral"
            variant="ghost"
            size="sm"
            square
            aria-label="Share chat"
          />
        </div>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto">
        <UTheme :ui="ui">
          <UChatMessages
            :messages="messages"
            :status="status"
            should-auto-scroll
            class="p-4 sm:p-6"
          >
            <template #content="{ message }">
              <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}`">
                <template v-if="isTextUIPart(part)">
                  <Markdown
                    v-if="message.role === 'assistant'"
                    :value="part.text"
                    :streaming="isPartStreaming(part)"
                    :plugins="[shiki()]"
                    class="*:first:mt-0 *:last:mb-0"
                  />
                  <p v-else class="whitespace-pre-wrap leading-6">
                    {{ part.text }}
                  </p>
                </template>
              </template>
            </template>
          </UChatMessages>
        </UTheme>
      </div>

      <div class="shrink-0 px-4 pb-4 sm:px-6">
        <UChatPrompt
          v-model="input"
          :error="error"
          placeholder="Ask anything about Nuxt UI..."
          @submit="onSubmit"
        >
          <template #footer>
            <div class="flex items-center gap-1">
              <UButton
                :icon="studioIcons.paperclip"
                color="neutral"
                variant="ghost"
                size="sm"
                square
                aria-label="Attach file"
              />
              <UButton
                label="claude-haiku-4.5"
                :trailing-icon="appConfig.ui.icons.chevronDown"
                color="neutral"
                variant="ghost"
                size="sm"
              />
            </div>

            <UChatPromptSubmit
              :status="status"
              size="sm"
              @stop="stop()"
              @reload="regenerate()"
            />
          </template>
        </UChatPrompt>
      </div>
    </div>
  </div>
</template>
