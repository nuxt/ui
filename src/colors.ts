// The `@nuxt/ui/colors` Tailwind CSS plugin, an entry of its own so the export
// resolves when the module is stubbed, where `dist/runtime` holds the `.ts`
// source. The build keeps it a re-export: the plugin reads the stylesheets next to it.
export { default } from './runtime/css/colors'
export type { ColorsOptions } from './runtime/css/colors'
