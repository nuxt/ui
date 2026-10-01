import { defineTheme } from '../../utils/theme'

export default defineTheme({
  slots: {
    base: 'text-lg text-strong font-bold mt-6 mb-2 scroll-mt-[calc(24px+45px+var(--ui-header-height))] lg:scroll-mt-[calc(24px+var(--ui-header-height))] [&>a]:rounded-sm [&>a]:outline-focus [&>a]:focus-visible:outline-3',
    link: ''
  }
})
