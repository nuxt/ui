import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative inline-block',
    svg: 'block w-full h-full',
    path: 'fill-current',
    overlay: 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center',
    overlayItem: '!size-8'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, {
        svg: `text-${color}`
      }]))
    }

  },
  defaultVariants: {
    color: 'neutral'
  }
})
