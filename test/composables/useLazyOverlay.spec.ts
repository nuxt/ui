import { describe, it, expect, vi, afterEach } from 'vitest'
import { defineComponent, h, nextTick, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useLazyOverlay } from '../../src/runtime/composables/useLazyOverlay'

function mountWith(open: () => boolean, preload = vi.fn(() => Promise.resolve())) {
  let rendered!: ReturnType<typeof useLazyOverlay>

  const wrapper = mount(defineComponent({
    setup() {
      rendered = useLazyOverlay(open, preload)
      return () => h('div')
    }
  }))

  return { wrapper, rendered, preload }
}

describe('useLazyOverlay', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('stays rendered once opened', async () => {
    const open = ref(false)
    const { rendered } = mountWith(() => open.value)

    expect(rendered.value).toBe(false)

    open.value = true
    await nextTick()
    expect(rendered.value).toBe(true)

    open.value = false
    await nextTick()
    expect(rendered.value).toBe(true)
  })

  it('renders immediately when initially open', () => {
    const { rendered } = mountWith(() => true)

    expect(rendered.value).toBe(true)
  })

  it('preloads once idle after mount', async () => {
    vi.useFakeTimers()

    const { preload } = mountWith(() => false)

    expect(preload).not.toHaveBeenCalled()

    await vi.runAllTimersAsync()
    expect(preload).toHaveBeenCalledOnce()
  })

  it('does not preload when unmounted before idle', async () => {
    vi.useFakeTimers()

    const { wrapper, preload } = mountWith(() => false)
    wrapper.unmount()

    await vi.runAllTimersAsync()
    expect(preload).not.toHaveBeenCalled()
  })
})
