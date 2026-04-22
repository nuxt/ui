import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { Editor } from '@tiptap/vue-3';
import type { BubbleMenuPluginProps } from '@tiptap/extension-bubble-menu';
import type { FloatingMenuPluginProps } from '@tiptap/extension-floating-menu';
import theme from '#build/ui/editor-toolbar';
import type { ButtonProps, DropdownMenuProps, DropdownMenuItem, TooltipProps, LinkPropsKeys } from '../types';
import type { EditorItem, EditorCustomHandlers } from '../types/editor';
import type { ArrayOrNested, DynamicSlots, MergeTypes, NestedItem } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type EditorToolbar = ComponentConfig<typeof theme, AppConfig, 'editorToolbar'>;
type ButtonItem = Omit<ButtonProps, 'type'> & {
    'slot'?: string;
    'tooltip'?: TooltipProps;
    'aria-label'?: string;
};
type EditorToolbarButtonItem<H extends EditorCustomHandlers = EditorCustomHandlers> = Omit<ButtonItem, LinkPropsKeys> & EditorItem<H>;
type EditorToolbarDropdownChildItem<H extends EditorCustomHandlers = EditorCustomHandlers> = DropdownMenuItem | (Omit<DropdownMenuItem, 'type'> & EditorItem<H>);
type EditorToolbarDropdownItem<H extends EditorCustomHandlers = EditorCustomHandlers> = ButtonItem & DropdownMenuProps<ArrayOrNested<EditorToolbarDropdownChildItem<H>>>;
export type EditorToolbarItem<H extends EditorCustomHandlers = EditorCustomHandlers> = ButtonItem | EditorToolbarButtonItem<H> | EditorToolbarDropdownItem<H>;
type EditorToolbarBaseProps<T extends ArrayOrNested<EditorToolbarItem> = ArrayOrNested<EditorToolbarItem>> = {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * The color of the toolbar controls.
     * @defaultValue 'neutral'
     */
    color?: ButtonProps['color'];
    /**
     * The variant of the toolbar controls.
     * @defaultValue 'ghost'
     */
    variant?: ButtonProps['variant'];
    /**
     * The color of the active toolbar control.
     * @defaultValue 'primary'
     */
    activeColor?: ButtonProps['color'];
    /**
     * The variant of the active toolbar control.
     * @defaultValue 'soft'
     */
    activeVariant?: ButtonProps['variant'];
    /**
     * The size of the toolbar controls.
     * @defaultValue 'sm'
     */
    size?: ButtonProps['size'];
    items?: T;
    editor: Editor;
    class?: any;
    ui?: EditorToolbar['slots'];
};
export type EditorToolbarProps<T extends ArrayOrNested<EditorToolbarItem> = ArrayOrNested<EditorToolbarItem>> = (EditorToolbarBaseProps<T> & {
    layout?: 'fixed';
}) | (EditorToolbarBaseProps<T> & Partial<Omit<BubbleMenuPluginProps, 'editor' | 'element'>> & {
    layout?: 'bubble';
}) | (EditorToolbarBaseProps<T> & Partial<Omit<FloatingMenuPluginProps, 'editor' | 'element'>> & {
    layout?: 'floating';
});
type SlotPropsProps = {
    index: number;
    isActive: (item: EditorToolbarItem) => boolean;
    isDisabled: (item: EditorToolbarItem) => boolean;
    onClick: (e: MouseEvent, item: EditorToolbarItem) => void;
};
type SlotProps<T extends EditorToolbarItem> = (props: {
    item: T;
} & SlotPropsProps) => VNode[];
export type EditorToolbarSlots<A extends ArrayOrNested<EditorToolbarItem> = ArrayOrNested<EditorToolbarItem>, T extends NestedItem<A> = NestedItem<A>> = {
    item?: SlotProps<T>;
} & DynamicSlots<MergeTypes<T>, undefined, SlotPropsProps>;
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends ArrayOrNested<EditorToolbarItem>>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<EditorToolbarProps<T>> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: EditorToolbarSlots<T, NestedItem<T>>;
    emit: {};
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
