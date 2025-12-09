export default {
  slots: {
    root: 'relative overflow-hidden',
    title: 'text-lg text-center font-semibold text-highlighted',
    logos: 'mt-10',
    logo: 'size-10 shrink-0'
  },
  variants: {
    marquee: {
      false: {
        logos: 'flex items-center shrink-0 justify-around gap-(--gap) [--gap:--spacing(16)]'
      }
    }
  }
}
