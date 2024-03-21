export default {
  slots: {
    root: 'w-full',
    item: 'border-b border-gray-200 dark:border-gray-800',
    header: 'flex',
    trigger: 'group flex-1 flex items-center gap-1.5 font-medium text-sm hover:underline py-3.5 disabled:cursor-not-allowed disabled:opacity-75 disabled:hover:no-underline',
    content: 'text-sm pb-3.5 data-[state=open]:animate-[accordion-down_200ms_ease-out] data-[state=closed]:animate-[accordion-up_200ms_ease-out] overflow-hidden focus:outline-none',
    leadingIcon: 'shrink-0 w-5 h-5',
    trailingIcon: 'ms-auto w-5 h-5 group-data-[state=open]:rotate-180 transition-transform duration-200',
    label: 'truncate'
  }
}
