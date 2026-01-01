export default {
  slots: {
    root: 'relative grid rounded-lg p-6 lg:p-8 xl:p-10 gap-6',
    header: '',
    body: 'flex flex-col min-w-0',
    footer: 'flex flex-col gap-6 items-center',
    titleWrapper: 'flex items-center gap-3',
    title: 'text-highlighted text-2xl sm:text-3xl text-pretty font-semibold',
    description: 'text-muted text-base text-pretty mt-2',
    priceWrapper: 'flex items-center gap-1',
    price: 'text-highlighted text-3xl sm:text-4xl font-semibold',
    discount: 'text-muted line-through text-xl sm:text-2xl',
    billing: 'flex flex-col justify-between min-w-0',
    billingPeriod: 'text-toned truncate text-xs font-medium',
    billingCycle: 'text-muted truncate text-xs font-medium',
    features: 'flex flex-col gap-3 flex-1 mt-6 grow-0',
    feature: 'flex items-center gap-2 min-w-0',
    featureIcon: 'size-5 shrink-0 text-primary',
    featureTitle: 'text-muted text-sm truncate',
    badge: '',
    button: '',
    tagline: 'text-base font-semibold text-default',
    terms: 'text-xs/5 text-muted text-center text-balance'
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'grid-cols-1 lg:grid-cols-3 justify-between divide-y lg:divide-y-0 lg:divide-x divide-default',
        body: 'lg:col-span-2 pb-6 lg:pb-0 lg:pr-6 justify-center',
        footer: 'lg:justify-center lg:items-center lg:p-6 lg:max-w-xs lg:w-full lg:mx-auto',
        features: 'lg:grid lg:grid-cols-2 lg:mt-12'
      },
      vertical: {
        footer: 'justify-end',
        priceWrapper: 'mt-6'
      }
    },
    variant: {
      solid: {
        root: 'bg-inverted',
        title: 'text-inverted',
        description: 'text-dimmed',
        price: 'text-inverted',
        discount: 'text-dimmed',
        billingCycle: 'text-dimmed',
        billingPeriod: 'text-dimmed',
        featureTitle: 'text-dimmed'
      },
      outline: {
        root: 'bg-default ring ring-default'
      },
      soft: {
        root: 'bg-elevated/50'
      },
      subtle: {
        root: 'bg-elevated/50 ring ring-default'
      }
    },
    highlight: {
      true: {
        root: 'ring-2 ring-inset ring-primary'
      }
    },
    scale: {
      true: {
        root: 'lg:scale-[1.1] lg:z-[1]'
      }
    }
  },
  compoundVariants: [{
    orientation: 'horizontal',
    variant: 'soft',
    class: {
      root: 'divide-accented'
    }
  }, {
    orientation: 'horizontal',
    variant: 'subtle',
    class: {
      root: 'divide-accented'
    }
  }],
  defaultVariants: {
    variant: 'outline'
  }
}
