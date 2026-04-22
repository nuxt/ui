import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/pricing-table';
import type { PricingPlanProps } from '../types';
import type { ComponentConfig } from '../types/tv';
type PricingTable = ComponentConfig<typeof theme, AppConfig, 'pricingTable'>;
type DynamicSlots<T extends {
    id: string;
}, S extends string | undefined = undefined> = {
    [K in T['id'] as K extends string ? S extends string ? (K | `${K}-${S}`) : K : never]?: (props: {
        tier: Extract<T, {
            id: K extends `${infer Base}-${S}` ? Base : K;
        }>;
    }) => VNode[];
};
type FeatureDynamicSlots<T extends PricingTableSectionFeature, S extends string | undefined = undefined> = {
    [K in (T['id'] extends string ? T['id'] : string) as K extends string ? S extends string ? (`feature-${K}` | `feature-${K}-${S}`) : `feature-${K}` : never]?: (props: {
        feature: T;
        tier: PricingTableTier;
        section: PricingTableSection;
    }) => VNode[];
};
type SectionDynamicSlots<T extends PricingTableSection, S extends string | undefined = undefined> = {
    [K in (T['id'] extends string ? T['id'] : string) as K extends string ? S extends string ? (`section-${K}` | `section-${K}-${S}`) : `section-${K}` : never]?: (props: {
        section: T;
    }) => VNode[];
};
export type PricingTableTier = Pick<PricingPlanProps, 'title' | 'description' | 'badge' | 'billingCycle' | 'billingPeriod' | 'price' | 'discount' | 'button' | 'highlight'> & {
    id: string;
    [key: string]: any;
};
export type PricingTableSectionFeature<T extends PricingTableTier = PricingTableTier> = {
    id?: string;
    title: string;
    tiers?: {
        [K in Extract<T['id'], string>]: boolean | number | string;
    } & Record<string, boolean | number | string>;
};
export interface PricingTableSection<T extends PricingTableTier = PricingTableTier> {
    id?: string;
    title: string;
    features: PricingTableSectionFeature<T>[];
}
export interface PricingTableProps<T extends PricingTableTier = PricingTableTier> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * The caption to display above the table.
     * @defeaultValue t('pricingTable.caption')
     */
    caption?: string;
    /**
     * The pricing tiers to display in the table.
     * Each tier represents a pricing plan with its own title, description, price, and features.
     */
    tiers: T[];
    /**
     * The sections of features to display in the table.
     * Each section contains a title and a list of features with their availability in each tier.
     */
    sections: PricingTableSection<T>[];
    class?: any;
    ui?: PricingTable['slots'];
}
type SlotProps<T extends PricingTableTier> = (props: {
    tier: T;
}) => VNode[];
export type PricingTableSlots<T extends PricingTableTier = PricingTableTier> = {
    'caption'?: (props?: {}) => VNode[];
    'tier'?: SlotProps<T>;
    'tier-title'?: SlotProps<T>;
    'tier-description'?: SlotProps<T>;
    'tier-badge'?: SlotProps<T>;
    'tier-button'?: SlotProps<T>;
    'tier-billing'?: SlotProps<T>;
    'tier-discount'?: SlotProps<T>;
    'tier-price'?: SlotProps<T>;
    'section-title'?: (props: {
        section: PricingTableSection<T>;
    }) => VNode[];
    'feature-title'?: (props: {
        feature: PricingTableSectionFeature<T>;
        section: PricingTableSection<T>;
    }) => VNode[];
    'feature-value'?: (props: {
        feature: PricingTableSectionFeature<T>;
        tier: T;
        section: PricingTableSection<T>;
    }) => VNode[];
} & DynamicSlots<T, 'title' | 'description' | 'badge' | 'button' | 'billing' | 'discount' | 'price'> & FeatureDynamicSlots<PricingTableSectionFeature<T>, 'title' | 'value'> & SectionDynamicSlots<PricingTableSection<T>, 'title'>;
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: <T extends PricingTableTier>(__VLS_props: NonNullable<Awaited<typeof __VLS_setup>>["props"], __VLS_ctx?: __VLS_PrettifyLocal<Pick<NonNullable<Awaited<typeof __VLS_setup>>, "attrs" | "emit" | "slots">>, __VLS_exposed?: NonNullable<Awaited<typeof __VLS_setup>>["expose"], __VLS_setup?: Promise<{
    props: import("vue").PublicProps & __VLS_PrettifyLocal<PricingTableProps<T>> & (typeof globalThis extends {
        __VLS_PROPS_FALLBACK: infer P;
    } ? P : {});
    expose: (exposed: {}) => void;
    attrs: any;
    slots: PricingTableSlots<T>;
    emit: {};
}>) => import("vue").VNode & {
    __ctx?: Awaited<typeof __VLS_setup>;
};
type __VLS_PrettifyLocal<T> = (T extends any ? {
    [K in keyof T]: T[K];
} : {
    [K in keyof T as K]: T[K];
}) & {};
