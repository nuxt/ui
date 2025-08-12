import type { NuxtOptions } from '@nuxt/schema'

export default (options: Required<NuxtOptions['ui']>) => ({
  slots: {
    root: 'relative group *:not-first:!my-0 *:not-first:!static my-5',
    list: 'relative flex items-center gap-1 border border-muted bg-default border-b-0 rounded-t-md overflow-x-auto p-2',
    indicator: 'absolute left-0 inset-y-2 w-(--reka-tabs-indicator-size) translate-x-(--reka-tabs-indicator-position) transition-[translate,width] duration-200 bg-elevated rounded-md shadow-xs',
    trigger: ['relative inline-flex items-center gap-1.5 text-default data-[state=active]:text-highlighted hover:bg-elevated/50 px-2 py-1.5 text-sm rounded-md disabled:cursor-not-allowed disabled:opacity-75 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-primary focus:outline-none', options.theme.transitions && 'transition-colors'],
    triggerIcon: 'size-4 shrink-0',
    triggerLabel: 'truncate'
  }
})
