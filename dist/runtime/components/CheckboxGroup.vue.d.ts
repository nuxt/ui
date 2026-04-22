import type { CheckboxGroupRootProps, CheckboxGroupRootEmits } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/checkbox-group';
import type { CheckboxProps } from '../types';
import type { AcceptableValue, GetItemKeys, GetModelValue, GetModelValueEmits } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type CheckboxGroup = ComponentConfig<typeof theme, AppConfig, 'checkboxGroup'>;
export type CheckboxGroupValue = AcceptableValue;
export type CheckboxGroupItem = CheckboxGroupValue | {
    label?: string;
    description?: string;
    disabled?: boolean;
    value?: string;
    class?: any;
    ui?: Pick<CheckboxGroup['slots'], 'item'> & Omit<Required<CheckboxProps>['ui'], 'root'>;
    [key: string]: any;
};
export interface CheckboxGroupProps<T extends CheckboxGroupItem[] = CheckboxGroupItem[], VK extends GetItemKeys<T> = 'value'> extends Pick<CheckboxGroupRootProps, 'disabled' | 'loop' | 'name' | 'required'>, Pick<CheckboxProps, 'color' | 'indicator' | 'icon'> {
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
    /** The controlled value of the CheckboxGroup. Can be bind as `v-model`. */
    modelValue?: GetModelValue<T, VK, true>;
    /** The value of the CheckboxGroup when initially rendered. Use when you do not need to control the state of the CheckboxGroup. */
    defaultValue?: GetModelValue<T, VK, true>;
    /**
     * @defaultValue 'md'
     */
    size?: CheckboxGroup['variants']['size'];
    /**
     * @defaultValue 'list'
     */
    variant?: CheckboxGroup['variants']['variant'];
    /**
     * The orientation the checkbox buttons are laid out.
     * @defaultValue 'vertical'
     */
    orientation?: CheckboxGroup['variants']['orientation'];
    class?: any;
    ui?: CheckboxGroup['slots'] & CheckboxProps['ui'];
}
export type CheckboxGroupEmits<T extends CheckboxGroupItem[] = CheckboxGroupItem[], VK extends GetItemKeys<T> = 'value'> = Omit<CheckboxGroupRootEmits, 'update:modelValue'> & {
    change: [event: Event];
} & GetModelValueEmits<T, VK, true>;
type SlotProps<T extends CheckboxGroupItem> = (props: {
    item: T & {
        id: string;
    };
}) => VNode[];
export interface CheckboxGroupSlots<T extends CheckboxGroupItem[] = CheckboxGroupItem[]> {
    legend?(props?: {}): VNode[];
    label?: SlotProps<T[number]>;
    description?: SlotProps<T[number]>;
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends CheckboxGroupItem[], VK extends GetItemKeys<T> = "value">(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<CheckboxGroupProps<T, VK> & {
        onChange?: ((event: Event) => any) | undefined;
        "onUpdate:modelValue"?: ((value: import("../types").GetItemValue<T, VK, undefined, import("../types").NestedItem<T>>[]) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: CheckboxGroupSlots<T>;
    emit: ((evt: "change", event: Event) => void) & ((evt: "update:modelValue", value: import("../types").GetItemValue<T, VK, undefined, import("../types").NestedItem<T>>[]) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
