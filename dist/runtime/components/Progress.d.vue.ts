import type { ProgressRootProps, ProgressRootEmits } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/progress';
import type { ComponentConfig } from '../types/tv';
type Progress = ComponentConfig<typeof theme, AppConfig, 'progress'>;
export interface ProgressProps extends Pick<ProgressRootProps, 'getValueLabel' | 'getValueText' | 'modelValue'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /** The maximum progress value. */
    max?: number | Array<any>;
    /** Display the current progress value. */
    status?: boolean;
    /** Whether the progress is visually inverted. */
    inverted?: boolean;
    /**
     * @defaultValue 'md'
     */
    size?: Progress['variants']['size'];
    /**
     * @defaultValue 'primary'
     */
    color?: Progress['variants']['color'];
    /**
     * The orientation of the progress bar.
     * @defaultValue 'horizontal'
     */
    orientation?: Progress['variants']['orientation'];
    /**
     * The animation of the progress bar.
     * @defaultValue 'carousel'
     */
    animation?: Progress['variants']['animation'];
    class?: any;
    ui?: Progress['slots'];
}
export interface ProgressEmits extends ProgressRootEmits {
}
export type ProgressSlots = {
    status?(props: {
        percent?: number;
    }): VNode[];
} & {
    [key: string]: (props: {
        step: number;
    }) => VNode[];
};
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProgressProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: string[] | undefined) => any;
    "update:max": (value: number) => any;
}, string, import("vue").PublicProps, Readonly<ProgressProps> & Readonly<{
    "onUpdate:modelValue"?: ((value: string[] | undefined) => any) | undefined;
    "onUpdate:max"?: ((value: number) => any) | undefined;
}>, {
    modelValue: number | null;
    orientation: Progress["variants"]["orientation"];
    inverted: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProgressSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
