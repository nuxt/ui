import type { VNode } from 'vue';
import type { ContentNavigationItem } from '@nuxt/content';
import type { AppConfig } from '@nuxt/schema';
import type { UseFuseOptions } from '@vueuse/integrations/useFuse';
import theme from '#build/ui/content/content-search';
import type { ButtonProps, InputProps, LinkProps, ModalProps, CommandPaletteProps, CommandPaletteSlots, CommandPaletteGroup, CommandPaletteItem, IconProps, LinkPropsKeys } from '../../types';
import type { ComponentConfig } from '../../types/tv';
type ContentSearch = ComponentConfig<typeof theme, AppConfig, 'contentSearch'>;
export interface ContentSearchLink extends Omit<LinkProps, 'custom'> {
    label?: string;
    description?: string;
    /**
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    children?: ContentSearchLink[];
}
export interface ContentSearchFile {
    id: string;
    title: string;
    titles: string[];
    level: number;
    content: string;
}
export interface ContentSearchItem extends Omit<LinkProps, 'custom'>, CommandPaletteItem {
    level?: number;
    /**
     * @IconifyIcon
     */
    icon?: IconProps['name'];
}
export interface ContentSearchProps<T extends ContentSearchLink = ContentSearchLink> extends Pick<ModalProps, 'title' | 'description' | 'overlay' | 'transition' | 'content' | 'dismissible' | 'fullscreen' | 'modal' | 'portal'> {
    /**
     * @defaultValue 'md'
     */
    size?: ContentSearch['variants']['size'];
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
    /** Links group displayed as the first group in the command palette. */
    links?: T[];
    navigation?: ContentNavigationItem[];
    /** Custom groups displayed between navigation and color mode group. */
    groups?: CommandPaletteGroup<ContentSearchItem>[];
    files?: ContentSearchFile[];
    /**
     * Options for [useFuse](https://vueuse.org/integrations/useFuse) passed to the [CommandPalette](https://ui.nuxt.com/docs/components/command-palette).
     * @defaultValue { fuseOptions: { includeMatches: true } }
     */
    fuse?: UseFuseOptions<T>;
    /**
     * When `true`, the theme command will be added to the groups.
     * @defaultValue true
     */
    colorMode?: boolean;
    class?: any;
    ui?: ContentSearch['slots'] & CommandPaletteProps<CommandPaletteGroup<ContentSearchItem>, ContentSearchItem>['ui'];
}
export type ContentSearchSlots = CommandPaletteSlots<ContentSearchItem> & {
    content?(props: {
        close: () => void;
    }): VNode[];
};
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends ContentSearchLink>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<(ContentSearchProps<T> & {
        searchTerm?: string;
    }) & {
        "onUpdate:searchTerm"?: ((value: string) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import("vue").ShallowUnwrapRef<{
        commandPaletteRef: Readonly<import("vue").ShallowRef<{} | null, {} | null>>;
    }>) => void;
    attrs: any;
    slots: ContentSearchSlots;
    emit: (event: "update:searchTerm", value: string) => void;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
