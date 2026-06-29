import { describe, it, expect, afterEach } from 'vitest'
import { nextTick, reactive } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import appConfig from '#build/app.config'
import Button from '../../src/runtime/components/Button.vue'

// `colors: { primary: 'neutral' }` must make `color="primary"` resolve to the `neutral` *variant*
// (the `bg-inverted`/`bg-elevated` class set), not just recolor `bg-primary`. The substitution lives
// in the `tv()` wrapper (src/runtime/utils/tv.ts), which reads the merged app config through the same
// `reactive()` proxy `useAppConfig()` returns — so mutating it here the way the docs theme picker does
// reproduces both the baked `app.config.ts` value and the live-update scenario.
describe('primary: neutral', () => {
  const colors = reactive(appConfig as { ui: { colors: Record<string, string> } }).ui.colors
  const originalPrimary = colors.primary as string

  afterEach(() => {
    colors.primary = originalPrimary
  })

  it('resolves the default (primary) color to the neutral variant', async () => {
    colors.primary = 'neutral'

    const wrapper = await mountSuspended(Button, { props: { label: 'Button' } })
    const html = wrapper.html()

    expect(html).toContain('bg-inverted')
    expect(html).not.toContain('bg-primary')
  })

  it('leaves a normally configured primary untouched', async () => {
    colors.primary = 'green'

    const wrapper = await mountSuspended(Button, { props: { label: 'Button' } })
    const html = wrapper.html()

    expect(html).toContain('bg-primary')
    expect(html).not.toContain('bg-inverted')
  })

  it('does not remap an alias that is not configured as neutral', async () => {
    colors.primary = 'neutral'

    const wrapper = await mountSuspended(Button, { props: { label: 'Button', color: 'error' } })

    expect(wrapper.html()).toContain('bg-error')
  })

  it('reactively switches to the neutral variant when the alias is toggled live', async () => {
    colors.primary = 'green'

    const wrapper = await mountSuspended(Button, { props: { label: 'Button' } })
    expect(wrapper.html()).toContain('bg-primary')

    colors.primary = 'neutral'
    await nextTick()

    expect(wrapper.html()).toContain('bg-inverted')
  })
})
