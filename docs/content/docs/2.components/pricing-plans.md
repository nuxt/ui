---
title: PricingPlans
description: 'Display a list of pricing plans in a responsive grid layout.'
category: page
links:
  - label: GitHub
    icon: i-simple-icons-github
    to: https://github.com/nuxt/ui/blob/v4/src/runtime/components/PricingPlans.vue
---

## Usage

The PricingPlans component provides a flexible layout to display a list of [PricingPlan](/docs/components/pricing-plan) components using either the default slot or the `plans` prop.

```vue {2,8}
<template>
  <UPricingPlans>
    <UPricingPlan
      v-for="(plan, index) in plans"
      :key="index"
      v-bind="plan"
    />
  </UPricingPlans>
</template>
```

::tip
The grid columns will be automatically calculated based on the number of plans, this works with the `plans` prop but also with the default slot.
::

### Plans

Use the `plans` prop as an array of objects with the properties of the [PricingPlan](/docs/components/pricing-plan#props) component.

::component-code
---
collapse: true
ignore:
  - plans
external:
  - plans
externalTypes:
  - PricingPlanProps[]
props:
  plans:
    - title: Solo
      description: 'Tailored for indie hackers.'
      price: '$249'
      features:
        - 'One developer'
        - 'Lifetime access'
      button:
        label: 'Buy now'
    - title: Startup
      description: 'Best suited for small teams.'
      price: '$499'
      features:
        - 'Up to 5 developers'
        - 'Everything in Solo'
      button:
        label: 'Buy now'
    - title: Organization
      description: 'Ideal for larger teams and organizations.'
      price: '$999'
      features:
        - 'Up to 20 developers'
        - 'Everything in Startup'
      button:
        label: 'Buy now'
---
::

### Orientation

Use the `orientation` prop to change the orientation of the PricingPlans. Defaults to `horizontal`.

::component-code
---
collapse: true
hide:
  - class
ignore:
  - plans
external:
  - plans
externalTypes:
  - PricingPlanProps[]
props:
  orientation: vertical
  plans:
    - title: Solo
      description: 'Tailored for indie hackers.'
      price: '$249'
      features:
        - 'One developer'
        - 'Lifetime access'
      button:
        label: 'Buy now'
    - title: Startup
      description: 'Best suited for small teams.'
      price: '$499'
      features:
        - 'Up to 5 developers'
        - 'Everything in Solo'
      button:
        label: 'Buy now'
    - title: Organization
      description: 'Ideal for larger teams and organizations.'
      price: '$999'
      features:
        - 'Up to 20 developers'
        - 'Everything in Startup'
      button:
        label: 'Buy now'
  class: 'w-full'
---
::

::tip
When using the `plans` prop instead of the default slot, the `orientation` of the plans is automatically reversed, `horizontal` to `vertical` and vice versa.
::

### Compact

Use the `compact` prop to reduce the padding between the plans when one of the plans is scaled for a better visual balance.

::component-code
---
collapse: true
ignore:
  - plans
  - compact
external:
  - plans
externalTypes:
  - PricingPlanProps[]
class: 'p-8'
props:
  compact: true
  plans:
    - title: Solo
      description: 'Tailored for indie hackers.'
      price: '$249'
      features:
        - 'One developer'
        - 'Lifetime access'
      button:
        label: 'Buy now'
    - title: Startup
      description: 'Best suited for small teams.'
      price: '$499'
      scale: true
      features:
        - 'Up to 5 developers'
        - 'Everything in Solo'
      button:
        label: 'Buy now'
    - title: Organization
      description: 'Ideal for larger teams and organizations.'
      price: '$999'
      features:
        - 'Up to 20 developers'
        - 'Everything in Startup'
      button:
        label: 'Buy now'
---
::

### Scale

Use the `scale` prop to adjust the spacing between the plans when one of the plans is scaled for a better visual balance.

::component-code
---
collapse: true
ignore:
  - plans
  - scale
external:
  - plans
externalTypes:
  - PricingPlanProps[]
class: 'p-8'
props:
  scale: true
  plans:
    - title: Solo
      description: 'Tailored for indie hackers.'
      price: '$249'
      features:
        - 'One developer'
        - 'Lifetime access'
      button:
        label: 'Buy now'
    - title: Startup
      description: 'Best suited for small teams.'
      price: '$499'
      scale: true
      features:
        - 'Up to 5 developers'
        - 'Everything in Solo'
      button:
        label: 'Buy now'
    - title: Organization
      description: 'Ideal for larger teams and organizations.'
      price: '$999'
      features:
        - 'Up to 20 developers'
        - 'Everything in Startup'
      button:
        label: 'Buy now'
---
::

## Examples

::note
While these examples use [Nuxt Content](https://content.nuxt.com), the components can be integrated with any content management system.
::

### Within a page

Use the PricingPlans component in a page to create a pricing page:

```vue [pages/pricing/index.vue]{11}
<script setup lang="ts">
const { data: plans } = await useAsyncData('plans', () => queryCollection('plans').all())
</script>

<template>
  <UPage>
    <UPageHero title="Pricing" />

    <UPageBody>
      <UContainer>
        <UPricingPlans :plans="plans" />
      </UContainer>
    </UPageBody>
  </UPage>
</template>
```

::note
In this example, the `plans` are fetched using `queryCollection` from the `@nuxt/content` module.
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
