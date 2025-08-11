---
title: ChatPrompt
description: 'An enhanced Textarea for submitting prompts in AI chat interfaces.'
category: ai
links:
  - label: Textarea
    to: /docs/components/textarea
    icon: i-simple-icons-nuxtdotjs
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/ChatPrompt.vue
---

## Usage

The ChatPrompt component renders a `<form>` element and extends the [Textarea](/docs/components/textarea) component so you can pass any property such as `icon`, `placeholder`, `autofocus`, etc.

::code-preview

:::u-chat-prompt
---
variant: 'subtle'
---

#default
::::u-chat-prompt-submit
---
color: 'neutral'
class: 'rounded-full'
---
::::

#footer
::::u-select
---
placeholder: 'Select a model'
variant: 'ghost'
icon: 'i-simple-icons-openai'
modelValue: 'gpt-4o'
items:
  - label: 'Gemini 2.5 Pro'
    value: 'gemini-2.5-pro'
    icon: 'i-simple-icons-googlegemini'
  - label: 'GPT-4o'
    value: 'gpt-4o'
    icon: 'i-simple-icons-openai'
  - label: 'Claude 3.5 Sonnet'
    value: 'claude-3.5-sonnet'
    icon: 'i-simple-icons-anthropic'
  - label: 'Llama 4'
    value: 'llama-4'
    icon: 'i-simple-icons-ollama'
---
::::

:::

::

::note
The ChatPrompt handles the following events:

- The form is submitted when the user presses :kbd{value="enter"} or when the user clicks on the submit button.
- The textarea is blurred when :kbd{value="escape"} is pressed and emits a `close` event.
::

### Variant

Use the `variant` prop to change the style of the prompt. Defaults to `outline`.

::component-code
---
hide:
  - autofocus
props:
  variant: 'soft'
  autofocus: false
---
::

## Examples

::note{to="https://sdk.vercel.ai/docs/getting-started/nuxt" target="_blank"}
These chat components are designed to be used with the `useChat` composable from **Vercel AI SDK**.
::

::callout{icon="i-simple-icons-github" to="https://github.com/nuxt-ui-pro/chat" target="_blank"}
Check out the source code of our **AI Chat template** on GitHub for a real-life example.
::

### Within a page

Use the ChatPrompt component with the `useChat` composable to display a chat prompt within a page.

Pass the `input` prop alongside the `error` prop to disable the textarea when an error occurs.

```vue [pages/\[id\\].vue] {4,21,23}
<script setup lang="ts">
import { useChat } from '@ai-sdk/vue'

const { messages, input, handleSubmit, reload, stop, status, error } = useChat()
</script>

<template>
  <UDashboardPanel>
    <template #body>
      <UContainer>
        <UChatMessages :messages="messages" :status="status">
          <template #content="{ message }">
            <MDC :value="message.content" :cache-key="message.id" unwrap="p" />
          </template>
        </UChatMessages>
      </UContainer>
    </template>

    <template #footer>
      <UContainer>
        <UChatPrompt v-model="input" :error="error" @submit="handleSubmit">
          <UChatPromptSubmit :status="status" @stop="stop" @reload="reload" />
        </UChatPrompt>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
```

You can also use it as a starting point for a chat interface.

```vue [pages/index.vue]{23,25}
<script setup lang="ts">
const input = ref('')
const loading = ref(false)

async function onSubmit() {
  loading.value = true

  const chat = await $fetch('/api/chats', {
    method: 'POST',
    body: { input }
  })

  navigateTo(`/chat/${chat.id}`)
}
</script>

<template>
  <UDashboardPanel>
    <template #body>
      <UContainer>
        <h1>How can I help you today?</h1>

        <UChatPrompt v-model="input" :status="loading ? 'streaming' : 'ready'" @submit="onSubmit">
          <UChatPromptSubmit />
        </UChatPrompt>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
```

## API

### Props

:component-props

### Slots

:component-slots

### Emits

:component-emits

## Theme

:component-theme
