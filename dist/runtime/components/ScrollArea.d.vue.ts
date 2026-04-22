import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import type { VirtualItem, VirtualizerOptions } from '@tanstack/vue-virtual';
import theme from '#build/ui/scroll-area';
import type { ComponentConfig } from '../types/tv';
type ScrollArea = ComponentConfig<typeof theme, AppConfig, 'scrollArea'>;
export interface ScrollAreaVirtualizeOptions extends Partial<Omit<VirtualizerOptions<Element, Element>, 'count' | 'getScrollElement' | 'horizontal' | 'isRtl' | 'estimateSize' | 'lanes' | 'enabled'>> {
    /**
     * Estimated size (in px) of each item along the scroll axis. Can be a number or a function.
     * @defaultValue 100
     */
    estimateSize?: number | ((index: number) => number);
    /**
     * Number of lanes for multi-column/row layouts.
     * For responsive lane counts, use a computed property with viewport/container size:
     * @example
     * ```ts
     * const { width } = useWindowSize()
     * const lanes = computed(() => Math.floor(width.value / 300))
     * ```
     * @defaultValue undefined
     */
    lanes?: number;
    /**
     * Skip per-item DOM measurement for uniform-height items.
     * When `true`, uses `estimateSize` only — significantly improving performance for uniform items.
     * When `false` (default), measures each item for variable-height layouts (e.g., masonry).
     * @defaultValue false
     */
    skipMeasurement?: boolean;
}
export type ScrollAreaItem = any;
export interface ScrollAreaProps<T extends ScrollAreaItem = ScrollAreaItem> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * The scroll direction.
     * @defaultValue 'vertical'
     */
    orientation?: ScrollArea['variants']['orientation'];
    /**
     * Array of items to render.
     */
    items?: T[];
    /**
     * Enable virtualization for large lists.
     * @see https://tanstack.com/virtual/latest/docs/api/virtualizer#options
     * @defaultValue false
     */
    virtualize?: boolean | ScrollAreaVirtualizeOptions;
    class?: any;
    ui?: ScrollArea['slots'];
}
export interface ScrollAreaSlots<T extends ScrollAreaItem = ScrollAreaItem> {
    default?(props: {
        item: T;
        index: number;
        virtualItem?: VirtualItem;
    } | {
        item: T;
        index: 0;
    }): VNode[];
}
export interface ScrollAreaEmits {
    /**
     * Emitted when scroll state changes
     * @param isScrolling - Whether the list is currently being scrolled
     */
    scroll: [isScrolling: boolean];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends ScrollAreaItem>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<ScrollAreaProps<T> & {
        onScroll?: ((isScrolling: boolean) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import("vue").ShallowUnwrapRef<{
        readonly $el: HTMLElement;
        virtualizer: import("vue").Ref<import("@tanstack/vue-virtual").Virtualizer<Element, Element>, import("@tanstack/vue-virtual").Virtualizer<Element, Element>> | undefined;
    }>) => void;
    attrs: any;
    slots: ScrollAreaSlots<T>;
    emit: (evt: "scroll", isScrolling: boolean) => void;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
