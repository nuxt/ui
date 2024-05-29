import { describe, it, expect } from 'vitest'
import ButtonGroup, { type ButtonGroupProps, type ButtonGroupSlots } from '../../src/runtime/components/ButtonGroup.vue'
import ComponentRender from '../component-render'
import { UInput, UButton } from '#components'
import buttonTheme from '#build/ui/button'

describe('ButtonGroup', () => {
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
      [`with size ${size}`, { props: { size },
        slots: {
          default: {
            components: { UInput, UButton },
            template: `<UInput /> <UButton> Click me! </UButton>`
          }
        }
      }]
    )
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ButtonGroupProps, slots?: Partial<ButtonGroupSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, ButtonGroup)
    expect(html).toMatchSnapshot()
  })
})
