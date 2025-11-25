<script setup lang="ts">
const value = ref({
  type: 'doc',
  content: [{
    type: 'paragraph',
    content: [{ type: 'text', text: 'Click the plus button to add a new paragraph below the current block.' }]
  }, {
    type: 'paragraph',
    content: [{ type: 'text', text: 'The button appears when hovering over blocks.' }]
  }]
})
</script>

<template>
  <UEditor v-slot="{ editor }" v-model="value" content-type="markdown" placeholder="Start typing...">
    <UEditorDragHandle
      v-slot="{ ui, onClick }"
      :editor="editor"
    >
      <UButton
        icon="i-lucide-plus"
        color="primary"
        variant="ghost"
        size="sm"
        :class="ui.handle()"
        @click="(e) => {
          const node = onClick(e)
          if (node) {
            editor.chain().focus().insertContentAt(node.pos + 1, { type: 'paragraph' }).run()
          }
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
  </UEditor>
</template>
