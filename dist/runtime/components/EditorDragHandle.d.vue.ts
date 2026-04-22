import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { Editor, JSONContent } from '@tiptap/vue-3';
import type { DragHandleProps } from '@tiptap/extension-drag-handle-vue-3';
import theme from '#build/ui/editor-drag-handle';
import type { ButtonProps, IconProps, LinkPropsKeys } from '../types';
import type { FloatingUIOptions } from '../types/editor';
import type { ComponentConfig } from '../types/tv';
type EditorDragHandle = ComponentConfig<typeof theme, AppConfig, 'editorDragHandle'>;
export interface EditorDragHandleProps extends Omit<DragHandleProps, 'editor' | 'element' | 'onNodeChange' | 'computePositionConfig' | 'class'>, Omit<ButtonProps, LinkPropsKeys | 'icon' | 'color' | 'variant'> {
    /**
     * @defaultValue appConfig.ui.icons.drag
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    /**
     * @defaultValue 'neutral'
     */
    color?: ButtonProps['color'];
    /**
     * @defaultValue 'ghost'
     */
    variant?: ButtonProps['variant'];
    /**
     * The options for positioning the drag handle. Those are passed to Floating UI and include options for the placement, offset, flip, shift, size, autoPlacement, hide, and inline middleware.
     * @defaultValue { strategy: 'absolute', placement: 'left-start' }
     * @see https://floating-ui.com/docs/computePosition#options
     */
    options?: FloatingUIOptions;
    editor: Editor;
    ui?: EditorDragHandle['slots'] & ButtonProps['ui'];
}
export interface EditorDragHandleSlots {
    default?(props: {
        ui: EditorDragHandle['ui'];
        onClick: () => {
            node: JSONContent;
            pos: number;
        } | undefined;
    }): VNode[];
}
export interface EditorDragHandleEmits {
    nodeChange: [{
        node: JSONContent;
        pos: number;
    }];
    hover: [{
        node: JSONContent;
        pos: number;
    }];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<EditorDragHandleProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    nodeChange: (args_0: {
        node: JSONContent;
        pos: number;
    }) => any;
    hover: (args_0: {
        node: JSONContent;
        pos: number;
    }) => any;
}, string, import("vue").PublicProps, Readonly<EditorDragHandleProps> & Readonly<{
    onNodeChange?: ((args_0: {
        node: JSONContent;
        pos: number;
    }) => any) | undefined;
    onHover?: ((args_0: {
        node: JSONContent;
        pos: number;
    }) => any) | undefined;
}>, {
    size: "xs" | "sm" | "md" | "lg" | "xl";
    color: "error" | "primary" | "secondary" | "success" | "info" | "warning" | "neutral";
    variant: "link" | "solid" | "outline" | "soft" | "subtle" | "ghost";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, EditorDragHandleSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
