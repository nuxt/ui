---
title: ChatPrompt
description: 'An enhanced Textarea for submitting prompts in AI chat interfaces.'
category: chat
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

::note{to="https://ai-sdk.dev/docs/getting-started/nuxt" target="_blank"}
These chat components are designed to be used with the **AI SDK v5** from **Vercel AI SDK**.
::

::callout{icon="i-simple-icons-github" to="https://github.com/nuxt-ui-templates/chat" target="_blank"}
Check out the source code of our **AI Chat template** on GitHub for a real-life example.
::

### Within a page

Use the ChatPrompt component with the `Chat` class from AI SDK v5 to display a chat prompt within a page.

Pass the `input` prop alongside the `error` prop to disable the textarea when an error occurs.

```vue [pages/\[id\\].vue] {2-4,7,11-15,19}
<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'
import { getTextFromMessage } from '@nuxt/ui/utils/ai'

const input = ref('')

const chat = new Chat({
  onError(error) {
    console.error('Chat error:', error)
  }
})

const handleSubmit = (e: Event) => {
  e.preventDefault()
  chat.sendMessage({ text: input.value })
  input.value = ''
}
</script>

<template>
  <UDashboardPanel>
    <template #body>
      <UContainer>
        <UChatMessages :messages="chat.messages" :status="chat.status">
          <template #content="{ message }">
            <MDC :value="getTextFromMessage(message)" :cache-key="message.id" unwrap="p" />
          </template>
        </UChatMessages>
      </UContainer>
    </template>

    <template #footer>
      <UContainer>
        <UChatPrompt v-model="input" :error="chat.error" @submit="handleSubmit">
          <UChatPromptSubmit :status="chat.status" @stop="chat.stop" @reload="chat.regenerate" />
        </UChatPrompt>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
```

You can also use it as a starting point for a chat interface.

```vue [pages/index.vue] {2,5,9-12}
<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'

const input = ref('')
const chat = new Chat()

async function onSubmit() {
  const userInput = input.value
  input.value = ''

  chat.sendMessage({ text: userInput })

  // Navigate to chat page after first message
  if (chat.messages.length === 1) {
    await navigateTo('/chat')
  }
}
</script>

<template>
  <UDashboardPanel>
    <template #body>
      <UContainer>
        <h1>How can I help you today?</h1>

        <UChatPrompt v-model="input" @submit="onSubmit">
          <UChatPromptSubmit :status="chat.status" />
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

## Changelog

:component-changelog
