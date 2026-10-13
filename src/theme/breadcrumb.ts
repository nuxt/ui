import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative min-w-0',
    list: 'flex items-center gap-1.5',
    item: 'flex min-w-0',
    link: 'group relative flex items-center gap-1.5 text-sm min-w-0 rounded-md',
    linkLeadingIcon: 'shrink-0 size-5',
    linkLeadingAvatar: 'shrink-0',
    linkLeadingAvatarSize: '2xs',
    linkLabel: 'truncate',
    separator: 'flex',
    separatorIcon: 'shrink-0 size-5 text-muted'
  },
  variants: {
    active: {
      true: {
        link: 'font-semibold'
      },
      false: {
        link: 'text-muted font-medium'
      }
    },
    disabled: {
      true: {
        link: 'cursor-not-allowed opacity-75'
      }
    },
    to: {
      true: ''
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, { link: `outline-${color}/25 focus-visible:outline-3` }])),
      neutral: { link: 'outline-inverted/25 focus-visible:outline-3' }
    }
  },
  compoundVariants: [{
    disabled: false,
    active: false,
    to: true,
    class: {
      link: ['hover:text-default', options.theme.transitions && 'transition-colors']
    }
  }, ...(options.theme.colors || []).map((color: string) => ({
    color,
    active: true,
    class: {
      link: `text-${color}`
    }
  })), {
    color: 'neutral',
    active: true,
    class: {
      link: 'text-highlighted'
    }
  }],
  defaultVariants: {
    color: 'primary'
  }
})
