import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/editor-mention-menu';
import type { EditorMenuOptions } from '../composables/useEditorMenu';
import type { AvatarProps, IconProps } from '../types';
import type { ComponentConfig } from '../types/tv';
type EditorMentionMenu = ComponentConfig<typeof theme, AppConfig, 'editorMentionMenu'>;
export interface EditorMentionMenuItem {
    label: string;
    description?: string;
    /**
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    avatar?: AvatarProps;
    disabled?: boolean;
    class?: any;
    [key: string]: any;
}
export interface EditorMentionMenuProps<T extends EditorMentionMenuItem = EditorMentionMenuItem> extends Partial<Pick<EditorMenuOptions<T>, 'editor' | 'char' | 'pluginKey' | 'filterFields' | 'limit' | 'options' | 'suggestion' | 'appendTo' | 'ignoreFilter'>> {
    /**
     * @defaultValue 'md'
     */
    size?: EditorMentionMenu['variants']['size'];
    items?: T[] | T[][];
    class?: any;
    ui?: EditorMentionMenu['slots'];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends EditorMentionMenuItem>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<(EditorMentionMenuProps<T> & {
        searchTerm?: string;
    }) & {
        "onUpdate:searchTerm"?: ((value: string) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: {};
    emit: (event: "update:searchTerm", value: string) => void;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
