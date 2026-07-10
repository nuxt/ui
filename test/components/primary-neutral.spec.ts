import { describe, it, expect, afterEach } from 'vitest'
import { reactive } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import appConfig from '#build/app.config'
import Button from '../../src/runtime/components/Button.vue'

// `colors: { primary: 'neutral' }` is a pure CSS concern handled by the colors plugin
// (src/runtime/plugins/colors.ts): the alias shades mirror the resolved neutral scale and
// `--ui-primary` points at `--ui-bg-inverted`. Components keep rendering their regular
// `bg-primary` classes — the variant key is never remapped, so user overrides targeting
// `color: 'primary'` keep matching.
describe('primary: neutral', () => {
  const colors = reactive(appConfig as { ui: { colors: Record<string, string> } }).ui.colors
  const originalPrimary = colors.primary as string

  afterEach(() => {
    colors.primary = originalPrimary
  })

  // The colors plugin emits its stylesheet through unhead, which flushes DOM updates
  // asynchronously — poll instead of racing it with a single tick.
  async function getColorsStyle(): Promise<string> {
    for (let i = 0; i < 50; i++) {
      const el = document.head.querySelector('style#nuxt-ui-colors')
      if (el?.innerHTML) {
        return el.innerHTML
      }
      await new Promise(resolve => setTimeout(resolve, 10))
    }
    throw new Error('style#nuxt-ui-colors not found in document.head')
  }

  async function waitForStyle(predicate: (css: string) => boolean): Promise<string> {
    let css = ''
    for (let i = 0; i < 50; i++) {
      css = await getColorsStyle()
      if (predicate(css)) {
        return css
      }
      await new Promise(resolve => setTimeout(resolve, 10))
    }
    return css
  }

  it('mirrors the neutral scale and points the alias at bg-inverted', async () => {
    colors.primary = 'neutral'

    const css = await waitForStyle(css => css.includes('--ui-primary: var(--ui-bg-inverted);'))

    expect(css).toContain('--ui-color-primary-500: var(--ui-color-neutral-500);')
    expect(css).toContain('--ui-color-primary-950: var(--ui-color-neutral-950);')
    expect(css).toContain('--ui-primary: var(--ui-bg-inverted);')
    // No dark redefinition: the `:root` declaration carries over and `--ui-bg-inverted` flips itself.
    expect(css).not.toContain('--ui-primary: var(--ui-color-primary-400);')
  })

  it('keeps a normally configured primary on its shade scale', async () => {
    colors.primary = 'green'

    const css = await waitForStyle(css => css.includes('--ui-primary: var(--ui-color-primary-500);'))

    expect(css).toContain('--ui-color-primary-500: var(--color-green-500,')
    expect(css).toContain('--ui-primary: var(--ui-color-primary-500);')
    expect(css).toContain('--ui-primary: var(--ui-color-primary-400);')
    expect(css).not.toContain('--ui-bg-inverted')
  })

  it('does not remap the color variant, so overrides keyed on primary keep matching', async () => {
    colors.primary = 'neutral'

    const wrapper = await mountSuspended(Button, { props: { label: 'Button' } })
    const html = wrapper.html()

    expect(html).toContain('bg-primary')
    expect(html).not.toContain('bg-inverted')
  })

  it('reactively updates the stylesheet when the alias is toggled live', async () => {
    colors.primary = 'green'
    await waitForStyle(css => css.includes('--ui-primary: var(--ui-color-primary-500);'))

    colors.primary = 'neutral'
    const css = await waitForStyle(css => css.includes('--ui-primary: var(--ui-bg-inverted);'))

    expect(css).toContain('--ui-primary: var(--ui-bg-inverted);')
  })
})
