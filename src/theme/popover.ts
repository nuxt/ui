export default {
  slots: {
    content: 'bg-[var(--ui-bg)] shadow-lg rounded-[calc(var(--ui-radius)*1.5)] ring ring-[var(--ui-border)] data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] focus:outline-none',
    arrow: 'fill-[var(--ui-border)]'
  }
}
