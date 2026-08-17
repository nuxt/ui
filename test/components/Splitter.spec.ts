import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import Splitter from '../../src/runtime/components/Splitter.vue'
import type { SplitterItem } from '../../src/runtime/components/Splitter.vue'

describe('Splitter', () => {
  const items: SplitterItem[] = [{
    min: 20,
    default: 30,
    collapsible: true,
    collapsedSize: 5,
    slot: 'sidebar'
  }, {
    slot: 'main'
  }]

  const slots = {
    sidebar: () => 'Sidebar',
    main: () => 'Main'
  }

  const props = { items }

  renderEach(Splitter<SplitterItem>, [
    // Props
    ['with items', { props, slots }],
    ['with orientation vertical', { props: { ...props, orientation: 'vertical' as const }, slots }],
    ['with autoSaveId', { props: { ...props, autoSaveId: 'test' }, slots }],
    ['with keyboardResizeBy', { props: { ...props, keyboardResizeBy: 10 }, slots }],
    ['with as', { props: { ...props, as: 'section' }, slots }],
    ['with unit', { props: { items: [{ default: 200, min: 100, unit: 'px', slot: 'sidebar' }, { slot: 'main' }] as SplitterItem[] }, slots }],
    ['with disabled', { props: { ...props, disabled: true }, slots }],
    ['with class', { props: { ...props, class: 'h-96' }, slots }],
    ['with ui', { props: { ...props, ui: { handle: 'bg-primary' } }, slots }],
    // Slots
    ['with index fallback slots', { props: { items: [{}, {}] as SplitterItem[] }, slots: { 'panel-0': () => 'First', 'panel-1': () => 'Second' } }],
    ['with resize-handle slot', { props, slots: { ...slots, 'resize-handle': () => 'Handle' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(Splitter, {
      props: { items },
      slots
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
