import type { NavigationMenuRootProps, NavigationMenuContentProps, NavigationMenuContentEmits, AccordionRootProps } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/navigation-menu';
import type { AvatarProps, BadgeProps, ChipProps, IconProps, LinkProps, PopoverProps, TooltipProps } from '../types';
import type { ArrayOrNested, DynamicSlots, GetItemKeys, MergeTypes, NestedItem, EmitsToProps } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type NavigationMenu = ComponentConfig<typeof theme, AppConfig, 'navigationMenu'>;
export interface NavigationMenuChildItem extends Omit<NavigationMenuItem, 'type' | 'ui'> {
    /** Description is only used when `orientation` is `horizontal`. */
    description?: string;
    [key: string]: any;
}
export interface NavigationMenuItem extends Omit<LinkProps, 'type' | 'raw' | 'custom'> {
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
    /**
     * Display a chip around the icon of the item.
     * `{ inset: true }`{lang="ts-type"}
     */
    chip?: boolean | ChipProps;
    /**
     * Display a tooltip on the item with the label of the item.
     * In `vertical` orientation, only works when the menu is `collapsed`.
     * In `horizontal` orientation, works on any item.
     */
    tooltip?: boolean | TooltipProps;
    /**
     * Display a popover on the item when the menu is collapsed with the children list.
     * This has priority over the global `popover` prop.
     */
    popover?: boolean | PopoverProps;
    /**
     * @IconifyIcon
     */
    trailingIcon?: IconProps['name'];
    /**
     * The type of the item.
     * The `label` type is only displayed in `vertical` orientation.
     * The `trigger` type is used to force the item to be collapsible when its a link in `vertical` orientation.
     * @defaultValue 'link'
     */
    type?: 'label' | 'trigger' | 'link';
    slot?: string;
    /**
     * The value of the item. Avoid using `index` as the value to prevent conflicts in horizontal orientation with Reka UI.
     * @defaultValue `item-${index}`, `item-${level}-${index}` for nested children, or `group-${listIndex}-item-${index}` when using grouped items
     */
    value?: string;
    children?: NavigationMenuChildItem[];
    defaultOpen?: boolean;
    open?: boolean;
    onSelect?: (e: Event) => void;
    class?: any;
    ui?: Pick<NavigationMenu['slots'], 'item' | 'linkLeadingAvatarSize' | 'linkLeadingAvatar' | 'linkLeadingIcon' | 'linkLeadingChipSize' | 'linkLabel' | 'linkLabelExternalIcon' | 'linkTrailing' | 'linkTrailingBadgeSize' | 'linkTrailingBadge' | 'linkTrailingIcon' | 'label' | 'link' | 'content' | 'childList' | 'childLabel' | 'childItem' | 'childLink' | 'childLinkIcon' | 'childLinkWrapper' | 'childLinkLabel' | 'childLinkLabelExternalIcon' | 'childLinkDescription'>;
    [key: string]: any;
}
type SingleOrMultipleType = 'single' | 'multiple';
type Orientation = NavigationMenu['variants']['orientation'];
type NavigationMenuModelValue<K extends SingleOrMultipleType = SingleOrMultipleType, O extends Orientation = Orientation> = O extends 'horizontal' ? string : K extends 'single' ? string : K extends 'multiple' ? string[] : string | string[];
export interface NavigationMenuProps<T extends ArrayOrNested<NavigationMenuItem> = ArrayOrNested<NavigationMenuItem>, K extends SingleOrMultipleType = SingleOrMultipleType, O extends Orientation = Orientation> extends Pick<NavigationMenuRootProps, 'delayDuration' | 'disableClickTrigger' | 'disableHoverTrigger' | 'skipDelayDuration' | 'disablePointerLeaveClose' | 'unmountOnHide'>, Pick<AccordionRootProps, 'disabled' | 'collapsible'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * Determines whether a "single" or "multiple" items can be selected at a time.
     *
     * Only works when `orientation` is `vertical`.
     * @defaultValue 'multiple'
     */
    type?: K;
    /**
     * The controlled value of the active item(s).
     * - In horizontal orientation: always `string`
     * - In vertical orientation with `type="single"`: `string`
     * - In vertical orientation with `type="multiple"`: `string[]`
     *
     * Use this when you need to control the state of the items. Can be binded with `v-model`
     */
    modelValue?: NavigationMenuModelValue<K, O>;
    /**
     * The default active value of the item(s).
     * - In horizontal orientation: always `string`
     * - In vertical orientation with `type="single"`: `string`
     * - In vertical orientation with `type="multiple"`: `string[]`
     *
     * Use when you do not need to control the state of the item(s).
     */
    defaultValue?: NavigationMenuModelValue<K, O>;
    /**
     * The icon displayed to open the menu.
     * @defaultValue appConfig.ui.icons.chevronDown
     * @IconifyIcon
     */
    trailingIcon?: IconProps['name'];
    /**
     * The icon displayed when the item is an external link.
     * Set to `false` to hide the external icon.
     * @defaultValue appConfig.ui.icons.external
     * @IconifyIcon
     */
    externalIcon?: boolean | IconProps['name'];
    items?: T;
    /**
     * @defaultValue 'primary'
     */
    color?: NavigationMenu['variants']['color'];
    /**
     * @defaultValue 'pill'
     */
    variant?: NavigationMenu['variants']['variant'];
    /**
     * The orientation of the menu.
     * @defaultValue 'horizontal'
     */
    orientation?: O;
    /**
     * Collapse the navigation menu to only show icons.
     * Only works when `orientation` is `vertical`.
     * @defaultValue false
     */
    collapsed?: boolean;
    /**
     * Display a tooltip on the items with the label of the item.
     * Only works when `orientation` is `vertical` and `collapsed` is `true`.
     * `{ delayDuration: 0, content: { side: 'right' } }`{lang="ts-type"}
     * @defaultValue false
     */
    tooltip?: boolean | TooltipProps;
    /**
     * Display a popover on the items when the menu is collapsed with the children list.
     * `{ mode: 'hover', content: { side: 'right', align: 'start', alignOffset: 2 } }`{lang="ts-type"}
     * @defaultValue false
     */
    popover?: boolean | PopoverProps;
    /** Display a line next to the active item. */
    highlight?: boolean;
    /**
     * @defaultValue 'primary'
     */
    highlightColor?: NavigationMenu['variants']['highlightColor'];
    /** The content of the menu. */
    content?: Omit<NavigationMenuContentProps, 'as' | 'asChild' | 'forceMount'> & Partial<EmitsToProps<NavigationMenuContentEmits>>;
    /**
     * The orientation of the content.
     * Only works when `orientation` is `horizontal`.
     * @defaultValue 'horizontal'
     */
    contentOrientation?: NavigationMenu['variants']['contentOrientation'];
    /**
     * Display an arrow alongside the menu.
     * @defaultValue false
     */
    arrow?: boolean;
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
    ui?: NavigationMenu['slots'];
}
export type NavigationMenuEmits<K extends SingleOrMultipleType = SingleOrMultipleType, O extends Orientation = Orientation> = {
    /**
     * Event handler called when the value changes.
     * - In horizontal orientation: emits `string`
     * - In vertical orientation with `type="single"`: emits `string | undefined`
     * - In vertical orientation with `type="multiple"`: emits `string[] | undefined`
     */
    'update:modelValue': [value: NavigationMenuModelValue<K, O> | undefined];
};
type SlotProps<T extends NavigationMenuItem> = (props: {
    item: T;
    index: number;
    active: boolean;
    ui: NavigationMenu['ui'];
}) => VNode[];
export type NavigationMenuSlots<A extends ArrayOrNested<NavigationMenuItem> = ArrayOrNested<NavigationMenuItem>, T extends NestedItem<A> = NestedItem<A>> = {
    'item'?: SlotProps<T>;
    'item-leading'?: SlotProps<T>;
    'item-label'?: (props: {
        item: T;
        index: number;
        active: boolean;
    }) => VNode[];
    'item-trailing'?: SlotProps<T>;
    'item-content'?: (props: {
        item: T;
        index: number;
        active: boolean;
        ui: NavigationMenu['ui'];
        close: (() => void) | undefined;
    }) => VNode[];
    'list-leading'?: (props?: {}) => VNode[];
    'list-trailing'?: (props?: {}) => VNode[];
} & DynamicSlots<MergeTypes<T>, 'label', {
    index: number;
    active: boolean;
    ui: NavigationMenu['ui'];
}> & DynamicSlots<MergeTypes<T>, 'leading' | 'trailing' | 'content', {
    index: number;
    active: boolean;
    ui: NavigationMenu['ui'];
}>;
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends ArrayOrNested<NavigationMenuItem>, K extends SingleOrMultipleType = SingleOrMultipleType, O extends Orientation = Orientation>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<NavigationMenuProps<T, K, O> & {
        "onUpdate:modelValue"?: ((value: NavigationMenuModelValue<K, O> | undefined) => any) | undefined;
    }> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: NavigationMenuSlots<T, NestedItem<T>>;
    emit: (evt: "update:modelValue", value: NavigationMenuModelValue<K, O> | undefined) => void;
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
