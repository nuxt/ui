import type { Plugin } from 'vue'
import type { NuxtUIPluginOptions } from './dist/vite.mjs'

declare const plugin: Plugin<[NuxtUIPluginOptions?]>

export default plugin
