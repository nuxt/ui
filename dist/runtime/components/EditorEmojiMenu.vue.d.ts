import type { AppConfig } from '@nuxt/schema';
import type { EditorMenuOptions } from '../composables/useEditorMenu';
import type { ComponentConfig } from '../types/tv';
import theme from '#build/ui/editor-emoji-menu';
type EditorEmojiMenu = ComponentConfig<typeof theme, AppConfig, 'editorEmojiMenu'>;
export interface EditorEmojiMenuItem {
    name: string;
    emoji?: string;
    shortcodes: string[];
    tags: string[];
    group?: string;
    fallbackImage?: string;
    [key: string]: any;
}
export interface EditorEmojiMenuProps<T extends EditorEmojiMenuItem = EditorEmojiMenuItem> extends Partial<Pick<EditorMenuOptions<T>, 'editor' | 'char' | 'pluginKey' | 'filterFields' | 'limit' | 'options' | 'suggestion' | 'appendTo'>> {
    /**
     * @defaultValue 'md'
     */
    size?: EditorEmojiMenu['variants']['size'];
    items?: T[] | T[][];
    class?: any;
    ui?: EditorEmojiMenu['slots'];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends EditorEmojiMenuItem>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<EditorEmojiMenuProps<T>> & (typeof globalThis extends {
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
