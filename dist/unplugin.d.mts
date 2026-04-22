import * as unplugin from 'unplugin';
import { Options } from 'unplugin-auto-import/types';
import { Options as Options$1 } from 'unplugin-vue-components/types';
import colors from 'tailwindcss/colors';
import { RuntimeOptions } from '@nuxt/icon';
import * as ui from '#build/ui';
import { ModuleOptions } from './module.mjs';
import { TVConfig } from '../dist/runtime/types/tv.js';
import '@nuxt/schema';
import '../dist/runtime/types/index.js';

declare const _default: {
    arrowDown: string;
    arrowLeft: string;
    arrowRight: string;
    arrowUp: string;
    caution: string;
    check: string;
    chevronDoubleLeft: string;
    chevronDoubleRight: string;
    chevronDown: string;
    chevronLeft: string;
    chevronRight: string;
    chevronUp: string;
    close: string;
    copy: string;
    copyCheck: string;
    dark: string;
    drag: string;
    ellipsis: string;
    error: string;
    external: string;
    eye: string;
    eyeOff: string;
    file: string;
    folder: string;
    folderOpen: string;
    hash: string;
    info: string;
    light: string;
    loading: string;
    menu: string;
    minus: string;
    panelClose: string;
    panelOpen: string;
    plus: string;
    reload: string;
    search: string;
    stop: string;
    success: string;
    system: string;
    tip: string;
    upload: string;
    warning: string;
};

type NeutralColor = 'slate' | 'gray' | 'zinc' | 'neutral' | 'stone' | 'taupe' | 'mauve' | 'mist' | 'olive';
type Color = Exclude<keyof typeof colors, 'inherit' | 'current' | 'transparent' | 'black' | 'white' | NeutralColor> | (string & {});
type AppConfigUI = {
    colors?: Record<string, Color> & {
        neutral?: NeutralColor;
    };
    icons?: Partial<typeof _default>;
    prefix?: string;
} & TVConfig<typeof ui>;
interface NuxtUIOptions extends Omit<ModuleOptions, 'fonts' | 'colorMode' | 'content' | 'experimental'> {
    /** Whether to generate declaration files for auto-imported components. */
    dts?: boolean;
    ui?: AppConfigUI;
    /**
     * Default props for the `Icon` component
     */
    icon?: Pick<RuntimeOptions, 'customize' | 'size' | 'mode'>;
    /**
     * Enable or disable `@vueuse/core` color-mode integration
     * @defaultValue `true`
     * @see https://ui.nuxt.com/docs/getting-started/installation/vue#colormode
     */
    colorMode?: boolean;
    /**
     * Override options for `unplugin-auto-import`, or `false` to disable composable auto-imports
     * @see https://ui.nuxt.com/docs/getting-started/installation/vue#autoimport
     */
    autoImport?: false | Partial<Options>;
    /**
     * Override options for `unplugin-vue-components`, or `false` to disable component auto-imports
     * @see https://ui.nuxt.com/docs/getting-started/installation/vue#components
     */
    components?: false | Partial<Options$1>;
    /**
     * Router integration mode
     * - `true` (default): Use vue-router integration
     * - `false`: Disable routing, use anchor tags
     * - `'inertia'`: Use Inertia.js compatibility layer
     * @defaultValue `true`
     * @see https://ui.nuxt.com/docs/getting-started/installation/vue#router
     */
    router?: boolean | 'inertia';
    /**
     * Enables compatibility layer for InertiaJS
     * @deprecated Use `router: 'inertia'` instead
     */
    inertia?: boolean;
    /**
     * Additional packages to scan for components using Nuxt UI
     * @see https://ui.nuxt.com/docs/getting-started/installation/vue#scanpackages
     */
    scanPackages?: string[];
}
declare const runtimeDir: string;
declare const NuxtUIPlugin: unplugin.UnpluginInstance<NuxtUIOptions | undefined, boolean>;

export { NuxtUIPlugin, runtimeDir };
export type { NuxtUIOptions };
