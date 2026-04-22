import type { ButtonProps, LinkPropsKeys } from '../types';
export interface DashboardSidebarToggleProps extends Omit<ButtonProps, LinkPropsKeys | 'color' | 'variant'> {
    /**
     * @defaultValue 'neutral'
     */
    color?: ButtonProps['color'];
    /**
     * @defaultValue 'ghost'
     */
    variant?: ButtonProps['variant'];
    /**
     * The side of the sidebar to toggle.
     * @defaultValue 'left'
     */
    side?: 'left' | 'right';
    ui?: {
        base?: any;
    };
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: import("vue").DefineComponent<DashboardSidebarToggleProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<DashboardSidebarToggleProps> & Readonly<{}>, {
    color: "error" | "primary" | "secondary" | "success" | "info" | "warning" | "neutral";
    variant: "link" | "solid" | "outline" | "soft" | "subtle" | "ghost";
    side: "left" | "right";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
