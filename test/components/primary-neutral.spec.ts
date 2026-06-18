import { describe, it, expect, afterEach } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import appConfig from '#build/app.config'
import Button from '../../src/runtime/components/Button.vue'

// `colors: { primary: 'neutral' }` must make `color="primary"` resolve to the `neutral` *variant*
// (the `bg-inverted`/`bg-elevated` class set), not just recolor `bg-primary`. The substitution lives
// in the `tv()` wrapper (src/runtime/utils/tv.ts), which reads the merged app config — the same object
// a baked `app.config.ts` value lands in, so mutating it here reproduces that scenario in either env.
describe('primary: neutral', () => {
  const colors = (appConfig as { ui: { colors: Record<string, string> } }).ui.colors

  afterEach(() => {
    colors.primary = 'green'
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
})
