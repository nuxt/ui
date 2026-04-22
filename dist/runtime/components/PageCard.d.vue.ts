import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/page-card';
import type { IconProps, LinkProps } from '../types';
import type { ComponentConfig } from '../types/tv';
type PageCard = ComponentConfig<typeof theme, AppConfig, 'pageCard'>;
export interface PageCardProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    /**
     * The icon displayed above the title.
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    title?: string;
    description?: string;
    /**
     * The orientation of the page card.
     * @defaultValue 'vertical'
     */
    orientation?: PageCard['variants']['orientation'];
    /**
     * Reverse the order of the default slot.
     * @defaultValue false
     */
    reverse?: boolean;
    /**
     * Display a line around the page card.
     */
    highlight?: boolean;
    /**
     * @defaultValue 'primary'
     */
    highlightColor?: PageCard['variants']['highlightColor'];
    /**
     * Display a spotlight effect that follows your mouse cursor and highlights borders on hover.
     */
    spotlight?: boolean;
    /**
     * @defaultValue 'primary'
     */
    spotlightColor?: PageCard['variants']['spotlightColor'];
    /**
     * @defaultValue 'outline'
     */
    variant?: PageCard['variants']['variant'];
    to?: LinkProps['to'];
    target?: LinkProps['target'];
    onClick?: (event: MouseEvent) => void | Promise<void>;
    class?: any;
    ui?: PageCard['slots'];
}
export interface PageCardSlots {
    header?(props?: {}): VNode[];
    body?(props?: {}): VNode[];
    leading?(props: {
        ui: PageCard['ui'];
    }): VNode[];
    title?(props?: {}): VNode[];
    description?(props?: {}): VNode[];
    footer?(props?: {}): VNode[];
    default?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<PageCardProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<PageCardProps> & Readonly<{}>, {
    orientation: PageCard["variants"]["orientation"];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, PageCardSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
