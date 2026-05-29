import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { UIDataTypes, UIMessage, UITools, ChatStatus } from 'ai';
import theme from '#build/ui/chat-messages';
import type { ButtonProps, ChatMessageProps, ChatMessageSlots, IconProps, LinkPropsKeys } from '../types';
import type { ComponentConfig } from '../types/tv';
type ChatMessages = ComponentConfig<typeof theme, AppConfig, 'chatMessages'>;
type MessageBase<T extends UIMessage[]> = T[number] extends UIMessage<infer M, infer D, infer U> ? UIMessage<M, D, U> : UIMessage<unknown, UIDataTypes, UITools>;
type PropsBase<T extends UIMessage[]> = MessageBase<T> extends UIMessage<infer M, infer D, infer U> ? ChatMessageProps<M, D, U> : never;
export interface ChatMessagesProps<T extends UIMessage[] = UIMessage[]> {
    messages?: T;
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
    user?: Pick<PropsBase<T>, 'icon' | 'avatar' | 'variant' | 'side' | 'actions' | 'ui'>;
    /**
     * The `assistant` messages props.
     * `{ side: 'left', variant: 'naked' }`{lang="ts-type"}
     */
    assistant?: Pick<PropsBase<T>, 'icon' | 'avatar' | 'variant' | 'side' | 'actions' | 'ui'>;
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
export type ChatMessagesSlots<T extends UIMessage[] = UIMessage[]> = {
    default?(props?: {}): VNode[];
    indicator?(props: {
        ui: ChatMessages['ui'];
    }): VNode[];
    viewport?(props: {
        ui: ChatMessages['ui'];
        onClick: () => void;
    }): VNode[];
} & {
    [K in keyof ChatMessageSlots]?: NonNullable<ChatMessageSlots[K]> extends (props: infer P) => VNode[] ? (props: P & {
        message: MessageBase<T>;
    }) => VNode[] : never;
};
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends UIMessage[] = UIMessage[]>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<ChatMessagesProps<T>> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: ChatMessagesSlots<T>;
    emit: {};
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
