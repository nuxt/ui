import { describe, it, expect } from 'vitest'
import { UTabs } from '#components'
import type { TypeOf } from 'zod'
import ComponentRender from '../component-render'
import ui from '../../../src/runtime/ui.config/navigation/tabs'

describe('Tabs', () => {
  it.each([
    ['basic case', { props: { ui: { list: { marker: { base: ui.list.marker.base } } } } }],
    ['with orientation', { props: { orientation: 'vertical', ui: { list: { marker: { base: ui.list.marker.base } } } } }],
    ['with items', { props: { items: [{ label: 'Item 1' }, { label: 'Item 2' }], ui: { list: { tab: { base: ui.list.tab.base }, marker: { base: ui.list.marker.base } } } } }],
    ['with tabs slot', { slots: { default: 'tab slot' }, props: { items: [{ label: 'Item 1' }, { label: 'Item 2' }], ui: { list: { tab: { base: ui.list.tab.base }, marker: { base: ui.list.marker.base } } } } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof Tabs.props>) => {
    const html = await ComponentRender(nameOrHtml, options, UTabs)
    expect(html).toMatchSnapshot()
  })
})
