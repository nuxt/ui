import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/prose/callout';
import type { IconProps, LinkProps } from '../../types';
import type { ComponentConfig } from '../../types/tv';
type ProseCallout = ComponentConfig<typeof theme, AppConfig, 'callout', 'ui.prose'>;
export interface ProseCalloutProps {
    to?: LinkProps['to'];
    target?: LinkProps['target'];
    icon?: IconProps['name'];
    /**
     * @defaultValue 'neutral'
     */
    color?: ProseCallout['variants']['color'];
    class?: any;
    ui?: ProseCallout['slots'];
}
export interface ProseCalloutSlots {
    default(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProseCalloutProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProseCalloutProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProseCalloutSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
