import { describe, it, expect, vi, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { UBadge, UButton } from '#components'

vi.mock('#build/ui/detected', () => ({ default: new Set(['button', 'icon', 'link', 'linkBase', 'avatar', 'chip']) }))

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
})
