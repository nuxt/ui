import { colorVariant } from './color'
import { defineTheme } from '../utils/theme'

export default defineTheme({
  slots: {
    root: 'relative flex flex-col items-stretch gap-2 px-2.5 py-2 w-full rounded-lg isolate before:absolute before:inset-0 before:-z-1 before:rounded-[inherit] before:backdrop-blur-sm mt-(--chat-prompt-queue-height)',
    header: 'flex items-center gap-1.5',
    files: 'flex flex-wrap items-center gap-1.5 mt-0.5',
    queue: 'absolute bottom-full inset-x-[max(--spacing(2.5),calc(var(--ui-radius)*2))] z-10 flex flex-col px-1 rounded-t-lg border border-b-0 border-default bg-tint backdrop-blur-sm overflow-hidden',
    queueTrigger: 'flex items-center gap-1.5 w-full p-1.5 text-xs font-medium text-muted hover:text-default focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-neutral rounded-md',
    queueTriggerIcon: 'shrink-0 size-4 data-[state=open]:rotate-180 transition-transform duration-200 ease-out motion-reduce:transition-none',
    queueCount: 'text-faint tabular-nums',
    queueList: 'flex flex-col max-h-60 overflow-y-auto pb-1',
    queueItem: 'group/queue flex items-center gap-2 h-7 ps-2 pe-0.5 rounded-sm hover:bg-soft',
    queueItemLeading: 'shrink-0 size-3 rounded-full ring ring-strong',
    queueItemLabel: 'flex-1 min-w-0 truncate text-sm text-default',
    queueItemActions: 'flex items-center shrink-0 [@media(hover:hover)]:opacity-0 group-hover/queue:opacity-100 group-focus-within/queue:opacity-100 transition-opacity ease-out',
    body: 'items-start gap-1.5',
    footer: 'flex items-center justify-between gap-1.5',
    base: 'px-0 rounded-none'
  },
  variants: {
    color: colorVariant({ root: '' }),
    variant: {
      outline: {
        root: 'bg-default/75 ring ring-default',
        queue: 'bottom-[calc(100%+1px)]'
      },
      // Highlight the prompt like a focused input when the text surface (native textarea or editor's contenteditable) is focused, without reacting to header/footer controls.
      soft: {
        root: 'bg-tint outline-accent-focus has-[textarea:focus-visible]:outline-3 has-[[contenteditable]:focus-visible]:outline-3',
        queue: 'border-0'
      },
      subtle: {
        root: 'bg-tint ring ring-default',
        queue: 'bottom-[calc(100%+1px)]'
      },
      naked: {
        root: ''
      }
    }
  },
  compoundVariants: [{
    variant: ['outline', 'subtle'],
    class: { root: 'outline-accent-focus has-[textarea:focus-visible]:outline-3 has-[textarea:focus-visible]:ring-accent has-[[contenteditable]:focus-visible]:outline-3 has-[[contenteditable]:focus-visible]:ring-accent' }
  }],
  defaultVariants: {
    color: 'primary',
    variant: 'outline'
  }
})
