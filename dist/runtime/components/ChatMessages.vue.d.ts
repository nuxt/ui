import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { UIMessage, ChatStatus } from 'ai';
import theme from '#build/ui/chat-messages';
import type { ButtonProps, ChatMessageProps, ChatMessageSlots, IconProps, LinkPropsKeys } from '../types';
import type { ComponentConfig } from '../types/tv';
type ChatMessages = ComponentConfig<typeof theme, AppConfig, 'chatMessages'>;
export interface ChatMessagesProps {
    messages?: UIMessage[];
    status?: ChatStatus;
    /**
     * Whether to automatically scroll to the bottom when a message is streaming.
     * @defaultValue false
     */
    shouldAutoScroll?: boolean;
    /**
     * Whether to scroll to the bottom on mounted.
     * @defaultValue true
     */
    shouldScrollToBottom?: boolean;
    /**
     * Display an auto scroll button.
     * `{ size: 'md', color: 'neutral', variant: 'outline' }`{lang="ts-type"}
     * @defaultValue true
     */
    autoScroll?: boolean | Omit<ButtonProps, LinkPropsKeys>;
    /**
     * The icon displayed in the auto scroll button.
     * @defaultValue appConfig.ui.icons.arrowDown
     * @IconifyIcon
     */
    autoScrollIcon?: IconProps['name'];
    /**
     * The `user` messages props.
     * `{ side: 'right', variant: 'soft' }`{lang="ts-type"}
     */
    user?: Pick<ChatMessageProps, 'icon' | 'avatar' | 'variant' | 'side' | 'actions' | 'ui'>;
    /**
     * The `assistant` messages props.
     * `{ side: 'left', variant: 'naked' }`{lang="ts-type"}
     */
    assistant?: Pick<ChatMessageProps, 'icon' | 'avatar' | 'variant' | 'side' | 'actions' | 'ui'>;
    /**
     * Render the messages in a compact style.
     * This is done automatically when used inside a `UChatPalette`{lang="ts-type"}.
     * @defaultValue false
     */
    compact?: boolean;
    /**
     * The spacing offset for the last message in px. Can be useful when the prompt is sticky for example.
     * @defaultValue 0
     */
    spacingOffset?: number;
    class?: any;
    ui?: ChatMessages['slots'];
}
type ExtendSlotWithVersion<K extends keyof ChatMessageSlots> = Required<ChatMessageSlots>[K] extends (props: infer P) => VNode[] ? (props: P & {
    message: UIMessage;
}) => VNode[] : Required<ChatMessageSlots>[K];
export type ChatMessagesSlots = {
    [K in keyof ChatMessageSlots]?: ExtendSlotWithVersion<K>;
} & {
    default?(props?: {}): VNode[];
    indicator?(props: {
        ui: ChatMessages['ui'];
    }): VNode[];
    viewport?(props: {
        ui: ChatMessages['ui'];
        onClick: () => void;
    }): VNode[];
};
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ChatMessagesProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ChatMessagesProps> & Readonly<{}>, {
    autoScroll: boolean | Omit<ButtonProps, LinkPropsKeys>;
    shouldAutoScroll: boolean;
    shouldScrollToBottom: boolean;
    spacingOffset: number;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ChatMessagesSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
