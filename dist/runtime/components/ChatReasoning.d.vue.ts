import type { CollapsibleRootProps } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/chat-reasoning';
import type { IconProps } from '../types';
import type { ChatShimmerProps } from './ChatShimmer.vue';
import type { ComponentConfig } from '../types/tv';
type ChatReasoning = ComponentConfig<typeof theme, AppConfig, 'chatReasoning'>;
export interface ChatReasoningProps extends Pick<CollapsibleRootProps, 'defaultOpen' | 'open' | 'disabled' | 'unmountOnHide'> {
    /**
     * The reasoning text content to display.
     */
    text?: string;
    /**
     * Whether the reasoning content is currently streaming.
     * @defaultValue false
     */
    streaming?: boolean;
    /**
     * The duration in seconds that the AI spent reasoning.
     * If not provided, it will be calculated automatically based on streaming time.
     */
    duration?: number;
    /**
     * The icon displayed next to the trigger.
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    /**
     * The position of the chevron icon.
     * @defaultValue 'trailing'
     */
    chevron?: 'leading' | 'trailing';
    /**
     * The icon displayed as the chevron.
     * @defaultValue appConfig.ui.icons.chevronDown
     * @IconifyIcon
     */
    chevronIcon?: IconProps['name'];
    /**
     * The delay in milliseconds before auto-closing when streaming ends.
     * Set to `0` to disable auto-close.
     * @defaultValue 500
     */
    autoCloseDelay?: number;
    /**
     * Customize the [`ChatShimmer`](https://ui.nuxt.com/docs/components/chat-shimmer) component when streaming.
     */
    shimmer?: Partial<Omit<ChatShimmerProps, 'text'>>;
    class?: any;
    ui?: ChatReasoning['slots'];
}
export interface ChatReasoningEmits {
    'update:open': [value: boolean];
}
export interface ChatReasoningSlots {
    default?(props: {
        open: boolean;
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ChatReasoningProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<ChatReasoningProps> & Readonly<{
    "onUpdate:open"?: ((value: boolean) => any) | undefined;
}>, {
    open: boolean;
    streaming: boolean;
    unmountOnHide: boolean;
    chevron: "leading" | "trailing";
    autoCloseDelay: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ChatReasoningSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
