export default {
  slots: {
    root: 'w-full',
    item: 'border-b border-gray-200 dark:border-gray-800 last:border-b-0',
    header: 'flex',
    trigger: 'group flex-1 flex items-center gap-1.5 font-medium text-sm py-3.5 disabled:cursor-not-allowed disabled:opacity-75 focus-visible:outline-primary-500 dark:focus-visible:outline-primary-400',
    content: 'text-sm pb-3.5 data-[state=open]:animate-[accordion-down_200ms_ease-out] data-[state=closed]:animate-[accordion-up_200ms_ease-out] overflow-hidden focus:outline-none',
    leadingIcon: 'shrink-0 size-5',
    trailingIcon: 'ms-auto size-5 group-data-[state=open]:rotate-180 transition-transform duration-200',
    label: 'truncate'
  }
}
