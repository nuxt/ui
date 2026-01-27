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

::tip{to="/docs/components/chat-messages#examples"}
Check the **ChatMessages** documentation for server API setup and installation instructions.
::

### Within a page

Use the ChatPrompt component with the `Chat` class from AI SDK v5 to display a chat prompt within a page.

Pass the `input` prop alongside the `error` prop to disable the textarea when an error occurs.

```vue [pages/\[id\\].vue] {2,5,13-17,34,36}
<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'

const input = ref('')

const chat = new Chat({
  onError(error) {
    console.error(error)
  }
})

function onSubmit() {
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
            <template v-for="(part, index) in message.parts" :key="`${message.id}-${part.type}-${index}`">
              <MDC v-if="part.type === 'text' && message.role === 'assistant'" :value="part.text" :cache-key="`${message.id}-${index}`" class="*:first:mt-0 *:last:mb-0" />
              <p v-else-if="part.type === 'text' && message.role === 'user'" class="whitespace-pre-wrap">{{ part.text }}</p>
            </template>
          </template>
        </UChatMessages>
      </UContainer>
    </template>

    <template #footer>
      <UContainer class="pb-4 sm:pb-6">
        <UChatPrompt v-model="input" :error="chat.error" @submit="onSubmit">
          <UChatPromptSubmit :status="chat.status" @stop="chat.stop()" @reload="chat.regenerate()" />
        </UChatPrompt>
      </UContainer>
    </template>
  </UDashboardPanel>
</template>
```

You can also use it as a starting point for a chat interface.

```vue [pages/index.vue] {2,4,8-15,24,26}
<script setup lang="ts">
import { Chat } from '@ai-sdk/vue'

const input = ref('')

const chat = new Chat()

async function onSubmit() {
  chat.sendMessage({ text: input.value })

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

::callout{icon="i-simple-icons-mdnwebdocs" to="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/textarea#attributes" target="_blank"}
This component also supports all native `<textarea>` HTML attributes.
::

### Slots

:component-slots

### Emits

:component-emits

### Expose

When accessing the component via a template ref, you can use the following:

| Name | Type |
| ---- | ---- |
| `textareaRef`{lang="ts-type"} | `Ref<HTMLTextAreaElement \| null>`{lang="ts-type"} |

## Theme

:component-theme

## Changelog

:component-changelog
