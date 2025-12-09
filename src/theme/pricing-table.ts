export default {
  slots: {
    root: 'w-full relative',
    table: 'w-full table-fixed border-separate border-spacing-x-0 hidden md:table',
    list: 'md:hidden flex flex-col gap-6 w-full',
    item: 'p-6 flex flex-col border border-default rounded-lg',
    caption: 'sr-only',
    thead: '',
    tbody: '',
    tr: '',
    th: 'py-4 font-normal text-left border-b border-default',
    td: 'px-6 py-4 text-center border-b border-default',
    tier: 'p-6 text-left font-normal',
    tierTitleWrapper: 'flex items-center gap-3',
    tierTitle: 'text-lg font-semibold text-highlighted',
    tierDescription: 'text-sm font-normal text-muted mt-1',
    tierBadge: 'truncate',
    tierPriceWrapper: 'flex items-center gap-1 mt-4',
    tierPrice: 'text-highlighted text-3xl sm:text-4xl font-semibold',
    tierDiscount: 'text-muted line-through text-xl sm:text-2xl',
    tierBilling: 'flex flex-col justify-between min-w-0',
    tierBillingPeriod: 'text-toned truncate text-xs font-medium',
    tierBillingCycle: 'text-muted truncate text-xs font-medium',
    tierButton: 'mt-6',
    tierFeatureIcon: 'size-5 shrink-0',
    section: 'mt-6 flex flex-col gap-2',
    sectionTitle: 'font-semibold text-sm text-highlighted',
    feature: 'flex items-center justify-between gap-1',
    featureTitle: 'text-sm text-default',
    featureValue: 'text-sm text-muted flex justify-center min-w-5'
  },
  variants: {
    section: {
      true: {
        tr: '*:pt-8'
      }
    },
    active: {
      true: {
        tierFeatureIcon: 'text-primary'
      }
    },
    highlight: {
      true: {
        tier: 'bg-elevated/50 border-x border-t border-default rounded-t-lg',
        td: 'bg-elevated/50 border-x border-default',
        item: 'bg-elevated/50'
      }
    }
  }
}
