import type { LinkProps } from '../../../types';
export interface LinkBaseProps {
    as?: string;
    type?: string;
    disabled?: boolean;
    onClick?: ((e: MouseEvent) => void | Promise<void>) | Array<((e: MouseEvent) => void | Promise<void>)>;
    href?: string;
    target?: LinkProps['target'];
    rel?: LinkProps['rel'];
    active?: boolean;
    isExternal?: boolean;
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: __VLS_WithSlots<import("vue").DefineComponent<LinkBaseProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<LinkBaseProps> & Readonly<{}>, {
    as: string;
    type: string;
}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>, {
    default?: (props: {}) => any;
} & {
    default?: (props: {}) => any;
}>;
type __VLS_WithSlots<T, S> = T & {
    new (): {
        $slots: S;
    };
};
