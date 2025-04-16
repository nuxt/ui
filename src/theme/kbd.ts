export default {
  base: 'inline-flex items-center justify-center px-1 rounded-sm font-medium font-sans',
  variants: {
    variant: {
      solid: 'bg-(--ui-bg-inverted) text-(--ui-bg)',
      outline: 'bg-(--ui-bg) text-(--ui-text-highlighted) ring ring-inset ring-(--ui-border-accented)',
      subtle: 'bg-(--ui-bg-elevated) text-(--ui-text) ring ring-inset ring-(--ui-border-accented)'
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
