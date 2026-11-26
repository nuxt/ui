<script setup lang="ts">
import type { EditorView } from '@codemirror/view'
import { highlightWhitespace, keymap } from '@codemirror/view'

const value = ref('function greet(name: string) {\n  return `Hello ${name}`\n}\n')

const toast = useToast()

const extensions = [
  highlightWhitespace(),
  keymap.of([{
    key: 'Mod-s',
    run: (view: EditorView) => {
      toast.add({ title: 'Saved', description: `${view.state.doc.lines} lines saved.`, color: 'success' })
      return true
    }
  }])
]
</script>

<template>
  <UCodeEditor v-model="value" lang="ts" :extensions="extensions" class="w-full max-w-md" />
</template>
