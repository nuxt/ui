import { describe, it, expect } from 'vitest'
import { UAvatarGroup, UAvatar } from '#components'
import type { TypeOf } from 'zod'
import { defineComponent, h } from 'vue'
import ComponentRender from '../component-render'

describe('AvatarGroup', () => {
  it.each([
    ['basic case', {}],
    ['with default values correctly', { slots: { default: [h(UAvatar)] } }],
    ['with custom size', { slots: { default: [h(UAvatar)] }, props: { size: 'large' } }],
    ['with custom max limit', { slots: { default: [h(UAvatar), h(UAvatar), h(UAvatar)] }, props: { max: 2 } }],
    ['with custom class', { slots: { default: [h(UAvatar)] }, props: { class: 'custom-class' } }],
    ['with custom UI config', { slots: { default: [h(UAvatar)] }, props: { ui: { wrapper: 'bg-blue-500' } } }],
    // @ts-ignore
  ])('renders %s correctly', async (nameOrHtml: string, options: TypeOf<typeof AvatarGroup.props>) => {
    if (options !== undefined) {
      options.slots = options.slots || { default: () => 'label' }
      options.slots.default = options.slots.default || (() => 'label')
    }
    const html = await ComponentRender(nameOrHtml, options, UAvatarGroup)
    expect(html).toMatchSnapshot()
  })
})
