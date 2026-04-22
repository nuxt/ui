import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/timeline';
import type { AvatarProps, IconProps } from '../types';
import type { DynamicSlots, GetItemKeys } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type Timeline = ComponentConfig<typeof theme, AppConfig, 'timeline'>;
export interface TimelineItem {
    date?: string;
    title?: string;
    description?: string;
    icon?: IconProps['name'];
    avatar?: AvatarProps;
    value?: string | number;
    slot?: string;
    class?: any;
    ui?: Pick<Timeline['slots'], 'item' | 'container' | 'indicator' | 'separator' | 'wrapper' | 'date' | 'title' | 'description'>;
    [key: string]: any;
}
export interface TimelineProps<T extends TimelineItem = TimelineItem> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    items: T[];
    /**
     * @defaultValue 'md'
     */
    size?: Timeline['variants']['size'];
    /**
     * @defaultValue 'primary'
     */
    color?: Timeline['variants']['color'];
    /**
     * The orientation of the Timeline.
     * @defaultValue 'vertical'
     */
    orientation?: Timeline['variants']['orientation'];
    /**
     * The key used to get the value from the item.
     * @defaultValue 'value'
     */
    valueKey?: GetItemKeys<T>;
    defaultValue?: string | number;
    reverse?: boolean;
    class?: any;
    ui?: Timeline['slots'];
}
type SlotProps<T extends TimelineItem> = (props: {
    item: T;
}) => VNode[];
export interface TimelineEmits<T extends TimelineItem = TimelineItem> {
    select: [event: Event, item: T];
}
export type TimelineSlots<T extends TimelineItem = TimelineItem> = {
    indicator?: SlotProps<T>;
    wrapper?: SlotProps<T>;
    date?: SlotProps<T>;
    title?: SlotProps<T>;
    description?: SlotProps<T>;
} & DynamicSlots<T, 'indicator' | 'wrapper' | 'date' | 'title' | 'description', {
    item: T;
}>;
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends TimelineItem>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<(TimelineProps<T> & {
        modelValue?: string | number;
    }) & {
        onSelect?: ((event: Event, item: T) => any) | undefined;
        "onUpdate:modelValue"?: ((value: string | number | undefined) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: TimelineSlots<T>;
    emit: ((evt: "select", event: Event, item: T) => void) & ((event: "update:modelValue", value: string | number | undefined) => void);
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
