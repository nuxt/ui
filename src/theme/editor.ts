import type { NuxtOptions } from '@nuxt/schema'

export default (_options: Required<NuxtOptions['ui']>) => ({
  slots: {
    root: 'flex flex-col',
    base: [
      // Editor container
      '[&_.tiptap]:focus:outline-none [&_.tiptap]:size-full [&_.tiptap]:*:first:mt-0 [&_.tiptap]:*:last:mb-0',
      // Paragraph
      '[&_p]:my-5 [&_p]:leading-7 [&_p]:text-pretty',
      // Links
      '[&_a]:text-primary [&_a]:border-b [&_a]:border-transparent [&_a]:hover:border-primary [&_a]:font-medium [&_a]:transition-colors',
      '[&_a_code]:border-dashed [&_a:hover_code]:border-primary [&_a:hover_code]:text-primary [&_a_code]:transition-colors',
      // Headings - shared styles
      '[&_:is(h1,h2,h3,h4)]:text-highlighted [&_:is(h1,h2,h3,h4)]:font-bold',
      '[&_:is(h2,h3)_a_code]:font-bold [&_:is(h2,h3)_a_code]:border-dashed [&_:is(h2,h3):hover_a_code]:border-primary [&_:is(h2,h3):hover_a_code]:text-primary [&_:is(h2,h3)_a_code]:transition-colors',
      // Headings - unique styles
      '[&_h1]:text-4xl [&_h1]:mb-8',
      '[&_h2]:text-2xl [&_h2]:mb-6 [&_h2_a_code]:text-xl/7',
      '[&_h3]:text-xl [&_h3]:mt-8 [&_h3]:mb-3 [&_h3_a_code]:text-lg/6',
      '[&_h4]:text-lg [&_h4]:mt-6 [&_h4]:mb-2',
      // Blockquote & HR
      '[&_blockquote]:border-s-4 [&_blockquote]:border-accented [&_blockquote]:ps-4 [&_blockquote]:italic',
      '[&_hr]:border-t [&_hr]:border-default [&_hr]:my-12',
      // Code blocks
      '[&_pre]:my-5 [&_pre]:font-mono [&_pre]:text-sm/6 [&_pre]:border [&_pre]:border-muted [&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:px-4 [&_pre]:py-3 [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:overflow-x-auto',
      // Inline code
      '[&_:not(pre)_code]:px-1.5 [&_:not(pre)_code]:py-0.5 [&_:not(pre)_code]:text-sm [&_:not(pre)_code]:font-mono [&_:not(pre)_code]:font-medium [&_:not(pre)_code]:rounded-md [&_:not(pre)_code]:inline-block [&_:not(pre)_code]:border [&_:not(pre)_code]:border-muted [&_:not(pre)_code]:text-highlighted [&_:not(pre)_code]:bg-muted',
      // Lists
      '[&_:is(ul,ol)]:ps-6 [&_:is(ul,ol)]:my-5',
      '[&_ul]:list-disc [&_ul]:marker:text-(--ui-border-accented)',
      '[&_ol]:list-decimal [&_ol]:marker:text-muted',
      '[&_li]:my-1.5 [&_li]:ps-1.5 [&_li]:leading-7 [&_li_p]:my-0 [&_li_ul]:my-0'
    ]
  }
})
