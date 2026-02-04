import { describe, it, expect } from 'vitest'
import type { ThemeProps, ThemeSlots } from '../../src/runtime/components/Theme.vue'
import Theme from '../../src/runtime/components/Theme.vue'
import ComponentRender from '../component-render'
import { h } from 'vue'
import Button from '../../src/runtime/components/Button.vue'

type CaseOptions = { props?: ThemeProps, slots?: ThemeSlots }

describe('Theme', () => {
  it.each([
    // Props
    [
      'with theme but not for this component',
      {
        props: { ui: { } },
        slots: { default: () => h(Button, { label: 'Button' }) }
      } satisfies CaseOptions,
      []
    ],
    [
      'with theme',
      {
        props: { ui: { button: { slots: { label: 'text-[#ff0]', base: 'px-[1.234rem]' } } } },
        slots: { default: () => h(Button, { label: 'Button' }) }
      } satisfies CaseOptions,
      ['px-[1.234rem]', 'text-[#ff0]']
    ],
    [
      'with ui prop taking priority',
      {
        props: { ui: { button: { slots: { label: 'text-[#ff0]', base: 'px-[1.234rem]' } } } },
        slots: { default: () => h(Button, { label: 'Button', ui: { base: 'px-[2.234rem]' } }) }
      } satisfies CaseOptions,
      ['px-[2.234rem]']
    ],
    [
      'with nested theme (most recent theme wins)',
      {
        props: { ui: { button: { slots: { label: 'text-[#ff0]', base: 'px-[1.234rem]' } } } },
        slots: { default: () => h(Theme, { ui: { button: { slots: { label: 'text-[#000]', base: 'px-[2.234rem]' } } } }, () => h(Button, { label: 'Button' })) }
      } satisfies CaseOptions,
      ['px-[2.234rem]', 'text-[#000]']
    ]
  ])('renders %s correctly', async (nameOrHtml: string, options: CaseOptions, contains: string[] = []) => {
    const html = await ComponentRender(nameOrHtml, options, Theme)
    expect(html).toMatchSnapshot()
    contains.forEach(c => expect(html).toContain(c))
  })
})
