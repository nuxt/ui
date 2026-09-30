import { defineTheme } from '../../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative group *:not-first:my-0! *:not-first:static! my-5',
    list: 'relative flex items-center gap-1 border border-default dark:border-strong bg-default border-b-0 rounded-t-md overflow-x-auto p-2',
    indicator: 'absolute left-0 inset-y-2 w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position) transition-[translate,width] duration-200 ease-out motion-reduce:transition-none bg-soft rounded-md shadow-xs',
    trigger: 'relative inline-flex items-center gap-1.5 text-default data-[state=active]:text-strong hover:bg-tint px-2 py-1.5 text-sm rounded-md disabled:cursor-not-allowed disabled:opacity-75 outline-focus focus-visible:outline-3 transition-colors',
    triggerIcon: 'size-4 shrink-0',
    triggerLabel: 'truncate'
  }
})
