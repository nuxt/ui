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
- The form is not submitted while the `status` prop is `submitted` or `streaming`, so pressing :kbd{value="enter"} during a response doesn't send a second message.
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

### Files :badge{label="Soon" class="align-text-top"}

Use the `v-model:files` directive to let users attach files. They can paste them in the textarea or drop them on the prompt, and each one shows above the textarea as a [ChatAttachment](/docs/components/chat-attachment) they can remove. The `#footer` slot receives an `open` function to pick files from a button.

::component-example
---
collapse: true
name: 'chat-prompt-files-example'
---
::

::tip
Use the `attachment` prop to customize the attachments, like `{ variant: 'thumbnail', size: 'xl' }`{lang="ts-type"} for image previews, or the `#files` slot to render them yourself.
::

::note
Use the `accept` prop to restrict the file types and set `multiple` to `false` to keep a single file. The form is submitted with files even when the textarea is empty. While a file is dragged over the prompt, its root has `data-dragging="true"`, which you can style with `data-[dragging=true]:`.
::

::tip
Use the `toFileUIParts` utility from `@nuxt/ui/utils/ai` to send the files as data URLs with the AI SDK, and the `#files` slot of [ChatMessages](/docs/components/chat-messages) to display them in the conversation.

```vue
<script setup lang="ts">
import { useChat } from '@ai-sdk/vue'
import { toFileUIParts } from '@nuxt/ui/utils/ai'

const input = ref('')
const files = ref<File[]>([])

const { messages, status, sendMessage } = useChat()

async function onSubmit() {
  const text = input.value
  const submitted = files.value

  input.value = ''
  files.value = []

  const parts = await toFileUIParts(submitted)
  sendMessage(text.trim() ? { text, files: parts } : { files: parts })
}
</script>

<template>
  <UChatMessages :messages="messages" :status="status">
    <template #files="{ parts }">
      <UChatAttachment
        v-for="(part, index) in parts"
        :key="index"
        :name="part.filename"
        :type="part.mediaType"
        :url="part.url"
      />
    </template>
  </UChatMessages>

  <UChatPrompt v-model="input" v-model:files="files" @submit="onSubmit">
    <UChatPromptSubmit :status="status" />
  </UChatPrompt>
</template>
```
::

### Queue :badge{label="Soon" class="align-text-top"}

Use the `v-model:queue` directive to queue the messages submitted while the chat is `submitted` or `streaming` instead of ignoring them. They show in a panel attached above the prompt, where the user can send one now, put it back in the prompt to edit it, or remove it. The `send` event is emitted when one is picked to be sent now, after it moved to the front of the queue.

::component-example
---
collapse: true
name: 'chat-prompt-queue-example'
---
::

::tip{to="/docs/components/chat#queued-messages"}
Sending the queued messages is up to you, check the **Chat** overview page for a recipe with the AI SDK.
::

## Examples

::tip{to="/docs/components/chat"}
Check the **Chat** overview page for installation instructions, server setup and usage examples.
::

### With an Editor :badge{label="4.10+" class="align-text-top"}

Compose the `#body` and `#footer` slots with `v-model:files` to build a rich prompt: file attachments, an [Editor](/docs/components/editor) with `@` mentions and `/` commands through [EditorMentionMenu](/docs/components/editor-mention-menu), and a mode selector.

::component-example
---
collapse: true
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

        <UChatPrompt v-model="input" :status="status" @submit="onSubmit">
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
| `open()`{lang="ts-type"} | `void`{lang="ts-type"} |

## Theme

:component-theme

## Changelog

:component-changelog
