import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/color-picker';
import type { ComponentConfig } from '../types/tv';
type ColorPicker = ComponentConfig<typeof theme, AppConfig, 'colorPicker'>;
export type ColorPickerProps = {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * Throttle time in ms for the color picker
     */
    throttle?: number;
    /**
     * Disable the color picker
     */
    disabled?: boolean;
    /**
     * The default value of the color picker
     */
    defaultValue?: string;
    /**
     * Format of the color
     * @defaultValue 'hex'
     */
    format?: 'hex' | 'rgb' | 'hsl' | 'cmyk' | 'lab';
    /**
     * @defaultValue 'md'
     */
    size?: ColorPicker['variants']['size'];
    class?: any;
    ui?: ColorPicker['slots'];
};
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: import("vue").DefineComponent<ColorPickerProps & {
    modelValue?: string;
}, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:modelValue": (value: string | undefined) => any;
}, string, import("vue").PublicProps, Readonly<ColorPickerProps & {
    modelValue?: string;
}> & Readonly<{
    "onUpdate:modelValue"?: ((value: string | undefined) => any) | undefined;
}>, {
    defaultValue: string;
    format: "hex" | "rgb" | "hsl" | "cmyk" | "lab";
    throttle: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
