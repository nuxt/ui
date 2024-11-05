import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    base: 'rounded-[calc(var(--ui-radius)*1.5)] font-medium inline-flex items-center',
    label: 'truncate',
    leadingIcon: 'shrink-0',
    leadingAvatar: 'shrink-0',
    leadingAvatarSize: '',
    trailingIcon: 'shrink-0'
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
    size: {
      sm: {
        base: 'text-xs px-1.5 py-0.5 gap-1',
        leadingIcon: 'size-4',
        leadingAvatarSize: '3xs',
        trailingIcon: 'size-4'
      },
      md: {
        base: 'text-xs px-2 py-1 gap-1',
        leadingIcon: 'size-4',
        leadingAvatarSize: '3xs',
        trailingIcon: 'size-4'
      },
      lg: {
        base: 'text-sm px-2 py-1 gap-1.5',
        leadingIcon: 'size-5',
        leadingAvatarSize: '2xs',
        trailingIcon: 'size-5'
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'solid',
    class: `bg-[var(--ui-${color})] text-[var(--ui-bg)]`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'outline',
    class: `text-[var(--ui-${color})] ring ring-inset ring-[var(--ui-${color})]/50`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'soft',
    class: `bg-[var(--ui-${color})]/10 text-[var(--ui-${color})]`
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'subtle',
    class: `bg-[var(--ui-${color})]/10 text-[var(--ui-${color})] ring ring-inset ring-[var(--ui-${color})]/25`
  })), {
    color: 'neutral',
    variant: 'solid',
    class: 'text-[var(--ui-bg)] bg-[var(--ui-bg-inverted)]'
  }, {
    color: 'neutral',
    variant: 'outline',
    class: 'ring ring-inset ring-[var(--ui-border-accented)] text-[var(--ui-text)] bg-[var(--ui-bg)]'
  }, {
    color: 'neutral',
    variant: 'soft',
    class: 'text-[var(--ui-text)] bg-[var(--ui-bg-elevated)]'
  }, {
    color: 'neutral',
    variant: 'subtle',
    class: 'ring ring-inset ring-[var(--ui-border-accented)] text-[var(--ui-text)] bg-[var(--ui-bg-elevated)]'
  }],
  defaultVariants: {
    color: 'primary',
    variant: 'solid',
    size: 'md'
  }
})
