import type { NuxtOptions } from '@nuxt/schema'

export default (_options: Required<NuxtOptions['ui']>) => ({
  slots: {
    root: 'flex flex-col',
    base: [
      '[&_.tiptap]:focus:outline-none [&_.tiptap]:size-full [&_.tiptap]:*:first:mt-0 [&_.tiptap]:*:last:mb-0',
      '[&_p]:my-5 [&_p]:leading-7 [&_p]:text-pretty',
      '[&_a]:text-primary [&_a]:border-b [&_a]:border-transparent [&_a]:hover:border-primary [&_a]:font-medium [&_a]:focus-visible:outline-primary [&_a]:[&>code]:border-dashed [&_a]:hover:[&>code]:border-primary [&_a]:hover:[&>code]:text-primary [&_a]:transition-colors [&_a]:[&>code]:transition-colors',
      '[&_h1]:text-4xl [&_h1]:text-highlighted [&_h1]:font-bold [&_h1]:mb-8',
      '[&_h2]:relative [&_h2]:text-2xl [&_h2]:text-highlighted [&_h2]:font-bold [&_h2]:mb-6 [&_h2]:[&>a]:focus-visible:outline-primary [&_h2]:[&>a>code]:border-dashed [&_h2]:hover:[&>a>code]:border-primary [&_h2]:hover:[&>a>code]:text-primary [&_h2]:[&>a>code]:text-xl/7 [&_h2]:[&>a>code]:font-bold [&_h2]:[&>a>code]:transition-colors',
      '[&_h3]:relative [&_h3]:text-xl [&_h3]:text-highlighted [&_h3]:font-bold [&_h3]:mt-8 [&_h3]:mb-3 [&_h3]:[&>a]:focus-visible:outline-primary [&_h3]:[&>a>code]:border-dashed [&_h3]:hover:[&>a>code]:border-primary [&_h3]:hover:[&>a>code]:text-primary [&_h3]:[&>a>code]:text-lg/6 [&_h3]:[&>a>code]:font-bold [&_h3]:[&>a>code]:transition-colors',
      '[&_h4]:text-lg [&_h4]:text-highlighted [&_h4]:font-bold [&_h4]:mt-6 [&_h4]:mb-2 [&_h4]:[&>a]:focus-visible:outline-primary',
      '[&_blockquote]:border-s-4 [&_blockquote]:border-accented [&_blockquote]:ps-4 [&_blockquote]:italic',
      '[&_hr]:border-t [&_hr]:border-default [&_hr]:my-12',
      '[&_pre]:my-5 [&_pre]:font-mono [&_pre]:text-sm/6 [&_pre]:border [&_pre]:border-muted [&_pre]:bg-muted [&_pre]:rounded-md [&_pre]:px-4 [&_pre]:py-3 [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_pre]:overflow-x-auto [&_pre]:focus:outline-none',
      '[&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-sm [&_code]:font-mono [&_code]:font-medium [&_code]:rounded-md [&_code]:inline-block [&_code]:border [&_code]:border-muted [&_code]:text-highlighted [&_code]:bg-muted',
      '[&_ul]:list-disc [&_ul]:ps-6 [&_ul]:my-5 [&_ul]:marker:text-(--ui-border-accented)',
      '[&_ol]:list-decimal [&_ol]:ps-6 [&_ol]:my-5 [&_ol]:marker:text-muted',
      '[&_li]:my-1.5 [&_li]:ps-1.5 [&_li]:leading-7 [&_li]:[&>ul]:my-0'
    ]
  }
})
