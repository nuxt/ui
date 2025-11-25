<script setup lang="ts">
const value = ref({
  type: 'doc',
  content: [{
    type: 'heading',
    attrs: { level: 2 },
    content: [{ type: 'text', text: 'Heading Block' }]
  }, {
    type: 'paragraph',
    content: [{ type: 'text', text: 'This is a paragraph.' }]
  }, {
    type: 'bulletList',
    content: [{
      type: 'listItem',
      content: [{
        type: 'paragraph',
        content: [{ type: 'text', text: 'List item' }]
      }]
    }]
  }]
})

const currentNode = ref<any>(null)
</script>

<template>
  <div>
    <div v-if="currentNode" class="mb-2 p-2 bg-[var(--ui-bg-elevated)] rounded-lg border border-[var(--ui-border)] text-sm">
      <span class="font-medium">Current node:</span> {{ currentNode.node.type }}
      <span class="ml-2 text-[var(--ui-text-muted)]">Position: {{ currentNode.pos }}</span>
    </div>

    <UEditor v-slot="{ editor }" v-model="value" content-type="markdown" placeholder="Start typing...">
      <UEditorDragHandle
        :editor="editor"
        @node-change="currentNode = $event"
      />
    </UEditor>
  </div>
</template>
