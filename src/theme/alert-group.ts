export default {
  slots: {
    root: 'group flex flex-col transition-all duration-300 data-[expanded=true]:gap-2 data-[expanded=false]:gap-0',
    items: 'transition-all duration-300 mx-auto overflow-hidden not-first:group-data-[expanded=false]:*:invisible'
  }
}