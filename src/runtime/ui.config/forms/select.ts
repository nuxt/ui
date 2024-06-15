import input from './input'

export default {
  ...input,
  form: 'form-select',
  placeholder: 'text-gray-400 dark:text-gray-500',
  default: {
    size: 'sm',
    color: 'white',
    variant: 'outline',
    loadingIcon: 'i-heroicons-arrow-path-20-solid',
    trailingIcon: 'i-heroicons-chevron-down-20-solid'
  }
}
