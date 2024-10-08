export const buttonGroupVariant = {
  buttonGroup: {
    horizontal: 'not-only:first:rounded-e-[--ui-radius-none] not-only:last:rounded-s-[--ui-radius-none] not-last:not-first:rounded-[--ui-radius-none]',
    vertical: 'not-only:first:rounded-b-[--ui-radius-none] not-only:last:rounded-t-[--ui-radius-none] not-last:not-first:rounded-[--ui-radius-none]'
  }
}

export const buttonGroupVariantWithRoot = {
  buttonGroup: {
    horizontal: {
      root: 'group',
      base: 'group-not-only:group-first:rounded-e-[--ui-radius-none] group-not-only:group-last:rounded-s-[--ui-radius-none] group-not-last:group-not-first:rounded-[--ui-radius-none]'
    },
    vertical: {
      root: 'group',
      base: 'group-not-only:group-first:rounded-b-[--ui-radius-none] group-not-only:group-last:rounded-t-[--ui-radius-none] group-not-last:group-not-first:rounded-[--ui-radius-none]'
    }
  }
}

export default {
  base: 'relative',
  variants: {
    size: {
      xs: '',
      sm: '',
      md: '',
      lg: '',
      xl: ''
    },
    orientation: {
      horizontal: 'inline-flex -space-x-px',
      vertical: 'flex flex-col -space-y-px'
    }
  }
}
