import { defineComponent } from 'vue'
import { describe, it, expect } from 'vitest'
import Avatar from '../../src/runtime/components/Avatar.vue'
import AvatarGroup, { type AvatarGroupProps, type AvatarGroupSlots } from '../../src/runtime/components/AvatarGroup.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/avatar-group'

const AvatarGroupWrapper = defineComponent({
  components: {
    UAvatar: Avatar,
    UAvatarGroup: AvatarGroup
  },
  template: `<UAvatarGroup>
  <UAvatar src="https://github.com/benjamincanac.png" alt="Benjamin Canac" />
  <UAvatar src="https://github.com/romhml.png" alt="Romain Hamel" />
  <UAvatar src="https://github.com/noook.png" alt="Neil Richter" />
</UAvatarGroup>`
})

describe('AvatarGroup', () => {
  const sizes = Object.keys(theme.variants.size) as any

  it.each([
    // Props
    ['with max', { props: { max: 2 } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ['with as', { props: { as: 'span' } }],
    ['with class', { props: { class: 'justify-start' } }],
    ['with ui', { props: { ui: { base: 'rounded-lg' } } }],
    // Slots
    ['with default slot', {}]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: AvatarGroupProps, slots?: Partial<AvatarGroupSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, AvatarGroupWrapper)
    expect(html).toMatchSnapshot()
  })
})
