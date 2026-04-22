import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/prose/card';
import type { IconProps, LinkProps } from '../../types';
import type { ComponentConfig } from '../../types/tv';
type ProseCard = ComponentConfig<typeof theme, AppConfig, 'card', 'ui.prose'>;
export interface ProseCardProps {
    to?: LinkProps['to'];
    target?: LinkProps['target'];
    icon?: IconProps['name'];
    title?: string;
    description?: string;
    /**
     * @defaultValue 'primary'
     */
    color?: ProseCard['variants']['color'];
    class?: any;
    ui?: ProseCard['slots'];
}
export interface ProseCardSlots {
    default(props?: {}): VNode[];
    title(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<ProseCardProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<ProseCardProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, ProseCardSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
