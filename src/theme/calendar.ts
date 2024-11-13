import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => {
  return {
    slots: {
      root: 'rounded-[calc(var(--ui-radius)*1.5)] p-4',
      header: 'flex items-center justify-between',
      body: 'flex flex-col space-y-4 pt-4 sm:flex-row sm:space-x-4 sm:space-y-0',
      heading: 'text-sm font-medium',
      grid: 'w-full border-collapse select-none space-y-1',
      gridRow: 'grid grid-cols-7',
      gridWeekDaysRow: 'mb-1 grid w-full grid-cols-7',
      gridBody: 'grid',
      headCell: 'rounded-md text-xs text-red',
      cell: 'relative text-center text-sm',
      cellTrigger: 'relative flex items-center justify-center rounded-full whitespace-nowrap text-sm font-normal w-8 h-8 outline-none focus:shadow-[0_0_0_2px] focus:shadow-black data-[disabled]:text-black/30 data-[selected]:!bg-green10 data-[selected]:text-white hover:bg-green5 data-[highlighted]:bg-green5 data-[unavailable]:pointer-events-none data-[unavailable]:text-black/30 data-[unavailable]:line-through before:absolute before:top-[5px] before:hidden before:rounded-full before:w-1 before:h-1 before:bg-white data-[today]:before:block data-[today]:before:bg-green9',
      paginationButton: 'inline-flex items-center cursor-pointer justify-center rounded-[9px] bg-transparent w-8 h-8 hover:bg-black hover:text-white active:scale-98 active:transition-all focus:shadow-[0_0_0_2px] focus:shadow-black',
      paginationIcon: 'w-6 h-6'
    },
    variants: {
      color: {
        ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
        neutral: ''
      },
      size: {
        xs: {},
        sm: {},
        md: {},
        lg: {},
        xl: {}
      }
    },
    compoundVariants: [
      ...(options.theme.colors || []).map((color: string) => ({
        color
      }))
    ],
    defaultVariants: {
      size: 'md',
      color: 'primary'
    }
  }
}
