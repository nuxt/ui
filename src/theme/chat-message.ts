import { colorVariant, colors } from './color'

export default {
  slots: {
    root: 'group/message relative w-full',
    header: 'flex mb-1.5',
    container: 'relative flex items-start',
    body: 'min-w-0',
    leading: 'inline-flex items-center justify-center min-h-6',
    leadingIcon: 'shrink-0',
    leadingAvatar: 'shrink-0',
    leadingAvatarSize: '',
    files: 'flex items-center gap-1.5',
    content: 'relative text-pretty wrap-break-word *:first:mt-0 *:last:mb-0',
    actions: '[@media(hover:hover)]:opacity-0 group-hover/message:opacity-100 absolute bottom-0 flex items-center transition-opacity ease-out'
  },
  variants: {
    variant: {
      solid: '',
      outline: '',
      soft: '',
      subtle: '',
      naked: ''
    },
    color: {
      ...colorVariant({ root: '' }),
      // Neutral keeps the inherited text color, so it has its own classes.
      neutral: ''
    },
    side: {
      left: {},
      right: {
        container: 'justify-end ms-auto max-w-[75%]',
        header: 'justify-end',
        actions: 'right-0'
      }
    },
    leading: {
      true: ''
    },
    actions: {
      true: ''
    },
    compact: {
      true: {
        root: 'scroll-mt-3',
        container: 'gap-1.5 pb-3',
        content: 'space-y-2',
        leadingIcon: 'size-5',
        leadingAvatarSize: '2xs'
      },
      false: {
        root: 'scroll-mt-4 sm:scroll-mt-6',
        container: 'gap-3 pb-8',
        content: 'space-y-4',
        leadingIcon: 'size-8',
        leadingAvatarSize: 'md'
      }
    }
  },
  compoundVariants: [{
    color: colors.filter(color => color !== 'neutral'),
    variant: 'solid',
    class: {
      content: 'bg-accent text-accent-foreground'
    }
  }, {
    color: colors.filter(color => color !== 'neutral'),
    variant: 'outline',
    class: {
      content: 'text-accent ring ring-accent-border-soft'
    }
  }, {
    color: colors.filter(color => color !== 'neutral'),
    variant: 'soft',
    class: {
      content: 'bg-accent-soft text-accent-soft-foreground'
    }
  }, {
    color: colors.filter(color => color !== 'neutral'),
    variant: 'subtle',
    class: {
      content: 'bg-accent-soft text-accent-soft-foreground ring ring-accent-border-soft'
    }
  }, {
    color: colors.filter(color => color !== 'neutral'),
    variant: 'naked',
    class: {
      content: 'text-accent'
    }
  }, {
    color: 'neutral',
    variant: 'solid',
    class: {
      content: 'bg-inverted text-inverted'
    }
  }, {
    color: 'neutral',
    variant: 'outline',
    class: {
      content: 'bg-default ring ring-default'
    }
  }, {
    color: 'neutral',
    variant: 'soft',
    class: {
      content: 'bg-elevated/50'
    }
  }, {
    color: 'neutral',
    variant: 'subtle',
    class: {
      content: 'bg-elevated/50 ring ring-default'
    }
  }, {
    compact: true,
    actions: true,
    class: {
      container: 'pb-8'
    }
  }, {
    variant: ['solid', 'outline', 'soft', 'subtle'],
    compact: false,
    class: {
      content: 'px-4 py-3 rounded-lg min-h-12',
      leading: 'mt-2'
    }
  }, {
    variant: ['solid', 'outline', 'soft', 'subtle'],
    compact: true,
    class: {
      content: 'px-2 py-1 rounded-lg min-h-8',
      leading: 'mt-1'
    }
  }, {
    variant: 'naked',
    side: 'left',
    class: {
      body: 'w-full',
      content: 'w-full'
    }
  }],
  defaultVariants: {
    side: 'left',
    variant: 'naked',
    color: 'neutral'
  }
}
