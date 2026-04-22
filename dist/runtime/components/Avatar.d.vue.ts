import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/avatar';
import type { ChipProps, IconProps } from '../types';
import type { ImgHTMLAttributes } from '../types/html';
import type { ComponentConfig } from '../types/tv';
type Avatar = ComponentConfig<typeof theme, AppConfig, 'avatar'>;
export interface AvatarProps extends /** @vue-ignore */ Omit<ImgHTMLAttributes, 'src' | 'alt'> {
    /**
     * The element or component this component should render as.
     * @defaultValue 'span'
     */
    as?: any | {
        root?: any;
        img?: any;
    };
    src?: string;
    alt?: string;
    /**
     * @IconifyIcon
     */
    icon?: IconProps['name'];
    text?: string;
    /**
     * @defaultValue 'md'
     */
    size?: Avatar['variants']['size'];
    chip?: boolean | ChipProps;
    class?: any;
    style?: any;
    ui?: Avatar['slots'];
}
export interface AvatarSlots {
    default?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<AvatarProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<AvatarProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, {
    default?: (props: {}) => any;
}>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
