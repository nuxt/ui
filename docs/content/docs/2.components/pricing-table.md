---
title: PricingTable
description: 'A responsive pricing table component that displays tiered pricing plans with feature comparisons.'
category: page
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/PricingTable.vue
---

## Usage

The PricingTable component provides a responsive and customizable way to display pricing plans in a table format, automatically switching between a horizontal table layout on desktop for easy comparison and a vertical card layout on mobile for better readability.

::code-preview

::u-pricing-table
---
tiers:
  - id: 'solo'
    title: 'Solo'
    description: 'For indie hackers.'
    price: '$249'
    billingCycle: '/month'
    billingPeriod: 'billed annually'
    badge: 'Most popular'
    button:
      label: 'Buy now'
      variant: 'subtle'
  - id: 'team'
    title: 'Team'
    description: 'For growing teams.'
    price: '$499'
    billingCycle: '/month'
    billingPeriod: 'billed annually'
    button:
      label: 'Buy now'
    highlight: true
  - id: 'enterprise'
    title: 'Enterprise'
    description: 'For large organizations.'
    price: 'Custom'
    button:
      label: 'Contact sales'
      color: 'neutral'
sections:
  - title: 'Features'
    features:
      - title: 'Number of developers'
        tiers:
          solo: '1'
          team: '5'
          enterprise: 'Unlimited'
      - title: 'Projects'
        tiers:
          solo: true
          team: true
          enterprise: true
      - title: 'GitHub repository access'
        tiers:
          solo: true
          team: true
          enterprise: true
      - title: 'Updates'
        tiers:
          solo: 'Patch & minor'
          team: 'All updates'
          enterprise: 'All updates'
      - title: 'Support'
        tiers:
          solo: 'Community'
          team: 'Priority'
          enterprise: '24/7'
  - title: 'Security'
    features:
      - title: 'SSO'
        tiers:
          solo: false
          team: true
          enterprise: true
      - title: 'Audit logs'
        tiers:
          solo: false
          team: true
          enterprise: true
      - title: 'Custom security review'
        tiers:
          solo: false
          team: false
          enterprise: true
---
::

::

### Tiers

Use the `tiers` prop as an array of objects to define your pricing plans. Each tier object supports the following properties:

- `id: string`{lang="ts-type"} - Unique identifier for the tier (required)
- `title?: string`{lang="ts-type"} - Name of the pricing plan
- `description?: string`{lang="ts-type"} - Short description of the plan
- `price?: string`{lang="ts-type"} - The current price of the plan (e.g., "$99", "€99", "Free")
- `discount?: string`{lang="ts-type"} - The discounted price that will display the `price` with strikethrough (e.g., "$79", "€79")
- `billingCycle?: string`{lang="ts-type"} - The unit price period that appears next to the price (e.g., "/month", "/seat/month")
- `billingPeriod?: string`{lang="ts-type"} - Additional billing context that appears above the billing cycle (e.g., "billed monthly")
- `badge?: string | BadgeProps`{lang="ts-type"} - Display a badge next to the title `{ color: 'primary', variant: 'subtle' }`{lang="ts-type"}
- `button?: ButtonProps`{lang="ts-type"} - Configure the CTA button `{ size: 'lg', block: true }`{lang="ts-type"}
- `highlight?: boolean`{lang="ts-type"} - Whether to visually emphasize this tier as the recommended option

::component-code
---
prettier: true
collapse: true
external:
  - tiers
externalTypes:
  - PricingTableTier[]
hide:
  - class
ignore:
  - tiers
props:
  tiers:
    - id: 'solo'
      title: 'Solo'
      description: 'For indie hackers.'
      price: '$249'
      billingCycle: '/month'
      billingPeriod: 'billed annually'
      badge: 'Most popular'
      button:
        label: 'Buy now'
        variant: 'subtle'
    - id: 'team'
      title: 'Team'
      description: 'For growing teams.'
      price: '$499'
      billingCycle: '/month'
      billingPeriod: 'billed annually'
      button:
        label: 'Buy now'
      highlight: true
    - id: 'enterprise'
      title: 'Enterprise'
      description: 'For large organizations.'
      price: 'Custom'
      button:
        label: 'Contact sales'
        color: 'neutral'
  class: 'border-b border-default'
---
::

### Sections

Use the `sections` prop to organize features into logical groups. Each section represents a category of features that you want to compare across different pricing tiers.

- `title: string`{lang="ts-type"} - The heading for the feature section
- `features: PricingTableSectionFeature[]`{lang="ts-type"} - An array of features with their availability in each tier:
  - Each feature requires a `title` and a `tiers` object mapping tier IDs to values
  - Boolean values (`true`/`false`) will display as checkmarks (✓) or minus icons (-)
  - String values will be shown as text (e.g., "Unlimited", "Up to 5 users")
  - Numeric values will be displayed as is (e.g., 10, 100)

::component-code
---
prettier: true
collapse: true
external:
  - tiers
  - sections
externalTypes:
  - PricingTableTier[]
  - PricingTableSection[]
hide:
  - class
ignore:
  - tiers
  - sections
props:
  tiers:
    - id: 'solo'
      title: 'Solo'
      price: '$249'
      description: 'For indie hackers.'
      billingCycle: '/month'
      button:
        label: 'Buy now'
        variant: 'subtle'
    - id: 'team'
      title: 'Team'
      price: '$499'
      description: 'For growing teams.'
      billingCycle: '/month'
      button:
        label: 'Buy now'
    - id: 'enterprise'
      title: 'Enterprise'
      price: 'Custom'
      description: 'For large organizations.'
      button:
        label: 'Contact sales'
        color: 'neutral'
  sections:
    - title: 'Features'
      features:
        - title: 'Number of developers'
          tiers:
            solo: '1'
            team: '5'
            enterprise: 'Unlimited'
        - title: 'Projects'
          tiers:
            solo: true
            team: true
            enterprise: true
    - title: 'Security'
      features:
        - title: 'SSO'
          tiers:
            solo: false
            team: true
            enterprise: true
---
::

## Examples

### With slots

The PricingTable component provides powerful slot customization options to tailor the display of your content. You can customize individual elements using generic slots or target specific items using their IDs.

::component-example
---
prettier: true
name: 'pricing-table-slots-example'
collapse: true
---
::

The component supports various slot types for maximum customization flexibility:

| Slot Type | Pattern | Description | Example |
|-----------|---------|-------------|---------|
| **Tier slots** | `#{tier-id}-{element}` | Target specific tiers | `#team-title`, `#solo-price` |
| **Section slots** | `#section-{id\|formatted-title}-title` | Target specific sections | `#section-features-title` |
| **Feature slots** | `#feature-{id\|formatted-title}-{title\|value}` | Target specific features | `#feature-developers-title` |
| **Generic slots** | `#tier-title`, `#section-title`, etc. | Apply to all items | `#feature-value` |

::note
When no `id` is provided, the slot name is auto-generated from the title (e.g., "Premium Features!" becomes `#section-premium-features-title`).
::

## API

### Props

:component-props

### Slots

:component-slots

## Theme

:component-theme

## Changelog

:component-changelog
