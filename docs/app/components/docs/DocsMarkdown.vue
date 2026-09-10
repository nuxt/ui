<script setup lang="ts">
import { MarkdownDocument } from '@comark/vue'
import { parseMarkdown } from '../../utils/markdown'
import type { MarkdownDoc } from '../../utils/markdown'

/**
 * Markdown rendered at runtime, through the parser the whole site shares:
 * Comark's own component builds one per instance, and a props table mounts a
 * hundred of these. It resolves the same prose components the content
 * pipeline does.
 */
const props = defineProps<{
  /** Markdown to parse, or a document already parsed (the release notes). */
  value?: string | MarkdownDoc
  /** Drop the block the parser wraps a single line in, `p` unless named. */
  unwrap?: boolean | string
}>()

async function resolve(value: string | MarkdownDoc | undefined) {
  if (!value) {
    return null
  }

  const doc = typeof value === 'string' ? await parseMarkdown(value) : value
  if (!props.unwrap) {
    return doc
  }

  const tags = props.unwrap === true ? ['p'] : String(props.unwrap).split(' ')
  const nodes = doc.nodes.flatMap(node => (Array.isArray(node) && tags.includes(node[0] as string) ? node.slice(2) : [node]))

  return { ...doc, nodes } as MarkdownDoc
}

// awaited so the server renders it; the watch covers a value that changes after
const doc = shallowRef<MarkdownDoc | null>(await resolve(props.value))

watch(() => props.value, async (value) => {
  doc.value = await resolve(value)
})
</script>

<template>
  <MarkdownDocument v-if="doc" :value="doc" />
</template>
