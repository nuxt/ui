import type { SliderRootProps } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/slider';
import type { TooltipProps } from '../types';
import type { ComponentConfig } from '../types/tv';
type Slider = ComponentConfig<typeof theme, AppConfig, 'slider'>;
export interface SliderProps extends Pick<SliderRootProps, 'name' | 'disabled' | 'inverted' | 'min' | 'max' | 'step' | 'minStepsBetweenThumbs'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * @defaultValue 'md'
     */
    size?: Slider['variants']['size'];
    /**
     * @defaultValue 'primary'
     */
    color?: Slider['variants']['color'];
    /**
     * The orientation of the slider.
     * @defaultValue 'horizontal'
     */
    orientation?: Slider['variants']['orientation'];
    /**
     * Display a tooltip around the slider thumbs with the current value.
     * `{ disableClosingTrigger: true }`{lang="ts-type"}
     * @defaultValue false
     */
    tooltip?: boolean | TooltipProps;
    /** The value of the slider when initially rendered. Use when you do not need to control the state of the slider. */
    defaultValue?: number | number[];
    class?: any;
    ui?: Slider['slots'];
}
export interface SliderEmits {
    change: [event: Event];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends number | number[]>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<(SliderProps & {
        modelValue?: T;
    }) & {
        onChange?: ((event: Event) => any) | undefined;
        "onUpdate:modelValue"?: ((value: T | undefined) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: {};
    emit: ((evt: "change", event: Event) => void) & ((event: "update:modelValue", value: T | undefined) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
