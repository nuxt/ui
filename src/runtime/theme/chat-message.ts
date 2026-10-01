import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'group/message relative w-full',
    header: 'flex mb-1.5',
    container: 'relative flex items-start',
    body: 'min-w-0',
    leading: 'inline-flex items-center justify-center min-h-6',
    leadingIcon: 'shrink-0',
    leadingAvatar: 'shrink-0',
    files: 'flex items-center gap-1.5',
    content: 'relative text-pretty wrap-break-word *:first:mt-0 *:last:mb-0',
    actions: '[@media(hover:hover)]:opacity-0 group-hover/message:opacity-100 absolute bottom-0 flex items-center transition-opacity ease-out'
  },
  variants: {
    variant: {
      solid: {
        content: 'bg-accent text-accent-contrast'
      },
      outline: {
        content: 'text-accent-default bg-default ring ring-accent-strong'
      },
      soft: {
        content: 'bg-accent-soft text-accent-default'
      },
      subtle: {
        content: 'bg-accent-soft text-accent-default ring ring-accent-strong'
      },
      naked: {
        content: 'text-accent-default'
      }
    },
    color: colorVariant({ root: '' }),
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
        leadingIcon: 'size-5'
      },
      false: {
        root: 'scroll-mt-4 sm:scroll-mt-6',
        container: 'gap-3 pb-8',
        content: 'space-y-4',
        leadingIcon: 'size-8'
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
      body: 'w-full',
      content: 'w-full'
    }
  }],
  defaultVariants: {
    side: 'left',
    variant: 'naked',
    color: 'neutral'
  }
})
