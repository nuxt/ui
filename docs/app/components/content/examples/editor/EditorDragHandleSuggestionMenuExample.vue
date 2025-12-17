<script setup lang="ts">
import type { EditorSuggestionMenuItem } from '@nuxt/ui'

const value = ref(`Click the plus button to open the suggestion menu and add new blocks.

The button appears when hovering over blocks.`)

const suggestionItems: EditorSuggestionMenuItem[][] = [[{
  kind: 'heading',
  level: 1,
  label: 'Heading 1',
  icon: 'i-lucide-heading-1'
}, {
  kind: 'heading',
  level: 2,
  label: 'Heading 2',
  icon: 'i-lucide-heading-2'
}, {
  kind: 'bulletList',
  label: 'Bullet List',
  icon: 'i-lucide-list'
}, {
  kind: 'blockquote',
  label: 'Blockquote',
  icon: 'i-lucide-text-quote'
}]]
</script>

<template>
  <UEditor
    v-slot="{ editor, handlers }"
    v-model="value"
    content-type="markdown"
    class="w-full min-h-35"
    :ui="{ base: 'p-8 sm:px-16' }"
  >
    <UEditorDragHandle v-slot="{ ui, onClick }" :editor="editor">
      <UButton
        icon="i-lucide-plus"
        color="neutral"
        variant="ghost"
        size="sm"
        :class="ui.handle()"
        @click="(e) => {
          e.stopPropagation()

          const selected = onClick()
          handlers.suggestion?.execute(editor, { pos: selected?.pos }).run()
        }"
      />

      <UButton
        icon="i-lucide-grip-vertical"
        color="neutral"
        variant="ghost"
        size="sm"
        :class="ui.handle()"
      />
    </UEditorDragHandle>

    <UEditorSuggestionMenu :editor="editor" :items="suggestionItems" />
  </UEditor>
</template>
