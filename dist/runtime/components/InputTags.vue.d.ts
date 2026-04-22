import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { TagsInputRootProps, TagsInputRootEmits, AcceptableInputValue } from 'reka-ui';
import theme from '#build/ui/input-tags';
import type { UseComponentIconsProps } from '../composables/useComponentIcons';
import type { IconProps } from '../types';
import type { InputHTMLAttributes } from '../types/html';
import type { ComponentConfig } from '../types/tv';
type InputTags = ComponentConfig<typeof theme, AppConfig, 'inputTags'>;
export type InputTagItem = AcceptableInputValue;
export interface InputTagsProps<T extends InputTagItem = InputTagItem> extends Pick<TagsInputRootProps<T>, 'modelValue' | 'defaultValue' | 'addOnPaste' | 'addOnTab' | 'addOnBlur' | 'duplicate' | 'disabled' | 'delimiter' | 'max' | 'id' | 'convertValue' | 'displayValue' | 'name' | 'required'>, UseComponentIconsProps, /** @vue-ignore */ Omit<InputHTMLAttributes, 'disabled' | 'max' | 'required' | 'name' | 'placeholder' | 'type' | 'autofocus' | 'maxlength' | 'minlength' | 'pattern' | 'size' | 'min' | 'step'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /** The placeholder text when the input is empty. */
    placeholder?: string;
    /** The maximum number of character allowed. */
    maxLength?: number;
    /**
     * @defaultValue 'primary'
     */
    color?: InputTags['variants']['color'];
    /**
     * @defaultValue 'outline'
     */
    variant?: InputTags['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: InputTags['variants']['size'];
    autofocus?: boolean;
    autofocusDelay?: number;
    /**
     * The icon displayed to delete a tag.
     * @defaultValue appConfig.ui.icons.close
     * @IconifyIcon
     */
    deleteIcon?: IconProps['name'];
    /** Highlight the ring color like a focus state. */
    highlight?: boolean;
    /** Keep the mobile text size on all breakpoints. */
    fixed?: boolean;
    class?: any;
    ui?: InputTags['slots'];
}
export interface InputTagsEmits<T extends InputTagItem> extends TagsInputRootEmits<T> {
    change: [event: Event];
    blur: [event: FocusEvent];
    focus: [event: FocusEvent];
}
type SlotProps<T extends InputTagItem> = (props: {
    item: T;
    index: number;
    ui: InputTags['ui'];
}) => VNode[];
export interface InputTagsSlots<T extends InputTagItem = InputTagItem> {
    'leading'?(props: {
        ui: InputTags['ui'];
    }): VNode[];
    'default'?(props: {
        ui: InputTags['ui'];
    }): VNode[];
    'trailing'?(props: {
        ui: InputTags['ui'];
    }): VNode[];
    'item-text'?: SlotProps<T>;
    'item-delete'?: SlotProps<T>;
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends InputTagItem>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<InputTagsProps<T> & {
        onBlur?: ((event: FocusEvent) => any) | undefined;
        onChange?: ((event: Event) => any) | undefined;
        onFocus?: ((event: FocusEvent) => any) | undefined;
        onInvalid?: ((payload: T) => any) | undefined;
        "onUpdate:modelValue"?: ((payload: T[]) => any) | undefined;
        onAddTag?: ((payload: T) => any) | undefined;
        onRemoveTag?: ((payload: T) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import("vue").ShallowUnwrapRef<{
        inputRef: Readonly<import("vue").Ref<HTMLInputElement, HTMLInputElement>>;
    }>) => void;
    attrs: any;
    slots: InputTagsSlots<T>;
    emit: ((evt: "blur", event: FocusEvent) => void) & ((evt: "change", event: Event) => void) & ((evt: "focus", event: FocusEvent) => void) & ((evt: "invalid", payload: T) => void) & ((evt: "update:modelValue", payload: T[]) => void) & ((evt: "addTag", payload: T) => void) & ((evt: "removeTag", payload: T) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
