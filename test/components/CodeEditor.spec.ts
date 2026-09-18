import { describe, it, expect, test, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { flushPromises } from '@vue/test-utils'
import { createSSRApp, h, onServerPrefetch } from 'vue'
import { renderToString } from 'vue/server-renderer'
import CodeEditor from '../../src/runtime/components/CodeEditor.vue'
import { getCodeEditorHighlighter, prepareCodeEditorHighlighter } from '../../src/runtime/utils/code-editor'
import { renderEach } from '../component-render'
import theme from '#build/ui/code-editor'

const supportsServerPrefetch = await (async () => {
  let ran = false
  await renderToString(createSSRApp({
    setup() {
      onServerPrefetch(async () => {
        ran = true
      })
      return () => h('div')
    }
  }))
  return ran
})()

describe('CodeEditor', () => {
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any

  renderEach(CodeEditor, [
    // Props
    ['with id', { props: { id: 'id' } }],
    ['with name', { props: { name: 'name' } }],
    ['with placeholder', { props: { placeholder: 'Paste your code...' } }],
    ['with required', { props: { required: true } }],
    ['with disabled', { props: { disabled: true } }],
    ['with readonly', { props: { readonly: true } }],
    ['with rows', { props: { rows: 5 } }],
    ['with maxrows', { props: { maxrows: 5 } }],
    ['with lineNumbers false', { props: { lineNumbers: false } }],
    ['with lineWrapping', { props: { lineWrapping: true } }],
    ['with tabSize', { props: { tabSize: 4 } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { variant } }]),
    ...variants.map((variant: string) => [`with primary variant ${variant} highlight`, { props: { variant, highlight: true } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { variant, color: 'neutral' } }]),
    ...variants.map((variant: string) => [`with neutral variant ${variant} highlight`, { props: { variant, color: 'neutral', highlight: true } }]),
    ['with ariaLabel', { attrs: { 'aria-label': 'Aria label' } }],
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'w-96' } }],
    ['with ui', { props: { ui: { base: 'rounded-none', content: 'tracking-wide' } } }],
    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(CodeEditor, {
      props: {
        placeholder: 'Placeholder',
        required: true
      },
      attrs: {
        'aria-label': 'Code'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()

    wrapper.unmount()
  })

  test('renders the model value in the document', async () => {
    const wrapper = await mountSuspended(CodeEditor, {
      props: { modelValue: 'const a = 1\nconst b = 2' }
    })

    expect(wrapper.vm.view!.state.doc.toString()).toBe('const a = 1\nconst b = 2')
    expect(wrapper.findAll('.cm-line')).toHaveLength(2)
    expect(wrapper.findAll('.cm-lineNumbers .cm-gutterElement').map(el => el.text())).toContain('2')

    wrapper.unmount()
  })

  test('emits update:modelValue when the document changes', async () => {
    const wrapper = await mountSuspended(CodeEditor, {
      props: { modelValue: '' }
    })

    wrapper.vm.view!.dispatch({ changes: { from: 0, insert: 'hello' } })
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')).toEqual([['hello']])

    wrapper.unmount()
  })

  test('updates the document when the model value changes', async () => {
    const wrapper = await mountSuspended(CodeEditor, {
      props: { modelValue: 'before' }
    })

    await wrapper.setProps({ modelValue: 'after' })

    expect(wrapper.vm.view!.state.doc.toString()).toBe('after')
    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    wrapper.unmount()
  })

  test('with .lazy modifier updates on blur only', async () => {
    const wrapper = await mountSuspended(CodeEditor, {
      props: { modelValue: '', modelModifiers: { lazy: true } }
    })

    wrapper.vm.view!.dispatch({ changes: { from: 0, insert: 'hello' } })
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')).toBeUndefined()

    wrapper.vm.view!.contentDOM.dispatchEvent(new FocusEvent('blur'))
    await flushPromises()

    expect(wrapper.emitted('update:modelValue')).toEqual([['hello']])
    expect(wrapper.emitted('blur')).toHaveLength(1)

    wrapper.unmount()
  })

  test('highlights the code with Shiki', async () => {
    const wrapper = await mountSuspended(CodeEditor, {
      props: { modelValue: 'const answer = 42', lang: 'ts' }
    })

    await vi.waitFor(() => {
      expect(wrapper.find('.cm-shiki').exists()).toBe(true)
    }, { timeout: 10000 })

    const token = wrapper.find('.cm-shiki')
    expect(token.attributes('style')).toContain('--shiki-light:')
    expect(token.attributes('style')).toContain('--shiki-dark:')

    wrapper.unmount()
  }, 15000)

  describe('SSR', () => {
    async function renderSSR(props: Record<string, any>) {
      return renderToString(createSSRApp(() => h(CodeEditor as any, props)))
    }

    it('renders the gutter and the lines before the editor mounts', async () => {
      const html = await renderSSR({ modelValue: 'const a = 1\nconst b = 2', theme: 'nord', lineNumbers: true })

      expect(html).toContain('cm-lineNumbers')
      expect(html).toContain('<div class="cm-gutterElement">2</div>')
      expect(html.match(/class="cm-line"/g)).toHaveLength(2)
      expect(html).not.toContain('<textarea')
    })

    it('highlights the code with a highlighter that knows the language', async () => {
      const highlighter = await getCodeEditorHighlighter()
      await prepareCodeEditorHighlighter(highlighter, 'ts', { light: 'material-theme-lighter', dark: 'material-theme-palenight' })

      const html = await renderSSR({ modelValue: 'const answer = 42', lang: 'ts', highlighter })

      expect(html).toContain('class="cm-shiki"')
      expect(html).toContain('--shiki-light:')
      expect(html).toContain('--shiki-dark:')
      expect(html).toContain('<span class="cm-shiki" style="--shiki-light:#')
    })

    it('highlights with the shared highlighter once it has been prepared', async () => {
      await prepareCodeEditorHighlighter(await getCodeEditorHighlighter(), 'json', { light: 'material-theme-lighter', dark: 'material-theme-palenight' })

      const html = await renderSSR({ modelValue: '{ "ok": true }', lang: 'json' })

      expect(html).toContain('class="cm-shiki"')
    })

    // Nuxt tree-shakes `onServerPrefetch` out of client builds, which the nuxt test project is.
    it.skipIf(!supportsServerPrefetch)('prepares the shared highlighter during server prefetch', async () => {
      const html = await renderSSR({ modelValue: '.a { color: red }', lang: 'css' })

      expect(html).toContain('class="cm-shiki"')
    })

    it('hides the gutter without line numbers and shows the placeholder', async () => {
      const html = await renderSSR({ placeholder: 'Paste your code', lineNumbers: false })

      expect(html).not.toContain('class="cm-gutters')
      expect(html).toContain('class="cm-placeholder"')
      expect(html).toContain('Paste your code')
    })
  })

  test('toggles the readonly state', async () => {
    const wrapper = await mountSuspended(CodeEditor, {
      props: { modelValue: 'locked' }
    })

    expect(wrapper.vm.view!.state.readOnly).toBe(false)

    await wrapper.setProps({ readonly: true })

    expect(wrapper.vm.view!.state.readOnly).toBe(true)
    expect(wrapper.find('.cm-content').attributes('aria-readonly')).toBe('true')

    wrapper.unmount()
  })
})
