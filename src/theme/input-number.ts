import type { ModuleOptions } from '../module'
import inputTheme from './input'
import { fieldGroupVariantWithRoot } from './field-group'

export default (options: Required<ModuleOptions>) => {
  const input = inputTheme(options)

  return {
    slots: {
      root: 'relative inline-flex items-center',
      base: ['w-full rounded-md border-0 placeholder:text-dimmed focus:outline-none disabled:cursor-not-allowed disabled:opacity-75', options.theme.transitions && 'transition-colors'],
      increment: 'absolute flex items-center',
      decrement: 'absolute flex items-center'
    },
    variants: {
      ...fieldGroupVariantWithRoot,
      color: {
        ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
        neutral: ''
      },
      size: {
        xs: 'px-2 py-1 text-xs gap-1',
        sm: 'px-2.5 py-1.5 text-xs gap-1.5',
        md: 'px-2.5 py-1.5 text-sm gap-1.5',
        lg: 'px-3 py-2 text-sm gap-2',
        xl: 'px-3 py-2 text-base gap-2'
      },
      variant: {
        ...input.variants.variant
      },
      disabled: {
        true: {
          increment: 'opacity-75 cursor-not-allowed',
          decrement: 'opacity-75 cursor-not-allowed'
        }
      },
      orientation: {
        horizontal: {
          base: 'text-center',
          increment: 'inset-y-0 end-0 pe-1',
          decrement: 'inset-y-0 start-0 ps-1'
        },
        vertical: {
          increment: 'top-0 end-0 pe-1 [&>button]:py-0 scale-80',
          decrement: 'bottom-0 end-0 pe-1 [&>button]:py-0 scale-80'
        }
      },
      highlight: {
        true: ''
      },
      increment: {
        false: ''
      },
      decrement: {
        false: ''
      }
    },
    compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
      color,
      variant: ['outline', 'subtle'],
      class: `focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-${color}`
    })), ...(options.theme.colors || []).map((color: string) => ({
      color,
      highlight: true,
      class: `ring ring-inset ring-${color}`
    })), {
      color: 'neutral',
      variant: ['outline', 'subtle'],
      class: 'focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-inverted'
    }, {
      color: 'neutral',
      highlight: true,
      class: 'ring ring-inset ring-inverted'
    }, {
      orientation: 'horizontal',
      size: 'xs',
      decrement: true,
      increment: true,
      class: 'px-7'
    }, {
      orientation: 'horizontal',
      size: 'sm',
      decrement: true,
      increment: true,
      class: 'px-8'
    }, {
      orientation: 'horizontal',
      size: 'md',
      decrement: true,
      increment: true,
      class: 'px-9'
    }, {
      orientation: 'horizontal',
      size: 'lg',
      decrement: true,
      increment: true,
      class: 'px-10'
    }, {
      orientation: 'horizontal',
      size: 'xl',
      decrement: true,
      increment: true,
      class: 'px-11'
    },
    {
      orientation: 'horizontal',
      size: 'xs',
      decrement: false,
      increment: true,
      class: 'pe-7'
    }, {
      orientation: 'horizontal',
      size: 'sm',
      decrement: false,
      increment: true,
      class: 'pe-8'
    }, {
      orientation: 'horizontal',
      size: 'md',
      decrement: false,
      increment: true,
      class: 'pe-9'
    }, {
      orientation: 'horizontal',
      size: 'lg',
      decrement: false,
      increment: true,
      class: 'pe-10'
    }, {
      orientation: 'horizontal',
      size: 'xl',
      decrement: false,
      increment: true,
      class: 'pe-11'
    }, {
      orientation: 'horizontal',
      size: 'xs',
      decrement: true,
      increment: false,
      class: 'ps-7'
    }, {
      orientation: 'horizontal',
      size: 'sm',
      decrement: true,
      increment: false,
      class: 'ps-8'
    }, {
      orientation: 'horizontal',
      size: 'md',
      decrement: true,
      increment: false,
      class: 'ps-9'
    }, {
      orientation: 'horizontal',
      size: 'lg',
      decrement: true,
      increment: false,
      class: 'ps-10'
    }, {
      orientation: 'horizontal',
      size: 'xl',
      decrement: true,
      increment: false,
      class: 'ps-11'
    }, {
      orientation: 'vertical',
      size: 'xs',
      class: 'pe-7'
    }, {
      orientation: 'vertical',
      size: 'sm',
      class: 'pe-8'
    }, {
      orientation: 'vertical',
      size: 'md',
      class: 'pe-9'
    }, {
      orientation: 'vertical',
      size: 'lg',
      class: 'pe-10'
    }, {
      orientation: 'vertical',
      size: 'xl',
      class: 'pe-11'
    },
    {
      orientation: 'vertical',
      increment: false,
      decrement: false,
      class: 'pe-0'
    },
    {
      orientation: 'horizontal',
      decrement: false,
      class: 'text-start'
    }],
    defaultVariants: {
      size: 'md',
      color: 'primary',
      variant: 'outline'
    }
  }
}
