export default {
  wrapper: {
    horizontal: 'inline-flex -space-x-px',
    vertical: 'inline-flex flex-col -space-y-px'
  },
  rounded: 'rounded-md',
  shadow: 'shadow-sm',
  orientation: {
    'rounded-none': { horizontal: { start: 'rounded-s-none', end: 'rounded-e-none' }, vertical: { start: 'rounded-t-none', end: 'rounded-b-none' } },
    'rounded-sm': { horizontal: { start: 'rounded-s-sm', end: 'rounded-e-sm' }, vertical: { start: 'rounded-t-sm', end: 'rounded-b-sm' } },
    'rounded': { horizontal: { start: 'rounded-s', end: 'rounded-e' }, vertical: { start: 'rounded-t', end: 'rounded-b' } },
    'rounded-md': { horizontal: { start: 'rounded-s-md', end: 'rounded-e-md' }, vertical: { start: 'rounded-t-md', end: 'rounded-b-md' } },
    'rounded-lg': { horizontal: { start: 'rounded-s-lg', end: 'rounded-e-lg' }, vertical: { start: 'rounded-t-lg', end: 'rounded-b-lg' } },
    'rounded-xl': { horizontal: { start: 'rounded-s-xl', end: 'rounded-e-xl' }, vertical: { start: 'rounded-t-xl', end: 'rounded-b-xl' } },
    'rounded-2xl': { horizontal: { start: 'rounded-s-2xl', end: 'rounded-e-2xl' }, vertical: { start: 'rounded-t-2xl', end: 'rounded-b-2xl' } },
    'rounded-3xl': { horizontal: { start: 'rounded-s-3xl', end: 'rounded-e-3xl' }, vertical: { start: 'rounded-t-3xl', end: 'rounded-b-3xl' } },
    'rounded-full': { horizontal: { start: 'rounded-s-full', end: 'rounded-e-full' }, vertical: { start: 'rounded-t-full', end: 'rounded-b-full' } }
  }
}
