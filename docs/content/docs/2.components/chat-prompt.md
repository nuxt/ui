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
icon: 'i-simple-icons-anthropic'
modelValue: 'claude-opus-4.6'
items:
  - label: 'Claude Opus 4.6'
    value: 'claude-opus-4.6'
    icon: 'i-simple-icons-anthropic'
  - label: 'Gemini 3 Pro'
    value: 'gemini-3-pro'
    icon: 'i-simple-icons-googlegemini'
  - label: 'GPT-5'
    value: 'gpt-5'
    icon: 'i-simple-icons-openai'
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

::tip{to="/docs/components/chat"}
Check the **Chat** overview page for installation instructions, server setup and usage examples.
::

### As a starting point

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
