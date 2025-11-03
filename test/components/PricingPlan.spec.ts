import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import PricingPlan from '../../src/runtime/components/PricingPlan.vue'
import type { PricingPlanProps, PricingPlanSlots } from '../../src/runtime/components/PricingPlan.vue'
import ComponentRender from '../component-render'
import theme from '#build/ui/pricing-plan'

describe('PricingPlan', () => {
  const variants = Object.keys(theme.variants.variant) as any
  const orientations = Object.keys(theme.variants.orientation) as any

  const props = {
    title: 'Title',
    description: 'Description',
    badge: 'Badge',
    price: '$249',
    discount: '$199',
    billingCycle: '/month',
    billingPeriod: 'billed annually',
    features: [
      'Feature 1',
      'Feature 2',
      'Feature 3'
    ],
    button: {
      label: 'Buy now'
    },
    tagline: 'Tagline',
    terms: 'Terms'
  }

  it.each([
    // Props
    ['with title', { props: { title: 'Title' } }],
    ['with description', { props: { description: 'Description' } }],
    ['with badge', { props: { title: 'Title', badge: 'Badge' } }],
    ['with badge object', { props: { title: 'Title', badge: { label: 'Badge', color: 'primary' } } }],
    ['with price', { props: { price: '$249' } }],
    ['with discount', { props: { discount: '$199', price: '$249' } }],
    ['with billing cycle', { props: { discount: '$199', price: '$249', billingCycle: '/month' } }],
    ['with billing period', { props: { discount: '$199', price: '$249', billingPeriod: 'billed annually' } }],
    ['with features', { props: { features: ['Feature 1', 'Feature 2', 'Feature 3'] } }],
    ['with features object', { props: { features: [{ title: 'Feature 1', icon: 'i-lucide-info' }, { title: 'Feature 2', icon: 'i-lucide-check' }, { title: 'Feature 3', icon: 'i-lucide-star' }] } }],
    ['with button', { props: { button: { label: 'Buy now' } } }],
    ['with tagline', { props: { tagline: 'Tagline' } }],
    ['with terms', { props: { terms: 'Terms' } }],
    ['with scale', { props: { ...props, scale: true } }],
    ['with highlight', { props: { ...props, highlight: true } }],
    ...variants.map((variant: string) => [`with variant ${variant}`, { props: { ...props, variant } }]),
    ...orientations.map((orientation: string) => [`with orientation ${orientation}`, { props: { ...props, orientation } }]),
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'rounded-xl' } }],
    ['with ui', { props: { ...props, ui: { footer: 'gap-12' } } }],
    // Slots
    ['with badge slot', { props, slots: { badge: () => 'Badge slot' } }],
    ['with title slot', { props, slots: { title: () => 'Title slot' } }],
    ['with description slot', { props, slots: { description: () => 'Description slot' } }],
    ['with price slot', { props, slots: { price: () => 'Price slot' } }],
    ['with discount slot', { props, slots: { discount: () => 'Discount slot' } }],
    ['with billing slot', { props, slots: { billing: () => 'Billing slot' } }],
    ['with features slot', { props, slots: { features: () => 'Features slot' } }],
    ['with button slot', { props, slots: { button: () => 'Button slot' } }],
    ['with tagline slot', { props, slots: { tagline: () => 'Tagline slot' } }],
    ['with terms slot', { props, slots: { terms: () => 'Terms slot' } }],
    ['with header slot', { props, slots: { header: () => 'Header slot' } }],
    ['with body slot', { props, slots: { body: () => 'Body slot' } }],
    ['with footer slot', { props, slots: { footer: () => 'Footer slot' } }]
  ])('renders %s correctly', async (nameOrHtml: string, options: { props?: PricingPlanProps, slots?: Partial<PricingPlanSlots> }) => {
    const html = await ComponentRender(nameOrHtml, options, PricingPlan)
    expect(html).toMatchSnapshot()
  })

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(PricingPlan, {
      props: {
        title: 'Title',
        description: 'Description',
        price: '$99',
        features: ['Feature 1', 'Feature 2'],
        badge: 'Badge',
        discount: '30$'

      }
    })
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
