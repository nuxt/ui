export default {
  slots: {
    content: 'shadow-xl/30 shadow-primary-500/50 p-4 bg-default rounded-lg ring ring-default max-w-sm w-[min(360px,calc(100vw-2rem))] data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] origin-(--reka-popover-content-transform-origin) pointer-events-auto',
    arrow: 'fill-default',
    highlight: 'outline outline-2 outline-primary outline-offset-2 rounded-lg transition-all duration-100 shadow-[0_0_0_4px_rgba(var(--color-primary-DEFAULT)/0.15)]',
    header: 'flex items-start gap-3',
    indicator: 'text-xs text-muted font-medium',
    title: 'text-base font-semibold text-highlighted leading-tight',
    description: 'text-sm text-muted leading-relaxed',
    body: 'mt-2 text-sm text-default leading-relaxed',
    footer: 'mt-4 flex items-center justify-between gap-3',
    controls: 'flex items-center gap-2',
    close: '',
    prev: '',
    next: ''
  }
}
