import { describe, it, expect } from 'vitest'
import { axe } from 'vitest-axe'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import { renderEach } from '../component-render'
import PricingTable from '../../src/runtime/components/PricingTable.vue'
import type { PricingTableTier, PricingTableSection } from '../../src/runtime/components/PricingTable.vue'

describe('PricingTable', () => {
  const tiers = [{
    id: 'free' as const,
    title: 'Free',
    description: 'For personal and small teams',
    price: '$0',
    button: {
      label: 'Get started',
      variant: 'subtle'
    }
  }, {
    id: 'pro' as const,
    title: 'Pro',
    description: 'For medium and large teams',
    price: '$9',
    billingCycle: '/month',
    billingPeriod: 'billed annually',
    highlight: true,
    badge: 'Most popular',
    button: {
      label: 'Get started'
    }
  }, {
    id: 'enterprise' as const,
    title: 'Enterprise',
    description: 'For large enterprises',
    price: 'Custom',
    button: {
      label: 'Contact us',
      variant: 'subtle'
    }
  }] satisfies PricingTableTier[]

  const sections = [{
    title: 'Features',
    features: [{
      title: 'Unlimited projects',
      tiers: { free: true, pro: true, enterprise: true }
    }, {
      title: 'Unlimited members',
      tiers: { free: 4, pro: true, enterprise: true }
    }, {
      title: 'Unlimited integrations',
      tiers: { free: 1, pro: 10, enterprise: true }
    }]
  }, {
    title: 'Support',
    features: [{
      title: 'Email support',
      tiers: { free: true, pro: true, enterprise: true }
    }, {
      title: '24/7 support',
      tiers: { free: false, pro: true, enterprise: 'Enterprise' }
    }]
  }] satisfies PricingTableSection<typeof tiers[number]>[]

  const props = { tiers, sections }

  renderEach(PricingTable, [
    // Props
    ['with tiers and sections', { props }],
    ['with caption', { props: { ...props, caption: 'Caption' } }],
    ['with as', { props: { ...props, as: 'section' } }],
    ['with class', { props: { ...props, class: 'max-w-sm' } }],
    ['with ui', { props: { ...props, ui: { table: 'table-auto' } } }],
    // Slots
    ['with caption slot', { props, slots: { caption: () => 'Caption slot' } }],
    ['with tier slot', { props, slots: { tier: () => 'Tier slot' } }],
    ['with tier-title slot', { props, slots: { 'tier-title': () => 'Tier title slot' } }],
    ['with tier-description slot', { props, slots: { 'tier-description': () => 'Tier description slot' } }],
    ['with tier-badge slot', { props, slots: { 'tier-badge': () => 'Tier badge slot' } }],
    ['with tier-button slot', { props, slots: { 'tier-button': () => 'Tier button slot' } }],
    ['with tier-billing slot', { props, slots: { 'tier-billing': () => 'Tier billing slot' } }],
    ['with tier-discount slot', { props, slots: { 'tier-discount': () => 'Tier discount slot' } }],
    ['with tier-price slot', { props, slots: { 'tier-price': () => 'Tier price slot' } }]
  ])

  it('passes accessibility tests', async () => {
    const wrapper = await mountSuspended(PricingTable, {
      props: {
        ...props,
        captions: 'Caption'
      }
    })
    expect(await axe(wrapper.element)).toHaveNoViolations()
  })
})
