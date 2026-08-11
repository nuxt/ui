import type { ModuleOptions } from '../../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'my-5',
    trigger: ['group relative rounded-xs inline-flex items-center gap-1.5 text-muted hover:text-default text-sm outline-primary/25 focus-visible:outline-3', options.theme.transitions && 'transition-colors'],
    triggerIcon: 'size-4 shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200 ease-out',
    triggerLabel: 'truncate',
    content: '*:first:mt-2.5 *:last:mb-0 *:my-1.5'
  }
})
