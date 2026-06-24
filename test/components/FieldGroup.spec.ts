import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import FieldGroup from '../../src/runtime/components/FieldGroup.vue'
import buttonTheme from '#build/ui/button'
import { UInput, UButton } from '#components'

describe('FieldGroup', () => {
  const sizes = Object.keys(buttonTheme.variants.size) as any

  renderEach(FieldGroup, [
    // Props
    ['with as', { props: { as: 'section' } }],
    ['with class', { props: { class: 'absolute' } }],
    // Slots
    ['with default slot', {
      slots: {
        default: {
          components: { UInput, UButton },
          template: `<UInput /> <UButton> Click me! </UButton>`
        }
      }
    }],
    ['orientation vertical with default slot', {
      props: { orientation: 'vertical' },
      slots: {
        default: {
          components: { UInput, UButton },
          template: `<UInput /> <UButton> Click me! </UButton>`
        }
      }
    }],
    ...sizes.map((size: string) =>
      [`with size ${size}`, {
        props: { size },
        slots: {
          default: {
            components: { UInput, UButton },
            template: `<UInput /> <UButton> Click me! </UButton>`
          }
        }
      }]
    )
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(FieldGroup, {
      slots: {
        default: {
          template: `<UInput /> <UButton> Click me! </UButton>`
        }
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
