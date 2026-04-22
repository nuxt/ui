import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/textarea';
import type { UseComponentIconsProps } from '../composables/useComponentIcons';
import type { TextareaHTMLAttributes } from '../types/html';
import type { ModelModifiers, ApplyModifiers } from '../types/input';
import type { ComponentConfig } from '../types/tv';
type Textarea = ComponentConfig<typeof theme, AppConfig, 'textarea'>;
type TextareaValue = string | number | null;
export interface TextareaProps<T extends TextareaValue = TextareaValue, Mod extends ModelModifiers = ModelModifiers> extends UseComponentIconsProps, /** @vue-ignore */ Omit<TextareaHTMLAttributes, 'name' | 'placeholder' | 'required' | 'autofocus' | 'disabled' | 'rows'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    id?: string;
    name?: string;
    /** The placeholder text when the textarea is empty. */
    placeholder?: string;
    /**
     * @defaultValue 'primary'
     */
    color?: Textarea['variants']['color'];
    /**
     * @defaultValue 'outline'
     */
    variant?: Textarea['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: Textarea['variants']['size'];
    required?: boolean;
    autofocus?: boolean;
    autofocusDelay?: number;
    autoresize?: boolean;
    autoresizeDelay?: number;
    disabled?: boolean;
    rows?: number;
    maxrows?: number;
    /** Highlight the ring color like a focus state. */
    highlight?: boolean;
    /** Keep the mobile text size on all breakpoints. */
    fixed?: boolean;
    defaultValue?: ApplyModifiers<T, Mod>;
    modelValue?: ApplyModifiers<T, Mod>;
    modelModifiers?: Mod;
    class?: any;
    ui?: Textarea['slots'];
}
export interface TextareaEmits<T extends TextareaValue = TextareaValue, Mod extends ModelModifiers = ModelModifiers> {
    'update:modelValue': [value: ApplyModifiers<T, Mod>];
    'blur': [event: FocusEvent];
    'change': [event: Event];
}
export interface TextareaSlots {
    leading?(props: {
        ui: Textarea['ui'];
    }): VNode[];
    default?(props: {
        ui: Textarea['ui'];
    }): VNode[];
    trailing?(props: {
        ui: Textarea['ui'];
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends TextareaValue, Mod extends ModelModifiers = ModelModifiers>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<TextareaProps<T, Mod> & {
        onBlur?: ((event: FocusEvent) => any) | undefined;
        onChange?: ((event: Event) => any) | undefined;
        "onUpdate:modelValue"?: ((value: Mod extends {
            number: true;
        } ? (Mod extends {
            optional: true;
        } ? (Mod extends {
            nullable: true;
        } ? T | null : T) | undefined : Mod extends {
            nullable: true;
        } ? T | null : T) extends infer T_1 ? T_1 extends (Mod extends {
            optional: true;
        } ? (Mod extends {
            nullable: true;
        } ? T | null : T) | undefined : Mod extends {
            nullable: true;
        } ? T | null : T) ? T_1 extends string ? number | T_1 : T_1 : never : never : Mod extends {
            optional: true;
        } ? (Mod extends {
            nullable: true;
        } ? T | null : T) | undefined : Mod extends {
            nullable: true;
        } ? T | null : T) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import("vue").ShallowUnwrapRef<{
        textareaRef: Readonly<import("vue").ShallowRef<HTMLTextAreaElement | null, HTMLTextAreaElement | null>>;
        autoResize: () => void;
    }>) => void;
    attrs: any;
    slots: TextareaSlots;
    emit: ((evt: "blur", event: FocusEvent) => void) & ((evt: "change", event: Event) => void) & ((evt: "update:modelValue", value: Mod extends {
        number: true;
    } ? (Mod extends {
        optional: true;
    } ? (Mod extends {
        nullable: true;
    } ? T | null : T) | undefined : Mod extends {
        nullable: true;
    } ? T | null : T) extends infer T_1 ? T_1 extends (Mod extends {
        optional: true;
    } ? (Mod extends {
        nullable: true;
    } ? T | null : T) | undefined : Mod extends {
        nullable: true;
    } ? T | null : T) ? T_1 extends string ? number | T_1 : T_1 : never : never : Mod extends {
        optional: true;
    } ? (Mod extends {
        nullable: true;
    } ? T | null : T) | undefined : Mod extends {
        nullable: true;
    } ? T | null : T) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
