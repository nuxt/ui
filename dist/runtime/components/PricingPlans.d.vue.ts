import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/pricing-plans';
import type { PricingPlanProps, PricingPlanSlots } from '../types';
import type { ComponentConfig } from '../types/tv';
type PricingPlans = ComponentConfig<typeof theme, AppConfig, 'pricingPlans'>;
export interface PricingPlansProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    plans?: PricingPlanProps[];
    /**
     * The orientation of the pricing plans.
     * @defaultValue 'horizontal'
     */
    orientation?: PricingPlans['variants']['orientation'];
    /**
     * When `true`, the plans will be displayed without gap.
     * @defaultValue false
     */
    compact?: boolean;
    /**
     * When `true`, the plans will be displayed with a larger gap.
     * Useful when one plan is scaled. Doesn't work with `compact`.
     * @defaultValue false
     */
    scale?: boolean;
    class?: any;
    ui?: {
        base?: any;
    };
}
type ExtendSlotWithPlan<T extends PricingPlanProps, K extends keyof PricingPlanSlots> = PricingPlanSlots[K] extends (props: infer P) => VNode[] ? (props: P & {
    plan: T;
}) => VNode[] : PricingPlanSlots[K];
export type PricingPlansSlots<T extends PricingPlanProps = PricingPlanProps> = {
    [K in keyof PricingPlanSlots]?: ExtendSlotWithPlan<T, K>;
} & {
    default?(props?: {}): VNode[];
};
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends PricingPlanProps>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<PricingPlansProps> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: PricingPlansSlots<T>;
    emit: {};
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
