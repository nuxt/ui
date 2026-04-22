import type { ButtonProps, LinkPropsKeys } from '../../types';
export interface ColorModeButtonProps extends Omit<ButtonProps, LinkPropsKeys | 'color' | 'variant'> {
    /**
     * @defaultValue 'neutral'
     */
    color?: ButtonProps['color'];
    /**
     * @defaultValue 'ghost'
     */
    variant?: ButtonProps['variant'];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: import("vue").DefineComponent<ColorModeButtonProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ColorModeButtonProps> & Readonly<{}>, {
    color: "error" | "primary" | "secondary" | "success" | "info" | "warning" | "neutral";
    variant: "link" | "solid" | "outline" | "soft" | "subtle" | "ghost";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
