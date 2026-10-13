import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { createSSRApp, h } from 'vue'
import { renderToString } from 'vue/server-renderer'
import { renderEach } from '../component-render'
import Modal from '../../src/runtime/components/Modal.vue'

describe('Modal', () => {
  const props = { open: true, portal: false }

  renderEach(Modal, [
    // Props
    ['with open', { props }],
    ['with title', { props: { ...props, title: 'Title' } }],
    ['with description', { props: { ...props, title: 'Title', description: 'Description' } }],
    ['with fullscreen', { props: { ...props, fullscreen: true, title: 'Title', description: 'Description' } }],
    ['without overlay', { props: { ...props, overlay: false, title: 'Title', description: 'Description' } }],
    ['without transition', { props: { ...props, transition: false, title: 'Title', description: 'Description' } }],
    ['with scrollable', { props: { ...props, scrollable: true, title: 'Title', description: 'Description' } }],
    ['with scrollable and fullscreen', { props: { ...props, scrollable: true, fullscreen: true, title: 'Title', description: 'Description' } }],
    ['with scrollable and without overlay', { props: { ...props, scrollable: true, overlay: false, title: 'Title', description: 'Description' } }],
    ['without close', { props: { ...props, close: false, title: 'Title', description: 'Description' } }],
    ['with closeIcon', { props: { ...props, closeIcon: 'i-lucide-trash' } }],
    ['with class', { props: { ...props, class: 'bg-elevated' } }],
    ['with ui', { props: { ...props, ui: { close: 'end-2' } } }],
    // Slots
    ['with default slot', { props, slots: { default: () => 'Default slot' } }],
    ['with content slot', { props, slots: { content: () => 'Content slot' } }],
    ['with header slot', { props, slots: { header: () => 'Header slot' } }],
    ['with title slot', { props, slots: { title: () => 'Title slot' } }],
    ['with description slot', { props, slots: { description: () => 'Description slot' } }],
    ['with actions slot', { props, slots: { actions: () => 'Actions slot' } }],
    ['with close slot', { props, slots: { close: () => 'Close slot' } }],
    ['with body slot', { props, slots: { body: () => 'Body slot' } }],
    ['with footer slot', { props, slots: { footer: () => 'Footer slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Modal, {
      props: {
        open: true,
        portal: false,
        title: 'Modal Title',
        description: 'This is a modal description'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })

  describe('SSR', () => {
    const TITLE = 'SSR Modal Content'

    // `renderToString` reproduces the `useMounted()` gate in reka's `Teleport`
    // (false on the server), so this asserts the real server-rendered output.
    async function renderSSR(props: Record<string, any>) {
      const ctx: Record<string, any> = {}
      const html = await renderToString(createSSRApp(() => h(Modal as any, props)), ctx)
      return html + JSON.stringify(ctx.teleports ?? {})
    }

    it('does not render content during SSR by default', async () => {
      expect(await renderSSR({ open: true, portal: false, title: TITLE })).not.toContain(TITLE)
    })

    it('renders an open modal during SSR when unmountOnHide is false and portal is disabled', async () => {
      expect(await renderSSR({ open: true, portal: false, unmountOnHide: false, title: TITLE })).toContain(TITLE)
    })

    it('keeps a closed modal in the SSR output when unmountOnHide is false (SEO)', async () => {
      expect(await renderSSR({ open: false, portal: false, unmountOnHide: false, title: TITLE })).toContain(TITLE)
    })

    it('does not force content into SSR when the portal is enabled', async () => {
      expect(await renderSSR({ open: true, unmountOnHide: false, title: TITLE })).not.toContain(TITLE)
    })
  })
})
