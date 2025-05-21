export const buttonGroupVariant = {
  buttonGroup: {
    horizontal: 'not-only:first:rounded-e-none not-only:last:rounded-s-none not-last:not-first:rounded-none focus-visible:z-[1]',
    vertical: 'not-only:first:rounded-b-none not-only:last:rounded-t-none not-last:not-first:rounded-none focus-visible:z-[1]'
  }
}

export const buttonGroupVariantWithRoot = {
  buttonGroup: {
    horizontal: {
      root: 'group has-focus-visible:z-[1]',
      base: 'group-not-only:group-first:rounded-e-none group-not-only:group-last:rounded-s-none group-not-last:group-not-first:rounded-none'
    },
    vertical: {
      root: 'group has-focus-visible:z-[1]',
      base: 'group-not-only:group-first:rounded-b-none group-not-only:group-last:rounded-t-none group-not-last:group-not-first:rounded-none'
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
