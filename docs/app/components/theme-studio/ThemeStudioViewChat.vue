<script setup lang="ts">
import type { UIMessage } from 'ai'
import type { NavigationMenuItem } from '@nuxt/ui'

const input = ref('')

const menuItems: NavigationMenuItem[] = [
  { label: 'New chat', icon: 'i-lucide-circle-plus' },
  { label: 'Search', icon: 'i-lucide-search' }
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

const messages: UIMessage[] = [{
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
  parts: [{ type: 'text', text: 'Define your palette once in @theme and map it to the primary and neutral aliases in app.config.ts. Every component reads from those semantic tokens, so buttons, badges, inputs and even this chat pick up your brand automatically — exactly what this preview is showing you right now.' }]
}, {
  id: '5',
  role: 'user',
  parts: [{ type: 'text', text: 'Perfect, that saves me a ton of CSS. Ship it!' }]
}]
</script>

<template>
  <div class="h-full flex bg-default overflow-hidden">
    <aside class="hidden md:flex w-56 shrink-0 flex-col gap-2 border-e border-default bg-elevated/25 p-3 min-h-0">
      <div class="flex items-center gap-1.5 px-1.5 py-1">
        <UIcon name="i-lucide-message-circle" class="size-5 text-primary shrink-0" />
        <span class="text-lg font-bold text-highlighted">Chat</span>
      </div>

      <UNavigationMenu :items="menuItems" orientation="vertical" />

      <div class="flex-1 min-h-0 overflow-y-auto">
        <UNavigationMenu :items="historyItems" orientation="vertical" :ui="{ link: 'overflow-hidden' }" />
      </div>

      <UButton
        label="Anna Cooper"
        :avatar="{ alt: 'Anna Cooper' }"
        trailing-icon="i-lucide-chevrons-up-down"
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
            icon="i-lucide-lock"
            trailing-icon="i-lucide-chevron-down"
            color="neutral"
            variant="ghost"
            size="sm"
          />
          <UButton
            icon="i-lucide-share"
            color="neutral"
            variant="ghost"
            size="sm"
            square
            aria-label="Share chat"
          />
        </div>
      </div>

      <div class="flex-1 min-h-0 overflow-y-auto">
        <UChatMessages
          :messages="messages"
          status="ready"
          :should-scroll-to-bottom="false"
          :auto-scroll="false"
          class="p-4 sm:p-6"
        />
      </div>

      <div class="shrink-0 px-4 pb-4 sm:px-6">
        <UChatPrompt v-model="input" placeholder="Ask anything about Nuxt UI...">
          <template #footer>
            <div class="flex items-center gap-1">
              <UButton
                icon="i-lucide-paperclip"
                color="neutral"
                variant="ghost"
                size="sm"
                square
                aria-label="Attach file"
              />
              <UButton
                label="gpt-4o"
                trailing-icon="i-lucide-chevron-down"
                color="neutral"
                variant="ghost"
                size="sm"
              />
            </div>

            <UChatPromptSubmit status="ready" size="sm" />
          </template>
        </UChatPrompt>
      </div>
    </div>
  </div>
</template>
