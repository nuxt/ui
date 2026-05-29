import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/dashboard-search-button';
import type { ButtonProps, ButtonSlots, IconProps, KbdProps, TooltipProps, LinkPropsKeys } from '../types';
import type { ComponentConfig } from '../types/tv';
type DashboardSearchButton = ComponentConfig<typeof theme, AppConfig, 'dashboardSearchButton'>;
export interface DashboardSearchButtonProps extends Omit<ButtonProps, LinkPropsKeys | 'icon' | 'label' | 'color' | 'variant'> {
    /**
     * The icon displayed in the button.
     * @defaultValue appConfig.ui.icons.search
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    /**
     * The label displayed in the button.
     * @defaultValue t('dashboardSearchButton.label')
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
     * @defaultValue false
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
    ui?: DashboardSearchButton['slots'] & ButtonProps['ui'];
    class?: any;
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<DashboardSearchButtonProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<DashboardSearchButtonProps> & Readonly<{}>, {
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
