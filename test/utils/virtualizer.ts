import { expect, vi } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'

export async function loadVirtualizer<T>(component: T, options: Parameters<typeof mountSuspended<T>>[1]) {
  const wrapper = await mountSuspended<T>(component, options)
  await vi.waitFor(() => expect(wrapper.html()).toContain('data-reka-virtualizer'), { timeout: 10_000 })
  wrapper.unmount()
}
