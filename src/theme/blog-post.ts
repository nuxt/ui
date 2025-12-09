import type { NuxtOptions } from '@nuxt/schema'

export default (options: Required<NuxtOptions['ui']>) => ({
  slots: {
    root: 'relative group/blog-post flex flex-col rounded-lg overflow-hidden',
    header: 'relative overflow-hidden aspect-[16/9] w-full pointer-events-none',
    body: 'min-w-0 flex-1 flex flex-col',
    footer: '',
    image: 'object-cover object-top w-full h-full',
    title: 'text-xl text-pretty font-semibold text-highlighted',
    description: 'mt-1 text-base text-pretty',
    authors: 'pt-4 mt-auto flex flex-wrap gap-x-3 gap-y-1.5',
    avatar: '',
    meta: 'flex items-center gap-2 mb-2',
    date: 'text-sm',
    badge: ''
  },
  variants: {
    orientation: {
      horizontal: {
        root: 'lg:grid lg:grid-cols-2 lg:items-center gap-x-8',
        body: 'justify-center p-4 sm:p-6 lg:px-0'
      },
      vertical: {
        root: 'flex flex-col',
        body: 'p-4 sm:p-6'
      }
    },
    variant: {
      outline: {
        root: 'bg-default ring ring-default',
        date: 'text-toned',
        description: 'text-muted'
      },
      soft: {
        root: 'bg-elevated/50',
        date: 'text-muted',
        description: 'text-toned'
      },
      subtle: {
        root: 'bg-elevated/50 ring ring-default',
        date: 'text-muted',
        description: 'text-toned'
      },
      ghost: {
        date: 'text-toned',
        description: 'text-muted',
        header: 'shadow-lg rounded-lg'
      },
      naked: {
        root: 'p-0 sm:p-0',
        date: 'text-toned',
        description: 'text-muted',
        header: 'shadow-lg rounded-lg'
      }
    },
    to: {
      true: {
        root: [options.theme.transitions && 'transition'],
        image: 'transform transition-transform duration-200 group-hover/blog-post:scale-110',
        avatar: 'transform transition-transform duration-200 hover:scale-115'
      }
    },
    image: {
      true: ''
    }
  },
  compoundVariants: [{
    variant: 'outline',
    to: true,
    class: {
      root: 'hover:bg-elevated/50'
    }
  }, {
    variant: 'soft',
    to: true,
    class: {
      root: 'hover:bg-elevated'
    }
  }, {
    variant: 'subtle',
    to: true,
    class: {
      root: 'hover:bg-elevated hover:ring-accented'
    }
  }, {
    variant: 'ghost',
    to: true,
    class: {
      root: 'hover:bg-elevated/50',
      header: ['group-hover/blog-post:shadow-none', options.theme.transitions && 'transition-all']
    }
  }, {
    variant: 'ghost',
    to: true,
    orientation: 'vertical',
    class: {
      header: 'group-hover/blog-post:rounded-b-none'
    }
  }, {
    variant: 'ghost',
    to: true,
    orientation: 'horizontal',
    class: {
      header: 'group-hover/blog-post:rounded-r-none'
    }
  }, {
    orientation: 'vertical',
    image: false,
    variant: 'naked',
    class: {
      body: 'p-0 sm:p-0'
    }
  }],
  defaultVariants: {
    variant: 'outline'
  }
})
