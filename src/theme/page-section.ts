export default {
  slots: {
    root: 'relative isolate',
    container: 'flex flex-col lg:grid py-16 sm:py-24 lg:py-32 gap-8 sm:gap-16',
    wrapper: '',
    header: '',
    leading: 'flex items-center mb-6',
    leadingIcon: 'size-10 shrink-0 text-primary',
    headline: 'mb-3',
    title: 'text-3xl sm:text-4xl lg:text-5xl text-pretty tracking-tight font-bold text-highlighted',
    description: 'text-base sm:text-lg text-muted',
    body: 'mt-8',
    features: 'grid',
    footer: 'mt-8',
    links: 'flex flex-wrap gap-x-6 gap-y-3'
  },
  variants: {
    orientation: {
      horizontal: {
        container: 'lg:grid-cols-2 lg:items-center',
        description: 'text-pretty',
        features: 'gap-4'
      },
      vertical: {
        container: '',
        headline: 'justify-center',
        leading: 'justify-center',
        title: 'text-center',
        description: 'text-center text-balance',
        links: 'justify-center',
        features: 'sm:grid-cols-2 lg:grid-cols-3 gap-8'
      }
    },
    reverse: {
      true: {
        wrapper: 'lg:order-last'
      }
    },
    headline: {
      true: {
        headline: 'font-semibold text-primary flex items-center gap-1.5'
      }
    },
    title: {
      true: {
        description: 'mt-6'
      }
    },
    description: {
      true: ''
    },
    body: {
      true: ''
    }
  },
  compoundVariants: [{
    orientation: 'vertical',
    title: true,
    class: {
      body: 'mt-16'
    }
  }, {
    orientation: 'vertical',
    description: true,
    class: {
      body: 'mt-16'
    }
  }, {
    orientation: 'vertical',
    body: true,
    class: {
      footer: 'mt-16'
    }
  }]
}
