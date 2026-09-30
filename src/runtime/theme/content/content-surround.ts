import { defineTheme } from '../../utils/theme'

export default defineTheme({
  slots: {
    root: 'grid grid-cols-1 sm:grid-cols-2 gap-8',
    link: 'group block px-6 py-8 rounded-lg border border-default hover:bg-tint outline-focus focus-visible:outline-3 focus-visible:border-neutral transition-colors',
    linkLeading: 'inline-flex items-center rounded-full p-1.5 bg-soft group-hover:bg-primary/10 ring ring-strong mb-4 group-hover:ring-primary/50 transition',
    linkLeadingIcon: 'size-5 shrink-0 text-strong group-hover:text-primary transition-[color,translate] ease-out motion-reduce:transition-none',
    linkTitle: 'font-medium text-[15px] text-strong mb-1 truncate',
    linkDescription: 'text-sm text-muted line-clamp-2'
  },
  variants: {
    direction: {
      left: {
        linkLeadingIcon: 'group-active:-translate-x-0.5 rtl:group-active:translate-x-0.5'
      },
      right: {
        link: 'text-end',
        linkLeadingIcon: 'group-active:translate-x-0.5 rtl:group-active:-translate-x-0.5'
      }
    }
  }
})
