import type { CollapsibleRootProps } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/chat-tool';
import type { IconProps } from '../types';
import type { ChatShimmerProps } from './ChatShimmer.vue';
import type { ComponentConfig } from '../types/tv';
type ChatTool = ComponentConfig<typeof theme, AppConfig, 'chatTool'>;
export interface ChatToolProps extends Pick<CollapsibleRootProps, 'defaultOpen' | 'open' | 'disabled' | 'unmountOnHide'> {
    /**
     * The text content to display.
     */
    text?: string;
    /**
     * The suffix text displayed after the main text.
     */
    suffix?: string;
    /**
     * The icon displayed next to the trigger.
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    /**
     * Whether the tool is in a loading state.
     * @defaultValue false
     */
    loading?: boolean;
    /**
     * The icon displayed when loading.
     * @defaultValue appConfig.ui.icons.loading
     * @IconifyIcon
     */
    loadingIcon?: IconProps['name'];
    /**
     * Whether the tool content is currently streaming.
     * @defaultValue false
     */
    streaming?: boolean;
    /**
     * The visual variant of the tool display.
     * @defaultValue 'inline'
     */
    variant?: ChatTool['variants']['variant'];
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
     * Customize the [`ChatShimmer`](https://ui.nuxt.com/docs/components/chat-shimmer) component when streaming.
     */
    shimmer?: Partial<Omit<ChatShimmerProps, 'text'>>;
    class?: any;
    ui?: ChatTool['slots'];
}
export interface ChatToolEmits {
    'update:open': [value: boolean];
}
export interface ChatToolSlots {
    default?(props: {
        open: boolean;
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ChatToolProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<ChatToolProps> & Readonly<{
    "onUpdate:open"?: ((value: boolean) => any) | undefined;
}>, {
    open: boolean;
    loading: boolean;
    variant: ChatTool["variants"]["variant"];
    streaming: boolean;
    unmountOnHide: boolean;
    chevron: "leading" | "trailing";
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ChatToolSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
