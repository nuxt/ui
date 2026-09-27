import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import colors from 'tailwindcss/colors'
import { useTheme, themeToCSS } from '../../src/runtime/composables/useTheme'

describe('useTheme', () => {
  it('writes a palette as the shades of the alias', () => {
    const css = themeToCSS({ colors: { primary: colors.indigo, neutral: colors.zinc } })

    expect(css).toContain(`--ui-color-primary-500: ${colors.indigo[500]};`)
    expect(css).toContain(`--ui-color-neutral-950: ${colors.zinc[950]};`)
    expect(css).not.toContain('--ui-primary:')
  })

  it('writes a single color as the alias alone', () => {
    const css = themeToCSS({ colors: { secondary: '#5647ff' } })

    expect(css).toBe(':root, :host {\n  --ui-secondary: #5647ff;\n}')
  })

  it('writes the radius', () => {
    expect(themeToCSS({ radius: '0.375rem' })).toContain('--ui-radius: 0.375rem;')
  })

  it('leaves out a single color for `neutral` and unknown aliases', () => {
    expect(themeToCSS({ colors: { neutral: '#000', tertiary: '#fff' } } as any)).toBe('')
  })

  it('refuses a value that could leave the rule or the tag', () => {
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    expect(themeToCSS({ colors: { primary: 'red; } body { display: none' } })).toBe('')
    expect(themeToCSS({ radius: '1rem</style><script>' })).toBe('')
  })

  it('renders the style in the head and follows the options', async () => {
    const primary = ref('#5647ff')
    await mountSuspended(defineComponent({
      setup() {
        useTheme(() => ({ colors: { primary: primary.value } }))
        return () => h('div')
      }
    }))

    await vi.waitFor(() => expect(document.head.innerHTML).toContain('--ui-primary: #5647ff;'))

    primary.value = '#ff4756'
    await vi.waitFor(() => expect(document.head.innerHTML).toContain('--ui-primary: #ff4756;'))
    expect(document.head.innerHTML).not.toContain('#5647ff')
  })
})
