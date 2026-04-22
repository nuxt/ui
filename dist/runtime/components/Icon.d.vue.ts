import type { RuntimeOptions } from '@nuxt/icon';
export interface IconProps {
    name: string | any;
    mode?: 'svg' | 'css';
    size?: string | number;
    customize?: RuntimeOptions['customize'] | boolean | null;
}
declare const _default: typeof __VLS_export;
export default _default;
declare const __VLS_export: import("vue").DefineComponent<IconProps, {}, {}, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").PublicProps, Readonly<IconProps> & Readonly<{}>, {}, {}, {}, {}, string, import("vue").ComponentProvideOptions, false, {}, any>;
