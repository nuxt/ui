import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { UseFuseOptions } from '@vueuse/integrations/useFuse';
import theme from '#build/ui/dashboard-search';
import type { ButtonProps, InputProps, ModalProps, CommandPaletteProps, CommandPaletteSlots, CommandPaletteGroup, CommandPaletteItem, IconProps, LinkPropsKeys } from '../types';
import type { ComponentConfig } from '../types/tv';
type DashboardSearch = ComponentConfig<typeof theme, AppConfig, 'dashboardSearch'>;
export interface DashboardSearchProps<T extends CommandPaletteItem = CommandPaletteItem> extends Pick<ModalProps, 'title' | 'description' | 'overlay' | 'transition' | 'content' | 'dismissible' | 'fullscreen' | 'modal' | 'portal'> {
    /**
     * @defaultValue 'md'
     */
    size?: DashboardSearch['variants']['size'];
    /**
     * The icon displayed in the input.
     * @defaultValue appConfig.ui.icons.search
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    /**
     * The placeholder text for the input.
     * @defaultValue t('commandPalette.placeholder')
     */
    placeholder?: InputProps['placeholder'];
    /**
     * Automatically focus the input when component is mounted.
     * @defaultValue true
     */
    autofocus?: boolean;
    /** When `true`, the loading icon will be displayed. */
    loading?: boolean;
    /**
     * The icon when the `loading` prop is `true`.
     * @defaultValue appConfig.ui.icons.loading
     * @IconifyIcon
     */
    loadingIcon?: IconProps['name'];
    /**
     * Display a close button in the input (useful when inside a Modal for example).
     * `{ size: 'md', color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
     * @emits 'update:open'
     * @defaultValue true
     */
    close?: boolean | Omit<ButtonProps, LinkPropsKeys>;
    /**
     * The icon displayed in the close button.
     * @defaultValue appConfig.ui.icons.close
     * @IconifyIcon
     */
    closeIcon?: IconProps['name'];
    /**
     * Keyboard shortcut to open the search (used by [`defineShortcuts`](https://ui.nuxt.com/docs/composables/define-shortcuts))
     * @defaultValue 'meta_k'
     */
    shortcut?: string;
    groups?: CommandPaletteGroup<T>[];
    /**
     * Options for [useFuse](https://vueuse.org/integrations/useFuse) passed to the [CommandPalette](https://ui.nuxt.com/docs/components/command-palette).
     * @defaultValue {}
     */
    fuse?: UseFuseOptions<T>;
    /**
     * When `true`, the theme command will be added to the groups.
     * @defaultValue true
     */
    colorMode?: boolean;
    class?: any;
    ui?: DashboardSearch['slots'] & CommandPaletteProps<CommandPaletteGroup<CommandPaletteItem>, CommandPaletteItem>['ui'];
}
export type DashboardSearchSlots = CommandPaletteSlots<CommandPaletteItem> & {
    content?(props: {
        close: () => void;
    }): VNode[];
};
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<DashboardSearchProps<CommandPaletteItem> & {
    open?: boolean;
    searchTerm?: string;
}, {
    commandPaletteRef: Readonly<import("vue").ShallowRef<{} | null, {} | null>>;
}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (value: boolean) => any;
    "update:searchTerm": (value: string) => any;
}, string, import("vue").PublicProps, Readonly<DashboardSearchProps<CommandPaletteItem> & {
    open?: boolean;
    searchTerm?: string;
}> & Readonly<{
    "onUpdate:open"?: ((value: boolean) => any) | undefined;
    "onUpdate:searchTerm"?: ((value: string) => any) | undefined;
}>, {
    close: boolean | Omit<ButtonProps, LinkPropsKeys>;
    colorMode: boolean;
    fullscreen: boolean;
    shortcut: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, DashboardSearchSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
