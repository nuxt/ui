export default {
  slots: {
    root: 'flex flex-col gap-4',
    header: 'flex',
    item: 'group text-center relative w-full',
    content: '',
    trigger: 'flex-none',
    indicator: 'rounded-full font-medium text-center align-middle flex items-center justify-center p-2 group-data-[state=completed]:text-[var(--ui-bg)] text-[var(--ui-text-accented)] bg-[var(--ui-bg-accented)] group-data-[state=completed]:bg-[var(--ui-primary)] size-10',
    separator: 'absolute top-4.5 block left-[calc(50%+25px)] right-[calc(-50%+25px)] h-0.5 rounded-full group-data-[disabled]:opacity-75 bg-[var(--ui-border-accented)] group-data-[state=completed]:bg-[var(--ui-primary)] shrink-0',
    title: 'font-medium mt-1',
    description: 'text-wrap text-sm'

  }
}
