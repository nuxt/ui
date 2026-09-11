<script setup lang="ts">
import type { UIMessage } from 'ai'
import { useChat } from '@ai-sdk/vue'
import theme from '#build/ui/sidebar'

const pg = usePg()

const variants = Object.keys(theme.variants.variant)

const input = ref('')
const openLeft = ref(false)
const openRight = ref(true)

const variant = ref('sidebar' as keyof typeof theme.variants.variant)

const initialMessages: UIMessage[] = [{
  id: '1',
  role: 'user',
  parts: [{ type: 'text', text: 'What is Nuxt UI?' }]
}, {
  id: '2',
  role: 'assistant',
  parts: [{ type: 'text', text: 'Nuxt UI is a Vue component library built on Reka UI, Tailwind CSS, and Tailwind Variants. It provides 125+ accessible components for building modern web apps.' }]
}]

const { messages, status, error, sendMessage, regenerate, stop } = useChat({
  messages: initialMessages,
  onError(error) {
    console.error(error)
  }
})

function onSubmit() {
  if (!input.value.trim()) return

  sendMessage({ text: input.value })

  input.value = ''
}
</script>

<template>
  <div :class="[pg.flex_flex_1, variant === 'inset' && pg.bg_neutral_50_dark_bg_neutral_950]">
    <USidebar
      v-model:open="openLeft"
      side="left"
      :variant="variant"
      collapsible="icon"
      close
      rail
      :ui="{ container: pg.relative, body: pg.py_2 }"
    >
      <template #title="{ state }">
        <Logo :class="pg.h_5_w_auto" :collapsed="state === 'collapsed'" />
      </template>

      <UNavigationMenu
        :items="[{ label: 'Home', icon: 'i-lucide-home', to: '/', badge: 4 }, { label: 'Chat', icon: 'i-lucide-message-circle', to: '/chat' }]"
        orientation="vertical"
        :ui="{ link: pg.p_1_5_overflow_hidden }"
      />
    </USidebar>

    <div :class="pg.flex_1_flex_flex_col_overflow_hidden_lg_peer_data_variant_floating_my_4_peer_data_variant_">
      <Navbar :class="pg.relative_w_full">
        <USelect v-model="variant" :items="variants" />

        <UButton
          icon="i-lucide-panel-left"
          color="neutral"
          variant="soft"
          size="sm"
          aria-label="Toggle left sidebar"
          @click="openLeft = !openLeft"
        />
        <UButton
          icon="i-lucide-panel-right"
          color="neutral"
          variant="soft"
          size="sm"
          aria-label="Toggle right sidebar"
          @click="openRight = !openRight"
        />
      </Navbar>

      <div :class="pg.flex_1_p_4_sm_px_6">
        <USkeleton :class="pg.size_full_animate_pulse" />
      </div>
    </div>

    <USidebar
      v-model:open="openRight"
      side="right"
      :variant="variant"
      title="AI Chat"
      close
      rail
      :style="{ '--sidebar-width': '20rem' }"
    >
      <UChatMessages
        :messages="messages"
        :status="status"
        compact
        :class="pg.px_0"
      />

      <template #footer>
        <UChatPrompt
          v-model="input"
          :error="error"
          variant="subtle"
          size="sm"
          @submit="onSubmit"
        >
          <UChatPromptSubmit size="sm" :status="status" @stop="stop()" @reload="regenerate()" />
        </UChatPrompt>
      </template>
    </USidebar>
  </div>
</template>
