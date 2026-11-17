import { describe, it, expect } from 'vitest'
import { reactive } from 'vue'
import { useForwardProps } from '../../src/runtime/composables/useForwardProps'

describe('useForwardProps', () => {
  it('forwards only the listed keys that are not undefined', () => {
    const props = reactive<Record<string, any>>({ open: false, modal: undefined, class: 'x' })

    expect(useForwardProps(props, ['open', 'modal']).value).toEqual({ open: false })
  })

  it('tracks changes to the listed keys', () => {
    const props = reactive<Record<string, any>>({ open: false, modal: undefined })
    const forwarded = useForwardProps(props, ['open', 'modal'])

    expect(forwarded.value).toEqual({ open: false })

    props.open = true
    props.modal = true

    expect(forwarded.value).toEqual({ open: true, modal: true })
  })
})
