import type { ComponentPublicInstance, VNode } from 'vue';
import type { TabsRootProps, TabsRootEmits } from 'reka-ui';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/tabs';
import type { AvatarProps, BadgeProps, IconProps } from '../types';
import type { DynamicSlots, GetItemKeys } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type Tabs = ComponentConfig<typeof theme, AppConfig, 'tabs'>;
export interface TabsItem {
    label?: string;
    /**
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    avatar?: AvatarProps;
    /**
     * Display a badge on the item.
     * `{ size: 'sm', color: 'neutral', variant: 'outline' }`{lang="ts-type"}
     */
    badge?: string | number | BadgeProps;
    slot?: string;
    content?: string;
    /**
     * A unique value for the tab item. Defaults to the index.
     * Also used as the Vue `key` for this item, so providing a stable value prevents tab
     * content (and its local state) from remounting when items are added, removed, or reordered.
     */
    value?: string | number;
    disabled?: boolean;
    class?: any;
    ui?: Pick<Tabs['slots'], 'trigger' | 'leadingIcon' | 'leadingAvatar' | 'leadingAvatarSize' | 'label' | 'trailingBadge' | 'trailingBadgeSize' | 'content'>;
    [key: string]: any;
}
export interface TabsProps<T extends TabsItem = TabsItem> extends Pick<TabsRootProps<string | number>, 'defaultValue' | 'modelValue' | 'activationMode' | 'unmountOnHide'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    items?: T[];
    /**
     * @defaultValue 'primary'
     */
    color?: Tabs['variants']['color'];
    /**
     * @defaultValue 'pill'
     */
    variant?: Tabs['variants']['variant'];
    /**
     * @defaultValue 'md'
     */
    size?: Tabs['variants']['size'];
    /**
     * The orientation of the tabs.
     * @defaultValue 'horizontal'
     */
    orientation?: Tabs['variants']['orientation'];
    /**
     * The content of the tabs, can be disabled to prevent rendering the content.
     * @defaultValue true
     */
    content?: boolean;
    /**
     * The key used to get the value from the item.
     * @defaultValue 'value'
     */
    valueKey?: GetItemKeys<T>;
    /**
     * The key used to get the label from the item.
     * @defaultValue 'label'
     */
    labelKey?: GetItemKeys<T>;
    class?: any;
    ui?: Tabs['slots'];
}
export interface TabsEmits extends TabsRootEmits<string | number> {
}
type SlotProps<T extends TabsItem> = (props: {
    item: T;
    index: number;
    ui: Tabs['ui'];
}) => VNode[];
export type TabsSlots<T extends TabsItem = TabsItem> = {
    'leading'?: SlotProps<T>;
    'default'?(props: {
        item: T;
        index: number;
    }): VNode[];
    'trailing'?: SlotProps<T>;
    'content'?: SlotProps<T>;
    'list-leading'?(props?: {}): VNode[];
    'list-trailing'?(props?: {}): VNode[];
} & DynamicSlots<T, undefined, {
    index: number;
    ui: Tabs['ui'];
}>;
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends TabsItem>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<TabsProps<T> & {
        "onUpdate:modelValue"?: ((payload: string | number) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: import("vue").ShallowUnwrapRef<{
        triggersRef: import("vue").Ref<ComponentPublicInstance[], ComponentPublicInstance[]>;
    }>) => void;
    attrs: any;
    slots: TabsSlots<T>;
    emit: (evt: "update:modelValue", payload: string | number) => void;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
