<script setup lang="ts">
import type { UIMessage } from 'ai'
import { Chat } from '@ai-sdk/vue'
import theme from '#build/ui/sidebar'

const variants = Object.keys(theme.variants.variant)

const input = ref('')
const openLeft = ref(false)
const openRight = ref(true)
const variant = ref('sidebar' as const)

const messages: UIMessage[] = [{
  id: '1',
  role: 'user',
  parts: [{ type: 'text', text: 'What is Nuxt UI?' }]
}, {
  id: '2',
  role: 'assistant',
  parts: [{ type: 'text', text: 'Nuxt UI is a Vue component library built on Reka UI, Tailwind CSS, and Tailwind Variants. It provides 125+ accessible components for building modern web apps.' }]
}]

const chat = new Chat({
  messages,
  onError() {}
})

function onSubmit() {
  chat.sendMessage({ text: input.value })
  input.value = ''
}
</script>

<template>
  <div class="flex flex-1">
    <USidebar v-model:open="openLeft" side="left" :variant="variant" collapsible="icon" :ui="{ container: 'relative' }">
      <UNavigationMenu
        :items="[{ label: 'Home', icon: 'i-lucide-home', to: '/' }, { label: 'Chat', icon: 'i-lucide-message-circle', to: '/chat' }]"
        orientation="vertical"
        :ui="{ link: 'p-1.5' }"
      />
    </USidebar>

    <div class="flex-1 flex flex-col overflow-hidden lg:peer-data-[variant=inset]:my-2 lg:peer-data-[variant=floating]:my-2 lg:peer-data-[variant=inset]:ms-0 lg:peer-data-[variant=inset]:rounded-xl lg:peer-data-[variant=inset]:shadow-sm lg:peer-data-[variant=inset]:ring lg:peer-data-[variant=inset]:ring-default">
      <Navbar class="relative w-full">
        <USelect v-model="variant" :items="variants" />

        <UButton
          icon="i-lucide-panel-left"
          color="neutral"
          variant="soft"
          size="sm"
          @click="openLeft = !openLeft"
        />
        <UButton
          icon="i-lucide-panel-right"
          color="neutral"
          variant="soft"
          size="sm"
          @click="openRight = !openRight"
        />
      </Navbar>

      <div class="flex-1 p-6">
        <USkeleton class="size-full animate-pulse" />
      </div>
    </div>

    <USidebar
      v-model:open="openRight"
      side="right"
      collapsible="offcanvas"
      :variant="variant"
      title="AI Chat"
      close
      :style="{ '--sidebar-width': '20rem' }"
    >
      <template #body>
        <UChatMessages
          :messages="chat.messages"
          :status="chat.status"
          compact
          class="px-0"
        />
      </template>

      <template #footer>
        <UChatPrompt
          v-model="input"
          :error="chat.error"
          variant="subtle"
          size="sm"
          :ui="{ base: 'px-0' }"
          @submit="onSubmit"
        >
          <UChatPromptSubmit size="sm" :status="chat.status" @stop="chat.stop()" @reload="chat.regenerate()" />
        </UChatPrompt>
      </template>
    </USidebar>
  </div>
</template>
