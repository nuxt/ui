import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/editor-suggestion-menu';
import type { EditorMenuOptions } from '../composables/useEditorMenu';
import type { IconProps } from '../types';
import type { EditorItem, EditorCustomHandlers } from '../types/editor';
import type { ComponentConfig } from '../types/tv';
type EditorSuggestionMenu = ComponentConfig<typeof theme, AppConfig, 'editorSuggestionMenu'>;
type EditorSuggestionMenuLabelItem = {
    type: 'label';
    label: string;
    class?: any;
    [key: string]: any;
};
type EditorSuggestionMenuSeparatorItem = {
    type: 'separator';
    class?: any;
    [key: string]: any;
};
type EditorSuggestionMenuActionItem<H extends EditorCustomHandlers = EditorCustomHandlers> = {
    type?: never;
    label: string;
    description?: string;
    /**
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    disabled?: boolean;
    class?: any;
    [key: string]: any;
} & EditorItem<H>;
export type EditorSuggestionMenuItem<H extends EditorCustomHandlers = EditorCustomHandlers> = EditorSuggestionMenuLabelItem | EditorSuggestionMenuSeparatorItem | EditorSuggestionMenuActionItem<H>;
export interface EditorSuggestionMenuProps<T extends EditorSuggestionMenuItem = EditorSuggestionMenuItem> extends Partial<Pick<EditorMenuOptions<T>, 'editor' | 'char' | 'pluginKey' | 'filterFields' | 'limit' | 'options' | 'suggestion' | 'appendTo'>> {
    /**
     * @defaultValue 'md'
     */
    size?: EditorSuggestionMenu['variants']['size'];
    items?: T[] | T[][];
    class?: any;
    ui?: EditorSuggestionMenu['slots'];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends EditorSuggestionMenuItem>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<EditorSuggestionMenuProps<T>> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: {};
    emit: {};
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
