export default {
  wrapper: 'flex flex-col gap-2 w-full',
  base: 'flex flex-row flex-nowrap flex-shrink overflow-hidden',
  background: 'bg-gray-200 dark:bg-gray-700',
  transition: 'transition-all',
  rounded: 'rounded-full',
  shadow: '',
  list: 'list-disc list-inside',
  orientation: {
    'rounded-none': { left: 'rounded-s-none', right: 'rounded-e-none' },
    'rounded-sm': { left: 'rounded-s-sm', right: 'rounded-e-sm' },
    'rounded': { left: 'rounded-s', right: 'rounded-e' },
    'rounded-md': { left: 'rounded-s-md', right: 'rounded-e-md' },
    'rounded-lg': { left: 'rounded-s-lg', right: 'rounded-e-lg' },
    'rounded-xl': { left: 'rounded-s-xl', right: 'rounded-e-xl' },
    'rounded-2xl': { left: 'rounded-s-2xl', right: 'rounded-e-2xl' },
    'rounded-3xl': { left: 'rounded-s-3xl', right: 'rounded-e-3xl' },
    'rounded-full': { left: 'rounded-s-full', right: 'rounded-e-full' }
  },
  default: {
    size: 'md',
    icon: 'i-heroicons-minus-20-solid'
  }
}
