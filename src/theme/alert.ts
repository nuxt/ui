import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative overflow-hidden w-full rounded-lg p-4 flex gap-2.5',
    wrapper: 'min-w-0 flex-1 flex flex-col',
    title: 'text-sm font-medium',
    description: 'text-sm opacity-90',
    icon: 'shrink-0 size-5',
    avatar: 'shrink-0',
    avatarSize: '2xl',
    actions: 'flex flex-wrap gap-1.5 shrink-0',
    close: 'p-0'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: ''
    },
    variant: {
      solid: '',
      outline: '',
      soft: '',
      subtle: ''
    },
    orientation: {
      horizontal: {
        root: 'items-center',
        actions: 'items-center'
      },
      vertical: {
        root: 'items-start',
        actions: 'items-start mt-2.5'
      }
    },
    title: {
      true: {
        description: 'mt-1'
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'solid',
    class: {
      root: `bg-(--ui-${color}) text-(--ui-bg)`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'outline',
    class: {
      root: `text-(--ui-${color}) ring ring-inset ring-(--ui-${color})/25`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'soft',
    class: {
      root: `bg-(--ui-${color})/10 text-(--ui-${color})`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'subtle',
    class: {
      root: `bg-(--ui-${color})/10 text-(--ui-${color}) ring ring-inset ring-(--ui-${color})/25`
    }
  })), {
    color: 'neutral',
    variant: 'solid',
    class: {
      root: 'text-(--ui-bg) bg-(--ui-bg-inverted)'
    }
  }, {
    color: 'neutral',
    variant: 'outline',
    class: {
      root: 'text-(--ui-text-highlighted) bg-(--ui-bg) ring ring-inset ring-(--ui-border)'
    }
  }, {
    color: 'neutral',
    variant: 'soft',
    class: {
      root: 'text-(--ui-text-highlighted) bg-(--ui-bg-elevated)/50'
    }
  }, {
    color: 'neutral',
    variant: 'subtle',
    class: {
      root: 'text-(--ui-text-highlighted) bg-(--ui-bg-elevated)/50 ring ring-inset ring-(--ui-border-accented)'
    }
  }],
  defaultVariants: {
    color: 'primary',
    variant: 'solid'
  }
})
