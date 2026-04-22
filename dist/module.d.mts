import * as _nuxt_schema from '@nuxt/schema';
import { HookResult } from '@nuxt/schema';
export * from '../dist/runtime/types/index.js';

type Color = 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | (string & {});
type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | (string & {});
interface ModuleOptions {
    /**
     * Prefix for components
     * @defaultValue `U`
     * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#prefix
     */
    prefix?: string;
    /**
     * Enable or disable `@nuxt/fonts` module
     * @defaultValue `true`
     * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#fonts
     */
    fonts?: boolean;
    /**
     * Enable or disable `@nuxtjs/color-mode` module
     * @defaultValue `true`
     * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#colormode
     */
    colorMode?: boolean;
    /**
     * Customize how the theme is generated
     * @see https://ui.nuxt.com/docs/getting-started/theme/design-system
     */
    theme?: {
        /**
         * Define the color aliases available for components
         * @defaultValue `['primary', 'secondary', 'success', 'info', 'warning', 'error']`
         * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#themecolors
         */
        colors?: Color[];
        /**
         * Enable or disable transitions on components
         * @defaultValue `true`
         * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#themetransitions
         */
        transitions?: boolean;
        /**
         * The default variants to use for components
         * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#themedefaultvariants
         */
        defaultVariants?: {
            /**
             * The default color variant to use for components
             * @defaultValue `'primary'`
             */
            color?: Color;
            /**
             * The default size variant to use for components
             * @defaultValue `'md'`
             */
            size?: Size;
        };
        /**
         * Prefix for Tailwind CSS utility classes
         * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#themeprefix
         * @example 'tw'
         */
        prefix?: string;
    };
    /**
     * Force the import of prose components even if `@nuxtjs/mdc` or `@nuxt/content` are not installed
     * @defaultValue false
     * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#prose
     */
    prose?: boolean;
    /**
     * @deprecated Use `prose` instead
     * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#mdc
     */
    mdc?: boolean;
    /**
     * Force the import of content & prose components even if `@nuxt/content` is not installed
     * @defaultValue false
     * @see https://ui.nuxt.com/docs/getting-started/installation/nuxt#content
     */
    content?: boolean;
    /**
     * Experimental features
     */
    experimental?: {
        /**
         * Enable automatic component detection for tree-shaking
         * Only generates theme files for components actually used in your app
         * - `true`: Enable automatic detection
         * - `string[]`: Enable detection and include additional components (useful for dynamic components)
         * @defaultValue false
         * @example true
         * @example ['Modal', 'Dropdown']
         */
        componentDetection?: boolean | string[];
    };
}
declare module '#app' {
    interface RuntimeNuxtHooks {
        'dashboard:search:toggle': () => HookResult;
        'dashboard:sidebar:toggle': () => HookResult;
        'dashboard:sidebar:collapse': (value: boolean) => HookResult;
    }
}
declare const _default: _nuxt_schema.NuxtModule<ModuleOptions, ModuleOptions, false>;

export { _default as default };
export type { ModuleOptions };
