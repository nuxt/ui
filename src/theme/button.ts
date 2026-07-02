import type { ModuleOptions } from '../module'
import { fieldGroupVariant } from './field-group'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    base: ['rounded-md font-medium inline-flex items-center disabled:cursor-not-allowed aria-disabled:cursor-not-allowed disabled:opacity-75 aria-disabled:opacity-75', options.theme.transitions && 'transition-colors'],
    label: 'truncate',
    leadingIcon: 'shrink-0',
    leadingAvatar: 'shrink-0',
    leadingAvatarSize: '',
    trailingIcon: 'shrink-0'
  },
  variants: {
    ...fieldGroupVariant,
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: ''
    },
    variant: {
      solid: '',
      outline: '',
      soft: '',
      subtle: '',
      ghost: '',
      link: ''
    },
    size: {
      '3xs': {
        base: 'px-1 py-0.5 text-[8px]/3 gap-1 rounded-sm',
        leadingIcon: 'size-3',
        leadingAvatarSize: '3xs',
        trailingIcon: 'size-3'
      },
      '2xs': {
        base: 'px-1.5 py-1 text-[10px]/3 gap-1 rounded-sm',
        leadingIcon: 'size-3',
        leadingAvatarSize: '3xs',
        trailingIcon: 'size-3'
      },
      'xs': {
        base: 'px-2 py-1 text-xs gap-1',
        leadingIcon: 'size-4',
        leadingAvatarSize: '3xs',
        trailingIcon: 'size-4'
      },
      'sm': {
        base: 'px-2.5 py-1.5 text-xs gap-1.5',
        leadingIcon: 'size-4',
        leadingAvatarSize: '3xs',
        trailingIcon: 'size-4'
      },
      'md': {
        base: 'px-2.5 py-1.5 text-sm gap-1.5',
        leadingIcon: 'size-5',
        leadingAvatarSize: '2xs',
        trailingIcon: 'size-5'
      },
      'lg': {
        base: 'px-3 py-2 text-sm gap-2',
        leadingIcon: 'size-5',
        leadingAvatarSize: '2xs',
        trailingIcon: 'size-5'
      },
      'xl': {
        base: 'px-3 py-2 text-base gap-2',
        leadingIcon: 'size-6',
        leadingAvatarSize: 'xs',
        trailingIcon: 'size-6'
      }
    },
    block: {
      true: {
        base: 'w-full justify-center',
        trailingIcon: 'ms-auto'
      }
    },
    square: {
      true: ''
    },
    leading: {
      true: ''
    },
    trailing: {
      true: ''
    },
    loading: {
      true: ''
    },
    active: {
      true: {
        base: ''
      },
      false: {
        base: ''
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'solid',
    class: `text-inverted bg-${color} hover:bg-${color}/75 active:bg-${color}/75 disabled:bg-${color} aria-disabled:bg-${color} outline-${color}/25 focus-visible:outline-3`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'outline',
    class: `ring ring-inset ring-${color}/50 text-${color} hover:bg-${color}/10 active:bg-${color}/10 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent outline-${color}/25 focus-visible:outline-3 focus-visible:ring-${color}`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'soft',
    class: `text-${color} bg-${color}/10 hover:bg-${color}/15 active:bg-${color}/15 outline-${color}/25 focus-visible:outline-3 disabled:bg-${color}/10 aria-disabled:bg-${color}/10`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'subtle',
    class: `text-${color} ring ring-inset ring-${color}/25 bg-${color}/10 hover:bg-${color}/15 active:bg-${color}/15 disabled:bg-${color}/10 aria-disabled:bg-${color}/10 outline-${color}/25 focus-visible:outline-3 focus-visible:ring-${color}`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'ghost',
    class: `text-${color} hover:bg-${color}/10 active:bg-${color}/10 outline-${color}/25 focus-visible:outline-3 disabled:bg-transparent aria-disabled:bg-transparent dark:disabled:bg-transparent dark:aria-disabled:bg-transparent`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'link',
    class: `text-${color} hover:text-${color}/75 active:text-${color}/75 disabled:text-${color} aria-disabled:text-${color} outline-${color}/25 focus-visible:outline-3`
  })), {
    color: 'neutral',
    variant: 'solid',
    class: 'text-inverted bg-inverted hover:bg-inverted/90 active:bg-inverted/90 disabled:bg-inverted aria-disabled:bg-inverted outline-inverted/25 focus-visible:outline-3'
  }, {
    color: 'neutral',
    variant: 'outline',
    class: 'ring ring-inset ring-accented text-default bg-default hover:bg-elevated active:bg-elevated disabled:bg-default aria-disabled:bg-default outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted'
  }, {
    color: 'neutral',
    variant: 'soft',
    class: 'text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 outline-inverted/25 focus-visible:outline-3 disabled:bg-elevated aria-disabled:bg-elevated'
  }, {
    color: 'neutral',
    variant: 'subtle',
    class: 'ring ring-inset ring-accented text-default bg-elevated hover:bg-accented/75 active:bg-accented/75 disabled:bg-elevated aria-disabled:bg-elevated outline-inverted/25 focus-visible:outline-3 focus-visible:ring-inverted'
  }, {
    color: 'neutral',
    variant: 'ghost',
    class: 'text-default hover:bg-elevated active:bg-elevated outline-inverted/25 focus-visible:outline-3 hover:disabled:bg-transparent dark:hover:disabled:bg-transparent hover:aria-disabled:bg-transparent dark:hover:aria-disabled:bg-transparent'
  }, {
    color: 'neutral',
    variant: 'link',
    class: 'text-muted hover:text-default active:text-default disabled:text-muted aria-disabled:text-muted outline-inverted/25 focus-visible:outline-3'
  }, {
    size: '3xs',
    square: true,
    class: 'p-0.5'
  }, {
    size: '2xs',
    square: true,
    class: 'p-1'
  }, {
    size: 'xs',
    square: true,
    class: 'p-1'
  }, {
    size: 'sm',
    square: true,
    class: 'p-1.5'
  }, {
    size: 'md',
    square: true,
    class: 'p-1.5'
  }, {
    size: 'lg',
    square: true,
    class: 'p-2'
  }, {
    size: 'xl',
    square: true,
    class: 'p-2'
  }, {
    loading: true,
    leading: true,
    class: {
      leadingIcon: 'animate-spin'
    }
  }, {
    loading: true,
    leading: false,
    trailing: true,
    class: {
      trailingIcon: 'animate-spin'
    }
  }],
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md'
  }
})
