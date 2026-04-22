import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { UIMessage, FileUIPart } from 'ai';
import theme from '#build/ui/chat-message';
import type { AvatarProps, ButtonProps, IconProps } from '../types';
import type { ComponentConfig } from '../types/tv';
type ChatMessage = ComponentConfig<typeof theme, AppConfig, 'chatMessage'>;
export interface ChatMessageProps extends UIMessage {
    /**
     * The element or component this component should render as.
     * @defaultValue 'article'
     */
    as?: any;
    /**
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    avatar?: AvatarProps & {
        [key: string]: any;
    };
    /**
     * @defaultValue 'naked'
     */
    variant?: ChatMessage['variants']['variant'];
    /**
     * @defaultValue 'left'
     */
    side?: ChatMessage['variants']['side'];
    /**
     * Display a list of actions under the message.
     * The `label` will be used in a tooltip.
     * `{ size: 'xs', color: 'neutral', variant: 'ghost' }`{lang="ts-type"}
     */
    actions?: (Omit<ButtonProps, 'onClick'> & {
        onClick?: (e: MouseEvent, message: UIMessage) => void;
    })[];
    /**
     * Render the message in a compact style.
     * This is done automatically when used inside a `UChatPalette`{lang="ts-type"}.
     * @defaultValue false
     */
    compact?: boolean;
    /**
     * @deprecated Use `parts` instead. (https://ai-sdk.dev/docs/migration-guides/migration-guide-5-0#content--parts-array)
     * Use to display the content of the message.
     */
    content?: string;
    class?: any;
    ui?: ChatMessage['slots'];
}
export interface ChatMessageSlots {
    leading?(props: {
        avatar: ChatMessageProps['avatar'];
        ui: ChatMessage['ui'];
    }): VNode[];
    files?(props: {
        parts: FileUIPart[];
    }): VNode[];
    content?(props: ChatMessageProps): VNode[];
    actions?(props: {
        actions: ChatMessageProps['actions'];
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ChatMessageProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ChatMessageProps> & Readonly<{}>, {
    as: any;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ChatMessageSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
