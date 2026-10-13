export default {
  slots: {
    // The tooltip can sit under the pointer, and its popper wrapper would take the hover away from the chart.
    root: 'relative w-full text-xs text-muted **:data-reka-popper-content-wrapper:pointer-events-none',
    // The chart surface is focusable for keyboard navigation between points.
    base: '[&_.ts-chart]:rounded-md [&_.ts-chart:focus-visible]:outline-2 [&_.ts-chart:focus-visible]:outline-offset-2 [&_.ts-chart:focus-visible]:outline-primary',
    tooltip: 'flex-col items-stretch gap-1 h-auto min-w-32 py-1.5 pointer-events-none',
    tooltipTitle: 'font-medium text-highlighted',
    tooltipRow: 'flex items-center gap-1.5 text-muted data-[active=true]:text-highlighted',
    tooltipIndicator: 'size-2 shrink-0 rounded-full',
    tooltipLabel: 'truncate',
    tooltipValue: 'ms-auto ps-4 font-medium text-highlighted tabular-nums',
    center: 'absolute inset-0 flex flex-col items-center justify-center pointer-events-none'
  },
  variants: {
    type: {
      line: '',
      area: '',
      bar: '',
      donut: ''
    }
  }
}
