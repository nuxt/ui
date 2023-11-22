import input from './input'

export default {
  ...input,
  placeholder: 'text-gray-900 dark:text-white',
  default: {
    size: 'sm',
    color: 'white',
    variant: 'outline',
    loadingIcon: 'i-heroicons-arrow-path-20-solid',
    trailingIcon: 'i-heroicons-chevron-down-20-solid'
  }
}