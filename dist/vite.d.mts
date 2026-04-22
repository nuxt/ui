import * as unplugin from 'unplugin';
import { NuxtUIOptions } from './unplugin.mjs';
import 'unplugin-auto-import/types';
import 'unplugin-vue-components/types';
import 'tailwindcss/colors';
import '@nuxt/icon';
import '#build/ui';
import './module.mjs';
import '@nuxt/schema';
import '../dist/runtime/types/index.js';
import '../dist/runtime/types/tv.js';

declare const _default: (options?: NuxtUIOptions | undefined) => unplugin.VitePlugin<any> | unplugin.VitePlugin<any>[];

export { NuxtUIOptions, _default as default };
