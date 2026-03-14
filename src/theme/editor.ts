import type { ModuleOptions } from '../module'

export default (options: Required<ModuleOptions>) => ({
  slots: {
    root: '',
    content: 'relative size-full flex-1',
    base: [
      'w-full outline-none *:my-5 *:first:mt-0 *:last:mb-0 sm:px-8 selection:bg-primary/20',
      // Paragraph
      '[&_p]:leading-7',
      // Links
      '[&_a]:text-primary [&_a]:border-b [&_a]:border-transparent [&_a]:hover:border-primary [&_a]:font-medium',
      options.theme?.transitions && '[&_a]:transition-colors',
      // Code inside links
      '[&_a>code]:border-dashed [&_a:hover>code]:border-primary [&_a:hover>code]:text-primary',
      options.theme?.transitions && '[&_a>code]:transition-colors',
      // Mentions
      '[&_.mention]:text-primary [&_.mention]:font-medium',
      // Headings - shared styles
      '[&_:is(h1,h2,h3,h4,h5,h6)]:text-highlighted [&_:is(h1,h2,h3,h4,h5,h6)]:font-bold',
      // Headings - unique styles
      '[&_h1]:text-3xl',
      '[&_h2]:text-2xl',
      '[&_h3]:text-xl',
      '[&_h4]:text-lg',
      '[&_h5]:text-base',
      '[&_h6]:text-base',
      // Code inside headings
      '[&_:is(h1,h2,h3,h4,h5,h6)>code]:border-dashed [&_:is(h1,h2,h3,h4,h5,h6)>code]:font-bold',
      '[&_h2>code]:text-xl/6',
      '[&_h3>code]:text-lg/5',
      // Blockquote & HR
      '[&_blockquote]:border-s-4 [&_blockquote]:border-accented [&_blockquote]:ps-4 [&_blockquote]:italic',
      '[&_[data-type=horizontalRule]]:my-8 [&_[data-type=horizontalRule]]:py-2',
      '[&_hr]:border-t [&_hr]:border-default',
      // Code blocks
      '[&_pre]:text-sm/6 [&_pre]:border [&_pre]:border-muted [&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:px-4 [&_pre]:py-3 [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:overflow-x-auto',
      '[&_pre_code]:p-0 [&_pre_code]:text-inherit [&_pre_code]:font-inherit [&_pre_code]:rounded-none [&_pre_code]:inline [&_pre_code]:border-0 [&_pre_code]:bg-transparent',
      // Inline code
      '[&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono [&_code]:font-medium [&_code]:rounded-md [&_code]:inline-block [&_code]:border [&_code]:border-muted [&_code]:text-highlighted [&_code]:bg-muted',
      // Lists
      '[&_:is(ul,ol)]:ps-6',
      '[&_ul]:list-disc [&_ul]:marker:text-(--ui-border-accented)',
      '[&_ol]:list-decimal [&_ol]:marker:text-muted',
      '[&_li]:my-1.5 [&_li]:ps-1.5',
      // Images
      '[&_img]:rounded-md [&_img]:block [&_img]:max-w-full [&_img.ProseMirror-selectednode]:outline-2 [&_img.ProseMirror-selectednode]:outline-primary',
      // Selected nodes
      '[&_.ProseMirror-selectednode:not(img):not(pre):not([data-node-view-wrapper])]:bg-primary/20'
    ]
  },
  variants: {
    placeholderMode: {
      firstLine: {
        base: '[&_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child]:before:content-[attr(data-placeholder)] [&_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child]:before:text-dimmed [&_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child]:before:float-start [&_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child]:before:h-0 [&_:is(p,h1,h2,h3,h4,h5,h6).is-editor-empty:first-child]:before:pointer-events-none'
      },
      everyLine: {
        base: '[&_:is(p,h1,h2,h3,h4,h5,h6).is-empty]:before:content-[attr(data-placeholder)] [&_:is(p,h1,h2,h3,h4,h5,h6).is-empty]:before:text-dimmed [&_:is(p,h1,h2,h3,h4,h5,h6).is-empty]:before:float-start [&_:is(p,h1,h2,h3,h4,h5,h6).is-empty]:before:h-0 [&_:is(p,h1,h2,h3,h4,h5,h6).is-empty]:before:pointer-events-none'
      }
    }
  },
  defaultVariants: {
    placeholderMode: 'everyLine'
  }
})
