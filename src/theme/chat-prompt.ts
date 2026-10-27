import type { ModuleOptions } from '../module'

// Highlight the prompt like a focused input when the text surface (native textarea or editor's contenteditable) is focused, without reacting to header/footer controls.
const focusHighlight = (utilities: string) => ['textarea', '[contenteditable]']
  .flatMap(element => utilities.split(' ').map(utility => `has-[${element}:focus-visible]:${utility}`))
  .join(' ')

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative flex flex-col items-stretch gap-2 px-2.5 py-2 w-full rounded-lg backdrop-blur-sm',
    header: 'flex items-center gap-1.5',
    files: 'flex flex-wrap items-center gap-1.5',
    queue: 'absolute bottom-full inset-x-2.5 z-10 isolate flex flex-col px-1 rounded-t-lg border border-b-0 border-default bg-default overflow-hidden before:absolute before:inset-0 before:-z-1 before:bg-elevated/50',
    queueTrigger: 'flex items-center gap-1.5 w-full p-1.5 text-xs font-medium text-muted hover:text-default focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-inverted rounded-md',
    queueTriggerIcon: ['shrink-0 size-4 data-[state=open]:rotate-180', options.theme.transitions && 'transition-transform duration-200 ease-out motion-reduce:transition-none'],
    queueCount: 'text-dimmed tabular-nums',
    queueList: 'flex flex-col max-h-60 overflow-y-auto pb-1',
    queueItem: 'group/queue flex items-center gap-2 h-7 ps-2 pe-0.5 rounded-sm hover:bg-elevated',
    queueItemLeading: 'shrink-0 size-3 rounded-full ring ring-accented',
    queueItemLabel: 'flex-1 min-w-0 truncate text-sm text-default',
    queueItemActions: ['flex items-center shrink-0 [@media(hover:hover)]:opacity-0 group-hover/queue:opacity-100 group-focus-within/queue:opacity-100', options.theme.transitions && 'transition-opacity ease-out'],
    body: 'items-start gap-1.5',
    footer: 'flex items-center justify-between gap-1.5',
    base: 'px-0 rounded-none'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: ''
    },
    variant: {
      outline: {
        root: 'bg-default/75 ring ring-default',
        queue: 'bottom-[calc(100%+1px)]'
      },
      soft: {
        root: 'bg-elevated/50',
        queue: 'border-0'
      },
      subtle: {
        root: 'bg-elevated/50 ring ring-default',
        queue: 'bottom-[calc(100%+1px)]'
      },
      naked: {
        root: ''
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: ['outline', 'subtle'],
    class: { root: `outline-${color}/25 ${focusHighlight(`outline-3 ring-${color}`)}` }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: 'soft',
    class: { root: `outline-${color}/25 ${focusHighlight('outline-3')}` }
  })), {
    color: 'neutral',
    variant: ['outline', 'subtle'],
    class: { root: `outline-inverted/25 ${focusHighlight('outline-3 ring-inverted')}` }
  }, {
    color: 'neutral',
    variant: 'soft',
    class: { root: `outline-inverted/25 ${focusHighlight('outline-3')}` }
  }],
  defaultVariants: {
    color: 'primary',
    variant: 'outline'
  }
})
