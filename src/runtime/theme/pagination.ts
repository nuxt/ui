import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: '',
    list: 'flex items-center gap-1',
    ellipsis: 'pointer-events-none',
    label: 'min-w-5 text-center',
    first: '',
    prev: '',
    item: '',
    next: '',
    last: ''
  }
})
