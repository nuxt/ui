import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { UIDataTypes, UIMessage, UITools, FileUIPart } from 'ai';
import theme from '#build/ui/chat-message';
import type { AvatarProps, ButtonProps, IconProps } from '../types';
import type { ComponentConfig } from '../types/tv';
type ChatMessage = ComponentConfig<typeof theme, AppConfig, 'chatMessage'>;
export interface ChatMessageProps<TMetadata = unknown, TDataParts extends UIDataTypes = UIDataTypes, TTools extends UITools = UITools> extends UIMessage<TMetadata, TDataParts, TTools> {
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
     * @defaultValue 'neutral'
     */
    color?: ChatMessage['variants']['color'];
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
        onClick?: (e: MouseEvent, message: UIMessage<TMetadata, TDataParts, TTools>) => void;
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
export interface ChatMessageSlots<TMetadata = unknown, TDataParts extends UIDataTypes = UIDataTypes, TTools extends UITools = UITools> {
    header?(props: UIMessage<TMetadata, TDataParts, TTools>): VNode[];
    leading?(props: UIMessage<TMetadata, TDataParts, TTools> & {
        avatar: ChatMessageProps<TMetadata, TDataParts, TTools>['avatar'];
        ui: ChatMessage['ui'];
    }): VNode[];
    files?(props: Omit<UIMessage<TMetadata, TDataParts, TTools>, 'parts'> & {
        parts: FileUIPart[];
    }): VNode[];
    body?(props: UIMessage<TMetadata, TDataParts, TTools>): VNode[];
    content?(props: UIMessage<TMetadata, TDataParts, TTools> & {
        content?: string;
    }): VNode[];
    actions?(props: UIMessage<TMetadata, TDataParts, TTools> & {
        actions: ChatMessageProps<TMetadata, TDataParts, TTools>['actions'];
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <TMetadata, TDataParts extends UIDataTypes, TTools extends UITools>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<ChatMessageProps<TMetadata, TDataParts, TTools>> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: ChatMessageSlots<TMetadata, TDataParts, TTools>;
    emit: {};
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
