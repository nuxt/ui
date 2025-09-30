import type { NuxtOptions } from '@nuxt/schema'

export default (options: Required<NuxtOptions['ui']>) => ({
  slots: {
    root: 'group/message relative w-full',
    container: 'relative flex items-start group-data-[role=user]/message:max-w-[75%]',
    leading: 'inline-flex items-center justify-center min-h-6',
    leadingIcon: 'shrink-0',
    leadingAvatar: 'shrink-0',
    leadingAvatarSize: '',
    content: 'relative text-pretty min-w-0',
    actions: ['opacity-0 group-hover/message:opacity-100 absolute bottom-0 flex items-center', options.theme.transitions && 'transition-opacity']
  },
  variants: {
    variant: {
      solid: {
        content: 'bg-inverted text-inverted'
      },
      outline: {
        content: 'bg-default ring ring-default'
      },
      soft: {
        content: 'bg-elevated/50'
      },
      subtle: {
        content: 'bg-elevated/50 ring ring-default'
      },
      naked: {
        content: ''
      }
    },
    side: {
      left: {
        container: 'rtl:justify-end'
      },
      right: {
        container: 'ltr:justify-end ms-auto'
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
        leadingIcon: 'size-5',
        leadingAvatarSize: '2xs'
      },
      false: {
        root: 'scroll-mt-4 sm:scroll-mt-6',
        container: 'gap-3 pb-8',
        leadingIcon: 'size-8',
        leadingAvatarSize: 'md'
      }
    }
  },
  compoundVariants: [{
    compact: true,
    actions: true,
    class: {
      container: 'pb-8'
    }
  }, {
    leading: true,
    compact: false,
    side: 'left',
    class: {
      actions: 'left-11'
    }
  }, {
    leading: true,
    compact: true,
    side: 'left',
    class: {
      actions: 'left-6.5'
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
  }],
  defaultVariants: {
    variant: 'naked'
  }
})
