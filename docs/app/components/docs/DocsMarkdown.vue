<script setup lang="ts">
import { hash } from 'ohash'
import { MarkdownDocument } from '@comark/vue'
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

// Loaded on demand: the parser, the highlighter and its grammars stay out of
// every page's own chunks, the client only needs them once a value changes.
async function parse(value: string): Promise<MarkdownDoc> {
  try {
    const { parseMarkdownDoc } = await import('../../utils/markdown')
    return await parseMarkdownDoc(value)
  } catch (error) {
    console.warn('[markdown] could not parse', error)
    // the source as plain text, so a broken string never fails the page
    return { frontmatter: {}, meta: {}, nodes: [['p', {}, value]] } as unknown as MarkdownDoc
  }
}

function unwrapDoc(doc: MarkdownDoc | null | undefined) {
  if (!doc || !props.unwrap) {
    return doc ?? null
  }

  const tags = props.unwrap === true ? ['p'] : String(props.unwrap).split(' ')
  const nodes = doc.nodes.flatMap(node => (Array.isArray(node) && tags.includes(node[0] as string) ? node.slice(2) : [node]))

  return { ...doc, nodes } as MarkdownDoc
}

const doc = shallowRef<MarkdownDoc | null>(null)

// The server parses and the payload carries the result, keyed by the source
// so a description repeated down a table is stored once: hydrating a page
// would otherwise parse and highlight every block on it a second time.
if (typeof props.value === 'string' && props.value) {
  const source = props.value
  const { data } = await useAsyncData(`docs-markdown-${hash(source)}`, () => parse(source), { deep: false })
  doc.value = unwrapDoc(data.value)
} else {
  doc.value = unwrapDoc(props.value as MarkdownDoc | undefined)
}

// the last change wins: a parse for a value that has moved on is dropped
let version = 0
async function update() {
  const current = ++version
  const value = props.value
  const next = unwrapDoc(typeof value === 'string' ? (value ? await parse(value) : null) : value)
  if (current === version) {
    doc.value = next
  }
}

watch(() => [props.value, props.unwrap], update)
</script>

<template>
  <MarkdownDocument v-if="doc" :value="doc" />
</template>
