// Keep in sync with the actual named exports from each composable file.
// Used by both the Nuxt module (`addImports`) and Vite plugin (`unplugin-auto-import`).
export const publicComposables: Record<string, string[]> = {
  defineLocale: ['defineLocale', 'extendLocale'],
  defineShortcuts: ['defineShortcuts', 'extractShortcuts'],
  useContentSearch: ['useContentSearch'],
  useFileUpload: ['useFileUpload'],
  useFormField: ['useFormField'],
  useKbd: ['useKbd'],
  useOverlay: ['useOverlay'],
  useResizable: ['useResizable'],
  useScrollShadow: ['useScrollShadow'],
  useScrollspy: ['useScrollspy'],
  useToast: ['useToast']
}
