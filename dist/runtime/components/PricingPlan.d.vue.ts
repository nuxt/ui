import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/pricing-plan';
import type { BadgeProps, ButtonProps, IconProps } from '../types';
import type { ComponentConfig } from '../types/tv';
type PricingPlan = ComponentConfig<typeof theme, AppConfig, 'pricingPlan'>;
type PricingPlanFeature = {
    title: string;
    /**
     * @defaultValue appConfig.ui.icons.success
     * @IconifyIcon
     */
    icon?: IconProps['name'];
};
export interface PricingPlanProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    title?: string;
    description?: string;
    /**
     * Display a badge next to the title.
     * Can be a string or an object.
     * `{ color: 'primary', variant: 'subtle' }`{lang="ts-type"}
     */
    badge?: string | BadgeProps;
    /**
     * The unit price period that appears next to the price.
     * Typically used to show the recurring interval.
     * @example "/month", "/year", "/seat/month"
     */
    billingCycle?: string;
    /**
     * Additional billing context that appears above the billing cycle.
     * Typically used to show the actual billing frequency.
     * @example "billed annually", "billed monthly", "per user, billed annually"
     */
    billingPeriod?: string;
    /**
     * The current price of the plan.
     * When used with `discount`, this becomes the original price.
     * @example "$99", "€99", "Free"
     */
    price?: string;
    /**
     * The discounted price of the plan.
     * When provided, the `price` prop will be displayed as strikethrough.
     * @example "$79", "€79"
     */
    discount?: string;
    /**
     * Display a list of features under the price.
     * Can be an array of strings or an array of objects.
     */
    features?: string[] | PricingPlanFeature[];
    /**
     * Display a buy button at the bottom.
     * `{ size: 'lg', block: true }`{lang="ts-type"}
     * Use the `onClick` field to add a click handler.
     */
    button?: ButtonProps;
    /**
     * Display a tagline highlighting the pricing value proposition.
     * @example 'Pay once, own it forever'
     */
    tagline?: string;
    /**
     * Display terms at the bottom.
     * @example '14-day free trial'
     */
    terms?: string;
    /**
     * The orientation of the pricing plan.
     * @defaultValue 'vertical'
     */
    orientation?: PricingPlan['variants']['orientation'];
    /**
     * @defaultValue 'outline'
     */
    variant?: PricingPlan['variants']['variant'];
    /** Display a ring around the pricing plan to highlight it. */
    highlight?: boolean;
    /** Enlarge the plan to make it more prominent. */
    scale?: boolean;
    class?: any;
    ui?: PricingPlan['slots'];
}
export interface PricingPlanSlots {
    badge?(props: {
        ui: PricingPlan['ui'];
    }): VNode[];
    title?(props?: {}): VNode[];
    description?(props?: {}): VNode[];
    price?(props?: {}): VNode[];
    discount?(props?: {}): VNode[];
    billing?(props: {
        ui: PricingPlan['ui'];
    }): VNode[];
    features?(props?: {}): VNode[];
    button?(props: {
        ui: PricingPlan['ui'];
    }): VNode[];
    header?(props?: {}): VNode[];
    body?(props?: {}): VNode[];
    footer?(props?: {}): VNode[];
    tagline?(props?: {}): VNode[];
    terms?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<PricingPlanProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<PricingPlanProps> & Readonly<{}>, {
    orientation: PricingPlan["variants"]["orientation"];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, PricingPlanSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
