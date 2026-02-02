# Testing

Component tests use Vitest with Vue Test Utils and snapshot testing.

## File Location

Tests live in `test/components/` matching the component name (e.g., `Button.spec.ts`).

## Basic Test Structure

```ts
import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import ComponentName from '../../src/runtime/components/ComponentName.vue'
import type { ComponentNameProps, ComponentNameSlots } from '../../src/runtime/components/ComponentName.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/component-name'

describe('ComponentName', () => {
  // Extract variant keys for dynamic testing
  const sizes = Object.keys(theme.variants.size) as any
  const variants = Object.keys(theme.variants.variant) as any

  it.each([
    // Props
    ['with label', { props: { label: 'Label' } }],
    ...sizes.map((size: string) => [`with size ${size}`, { props: { label: 'Label', size } }]),
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { label: 'Label', variant } }]),
    ['with icon', { props: { icon: 'i-lucide-rocket' } }],
    ['with disabled', { props: { label: 'Label', disabled: true } }],
    ['with class', { props: { label: 'Label', class: 'custom-class' } }],
    ['with ui', { props: { label: 'Label', ui: { base: 'font-bold' } } }],

    // Slots
    ['with default slot', { slots: { default: () => 'Default slot' } }],
    ['with leading slot', { slots: { leading: () => 'Leading slot' } }],
    ['with trailing slot', { slots: { trailing: () => 'Trailing slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: ComponentNameProps, slots?: Partial<ComponentNameSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, ComponentName)
    expect(html).toMatchSnapshot()
  })

  // Accessibility test
  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(ComponentName, {
      props: {
        label: 'Accessible Label'
      }
    })

    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
```

## Testing Patterns

### Props Variations

Test all significant prop combinations:

```ts
it.each([
  // Basic props
  ['with label', { props: { label: 'Button' } }],

  // All sizes
  ...sizes.map((size: string) => [`with size ${size}`, { props: { label: 'Button', size } }]),

  // All variants with primary color
  ...variants.map((variant: string) => [`with primary variant ${variant}`, { props: { label: 'Button', variant } }]),

  // All variants with neutral color
  ...variants.map((variant: string) => [`with neutral variant ${variant}`, { props: { label: 'Button', variant, color: 'neutral' } }]),

  // Icon variations
  ['with icon', { props: { icon: 'i-lucide-rocket' } }],
  ['with leading and icon', { props: { leading: true, icon: 'i-lucide-arrow-left' } }],
  ['with leadingIcon', { props: { leadingIcon: 'i-lucide-arrow-left' } }],
  ['with trailing and icon', { props: { trailing: true, icon: 'i-lucide-arrow-right' } }],
  ['with trailingIcon', { props: { trailingIcon: 'i-lucide-arrow-right' } }],

  // States
  ['with loading', { props: { loading: true } }],
  ['with disabled', { props: { label: 'Button', disabled: true } }],

  // Customization
  ['with class', { props: { label: 'Button', class: 'rounded-full font-bold' } }],
  ['with ui', { props: { label: 'Button', ui: { label: 'font-bold' } } }]
])('renders %s correctly', async (nameOrHtml, options) => {
  const html = await ComponentRender(nameOrHtml, options, Button)
  expect(html).toMatchSnapshot()
})
```

### Slots Testing

```ts
// Simple slot
['with default slot', { slots: { default: () => 'Default slot' } }],

// Slot with props access
['with default slot using props', {
  slots: {
    default: (props: any) => `UI: ${JSON.stringify(props.ui)}`
  }
}],

// Multiple slots
['with all slots', {
  slots: {
    leading: () => 'Leading',
    default: () => 'Default',
    trailing: () => 'Trailing'
  }
}]
```

### Interactive Behavior Tests

```ts
test('with loading-auto works', async () => {
  let resolve: any | null = null
  const wrapper = await mountSuspended({
    components: { Button },
    setup() {
      function onClick() {
        return new Promise(res => resolve = res)
      }
      return { onClick }
    },
    template: `<Button loading-auto @click="onClick">Click</Button>`
  })

  const button = wrapper.find('button')
  button.trigger('click')
  await flushPromises()

  const icon = wrapper.findComponent({ name: 'Icon' })
  expect(icon.classes()).toContain('animate-spin')

  resolve?.(null)
})
```

### Form Integration Tests

```ts
test('works with UForm', async () => {
  const wrapper = await mountSuspended({
    components: { Input, UForm },
    setup() {
      const form = ref()
      return { form }
    },
    template: `
      <UForm :state="{}" ref="form">
        <Input name="test" />
      </UForm>
    `
  })

  // Test form integration
})
```

## Accessibility Testing

Always include accessibility tests:

```ts
it('passes accessibility tests', async () => {
  const wrapper = await mountSuspended(ComponentName, {
    props: {
      // Provide props that ensure accessible markup
      label: 'Accessible Label',
      // For images
      avatar: {
        src: 'https://example.com/image.png',
        alt: 'Description'
      }
    }
  })

  expect(await axe(wrapper.element)).toHaveNoViolations()
})
```

## Snapshot Updates

When component changes require snapshot updates:

1. Run tests: `pnpm run test`
2. Review changes carefully
3. Press `u` to update snapshots
4. Commit updated snapshots

**Never manually edit snapshot files.**

## Running Tests

```bash
# Run all tests
pnpm run test

# Run specific test file
pnpm run test Button

# Run with coverage
pnpm run test -- --coverage

# Watch mode
pnpm run test -- --watch
```
