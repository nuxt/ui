import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/content/content-search-button';
import type { ButtonProps, ButtonSlots, IconProps, KbdProps, TooltipProps, LinkPropsKeys } from '../../types';
import type { ComponentConfig } from '../../types/tv';
type ContentSearchButton = ComponentConfig<typeof theme, AppConfig, 'contentSearchButton'>;
export interface ContentSearchButtonProps extends Omit<ButtonProps, LinkPropsKeys | 'icon' | 'label' | 'color' | 'variant'> {
    /**
     * The icon displayed in the button.
     * @defaultValue appConfig.ui.icons.search
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    /**
     * The label displayed in the button.
     * @defaultValue t('contentSearchButton.label')
     */
    label?: string;
    /**
     * The color of the button.
     * @defaultValue 'neutral'
     */
    color?: ButtonProps['color'];
    /**
     * The variant of the button.
     * Defaults to 'outline' when not collapsed, 'ghost' when collapsed.
     */
    variant?: ButtonProps['variant'];
    /**
     * Whether the button is collapsed.
     * @defaultValue true
     */
    collapsed?: boolean;
    /**
     * Display a tooltip on the button when is collapsed with the button label.
     * This has priority over the global `tooltip` prop.
     */
    tooltip?: boolean | TooltipProps;
    /**
     * The keyboard keys to display in the button.
     * `{ variant: 'subtle' }`{lang="ts-type"}
     * @defaultValue ['meta', 'k']
     */
    kbds?: KbdProps['value'][] | KbdProps[];
    ui?: ContentSearchButton['slots'] & ButtonProps['ui'];
    class?: any;
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ContentSearchButtonProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ContentSearchButtonProps> & Readonly<{}>, {
    color: "error" | "primary" | "secondary" | "success" | "info" | "warning" | "neutral";
    tooltip: boolean | TooltipProps;
    kbds: KbdProps["value"][] | KbdProps[];
    collapsed: boolean;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ButtonSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
