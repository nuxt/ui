import { describe, it, expect } from 'vitest'
import { defineComponent, reactive, nextTick } from 'vue'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { useResolvedVariants } from '../../src/runtime/composables/useResolvedVariants'

const theme = {
  defaultVariants: {
    variant: 'list',
    size: 'md'
  }
}

describe('useResolvedVariants', () => {
  it('returns prop value when provided', async () => {
    let variant: any

    const component = defineComponent({
      setup() {
        const props = reactive({ variant: 'card' })
        ;({ variant } = useResolvedVariants('radioGroup', props, theme, ['variant']))
        return () => null
      }
    })

    await mountSuspended(component)
    expect(variant.value).toBe('card')
  })

  it('falls back to theme defaultVariants when prop is undefined', async () => {
    let variant: any

    const component = defineComponent({
      setup() {
        const props = reactive({ variant: undefined as string | undefined })
        ;({ variant } = useResolvedVariants('radioGroup', props, theme, ['variant']))
        return () => null
      }
    })

    await mountSuspended(component)
    expect(variant.value).toBe('list')
  })

  it('is reactive to prop changes', async () => {
    let variant: any
    const props = reactive({ variant: 'card' as string | undefined })

    const component = defineComponent({
      setup() {
        ;({ variant } = useResolvedVariants('radioGroup', props, theme, ['variant']))
        return () => null
      }
    })

    await mountSuspended(component)
    expect(variant.value).toBe('card')

    props.variant = undefined
    await nextTick()
    expect(variant.value).toBe('list')

    props.variant = 'card'
    await nextTick()
    expect(variant.value).toBe('card')
  })

  it('resolves multiple variants at once', async () => {
    let variant: any, size: any

    const component = defineComponent({
      setup() {
        const props = reactive({ variant: 'card', size: undefined as string | undefined })
        ;({ variant, size } = useResolvedVariants('radioGroup', props, theme, ['variant', 'size']))
        return () => null
      }
    })

    await mountSuspended(component)
    expect(variant.value).toBe('card')
    expect(size.value).toBe('md')
  })

  it('supports overrides for nested prop paths', async () => {
    let position: any
    const selectTheme = { defaultVariants: { position: 'popper' } }

    const component = defineComponent({
      setup() {
        const props = reactive({ content: { position: 'item-aligned' } })
        ;({ position } = useResolvedVariants('select', props, selectTheme, ['position'], {
          position: () => props.content?.position
        }))
        return () => null
      }
    })

    await mountSuspended(component)
    expect(position.value).toBe('item-aligned')
  })
})
