export default {
  base: 'inline-flex items-center justify-center px-1 rounded-[var(--ui-radius)] font-medium font-sans',
  variants: {
    variant: {
      solid: 'bg-[var(--ui-bg-inverted)] text-[var(--ui-bg)]',
      outline: 'bg-[var(--ui-bg)] text-[var(--ui-text-highlighted)] ring ring-inset ring-[var(--ui-border-accented)]',
      subtle: 'bg-[var(--ui-bg-elevated)] text-[var(--ui-text)] ring ring-inset ring-[var(--ui-border-accented)]'
    },
    size: {
      sm: 'h-4 min-w-[16px] text-[10px]',
      md: 'h-5 min-w-[20px] text-[11px]',
      lg: 'h-6 min-w-[24px] text-[12px]'
    }
  },
  defaultVariants: {
    variant: 'outline',
    size: 'md'
  }
}
