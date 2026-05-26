import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
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
    actions: ['[@media(hover:hover)]:opacity-0 group-hover/message:opacity-100 absolute bottom-0 flex items-center', options.theme.transitions && 'transition-opacity']
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
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
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
      content: 'w-full'
    }
  }, ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'solid',
    class: {
      content: `bg-${color} text-inverted`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'outline',
    class: {
      content: `text-${color} ring ring-${color}/25`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'soft',
    class: {
      content: `bg-${color}/10 text-${color}`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'subtle',
    class: {
      content: `bg-${color}/10 text-${color} ring ring-${color}/25`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'naked',
    class: {
      content: `text-${color}`
    }
  })), {
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
  }],
  defaultVariants: {
    side: 'left',
    variant: 'naked',
    color: 'neutral'
  }
})
