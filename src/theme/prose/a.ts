import type { ModuleOptions } from '../../module'

export default (options: Required<ModuleOptions>) => ({
  base: ['text-primary border-b border-transparent hover:border-primary font-medium rounded-xs outline-primary/25 focus-visible:outline-3 focus-visible:has-[>code]:outline-0 [&>code]:border-dashed [&>code]:outline-primary/25 focus-visible:[&>code]:outline-3 hover:[&>code]:border-primary hover:[&>code]:text-primary focus-visible:[&>code]:border-primary focus-visible:[&>code]:text-primary', options.theme.transitions && 'transition-colors [&>code]:transition-colors']
})
