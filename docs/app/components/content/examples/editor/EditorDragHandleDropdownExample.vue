<script setup lang="ts">
import type { EditorContent, DropdownMenuItem } from '@nuxt/ui'

const content = ref<EditorContent>({
  type: 'doc',
  content: [{
    type: 'paragraph',
    content: [{ type: 'text', text: 'Hover over the left side to see both drag handle and menu button.' }]
  }, {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Click the menu to see block actions.' }]
  }, {
    type: 'paragraph',
    content: [{ type: 'text', text: 'Try duplicating or deleting a block.' }]
  }]
})

const selectedNode = ref<any>(null)

const getMenuItems = (editor: any): DropdownMenuItem[][] => {
  if (!selectedNode.value) return []

  return [[{
    label: 'Duplicate',
    icon: 'i-lucide-copy',
    onSelect: () => {
      const { pos } = selectedNode.value
      const node = editor.state.doc.nodeAt(pos)
      if (node) {
        editor.chain().focus().insertContentAt(pos + node.nodeSize, node.toJSON()).run()
      }
    }
  }], [{
    label: 'Delete',
    icon: 'i-lucide-trash',
    onSelect: () => {
      const { pos } = selectedNode.value
      const node = editor.state.doc.nodeAt(pos)
      if (node) {
        editor.chain().focus().deleteRange({ from: pos, to: pos + node.nodeSize }).run()
      }
    }
  }]]
}
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="content" content-type="markdown" placeholder="Start typing...">
    <UEditorDragHandle
      v-slot="{ ui, onClick }"
      :editor="editor"
      @node-change="selectedNode = $event"
    >
      <UButton
        icon="i-lucide-grip-vertical"
        color="neutral"
        variant="ghost"
        size="sm"
        :class="ui.handle()"
      />

      <UDropdownMenu
        :items="getMenuItems(editor)"
        :content="{ side: 'right' }"
        :ui="{ content: 'w-48' }"
      >
        <UButton
          icon="i-lucide-more-vertical"
          color="neutral"
          variant="ghost"
          size="sm"
          :class="ui.handle()"
        />
      </UDropdownMenu>
    </UEditorDragHandle>
  </UEditor>
</template>
