import type { TooltipRootProps, TooltipRootEmits, TooltipContentProps, TooltipContentEmits, TooltipArrowProps, TooltipTriggerProps } from 'reka-ui';
import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/tooltip';
import type { KbdProps } from '../types';
import type { EmitsToProps } from '../types/utils';
import type { ComponentConfig } from '../types/tv';
type Tooltip = ComponentConfig<typeof theme, AppConfig, 'tooltip'>;
export interface TooltipProps extends TooltipRootProps {
    /** The text content of the tooltip. */
    text?: string;
    /** The keyboard keys to display in the tooltip. */
    kbds?: KbdProps['value'][] | KbdProps[];
    /**
     * The content of the tooltip.
     *
     * Inherits from the `tooltip.content` of the {@link AppProps} component when not provided.
     * @defaultValue { side: 'bottom', sideOffset: 8, collisionPadding: 8 }
     */
    content?: Omit<TooltipContentProps, 'as' | 'asChild'> & Partial<EmitsToProps<TooltipContentEmits>>;
    /**
     * Display an arrow alongside the tooltip.
     * `{ rounded: true }`{lang="ts-type"}
     * @defaultValue false
     */
    arrow?: boolean | Omit<TooltipArrowProps, 'as' | 'asChild'>;
    /**
     * Render the tooltip in a portal.
     * @defaultValue true
     */
    portal?: boolean | string | HTMLElement;
    /**
     * The reference (or anchor) element that is being referred to for positioning.
     *
     * If not provided will use the current component as anchor.
     */
    reference?: TooltipTriggerProps['reference'];
    class?: any;
    ui?: Tooltip['slots'];
}
export interface TooltipEmits extends TooltipRootEmits {
}
export interface TooltipSlots {
    default?(props: {
        open: boolean;
    }): VNode[];
    content?(props: {
        ui: Tooltip['ui'];
    }): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<TooltipProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {
    "update:open": (value: boolean) => any;
}, string, import("vue").PublicProps, Readonly<TooltipProps> & Readonly<{
    "onUpdate:open"?: ((value: boolean) => any) | undefined;
}>, {
    portal: boolean | string | HTMLElement;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, TooltipSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
