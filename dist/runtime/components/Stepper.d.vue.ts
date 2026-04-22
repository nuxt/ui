import type { StepperRootProps, StepperRootEmits } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/stepper';
import type { IconProps } from '../types';
import type { DynamicSlots, GetItemKeys } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type Stepper = ComponentConfig<typeof theme, AppConfig, 'stepper'>;
export interface StepperItem {
    slot?: string;
    value?: string | number;
    title?: string;
    description?: string;
    /**
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    content?: string;
    disabled?: boolean;
    class?: any;
    ui?: Pick<Stepper['slots'], 'item' | 'container' | 'trigger' | 'indicator' | 'icon' | 'separator' | 'wrapper' | 'title' | 'description'>;
    [key: string]: any;
}
export interface StepperProps<T extends StepperItem = StepperItem> extends Pick<StepperRootProps, 'linear'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    items: T[];
    /**
     * @defaultValue 'md'
     */
    size?: Stepper['variants']['size'];
    /**
     * @defaultValue 'primary'
     */
    color?: Stepper['variants']['color'];
    /**
     * The orientation of the stepper.
     * @defaultValue 'horizontal'
     */
    orientation?: Stepper['variants']['orientation'];
    /**
     * The key used to get the value from the item.
     * @defaultValue 'value'
     */
    valueKey?: GetItemKeys<T>;
    /**
     * The value of the step that should be active when initially rendered. Use when you do not need to control the state of the steps.
     */
    defaultValue?: string | number;
    disabled?: boolean;
    class?: any;
    ui?: Stepper['slots'];
}
export type StepperEmits<T extends StepperItem = StepperItem> = Omit<StepperRootEmits, 'update:modelValue'> & {
    next: [value: T];
    prev: [value: T];
};
type SlotProps<T extends StepperItem> = (props: {
    item: T;
}) => VNode[];
export type StepperSlots<T extends StepperItem = StepperItem> = {
    indicator?(props: {
        item: T;
        ui: Stepper['ui'];
    }): VNode[];
    wrapper?: SlotProps<T>;
    title?: SlotProps<T>;
    description?: SlotProps<T>;
    content?: SlotProps<T>;
} & DynamicSlots<T, 'wrapper' | 'title' | 'description', {
    item: T;
}>;
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends StepperItem>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<(StepperProps<T> & {
        modelValue?: string | number;
    }) & {
        onNext?: ((value: T) => any) | undefined;
        onPrev?: ((value: T) => any) | undefined;
        "onUpdate:modelValue"?: ((value: string | number | undefined) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import("vue").ShallowUnwrapRef<{
        next(): void;
        prev(): void;
        hasNext: import("vue").ComputedRef<boolean>;
        hasPrev: import("vue").ComputedRef<boolean>;
    }>) => void;
    attrs: any;
    slots: StepperSlots<T>;
    emit: (((evt: "next", value: T) => void) & ((evt: "prev", value: T) => void)) & ((event: "update:modelValue", value: string | number | undefined) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
