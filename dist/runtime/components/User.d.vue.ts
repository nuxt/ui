import type { VNode } from 'vue';
import type { AppConfig } from '@nuxt/schema';
import theme from '#build/ui/user';
import type { AvatarProps, ChipProps, LinkProps } from '../types';
import type { ComponentConfig } from '../types/tv';
type User = ComponentConfig<typeof theme, AppConfig, 'user'>;
export interface UserProps {
    /**
     * The element or component this component should render as.
     * @defaultValue 'div'
     */
    as?: any;
    name?: string;
    description?: string;
    avatar?: Omit<AvatarProps, 'size'> & {
        [key: string]: any;
    };
    chip?: boolean | Omit<ChipProps, 'size' | 'inset'>;
    /**
     * @defaultValue 'md'
     */
    size?: User['variants']['size'];
    /**
     * The orientation of the user.
     * @defaultValue 'horizontal'
     */
    orientation?: User['variants']['orientation'];
    to?: LinkProps['to'];
    target?: LinkProps['target'];
    onClick?: (event: MouseEvent) => void | Promise<void>;
    class?: any;
    ui?: User['slots'];
}
export interface UserSlots {
    avatar?(props: {
        ui: User['ui'];
    }): VNode[];
    name?(props?: {}): VNode[];
    description?(props?: {}): VNode[];
    default?(props?: {}): VNode[];
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<UserProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<UserProps> & Readonly<{}>, {
    orientation: User["variants"]["orientation"];
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, UserSlots>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
