import { describe, it, expect, test } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import type { ThemeProps, ThemeSlots } from '../../src/runtime/components/Theme.vue'
import Theme from '../../src/runtime/components/Theme.vue'
import ComponentRender from '../component-render'
import { h, ref, nextTick } from 'vue'
import Button from '../../src/runtime/components/Button.vue'
import Badge from '../../src/runtime/components/Badge.vue'
import Alert from '../../src/runtime/components/Alert.vue'
import Input from '../../src/runtime/components/Input.vue'

type CaseOptions = { props?: ThemeProps, slots?: ThemeSlots }

describe('Theme', () => {
  it.each([
    // Props
    [
      'with empty ui',
      {
        props: { ui: {} },
        slots: { default: () => h(Button, { label: 'Button' }) }
      } satisfies CaseOptions,
      []
    ],
    [
      'with theme applied to button base slot',
      {
        props: { ui: { button: { label: 'text-[#ff0]', base: 'px-[1.234rem]' } } },
        slots: { default: () => h(Button, { label: 'Button' }) }
      } satisfies CaseOptions,
      ['px-[1.234rem]', 'text-[#ff0]']
    ],
    [
      'with ui prop taking priority over theme',
      {
        props: { ui: { button: { label: 'text-[#ff0]', base: 'px-[1.234rem]' } } },
        slots: { default: () => h(Button, { label: 'Button', ui: { base: 'px-[2.234rem]' } }) }
      } satisfies CaseOptions,
      ['px-[2.234rem]']
    ],
    [
      'with nested theme overriding outer theme',
      {
        props: { ui: { button: { label: 'text-[#ff0]', base: 'px-[1.234rem]' } } },
        slots: { default: () => h(Theme, { ui: { button: { label: 'text-[#000]', base: 'px-[2.234rem]' } } }, () => h(Button, { label: 'Button' })) }
      } satisfies CaseOptions,
      ['px-[2.234rem]', 'text-[#000]']
    ],
    [
      'with theme applied to badge',
      {
        props: { ui: { badge: { base: 'rounded-[1.234rem]' } } },
        slots: { default: () => h(Badge, { label: 'Badge' }) }
      } satisfies CaseOptions,
      ['rounded-[1.234rem]']
    ],
    [
      'with theme applied to alert',
      {
        props: { ui: { alert: { root: 'border-[3px]' } } },
        slots: { default: () => h(Alert, { title: 'Alert' }) }
      } satisfies CaseOptions,
      ['border-[3px]']
    ],
    [
      'with theme applied to multiple component types',
      {
        props: { ui: { button: { base: 'px-[1.234rem]' }, badge: { base: 'rounded-[1.234rem]' } } },
        slots: {
          default: () => [
            h(Button, { label: 'Button' }),
            h(Badge, { label: 'Badge' })
          ]
        }
      } satisfies CaseOptions,
      ['px-[1.234rem]', 'rounded-[1.234rem]']
    ],
    [
      'with theme not affecting unrelated component',
      {
        props: { ui: { badge: { base: 'rounded-[1.234rem]' } } },
        slots: { default: () => h(Button, { label: 'Button' }) }
      } satisfies CaseOptions,
      []
    ]
  ])('renders %s correctly', async (nameOrHtml: string, options: CaseOptions, contains: string[] = []) => {
    const html = await ComponentRender(nameOrHtml, options, Theme)
    expect(html).toMatchSnapshot()
    contains.forEach((c) => {
      expect(html).toContain(c)
    })
  })

  test('applies theme classes to child component', async () => {
    const wrapper = await mountSuspended({
      components: { Theme, Button },
      template: `
        <Theme :ui="{ button: { base: 'test-theme-class' } }">
          <Button label="Themed" />
        </Theme>
      `
    })

    expect(wrapper.find('button').classes()).toContain('test-theme-class')
  })

  test('child ui prop takes priority over theme', async () => {
    const wrapper = await mountSuspended({
      components: { Theme, Button },
      template: `
        <Theme :ui="{ button: { base: 'theme-class' } }">
          <Button label="Themed" :ui="{ base: 'ui-prop-class' }" />
        </Theme>
      `
    })

    expect(wrapper.find('button').classes()).toContain('ui-prop-class')
    expect(wrapper.find('button').classes()).not.toContain('theme-class')
  })

  test('nested theme overrides outer theme', async () => {
    const wrapper = await mountSuspended({
      components: { Theme, Button },
      template: `
        <Theme :ui="{ button: { base: 'outer-theme-class' } }">
          <Theme :ui="{ button: { base: 'inner-theme-class' } }">
            <Button label="Themed" />
          </Theme>
        </Theme>
      `
    })

    expect(wrapper.find('button').classes()).toContain('inner-theme-class')
    expect(wrapper.find('button').classes()).not.toContain('outer-theme-class')
  })

  test('deeply nested themes (3 levels)', async () => {
    const wrapper = await mountSuspended({
      components: { Theme, Button },
      template: `
        <Theme :ui="{ button: { base: 'level-1-class' } }">
          <Theme :ui="{ button: { base: 'level-2-class' } }">
            <Theme :ui="{ button: { base: 'level-3-class' } }">
              <Button label="Themed" />
            </Theme>
          </Theme>
        </Theme>
      `
    })

    expect(wrapper.find('button').classes()).toContain('level-3-class')
    expect(wrapper.find('button').classes()).not.toContain('level-2-class')
    expect(wrapper.find('button').classes()).not.toContain('level-1-class')
  })

  test('applies theme to multiple children of same type', async () => {
    const wrapper = await mountSuspended({
      components: { Theme, Button },
      template: `
        <Theme :ui="{ button: { base: 'shared-theme-class' } }">
          <Button label="First" />
          <Button label="Second" />
        </Theme>
      `
    })

    const buttons = wrapper.findAll('button')
    expect(buttons).toHaveLength(2)
    buttons.forEach((button) => {
      expect(button.classes()).toContain('shared-theme-class')
    })
  })

  test('applies theme to different component types simultaneously', async () => {
    const wrapper = await mountSuspended({
      components: { Theme, Button, Badge },
      template: `
        <Theme :ui="{ button: { base: 'button-theme-class' }, badge: { base: 'badge-theme-class' } }">
          <Button label="Themed Button" />
          <Badge label="Themed Badge" />
        </Theme>
      `
    })

    expect(wrapper.find('button').classes()).toContain('button-theme-class')
    expect(wrapper.find('span').classes()).toContain('badge-theme-class')
  })

  test('theme does not leak outside its scope', async () => {
    const wrapper = await mountSuspended({
      components: { Theme, Button },
      template: `
        <div>
          <Theme :ui="{ button: { base: 'inside-theme-class' } }">
            <Button label="Inside" class="inside-btn" />
          </Theme>
          <Button label="Outside" class="outside-btn" />
        </div>
      `
    })

    expect(wrapper.find('.inside-btn').classes()).toContain('inside-theme-class')
    expect(wrapper.find('.outside-btn').classes()).not.toContain('inside-theme-class')
  })

  test('reacts to theme prop changes', async () => {
    const ui = ref<any>({ button: { base: 'initial-class' } })

    const wrapper = await mountSuspended({
      components: { Theme, Button },
      setup: () => ({ ui }),
      template: `
        <Theme :ui="ui">
          <Button label="Themed" />
        </Theme>
      `
    })

    expect(wrapper.find('button').classes()).toContain('initial-class')

    ui.value = { button: { base: 'updated-class' } }
    await nextTick()

    expect(wrapper.find('button').classes()).toContain('updated-class')
    expect(wrapper.find('button').classes()).not.toContain('initial-class')
  })

  test('applies theme to input component', async () => {
    const wrapper = await mountSuspended({
      components: { Theme, Input },
      template: `
        <Theme :ui="{ input: { root: 'input-theme-class' } }">
          <Input placeholder="Themed input" />
        </Theme>
      `
    })

    expect(wrapper.find('[data-slot="root"]').classes()).toContain('input-theme-class')
  })
})
