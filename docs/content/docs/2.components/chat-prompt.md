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

::component-example
---
collapse: true
name: 'chat-prompt-example'
---
::

::note
The ChatPrompt handles the following events:

- The form is submitted when the user presses :kbd{value="enter"} or when the user clicks on the submit button. Set the `submit-on-enter` prop to `false` to submit with :kbd{value="ctrl"} + :kbd{value="enter"} (or :kbd{value="cmd"} + :kbd{value="enter"} on macOS) instead, allowing :kbd{value="enter"} to insert a newline.
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

### With an Editor :badge{label="Soon" class="align-text-top"}

Compose the `#header`, `#body` and `#footer` slots to build a rich prompt: file attachments, an [Editor](/docs/components/editor) with `@` mentions and `/` commands through [EditorMentionMenu](/docs/components/editor-mention-menu), and a mode selector.

::component-example
---
name: 'chat-prompt-editor-example'
class: 'justify-center'
---
::

::note
The `#body` slot replaces the internal textarea and exposes `submit` and `close` handlers, so you can wire the editor's keyboard shortcuts to the form. When a mention menu is open, pressing :kbd{value="enter"} selects the highlighted item instead of submitting.
::

### As home page

You can also use it in your chat interface home page.

```vue [pages/index.vue] {2,4,8-15,24,26}
<script setup lang="ts">
import { useChat } from '@ai-sdk/vue'

const input = ref('')

const { messages, status, sendMessage } = useChat()

async function onSubmit() {
  sendMessage({ text: input.value })

  // Navigate to chat page after first message
  if (messages.value.length === 1) {
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
          <UChatPromptSubmit :status="status" />
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
