import type { ChatStatus } from 'ai';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/chat-prompt-submit';
import type { ButtonProps, ButtonSlots, IconProps, LinkPropsKeys } from '../types';
import type { ComponentConfig } from '../types/tv';
type ChatPromptSubmit = ComponentConfig<typeof theme, AppConfig, 'chatPromptSubmit'>;
export interface ChatPromptSubmitProps extends Omit<ButtonProps, LinkPropsKeys | 'icon' | 'color' | 'variant'> {
    status?: ChatStatus;
    /**
     * The icon displayed in the button when the status is `ready`.
     * @defaultValue appConfig.ui.icons.arrowUp
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    /**
     * The color of the button when the status is `ready`.
     * @defaultValue 'primary'
     */
    color?: ButtonProps['color'];
    /**
     * The variant of the button when the status is `ready`.
     * @defaultValue 'solid'
     */
    variant?: ButtonProps['variant'];
    /**
     * The icon displayed in the button when the status is `streaming`.
     * @defaultValue appConfig.ui.icons.stop
     * @IconifyIcon
     */
    streamingIcon?: IconProps['name'];
    /**
     * The color of the button when the status is `streaming`.
     * @defaultValue 'neutral'
     */
    streamingColor?: ButtonProps['color'];
    /**
     * The variant of the button when the status is `streaming`.
     * @defaultValue 'subtle'
     */
    streamingVariant?: ButtonProps['variant'];
    /**
     * The icon displayed in the button when the status is `submitted`.
     * @defaultValue appConfig.ui.icons.stop
     * @IconifyIcon
     */
    submittedIcon?: IconProps['name'];
    /**
     * The color of the button when the status is `submitted`.
     * @defaultValue 'neutral'
     */
    submittedColor?: ButtonProps['color'];
    /**
     * The variant of the button when the status is `submitted`.
     * @defaultValue 'subtle'
     */
    submittedVariant?: ButtonProps['variant'];
    /**
     * The icon displayed in the button when the status is `error`.
     * @defaultValue appConfig.ui.icons.reload
     * @IconifyIcon
     */
    errorIcon?: IconProps['name'];
    /**
     * The color of the button when the status is `error`.
     * @defaultValue 'error'
     */
    errorColor?: ButtonProps['color'];
    /**
     * The variant of the button when the status is `error`.
     * @defaultValue 'soft'
     */
    errorVariant?: ButtonProps['variant'];
    ui?: ChatPromptSubmit['slots'] & ButtonProps['ui'];
    class?: any;
}
export interface ChatPromptSubmitEmits {
    stop: [event: MouseEvent];
    reload: [event: MouseEvent];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ChatPromptSubmitProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    stop: (event: MouseEvent) => any;
    reload: (event: MouseEvent) => any;
}, string, import("vue").PublicProps, Readonly<ChatPromptSubmitProps> & Readonly<{
    onStop?: ((event: MouseEvent) => any) | undefined;
    onReload?: ((event: MouseEvent) => any) | undefined;
}>, {
    status: ChatStatus;
    streamingColor: "error" | "primary" | "secondary" | "success" | "info" | "warning" | "neutral";
    streamingVariant: "link" | "solid" | "outline" | "soft" | "subtle" | "ghost";
    submittedColor: "error" | "primary" | "secondary" | "success" | "info" | "warning" | "neutral";
    submittedVariant: "link" | "solid" | "outline" | "soft" | "subtle" | "ghost";
    errorColor: "error" | "primary" | "secondary" | "success" | "info" | "warning" | "neutral";
    errorVariant: "link" | "solid" | "outline" | "soft" | "subtle" | "ghost";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ButtonSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
