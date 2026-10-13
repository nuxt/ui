<script setup lang="ts">
import { Extension } from '@tiptap/core'
import type { EditorMentionMenuItem, SelectItem } from '@nuxt/ui'

const input = ref('')
const mode = ref('auto')
const attachments = ref<{ name: string, src?: string }[]>([])
const fileInputRef = useTemplateRef('fileInputRef')

const files: EditorMentionMenuItem[] = [
  { label: 'app.vue', icon: 'i-vscode-icons-file-type-vue' },
  { label: 'nuxt.config.ts', icon: 'i-vscode-icons-file-type-nuxt' },
  { label: 'package.json', icon: 'i-vscode-icons-file-type-json' },
  { label: 'README.md', icon: 'i-vscode-icons-file-type-markdown' },
  { label: 'AuthForm.vue', icon: 'i-vscode-icons-file-type-vue' },
  { label: 'useChat.ts', icon: 'i-vscode-icons-file-type-typescript' }
]

const commands: EditorMentionMenuItem[] = [
  { label: 'init', icon: 'i-lucide-sparkles' },
  { label: 'review', icon: 'i-lucide-search-code' },
  { label: 'security-review', icon: 'i-lucide-shield-check' },
  { label: 'clear', icon: 'i-lucide-eraser' },
  { label: 'compact', icon: 'i-lucide-fold-vertical' },
  { label: 'config', icon: 'i-lucide-settings' }
]

const modes = [
  { label: 'Manual', value: 'manual', icon: 'i-lucide-hand' },
  { label: 'Edit automatically', value: 'edit', icon: 'i-lucide-code-xml' },
  { label: 'Plan mode', value: 'plan', icon: 'i-lucide-list-checks' },
  { label: 'Auto mode', value: 'auto', icon: 'i-lucide-zap' }
] satisfies SelectItem[]

// SSR-safe target so the menus aren't clipped by overflow
const appendToBody = import.meta.client ? () => document.body : undefined

function onFilesChange(event: Event) {
  const target = event.target as HTMLInputElement
  for (const file of Array.from(target.files ?? [])) {
    attachments.value.push({
      name: file.name,
      src: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    })
  }
  target.value = ''
}

function onSubmit() {
  console.log('submit', input.value)

  input.value = ''
  attachments.value = []
}
</script>

<template>
  <UChatPrompt
    v-model="input"
    class="w-full p-0 gap-0"
    placeholder="Press / to open the command menu"
    :ui="{
      header: 'px-2.5 py-2 border-b border-default',
      footer: 'px-2.5 py-2 border-t border-default'
    }"
    @submit="onSubmit"
  >
    <template v-if="attachments.length" #header>
      <UButton
        v-for="(file, index) in attachments"
        :key="index"
        :label="file.name"
        :avatar="file.src ? { src: file.src } : undefined"
        :icon="file.src ? undefined : 'i-lucide-file'"
        color="neutral"
        variant="soft"
        size="xs"
        square
        trailing-icon="i-lucide-x"
        @click="attachments.splice(index, 1)"
      />
    </template>

    <template #body="{ submit, placeholder }">
      <UEditor
        v-slot="{ editor }"
        v-model="input"
        content-type="markdown"
        :starter-kit="false"
        :placeholder="placeholder"
        class="w-full min-h-12"
        :ui="{ base: 'p-2.5! [&_.mention]:bg-primary/5 [&_.mention]:rounded-sm [&_.mention]:px-0.5 [&_.mention]:py-0.25' }"
        :extensions="[Extension.create({
          name: 'chatPromptSubmit',
          priority: 1000,
          addKeyboardShortcuts: () => ({ Enter: () => (submit(), true) })
        })]"
      >
        <UEditorMentionMenu :editor="editor" char="@" plugin-key="mention" :items="files" :append-to="appendToBody" />
        <UEditorMentionMenu :editor="editor" char="/" plugin-key="command" :items="commands" :append-to="appendToBody" />
      </UEditor>
    </template>

    <template #footer>
      <div class="flex items-center gap-0.5">
        <UButton
          icon="i-lucide-plus"
          color="neutral"
          variant="ghost"
          aria-label="Attach files"
          size="sm"
          @click="fileInputRef?.click()"
        />
        <input ref="fileInputRef" type="file" multiple class="hidden" @change="onFilesChange">
      </div>

      <div class="flex items-center gap-1">
        <USelect
          v-model="mode"
          :items="modes"
          :icon="modes.find(item => item.value === mode)?.icon"
          color="neutral"
          variant="ghost"
          size="sm"
          square
        />

        <UChatPromptSubmit size="sm" :disabled="!input.trim()" />
      </div>
    </template>
  </UChatPrompt>
</template>
