import { describe, it, expect, vi, afterEach } from 'vitest'
import { defineComponent, h } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { UBadge, UButton } from '#components'
import { useComponentProps } from '../../src/runtime/composables/useComponentProps'

vi.mock('#build/ui/detected', () => ({
  default: new Set(['button', 'icon', 'link', 'linkBase', 'avatar', 'chip']),
  themes: new Set(['button', 'badge', 'icon', 'link', 'linkBase', 'avatar', 'chip'])
}))

// Nuxt's test environment builds with `dev: false`, which compiles the warning out
describe.skipIf(import.meta.dev === false)('component detection warning', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('warns once when a component renders whose theme detection missed', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout'], shouldAdvanceTime: true })
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

    await mountSuspended(UButton, { props: { label: 'Button' } })
    await mountSuspended(UBadge, { props: { label: 'Badge' } })
    await mountSuspended(UBadge, { props: { label: 'Badge' } })
    vi.advanceTimersByTime(1000)

    expect(warn).toHaveBeenCalledOnce()
    expect(warn.mock.calls[0]![0]).toContain('componentDetection: [\'Badge\']')
  })

  it('leaves out a component of the app\'s own', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout'], shouldAdvanceTime: true })
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    const theme = { slots: { root: 'p-4' }, defaultVariants: {} }
    const MyCard = defineComponent({
      props: { color: String },
      setup(_props) {
        useComponentProps('myCard', _props, theme)
        return () => h('div')
      }
    })

    await mountSuspended(MyCard)
    vi.advanceTimersByTime(1000)

    expect(warn).not.toHaveBeenCalled()
  })
})
