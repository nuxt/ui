import type { ModuleOptions } from '../module'

// Highlight the prompt like a focused input when the text surface (native textarea or editor's contenteditable) is focused, without reacting to header/footer controls.
const focusHighlight = (utilities: string) => ['textarea', '[contenteditable]']
  .flatMap(element => utilities.split(' ').map(utility => `has-[${element}:focus-visible]:${utility}`))
  .join(' ')

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative flex flex-col items-stretch gap-2 px-2.5 py-2 w-full rounded-lg backdrop-blur',
    header: 'flex items-center gap-1.5',
    body: 'items-start gap-1.5',
    footer: 'flex items-center justify-between gap-1.5',
    base: 'px-0'
  },
  variants: {
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: ''
    },
    variant: {
      outline: {
        root: 'bg-default/75 ring ring-default'
      },
      soft: {
        root: 'bg-elevated/50'
      },
      subtle: {
        root: 'bg-elevated/50 ring ring-default'
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
