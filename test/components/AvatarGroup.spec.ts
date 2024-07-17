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
  <UAvatar src="https://avatars.githubusercontent.com/u/739984?v=4" alt="benjamincanac" />
  <UAvatar src="https://avatars.githubusercontent.com/u/25613751?v=4" alt="romhml" />
  <UAvatar src="https://avatars.githubusercontent.com/u/19751938?v=4" alt="noook" />
</UAvatarGroup>`
})

describe('AvatarGroup', () => {
  const sizes = Object.keys(theme.variants.size) as any

  it.each([
    // Props
    ['with as', { props: { as: 'span' } }],
    ['with max', { props: { max: 2 } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { size } }]),
    ['with class', { props: { class: 'justify-start' } }],
    ['with ui', { props: { ui: { base: 'rounded-lg' } } }],
    // Slots
    ['with default slot', {}]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: AvatarGroupProps, slots?: Partial<AvatarGroupSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, AvatarGroupWrapper)
    expect(html).toMatchSnapshot()
  })
})
