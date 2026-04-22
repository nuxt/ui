import { Popover } from 'reka-ui/namespaced';
import type { PopoverRootProps, HoverCardRootProps, PopoverRootEmits, PopoverContentProps, PopoverContentEmits, PopoverArrowProps, HoverCardTriggerProps } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/popover';
import type { EmitsToProps } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type Popover = ComponentConfig<typeof theme, AppConfig, 'popover'>;
type PopoverMode = 'click' | 'hover';
export interface PopoverProps<M extends PopoverMode = PopoverMode> extends PopoverRootProps, Pick<HoverCardRootProps, 'openDelay' | 'closeDelay'> {
    /**
     * The display mode of the popover.
     * @defaultValue 'click'
     */
    mode?: M;
    /**
     * The content of the popover.
     * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8 }
     */
    content?: Omit<PopoverContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<PopoverContentEmits>>;
    /**
     * Display an arrow alongside the popover.
     * `{ rounded: true }`{lang="ts-type"}
     * @defaultValue false
     */
    arrow?: boolean | Omit<PopoverArrowProps, 'as' | 'asChild'>;
    /**
     * Render the popover in a portal.
     * @defaultValue true
     */
    portal?: boolean | string | HTMLElement;
    /**
     * The reference (or anchor) element that is being referred to for positioning.
     *
     * If not provided will use the current component as anchor.
     */
    reference?: HoverCardTriggerProps['reference'];
    /**
     * When `false`, the popover will not close when clicking outside or pressing escape.
     * @defaultValue true
     */
    dismissible?: boolean;
    class?: any;
    ui?: Popover['slots'];
}
export interface PopoverEmits extends PopoverRootEmits {
    'close:prevent': [];
}
type SlotProps<M extends PopoverMode = PopoverMode> = [M] extends ['hover'] ? {
    close: undefined;
} : {
    close: () => void;
};
export interface PopoverSlots<M extends PopoverMode = PopoverMode> {
    default?(props: {
        open: boolean;
    }): VNode[];
    content?(props: SlotProps<M>): VNode[];
    anchor?(props: SlotProps<M>): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <M extends PopoverMode>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<PopoverProps<M> & {
        "onUpdate:open"?: ((value: boolean) => any) | undefined;
        "onClose:prevent"?: (() => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: PopoverSlots<M>;
    emit: ((evt: "update:open", value: boolean) => void) & ((evt: "close:prevent") => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
