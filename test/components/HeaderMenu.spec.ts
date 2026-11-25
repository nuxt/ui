import { h } from 'vue'
import { describe, it, expect, vi } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import Header from '../../src/runtime/components/Header.vue'
import HeaderMenu from '../../src/runtime/components/HeaderMenu.vue'
import type { HeaderMenuProps } from '../../src/runtime/components/HeaderMenu.vue'

// HeaderMenu reads its state from the Header around it
function mountMenu(props: HeaderMenuProps = {}, slots: Record<string, any> = {}, options: Record<string, any> = {}) {
  return mountSuspended(Header, {
    ...options,
    props: { ...options.props },
    slots: {
      right: () => 'Right slot',
      menu: () => h(HeaderMenu, props as any, { default: () => 'Default slot', ...slots })
    }
  })
}

describe('HeaderMenu', () => {
  it.each([
    // Props
    ['with mode inline', { mode: 'inline' }],
    ['with mode modal', { mode: 'modal', overlay: { portal: false } }],
    ['with mode slideover', { mode: 'slideover', overlay: { portal: false } }],
    ['with mode drawer', { mode: 'drawer', overlay: { portal: false } }],
    ['with class', { class: 'bg-default' }],
    ['with ui', { ui: { body: 'p-6' } }]
  ] as [string, HeaderMenuProps][])('renders %s correctly', async (_, props) => {
    const wrapper = await mountMenu(props, {}, { props: { open: true } })
    await vi.dynamicImportSettled()
    await wrapper.vm.$nextTick()
    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })

  it('renders with content slot correctly', async () => {
    const wrapper = await mountMenu({}, { content: () => 'Content slot' }, { props: { open: true } })
    await vi.dynamicImportSettled()
    expect(wrapper.html()).toMatchSnapshot()
    wrapper.unmount()
  })

  it('locks the page while the inline menu is open and only releases its own lock', async () => {
    document.documentElement.style.overflow = 'clip'
    const wrapper = await mountMenu()
    const toggle = wrapper.find('[data-slot="header-toggle"]')

    // A closed menu leaves a lock it didn't take alone
    expect(document.documentElement.style.overflow).toBe('clip')

    await toggle.trigger('click')

    await vi.dynamicImportSettled()
    expect(document.documentElement.style.overflow).toBe('hidden')
    expect(document.documentElement.style.scrollbarGutter).toBe('stable')

    await toggle.trigger('click')

    await vi.dynamicImportSettled()
    expect(document.documentElement.style.overflow).toBe('clip')
    expect(document.documentElement.style.scrollbarGutter).toBe('')

    wrapper.unmount()
    document.documentElement.style.overflow = ''
  })

  it('keeps the page locked until the last inline menu closes', async () => {
    const first = await mountMenu()
    const second = await mountMenu()

    await first.find('[data-slot="header-toggle"]').trigger('click')
    await second.find('[data-slot="header-toggle"]').trigger('click')
    await first.find('[data-slot="header-toggle"]').trigger('click')
    expect(document.documentElement.style.overflow).toBe('hidden')

    await second.find('[data-slot="header-toggle"]').trigger('click')
    expect(document.documentElement.style.overflow).toBe('')

    first.unmount()
    second.unmount()
  })

  it('passes `class` to the overlay content', async () => {
    const wrapper = await mountMenu({ mode: 'slideover', class: 'max-w-xs', overlay: { portal: false } }, {}, { props: { open: true } })
    await vi.dynamicImportSettled()

    expect(wrapper.find('[data-slot="slideover-content"]').classes()).toContain('max-w-xs')

    wrapper.unmount()
  })

  it('closes the inline menu with Escape and gives the focus back', async () => {
    const wrapper = await mountMenu({}, { default: () => h('a', { href: '#' }, 'Link') }, { attachTo: document.body })
    const toggle = wrapper.find('[data-slot="header-toggle"]')

    ;(toggle.element as HTMLElement).focus()
    await toggle.trigger('click')
    await vi.dynamicImportSettled()
    ;(wrapper.find('[data-slot="header-menu"] a').element as HTMLElement).focus()

    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await new Promise(resolve => setTimeout(resolve))

    expect(wrapper.find('[data-slot="header-menu"]').exists()).toBe(false)
    expect(document.activeElement).toBe(toggle.element)

    wrapper.unmount()
  })

  it('closes with a `toggle` slot of the Header and gives it the focus back', async () => {
    const wrapper = await mountSuspended(Header, {
      attachTo: document.body,
      slots: {
        toggle: ({ toggle }: { toggle: () => void }) => h('button', { 'data-test': 'toggle', 'onClick': toggle }, 'Menu'),
        menu: () => h(HeaderMenu, null, { default: () => h('a', { href: '#' }, 'Link') })
      }
    })
    const toggle = wrapper.find('[data-test="toggle"]')

    ;(toggle.element as HTMLElement).focus()
    await toggle.trigger('click')
    await vi.dynamicImportSettled()
    await new Promise(resolve => setTimeout(resolve))

    // The pointer down on the toggle is outside the menu, it must not dismiss it before the click
    await toggle.trigger('pointerdown')
    await toggle.trigger('click')
    await vi.dynamicImportSettled()
    await new Promise(resolve => setTimeout(resolve))

    expect(wrapper.emitted('update:open')).toEqual([[true], [false]])
    expect(document.activeElement).toBe(toggle.element)

    wrapper.unmount()
  })

  it.each(['modal', 'slideover'] as const)('shows the %s close in a header of its own', async (mode) => {
    const wrapper = await mountMenu({ mode, overlay: { portal: false } }, {}, { props: { open: true } })
    await vi.dynamicImportSettled()

    expect(wrapper.find('[role="dialog"]').text()).toContain('Default slot')
    expect(wrapper.find(`[data-slot="${mode}-close"]`).exists()).toBe(true)
    expect(wrapper.findAll('[data-slot="header-right"]')).toHaveLength(1)

    wrapper.unmount()
  })

  it('labels the overlay with the translated toggle label', async () => {
    const wrapper = await mountMenu({ mode: 'modal', overlay: { portal: false } }, {}, { props: { open: true } })
    await vi.dynamicImportSettled()

    const dialog = wrapper.find('[role="dialog"]')
    expect(wrapper.find(`#${dialog.attributes('aria-labelledby')}`).text()).toBe('Open menu')
    expect(wrapper.html()).not.toContain('header.')

    wrapper.unmount()
  })

  it('mounts the overlay before opening with `unmountOnHide: false`', async () => {
    const wrapper = await mountMenu({ mode: 'slideover', overlay: { portal: false, unmountOnHide: false } })
    await vi.dynamicImportSettled()

    expect(wrapper.find('[role="dialog"]').exists()).toBe(true)

    wrapper.unmount()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountMenu({}, {}, { props: { open: true } })
    await vi.dynamicImportSettled()

    expect(await axe(wrapper.element)).toHaveNoViolations()

    wrapper.unmount()
  })
})
