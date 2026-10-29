import { describe, it, expect, expectTypeOf, beforeAll, afterAll } from 'vitest'
import type { PropType } from 'vue'
import { defineComponent, h } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useAppConfig } from '#imports'
import { UTheme } from '#components'
import { useComponentTheme } from '../../src/runtime/composables/useComponentTheme'
import { defineTheme, extendTheme } from '../../src/runtime/utils/theme'
import card from '../../src/runtime/theme/card'

// A component of the app's own, styled like the library's
const theme = extendTheme(card, {
  slots: {
    value: 'text-2xl font-semibold'
  },
  variants: {
    trend: {
      up: { value: 'text-success' },
      down: { value: 'text-error' }
    }
  }
})

const Stat = defineComponent({
  props: {
    value: Number,
    trend: String as PropType<'up' | 'down'>,
    tone: String,
    variant: String,
    class: null,
    ui: Object
  },
  setup(_props) {
    const { props, ui } = useComponentTheme('stat', _props, theme, props => ({
      trend: props.trend ?? (props.value! < 0 ? 'down' : 'up')
    }))

    return () => h('div', { 'data-slot': 'stat', 'class': ui.value.root() }, [
      h('div', { 'data-slot': 'stat-value', 'class': ui.value.value({ class: 'tabular-nums' }) }, String(props.value))
    ])
  }
})

const render = (template: string) => mountSuspended({ components: { UTheme, Stat }, template })

describe('useComponentTheme', () => {
  it('resolves the theme from the props', async () => {
    const wrapper = await render('<Stat :value="1" variant="soft" />')

    expect(wrapper.find('[data-slot="stat"]').classes()).toEqual(expect.arrayContaining(['rounded-lg', 'bg-tint']))
    expect(wrapper.find('[data-slot="stat"]').classes()).not.toContain('ring')
    expect(wrapper.find('[data-slot="stat-value"]').classes()).toEqual(['text-2xl', 'font-semibold', 'text-success', 'tabular-nums'])
  })

  it('takes the variants it\'s given over the props', async () => {
    const wrapper = await render('<Stat :value="-1" />')

    expect(wrapper.find('[data-slot="stat-value"]').classes()).toContain('text-error')
  })

  it('applies `ui` to each slot and `class` to the root, last', async () => {
    const wrapper = await render('<Stat :value="1" class="rounded-none" :ui="{ value: \'text-xl tabular-nums-off\' }" />')

    expect(wrapper.find('[data-slot="stat"]').classes()).toContain('rounded-none')
    expect(wrapper.find('[data-slot="stat"]').classes()).not.toContain('rounded-lg')
    expect(wrapper.find('[data-slot="stat-value"]').classes()).toContain('text-xl')
    expect(wrapper.find('[data-slot="stat-value"]').classes()).not.toContain('text-2xl')
  })

  it('reads `<UTheme>` props, slot classes and variants', async () => {
    const wrapper = await render(`<UTheme :props="{ stat: { variant: 'solid' } }" :ui="{ stat: { value: 'italic' } }" :variants="{ stat: { trend: { up: { value: 'underline' } } } }">
      <Stat :value="1" />
    </UTheme>`)

    expect(wrapper.find('[data-slot="stat"]').classes()).toContain('bg-neutral')
    expect(wrapper.find('[data-slot="stat-value"]').classes()).toEqual(expect.arrayContaining(['italic', 'underline']))
  })

  it('drops the theme classes under `<UTheme unstyled>`', async () => {
    const wrapper = await render('<UTheme unstyled><Stat :value="1" class="p-2" /></UTheme>')

    expect(wrapper.find('[data-slot="stat"]').classes()).toEqual(['p-2'])
    expect(wrapper.find('[data-slot="stat-value"]').classes()).toEqual(['tabular-nums'])
  })

  describe('from app.config', () => {
    let appConfig: { ui?: Record<string, any> }

    beforeAll(() => {
      appConfig = useAppConfig() as { ui?: Record<string, any> }
      appConfig.ui ??= {}
      appConfig.ui.stat = { slots: { root: 'shadow-sm' }, variants: { tone: { strong: { value: 'font-black' } } }, defaultVariants: { variant: 'subtle' } }
    })

    afterAll(() => {
      delete appConfig.ui!.stat
    })

    it('applies `app.config.ui.<name>`', async () => {
      const wrapper = await render('<Stat :value="1" />')

      expect(wrapper.find('[data-slot="stat"]').classes()).toEqual(expect.arrayContaining(['shadow-sm', 'bg-tint', 'ring']))
    })

    it('reads a variant the app config adds from its prop', async () => {
      const wrapper = await render('<Stat :value="1" tone="strong" />')

      expect(wrapper.find('[data-slot="stat-value"]').classes()).toContain('font-black')
    })
  })

  it('types the slots from the theme', () => {
    const plain = defineTheme({ slots: { root: '', label: '' }, variants: { size: { sm: '', md: '' } } })
    const recipe = () => useComponentTheme('plain', {} as { size?: 'sm' | 'md' }, plain).ui.value

    expectTypeOf(recipe).returns.toHaveProperty('label')
    expectTypeOf(recipe).returns.not.toHaveProperty('value')

    // @ts-expect-error `lg` is not a `size` of the theme
    expectTypeOf(() => useComponentTheme('plain', {}, plain, () => ({ size: 'lg' }))).toBeFunction()
  })
})
