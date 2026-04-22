import type { RadioGroupRootProps, RadioGroupRootEmits } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/radio-group';
import type { AcceptableValue, GetItemKeys, GetModelValue, GetModelValueEmits } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type RadioGroup = ComponentConfig<typeof theme, AppConfig, 'radioGroup'>;
export type RadioGroupValue = AcceptableValue;
export type RadioGroupItem = RadioGroupValue | {
    label?: string;
    description?: string;
    disabled?: boolean;
    value?: RadioGroupValue;
    class?: any;
    ui?: Pick<RadioGroup['slots'], 'item' | 'container' | 'base' | 'indicator' | 'wrapper' | 'label' | 'description'>;
    [key: string]: any;
};
export interface RadioGroupProps<T extends RadioGroupItem[] = RadioGroupItem[], VK extends GetItemKeys<T> = 'value'> extends Pick<RadioGroupRootProps, 'disabled' | 'loop' | 'name' | 'required'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    legend?: string;
    /**
     * When `items` is an array of objects, select the field to use as the value.
     * @defaultValue 'value'
     */
    valueKey?: VK;
    /**
     * When `items` is an array of objects, select the field to use as the label.
     * @defaultValue 'label'
     */
    labelKey?: GetItemKeys<T>;
    /**
     * When `items` is an array of objects, select the field to use as the description.
     * @defaultValue 'description'
     */
    descriptionKey?: GetItemKeys<T>;
    items?: T;
    /** The controlled value of the RadioGroup. Can be bind as `v-model`. */
    modelValue?: GetModelValue<T, VK, false>;
    /** The value of the RadioGroup when initially rendered. Use when you do not need to control the state of the RadioGroup. */
    defaultValue?: GetModelValue<T, VK, false>;
    /**
     * @defaultValue 'md'
     */
    size?: RadioGroup['variants']['size'];
    /**
     * @defaultValue 'list'
     */
    variant?: RadioGroup['variants']['variant'];
    /**
     * @defaultValue 'primary'
     */
    color?: RadioGroup['variants']['color'];
    /**
     * The orientation the radio buttons are laid out.
     * @defaultValue 'vertical'
     */
    orientation?: RadioGroup['variants']['orientation'];
    /**
     * Position of the indicator.
     * @defaultValue 'start'
     */
    indicator?: RadioGroup['variants']['indicator'];
    class?: any;
    ui?: RadioGroup['slots'];
}
export type RadioGroupEmits<T extends RadioGroupItem[] = RadioGroupItem[], VK extends GetItemKeys<T> = 'value'> = Omit<RadioGroupRootEmits, 'update:modelValue'> & {
    change: [event: Event];
} & GetModelValueEmits<T, VK, false>;
type NormalizeItem<T extends RadioGroupItem> = Exclude<T & {
    id: string;
}, RadioGroupValue>;
type SlotProps<T extends RadioGroupItem> = (props: {
    item: NormalizeItem<T>;
    modelValue: RadioGroupValue;
}) => VNode[];
export interface RadioGroupSlots<T extends RadioGroupItem[] = RadioGroupItem[]> {
    legend?(props?: {}): VNode[];
    label?: SlotProps<T[number]>;
    description?: SlotProps<T[number]>;
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends RadioGroupItem[], VK extends GetItemKeys<T> = "value">(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<RadioGroupProps<T, VK> & {
        onChange?: ((event: Event) => any) | undefined;
        "onUpdate:modelValue"?: ((value: import("../types").GetItemValue<T, VK, undefined, import("../types").NestedItem<T>>) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: RadioGroupSlots<T>;
    emit: ((evt: "change", event: Event) => void) & ((evt: "update:modelValue", value: import("../types").GetItemValue<T, VK, undefined, import("../types").NestedItem<T>>) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
