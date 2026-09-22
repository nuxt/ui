import { describe, it, expect } from 'vitest'
import type { Component } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { UIcon } from '#components'
import { namespaceOf, transform } from '../../scripts/data-slot.mjs'

declare global {
  interface ImportMeta {
    glob: <T>(pattern: string | string[], options?: { eager?: boolean, import?: string, query?: string }) => Record<string, T>
  }
}

/**
 * Guards the convention documented in
 * `.github/contributing/component-structure.md#data-slot-on-the-root`:
 * a caller-supplied `data-slot` always wins on the component's root element
 * (the component's own name is only a fallback), and it must
 * not leak onto inner elements.
 *
 * Every component is mounted with `data-slot="probe"` and the probe must
 * appear exactly once, on the outermost rendered element.
 *
 * Only top-level components are covered — `content/`, `prose/` and
 * `color-mode/` components require module-specific context.
 */

// Components with no probe-able root by default, with the reason they are skipped.
const skip: Record<string, string> = {
  App: 'provider wrapper, renders slot content only',
  Theme: 'renderless, renders slot content only',
  OverlayProvider: 'renderless overlay host',
  Modal: 'closed overlay, renders nothing by default',
  Popover: 'closed overlay, renders nothing by default',
  Slideover: 'closed overlay, renders nothing by default',
  Drawer: 'closed overlay, renders nothing by default',
  Tooltip: 'closed overlay, requires TooltipProvider',
  ContextMenu: 'closed overlay, renders nothing by default',
  ContextMenuContent: 'internal, requires ContextMenu context',
  DropdownMenu: 'closed overlay, renders nothing by default',
  DropdownMenuContent: 'internal, requires DropdownMenu context',
  Toast: 'requires ToastProvider context',
  Toaster: 'teleported toast provider',
  DashboardSearch: 'closed modal, renders nothing by default',
  EditorEmojiMenu: 'renderless, requires editor context',
  EditorMentionMenu: 'renderless, requires editor context',
  EditorSuggestionMenu: 'renderless, requires editor context',
  EditorToolbar: '`$attrs` lands on a conditional outer element, never passed a `data-slot`'
}

// Minimal props for components that cannot render bare.
const options: Record<string, { props?: any, slots?: any }> = {
  ChatReasoning: { props: { text: 'Reasoning' } },
  ChatShimmer: { props: { text: 'Loading' } },
  Form: { props: { state: {} } },
  Icon: { props: { name: 'i-lucide-check' } }
}

// `Icon` is imported through `#components` so each test environment resolves
// its own implementation (the Vue override does not depend on `@nuxt/icon`).
const modules = import.meta.glob<Component>(['../../src/runtime/components/*.vue', '!../../src/runtime/components/Icon.vue'], { eager: true, import: 'default' })

const sources = import.meta.glob<string>('../../src/runtime/components/**/*.vue', { eager: true, query: '?raw', import: 'default' })

const namespaces: Record<string, string> = {}
for (const [path, source] of Object.entries(sources)) {
  const namespace = namespaceOf(source)
  if (namespace && /^\.\.\/\.\.\/src\/runtime\/components\/[^/]+\.vue$/.test(path)) {
    namespaces[path.split('/').pop()!.replace('.vue', '')] = namespace
  }
}

const entries = [...Object.entries(modules).map(([path, component]) => [path.split('/').pop()!.replace('.vue', ''), component] as const), ['Icon', UIcon] as const]
  .filter(([name]) => !(name in skip))
  .sort(([a], [b]) => a.localeCompare(b))

describe('data-slot', () => {
  it.each(entries)('%s forwards a caller data-slot to its root', async (name, component) => {
    const wrapper = await mountSuspended(component, {
      ...options[name],
      attrs: { 'data-slot': 'probe' }
    })

    const html = wrapper.html()
    expect(html.match(/data-slot="probe"/g), `${name}: caller data-slot must land exactly once`).toHaveLength(1)
    expect(html.match(/<[a-z][^>]*>/i)?.[0], `${name}: caller data-slot must land on the outermost element`).toContain('data-slot="probe"')
  })

  // Left to itself, the outermost element is named after the component:
  // `data-slot="card"`, the hook a stylesheet targets it by.
  it.each(entries.filter(([name]) => name in namespaces))('%s names its root after the component', async (name, component) => {
    const wrapper = await mountSuspended(component, options[name])

    expect(wrapper.html().match(/<[a-z][^>]*>/i)?.[0]).toContain(`data-slot="${namespaces[name]}"`)
  })

  // Every other marker is `<component>-<slot>`, derived from the `ui.<slot>()`
  // on its tag. `scripts/data-slot.mjs` writes them, so a file it would still
  // change is one that drifted, typically a bare value back from a `v4` sync.
  // Unlike the mounts above, this reaches closed overlays, `content/` and `prose/`.
  it.each(Object.entries(sources))('%s has namespaced markers', (file, source) => {
    const { edits, skipped } = transform(source, file)

    expect(edits.map(edit => `${file}:${edit.line} -> ${edit.value.trim()}`), 'run `node scripts/data-slot.mjs`').toEqual([])
    expect(skipped).toEqual([])
  })
})
