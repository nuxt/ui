import { colorVariant } from './color'
// Highlight the prompt like a focused input when the text surface (native textarea or editor's contenteditable) is focused, without reacting to header/footer controls.
const focusHighlight = (utilities: string) => ['textarea', '[contenteditable]']
  .flatMap(element => utilities.split(' ').map(utility => `has-[${element}:focus-visible]:${utility}`))
  .join(' ')

export default {
  slots: {
    root: 'relative flex flex-col items-stretch gap-2 px-2.5 py-2 w-full rounded-lg backdrop-blur-sm',
    header: 'flex items-center gap-1.5',
    body: 'items-start gap-1.5',
    footer: 'flex items-center justify-between gap-1.5',
    base: 'px-0'
  },
  variants: {
    color: colorVariant({ root: '' }),
    variant: {
      outline: {
        root: 'bg-default/75 ring ring-default'
      },
      soft: {
        root: `bg-elevated/50 outline-accent-focus ${focusHighlight('outline-3')}`
      },
      subtle: {
        root: 'bg-elevated/50 ring ring-default'
      },
      naked: {
        root: ''
      }
    }
  },
  compoundVariants: [{
    variant: ['outline', 'subtle'],
    class: { root: `outline-accent-focus ${focusHighlight('outline-3 ring-accent')}` }
  }],
  defaultVariants: {
    color: 'primary',
    variant: 'outline'
  }
}
