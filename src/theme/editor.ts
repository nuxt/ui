import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    content: 'relative size-full flex-1',
    // Classes of the editable element itself, injected via `editorProps` (built-in editor only).
    base: 'w-full outline-none *:my-5 *:first:mt-0 *:last:mb-0 sm:px-8 selection:bg-primary/20',
    prose: ''
  },
  variants: {
    prose: {
      true: {
        /**
         * Typography for the editor content, applied on the content wrapper so it also
         * covers external editors. Targets are scoped to `.ProseMirror` (menus appended
         * to the wrapper must stay unaffected) and `:where()`-wrapped so user or
         * extension styling can always override them.
         */
        prose: [
          // Paragraph
          '[&_:where(.ProseMirror_p)]:leading-7',
          // Links
          '[&_:where(.ProseMirror_a)]:text-primary [&_:where(.ProseMirror_a)]:border-b [&_:where(.ProseMirror_a)]:border-transparent [&_:where(.ProseMirror_a:hover)]:border-primary [&_:where(.ProseMirror_a)]:font-medium',
          options.theme?.transitions && '[&_:where(.ProseMirror_a)]:transition-colors',
          // Code inside links
          '[&_:where(.ProseMirror_a>code)]:border-dashed [&_:where(.ProseMirror_a:hover>code)]:border-primary [&_:where(.ProseMirror_a:hover>code)]:text-primary',
          options.theme?.transitions && '[&_:where(.ProseMirror_a>code)]:transition-colors',
          // Mentions
          '[&_:where(.ProseMirror_.mention)]:text-primary [&_:where(.ProseMirror_.mention)]:font-medium',
          // Headings - shared styles
          '[&_:where(.ProseMirror_:is(h1,h2,h3,h4,h5,h6))]:text-highlighted [&_:where(.ProseMirror_:is(h1,h2,h3,h4,h5,h6))]:font-bold',
          // Headings - unique styles
          '[&_:where(.ProseMirror_h1)]:text-3xl',
          '[&_:where(.ProseMirror_h2)]:text-2xl',
          '[&_:where(.ProseMirror_h3)]:text-xl',
          '[&_:where(.ProseMirror_h4)]:text-lg',
          '[&_:where(.ProseMirror_h5)]:text-base',
          '[&_:where(.ProseMirror_h6)]:text-base',
          // Code inside headings
          '[&_:where(.ProseMirror_:is(h1,h2,h3,h4,h5,h6)>code)]:border-dashed [&_:where(.ProseMirror_:is(h1,h2,h3,h4,h5,h6)>code)]:font-bold',
          '[&_:where(.ProseMirror_h2>code)]:text-xl/6',
          '[&_:where(.ProseMirror_h3>code)]:text-lg/5',
          // Blockquote & HR
          '[&_:where(.ProseMirror_blockquote)]:border-s-4 [&_:where(.ProseMirror_blockquote)]:border-accented [&_:where(.ProseMirror_blockquote)]:ps-4 [&_:where(.ProseMirror_blockquote)]:italic',
          '[&_:where(.ProseMirror_[data-type=horizontalRule])]:my-8 [&_:where(.ProseMirror_[data-type=horizontalRule])]:py-2',
          '[&_:where(.ProseMirror_hr)]:border-t [&_:where(.ProseMirror_hr)]:border-default',
          // Code blocks
          '[&_:where(.ProseMirror_pre)]:text-sm/6 [&_:where(.ProseMirror_pre)]:border [&_:where(.ProseMirror_pre)]:border-muted [&_:where(.ProseMirror_pre)]:bg-muted [&_:where(.ProseMirror_pre)]:rounded-md [&_:where(.ProseMirror_pre)]:px-4 [&_:where(.ProseMirror_pre)]:py-3 [&_:where(.ProseMirror_pre)]:whitespace-pre-wrap [&_:where(.ProseMirror_pre)]:break-words [&_:where(.ProseMirror_pre)]:overflow-x-auto',
          '[&_:where(.ProseMirror_pre_code)]:p-0 [&_:where(.ProseMirror_pre_code)]:text-inherit [&_:where(.ProseMirror_pre_code)]:rounded-none [&_:where(.ProseMirror_pre_code)]:inline [&_:where(.ProseMirror_pre_code)]:border-0 [&_:where(.ProseMirror_pre_code)]:bg-transparent',
          // Inline code
          '[&_:where(.ProseMirror_code)]:px-1.5 [&_:where(.ProseMirror_code)]:py-0.5 [&_:where(.ProseMirror_code)]:text-sm [&_:where(.ProseMirror_code)]:font-mono [&_:where(.ProseMirror_code)]:font-medium [&_:where(.ProseMirror_code)]:rounded-md [&_:where(.ProseMirror_code)]:inline-block [&_:where(.ProseMirror_code)]:border [&_:where(.ProseMirror_code)]:border-muted [&_:where(.ProseMirror_code)]:text-highlighted [&_:where(.ProseMirror_code)]:bg-muted',
          // Lists
          '[&_:where(.ProseMirror_:is(ul,ol))]:ps-6',
          '[&_:where(.ProseMirror_ul)]:list-disc [&_:where(.ProseMirror_ul)]:marker:text-(--ui-border-accented)',
          '[&_:where(.ProseMirror_ol)]:list-decimal [&_:where(.ProseMirror_ol)]:marker:text-muted',
          '[&_:where(.ProseMirror_li)]:my-1.5 [&_:where(.ProseMirror_li)]:ps-1.5',
          // Images
          '[&_:where(.ProseMirror_img)]:rounded-md [&_:where(.ProseMirror_img)]:block [&_:where(.ProseMirror_img)]:max-w-full [&_:where(.ProseMirror_img.ProseMirror-selectednode)]:outline-2 [&_:where(.ProseMirror_img.ProseMirror-selectednode)]:outline-primary',
          // Selected nodes
          '[&_:where(.ProseMirror_.ProseMirror-selectednode:not(img):not(pre):not([data-node-view-wrapper]))]:bg-primary/20'
        ]
      }
    },
    /**
     * Applied on the content wrapper (scoped like `prose`) so placeholders also render for
     * external editors; the `.is-empty`/`data-placeholder` decorations come from the
     * Placeholder extension.
     */
    placeholderMode: {
      firstLine: {
        content: '[&_:where(.ProseMirror_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child)]:before:content-[attr(data-placeholder)] [&_:where(.ProseMirror_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child)]:before:text-dimmed [&_:where(.ProseMirror_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child)]:before:float-start [&_:where(.ProseMirror_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child)]:before:h-0 [&_:where(.ProseMirror_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child)]:before:pointer-events-none'
      },
      everyLine: {
        content: '[&_:where(.ProseMirror_:is(p,h1,h2,h3,h4,h5,h6).is-empty)]:before:content-[attr(data-placeholder)] [&_:where(.ProseMirror_:is(p,h1,h2,h3,h4,h5,h6).is-empty)]:before:text-dimmed [&_:where(.ProseMirror_:is(p,h1,h2,h3,h4,h5,h6).is-empty)]:before:float-start [&_:where(.ProseMirror_:is(p,h1,h2,h3,h4,h5,h6).is-empty)]:before:h-0 [&_:where(.ProseMirror_:is(p,h1,h2,h3,h4,h5,h6).is-empty)]:before:pointer-events-none'
      }
    }
  },
  defaultVariants: {
    prose: true,
    placeholderMode: 'everyLine'
  }
})
