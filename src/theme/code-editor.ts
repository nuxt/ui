import type { ModuleOptions } from '../module'

// CodeMirror injects an unlayered stylesheet that beats Tailwind's `utilities`
// layer whatever the specificity, so the utilities overriding it are marked `!`.
export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: 'relative inline-flex items-start w-full',
    base: [
      'relative w-full overflow-hidden rounded-md font-mono',
      options.theme.transitions && 'transition-colors',
      // Editor
      '[&_.cm-editor]:outline-none! [&_.cm-scroller]:[font-family:inherit]! [&_.cm-scroller]:[line-height:inherit]!',
      '[&_.cm-content]:min-h-[calc(var(--ui-code-editor-rows)*1lh+2*var(--ui-code-editor-py))]! [&_.cm-content]:py-(--ui-code-editor-py)! [&_.cm-content]:caret-(--ui-text-highlighted)!',
      '[&_.cm-line]:px-(--ui-code-editor-px)!',
      '[&_.cm-cursor]:border-s-(color:--ui-text-highlighted)! [&_.cm-dropCursor]:border-s-(color:--ui-text-highlighted)!',
      '[&_.cm-placeholder]:text-dimmed!',
      // Gutters
      '[&_.cm-gutters]:bg-transparent! [&_.cm-gutters]:border-none! [&_.cm-gutters]:text-dimmed! [&_.cm-gutters]:h-auto! [&_.cm-gutters]:self-stretch',
      '[&_.cm-lineNumbers_.cm-gutterElement]:ps-(--ui-code-editor-px)! [&_.cm-lineNumbers_.cm-gutterElement]:pe-0! [&_.cm-lineNumbers_.cm-gutterElement]:min-w-0!',
      '[&_.cm-activeLineGutter]:bg-transparent! [&_.cm-editor.cm-focused_.cm-activeLineGutter]:bg-accented/25! [&_.cm-editor.cm-focused_.cm-activeLineGutter]:text-default',
      // Active line (focused only), selection and matches
      '[&_.cm-activeLine]:bg-transparent! [&_.cm-editor.cm-focused_.cm-activeLine]:bg-accented/25!',
      // Selection follows the OS accent color (translucent, so tokens stay readable in both modes), `--ui-code-editor-selection` overrides it globally (also used by `drawSelection()`)
      '[&_.cm-content]:selection:bg-[var(--ui-code-editor-selection,color-mix(in_srgb,AccentColor_30%,transparent))] [&_.cm-selectionBackground]:bg-[var(--ui-code-editor-selection,color-mix(in_srgb,AccentColor_30%,transparent))]!',
      '[&_.cm-selectionMatch]:bg-accented/50! [&_.cm-selectionMatch]:rounded-xs',
      '[&_.cm-searchMatch]:bg-warning/25! [&_.cm-searchMatch]:rounded-xs [&_.cm-searchMatch-selected]:bg-warning/50!',
      '[&_.cm-editor.cm-focused_.cm-matchingBracket]:bg-primary/20! [&_.cm-editor.cm-focused_.cm-matchingBracket]:rounded-xs',
      '[&_.cm-editor.cm-focused_.cm-nonmatchingBracket]:bg-error/20! [&_.cm-editor.cm-focused_.cm-nonmatchingBracket]:rounded-xs',
      // Shiki tokens (color and font style are exposed as CSS variables per theme)
      '[&_.cm-shiki]:text-(--shiki-light) [&_.cm-shiki]:[font-style:var(--shiki-light-font-style)] [&_.cm-shiki]:[font-weight:var(--shiki-light-font-weight)]',
      'dark:[&_.cm-shiki]:text-(--shiki-dark) dark:[&_.cm-shiki]:[font-style:var(--shiki-dark-font-style)] dark:[&_.cm-shiki]:[font-weight:var(--shiki-dark-font-weight)]',
      // Panels (search, go to line) and their native fields
      '[&_.cm-panels]:bg-elevated! [&_.cm-panels]:text-default! [&_.cm-panels]:border-default! [&_.cm-panels-top]:border-b [&_.cm-panels-bottom]:border-t',
      '[&_.cm-panel]:flex [&_.cm-panel]:flex-wrap [&_.cm-panel]:items-center [&_.cm-panel]:gap-1.5 [&_.cm-panel]:p-1.5! [&_.cm-panel]:font-sans [&_.cm-panel]:text-xs',
      '[&_.cm-panel_label]:inline-flex [&_.cm-panel_label]:items-center [&_.cm-panel_label]:gap-1.5 [&_.cm-panel_label]:text-xs! [&_.cm-panel_label]:text-default',
      '[&_.cm-textfield]:rounded-md [&_.cm-textfield]:border-0! [&_.cm-textfield]:bg-default! [&_.cm-textfield]:px-2! [&_.cm-textfield]:py-1! [&_.cm-textfield]:text-xs! [&_.cm-textfield]:text-highlighted! [&_.cm-textfield]:ring [&_.cm-textfield]:ring-inset [&_.cm-textfield]:ring-accented [&_.cm-textfield]:outline-none [&_.cm-textfield]:placeholder:text-dimmed [&_.cm-textfield]:focus-visible:ring-primary',
      '[&_.cm-button]:rounded-md! [&_.cm-button]:border-0! [&_.cm-button]:bg-default! [&_.cm-button]:bg-none! [&_.cm-button]:px-2! [&_.cm-button]:py-1! [&_.cm-button]:text-xs! [&_.cm-button]:font-medium [&_.cm-button]:text-default! [&_.cm-button]:ring [&_.cm-button]:ring-inset [&_.cm-button]:ring-accented [&_.cm-button]:hover:bg-elevated! [&_.cm-button]:focus-visible:outline-2 [&_.cm-button]:focus-visible:outline-offset-2 [&_.cm-button]:focus-visible:outline-inverted',
      // Tooltips mirror the Tooltip component
      '[&_.cm-tooltip]:rounded-sm [&_.cm-tooltip]:border-0! [&_.cm-tooltip]:bg-default! [&_.cm-tooltip]:text-highlighted! [&_.cm-tooltip]:text-xs [&_.cm-tooltip]:font-sans [&_.cm-tooltip]:shadow-sm [&_.cm-tooltip]:ring [&_.cm-tooltip]:ring-default [&_.cm-tooltip]:px-2.5 [&_.cm-tooltip]:py-1'
    ],
    // Layout of the static replica rendered before CodeMirror mounts, mirroring its base styles
    fallback: '[&_.cm-scroller]:flex [&_.cm-scroller]:items-start [&_.cm-scroller]:overflow-auto [&_.cm-gutters]:flex [&_.cm-gutters]:shrink-0 [&_.cm-gutter]:flex [&_.cm-gutter]:flex-col [&_.cm-gutter]:shrink-0 [&_.cm-gutter]:py-(--ui-code-editor-py) [&_.cm-lineNumbers_.cm-gutterElement]:text-end [&_.cm-lineNumbers_.cm-gutterElement]:whitespace-nowrap [&_.cm-content]:grow [&_.cm-content]:shrink-0 [&_.cm-content]:whitespace-pre [&_.cm-content.cm-lineWrapping]:shrink [&_.cm-content.cm-lineWrapping]:whitespace-pre-wrap [&_.cm-content.cm-lineWrapping]:wrap-anywhere [&_.cm-line]:block [&_.cm-placeholder]:inline-block [&_.cm-placeholder]:align-top',
    editor: '',
    content: '',
    search: 'flex flex-wrap items-center gap-1.5 p-1.5 font-sans',
    searchInput: 'w-56 max-w-full',
    searchToggles: 'flex items-center gap-0.5 pe-1',
    searchControlSize: ''
  },
  variants: {
    size: {
      xs: {
        base: 'text-sm/5 [--ui-code-editor-px:--spacing(2)] [--ui-code-editor-py:--spacing(1)]',
        searchControlSize: 'xs'
      },
      sm: {
        base: 'text-sm/5 [--ui-code-editor-px:--spacing(2.5)] [--ui-code-editor-py:--spacing(1.5)]',
        searchControlSize: 'xs'
      },
      md: {
        base: 'text-base/6 [--ui-code-editor-px:--spacing(2.5)] [--ui-code-editor-py:--spacing(1.5)]',
        searchControlSize: 'sm'
      },
      lg: {
        base: 'text-base/6 [--ui-code-editor-px:--spacing(3)] [--ui-code-editor-py:--spacing(2)]',
        searchControlSize: 'sm'
      },
      xl: {
        base: 'text-base/7 [--ui-code-editor-px:--spacing(3)] [--ui-code-editor-py:--spacing(2)]',
        searchControlSize: 'md'
      }
    },
    variant: {
      outline: {
        base: 'text-highlighted bg-default ring ring-inset ring-accented'
      },
      soft: {
        base: 'text-highlighted bg-elevated/50 hover:bg-elevated focus-within:bg-elevated'
      },
      subtle: {
        base: 'text-highlighted bg-elevated ring ring-inset ring-accented'
      },
      ghost: {
        base: 'text-highlighted bg-transparent hover:bg-elevated focus-within:bg-elevated'
      },
      none: {
        base: 'text-highlighted bg-transparent'
      }
    },
    color: {
      ...Object.fromEntries((options.theme.colors || []).map((color: string) => [color, ''])),
      neutral: ''
    },
    highlight: {
      true: ''
    },
    fixed: {
      false: ''
    },
    disabled: {
      true: {
        base: 'cursor-not-allowed opacity-75 [&_.cm-content]:cursor-not-allowed'
      }
    },
    maxrows: {
      true: {
        base: '[&_.cm-scroller]:max-h-[calc(var(--ui-code-editor-maxrows)*1lh+2*var(--ui-code-editor-py))]'
      }
    }
  },
  compoundVariants: [...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: ['outline', 'subtle'],
    class: {
      base: `outline-${color}/25 focus-within:outline-3 focus-within:ring-${color}`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    variant: ['soft', 'ghost'],
    class: {
      base: `outline-${color}/25 focus-within:outline-3`
    }
  })), ...(options.theme.colors || []).map((color: string) => ({
    color,
    highlight: true,
    class: {
      base: `ring ring-inset ring-${color}`
    }
  })), {
    color: 'neutral',
    variant: ['outline', 'subtle'],
    class: {
      base: 'outline-inverted/25 focus-within:outline-3 focus-within:ring-inverted'
    }
  }, {
    color: 'neutral',
    variant: ['soft', 'ghost'],
    class: {
      base: 'outline-inverted/25 focus-within:outline-3'
    }
  }, {
    color: 'neutral',
    highlight: true,
    class: {
      base: 'ring ring-inset ring-inverted'
    }
  }, {
    variant: 'soft',
    disabled: true,
    class: {
      base: 'bg-elevated/50 hover:bg-elevated/50'
    }
  }, {
    variant: 'ghost',
    disabled: true,
    class: {
      base: 'bg-transparent hover:bg-transparent'
    }
  }, {
    fixed: false,
    size: ['xs', 'sm'],
    class: {
      base: 'md:text-xs'
    }
  }, {
    fixed: false,
    size: ['md', 'lg'],
    class: {
      base: 'md:text-sm'
    }
  }],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'outline'
  }
})
