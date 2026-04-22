import { ContextMenu } from 'reka-ui/namespaced';
import type { ContextMenuContentProps as RekaContextMenuContentProps } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import type theme from '#build/ui/context-menu';
import type { ContextMenuItem, ContextMenuSlots, IconProps } from '../types';
import type { ArrayOrNested, GetItemKeys } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type ContextMenu = ComponentConfig<typeof theme, AppConfig, 'contextMenu'>;
interface ContextMenuContentProps<T extends ArrayOrNested<ContextMenuItem>> extends Omit<RekaContextMenuContentProps, 'as' | 'asChild' | 'forceMount'> {
    items?: T;
    portal?: boolean | string | HTMLElement;
    sub?: boolean;
    labelKey: GetItemKeys<T>;
    descriptionKey: GetItemKeys<T>;
    /**
     * @IconifyIcon
     */
    checkedIcon?: IconProps['name'];
    /**
     * @IconifyIcon
     */
    loadingIcon?: IconProps['name'];
    /**
     * @IconifyIcon
     */
    externalIcon?: boolean | IconProps['name'];
    class?: any;
    ui: ContextMenu['ui'];
    uiOverride?: ContextMenu['slots'];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends ArrayOrNested<ContextMenuItem>>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<ContextMenuContentProps<T> & {
        onEscapeKeyDown?: ((event: KeyboardEvent) => any) | undefined;
        onPointerDownOutside?: ((event: import("reka-ui").PointerDownOutsideEvent) => any) | undefined;
        onFocusOutside?: ((event: import("reka-ui").FocusOutsideEvent) => any) | undefined;
        onInteractOutside?: ((event: import("reka-ui").PointerDownOutsideEvent | import("reka-ui").FocusOutsideEvent) => any) | undefined;
        onCloseAutoFocus?: ((event: Event) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: ContextMenuSlots<T>;
    emit: ((evt: "escapeKeyDown", event: KeyboardEvent) => void) & ((evt: "pointerDownOutside", event: import("reka-ui").PointerDownOutsideEvent) => void) & ((evt: "focusOutside", event: import("reka-ui").FocusOutsideEvent) => void) & ((evt: "interactOutside", event: import("reka-ui").PointerDownOutsideEvent | import("reka-ui").FocusOutsideEvent) => void) & ((evt: "closeAutoFocus", event: Event) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
