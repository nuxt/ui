<script setup lang="ts">
import type { EditorToolbarItem } from '@nuxt/ui'
import TextAlign from '@tiptap/extension-text-align'

const value = ref('Use the dropdown menus to select heading levels or text alignment.')

const toolbarItems: EditorToolbarItem[][] = [[{
  icon: 'i-lucide-heading',
  items: [{
    kind: 'paragraph',
    label: 'Paragraph',
    icon: 'i-lucide-type'
  }, {
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
    kind: 'heading',
    level: 3,
    label: 'Heading 3',
    icon: 'i-lucide-heading-3'
  }]
}, {
  icon: 'i-lucide-align-left',
  items: [{
    kind: 'textAlign',
    align: 'left',
    label: 'Align Left',
    icon: 'i-lucide-align-left'
  }, {
    kind: 'textAlign',
    align: 'center',
    label: 'Align Center',
    icon: 'i-lucide-align-center'
  }, {
    kind: 'textAlign',
    align: 'right',
    label: 'Align Right',
    icon: 'i-lucide-align-right'
  }]
}]]
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="value" content-type="markdown" :extensions="[TextAlign.configure({ types: ['heading', 'paragraph'] })]" placeholder="Start typing...">
    <UEditorToolbar :editor="editor" :items="toolbarItems" class="mb-2" />
  </UEditor>
</template>
