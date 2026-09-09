<script setup lang="ts">
import { h, resolveComponent } from 'vue'
import type { Slots } from 'vue'
import { MarkdownDocument } from '@comark/vue'
import type { CodeDocument } from '../utils/code'

/**
 * A generated file in a fixed pane: its fence rendered through ProsePre like
 * every code block on the site, headerless and without the copy button, the
 * frame around it carries both.
 */
const props = defineProps<{
  doc: CodeDocument
  ui?: { root?: string, base?: string }
}>()

const ProsePre = resolveComponent('ProsePre')
const components = {
  pre: (attrs: Record<string, unknown>, { slots }: { slots: Slots }) => h(ProsePre, { ...attrs, copy: false, ui: props.ui }, slots)
}
</script>

<template>
  <MarkdownDocument :value="doc" :components="components" />
</template>
