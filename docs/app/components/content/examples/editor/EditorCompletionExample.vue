<script setup lang="ts">
import type { EditorCustomHandlers, EditorToolbarItem } from '@nuxt/ui'
import { useEditorCompletion } from './EditorUseCompletion'

const editorRef = useTemplateRef('editorRef')

const value = ref(`# AI Completion

This editor demonstrates how to add AI-powered features using the [Vercel AI SDK](https://ai-sdk.dev/). It includes ghost text autocompletion that appears as you type (press Tab to accept) and text transformation actions.

Try selecting some text and using the AI dropdown to fix grammar, extend, or simplify it.`)

const { extension: completionExtension, handlers: aiHandlers, isLoading: aiLoading } = useEditorCompletion(editorRef)

const customHandlers = {
  ...aiHandlers
} satisfies EditorCustomHandlers

const items = computed(() => [[{
  icon: 'i-lucide-sparkles',
  label: 'Improve',
  variant: 'soft',
  loading: aiLoading.value,
  content: {
    align: 'start'
  },
  items: [{
    kind: 'aiFix',
    icon: 'i-lucide-spell-check',
    label: 'Fix spelling & grammar'
  }, {
    kind: 'aiExtend',
    icon: 'i-lucide-unfold-vertical',
    label: 'Extend text'
  }, {
    kind: 'aiReduce',
    icon: 'i-lucide-fold-vertical',
    label: 'Reduce text'
  }, {
    kind: 'aiSimplify',
    icon: 'i-lucide-lightbulb',
    label: 'Simplify text'
  }, {
    kind: 'aiContinue',
    icon: 'i-lucide-text',
    label: 'Continue sentence'
  }, {
    kind: 'aiSummarize',
    icon: 'i-lucide-list',
    label: 'Summarize'
  }, {
    icon: 'i-lucide-languages',
    label: 'Translate',
    children: [{
      kind: 'aiTranslate',
      language: 'English',
      label: 'English'
    }, {
      kind: 'aiTranslate',
      language: 'French',
      label: 'French'
    }, {
      kind: 'aiTranslate',
      language: 'Spanish',
      label: 'Spanish'
    }, {
      kind: 'aiTranslate',
      language: 'German',
      label: 'German'
    }]
  }]
}], [{
  icon: 'i-lucide-heading',
  content: {
    align: 'start'
  },
  items: [{
    kind: 'heading',
    level: 1,
    icon: 'i-lucide-heading-1',
    label: 'Heading 1'
  }, {
    kind: 'heading',
    level: 2,
    icon: 'i-lucide-heading-2',
    label: 'Heading 2'
  }, {
    kind: 'heading',
    level: 3,
    icon: 'i-lucide-heading-3',
    label: 'Heading 3'
  }]
}], [{
  kind: 'mark',
  mark: 'bold',
  icon: 'i-lucide-bold'
}, {
  kind: 'mark',
  mark: 'italic',
  icon: 'i-lucide-italic'
}, {
  kind: 'mark',
  mark: 'underline',
  icon: 'i-lucide-underline'
}]] satisfies EditorToolbarItem<typeof customHandlers>[][])
</script>

<template>
  <UEditor
    ref="editorRef"
    v-slot="{ editor }"
    v-model="value"
    :extensions="[completionExtension]"
    :handlers="customHandlers"
    content-type="markdown"
    :ui="{ base: 'p-8 sm:px-16' }"
    class="w-full min-h-74"
  >
    <UEditorToolbar :editor="editor" :items="items" class="border-b border-muted py-2 px-8 sm:px-16 overflow-x-auto" />
  </UEditor>
</template>
