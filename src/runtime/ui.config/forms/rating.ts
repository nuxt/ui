export default {
  wrapper: 'relative flex flex-row-reverse items-center justify-end gap-1',
  base: 'transition peer',
  hover: 'cursor-pointer hover:text-{color}-400 dark:hover:text-{color}-300 peer-hover:text-{color}-400 dark:peer-hover:text-{color}-300',
  active: 'text-{color}-500 dark:text-{color}-400',
  inactive: 'text-gray-300 dark:text-gray-700',
  disabled: 'cursor-not-allowed opacity-50',
  readonly: 'cursor-auto',
  label: 'font-medium text-gray-700 dark:text-gray-200',
  size: {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl'
  },
  default: {
    color: 'primary',
    icon: 'i-heroicons-star-20-solid',
    size: 'md'
  }
}
