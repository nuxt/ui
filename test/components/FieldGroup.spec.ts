import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import FieldGroup from '../../src/runtime/components/FieldGroup.vue'
import type { FieldGroupProps, FieldGroupSlots } from '../../src/runtime/components/FieldGroup.vue'
import ComponentRender from '../component-render'
import buttonTheme from '#build/ui/button'
import { UInput, UButton } from '#components'

describe('FieldGroup', () => {
  const sizes = Object.keys(buttonTheme.variants.size) as any

  it.each([
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
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: FieldGroupProps, slots?: Partial<FieldGroupSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, FieldGroup)
    expect(html).toMatchSnapshot()
  })

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
